import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

let listeners: Set<(v: boolean) => void> = new Set();
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
      listeners.forEach((fn) => fn(next));
    }
  };

  window.addEventListener("resize", handleResize);
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(currentValue);

  useEffect(() => {
    listeners.add(setIsMobile);
    startListening();

    // Sync in case value changed before mount
    setIsMobile(currentValue);

    return () => {
      listeners.delete(setIsMobile);
    };
  }, []);

  return isMobile;
}
