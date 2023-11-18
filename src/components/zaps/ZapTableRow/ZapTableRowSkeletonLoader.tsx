import { css } from "@emotion/react";
import { Colors, SkeletonBlock, Spacer } from "@zapier/design-system";
import { memo } from "react";

const rootStyles = css`
  border: 1px solid ${Colors.neutral400};
  border-radius: 5px;
  display: grid;
  align-items: center;
  padding: 15px;
  margin: 10px 0 0;
  grid-template-columns: 45px 125px 1fr 1fr 85px 40px;
  grid-template-areas:
    "checkbox services title title toggle menu"
    ". owner owner owner owner owner"
    ". edited edited status status status";
  height: 74px;
  td > div {
    flex: 1 1 100%;
  }
  td {
    padding: 0 5px;
  }
`;

const checkboxStyles = css`
  grid-area: checkbox;
  width: 45px !important;
`;

const serviceIconsStyles = css`
  grid-area: services;
  width: 10% !important;
  > div {
    display: flex;
  }
`;

const titleStyles = css`
  grid-area: title;
  width: 100% !important;
  padding-right: 20px;
  > div {
    width: 100%;
  }
`;

const statusStyles = css`
  grid-area: status;
  width: 15% !important;
`;

const editedStyles = css`
  grid-area: edited;
  width: 15% !important;
`;

const toggleStyles = css`
  grid-area: toggle;
  width: 50px !important;
`;

const menuStyles = css`
  grid-area: menu;
  width: 50px !important;
`;

const ZapTableRowSkeletonLoader = () => {
  return (
    <tr css={rootStyles}>
      <td css={checkboxStyles}>
        <SkeletonBlock height={18} width={18} />
      </td>
      <td css={serviceIconsStyles}>
        <div>
          <SkeletonBlock height={30} width={30} />
          <Spacer width={5} />
          <SkeletonBlock height={30} width={30} />
        </div>
      </td>
      <td css={titleStyles}>
        <SkeletonBlock height={30} width="100%" />
      </td>
      <td css={statusStyles}>
        <SkeletonBlock height={30} width="100%" />
      </td>
      <td css={editedStyles}>
        <SkeletonBlock height={30} width="100%" />
      </td>
      <td css={toggleStyles}>
        <SkeletonBlock height={44} width={82} />
      </td>
      <td css={menuStyles}>
        <SkeletonBlock height={18} width="100%" />
      </td>
    </tr>
  );
};

export const MemoizedZapTableSkeletonLoader = memo(ZapTableRowSkeletonLoader);
