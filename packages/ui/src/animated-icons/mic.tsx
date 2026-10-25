"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const CAPSULE_VARIANTS: Variants = {
    normal: { y: 0 },
    animate: {
        y: [0, -3, 0, -2, 0],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
export function MicMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M12 19v3"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <motion.rect animate={controls} height="13" rx="3" variants={CAPSULE_VARIANTS} width="6" x="9" y="2" initial="normal" transition={iconTransition}/>
        </g>);
}
