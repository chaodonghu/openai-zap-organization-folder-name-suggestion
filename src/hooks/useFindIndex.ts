import { useCallback, useEffect, useState } from "react";

const useFindIndex = () => {
  const [hasIndex, setHasIndex] = useState<boolean>(false);

  const findIndex = useCallback(async () => {
    const response = await fetch(`/api/next-search/find-index`, {
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

    setHasIndex(success.hasIndex);
    return;
  }, []);

  useEffect(() => {
    findIndex().catch(console.error);
  }, [findIndex]);

  return { hasIndex };
};

export default useFindIndex;
