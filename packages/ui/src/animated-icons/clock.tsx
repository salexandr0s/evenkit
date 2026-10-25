"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const HAND_TRANSITION: Transition = {
    duration: iconDuration * 2,
    ease: iconEase
};
const HAND_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        originX: "0%",
        originY: "100%"
    },
    animate: {
        rotate: 360,
        originX: "0%",
        originY: "100%"
    }
};
const MINUTE_HAND_TRANSITION: Transition = {
    duration: iconDuration * 2,
    ease: iconEase
};
const MINUTE_HAND_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        originX: "0%",
        originY: "100%"
    },
    animate: {
        rotate: 45,
        originX: "0%",
        originY: "100%"
    }
};
export function ClockMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <circle cx="12" cy="12" r="10"/>
          <motion.line animate={controls} transition={HAND_TRANSITION} variants={HAND_VARIANTS} x1="12" x2="12" y1="12" y2="6" initial="normal"/>
          <motion.line animate={controls} transition={MINUTE_HAND_TRANSITION} variants={MINUTE_HAND_VARIANTS} x1="12" x2="16" y1="12" y2="12" initial="normal"/>
        </g>);
}
