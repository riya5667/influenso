import { motion } from "framer-motion";

const brandLogos = [
  "TechFlow",
  "EcoLife",
  "UrbanWear",
  "CloudPeak",
  "NovaMobile",
  "QuantumPay",
  "AeroMotion",
  "PulseRetail",
  "BlueOrbit",
  "PrimeLeaf",
];

function LogoMarquee() {
  const trackItems = [...brandLogos, ...brandLogos];

  return (
    <section id="partners" className="py-14">
      <motion.div
        className="section-shell"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-7 text-center text-xs uppercase tracking-[0.2em] text-slate-400">Infinite Trust Network</p>
      </motion.div>
      <motion.div
        className="logo-marquee overflow-hidden"
        aria-label="Enterprise brand logos"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <div className="logo-track flex animate-marquee gap-4 px-4 md:gap-6">
          {trackItems.map((name, idx) => (
            <motion.div
              key={`${name}-${idx}`}
              className="group flex h-16 min-w-[180px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6"
              whileHover={{ y: -3 }}
            >
              <span className="font-display text-lg tracking-wide text-white/50 grayscale transition group-hover:text-white group-hover:grayscale-0">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default LogoMarquee;
