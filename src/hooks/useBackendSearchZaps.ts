import { SEARCH_ROOT_URL } from "@/constants";
import { camelCaseKeysDeep } from "@/utils/changeKeysDeep";
import { useState } from "react";
import type { ScoredZap, SearchSource, SearchType } from "../types";

const useBackendSearchZaps = () => {
  const [zaps, setZaps] = useState<ScoredZap[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendSearchZaps = async (query: string, source: SearchSource, type: SearchType) => {
    setLoading(true);
    const response = await fetch(`${SEARCH_ROOT_URL}?search_term=${encodeURIComponent(query)}&storage_backend=${encodeURIComponent(source)}${type === "zdl" ? '&search_method=prompt' : ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    setLoading(false);
    if (!response.ok) {
      const error = await response.json();
      const errorText = response.headers.get("content-type")?.includes("application/json") ? error.detail : "Houston, we have a problem";
      setZaps(null);
      setError(errorText)
    } else {
      const success = await response.json();
      setZaps(camelCaseKeysDeep(success.zaps));
      setError(null);
      return success;
    }
    return;
  };

  return { backendSearchZaps, zaps, loading, error };
};

export default useBackendSearchZaps;
