"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DURATION = iconDuration;
const CALCULATE_DELAY = (index: number) => index * DURATION + iconDuration / 4;
export function StethoscopeMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M11 2v2" transition={{
            duration: DURATION,
            delay: CALCULATE_DELAY(2),
            opacity: { delay: CALCULATE_DELAY(2), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }} variants={{
            normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: { delay: 0, duration: iconDuration, ease: iconEase }
            },
            animate: {
                pathOffset: [1, 0],
                pathLength: [0, 1],
                opacity: [0, 1]
            }
        }} initial="normal"/>
          <motion.path animate={controls} d="M5 2v2" transition={{
            duration: DURATION,
            delay: CALCULATE_DELAY(2),
            opacity: { delay: CALCULATE_DELAY(2), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }} variants={{
            normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: { delay: 0, duration: iconDuration, ease: iconEase }
            },
            animate: {
                pathOffset: [1, 0],
                pathLength: [0, 1],
                opacity: [0, 1]
            }
        }} initial="normal"/>
          <motion.path animate={controls} d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" transition={{
            duration: DURATION,
            delay: CALCULATE_DELAY(2),
            opacity: { delay: CALCULATE_DELAY(2), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }} variants={{
            normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: { delay: 0, duration: iconDuration, ease: iconEase }
            },
            animate: {
                pathLength: [0, 1],
                pathOffset: [1, 0],
                opacity: [0, 1]
            }
        }} initial="normal"/>
          <motion.path animate={controls} d="M8 15a6 6 0 0 0 12 0v-3" transition={{
            duration: DURATION,
            delay: CALCULATE_DELAY(1),
            opacity: { delay: CALCULATE_DELAY(1), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }} variants={{
            normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: { delay: 0, duration: iconDuration, ease: iconEase }
            },
            animate: {
                pathOffset: [1, 0],
                pathLength: [0, 1],
                opacity: [0, 1]
            }
        }} initial="normal"/>
          <motion.circle animate={controls} cx="20" cy="10" r="2" transition={{
            duration: DURATION,
            delay: CALCULATE_DELAY(0),
            opacity: { delay: CALCULATE_DELAY(0), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }} variants={{
            normal: { pathLength: 1, opacity: 1, transition: { delay: 0, duration: iconDuration, ease: iconEase } },
            animate: {
                pathLength: [0, 1],
                opacity: [0, 1]
            }
        }} initial="normal"/>
        </g>);
}
