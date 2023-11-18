import { useState } from "react";
import type { Groupings } from "../pages/api/folder-suggestion/types";

const useCategorizeZaps = () => {
  const [loading, setLoading] = useState(false);
  const [centroids, setCentroids] = useState<any[] | null>(null);
  const [embeds, setEmbeds] = useState<any[] | null>(null);
  const [groupings, setGroupings] = useState<Groupings[] | null>(null);
  const categorizeZaps = async (query: string) => {
    setLoading(true);
    const response = await fetch("/api/folder-suggestion/categorize-zaps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      const errorMessage = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? ((await response.json()).error as string)
        : 'Try clicking the "Sync with Zapier Session" button on the top right and trying again.';

      throw new Error(errorMessage);
    }

    const success = await response.json();

    setCentroids(success.centroids);
    setEmbeds(success.embeds);
    setGroupings(success.groupingResults);
    setLoading(false);

    return success;
  };

  return { categorizeZaps, centroids, loading, embeds, groupings };
};

export default useCategorizeZaps;
