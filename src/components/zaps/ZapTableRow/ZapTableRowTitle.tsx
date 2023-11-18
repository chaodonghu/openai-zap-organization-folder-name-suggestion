import { css } from "@emotion/react";
import { Icon, Link, Text } from "@zapier/design-system";
import { Fragment } from "react";

const titleContainerStyle = css`
  padding: 10px 0 !important;
  width: auto;
`;

const folderNameStyle = css`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  -webkit-box-align: start;
  & span[class*="navFolderFill"] {
    padding-top: 2px !important;
  }
`;

interface Props {
  url?: string;
  title?: string | null;
  folderName?: string | null;
}

const ZapTableRowTitle = ({ url, title, folderName }: Props) => {
  return (
    <div css={titleContainerStyle}>
      <Link
        href={url}
        title={title ? `Edit Zap ${title}` : "Edit untitled Zap"}
      >
        <Text color="neutral800" tag="h3" type="smallPrint1Semibold">
          <Fragment>
            <span data-testid="ZapItem-title">{title || "Name your Zap"}</span>
          </Fragment>
        </Text>
      </Link>
      {folderName && (
        <span css={folderNameStyle}>
          <Text type="smallPrint1">
            <Icon size={14} name="navFolderFill" /> in {folderName}
          </Text>
        </span>
      )}
    </div>
  );
};

export default ZapTableRowTitle;
