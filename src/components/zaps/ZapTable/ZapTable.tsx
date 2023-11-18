import { css } from "@emotion/react";
import ZapTableLoading from "./ZapTableLoading";
import ResponsiveTable from "../ResponsiveTable/ResponsiveTable";
import { ZAP_TABLE_BREAKPOINT } from "@/constants";
import type { Zap as ZapType } from "@/types";
import ZapTableRow from "../ZapTableRow/ZapTableRow";
import { getServicesFromZap } from "../../../utils/getServicesFromZap";
import { Text } from "@zapier/design-system";
import { Fragment } from "react";

interface ZapTableProps {
  zaps?: ZapType[];
  matches?: any[];
  isLoading?: boolean;
}

const zapTableContainerStyle = css`
  margin-bottom: 40px;
`;

const ZapTable = ({ zaps, matches, isLoading = false }: ZapTableProps) => {
  return (
    <div css={zapTableContainerStyle}>
      {isLoading && <ZapTableLoading />}

      {zaps?.length && !isLoading ? (
        <ResponsiveTable
          collapseBreakpoint={ZAP_TABLE_BREAKPOINT}
          header={null}
          rows={zaps.map((zap) => {
            const services = getServicesFromZap(zap);
            const match = matches?.find(({ id }) => id === zap.id);

            return (
              <Fragment key={zap.id}>
                <ZapTableRow
                  createdAt={zap.createdAt}
                  folderName={""}
                  hasPublishedVersion={!!zap.currentVersion}
                  id={zap.id}
                  lastDisabledAt={zap.lastDisabledAt || undefined}
                  publishedAt={zap?.currentVersion?.zdl?.publishedAt}
                  services={services}
                  serviceTooltipContent={""}
                  title={zap.title}
                  updatedAt={zap.updatedAt}
                  zapStatus={zap.isEnabled ? "on" : "off"}
                />
                <div>
                  <div>
                    <Text type="smallPrint3">Zap Id: {zap.id}</Text>
                    {match && (
                      <Text type="smallPrint3">Score: {match?.score || 0}</Text>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
        />
      ) : null}
    </div>
  );
};

export default ZapTable;
