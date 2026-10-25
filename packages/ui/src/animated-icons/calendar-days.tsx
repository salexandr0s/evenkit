"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const DOTS = [
    { cx: 8, cy: 14 },
    { cx: 12, cy: 14 },
    { cx: 16, cy: 14 },
    { cx: 8, cy: 18 },
    { cx: 12, cy: 18 },
    { cx: 16, cy: 18 },
];
const VARIANTS: Variants = {
    normal: {
        opacity: 1,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: (i: number) => ({
        opacity: [1, 0.3, 1],
        transition: {
            delay: i * (iconDuration / 4),
            duration: iconDuration,
            times: [0, 0.5, 1],
            ease: iconEase
        }
    })
};
export function CalendarDaysMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect height="18" rx="2" width="18" x="3" y="4"/>
        <path d="M3 10h18"/>
        <>
          {DOTS.map((dot, index) => (<motion.circle animate={controls} custom={index} cx={dot.cx} cy={dot.cy} fill="currentColor" key={`${dot.cx}-${dot.cy}`} r="1" stroke="none" variants={VARIANTS} initial="normal" transition={iconTransition}/>))}
        </>
      </g>);
}
