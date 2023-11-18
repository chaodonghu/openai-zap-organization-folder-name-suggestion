import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { searchZaps } from "../../../server/next-search/pinecone";
import { getZaps } from "../../../server/next-search/zapier";

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "No token present" });
  }

  try {
    console.log("Searching for results for: ", req.body.query);

    const searchResults = await searchZaps({
      accountId: token.current_account_id,
      query: req.body.query,
    });

    console.log("✅ Retrieved results");

    const zaps = await getZaps({
      zapierSession: token.zapier_internal,
      accountId: token.current_account_id,
      ids: (searchResults || []).map((result) => result.id),
    });

    // Sort the Zaps by match score
    const idsByScore = searchResults?.map(({ id }) => id);
    const orderedZaps = idsByScore?.map((id) =>
      zaps.find((zap) => zap.id === id)
    );

    console.log(`✅ Retrieved ${zaps.length} matching zaps`);

    return res.status(200).json({ zaps: orderedZaps, matches: searchResults });
  } catch (e) {
    return res.status(500).json({
      error:
        'Something went wrong. Try clicking the "Sync with Zapier Session" button on the top right and trying again.',
    });
  }
}
