import { formatTimeSpan } from "@zapier/date";
import type { Dateable, TimeSpanFormatter } from "@zapier/date";

const formatTimeSpanAbbreviatedLetter: TimeSpanFormatter = (
  endDate: Dateable,
  startDate: Dateable,
  addSuffix?: boolean
) => {
  const formattedTimeSpan = formatTimeSpan(endDate, startDate, addSuffix);
  if (formattedTimeSpan.includes("second")) {
    return "Just now";
  }
  return formattedTimeSpan
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" weeks", "w")
    .replace(" week", "w");
};

export default formatTimeSpanAbbreviatedLetter;
