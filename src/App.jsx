import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToggleSection from "./components/ToggleSection";
import LogoMarquee from "./components/LogoMarquee";
import StatsCounters from "./components/StatsCounters";
import Footer from "./components/Footer";

const GalaxyBackground = lazy(() => import("./scenes/GalaxyBackground"));

function App() {
  return (
    <div className="relative overflow-hidden">
      <Suspense fallback={null}>
        <GalaxyBackground />
      </Suspense>
      <div className="galaxy-overlay" aria-hidden="true" />

      <div className="relative z-20">
        <Navbar />
      </div>
      <main className="relative z-20">
        <Hero />
        <ToggleSection />
        <LogoMarquee />
        <StatsCounters />
      </main>
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default App;
