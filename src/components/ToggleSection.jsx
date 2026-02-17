import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealSection from "./animations/RevealSection";
import ScrollParallax from "./animations/ScrollParallax";
import StaggeredCards from "./animations/StaggeredCards";

const modeContent = {
  brand: {
    title: "Built for Global Brand Teams",
    subtitle: "Plan high-stakes collaborations with control, insight, and speed.",
    cards: [
      { title: "Analytics Dashboards", value: "Live Attribution", desc: "Track campaign KPIs, audience lift, and channel-level outcomes in real time." },
      { title: "ROI Calculator", value: "Forecast with confidence", desc: "Model spend vs. reach before launch to optimize budget allocation." },
      { title: "Search Creators", value: "Precision discovery", desc: "Filter by audience quality, brand fit, performance, and regional relevance." },
    ],
  },
  creator: {
    title: "Built for Elite Creators",
    subtitle: "Run your partnerships like a business with fewer tools and more clarity.",
    cards: [
      { title: "Monetize your audience", value: "Premium opportunities", desc: "Get matched with global campaigns aligned to your voice and audience." },
      { title: "Sponsorship management", value: "Streamlined workflow", desc: "Handle briefs, approvals, revisions, and deliverables from one place." },
      { title: "Get Paid", value: "Faster payout cycles", desc: "Clear contract milestones and transparent payout progress on every deal." },
    ],
  },
};

function ToggleSection() {
  const [mode, setMode] = useState("brand");

  const theme = useMemo(
    () =>
      mode === "brand"
        ? "from-brand-600/30 via-brand-500/10 to-transparent shadow-glow"
        : "from-creator-600/30 via-creator-500/10 to-transparent shadow-glowPurple",
    [mode]
  );

  const active = modeContent[mode];

  return (
    <section id="features" className="section-shell py-20">
      <RevealSection amount={0.25}>
        <motion.div
          className={`glass-card relative overflow-hidden border-white/10 bg-gradient-to-br ${theme} p-6 md:p-10`}
          animate={{ rotateX: mode === "brand" ? 0 : 2, rotateY: mode === "brand" ? 0 : -2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <ScrollParallax from={-12} to={12} className="pointer-events-none absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-white/6 to-transparent" />
          </ScrollParallax>

          <div className="relative z-10 mx-auto mb-8 flex w-fit rounded-full border border-white/20 bg-white/5 p-1.5">
            <ModeButton label="I am a Brand" isActive={mode === "brand"} onClick={() => setMode("brand")} />
            <ModeButton label="I am a Creator" isActive={mode === "creator"} onClick={() => setMode("creator")} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="relative z-10"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{active.title}</h2>
              <p className="mt-3 text-slate-300">{active.subtitle}</p>

              <StaggeredCards key={`cards-${mode}`} className="mt-8 grid gap-4 md:grid-cols-3" amount={0.2} stagger={0.08}>
                {active.cards.map((card) => (
                  <article key={card.title} className="glass-card border-white/10 p-5">
                    <p className="text-sm text-slate-300">{card.title}</p>
                    <p className="mt-3 font-display text-2xl font-bold text-white">{card.value}</p>
                    <p className="mt-3 text-sm text-slate-300">{card.desc}</p>
                  </article>
                ))}
              </StaggeredCards>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </RevealSection>
    </section>
  );
}

function ModeButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        isActive ? "bg-white text-canvas" : "text-slate-300 hover:text-white"
      }`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

export default ToggleSection;
