import { css } from "@emotion/react";
import {
  Button,
  FormLabel,
  TextInput,
  Typography,
  Text,
} from "@zapier/design-system";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";

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

interface Props {
  searchQuery?: string;
  onSubmit: (query: string) => void;
  children?: ReactNode;
}

const SearchForm = ({ onSubmit, searchQuery, children }: Props) => {
  const [query, setQuery] = useState(searchQuery || "");

  return (
    <form
      css={formStyles}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query);
      }}
    >
      <div css={searchInputStyle}>
        <FormLabel>
          <Fragment>
            <Text type="subHeader3">Categorize</Text>
            <TextInput
              // @ts-ignore
              type="number"
              placeholder="# of categories"
              onChange={(event) => setQuery((event.target as any).value)}
              value={query}
            />
          </Fragment>
        </FormLabel>

        <Button iconBefore="magnifyingGlass" type="submit">
          Categorize with AI
        </Button>
      </div>
      {children}
    </form>
  );
};

export default SearchForm;
