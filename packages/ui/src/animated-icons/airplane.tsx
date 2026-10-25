"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const SPEED_LINES = [
    { x1: 5, y1: 15, x2: 1, y2: 19, delay: (iconDuration * 0.25) },
    { x1: 7, y1: 17, x2: 3, y2: 21, delay: (iconDuration * 0.5) },
    { x1: 9, y1: 19, x2: 5, y2: 23, delay: (iconDuration * 0.75) },
];
export function PlaneMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" transition={{
            duration: iconDuration * 2,
            ease: iconEase
        }} variants={{
            normal: { x: 0, y: 0, scale: 1 },
            animate: {
                x: 3,
                y: -3,
                scale: 0.8
            }
        }} initial="normal"/>
          {SPEED_LINES.map((line, index) => (<motion.line animate={controls} key={index} stroke="currentColor" strokeWidth="calc(var(--pk-icon-stroke-width) / 2)" transition={{ duration: iconDuration, delay: line.delay, ease: iconEase }} variants={{
                normal: {
                    pathOffset: 1,
                    translateX: -3,
                    translateY: 3,
                    opacity: 0,
                    transition: {
                        duration: iconDuration,
                        times: [0, 0.6, 1],
                        ease: iconEase
                    }
                },
                animate: {
                    pathOffset: [1, 2],
                    translateX: [0, 0],
                    translateY: [0, 0],
                    opacity: 1
                }
            }} x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} initial="normal"/>))}
        </g>);
}
