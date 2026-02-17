import { motion } from "framer-motion";

const footerGroups = [
  {
    title: "Platform",
    links: ["Creator Discovery", "Campaign Control", "Analytics", "Payouts"],
  },
  {
    title: "Company",
    links: ["About", "Enterprise", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["Case Studies", "API Docs", "Security", "Help Center"],
  },
];

const socials = ["LinkedIn", "X", "YouTube"];

function Footer() {
  return (
    <footer id="footer" className="relative border-t border-white/10 py-14">
      <div className="section-shell">
        <motion.div
          className="glass-card overflow-hidden border-white/10 p-6 md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
            <div className="space-y-5">
              <p className="glow-wordmark font-display text-xl font-semibold tracking-[0.18em]">CREATORSYNC</p>
              <h3 className="max-w-sm font-display text-2xl font-bold text-white md:text-3xl">
                The premium operating system for global brand and creator partnerships.
              </h3>
              <p className="max-w-md text-sm text-slate-300">
                CreatorSync helps enterprise teams discover creators, run campaigns, track ROI, and automate payouts from one secure workspace.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                >
                  Book a Demo
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-xs uppercase tracking-[0.15em] text-slate-400">{group.title}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="transition hover:text-white">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} CreatorSync. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Compliance</a>
              {socials.map((social) => (
                <a key={social} href="#" className="hover:text-white">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
