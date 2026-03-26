import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated, SpringValue } from '@react-spring/web';

type CustomSpanProps = React.ComponentProps<typeof animated.span> & {
    style?: {
        whiteSpace?: string;
        opacity?: SpringValue<number>;
    };
};

const DecryptedText: React.FC<CustomSpanProps & {
    text?: string;
    duration?: number;
    characters?: string;
    className?: string;
    parentClassName?: string;
    direction?: 'left-to-right' | 'right-to-left' | 'random';
}> = ({
    text = '',
    duration = 2000,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?',
    className = '',
    parentClassName = '',
    direction = 'left-to-right',
}) => {
        const words = text.split(' ');
        const charsByWord = words.map(word => word.split(''));

        // Refs for DOM manipulation instead of setState
        const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
        const charSpanRefs = useRef<(HTMLSpanElement | null)[][]>(
            words.map(word => Array(word.length).fill(null))
        );
        const animationRef = useRef<number | null>(null);
        const startTimeRef = useRef<number | null>(null);
        const [done, setDone] = useState(false);

        const props = useSpring({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 500 }
        });

        const getRandomChar = useCallback(() => {
            return characters.charAt(Math.floor(Math.random() * characters.length));
        }, [characters]);

        // Compute decryption order once
        const wordDecryptionOrder = useRef<number[]>([]);
        if (wordDecryptionOrder.current.length === 0) {
            const indices = words.map((_, i) => i);
            if (direction === 'right-to-left') {
                wordDecryptionOrder.current = indices.reverse();
            } else if (direction === 'random') {
                wordDecryptionOrder.current = indices.sort(() => Math.random() - 0.5);
            } else {
                wordDecryptionOrder.current = indices;
            }
        }

        useEffect(() => {
            const decryptedFlags = Array(words.length).fill(false);
            const order = wordDecryptionOrder.current;

            const animate = (timestamp: number) => {
                if (startTimeRef.current === null) startTimeRef.current = timestamp;
                const elapsed = timestamp - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                const totalWords = order.length;
                const wordsToDecrypt = Math.floor(progress * totalWords * 1.2);

                // Update decrypted flags
                for (let i = 0; i < wordsToDecrypt && i < order.length; i++) {
                    decryptedFlags[order[i]] = true;
                }

                // Update DOM directly — no setState
                for (let wIdx = 0; wIdx < words.length; wIdx++) {
                    const wordSpan = wordSpanRefs.current[wIdx];
                    const isDecrypted = decryptedFlags[wIdx];

                    if (wordSpan) {
                        wordSpan.className = `word ${isDecrypted ? className : ''}`;
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
                    // Final pass: ensure all words show original text
                    for (let wIdx = 0; wIdx < words.length; wIdx++) {
                        const wordSpan = wordSpanRefs.current[wIdx];
                        if (wordSpan) wordSpan.className = `word ${className}`;
                        const charRefs = charSpanRefs.current[wIdx];
                        if (!charRefs) continue;
                        for (let cIdx = 0; cIdx < charRefs.length; cIdx++) {
                            const span = charRefs[cIdx];
                            if (span) span.textContent = charsByWord[wIdx][cIdx];
                        }
                    }
                    // Switch to React-controlled final text so re-renders don't revert
                    setDone(true);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }, []);

        return (
            <animated.span
                {...({
                    className: `decrypted-text-container ${parentClassName}`,
                    style: {
                        ...props,
                        whiteSpace: 'normal'
                    }
                } as any)}
            >
                {words.map((word, wordIndex) => (
                    <React.Fragment key={wordIndex}>
                        <span
                            ref={el => { wordSpanRefs.current[wordIndex] = el; }}
                            className={`word ${done ? className : ''}`}
                            style={{
                                display: 'inline-block',
                                fontFamily: 'monospace',
                                transition: 'color 0.2s',
                                marginRight: '0.25em'
                            }}
                        >
                            {word.split('').map((char, charIndex) => (
                                <span
                                    key={`${wordIndex}-${charIndex}`}
                                    ref={el => {
                                        if (!charSpanRefs.current[wordIndex]) {
                                            charSpanRefs.current[wordIndex] = [];
                                        }
                                        charSpanRefs.current[wordIndex][charIndex] = el;
                                    }}
                                    style={{
                                        display: 'inline-block'
                                    }}
                                >
                                    {done ? char : getRandomChar()}
                                </span>
                            ))}
                        </span>
                    </React.Fragment>
                ))}
            </animated.span>
        );
    };

export default DecryptedText;