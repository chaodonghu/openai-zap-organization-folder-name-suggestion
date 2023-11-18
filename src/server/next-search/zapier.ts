import { env } from "@/env.mjs";
import { camelCaseKeysDeep } from "../../utils/changeKeysDeep";
import type { Zap, ZapierSession } from "../../types";

export const zapierOrigin = (() => {
  const environment = env.NEXT_PUBLIC_VERCEL_ENV;
  if (environment === "development" || environment === "preview") {
    return "https://zapier-staging.com";
  }

  return "https://zapier.com";
})();

const _fetchZaps = async ({
  accountId,
  zapierSession,
  cursor,
  limit,
  ids,
  accZaps,
}: {
  zapierSession: ZapierSession;
  accountId: string | number;
  cursor?: string;
  limit: number;
  ids?: string[];
  accZaps?: any[];
}): Promise<any[]> => {
  const url = `${zapierOrigin}/api/gulliver/storage/v1/zaps?account_id=${encodeURIComponent(
    accountId
  )}&kind=workflow${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}${
    ids ? `&zap_ids=${encodeURIComponent(ids.join(","))}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // TODO: just use the oauth token? JWT?
      cookie: `zapsession=${zapierSession.zap_session}; csrftoken=${zapierSession.csrf_token}`,
      Referer: `${zapierOrigin}/app/zaps/`,
      "X-CSRFToken": zapierSession.csrf_token,
    },
  });

  const responseJson = await response.json();

  if (!response.ok) {
    console.error("Error getting zaps", responseJson);
    return [];
  }

  const zaps = [...(accZaps || []), ...camelCaseKeysDeep(responseJson.results)];

  if (zaps.length < limit && responseJson.cursor) {
    return _fetchZaps({
      accountId,
      zapierSession,
      cursor: responseJson.cursor,
      limit,
      accZaps: zaps,
    });
  }

  return zaps.slice(0, limit);
};

export async function getZaps({
  zapierSession,
  accountId,
  limit = 500,
  ids,
}: {
  zapierSession: ZapierSession;
  accountId: string | number;
  limit?: number;
  ids?: string[];
}): Promise<Zap[]> {
  try {
    const zaps = await _fetchZaps({
      zapierSession,
      accountId,
      limit: ids?.length || limit,
      ids,
    });
    return zaps;
  } catch (e) {
    console.error("Error getting zaps", e);
    return [];
  }
}
