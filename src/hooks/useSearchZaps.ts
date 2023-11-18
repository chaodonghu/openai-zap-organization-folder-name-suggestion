import { useState } from "react";
import type { Zap } from "../types";

const useSearchZaps = () => {
  const [zaps, setZaps] = useState<Zap[] | null>(null);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const searchZaps = async (query: string) => {
    setLoading(true);
    const response = await fetch("/api/next-search/search-zaps", {
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

    setZaps(success.zaps);
    setMatches(success.matches);
    setLoading(false);

    return success;
  };

  return { searchZaps, zaps, matches, loading };
};

export default useSearchZaps;
