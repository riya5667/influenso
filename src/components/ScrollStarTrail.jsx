import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function ScrollStarTrail() {
  const [stars, setStars] = useState([]);
  const lastYRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const spawnStars = (amount) => {
      const now = Date.now();
      const next = [];

      for (let i = 0; i < amount; i += 1) {
        idRef.current += 1;
        next.push({
          id: idRef.current,
          x: 8 + Math.random() * 84,
          y: 15 + Math.random() * 70,
          size: 2 + Math.random() * 4,
          life: 700 + Math.random() * 700,
          delay: Math.random() * 0.15,
          bornAt: now,
        });
      }

      setStars((prev) => [...prev, ...next]);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastYRef.current);
      lastYRef.current = y;

      if (delta < 6) return;
      const amount = Math.min(8, 2 + Math.floor(delta / 60));
      spawnStars(amount);
    };

    const cleanup = window.setInterval(() => {
      const now = Date.now();
      setStars((prev) => prev.filter((star) => now - star.bornAt < star.life));
    }, 180);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[15]" aria-hidden="true">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.95)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            initial={{ opacity: 0, scale: 0.4, y: 8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 0.7], y: [8, -4, -14] }}
            exit={{ opacity: 0 }}
            transition={{ duration: star.life / 1000, ease: "easeOut", delay: star.delay }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ScrollStarTrail;
