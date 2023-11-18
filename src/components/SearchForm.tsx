import { css } from "@emotion/react";
import {
  Button,
  Colors,
  FormLabel,
  Radio,
  TextInput,
  Typography,
  Text,
} from "@zapier/design-system";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import type { SearchSource, SearchType } from "@/types";

const formStyles = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 50px 0;
`;

const searchInputStyle = css`
  gap: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  > label {
    ${Typography.subHeader3Medium}
  }
`;

const fieldsetStyle = css`
  border: 1px solid ${Colors.neutral400};
  padding: 5px 15px 15px;
  border-radius: 5px;
  > legend {
    ${Typography.smallPrint1Semibold}
    padding: 5px;
  }
`;

interface Props {
  searchQuery?: string;
  onSubmit: (
    query: string,
    searchType: SearchType,
    searchSource: SearchSource
  ) => void;
  children?: ReactNode;
}

const SearchForm = ({ onSubmit, searchQuery, children }: Props) => {
  const [query, setQuery] = useState(searchQuery || "");
  const [searchType, setSearchType] = useState("plain");
  const [searchSource, setSearchSource] = useState<SearchSource>("redis");

  const onChangeSourceRadio = (event: React.ChangeEvent<any>) => {
    setSearchSource(event.target.value as SearchSource);
  };

  const onChangeTypeRadio = (event: React.ChangeEvent<any>) => {
    setSearchType(event.target.value as SearchType);
  };

  return (
    <form
      css={formStyles}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query, searchType as SearchType, searchSource);
      }}
    >
      <div css={searchInputStyle}>
        <FormLabel>
          <Fragment>
            <Text type="subHeader3">Search</Text>
            <TextInput
              type="text"
              placeholder="Search for a zap"
              onChange={(event) => setQuery((event.target as any).value)}
              value={query}
            />
          </Fragment>
        </FormLabel>

        <Button iconBefore="magnifyingGlass" type="submit">
          Search with AI
        </Button>
      </div>
      <fieldset css={fieldsetStyle}>
        <legend>Select search type</legend>
        <FormLabel isSelected={searchType === "plain"}>
          <Radio
            checked={searchType === "plain"}
            name="searchType"
            onChange={onChangeTypeRadio}
            value="plain"
          />
          Plain search term
        </FormLabel>
        <FormLabel isSelected={searchType === "zdl"}>
          <Radio
            checked={searchType === "zdl"}
            name="searchType"
            onChange={onChangeTypeRadio}
            value="zdl"
          />
          Convert search term to ZDL
        </FormLabel>
      </fieldset>

      <fieldset css={fieldsetStyle}>
        <legend>Select search source</legend>
        <FormLabel isSelected={searchSource === "redis"}>
          <Radio
            checked={searchSource === "redis"}
            name="searchSource"
            onChange={onChangeSourceRadio}
            value="redis"
          />
          Redis
        </FormLabel>
        <FormLabel isSelected={searchSource === "pinecone"}>
          <Radio
            checked={searchSource === "pinecone"}
            name="searchSource"
            onChange={onChangeSourceRadio}
            value="pinecone"
          />
          Pinecone
        </FormLabel>
      </fieldset>
      {children}
    </form>
  );
};

export default SearchForm;
