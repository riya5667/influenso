import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: "goal",
    title: "Primary campaign goal",
    options: ["Brand Awareness", "Product Launch", "Community Growth", "Direct Conversions"],
  },
  {
    id: "budget",
    title: "Monthly influencer budget",
    options: ["<$25K", "$25K-$100K", "$100K-$500K", "$500K+"],
  },
  {
    id: "region",
    title: "Primary market focus",
    options: ["North America", "Europe", "APAC", "Global"],
  },
  {
    id: "team",
    title: "Current team setup",
    options: ["Lean Team (1-3)", "Growing Team (4-10)", "Cross-Functional (10+)", "Agency + In-house"],
  },
];

function FlowExperience({ open, onClose }) {
  const [step, setStep] = useState("login");
  const [qIndex, setQIndex] = useState(0);
  const [auth, setAuth] = useState({ email: "", password: "" });
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    if (step === "login") return 20;
    if (step === "results") return 100;
    return 25 + Math.round(((qIndex + 1) / questions.length) * 60);
  }, [step, qIndex]);

  const currentQuestion = questions[qIndex];

  const goBack = () => {
    setError("");
    if (step === "results") {
      setStep("questionnaire");
      setQIndex(questions.length - 1);
      return;
    }
    if (step === "questionnaire" && qIndex > 0) {
      setQIndex((prev) => prev - 1);
      return;
    }
    if (step === "questionnaire" && qIndex === 0) {
      setStep("login");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!auth.email.trim() || !auth.password.trim()) {
      setError("Enter both email and password.");
      return;
    }
    setError("");
    setStep("questionnaire");
    setQIndex(0);
  };

  const selectAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setError("");
  };

  const handleQuestionNext = () => {
    if (!answers[currentQuestion.id]) {
      setError("Pick an option to continue.");
      return;
    }
    if (qIndex === questions.length - 1) {
      setStep("results");
      return;
    }
    setQIndex((prev) => prev + 1);
  };

  const result = useMemo(() => {
    const maturityMap = {
      "Lean Team (1-3)": 68,
      "Growing Team (4-10)": 76,
      "Cross-Functional (10+)": 85,
      "Agency + In-house": 91,
    };
    const budgetMap = {
      "<$25K": "Starter orchestration plan",
      "$25K-$100K": "Growth plan with creator scoring",
      "$100K-$500K": "Enterprise analytics and governance",
      "$500K+": "Global operating layer + custom integrations",
    };

    const score = maturityMap[answers.team] || 74;
    const recommendation = budgetMap[answers.budget] || "Growth plan with creator scoring";
    const region = answers.region || "Global";
    const goal = answers.goal || "Brand Awareness";

    return { score, recommendation, region, goal };
  }, [answers]);

  const resetAndClose = () => {
    setStep("login");
    setQIndex(0);
    setAnswers({});
    setAuth({ email: "", password: "" });
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-slate-950/90 shadow-[0_0_80px_rgba(56,189,248,0.18)]"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <div className="border-b border-white/10 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-white">CreatorSync Onboarding</p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-creator-400"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                {step === "login" ? "Step 1 of 3" : step === "questionnaire" ? "Step 2 of 3" : "Step 3 of 3"}
              </p>
            </div>

            <div className="p-6 md:p-8">
              {step === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <h2 className="font-display text-3xl font-bold text-white">Login</h2>
                  <p className="text-slate-300">Access your workspace to personalize your CreatorSync setup.</p>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Work Email</span>
                    <input
                      type="email"
                      value={auth.email}
                      onChange={(e) => setAuth((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none ring-brand-400/60 transition focus:ring-2"
                      placeholder="you@company.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Password</span>
                    <input
                      type="password"
                      value={auth.password}
                      onChange={(e) => setAuth((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none ring-brand-400/60 transition focus:ring-2"
                      placeholder="••••••••"
                    />
                  </label>

                  {error && <p className="text-sm text-rose-300">{error}</p>}

                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Continue
                  </button>
                </form>
              )}

              {step === "questionnaire" && (
                <div className="space-y-5">
                  <h2 className="font-display text-3xl font-bold text-white">Questionnaire</h2>
                  <p className="text-slate-300">
                    {qIndex + 1} / {questions.length} - {currentQuestion.title}
                  </p>

                  <div className="grid gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected = answers[currentQuestion.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectAnswer(option)}
                          className={`rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? "border-brand-300 bg-brand-400/20 text-white"
                              : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {error && <p className="text-sm text-rose-300">{error}</p>}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-full border border-white/20 px-6 py-3 text-sm text-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleQuestionNext}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-6 py-3 text-sm font-semibold text-white"
                    >
                      {qIndex === questions.length - 1 ? "View Results" : "Next"}
                    </button>
                  </div>
                </div>
              )}

              {step === "results" && (
                <div className="space-y-5">
                  <h2 className="font-display text-3xl font-bold text-white">Results</h2>
                  <p className="text-slate-300">Recommended setup based on your answers.</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Operational Fit Score</p>
                      <p className="mt-2 font-display text-4xl font-bold text-white">{result.score}%</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Recommended Plan</p>
                      <p className="mt-2 text-base font-semibold text-white">{result.recommendation}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                    <p className="text-sm text-slate-300">Goal: <span className="text-white">{result.goal}</span></p>
                    <p className="mt-2 text-sm text-slate-300">Primary Region: <span className="text-white">{result.region}</span></p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-full border border-white/20 px-6 py-3 text-sm text-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-creator-500 px-6 py-3 text-sm font-semibold text-white"
                    >
                      Finish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default FlowExperience;
