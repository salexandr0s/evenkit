"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const LID_VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: {
        rotate: [0, -14, 14, -10, 10, -6, 6, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const POT_VARIANTS: Variants = {
    normal: { scale: 1 },
    animate: {
        scale: [1, 1.08, 1],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
export function CookingPotMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.g animate={controls} style={{ transformOrigin: "12px 16px" }} variants={POT_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M2 12h20"/>
            <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
          </motion.g>
          <motion.g animate={controls} style={{ transformOrigin: "18px 6px" }} variants={LID_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="m4 8 16-4"/>
            <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
          </motion.g>
        </g>);
}
