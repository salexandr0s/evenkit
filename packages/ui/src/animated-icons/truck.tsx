"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const TRUCK_VARIANTS: Variants = {
    normal: { x: 0, y: 0 },
    animate: {
        y: [0, -1, 0, -0.5, 0],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const WHEEL_VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: {
        rotate: 360,
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
export function TruckMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          {[
            { y: 8, width: 5, x: 0 },
            { y: 11, width: 7, x: -1 },
            { y: 14, width: 4, x: 0 },
        ].map((line, i) => (<motion.line animate={controls} custom={i} key={`speed-${i}`} strokeLinecap="round" variants={SPEED_LINE_VARIANTS} x1={line.x} x2={line.x + line.width} y1={line.y} y2={line.y} initial="normal" transition={iconTransition}/>))}

          <motion.g animate={controls} variants={TRUCK_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          </motion.g>

          <motion.g animate={controls} variants={TRUCK_VARIANTS} initial="normal" transition={iconTransition}>
            <motion.g animate={controls} style={{ transformOrigin: "7px 18px" }} variants={WHEEL_VARIANTS} initial="normal" transition={iconTransition}>
              <circle cx="7" cy="18" r="2"/>
              <line strokeWidth="calc(var(--pk-icon-stroke-width) * 0.75)" x1="7" x2="7" y1="16.5" y2="19.5"/>
              <line strokeWidth="calc(var(--pk-icon-stroke-width) * 0.75)" x1="5.5" x2="8.5" y1="18" y2="18"/>
            </motion.g>
          </motion.g>

          <motion.g animate={controls} variants={TRUCK_VARIANTS} initial="normal" transition={iconTransition}>
            <motion.g animate={controls} style={{ transformOrigin: "17px 18px" }} variants={WHEEL_VARIANTS} initial="normal" transition={iconTransition}>
              <circle cx="17" cy="18" r="2"/>
              <line strokeWidth="calc(var(--pk-icon-stroke-width) * 0.75)" x1="17" x2="17" y1="16.5" y2="19.5"/>
              <line strokeWidth="calc(var(--pk-icon-stroke-width) * 0.75)" x1="15.5" x2="18.5" y1="18" y2="18"/>
            </motion.g>
          </motion.g>
        </g>);
}
