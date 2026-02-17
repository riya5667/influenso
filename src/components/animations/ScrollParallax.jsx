import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function ScrollParallax({ children, className = "", from = -30, to = 30, offset = ["start end", "end start"] }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [from, to]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export default ScrollParallax;
