import { Children, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

function StaggeredCards({
  children,
  className = "",
  amount = 0.25,
  once = true,
  stagger = 0.1,
  duration = 0.45,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, once });
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
      },
    },
  };

  const itemVariants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {items.map((item, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StaggeredCards;
