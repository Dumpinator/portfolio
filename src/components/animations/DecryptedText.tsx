import React, { useEffect, useRef } from "react";
import { useSpring, animated, SpringValue } from "@react-spring/web";

type CustomSpanProps = React.ComponentProps<typeof animated.span> & {
  style?: {
    whiteSpace?: string;
    opacity?: SpringValue<number>;
  };
};

const DecryptedText: React.FC<
  CustomSpanProps & {
    text?: string;
    duration?: number;
    delay?: number;
    trigger?: number;
    characters?: string;
    className?: string;
    parentClassName?: string;
    direction?: "left-to-right" | "right-to-left" | "random";
  }
> = ({
  text = "",
  duration = 2000,
  delay = 0,
  trigger = 0,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?",
  className = "",
  parentClassName = "",
  direction = "left-to-right",
}) => {
  const words = text.split(" ");

  // Refs for DOM manipulation instead of setState
  const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const charSpanRefs = useRef<(HTMLSpanElement | null)[][]>(
    words.map((word) => Array(word.length).fill(null)),
  );
  const animationRef = useRef<number | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  // Run animation — reacts to `trigger` changes
  useEffect(() => {
    startTimeRef.current = null;
    const currentWords = text.split(" ");
    const charsByWord = currentWords.map((word) => word.split(""));
    const shuffleSeed = `${text}:${trigger}:${characters.length}`;

    const getRandomChar = () => {
      return characters.charAt(Math.floor(Math.random() * characters.length));
    };

    const getSeededValue = (index: number) => {
      let hash = 0;

      for (let charIndex = 0; charIndex < shuffleSeed.length; charIndex += 1) {
        hash = (hash * 31 + shuffleSeed.charCodeAt(charIndex) + index) >>> 0;
      }

      return hash;
    };

    const order = currentWords.map((_, index) => index);
    if (direction === "right-to-left") {
      order.reverse();
    } else if (direction === "random") {
      order.sort((a, b) => getSeededValue(a) - getSeededValue(b));
    }

    wordSpanRefs.current = currentWords.map((_, index) => wordSpanRefs.current[index] ?? null);
    charSpanRefs.current = currentWords.map((word, wordIndex) =>
      Array.from({ length: word.length }, (_, charIndex) => charSpanRefs.current[wordIndex]?.[charIndex] ?? null),
    );

    // Reset all spans to random chars immediately
    for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
      const wordSpan = wordSpanRefs.current[wIdx];
      if (wordSpan) wordSpan.className = "word";
      const charRefs = charSpanRefs.current[wIdx];
      if (!charRefs) continue;
      for (let cIdx = 0; cIdx < charRefs.length; cIdx++) {
        const span = charRefs[cIdx];
        if (span) span.textContent = getRandomChar();
      }
    }

    const decryptedFlags = Array(currentWords.length).fill(false);

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const totalWords = order.length;
      const wordsToDecrypt = Math.floor(progress * totalWords * 1.2);

      for (let i = 0; i < wordsToDecrypt && i < order.length; i++) {
        decryptedFlags[order[i]] = true;
      }

      for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
        const wordSpan = wordSpanRefs.current[wIdx];
        const isDecrypted = decryptedFlags[wIdx];

        if (wordSpan) {
          wordSpan.className = `word ${isDecrypted ? className : ""}`;
        }

        const charRefs = charSpanRefs.current[wIdx];
        if (!charRefs) continue;

        for (let cIdx = 0; cIdx < charRefs.length; cIdx++) {
          const span = charRefs[cIdx];
          if (span) {
            span.textContent = isDecrypted
              ? charsByWord[wIdx][cIdx]
              : getRandomChar();
          }
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
          const wordSpan = wordSpanRefs.current[wIdx];
          if (wordSpan) wordSpan.className = `word ${className}`;
          const charRefs = charSpanRefs.current[wIdx];
          if (!charRefs) continue;
          for (let cIdx = 0; cIdx < charRefs.length; cIdx++) {
            const span = charRefs[cIdx];
            if (span) span.textContent = charsByWord[wIdx][cIdx];
          }
        }
      }
    };

    // Delay the start so the CSS transition (max-h, opacity) can open first
    delayTimerRef.current = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [characters, className, delay, direction, duration, text, trigger]);

  return (
    <animated.span
      className={`decrypted-text-container ${parentClassName}`}
      style={{
        ...props,
        whiteSpace: "normal",
      }}
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span
            ref={(el) => {
              wordSpanRefs.current[wordIndex] = el;
            }}
            className="word"
            style={{
              display: "inline-block",
              fontFamily: "monospace",
              transition: "color 0.2s",
              marginRight: "0.25em",
            }}
          >
            {word.split("").map((char, charIndex) => (
              <span
                key={`${wordIndex}-${charIndex}`}
                ref={(el) => {
                  if (!charSpanRefs.current[wordIndex]) {
                    charSpanRefs.current[wordIndex] = [];
                  }
                  charSpanRefs.current[wordIndex][charIndex] = el;
                }}
                style={{
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </animated.span>
  );
};

export default DecryptedText;
