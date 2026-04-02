import { useCallback, useEffect, useRef, useState } from "react";
import DecryptedText from "./animations/DecryptedText";

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const animate = useCallback(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animate();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return { value, ref };
}

type StatCounterProps = {
  target: number;
  suffix: string;
  label: string;
  decryptDelay?: number;
};

function StatCounter({ target, suffix, label, decryptDelay = 0 }: StatCounterProps) {
  const { value, ref } = useCountUp(target, 1800);
  return (
    <div className="text-center sm:text-left">
      <p
        className="text-4xl font-bold"
        style={{ color: "var(--accent-muted)" }}
      >
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="text-sm opacity-75">
        <DecryptedText
          text={label}
          duration={1500}
          delay={decryptDelay}
          direction="left-to-right"
        />
      </p>
    </div>
  );
}

export default StatCounter;
