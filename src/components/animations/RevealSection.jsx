import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

function RevealSection({
  children,
  className = "",
  amount = 0.25,
  once = true,
  delay = 0,
  duration = 0.55,
  y = 24,
  blur = 6,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, once });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default RevealSection;
