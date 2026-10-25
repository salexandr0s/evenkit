"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const STRAW_VARIANTS: Variants = {
    normal: {
        y: 0,
        scaleY: 1,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        y: [0, -0.85, 0.15, 0],
        scaleY: [1, 1.06, 0.99, 1],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase,
            times: [0, 0.35, 0.65, 1]
        }
    }
};
const WAVE_VARIANTS: Variants = {
    normal: {
        y: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        y: [0, -1, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const BUBBLE_VARIANTS: Variants = {
    normal: { opacity: 0, y: 0, scale: 1 },
    animate: (delay: number) => ({
        opacity: [0, 0.9, 0.4, 0],
        y: [0, -3, -10, -14],
        scale: [1, 1, 0.85, 0.6],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase,
            delay,
            times: [0, 0.08, 0.7, 1]
        }
    })
};
const BUBBLES = [
    { delay: 0, cx: 8.25, cy: 20.5, r: 0.75 },
    { delay: (iconDuration * 0.875), cx: 11.25, cy: 19.5, r: 0.6 },
    { delay: (iconDuration * 1.75), cx: 14, cy: 20.75, r: 0.6 },
    { delay: (iconDuration * 2.625), cx: 9.75, cy: 19, r: 0.75 },
    { delay: (iconDuration * 1.375), cx: 12.5, cy: 20, r: 0.45 },
] as const;
export function CupSodaMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/>
          <path d="M5 8h14"/>
          <motion.path animate={controls} d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" variants={WAVE_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="m12 8 1-6h2" style={{
            transformBox: "fill-box",
            originX: "50%",
            originY: "100%"
        }} variants={STRAW_VARIANTS} initial="normal" transition={iconTransition}/>
          {BUBBLES.map((b, i) => (<motion.circle animate={controls} custom={b.delay} cx={b.cx} cy={b.cy} fill="currentColor" key={i} r={b.r} stroke="none" style={{
                transformBox: "fill-box",
                originX: "50%",
                originY: "50%"
            }} variants={BUBBLE_VARIANTS} initial="normal" transition={iconTransition}/>))}
        </g>);
}
