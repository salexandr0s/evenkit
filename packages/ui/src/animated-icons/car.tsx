"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const WHEEL_VARIANTS: Variants = {
    normal: {
        scaleX: 1,
        scaleY: 1,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        scaleX: [1, 1.12, 1, 1.06, 1],
        scaleY: [1, 0.9, 1, 0.95, 1],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
const BODY_VARIANTS: Variants = {
    normal: { x: 0, y: 0 },
    animate: {
        y: [0, -0.6, 0, -0.4, 0],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
const SPEED_LINE_VARIANTS: Variants = {
    normal: {
        opacity: 0,
        x: 0,
        scaleX: 0
    },
    animate: (custom: number) => ({
        opacity: [0, 0.7, 0.5, 0],
        x: [0, -4, -10, -16],
        scaleX: [0.2, 1, 0.8, 0.3],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase,
            delay: custom * (iconDuration * 0.2),
            times: [0, 0.2, 0.6, 1]
        }
    })
};
export function CarMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          {[
            { y: 8, width: 5, x: 0 },
            { y: 11, width: 7, x: -1 },
            { y: 14, width: 4, x: 0 },
        ].map((line, i) => (<motion.line animate={controls} custom={i} key={`speed-${i}`} strokeLinecap="round" variants={SPEED_LINE_VARIANTS} x1={line.x} x2={line.x + line.width} y1={line.y} y2={line.y} initial="normal" transition={iconTransition}/>))}
          <motion.g animate={controls} variants={BODY_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          </motion.g>
          <motion.g animate={controls} style={{ transformOrigin: "7px 19px" }} variants={WHEEL_VARIANTS} initial="normal" transition={iconTransition}>
            <circle cx="7" cy="17" r="2"/>
          </motion.g>
          <motion.g animate={controls} variants={BODY_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M9 17h6"/>
          </motion.g>
          <motion.g animate={controls} style={{ transformOrigin: "17px 19px" }} variants={WHEEL_VARIANTS} initial="normal" transition={iconTransition}>
            <circle cx="17" cy="17" r="2"/>
          </motion.g>
        </g>);
}
