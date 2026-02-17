import { useEffect, useRef } from "react";

function CustomCursor() {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const rafRef = useRef(0);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const enabled = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    enabled.current = media.matches;
    if (!enabled.current) return undefined;

    document.body.classList.add("fancy-cursor");

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const render = () => {
      current.current.x += (target.current.x - current.current.x) * 0.2;
      current.current.y += (target.current.y - current.current.y) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = window.requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("fancy-cursor");
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <>
      <div ref={haloRef} className="cursor-halo pointer-events-none fixed left-0 top-0 z-[60]" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot pointer-events-none fixed left-0 top-0 z-[61]" aria-hidden="true" />
    </>
  );
}

export default CustomCursor;
