import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

const listeners: Set<() => void> = new Set();
let currentValue =
  typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false;
let listening = false;

function startListening() {
  if (listening) return;
  listening = true;

  const handleResize = () => {
    const next = window.innerWidth < MOBILE_BREAKPOINT;
    if (next !== currentValue) {
      currentValue = next;
      listeners.forEach((listener) => listener());
    }
  };

  window.addEventListener("resize", handleResize);
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      startListening();

      return () => {
        listeners.delete(listener);
      };
    },
    () => currentValue,
    () => false,
  );
}
