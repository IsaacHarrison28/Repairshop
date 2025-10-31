import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePolling(ms: number = 6000, searchParam: string | null) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Interval running");

      if (!searchParam) {
        console.log("refreshing data");
        router.refresh();
      }
    }, ms);

    return () => clearInterval(intervalId);
  }, [searchParam, ms]); //eslint-disable-line react-hooks/exhaustive-deps
}
