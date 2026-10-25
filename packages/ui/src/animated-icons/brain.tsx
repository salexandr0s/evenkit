"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const BRAIN_STEM_VARIANTS: Variants = {
    normal: { pathLength: 1, pathOffset: 0 },
    animate: {
        pathLength: [1, 0.4, 1],
        pathOffset: [0, 0.25, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const BRAIN_SIDE_VARIANTS: Variants = {
    normal: { pathLength: 1, pathOffset: 0 },
    animate: {
        pathLength: [1, 0.5, 1],
        pathOffset: [0, 0.25, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const BRAIN_TOP_ARC_VARIANTS: Variants = {
    normal: { pathLength: 1, pathOffset: 0 },
    animate: {
        pathLength: [1, 0.8, 1],
        pathOffset: [0, 0.07, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const BRAIN_LOWER_ARC_VARIANTS: Variants = {
    normal: { pathLength: 1, pathOffset: 0 },
    animate: {
        pathLength: [1, 0.8, 1],
        pathOffset: [0, 0.14, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
export function BrainMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} variants={{
            normal: {
                scale: 1
            },
            animate: {
                scale: [1, 1.08, 1],
                transition: {
                    duration: iconDuration * 3,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}>
          <motion.path animate={controls} d="M12 18V5" variants={BRAIN_STEM_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" variants={BRAIN_SIDE_VARIANTS} initial="normal" transition={iconTransition}/>

          <motion.path animate={controls} d="M12 5A3 3 0 1 1 17.598 6.5" variants={BRAIN_TOP_ARC_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M12 5A3 3 0 1 0 6.402 6.5" variants={BRAIN_TOP_ARC_VARIANTS} initial="normal" transition={iconTransition}/>

          <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/>

          <motion.path animate={controls} d="M18 18a4 4 0 0 0 2-7.464" variants={BRAIN_LOWER_ARC_VARIANTS} initial="normal" transition={iconTransition}/>

          <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/>

          <motion.path animate={controls} d="M6 18a4 4 0 0 1-2-7.464" variants={BRAIN_LOWER_ARC_VARIANTS} initial="normal" transition={iconTransition}/>
          <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>
        </motion.g>);
}
