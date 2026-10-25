"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const TRANSITION: Transition = {
    duration: iconDuration,
    ease: iconEase
};
const LEFT_VARIANTS: Variants = {
    normal: { x: 0 },
    animate: { x: -3 }
};
const RIGHT_VARIANTS: Variants = {
    normal: { x: 0, rotate: 0 },
    animate: { x: 3, rotate: 4 }
};
export function TicketMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.g animate={controls} transition={TRANSITION} variants={LEFT_VARIANTS} initial="normal">
            <path d="M13 5H4a2 2 0 0 0-2 2v2a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h9"/>
            <path d="M13 5v2"/>
            <path d="M13 11v2"/>
            <path d="M13 17v2"/>
          </motion.g>
          <motion.path animate={controls} d="M13 5h7a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2h-7" style={{ transformOrigin: "13px 12px" }} transition={TRANSITION} variants={RIGHT_VARIANTS} initial="normal"/>
        </g>);
}
