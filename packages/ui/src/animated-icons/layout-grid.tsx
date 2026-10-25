"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const RECT_1_VARIANTS: Variants = {
    normal: { translateX: 0, translateY: 0 },
    animate: {
        translateX: [0, 11, 11, 0],
        translateY: [0, 0, 0, 0],
        transition: { duration: iconDuration * 2, ease: iconEase, times: [0, 0.4, 0.6, 1] }
    }
};
const RECT_2_VARIANTS: Variants = {
    normal: { translateX: 0, translateY: 0 },
    animate: {
        translateX: [0, 0, 0, 0],
        translateY: [0, 11, 11, 0],
        transition: { duration: iconDuration * 2, ease: iconEase, times: [0, 0.4, 0.6, 1] }
    }
};
const RECT_3_VARIANTS: Variants = {
    normal: { translateX: 0, translateY: 0 },
    animate: {
        translateX: [0, -11, -11, 0],
        translateY: [0, 0, 0, 0],
        transition: { duration: iconDuration * 2, ease: iconEase, times: [0, 0.4, 0.6, 1] }
    }
};
const RECT_4_VARIANTS: Variants = {
    normal: { translateX: 0, translateY: 0 },
    animate: {
        translateX: [0, 0, 0, 0],
        translateY: [0, -11, -11, 0],
        transition: { duration: iconDuration * 2, ease: iconEase, times: [0, 0.4, 0.6, 1] }
    }
};
export function LayoutGridMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.rect animate={controls} height="7" rx="1" variants={RECT_1_VARIANTS} width="7" x="3" y="3" initial="normal" transition={iconTransition}/>
          <motion.rect animate={controls} height="7" rx="1" variants={RECT_2_VARIANTS} width="7" x="14" y="3" initial="normal" transition={iconTransition}/>
          <motion.rect animate={controls} height="7" rx="1" variants={RECT_3_VARIANTS} width="7" x="14" y="14" initial="normal" transition={iconTransition}/>
          <motion.rect animate={controls} height="7" rx="1" variants={RECT_4_VARIANTS} width="7" x="3" y="14" initial="normal" transition={iconTransition}/>
        </g>);
}
