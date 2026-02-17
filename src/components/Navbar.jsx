const navItems = [
  { label: "Features", href: "#features" },
  { label: "Partners", href: "#partners" },
  { label: "Live Stats", href: "#stats" },
  { label: "Contact", href: "#footer" },
];

function Navbar({ onStartFlow }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-canvas/70 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="Creator Sync Home">
          <span className="glow-wordmark font-display text-base font-semibold tracking-[0.2em]">CREATORSYNC</span>
        </a>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex gap-8 text-sm text-slate-300">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={onStartFlow}
          className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
          aria-label="Get started with Creator Sync"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}

export default Navbar;

