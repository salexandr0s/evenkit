"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const CARD_VARIANTS: Variants = {
    normal: {
        x: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        x: [0, -4, 1.5, 0],
        transition: {
            duration: iconDuration * 2,
            times: [0, 0.4, 0.75, 1],
            ease: iconEase
        }
    }
};
export function CreditCardMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.g animate={controls} variants={CARD_VARIANTS} initial="normal" transition={iconTransition}>
            <rect height="14" rx="2" width="20" x="2" y="5"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </motion.g>
        </g>);
}
