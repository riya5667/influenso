import { motion } from "framer-motion";

function ImagePlaceholderSection() {
  return (
    <section className="section-shell py-10 md:py-16">
      <div className="grid gap-5 md:grid-cols-2">
        <motion.article
          className="glass-card relative h-80 overflow-hidden border-white/10 p-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
          <div className="relative z-10 flex h-full items-end rounded-xl border-2 border-dashed border-brand-300/45 p-4">
            <p className="text-sm text-slate-200">Drop image here: product dashboard mockup</p>
          </div>
        </motion.article>

        <motion.article
          className="glass-card relative h-80 overflow-hidden border-white/10 p-5"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-creator-500/20 to-transparent" />
          <div className="relative z-10 flex h-full items-end rounded-xl border-2 border-dashed border-creator-300/45 p-4">
            <p className="text-sm text-slate-200">Drop image here: creator workflow screenshot</p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default ImagePlaceholderSection;
