import { useState } from "react";

const useIndexZaps = () => {
  const [loading, setLoading] = useState(false);
  const indexZaps = async () => {
    setLoading(true);
    const response = await fetch("/api/next-search/index-zaps", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

    setLoading(false);

    return success;
  };

  return { indexZaps, loading };
};

export default useIndexZaps;
