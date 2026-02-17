import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const GlobeCanvas = lazy(() => import("../scenes/GlobeCanvas"));

function Hero() {
  return (
    <section className="section-shell grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
      <div className="space-y-8">
        <motion.p
          className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Premium Enterprise Platform
        </motion.p>

        <motion.h1
          className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          Where Global Brands Meet
          <span className="block bg-gradient-to-r from-brand-300 via-white to-creator-300 bg-clip-text text-transparent">
            Iconic Creators.
          </span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-base text-slate-300 md:text-lg"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
        >
          CreatorSync is the command center for Fortune 500 influencer programs, from creator discovery and negotiation to campaign analytics and payout automation.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
        >
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-glow transition hover:scale-[1.03]"
          >
            Get Started
          </button>
          <p className="text-sm text-slate-400">Trusted by enterprise teams managing global creator partnerships.</p>
        </motion.div>
      </div>

      {/* Fixed height prevents CLS while the globe scene is loading. */}
      <motion.div
        className="relative isolate h-[430px] lg:h-[560px]"
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.2),transparent_45%)] blur-2xl"
          aria-hidden="true"
        />

        <motion.div
          className="absolute left-4 top-4 z-10 rounded-full border border-brand-200/25 bg-brand-400/15 px-3 py-1 text-xs text-brand-100"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          4,100 Active Campaign Links
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 z-10 rounded-full border border-creator-200/25 bg-creator-400/15 px-3 py-1 text-xs text-creator-100"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity }}
        >
          Real-Time Brand x Creator Matching
        </motion.div>

        <Suspense fallback={<CanvasLoader />}>
          <GlobeCanvas />
        </Suspense>
      </motion.div>
    </section>
  );
}

function CanvasLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-300" role="status" aria-live="polite">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-400" />
        Loading connection map
      </div>
    </div>
  );
}

export default Hero;
