"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1
    },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
            delay: (iconDuration * 0.375),
            opacity: { delay: iconDuration / 4, duration: iconDuration, ease: iconEase },
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const G_VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: {
        rotate: [-3, 3, -3],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
export function ShipMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} custom={2} d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.g animate={controls} variants={G_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
            <path d="M12 10v4"/>
            <path d="M12 2v3"/>
          </motion.g>
        </g>);
}
