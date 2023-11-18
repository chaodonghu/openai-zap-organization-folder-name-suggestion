import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getZaps } from "../../../server/next-search/zapier";
import { generateZapEmbeddings } from "../../../server/next-search/openai";
import { indexEmbeddings } from "../../../server/next-search/pinecone";

export default async function indexZaps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "No token present" });
  }

  const accountId = token.current_account_id;

  try {
    // Fetch all zaps for the account
    const zaps = await getZaps({
      zapierSession: token.zapier_internal,
      accountId,
      limit: 500, // can bump this up if needed but it will be slow
    });

    console.log(`✅ Fetched ${zaps.length} zaps`);

    // Embed all zaps
    const embeddings = await generateZapEmbeddings(zaps);

    console.log("✅ Generated embeddings");

    await indexEmbeddings({ accountId, embeddings });

    console.log("✅ Indexed embeddings");

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({
      error:
        'Something went wrong. Try clicking the "Sync with Zapier Session" button on the top right and trying again.',
    });
  }
}
