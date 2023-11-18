import { type NextPage } from "next";
import { useState } from "react";
import { css } from "@emotion/react";
import Head from "next/head";
import { AuthRequired } from "../../components/AuthRequired";
import { SyncSessionButton } from "../../components/SyncSessionButton";
import { ZapTable } from "../../components/zaps/ZapTable";
import { Text } from "@zapier/design-system";
import type { Zap } from "../../types";
import useCategorizeZaps from "../../hooks/useCategorizeZaps";
import CategorizeForm from "../../components/CategorizeForm";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const rootStyle = css`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const headerStyles = css`
  margin-bottom: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const FolderSuggestion: NextPage = () => {
  const [query, setQuery] = useState<null | number>(null);
  const [error, setError] = useState<any>(null);

  const {
    categorizeZaps,
    loading: categorizeLoading,
    centroids,
    embeds,
    groupings,
  } = useCategorizeZaps();

  const onCategorize = async (query: string) => {
    await categorizeZaps(query)
      .then(() => setQuery(Number(query)))
      .catch((e) => {
        setError(e.message);
        console.error(e);
      });
    return;
  };

  const loading = categorizeLoading;

  return (
    <div>
      <Head>
        <title>Folder Suggestion</title>
      </Head>
      <AuthRequired>
        <div css={rootStyle}>
          <div css={headerStyles}>
            <h1>Folder Suggestion</h1>
            <Text>
              This is a fullstack NextJS implementation of folder name
              suggestion using openai embeddings and suggestions.
            </Text>
          </div>
          {loading && !error && <p>Loading...</p>}
          {!loading && (
            <CategorizeForm onSubmit={onCategorize}></CategorizeForm>
          )}
          {error && <div>{error}</div>}
          {embeds && centroids && !loading && (
            <Plot
              data={[
                {
                  x: embeds?.map(([x, _]) => x),
                  y: embeds?.map(([_, y]) => y),
                  type: "scatter",
                  mode: "markers",
                  marker: { color: "red" },
                  name: "2-d zap embedding",
                },
                {
                  type: "scatter",
                  mode: "text+markers",
                  x: centroids?.map(([x, _]) => x),
                  y: centroids?.map(([_, y]) => y),
                  name: "cluster centroid",
                  marker: { color: "green" },
                },
              ]}
              layout={{
                width: 500,
                height: 500,
                title: `Categorized Zap Embeddings into ${String(
                  query
                )} clusters`,
              }}
            />
          )}

          {!loading &&
            groupings?.map((zapGroup: any) => {
              return (
                <div key={zapGroup.folderName}>
                  <p>
                    <b>Suggested Folder Name:</b> {zapGroup.folderName}
                  </p>
                  <ZapTable zaps={(zapGroup.zapList as Zap[]) || []} />
                </div>
              );
            })}
          <SyncSessionButton />
        </div>
      </AuthRequired>
    </div>
  );
};

export default FolderSuggestion;
