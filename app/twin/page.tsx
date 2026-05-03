"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, MapPin, Star, CheckCircle, Circle, Clock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import type { ElectionTwinProfile, TwinDashboard, ChecklistItem } from "@/lib/types";

// ─── Wizard Steps ───────────────────────────────────────
const AGE_GROUPS = ["18–25", "26–35", "36–45", "46–60", "60+"];
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Other"
];
const AWARENESS_LABELS = ["Completely New", "Know a Little", "Moderate", "Well Informed", "Expert"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${current + 1} of ${total}`} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: i === current ? 32 : 12,
            height: 12,
            borderRadius: 6,
            background: i < current ? "var(--gradient-primary)" : i === current ? "var(--gradient-primary)" : "var(--bg-2)",
            transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      ))}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="score-ring" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
        <circle className="ring-track" cx="70" cy="70" r={radius} strokeWidth="10" />
        <motion.circle
          className="ring-fill"
          cx="70" cy="70" r={radius}
          strokeWidth="10"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color }}>{score}</div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Score</div>
      </div>
    </div>
  );
}

export default function TwinPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<ElectionTwinProfile>>({});
  const [dashboard, setDashboard] = useState<TwinDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const totalSteps = 4;
  const direction = 1;

  const updateProfile = (field: keyof ElectionTwinProfile, value: unknown) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const next = async () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      await generateTwin();
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const generateTwin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      const d = data.dashboard;
      setDashboard({ profile: profile as ElectionTwinProfile, ...d });
      setChecklist(d.checklist || []);
    } catch {
      // Fallback
      setDashboard({
        profile: profile as ElectionTwinProfile,
        personalizedMessage: "Welcome! You're taking a great step toward becoming an informed voter.",
        awarenessScore: 60,
        tips: ["Register on nvsp.in", "Download Voter Helpline App", "Check your name on electoral rolls", "Carry valid photo ID", "Vote early to avoid queues"],
        checklist: [
          { id: "1", title: "Check Voter Roll", description: "Verify at nvsp.in", completed: false, urgent: true },
          { id: "2", title: "Get EPIC Card", description: "Apply for Voter ID", completed: false },
          { id: "3", title: "Find Your Booth", description: "Use ECI locator", completed: false },
          { id: "4", title: "Research Candidates", description: "Review affidavits", completed: false },
        ],
        keyDates: [{ label: "Voter Registration Deadline", date: "2024-10-15", daysRemaining: 45 }],
      });
      setChecklist([
        { id: "1", title: "Check Voter Roll", description: "Verify at nvsp.in", completed: false, urgent: true },
        { id: "2", title: "Get EPIC Card", description: "Apply for Voter ID", completed: false },
        { id: "3", title: "Find Your Booth", description: "Use ECI locator", completed: false },
        { id: "4", title: "Research Candidates", description: "Review affidavits", completed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const canProceed = () => {
    if (step === 0) return !!profile.ageGroup;
    if (step === 1) return !!profile.state;
    if (step === 2) return profile.firstTimeVoter !== undefined;
    if (step === 3) return !!profile.awarenessLevel;
    return false;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 64, height: 64, borderRadius: "50%",
            border: "4px solid rgba(255,153,51,0.2)",
            borderTop: "4px solid var(--saffron)",
            borderRight: "4px solid var(--color-accent)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "8px" }}>Building Your Election Twin…</h3>
          <p style={{ color: "var(--text-muted)" }}>Our AI is crafting your personalized voter profile</p>
        </div>
      </div>
    );
  }

  if (dashboard) {
    const completedCount = checklist.filter((c) => c.completed).length;
    const progress = Math.round((completedCount / checklist.length) * 100) || 0;

    return (
      <div className="container-main" style={{ padding: "40px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="badge badge-primary" style={{ marginBottom: "16px" }}>
              <Sparkles size={10} aria-hidden="true" />
              Your Election Twin
            </div>
            <h1 style={{ marginBottom: "16px" }}>
              Hello,{" "}
              <span style={{ color: "var(--saffron)" }}>
                {profile.firstTimeVoter ? "First-Time Voter" : "Valued Voter"}!
              </span>
            </h1>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              {dashboard.personalizedMessage}
            </p>
          </div>

          {/* Score + Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {/* Score ring */}
            <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <ScoreRing score={dashboard.awarenessScore} />
              <h4>Awareness Score</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
                Based on your self-reported level and profile
              </p>
            </div>

            {/* Profile card */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <h4 style={{ marginBottom: "20px" }}>Your Profile</h4>
              {[
                { label: "Age Group", value: profile.ageGroup, icon: <User size={14} aria-hidden="true" /> },
                { label: "State", value: profile.state, icon: <MapPin size={14} aria-hidden="true" /> },
                { label: "Voter Type", value: profile.firstTimeVoter ? "First-Time Voter" : "Returning Voter", icon: <Star size={14} aria-hidden="true" /> },
                { label: "Awareness", value: AWARENESS_LABELS[(profile.awarenessLevel || 1) - 1], icon: <Star size={14} aria-hidden="true" /> },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "var(--saffron)" }}>{row.icon}</span>
                    {row.label}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Key dates */}
            <div className="glass-card" style={{ padding: "28px" }}>
              <h4 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} aria-hidden="true" style={{ color: "var(--color-accent)" }} />
                Key Dates
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {dashboard.keyDates?.map((date) => (
                  <div key={date.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{date.label}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{date.date}</div>
                    </div>
                    <span className={`badge ${date.daysRemaining < 14 ? "badge-danger" : "badge-primary"}`}>
                      {date.daysRemaining}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="glass-card" style={{ padding: "32px", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>Your Voter Checklist</h3>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{completedCount}/{checklist.length} completed</span>
            </div>
            <div className="progress-bar" style={{ marginBottom: "24px" }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {checklist.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    id={`checklist-item-${item.id}`}
                    onClick={() => toggleCheck(item.id)}
                    aria-pressed={item.completed}
                    aria-label={`${item.completed ? "Uncheck" : "Check"}: ${item.title}`}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "12px",
                      background: item.completed ? "rgba(16,185,129,0.08)" : "var(--bg-2)",
                      border: `1px solid ${item.completed ? "rgba(16,185,129,0.2)" : "var(--glass-border)"}`,
                      cursor: "none",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ flexShrink: 0, color: item.completed ? "#10B981" : "var(--text-muted)" }}>
                      {item.completed ? <CheckCircle size={22} aria-hidden="true" /> : <Circle size={22} aria-hidden="true" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textDecoration: item.completed ? "line-through" : "none",
                        color: item.completed ? "var(--text-muted)" : "var(--text)",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        {item.title}
                        {item.urgent && !item.completed && (
                          <AlertCircle size={14} color="var(--color-accent)" aria-label="Urgent" />
                        )}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>{item.description}</div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card" style={{ padding: "32px" }}>
            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles size={20} style={{ color: "var(--color-accent)" }} aria-hidden="true" />
              Personalized Tips
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {dashboard.tips?.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(124,58,237,0.06)",
                    border: "1px solid rgba(255,153,51,0.15)",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    lineHeight: 1.6,
                    display: "flex", gap: "10px",
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 800, flexShrink: 0, color: "white",
                  }}>
                    {i + 1}
                  </span>
                  {tip}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Wizard ────────────────────────────────────────────
  const slideVariants = {
    enter: { opacity: 0, x: direction * 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -direction * 60 },
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <StepIndicator current={step} total={totalSteps} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="glass-card" style={{ padding: "40px" }}>
              {step === 0 && (
                <>
                  <h2 style={{ marginBottom: "8px" }}>What&apos;s your <span className="saffron-text">age group?</span></h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>This helps us tailor tips to your generation&apos;s voting concerns.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px" }} role="radiogroup" aria-label="Age group selection">
                    {AGE_GROUPS.map((age) => (
                      <button
                        key={age}
                        id={`age-${age}`}
                        role="radio"
                        aria-checked={profile.ageGroup === age}
                        onClick={() => updateProfile("ageGroup", age)}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "12px",
                          border: `2px solid ${profile.ageGroup === age ? "var(--saffron)" : "var(--glass-border)"}`,
                          background: profile.ageGroup === age ? "rgba(255,153,51,0.15)" : "var(--bg-2)",
                          color: profile.ageGroup === age ? "var(--saffron)" : "var(--text)",
                          fontWeight: profile.ageGroup === age ? 700 : 400,
                          cursor: "none",
                          transition: "all 0.2s",
                          fontSize: "0.95rem",
                        }}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 style={{ marginBottom: "8px" }}>Which <span className="saffron-text">state</span>?</h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.95rem" }}>Election rules and deadlines vary by state.</p>
                  <select
                    id="state-select"
                    value={profile.state || ""}
                    onChange={(e) => updateProfile("state", e.target.value)}
                    aria-label="Select your state"
                    className="input-glass"
                    style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "48px" }}
                  >
                    <option value="" disabled style={{ background: "var(--bg)" }}>Select your state…</option>
                    {STATES.map((s) => <option key={s} value={s} style={{ background: "var(--bg)" }}>{s}</option>)}
                  </select>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 style={{ marginBottom: "8px" }}>First time <span className="saffron-text">voting</span>?</h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>First-time voters get extra onboarding guidance.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} role="radiogroup" aria-label="First time voter selection">
                    {[{ label: "Yes, First Time!", value: true }, { label: "No, I've Voted Before", value: false }].map(({ label, value }) => (
                      <button
                        key={String(value)}
                        id={`first-time-${value}`}
                        role="radio"
                        aria-checked={profile.firstTimeVoter === value}
                        onClick={() => updateProfile("firstTimeVoter", value)}
                        style={{
                          padding: "20px",
                          borderRadius: "16px",
                          border: `2px solid ${profile.firstTimeVoter === value ? "var(--saffron)" : "var(--glass-border)"}`,
                          background: profile.firstTimeVoter === value ? "rgba(255,153,51,0.15)" : "var(--bg-2)",
                          color: profile.firstTimeVoter === value ? "var(--saffron)" : "var(--text)",
                          fontWeight: 600,
                          cursor: "none",
                          fontSize: "0.95rem",
                          transition: "all 0.2s",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 style={{ marginBottom: "8px" }}>Your <span className="saffron-text">awareness level</span>?</h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>Be honest — we&apos;ll customize content to fill exactly your gaps.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} role="radiogroup" aria-label="Awareness level selection">
                    {AWARENESS_LABELS.map((label, i) => (
                      <button
                        key={label}
                        id={`awareness-${i + 1}`}
                        role="radio"
                        aria-checked={profile.awarenessLevel === i + 1}
                        onClick={() => updateProfile("awarenessLevel", i + 1)}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "12px",
                          border: `2px solid ${profile.awarenessLevel === i + 1 ? "var(--saffron)" : "var(--glass-border)"}`,
                          background: profile.awarenessLevel === i + 1 ? "rgba(255,153,51,0.15)" : "var(--bg-2)",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          cursor: "none",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: 32, height: 8, borderRadius: 4,
                            background: `hsl(${i * 30 + 220}, 80%, 65%)`,
                            opacity: (i + 1) / 5,
                          }} />
                          <span style={{ color: profile.awarenessLevel === i + 1 ? "var(--saffron)" : "var(--text)", fontWeight: profile.awarenessLevel === i + 1 ? 700 : 400 }}>
                            {label}
                          </span>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{i + 1}/5</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", gap: "16px" }}>
          <button
            id="wizard-back-btn"
            onClick={prev}
            disabled={step === 0}
            aria-label="Previous step"
            className="btn-primary"
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Back
          </button>
          <button
            id="wizard-next-btn"
            onClick={next}
            disabled={!canProceed() || loading}
            aria-label={step === totalSteps - 1 ? "Generate my Election Twin" : "Next step"}
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center", opacity: canProceed() ? 1 : 0.5 }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
            {step === totalSteps - 1 ? "Generate My Twin 🎯" : "Continue"}
            {step < totalSteps - 1 && <ChevronRight size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
