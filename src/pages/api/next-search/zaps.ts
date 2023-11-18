import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getZaps } from "../../../server/next-search/zapier";

export default async function zaps(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "No token present" });
  }

  try {
    const zaps = await getZaps({
      zapierSession: token.zapier_internal,
      accountId: token.current_account_id,
    });

    return res.status(200).json(zaps);
  } catch (e) {
    return res.status(500).json({
      error:
        'Something went wrong. Try clicking the "Sync with Zapier Session" button on the top right and trying again.',
    });
  }
}
