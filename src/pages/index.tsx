import { type NextPage } from "next";
import { css } from "@emotion/react";
import Head from "next/head";
import { AuthRequired } from "../components/AuthRequired";
import { SyncSessionButton } from "../components/SyncSessionButton";
import { Button, Text } from "@zapier/design-system";

const rootStyle = css`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const buttonsStyles = css`
  margin: 30px 0;
  border-top: 1px solid #ccc;

  > div {
    display: flex;
    gap: 10px;
    flex-flow: row nowrap;
    padding: 20px 0;

    + div {
      border-top: 1px solid #ccc;
    }
  }
`;

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Sandbox</title>
      </Head>
      <AuthRequired>
        <div css={rootStyle}>
          <h1>Sandbox</h1>

          <Text>
            This project is a sandboxed environment for 2023 hack week. To get
            started, create a new page in `src/pages/sandboxes/` and add a link
            below.
          </Text>

          <div css={buttonsStyles}>
            <div>
              <Button href="/sandboxes/next-search">Go to NextSearch</Button>
              <Text>
                This is a fullstack NextJS implementation of Zap search using
                openai embeddings and pinecone.
              </Text>
            </div>
            <div>
              <Button href="/sandboxes/backend-search">
                Go to Backend Search
              </Button>
              <Text>
                This is a frontend NextJS implementation of Zap search using our
                new Org Service Backend Search Endpoint.
              </Text>
            </div>
            <div>
              <Button href="/sandboxes/zap-question">
                Go to Ask a Question
              </Button>
              <Text>
                Here you can ask AI a question about your Zaps.
              </Text>
            </div>
            <div>
              <Button href="/sandboxes/folder-suggestion">
                Go to Folder Name Suggestion
              </Button>
              <Text>
                This is a frontend NextJS implementation of folder name
                suggestions using openai embeddings and pinecone
              </Text>
            </div>
          </div>
          <SyncSessionButton />
        </div>
      </AuthRequired>
    </div>
  );
};

export default Home;
