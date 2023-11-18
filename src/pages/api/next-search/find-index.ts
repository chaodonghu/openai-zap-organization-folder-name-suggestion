import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { findIndex } from "../../../server/next-search/pinecone";

export default async function find(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "No token present" });
  }

  const accountId = token.current_account_id;

  try {
    const hasIndex = await findIndex({
      accountId,
    });

    return res.status(200).json({ hasIndex });
  } catch (e) {
    return res.status(500).json({
      error:
        'Something went wrong. Try clicking the "Sync with Zapier Session" button on the top right and trying again.',
    });
  }
}
