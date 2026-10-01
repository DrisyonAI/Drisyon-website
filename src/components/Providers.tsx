"use client";

import { MotionConfig } from "motion/react";

/** Motion respects the visitor's reduced-motion preference everywhere. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
