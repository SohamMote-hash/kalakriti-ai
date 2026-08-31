import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

/** True once the persisted store has been read back from AsyncStorage. */
export function useHydration() {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated;
}
