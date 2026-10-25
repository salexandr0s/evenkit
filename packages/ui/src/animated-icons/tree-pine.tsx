"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const TREE_PINE_VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 0] }
};
export function TreePineMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{
            duration: iconDuration * 2,
            ease: iconEase
        }} variants={TREE_PINE_VARIANTS} initial="normal">
          <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/>
          <path d="M12 22v-3"/>
        </motion.g>);
}
