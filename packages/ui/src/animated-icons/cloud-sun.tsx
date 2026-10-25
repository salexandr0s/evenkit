"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const CLOUD_VARIANTS: Variants = {
    normal: {
        x: 0,
        y: 0
    },
    animate: {
        x: [-1, 1, -1, 1, 0],
        y: [-1, 1, -1, 1, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
const SUN_VARIANTS: Variants = {
    normal: { opacity: 1 },
    animate: (i: number) => ({
        opacity: [0, 1],
        transition: { delay: i * (iconDuration * 0.25), duration: iconDuration, ease: iconEase }
    })
};
export function CloudSunMotion({ controls }: AnimatedGlyphProps) {
    return (<g style={{ overflow: "visible" }}>
          <motion.g animate={controls} variants={CLOUD_VARIANTS} initial="normal" transition={iconTransition}>
            <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>
          </motion.g>
          {[
            "M12 2v2",
            "m4.93 4.93 1.41 1.41",
            "M20 12h2",
            "m19.07 4.93-1.41 1.41",
            "M15.947 12.65a4 4 0 0 0-5.925-4.128",
        ].map((d, index) => (<motion.path animate={controls} custom={index + 1} d={d} key={d} variants={SUN_VARIANTS} initial="normal" transition={iconTransition}/>))}
        </g>);
}
