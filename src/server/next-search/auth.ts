import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { z } from "zod";
import { env } from "@/env.mjs";
import { zapierOrigin } from "./zapier";

const ZapierSessionApiResponse = z.object({
  id: z.number(),
  email: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  photo_url: z.string().min(1),
  is_staff: z.boolean(),
  current_account_id: z.number(),
});

/**
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    sso_hint?: string;
    status: "unknown" | "valid" | "invalid";
  }

  interface Account {
    zapier_internal: {
      zap_session: string;
      csrf_token: string;
      sso_hint: string;
    };
  }

  interface User {
    is_staff: boolean;
    current_account_id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    is_staff: boolean;
    current_account_id: number;
    zapier_internal: {
      zap_session: string;
      csrf_token: string;
      sso_hint: string;
    };
  }
}

const isPreviewEnvironment = env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export function getAuthOptions(
  req: NextApiRequest | GetServerSidePropsContext["req"]
): NextAuthOptions {
  return {
    providers: [
      // See:
      // https://engineering.zapier.com/guides/authentication-and-identity/single-sign-on/oauth/
      {
        id: "zapier",
        name: "Zapier",
        type: "oauth",
        authorization: {
          url: isPreviewEnvironment
            ? `https://zapier-oauth-relay.vercel.zapier-deployment.com/api/authorize`
            : `${zapierOrigin}/oauth/authorize/`,
          params: {
            scope: "internal:session",
          },
        },
        token: isPreviewEnvironment
          ? "https://zapier-oauth-relay.vercel.zapier-deployment.com/api/token"
          : `${zapierOrigin}/oauth/token/`,

        clientId: env.ZAPIER_OAUTH_CLIENT_ID,
        clientSecret: env.ZAPIER_OAUTH_CLIENT_SECRET,
        userinfo: {
          async request({ tokens }) {
            if (!tokens.zapier_internal) {
              throw new Error("No Zapier session found in token response.");
            }

            const sessionResponse = await fetch(
              `${zapierOrigin}/api/v4/session/`,
              {
                headers: {
                  // There's not an easy way to extend the next-auth `TokenSet` type.
                  // @ts-ignore
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  cookie: `zapsession=${tokens.zapier_internal.zap_session}`,
                },
              }
            );

            const session = ZapierSessionApiResponse.parse(
              await sessionResponse.json()
            );

            return {
              id: String(session.id),
              email: session.email,
              name: `${session.first_name} ${session.last_name}`,
              image: session.photo_url,
              is_staff: session.is_staff,
              current_account_id: session.current_account_id,
            };
          },
        },
        profile(profile) {
          return profile;
        },
      },
      /**
       * ...add more providers here.
       * @see https://next-auth.js.org/providers/github
       */
    ],
    callbacks: {
      jwt({ token, account, user }) {
        if (account && account.zapier_internal) {
          token.zapier_internal = account.zapier_internal;
          token.use_sso_hint = false;
          if (req.cookies.ssohint && env.ZAPIER_OAUTH_USE_SSO_HINT === "true") {
            token.use_sso_hint = true;
          }
        }

        if (user) {
          token.is_staff = user.is_staff;
          token.id = user.id;
          token.current_account_id = user.current_account_id;
        }

        return token;
      },
      session({ session, token }) {
        session.sso_hint = token.zapier_internal.sso_hint;
        session.status = "unknown";

        if (token.use_sso_hint) {
          session.status = "valid";
          if (token.zapier_internal.sso_hint !== req.cookies.ssohint) {
            session.status = "invalid";
          }
        }

        return session;
      },
    },
  };
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 * Works for both `getServerSideProps` and API routes.
 *
 * Example `getServerSideProps`:
 * ```
 * export async function getServerSideProps(context) {
 *   return {
 *     props: {
 *       session: await getServerAuthSession({
 *         req: context.req,
 *         res: context.res
 *       }),
 *     },
 *   }
 * }
 * ```
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (
  ctx:
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
    | {
        req: GetServerSidePropsContext["req"];
        res: GetServerSidePropsContext["res"];
      }
) => {
  return getServerSession(ctx.req, ctx.res, getAuthOptions(ctx.req));
};
