// useUpdateUserData.js
import { useState, useEffect } from "react";
import { getUserData } from "../apis/getUserData";

// Retry delay while the back service is unreachable (e.g. started after the
// front end). Without it the sidebar usage and user card stay empty until reload.
export const USER_DATA_RETRY_MS = 5000;

export function useUpdateUserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer = null;

    const load = async () => {
      clearTimeout(retryTimer);
      try {
        const data = await getUserData();
        if (!cancelled) setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (!cancelled) retryTimer = setTimeout(load, USER_DATA_RETRY_MS);
      }
    };

    load();
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, []);

  return userData;
}
