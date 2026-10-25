"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const SNOWFLAKE_CHILD_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (index: number) => ({
    opacity: [1, 0.25, 1],
    transition: { ...iconTransition, duration: iconDuration * 2, delay: index * iconDuration / 4 },
  }),
};
const SNOWFLAKE_PATH = [
    { id: "snowflake1", d: "M8 15h.01" },
    { id: "snowflake2", d: "M8 19h.01" },
    { id: "snowflake3", d: "M12 17h.01" },
    { id: "snowflake4", d: "M12 21h.01" },
    { id: "snowflake5", d: "M16 15h.01" },
    { id: "snowflake6", d: "M16 19h.01" },
];
export function CloudSnowMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <g>
            {SNOWFLAKE_PATH.map((path, index) => (<motion.path custom={index} d={path.d} key={path.id} variants={SNOWFLAKE_CHILD_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>))}
          </g>
        </g>);
}
