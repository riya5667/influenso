import { useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import RevealSection from "./animations/RevealSection";
import StaggeredCards from "./animations/StaggeredCards";

const stats = [
  { id: "creators", end: 2_000_000, compact: "M", label: "Creators", plus: true, decimals: 2, duration: 3.8 },
  { id: "reach", end: 500_000_000, compact: "M", label: "Global Reach", plus: true, decimals: 1, duration: 3.8 },
  { id: "paid", end: 10_000_000, compact: "M", label: "Paid Out", plus: true, prefix: "$", decimals: 2, duration: 3.8 },
];

function StatsCounters() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.33 });

  return (
    <section id="stats" ref={ref} className="section-shell py-20">
      <RevealSection className="mb-10 text-center" amount={0.5}>
        <h2 className="font-display text-3xl font-bold text-white md:text-5xl">Live Creator Economy Metrics</h2>
        <p className="mt-3 text-slate-300">As partnerships scale, CreatorSync updates the pulse in real time.</p>
      </RevealSection>

      <StaggeredCards className="grid gap-5 md:grid-cols-3" amount={0.25} stagger={0.1}>
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} inView={inView} />
        ))}
      </StaggeredCards>
    </section>
  );
}

function StatCard({ stat, inView }) {
  const [done, setDone] = useState(false);

  const formatValue = (value) => {
    const compacted = stat.compact === "M" ? value / 1_000_000 : value;
    const fixed = compacted.toFixed(stat.decimals ?? 0);
    const trimmed = fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
    return `${stat.prefix || ""}${trimmed}${stat.compact || ""}${stat.plus ? "+" : ""}`;
  };

  return (
    <article className={`glass-card border-white/10 p-7 transition-shadow ${done ? "shadow-glow" : ""}`}>
      <p className="font-display text-5xl font-bold text-white md:text-6xl">
        {inView ? (
          <CountUp end={stat.end} duration={stat.duration || 2.2} decimals={0} formattingFn={formatValue} onEnd={() => setDone(true)} />
        ) : (
          formatValue(0)
        )}
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.1em] text-slate-300">{stat.label}</p>
      <div
        className={`mt-6 h-1.5 rounded-full ${done ? "bg-gradient-to-r from-brand-400 to-creator-400" : "bg-white/15"}`}
        aria-hidden="true"
      />
    </article>
  );
}

export default StatsCounters;
