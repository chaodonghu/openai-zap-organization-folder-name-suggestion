import { Colors } from "@zapier/design-system";
import ZapTableRowServices from "./ZapTableRowServices";
import ZapTableRowTitle from "./ZapTableRowTitle";
import type { ZapStatus } from "../../../types";
import ZapTimestamp from "../ZapTimestamp/ZapTimestamp";
import { css } from "@emotion/react";

interface ZapTableRowProps {
  createdAt?: string;
  folderName?: string | null;
  hasPublishedVersion?: boolean;
  id: string;
  lastDisabledAt?: string;
  publishedAt?: string;
  services: any[];
  serviceTooltipContent?: string;
  title?: string | null;
  updatedAt?: string;
  zapStatus: ZapStatus;
}

const tableRowStyle = css`
  display: flex !important;
  align-items: center;
  margin: 0;
  height: 50px;
  border-top: 1px solid ${Colors.neutral400};

  td {
    display: table-cell !important;
    padding: 0 10px 0 20px;
  }
`;

const servicesStyle = css`
  width: 135px;
  flex: 0 0 135px;
`;

const titleStyle = css`
  flex: 1 1 auto;
  min-width: 0;
  word-break: break-word;
  padding-right: 25px;
  display: flex;
  flex-direction: column;
  margin: 0;
  white-space: nowrap;
  width: 1px;
  a {
    text-decoration-color: transparent !important;
    transition: all 0.2s !important;
    &:hover,
    &:focus {
      text-decoration-color: transparent !important;

      h3 {
        color: ${Colors.blue} !important;
        text-decoration-color: ${Colors.blue} !important;
        transition: text-decoration-color 0.1s 0.2s, color 0.2s !important;
      }
    }
    h3 {
      text-decoration: underline !important;
      text-decoration-color: transparent !important;
      transition: text-decoration-color 0.1s 0.2s, color 0.2s !important;
    }
  }
`;

const timestampStyle = css`
  width: 100px;
  white-space: nowrap;
  flex: 0 0 100px;
  > div time {
    font-weight: normal;
  }
`;

const ZapTableRow = ({
  createdAt,
  folderName,
  hasPublishedVersion,
  lastDisabledAt,
  publishedAt,
  services,
  title,
  updatedAt,
  zapStatus,
  id,
}: ZapTableRowProps) => {
  const editorUrl = `${
    process.env.NEXT_PUBLIC_ZAPIER_ORIGIN || ""
  }/webintent/edit-zap/${id}`;

  return (
    <div css={tableRowStyle}>
      <div css={servicesStyle}>
        <ZapTableRowServices services={services} />
      </div>
      <div css={titleStyle}>
        <ZapTableRowTitle
          title={title}
          folderName={folderName}
          url={editorUrl}
        />
      </div>
      <div css={timestampStyle}>
        <ZapTimestamp
          createdAt={createdAt}
          hasPublishedVersion={hasPublishedVersion}
          lastDisabledAt={lastDisabledAt}
          publishedAt={publishedAt}
          updatedAt={updatedAt}
          zapStatus={zapStatus}
        />
      </div>
    </div>
  );
};

export default ZapTableRow;
