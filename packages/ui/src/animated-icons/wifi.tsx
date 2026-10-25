"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const WIFI_LEVELS = [
    { d: "M12 20h.01", delay: 0 },
    { d: "M8.5 16.429a5 5 0 0 1 7 0", delay: (iconDuration * 0.25) },
    { d: "M5 12.859a10 10 0 0 1 14 0", delay: (iconDuration * 0.5) },
    { d: "M2 8.82a15 15 0 0 1 20 0", delay: (iconDuration * 0.75) },
];
export function WifiMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          {WIFI_LEVELS.map((level, index) => (<motion.path animate={controls} d={level.d} key={index} variants={{
                normal: { opacity: 1 },
                animate: {
                    opacity: index === 0 ? [1, 0.5, 1] : [1, 0, 1],
                    transition: { ...iconTransition, delay: level.delay },
                }
            }} initial="normal" transition={iconTransition}/>))}
        </g>);
}
