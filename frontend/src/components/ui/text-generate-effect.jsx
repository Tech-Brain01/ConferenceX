"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../../lib/utils.js";

export const TextGenerateEffect = ({
  words,
  highlightWords = [],
  highlightClassName = "bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent",
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate("span", {
      opacity: 1,
      filter: filter ? "blur(0px)" : "none",
    }, {
      duration: duration ? duration : 10,
      delay: stagger(0.2),
    });
  }, [scope.current]);

const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          // Check if word should be highlighted
          const isHighlighted = highlightWords.includes(word.replace(/[^a-zA-Z]/g, ""));
          return (
            <motion.span
              key={word + idx}
              className={cn(
                "dark:text-white text-black opacity-0",
                isHighlighted ? highlightClassName : ""
              )}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };
  
  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div
          className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
