"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Briefcase, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Loader2, BookOpen, MapPin, Award } from "lucide-react";

const STATES = ["Uttar Pradesh","Maharashtra","West Bengal","Tamil Nadu","Karnataka","Rajasthan","Madhya Pradesh","Bihar","Gujarat","Kerala","Delhi","Punjab","Haryana","Telangana","Andhra Pradesh","Odisha","Jharkhand","Chhattisgarh","Assam","Uttarakhand"];

interface Candidate {
  id: string; name: string; party: string; partyShort: string; partyColor: string;
  age: number; education: string; profession: string; yearsInPolitics: number;
  previousWins: number; assets: string; criminalCases: number;
  keyWorks: string[]; promises: string[]; rating: number; bioSummary: string;
  isWinner?: boolean; currentWork?: string[];
}

function StarRating({ rating }: { rating: number }) {
  const color = rating >= 7.5 ? "#138808" : rating >= 6 ? "#FF9933" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Star size={14} fill={color} color={color} aria-hidden="true" />
      <span style={{ fontWeight: 700, color, fontSize: "0.9rem" }}>{rating.toFixed(1)}</span>
      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>/10</span>
    </div>
  );
}

function CandidateCard({ candidate, index, electionStatus }: { candidate: Candidate; index: number; electionStatus: string }) {
  const [expanded, setExpanded] = useState(false);
  const initial = candidate.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="candidate-card"
    >
      {/* Party color top stripe */}
      <div className="candidate-card-header" style={{ background: candidate.partyColor }} />

      {/* Winner / Lost Badge */}
      {electionStatus === "completed" && (
        <div style={{
          position: "absolute", top: "12px", right: "12px", zIndex: 10,
          padding: "4px 10px", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
          background: candidate.isWinner ? "var(--saffron)" : "var(--bg-3)",
          color: candidate.isWinner ? "white" : "var(--text-muted)",
          boxShadow: candidate.isWinner ? "0 4px 12px rgba(255,153,51,0.4)" : "none",
          display: "flex", alignItems: "center", gap: "4px"
        }}>
          {candidate.isWinner ? <><Award size={12} /> Winner</> : "Lost"}
        </div>
      )}

      <div style={{ padding: "24px", position: "relative" }}>
        {/* Header row */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
            background: `${candidate.partyColor}22`,
            border: `2px solid ${candidate.partyColor}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", fontWeight: 800, color: candidate.partyColor,
          }}>
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" }}>
              <h4 style={{ fontSize: "1rem", marginBottom: "2px" }}>{candidate.name}</h4>
              <StarRating rating={candidate.rating} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: `${candidate.partyColor}20`, color: candidate.partyColor, border: `1px solid ${candidate.partyColor}40` }}>
                {candidate.partyShort}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Age {candidate.age}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>•</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{candidate.yearsInPolitics}yrs in politics</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "16px" }}>
          {candidate.bioSummary}
        </p>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Wins", value: candidate.previousWins, icon: <Award size={13} aria-hidden="true" />, color: "#138808" },
            { label: "Assets", value: candidate.assets, icon: <Briefcase size={13} aria-hidden="true" />, color: "#FF9933" },
            { label: "Cases", value: candidate.criminalCases, icon: <AlertTriangle size={13} aria-hidden="true" />, color: candidate.criminalCases > 0 ? "#EF4444" : "#138808" },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "10px", borderRadius: "10px", background: "var(--bg-2)", border: "1px solid var(--glass-border)", textAlign: "center" }}>
              <div style={{ color: stat.color, display: "flex", justifyContent: "center", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          id={`expand-${candidate.id}`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? "Show less" : "Show more details"}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "var(--bg-2)", border: "1px solid var(--glass-border)", color: "var(--text-muted)", fontSize: "0.82rem", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
        >
          {expanded ? <><ChevronUp size={14} /> Less Info</> : <><ChevronDown size={14} /> Key Works & Promises</>}
        </button>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Education + Profession */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,153,51,0.05)", border: "1px solid rgba(255,153,51,0.15)" }}>
                    <div style={{ fontSize: "0.65rem", color: "var(--saffron)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Education</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>{candidate.education}</div>
                  </div>
                  <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(19,136,8,0.05)", border: "1px solid rgba(19,136,8,0.15)" }}>
                    <div style={{ fontSize: "0.65rem", color: "var(--india-green)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Profession</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>{candidate.profession}</div>
                  </div>
                </div>

                {/* Current Work (Winner only) */}
                {electionStatus === "completed" && candidate.isWinner && candidate.currentWork && candidate.currentWork.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>🔥 What They Are Doing Now</div>
                    <div style={{ background: "rgba(255,153,51,0.05)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,153,51,0.15)" }}>
                      <p style={{ fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.6, marginBottom: "8px" }}>
                        As the elected representative, {candidate.name.split(" ")[0]} is currently focusing on:
                      </p>
                      {candidate.currentWork.map((work, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ color: "var(--saffron)", fontSize: "0.8rem", flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{work}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key works */}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>📋 Past Work</div>
                  {candidate.keyWorks.map((work, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <CheckCircle size={13} color="#138808" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{work}</span>
                    </div>
                  ))}
                </div>

                {/* Promises */}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--india-green)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>🎯 Key Promises</div>
                  {candidate.promises.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ color: "var(--saffron)", fontSize: "0.8rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CandidatesPage() {
  const [state, setState] = useState("");
  const [constituency, setConstituency] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [electionStatus, setElectionStatus] = useState<"ongoing" | "completed">("ongoing");

  const search = async () => {
    if (!state || !constituency.trim()) return;
    setLoading(true); setError(""); setSearched(false);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, constituency, electionStatus }),
      });
      const data = await res.json();
      
      let fetchedCandidates = data.candidates || [];
      if (electionStatus === "completed") {
        fetchedCandidates.sort((a: Candidate, b: Candidate) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0));
      }
      setCandidates(fetchedCandidates);
      setSearched(true);
    } catch {
      setError("Could not fetch candidate data. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", padding: "40px 0 80px" }}>
      <div className="container-main">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="badge badge-saffron" style={{ marginBottom: "16px" }}>
            <BookOpen size={10} aria-hidden="true" />
            Know Your Candidates
          </div>
          <h1 style={{ marginBottom: "16px" }}>
            Who Is Running In{" "}
            <span className="saffron-text">Your Constituency?</span>
          </h1>
          <div className="tricolor-line" style={{ maxWidth: "140px", margin: "0 auto 20px" }} />
          <p style={{ color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
            Search by your state and constituency to explore candidates — their background, past work, track record, assets, and election promises.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card" style={{ padding: "28px", maxWidth: "720px", margin: "0 auto 48px" }}>
            
            {/* Election Status Toggle */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--glass-border)" }}>
              <button
                onClick={() => setElectionStatus("ongoing")}
                className={electionStatus === "ongoing" ? "btn-primary" : "btn-secondary"}
                style={{ flex: 1, padding: "10px", fontSize: "0.85rem", justifyContent: "center" }}
              >
                Ongoing Election
              </button>
              <button
                onClick={() => setElectionStatus("completed")}
                className={electionStatus === "completed" ? "btn-primary" : "btn-secondary"}
                style={{ flex: 1, padding: "10px", fontSize: "0.85rem", justifyContent: "center", background: electionStatus === "completed" ? "var(--india-green)" : "" }}
              >
                Completed Election
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "14px", alignItems: "end" }}>
              {/* State */}
              <div>
                <label htmlFor="state-select" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  <MapPin size={11} style={{ display: "inline", marginRight: "4px" }} aria-hidden="true" />
                  State
                </label>
                <select
                  id="state-select"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  aria-label="Select state"
                  className="input-glass"
                  style={{ appearance: "none", paddingRight: "40px", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                >
                  <option value="" style={{ background: "var(--bg)" }}>Choose state…</option>
                  {STATES.map(s => <option key={s} value={s} style={{ background: "var(--bg)" }}>{s}</option>)}
                </select>
              </div>

              {/* Constituency */}
              <div>
                <label htmlFor="constituency-input" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  <Search size={11} style={{ display: "inline", marginRight: "4px" }} aria-hidden="true" />
                  Constituency
                </label>
                <input
                  id="constituency-input"
                  type="text"
                  value={constituency}
                  onChange={e => setConstituency(e.target.value)}
                  placeholder="e.g. Lucknow, Patna Sahib…"
                  aria-label="Enter constituency name"
                  maxLength={80}
                  className="input-glass"
                  onKeyDown={e => e.key === "Enter" && search()}
                />
              </div>

              {/* Button */}
              <button
                id="candidates-search-btn"
                onClick={search}
                disabled={!state || !constituency.trim() || loading}
                className="btn-primary"
                aria-label="Search candidates"
                style={{ padding: "14px 24px", opacity: (!state || !constituency.trim()) ? 0.5 : 1, whiteSpace: "nowrap" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
                {loading ? "Loading…" : "Search"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: "80px 0" }}>
              <div className="loader-ring" style={{ margin: "0 auto 20px" }} />
              <h3 style={{ marginBottom: "8px" }}>Finding Candidates…</h3>
              <p style={{ color: "var(--text-muted)" }}>AI is generating profiles for {constituency}, {state}</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "40px" }}>
              <AlertTriangle size={32} color="#EF4444" style={{ marginBottom: "12px" }} aria-hidden="true" />
              <p style={{ color: "#FCA5A5" }}>{error}</p>
            </motion.div>
          )}

          {searched && !loading && candidates.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Result header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ marginBottom: "4px" }}>
                    <span className="saffron-text">{constituency}</span>
                    {" "}Constituency
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{state} · {candidates.length} candidates found</p>
                </div>
                <div className="badge badge-green">🗳️ {candidates.length} Candidates</div>
              </div>

              {/* Party comparison strip */}
              <div className="glass-card" style={{ padding: "20px 24px", marginBottom: "28px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Party Overview</div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {candidates.map(c => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.partyColor }} />
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{c.party}</span>
                      <StarRating rating={c.rating} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {candidates.map((c, i) => (
                  <CandidateCard key={c.id} candidate={c} index={i} electionStatus={electionStatus} />
                ))}
              </div>

              {/* Disclaimer */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: "32px", padding: "16px 20px", borderRadius: "12px", background: "rgba(255,153,51,0.05)", border: "1px solid rgba(255,153,51,0.15)", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <AlertTriangle size={16} color="var(--saffron)" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--saffron)" }}>Note:</strong> Candidate profiles are AI-generated for educational purposes. Always verify with{" "}
                  <a href="https://affidavit.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>ECI's affidavit portal</a> and{" "}
                  <a href="https://myneta.info" target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>myneta.info</a> for official data.
                </p>
              </motion.div>
            </motion.div>
          )}

          {!loading && !searched && !error && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: 80, height: 80, margin: "0 auto 20px", borderRadius: "24px", background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={34} color="var(--saffron)" aria-hidden="true" />
              </div>
              <h3 style={{ marginBottom: "10px" }}>Search Your Constituency</h3>
              <p style={{ color: "var(--text-muted)", maxWidth: "360px", margin: "0 auto", fontSize: "0.9rem" }}>
                Select your state and enter your constituency name to explore all candidate profiles.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
