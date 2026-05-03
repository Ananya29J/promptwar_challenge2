"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, CheckCircle, XCircle, RotateCcw, ChevronRight, Award, Zap, Shield, Target } from "lucide-react";
import type { Badge } from "@/lib/types";

// ─── Game Data ─────────────────────────────────────────
interface GameOption {
  id: string;
  text: string;
  consequence: string;
  points: number;
  isCorrect: boolean;
  badge?: Badge;
}

interface GameStep {
  id: string;
  phase: "register" | "choose-method" | "vote";
  phaseLabel: string;
  title: string;
  scenario: string;
  options: GameOption[];
}

const GAME_STEPS: GameStep[] = [
  {
    id: "s1",
    phase: "register",
    phaseLabel: "Phase 1: Registration",
    title: "The Clock is Ticking",
    scenario: "You just turned 18! The elections are announced and the registration deadline is in 3 days. What do you do?",
    options: [
      { id: "s1a", text: "Register immediately on nvsp.in with all required documents", consequence: "✅ Great! You're now a registered voter. Your name will appear on the electoral roll.", points: 100, isCorrect: true, badge: { id: "b1", name: "Quick Registrant", icon: "⚡", description: "Registered before the deadline!", color: "#7C3AED" } },
      { id: "s1b", text: "Wait and see — there's still time", consequence: "⚠️ The deadline passed. You missed this election cycle. Registration closes 30 days before polling day.", points: -20, isCorrect: false },
      { id: "s1c", text: "Ask a friend to register for you", consequence: "❌ Voter registration is strictly individual. Only you can register for your vote. This can be penalized.", points: -50, isCorrect: false },
    ],
  },
  {
    id: "s2",
    phase: "register",
    phaseLabel: "Phase 1: Registration",
    title: "Document Check",
    scenario: "The NVSP portal asks for a 'Proof of Age' document. Which is most suitable?",
    options: [
      { id: "s2a", text: "Aadhaar card", consequence: "✅ Aadhaar is a valid proof of identity AND age accepted by the ECI for voter registration.", points: 80, isCorrect: true },
      { id: "s2b", text: "A selfie photo from your phone", consequence: "❌ Selfie photos are not valid government documents. You need official identity proof.", points: -30, isCorrect: false },
      { id: "s2c", text: "Birth certificate", consequence: "✅ Also valid! A birth certificate is an acceptable proof of age for voter registration.", points: 70, isCorrect: true, badge: { id: "b2", name: "Document Pro", icon: "📄", description: "Knows valid election documents!", color: "#10B981" } },
    ],
  },
  {
    id: "s3",
    phase: "choose-method",
    phaseLabel: "Phase 2: Choosing Your Method",
    title: "Election Day Approaches",
    scenario: "It's election week! You're traveling for work on polling day. What's your best option?",
    options: [
      { id: "s3a", text: "Apply for Postal Ballot (if eligible) in advance", consequence: "✅ Excellent! Service voters, overseas voters, and those with special circumstances can use postal ballots.", points: 100, isCorrect: true, badge: { id: "b3", name: "Smart Voter", icon: "📬", description: "Knows alternative voting methods!", color: "#F59E0B" } },
      { id: "s3b", text: "Skip voting this election — it's just one vote", consequence: "⚠️ Every vote matters! In 2019, several constituencies were decided by margins under 1000 votes.", points: -40, isCorrect: false },
      { id: "s3c", text: "Ask your family member to vote on your behalf", consequence: "❌ Proxy voting is illegal in India (except for some overseas scenarios). Each voter must cast their own ballot.", points: -60, isCorrect: false },
    ],
  },
  {
    id: "s4",
    phase: "choose-method",
    phaseLabel: "Phase 2: Choosing Your Method",
    title: "At the Polling Booth",
    scenario: "You arrive at the booth and a stranger offers to help you vote 'correctly'. What do you do?",
    options: [
      { id: "s4a", text: "Politely decline and vote independently", consequence: "✅ Correct! Your vote is secret and no one is permitted to accompany you into the voting booth.", points: 100, isCorrect: true, badge: { id: "b4", name: "Independent Voice", icon: "🗽", description: "Votes freely and independently!", color: "#EC4899" } },
      { id: "s4b", text: "Accept the help — it's quicker", consequence: "❌ This could be a form of voter influence or intimidation. Report such incidents to the Presiding Officer immediately.", points: -80, isCorrect: false },
      { id: "s4c", text: "Report the incident to the Presiding Officer first, then vote", consequence: "✅ Even better! Reporting suspicious activity protects democracy. Then cast your secret ballot.", points: 120, isCorrect: true },
    ],
  },
  {
    id: "s5",
    phase: "vote",
    phaseLabel: "Phase 3: Casting Your Vote",
    title: "The EVM Moment",
    scenario: "You're inside the booth. The Electronic Voting Machine is in front of you. The candidate you want is button #4. What do you press?",
    options: [
      { id: "s5a", text: "Press button #4 once and wait for the green light and beep", consequence: "✅ Perfect! The EVM registers one vote per voter. The green light and beep confirm your vote was recorded.", points: 100, isCorrect: true, badge: { id: "b5", name: "EVM Expert", icon: "🗳️", description: "Mastered the EVM voting process!", color: "#7C3AED" } },
      { id: "s5b", text: "Press button #4 multiple times to make sure it registers", consequence: "⚠️ The EVM only accepts the FIRST press. Additional presses don't count. One voter, one vote.", points: 20, isCorrect: false },
      { id: "s5c", text: "Take a photo of the screen for proof", consequence: "❌ Photography inside voting booths is strictly prohibited. This can lead to your ballot being invalidated.", points: -100, isCorrect: false },
    ],
  },
];

