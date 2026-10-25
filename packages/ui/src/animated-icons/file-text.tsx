"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

export function FileTextMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} variants={{
            normal: { scale: 1 },
            animate: {
                scale: 1.05,
                transition: {
                    duration: iconDuration,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>

          <motion.path animate={controls} d="M10 9H8" stroke="currentColor" variants={{
            normal: {
                pathLength: 1,
            },
            animate: {
                pathLength: [1, 0, 1],
                transition: {
                    duration: iconDuration * 2,
                    delay: iconDuration,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M16 13H8" stroke="currentColor" variants={{
            normal: {
                pathLength: 1,
            },
            animate: {
                pathLength: [1, 0, 1],
                transition: {
                    duration: iconDuration * 2,
                    delay: iconDuration,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M16 17H8" stroke="currentColor" variants={{
            normal: {
                pathLength: 1,
            },
            animate: {
                pathLength: [1, 0, 1],
                transition: {
                    duration: iconDuration * 2,
                    delay: iconDuration * 2,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}/>
        </motion.g>);
}
