import { css } from "@emotion/react";
import { useMemo } from "react";

import { Text } from "@zapier/design-system";
import { DateTime, RelativeTime } from "@zapier/date";
import type { Dateable } from "@zapier/date";
import { differenceInWeeks } from "date-fns";
import formatTimeSpanAbbreviatedLetter from "./formatTimeSpanAbbreviatedLetter";

const zapTimestampStyle = css`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

type ZapTimestampProps = {
  canShowDrafts?: boolean;
  createdAt?: Dateable;
  hasDraft?: boolean;
  /** Should we show bullet points before these items? */
  hasPreviousElements?: boolean;
  hasPublishedVersion?: boolean;
  lastDisabledAt?: Dateable;
  publishedAt?: Dateable;
  updatedAt?: Dateable;
  zapStatus?: string;
};

type Timestamp = Dateable | null;

const ZapTimestamp = ({
  canShowDrafts,
  createdAt,
  hasDraft,
  hasPublishedVersion,
  lastDisabledAt,
  publishedAt,
  updatedAt,
  zapStatus,
}: ZapTimestampProps) => {
  const timestamp = useMemo((): Timestamp => {
    // Draft flag is on AND workflow zap that only has a draft AND has never been published
    if (hasDraft && !hasPublishedVersion && createdAt) {
      return createdAt;
    }

    // Draft flag is on AND zap has been published AND is enabled/on
    if (
      canShowDrafts &&
      hasPublishedVersion &&
      zapStatus === "on" &&
      publishedAt
    ) {
      return publishedAt;
    }

    // Draft flag is on AND zap has been published AND is disabled/off
    if (
      canShowDrafts &&
      hasPublishedVersion &&
      zapStatus === "off" &&
      lastDisabledAt
    ) {
      return lastDisabledAt;
    }

    // Workflow Zaps
    if (updatedAt) {
      return updatedAt;
    }

    return null;
  }, [
    canShowDrafts,
    createdAt,
    hasDraft,
    hasPublishedVersion,
    lastDisabledAt,
    publishedAt,
    updatedAt,
    zapStatus,
  ]);

  return timestamp ? (
    <div css={zapTimestampStyle} data-testid="ZapTimestamp-root">
      <Text type="smallPrint1">
        {/* Show formatted date if timestamp > 4 weeks, else show relative timestamp */}
        {Math.abs(differenceInWeeks(Date.now(), timestamp as any)) > 4 ? (
          <DateTime date={timestamp} format="MMM DD, YYYY" />
        ) : (
          <RelativeTime
            date={timestamp}
            formatter={formatTimeSpanAbbreviatedLetter}
          />
        )}
      </Text>
    </div>
  ) : null;
};

export default ZapTimestamp;
