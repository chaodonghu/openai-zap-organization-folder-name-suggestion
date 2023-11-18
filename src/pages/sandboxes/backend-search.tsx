import { type NextPage } from "next";
import { css } from "@emotion/react";
import Head from "next/head";
import { AuthRequired } from "../../components/AuthRequired";
import { SyncSessionButton } from "../../components/SyncSessionButton";
import { Colors, Text } from "@zapier/design-system";
import SearchForm from "../../components/SearchForm";
import useBackendSearchZaps from "../../hooks/useBackendSearchZaps";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ZapCard } from "@/components/zaps/ZapCard";
import type { SearchSource, SearchType } from "@/types";

const rootStyle = css`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const headerStyles = css`
  margin-bottom: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${Colors.neutral300};
`;

const embedBlockStyles = css`
  margin: 20px 0;
  p {
    margin-bottom: 10px !important;
  }
`;

const searchResultsStyle = css`
  margin: 0;
  padding: 0;
`;

const Search: NextPage = () => {
  const router = useRouter();
  const { backendSearchZaps, zaps, loading, error } = useBackendSearchZaps();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const onSearch = async (query: string, searchType: SearchType, searchSource: SearchSource) => {
    router.query.search = query;
    router.query.source = searchSource;
    router.query.type = searchType;

    await router.push({ href: router.route, query: router.query }, undefined, { shallow: true });
  };

  useEffect(() => {
    const search = router.query.search;
    if (search && typeof search === 'string') {
      backendSearchZaps(search, router.query.source as SearchSource, router.query.type as SearchType).catch((e) => console.error(e));
      setSearchQuery(search);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.search, router.query.source, router.query.type])

  return (
    <div>
      <Head>
        <title>AI Zap Search</title>
      </Head>
      <AuthRequired>
        <div css={rootStyle}>
          <div css={headerStyles}>
            <Text tag="h1" type="pageHeader5">AI Question</Text>
            <Text tag="p">
              This is a NextJS frontend for the new backend Search endpoint. 😎
            </Text>
          </div>
          {loading && <p>Loading...</p>}
          {!loading && (
            <div>
              <div css={embedBlockStyles}>
                <SearchForm searchQuery={searchQuery} onSubmit={onSearch} />
              </div>
              {!!zaps?.length && (
                <section>
                  <Text tag="h2" type="sectionHeader3Semibold">{`Search results for "${searchQuery}"`}</Text>
                  <ul css={searchResultsStyle}>
                    {zaps.map(({ id, owner, nodes, score, title }) => <ZapCard key={id} {...{ id, owner, nodes, title, score }} />)}
                  </ul>
                </section>
              )}
              {zaps && !zaps.length && (
                <Text tag="p">{`No results for "${searchQuery}" 😢`}</Text>
              )}
              {error && <Text tag="p">{error} 😡</Text>}
            </div>
          )}

          <SyncSessionButton />
        </div>
      </AuthRequired>
    </div>
  );
};

export default Search;
