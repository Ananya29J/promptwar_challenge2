"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, AlertCircle, Info, ChevronRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import type { ScenarioResult } from "@/lib/types";

const PRESET_SCENARIOS = [
  { id: "p1", question: "What if I miss the voter registration deadline?", category: "Registration" },
  { id: "p2", question: "What if I lose my Voter ID card before election day?", category: "Documents" },
  { id: "p3", question: "What if my name is not on the voter list at the booth?", category: "Polling Day" },
  { id: "p4", question: "What if I vote for the wrong candidate by mistake on EVM?", category: "Voting" },
  { id: "p5", question: "What if there's a power cut at my polling station?", category: "Logistics" },
  { id: "p6", question: "What if I am offered money to vote for a particular party?", category: "Integrity" },
  { id: "p7", question: "What if I am not allowed to enter the polling booth?", category: "Rights" },
  { id: "p8", question: "What if I want to vote but I am in a different city on election day?", category: "Logistics" },
];

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string; Icon: typeof AlertTriangle }> = {
  high: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", label: "High Impact", Icon: AlertTriangle },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", label: "Moderate Impact", Icon: AlertCircle },
  low: { color: "#10B981", bg: "rgba(16,185,129,0.08)", label: "Low Impact", Icon: Info },
};

const CATEGORY_COLORS: Record<string, string> = {
  Registration: "#7C3AED",
  Documents: "#F59E0B",
  "Polling Day": "#EC4899",
  Voting: "#10B981",
  Logistics: "#3B82F6",
  Integrity: "#EF4444",
  Rights: "#8B5CF6",
};

