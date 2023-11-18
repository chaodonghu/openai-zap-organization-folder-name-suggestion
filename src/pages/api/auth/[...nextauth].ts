import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOptions } from "@/server/next-search/auth";

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, getAuthOptions(req));
}
