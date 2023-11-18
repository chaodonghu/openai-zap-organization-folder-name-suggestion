import { AuthRequired } from "@/components/AuthRequired"
import { SyncSessionButton } from "@/components/SyncSessionButton";
import { ZapCard } from "@/components/zaps/ZapCard";
import useZapQuestion from "@/hooks/useZapQuestion";
import { css } from "@emotion/react";
import { Field, TextInput, Text, Button } from "@zapier/design-system";
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const rootStyle = css`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const formStyle = css`
  padding: 30px 0;
`;

const searchResultsStyle = css`
  margin: 0;
  padding: 0;
`;

const resultsStyle = css`
display: flex;
flex-direction: column;
gap: 30px;`;

const Question: NextPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {
    askZapQuestion,
    answer,
    zaps,
    loading,
    error
  } = useZapQuestion(searchQuery);

  const onSearch = async (e: any) => {
    e.preventDefault();
    router.query.search = searchQuery;
    await router.push({ href: router.route, query: router.query }, undefined, { shallow: true });
  }

  useEffect(() => {
    const search = router.query.search;
    if (search && typeof search === 'string') {
      askZapQuestion(search).catch((e) => console.error(e));
      setSearchQuery(search);
    }
  }, [router.query.search])


  return (
    <div>
      <Head>
        <title> AI Zap Search</title>
      </Head>
      <AuthRequired>
        <div css={rootStyle}>
          <Text tag="h1" type="pageHeader5">Ask AI a question about your Zaps.</Text>
          <form css={formStyle} onSubmit={onSearch}>
            <Field
              label="Ask a question about your Zaps"
              renderInput={(inputProps) => (
                <TextInput
                  {...inputProps}
                  isMultiline={true}
                  resize="both"
                  placeholder="e.g. 'How many Zaps use Slack as an app?'"
                  onChange={(e: any) => { setSearchQuery(e.target.value) }}
                  value={searchQuery}
                />
              )} />
            <Button type="submit">Ask</Button>
          </form>
          {loading && <p>Loading...</p>}
          {!loading && (
            <div css={resultsStyle}>
              {error && <Text tag="p">{error} 😡</Text>}
              {answer && (
                <section>
                  <Text tag="h2" type="sectionHeader3Semibold">{`AI's answer:`}</Text>
                  <p>{answer}</p>
                </section>
              )}
              {!!zaps?.length && (
                <section>
                  <Text tag="h2" type="sectionHeader3Semibold">Matching Zaps</Text>
                  <ul css={searchResultsStyle}>
                    {zaps.map(({ id, owner, nodes, score, title }) => <ZapCard key={id} {...{ id, owner, nodes, title, score }} />)}
                  </ul>
                </section>
              )}
            </div>
          )}
          <SyncSessionButton />
        </div>
      </AuthRequired >

    </div>
  )
};

export default Question;