import { type NextPage } from "next";
import { useState } from "react";
import type { MouseEvent } from "react";
import { css } from "@emotion/react";
import Head from "next/head";
import { AuthRequired } from "../../components/AuthRequired";
import { SyncSessionButton } from "../../components/SyncSessionButton";
import { ZapTable } from "../../components/zaps/ZapTable";
import { Button, Text } from "@zapier/design-system";
import useIndexZaps from "../../hooks/useIndexZaps";
import useSearchZaps from "../../hooks/useSearchZaps";
import useFindIndex from "../../hooks/useFindIndex";
import SearchForm from "../../components/SearchForm";

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

const embedBlockStyles = css`
  margin: 20px 0;
  p {
    margin-bottom: 10px !important;
  }
`;

const Search: NextPage = () => {
  const [indexReady, setIndexReady] = useState(false);

  const { hasIndex } = useFindIndex();

  const { indexZaps, loading: indexingLoading } = useIndexZaps();

  const onIndex = async (event: MouseEvent) => {
    event.preventDefault();
    await indexZaps()
      .then(() => setIndexReady(true))
      .catch((e) => console.error(e));
    return;
  };

  const { searchZaps, zaps, matches, loading: searchLoading } = useSearchZaps();

  const onSearch = async (query: string) => {
    await searchZaps(query);
    return;
  };

  const loading = searchLoading || indexingLoading;

  return (
    <div>
      <Head>
        <title>Zap Search</title>
      </Head>
      <AuthRequired>
        <div css={rootStyle}>
          <div css={headerStyles}>
            <h1>Zap Search</h1>
            <Text>
              This is a fullstack NextJS implementation of Zap search using
              openai embeddings and pinecone.
            </Text>
          </div>
          {loading && <p>Loading...</p>}
          {!hasIndex && !loading && (
            <div css={embedBlockStyles}>
              <Text tag="p">
                Zaps have not been indexed for the current account. Index Zaps
                to enable search. Clicking the button will download all Zaps for
                the current account (max 500), embed them via openai, and create
                a new index in pinecone.
              </Text>
              <Button type="button" color="secondary" onClick={onIndex}>
                Index account data
              </Button>
            </div>
          )}
          {hasIndex && !loading && (
            <SearchForm onSubmit={onSearch}>
              <div>
                {indexReady ? (
                  <p>Data indexed. ready to search.</p>
                ) : (
                  <Button type="button" color="secondary" onClick={onIndex}>
                    Re-index account data
                  </Button>
                )}
              </div>
            </SearchForm>
          )}

          {!loading && (
            <div>
              <ZapTable zaps={zaps || []} matches={matches || []} />
            </div>
          )}
          <SyncSessionButton />
        </div>
      </AuthRequired>
    </div>
  );
};

export default Search;
