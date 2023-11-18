# Zap Management Search

This is a sandbox to experiment with AI-powered search for the 2023 Q2 Hackweek. Folks working on this project can be found in [#hackweek-zap-search](https://zapier.slack.com/archives/C050TH2HGJZ). This repository includes a NextJS full stack application that deploys to Vercel.

## Getting Started

```javascript
1. yarn // install all of the dependencies
2. cp .env.example .env
3. // update the .env file to include all env vars
4. yarn dev
5. // navigate to http://localhost:3000 for a sandbox project landing page
```

## Contributing

Want to get started with some search-related AI experiments of your own? Feel free to use this app as a sandbox to play around in.

1. Follow the **Getting Started** steps above
1. Add a new page to `src/pages/sandboxes/` (see [NextJS Routing](https://nextjs.org/docs/routing/introduction))
1. Add a link to your page in `src/pages/index.ts`
1. Add new API routes related to your experiment in `src/pages/api` (see [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction))
1. Share some info about your project in the [hackweek Coda page here](https://coda.io/d/Zapier-AI-HackWeek-Q223-4-10-4-14_dT_s4UyIe1q/NextJS-Sandbox_sua8h#_lu-Yn).

### Sandboxes

**Next Search**
This is a fullstack NextJS implementation of Zap search using OpenAI embeddings and Pinecone. See writeup on how it works in Coda here: https://coda.io/d/Zapier-AI-HackWeek-Q223-4-10-4-14_dT_s4UyIe1q/NextJS-Sandbox_sua8h#_luFDL

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [openai](https://platform.openai.com/docs/api-reference)
- [pinecone](https://www.pinecone.io/)

### Auth

Set up with NextAuth as a Zapier Oauth app and shares auth with https://zapier-staging.com. If you are logged in on zapier-staging then that session will be shared in local development here and in Vercel preview environments for merge requests.

For examples of how to fetch data from z/z endpoints, check out `src/server/zapier.ts` [here](https://gitlab.com/zapier/team-manage/zap-management-search/-/blob/main/src/server/zapier.ts).

## Deployment

This project ([zap-management-search](https://vercel.com/zapier/zap-management-search)) is automtically deployed to Vercel.

- [Vercel project](https://vercel.com/zapier/zap-management-search)
- Production - not enabled yet, need valid oauth keys

### Previews

To deploy a separate preview environment. Create and push changes to a new branch.

### Production deployment

Any changes merged into `main` will automatically be dedployed to the production instance.
