"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { d: "m19 12-7 7-7-7", translateY: 0 },
    animate: {
        d: "m19 12-7 7-7-7",
        translateY: [0, -3, 0],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const SECOND_PATH_VARIANTS: Variants = {
    normal: { d: "M12 5v14" },
    animate: {
        d: ["M12 5v14", "M12 5v9", "M12 5v14"],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function ArrowDownMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m19 12-7 7-7-7" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M12 5v14" variants={SECOND_PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
