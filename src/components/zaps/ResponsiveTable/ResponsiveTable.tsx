import { css } from "@emotion/react";
import type { ReactNode, ReactNodeArray } from "react";

interface ResponsiveTableProps {
  caption?: string;
  collapseBreakpoint: number;
  header: ReactNode;
  rows: ReactNodeArray;
}

const tableStyle = (collapseBreakpoint: number) => css`
  display: block;
  thead {
    display: none;
    th {
      display: none;
    }
  }
  tbody {
    display: flex;
    flex-direction: column;
  }
  tr {
    display: grid;
    td {
      text-align: left;
      display: flex;
    }
  }
  @media (min-width: ${collapseBreakpoint}px) {
    width: 100%;
    margin: 0;
    display: table;
    thead {
      display: table-header-group;
      th {
        display: table-cell;
      }
    }
    tbody {
      display: table-row-group;
      flex-direction: column;
    }
    tr {
      display: table-row;
      td {
        display: table-cell;
      }
    }
  }
`;

const ResponsiveTable = ({
  caption,
  collapseBreakpoint,
  header,
  rows,
}: ResponsiveTableProps) => (
  <table css={tableStyle(collapseBreakpoint)}>
    {caption && <caption>{caption}</caption>}
    <thead>{header}</thead>
    <tbody>{rows}</tbody>
  </table>
);

export default ResponsiveTable;
