"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const RECT_VARIANTS: Variants = {
    normal: {
        translateY: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        translateY: -1.5,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const PATH_VARIANTS: Variants = {
    normal: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" },
    animate: { d: "M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11" }
};
const SECONDARY_PATH_VARIANTS: Variants = {
    normal: { d: "M10 12h4" },
    animate: { d: "M10 15h4" }
};
export function ArchiveMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.rect animate={controls} height="5" rx="1" variants={RECT_VARIANTS} width="20" x="2" y="3" initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M10 12h4" variants={SECONDARY_PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