function ResultPanel({ result }: { result: ScenarioResult }) {
  const severity = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.medium;
  const SeverityIcon = severity.Icon;

  const items = [
    { label: "Immediate Consequence", value: result.immediateConsequence, color: severity.color },
    { label: "Short-Term Impact", value: result.shortTermImpact, color: "var(--text)" },
    { label: "Long-Term Impact", value: result.longTermImpact, color: "var(--text)" },
    { label: "Legal Implications", value: result.legalImplication, color: "#F59E0B" },
    { label: "Our Advice", value: result.advice, color: "#10B981" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Severity banner */}
      <div style={{
        padding: "16px 20px",
        borderRadius: "12px",
        background: severity.bg,
        border: `1px solid ${severity.color}33`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
      }}>
        <SeverityIcon size={20} color={severity.color} aria-hidden="true" />
        <div>
          <div style={{ fontWeight: 700, color: severity.color }}>{severity.label}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
            &ldquo;{result.scenario}&rdquo;
          </div>
        </div>
      </div>

      {/* Result cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card"
            style={{ padding: "20px 24px" }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              {item.label}
            </div>
            <p style={{ color: item.color, lineHeight: 1.7, fontSize: "0.95rem" }}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ScenariosPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const askScenario = async (scenario: string) => {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data.result);
    } catch {
      setError("Failed to generate a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setQuery(preset.question);
    setActiveCategory(preset.category);
    askScenario(preset.question);
  };

  const reset = () => {
    setQuery("");
    setResult(null);
    setError("");
    setActiveCategory(null);
  };

  const categories = [...new Set(PRESET_SCENARIOS.map((p) => p.category))];

  const filteredPresets = activeCategory
    ? PRESET_SCENARIOS.filter((p) => p.category === activeCategory)
    : PRESET_SCENARIOS;

  return (
    <div className="container-main" style={{ padding: "40px 24px 80px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <div className="badge badge-primary" style={{ marginBottom: "16px" }}>
          <Sparkles size={10} aria-hidden="true" />
          AI Scenario Engine
        </div>
        <h1 style={{ marginBottom: "16px" }}>
          What Happens{" "}
          <span className="gradient-text">If…?</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.8 }}>
          Curious about any election scenario? Ask anything — our AI analyzes the immediate consequences, legal implications, and long-term democratic impact.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "32px", alignItems: "start" }}>
        {/* Left Panel — Query */}
        <div>
          {/* Search box */}
          <div style={{ marginBottom: "24px" }}>
            <form
              onSubmit={(e) => { e.preventDefault(); askScenario(query); }}
              style={{ display: "flex", gap: "12px" }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={18}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  id="scenario-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What if I… ?"
                  aria-label="Enter your election scenario"
                  maxLength={300}
                  className="input-glass"
                  style={{ paddingLeft: "48px", paddingRight: "16px" }}
                />
              </div>
              <button
                id="scenario-ask-btn"
                type="submit"
                className="btn-primary"
                disabled={!query.trim() || loading}
                aria-label="Analyze this scenario"
                style={{ padding: "14px 20px", flexShrink: 0 }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <ChevronRight size={18} aria-hidden="true" />}
                {loading ? "Analyzing…" : "Ask"}
              </button>
            </form>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button
              id="category-all"
              onClick={() => setActiveCategory(null)}
              className={activeCategory === null ? "badge badge-primary" : "badge"}
              style={{
                background: activeCategory === null ? "rgba(124,58,237,0.2)" : "var(--bg-2)",
                border: `1px solid ${activeCategory === null ? "rgba(124,58,237,0.4)" : "var(--glass-border)"}`,
                color: activeCategory === null ? "var(--color-primary-light)" : "var(--text-muted)",
                cursor: "none",
                padding: "6px 14px",
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: activeCategory === cat ? `${CATEGORY_COLORS[cat]}22` : "var(--bg-2)",
                  border: `1px solid ${activeCategory === cat ? CATEGORY_COLORS[cat] + "44" : "var(--glass-border)"}`,
                  color: activeCategory === cat ? CATEGORY_COLORS[cat] : "var(--text-muted)",
                  cursor: "none",
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Preset list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Common Scenarios
            </div>
            {filteredPresets.map((preset, i) => (
              <motion.button
                key={preset.id}
                id={`preset-${preset.id}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handlePreset(preset)}
                aria-label={`Ask: ${preset.question}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: query === preset.question ? "rgba(124,58,237,0.08)" : "var(--bg-2)",
                  border: `1px solid ${query === preset.question ? "rgba(124,58,237,0.3)" : "var(--glass-border)"}`,
                  cursor: "none",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                whileHover={{ x: 4 }}
              >
                <span style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  background: `${CATEGORY_COLORS[preset.category] || "#7C3AED"}22`,
                  color: CATEGORY_COLORS[preset.category] || "var(--color-primary-light)",
                  flexShrink: 0,
                }}>
                  {preset.category}
                </span>
                <span style={{ color: "var(--text)", fontSize: "0.9rem", flex: 1 }}>{preset.question}</span>
                <ChevronRight size={14} color="var(--text-muted)" aria-hidden="true" style={{ flexShrink: 0 }} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Panel — Results */}
        <div style={{ minHeight: "400px" }}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: "20px" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    border: "3px solid rgba(124,58,237,0.1)",
                    borderTop: "3px solid var(--color-primary)",
                    borderRight: "3px solid var(--color-accent)",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 600, marginBottom: "6px" }}>Analyzing Scenario…</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>AI is computing consequences</div>
                </div>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "24px", borderRadius: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <AlertTriangle size={24} color="#EF4444" style={{ marginBottom: "12px" }} aria-hidden="true" />
                <p style={{ color: "#FCA5A5" }}>{error}</p>
                <button onClick={reset} className="btn-ghost" style={{ marginTop: "12px" }}>
                  <RotateCcw size={14} aria-hidden="true" /> Try Again
                </button>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3>Analysis Result</h3>
                  <button id="scenario-reset-btn" onClick={reset} className="btn-ghost">
                    <RotateCcw size={14} aria-hidden="true" /> New Scenario
                  </button>
                </div>
                <ResultPanel result={result} />
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: "16px", textAlign: "center" }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: "24px",
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Search size={32} color="var(--color-primary-light)" aria-hidden="true" />
                </div>
                <h4>Ask Your Scenario</h4>
                <p style={{ color: "var(--text-muted)", maxWidth: "280px", fontSize: "0.9rem" }}>
                  Type any &quot;What if…&quot; question or click a preset on the left to see AI-powered consequences.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          [data-twin-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
