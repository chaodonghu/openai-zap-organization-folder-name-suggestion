import { PLACEHOLDER_ICON } from "@/constants";
import type { Service, Zap } from "@/types";

const getGeneratedImageUrl = (selectedApi: string | undefined) => {
  if (!selectedApi) return PLACEHOLDER_ICON;
  return `https://zapier-staging.com/generated/${selectedApi}/64/`;
};

export const getServicesFromZap = (zap: Zap): Service[] => {
  const { draft, currentVersion } = zap;

  const anyZdl = currentVersion?.zdl || draft?.zdl;
  if (anyZdl) {
    // only return the first and last steps
    return [anyZdl.steps[0], anyZdl.steps[anyZdl.steps.length - 1]]
      .filter(Boolean)
      .map((step) => {
        return {
          name: step.app,
          src: getGeneratedImageUrl(step.app),
        };
      });
  }
  return [];
};