const PHASE_COLORS: Record<string, string> = {
  register: "#7C3AED",
  "choose-method": "#F59E0B",
  vote: "#10B981",
};

function BadgePopup({ badge }: { badge: Badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 500,
        background: "rgba(9,9,32,0.95)",
        border: `2px solid ${badge.color}44`,
        borderRadius: "24px",
        padding: "32px 48px",
        textAlign: "center",
        boxShadow: `0 0 60px ${badge.color}44, 0 20px 60px rgba(0,0,0,0.8)`,
        backdropFilter: "blur(24px)",
        minWidth: "280px",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "12px" }}>{badge.icon}</div>
      <div className="badge badge-primary" style={{ marginBottom: "12px", borderColor: `${badge.color}44`, color: badge.color }}>
        🏆 Badge Earned!
      </div>
      <h3 style={{ marginBottom: "8px", color: badge.color }}>{badge.name}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{badge.description}</p>
    </motion.div>
  );
}

export default function SimulatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<GameOption | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [showBadge, setShowBadge] = useState<Badge | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const step = GAME_STEPS[currentStep];
  const progress = ((currentStep) / GAME_STEPS.length) * 100;
  const phaseColor = PHASE_COLORS[step?.phase] || "#7C3AED";

  const handleSelect = (option: GameOption) => {
    if (revealed) return;
    setSelectedOption(option);
    setRevealed(true);
    const newScore = Math.max(0, score + option.points);
    setScore(newScore);

    if (option.badge) {
      const newBadges = [...earnedBadges, option.badge];
      setEarnedBadges(newBadges);
      setShowBadge(option.badge);
      setTimeout(() => setShowBadge(null), 2500);
    }
  };

  const handleNext = () => {
    if (currentStep < GAME_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
      setRevealed(false);
    } else {
      setGameOver(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setEarnedBadges([]);
    setGameOver(false);
  };

  const maxScore = GAME_STEPS.reduce((acc, s) => acc + Math.max(...s.options.map((o) => o.points)), 0);
  const grade = score >= maxScore * 0.85 ? "🏆 Expert Voter" : score >= maxScore * 0.6 ? "⭐ Informed Voter" : "📚 Learning Voter";

  if (gameOver) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}
        >
          <div className="glass-card" style={{ padding: "48px" }}>
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: "4rem", marginBottom: "20px" }}
            >
              🎉
            </motion.div>
            <h1 style={{ marginBottom: "8px" }}>{grade}</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>You completed the Election Simulator!</p>

            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "40px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: score >= maxScore * 0.6 ? "#10B981" : "#F59E0B" }}>{score}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Points Scored</div>
              </div>
              <div style={{ width: "1px", background: "var(--glass-border)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-primary-light)" }}>{earnedBadges.length}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Badges Earned</div>
              </div>
            </div>

            {earnedBadges.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ marginBottom: "16px" }}>Your Badges</h4>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  {earnedBadges.map((b) => (
                    <motion.div
                      key={b.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      title={b.description}
                      style={{
                        width: 56, height: 56, borderRadius: "16px",
                        background: `${b.color}22`,
                        border: `1px solid ${b.color}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      {b.icon}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <button id="simulator-reset-btn" onClick={reset} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <RotateCcw size={18} aria-hidden="true" />
              Play Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", padding: "40px 24px" }}>
      <div className="container-main" style={{ maxWidth: "720px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge" style={{ background: `${phaseColor}22`, color: phaseColor, border: `1px solid ${phaseColor}44` }}>
                {step.phaseLabel}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{currentStep + 1} / {GAME_STEPS.length}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-accent)", fontWeight: 700 }}>
              <Star size={16} aria-hidden="true" />
              {score} pts
            </div>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Earned badges strip */}
        {earnedBadges.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
            {earnedBadges.map((b) => (
              <div
                key={b.id}
                title={b.name}
                aria-label={`Badge: ${b.name}`}
                style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: `${b.color}22`, border: `1px solid ${b.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", flexShrink: 0,
                }}
              >
                {b.icon}
              </div>
            ))}
          </div>
        )}

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass-card" style={{ padding: "36px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "12px",
                  background: `${phaseColor}22`, border: `1px solid ${phaseColor}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: phaseColor,
                }}>
                  {step.phase === "register" ? <Shield size={20} aria-hidden="true" /> : step.phase === "choose-method" ? <Target size={20} aria-hidden="true" /> : <Zap size={20} aria-hidden="true" />}
                </div>
                <h3>{step.title}</h3>
              </div>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>{step.scenario}</p>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {step.options.map((option, i) => {
                const isSelected = selectedOption?.id === option.id;
                const isCorrect = option.isCorrect;
                const borderColor = !revealed
                  ? "var(--glass-border)"
                  : isSelected
                  ? isCorrect ? "#10B981" : "#EF4444"
                  : isCorrect ? "rgba(16,185,129,0.4)" : "var(--glass-border)";
                const bg = !revealed
                  ? "var(--bg-2)"
                  : isSelected
                  ? isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"
                  : isCorrect ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.01)";

                return (
                  <motion.button
                    key={option.id}
                    id={`option-${option.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleSelect(option)}
                    disabled={revealed}
                    aria-pressed={isSelected}
                    aria-label={`Option: ${option.text}`}
                    style={{
                      width: "100%",
                      padding: "20px",
                      borderRadius: "16px",
                      border: `2px solid ${borderColor}`,
                      background: bg,
                      cursor: revealed ? "default" : "none",
                      textAlign: "left",
                      transition: "all 0.25s ease",
                    }}
                    whileHover={!revealed ? { scale: 1.01 } : {}}
                    whileTap={!revealed ? { scale: 0.99 } : {}}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "8px",
                        background: !revealed ? "var(--bg-2)" : isSelected ? isCorrect ? "#10B981" : "#EF4444" : isCorrect ? "rgba(16,185,129,0.3)" : "var(--bg-2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: "0.8rem", fontWeight: 700,
                        color: "white",
                      }}>
                        {revealed
                          ? isSelected
                            ? isCorrect ? <CheckCircle size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />
                            : isCorrect ? <CheckCircle size={14} aria-hidden="true" /> : String.fromCharCode(65 + i)
                          : String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <div style={{
                          color: revealed && isSelected ? isCorrect ? "#10B981" : "#EF4444" : "var(--text)",
                          fontWeight: isSelected ? 600 : 400,
                          marginBottom: revealed ? "8px" : 0,
                          lineHeight: 1.5,
                        }}>
                          {option.text}
                        </div>
                        {revealed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}
                          >
                            {option.consequence}
                            {option.points > 0 && isSelected && (
                              <span style={{ marginLeft: "8px", color: "#10B981", fontWeight: 600 }}>+{option.points} pts</span>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  id="simulator-next-btn"
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  aria-label={currentStep === GAME_STEPS.length - 1 ? "See final results" : "Next question"}
                >
                  {currentStep === GAME_STEPS.length - 1 ? (
                    <><Trophy size={18} aria-hidden="true" /> See My Results</>
                  ) : (
                    <>Next Question <ChevronRight size={18} aria-hidden="true" /></>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Badge popup overlay */}
      <AnimatePresence>
        {showBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 499, backdropFilter: "blur(4px)" }}
              aria-hidden="true"
            />
            <BadgePopup badge={showBadge} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
