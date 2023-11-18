import { css } from "@emotion/react";
import { ZAP_TABLE_BREAKPOINT } from "../../../constants";
import { MemoizedZapTableSkeletonLoader } from "../ZapTableRow/ZapTableRowSkeletonLoader";
import ResponsiveTable from "../ResponsiveTable/ResponsiveTable";

const rootStyle = css`
  flex: 1 1 auto;
`;

const ZapTableLoading = () => {
  return (
    <div css={rootStyle}>
      <ResponsiveTable
        collapseBreakpoint={ZAP_TABLE_BREAKPOINT}
        header={null}
        rows={[...Array(5)].map((_, index) => {
          return <MemoizedZapTableSkeletonLoader key={index} />;
        })}
      />
    </div>
  );
};

export default ZapTableLoading;
