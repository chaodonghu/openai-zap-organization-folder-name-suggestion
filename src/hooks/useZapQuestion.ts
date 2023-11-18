import { useState } from "react";
import { SEARCH_ROOT_URL } from "@/constants";
import { camelCaseKeysDeep } from "@/utils/changeKeysDeep";

import type { ScoredZap } from "../types";

const useZapQuestion = (query: string) => {
  const [zaps, setZaps] = useState<ScoredZap[] | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askZapQuestion = async (query: string) => {
    setLoading(true);
    const response = await fetch(`${SEARCH_ROOT_URL}/ai-answer?search_term=${encodeURIComponent(query)}`, {
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
      setAnswer(success.answer)
      setZaps(camelCaseKeysDeep(success.zaps));
      setError(null);
      return success;
    }
    return;
  };

  return { askZapQuestion, answer, zaps, loading, error };
}

export default useZapQuestion;