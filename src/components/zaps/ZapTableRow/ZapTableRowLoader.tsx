import { css } from "@emotion/react";
import { Colors, SkeletonBlock, SkeletonLoader } from "@zapier/design-system";

const loaderRowStyle = css`
  margin-top: 10px;
  display: table-row;
`;

const desktopLoader = css`
  border-bottom: 1px solid ${Colors.neutral400};
  display: table-cell !important;
  height: 74px;
`;

const ZapTableRowLoader = () => (
  <tr css={loaderRowStyle}>
    <td colSpan={8} css={desktopLoader}>
      <SkeletonLoader>
        <SkeletonBlock height={74} borderRadius={0} />
      </SkeletonLoader>
    </td>
  </tr>
);

export default ZapTableRowLoader;
