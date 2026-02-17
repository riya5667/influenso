import { lazy, Suspense, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToggleSection from "./components/ToggleSection";
import LogoMarquee from "./components/LogoMarquee";
import StatsCounters from "./components/StatsCounters";
import Footer from "./components/Footer";
import FlowExperience from "./components/FlowExperience";

const GalaxyBackground = lazy(() => import("./scenes/GalaxyBackground"));

function App() {
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <Suspense fallback={null}>
        <GalaxyBackground />
      </Suspense>
      <div className="galaxy-overlay" aria-hidden="true" />

      <div className="relative z-20">
        <Navbar onStartFlow={() => setShowFlow(true)} />
      </div>
      <main className="relative z-20">
        <Hero onStartFlow={() => setShowFlow(true)} />
        <ToggleSection />
        <LogoMarquee />
        <StatsCounters />
      </main>
      <div className="relative z-20">
        <Footer />
      </div>

      <FlowExperience open={showFlow} onClose={() => setShowFlow(false)} />
    </div>
  );
}

export default App;
