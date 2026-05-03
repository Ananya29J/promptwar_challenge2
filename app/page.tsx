"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Vote, Zap, Map, MessageSquare, ChevronRight,
  Users, ArrowRight, Sparkles, Play, BookOpen
} from "lucide-react";

/* ── Ashoka Chakra SVG ───────────────────────────────── */
function AshokaChakra({ size = 200, opacity = 0.12, className = "" }: { size?: number; opacity?: number; className?: string }) {
  const spokes = 24;
  return (
    <svg
      width={size} height={size} viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <circle cx="100" cy="100" r="95" fill="none" stroke="#000080" strokeWidth="4" />
      <circle cx="100" cy="100" r="10" fill="#000080" />
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * 360) / spokes;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 10 * Math.cos(rad);
        const y1 = 100 + 10 * Math.sin(rad);
        const x2 = 100 + 90 * Math.cos(rad);
        const y2 = 100 + 90 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <circle cx="100" cy="100" r="75" fill="none" stroke="#000080" strokeWidth="1.5" strokeDasharray="8 4" />
    </svg>
  );
}

/* ── Tricolor Particle Field ─────────────────────────── */
const COLORS = ["#FF9933", "#FF9933", "#138808", "#138808", "rgba(255,255,255,0.6)"];
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  startY: 85 + Math.random() * 15,
  size: Math.random() * 4 + 2,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  dur: 5 + Math.random() * 6,
  delay: -(Math.random() * 8),
}));

/* ── Animated Counter ───────────────────────────────── */
function StatCard({ value, suffix, label, index, colorGrad }: { value: number; suffix: string; label: string; index: number; colorGrad: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= value) { setVal(value); clearInterval(timer); }
      else setVal(Math.floor(cur));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1 }} style={{ textAlign: "center", background: "var(--bg-2)", border: "1px solid var(--glass-border)", borderRadius: "var(--r-lg)", padding: "24px 16px", boxShadow: "var(--shadow-card)" }}>
      <div className="stat-number" style={{ background: colorGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {val.toLocaleString("en-IN")}{suffix}
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px", fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

/* ── Feature Cards ───────────────────────────────────── */
const FEATURES = [
  { id: "twin", href: "/twin", icon: <Users size={26} />, color: "#FF9933", bg: "var(--bg-2)", border: "rgba(255,153,51,0.5)", label: "PERSONALIZED", title: "Your Election Twin", desc: "AI crafts your voter profile — deadlines, checklist, tips tailored to your age, state, and awareness level." },
  { id: "simulator", href: "/simulator", icon: <Play size={26} />, color: "#138808", bg: "var(--bg-2)", border: "rgba(19,136,8,0.5)", label: "GAMIFIED", title: "Election Simulator", desc: "Go through a gamified voting journey — register, choose method, cast your vote. Earn badges!" },
  { id: "scenarios", href: "/scenarios", icon: <MessageSquare size={26} />, color: "#FF9933", bg: "var(--bg-2)", border: "rgba(255,153,51,0.5)", label: "AI-POWERED", title: "What Happens If…?", desc: "Ask any what-if question. Our AI gives you immediate, legal, and long-term consequences." },
  { id: "flowmap", href: "/flowmap", icon: <Map size={26} />, color: "#138808", bg: "var(--bg-2)", border: "rgba(19,136,8,0.5)", label: "VISUAL", title: "Live Flow Map", desc: "Interactive node graph of Registration → Verification → Voting → Counting → Results." },
  { id: "candidates", href: "/candidates", icon: <BookOpen size={26} />, color: "#000080", bg: "var(--bg-2)", border: "rgba(26,58,143,0.6)", label: "NEW", title: "Know Your Candidates", desc: "Explore candidates from your constituency — past work, party, track record, and AI insights." },
];

const TICKER_ITEMS = [
  "🗳️ Your Vote is Your Right",
  "🇮🇳 Jai Hind",
  "📜 Know Before You Vote",
  "⚖️ Every Vote Counts",
  "🌟 Be an Informed Citizen",
  "🏛️ Democracy Begins With You",
  "🗳️ Your Vote is Your Right",
  "🇮🇳 Jai Hind",
  "📜 Know Before You Vote",
  "⚖️ Every Vote Counts",
  "🌟 Be an Informed Citizen",
  "🏛️ Democracy Begins With You",
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>

      {/* ═══ HERO ════════════════════════════════════════ */}
      <section
        aria-label="Hero"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative" }}
      >
        {/* Tricolor top/bottom stripes */}
        <div className="hero-flag-stripe hero-flag-stripe-top" aria-hidden="true" />
        <div className="hero-flag-stripe hero-flag-stripe-bottom" aria-hidden="true" />

        {/* Wave backgrounds */}
        <div className="tricolor-wave" aria-hidden="true">
          <div className="wave-saffron" />
          <div className="wave-green" />
          <div className="wave-blue" />
        </div>

        {/* Particles */}
        {mounted && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  bottom: `${p.startY - 85}%`,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  // @ts-expect-error css vars
                  "--dur": `${p.dur}s`,
                  "--delay": `${p.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Spinning Ashoka Chakras */}
        <div style={{ position: "absolute", top: "10%", right: "5%", pointerEvents: "none" }} aria-hidden="true">
          <div className="chakra-spin-slow">
            <AshokaChakra size={180} opacity={0.08} />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "15%", left: "3%", pointerEvents: "none" }} aria-hidden="true">
          <div className="chakra-reverse">
            <AshokaChakra size={120} opacity={0.06} />
          </div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: "32px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 24px", borderRadius: "999px", background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.3)", fontSize: "0.8rem", fontWeight: 700, color: "#FFBE7A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ fontSize: "1rem" }}>🇮🇳</span>
              AI-Powered Civic Education for Bharat
              <Sparkles size={12} aria-hidden="true" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} style={{ marginBottom: "28px", lineHeight: 1.15 }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: "block", color: "var(--saffron)", textShadow: "0 0 40px rgba(255,153,51,0.4)" }}>
              Your Vote.
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "block", color: "var(--text)" }}>
              Your Voice.
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ display: "block", color: "var(--india-green)", textShadow: "0 0 40px rgba(19,136,8,0.4)" }}>
              Guided by AI.
            </motion.span>
          </motion.h1>

          {/* Tricolor bar below headline */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} style={{ transformOrigin: "center", marginBottom: "28px" }}>
            <div className="tricolor-line" style={{ maxWidth: "200px", margin: "0 auto" }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} style={{ fontSize: "clamp(1rem,2.5vw,1.2rem)", color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto 44px", lineHeight: 1.8 }}>
            VoteWise transforms complex election systems into personalized, gamified journeys — helping every Indian citizen participate with confidence.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/twin" className="btn-primary" id="hero-start-cta">
              <Zap size={18} aria-hidden="true" />
              Start My Journey
            </Link>
            <Link href="/candidates" className="btn-secondary" id="hero-candidates-cta">
              <BookOpen size={18} aria-hidden="true" />
              Know Your Candidates
            </Link>
          </motion.div>
        </div>


      </section>

      <div className="ticker-wrap" style={{ padding: "12px 0", background: "rgba(255,153,51,0.06)", borderTop: "1px solid rgba(255,153,51,0.2)", borderBottom: "1px solid rgba(255,153,51,0.2)" }}>
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} style={{ fontSize: "0.82rem", color: "rgba(255,153,51,0.8)", fontWeight: 600, letterSpacing: "0.04em", flexShrink: 0 }}>
              {item}
              <span style={{ display: "inline-block", width: "2px", height: "14px", background: "rgba(255,153,51,0.3)", margin: "0 24px", verticalAlign: "middle" }} />
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STATS ═══════════════════════════════════════ */}
      <section aria-label="Key statistics" className="section-sm">
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "32px" }}>
            <StatCard value={970} suffix="M+" label="Eligible Voters in India" index={0} colorGrad="var(--grad-saffron)" />
            <StatCard value={64} suffix="%" label="Avg Voter Turnout (2024)" index={1} colorGrad="var(--grad-green)" />
            <StatCard value={543} suffix="" label="Lok Sabha Constituencies" index={2} colorGrad="var(--grad-saffron)" />
            <StatCard value={5} suffix=" Modules" label="To Master Voting" index={3} colorGrad="var(--grad-green)" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ════════════════════════════════════ */}
      <section aria-labelledby="features-heading" className="section" style={{ position: "relative" }}>
        {/* Ashoka Chakra background */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} aria-hidden="true">
          <div className="chakra-spin-slow"><AshokaChakra size={600} opacity={0.02} /></div>
        </div>
        <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 id="features-heading" style={{ marginBottom: "16px" }}>
              Everything to Vote{" "}
              <span className="saffron-text">Smart</span>
              {" "}& <span className="green-text">Informed</span>
            </h2>
            <div className="tricolor-line" style={{ maxWidth: "120px", margin: "20px auto 0" }} />
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.1 }}>
                <Link href={f.href} id={`feature-${f.id}`} aria-label={`Go to ${f.title}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: `0 12px 40px ${f.color}33` }}
                    style={{
                      background: f.bg, border: `1px solid ${f.border}`, borderRadius: "var(--r-lg)",
                      padding: "28px", height: "100%", cursor: "none", transition: "border-color 0.3s",
                    }}
                  >
                    {/* Top accent stripe */}
                    <div style={{ height: 3, background: f.id === "candidates" ? "var(--grad-chakra)" : f.color === "#FF9933" ? "var(--grad-saffron)" : "var(--grad-green)", marginBottom: "20px", marginLeft: "-28px", marginRight: "-28px", marginTop: "-28px", borderRadius: "var(--r-lg) var(--r-lg) 0 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "14px", background: `${f.color}18`, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color }}>
                        {f.icon}
                      </div>
                      <span className="badge" style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30`, fontSize: "0.65rem" }}>
                        {f.label}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: "10px", color: "var(--text)" }}>{f.title}</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "20px" }}>{f.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: f.color, fontSize: "0.82rem", fontWeight: 700 }}>
                      Explore <ArrowRight size={13} aria-hidden="true" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLAG VISUAL SECTION ═════════════════════════ */}
      <section aria-label="About VoteWise" className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, rgba(255,153,51,0.08) 50%, transparent 100%)" }} aria-hidden="true" />
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "48px", alignItems: "center" }}>

            {/* Left: Points */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="badge badge-saffron" style={{ marginBottom: "20px" }}>🇮🇳 Why VoteWise?</div>
              <h2 style={{ marginBottom: "20px" }}>
                Democracy{" "}
                <span className="saffron-text">Starts With</span>{" "}
                <span className="green-text">You</span>
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "32px" }}>
                Millions of eligible Indian voters skip elections due to confusing processes, lack of information, or logistical barriers. VoteWise removes every obstacle.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { icon: "🟠", text: "Based on official ECI & NVSP guidelines", color: "var(--saffron)" },
                  { icon: "⚪", text: "AI-powered personalization for every voter", color: "#94A3B8" },
                  { icon: "🟢", text: "Gamified to make civic education fun", color: "var(--india-green)" },
                  { icon: "🔵", text: "Fully accessible and mobile-optimized", color: "#90B4FF" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                    <span style={{ color: "var(--text)", fontSize: "0.95rem" }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: CTA card with Chakra */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="glass-card" style={{ padding: "40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                {/* Animated chakra behind content */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} aria-hidden="true">
                  <div className="chakra-spin"><AshokaChakra size={240} opacity={0.06} /></div>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: 72, height: 72, margin: "0 auto 20px", borderRadius: "20px", background: "var(--grad-saffron)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-saffron)" }} className="animate-pulse-glow">
                    <Vote size={36} color="white" aria-hidden="true" />
                  </div>
                  <h3 style={{ marginBottom: "12px" }}>Ready to Participate?</h3>
                  <p style={{ color: "var(--text-muted)", marginBottom: "28px", fontSize: "0.95rem" }}>
                    Set up your Election Twin in 2 minutes and get a fully personalized voting roadmap for your state.
                  </p>
                  <Link href="/twin" className="btn-primary" id="cta-section-twin" style={{ width: "100%", justifyContent: "center" }}>
                    Create My Election Twin
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                  <div style={{ marginTop: "16px" }}>
                    <Link href="/candidates" className="btn-secondary" id="cta-section-candidates" style={{ width: "100%", justifyContent: "center" }}>
                      <BookOpen size={16} aria-hidden="true" />
                      Explore Candidates
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FACTS TICKER ════════════════════════════════ */}
      <section className="section-sm" style={{ borderTop: "1px solid var(--glass-border)", background: "rgba(19,136,8,0.03)" }}>
        <div className="container-main" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            {["Register on NVSP","Check Electoral Roll","Carry Valid ID","Vote Early","Indelible Ink = Proof of Vote"].map((fact, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="badge badge-green">
                ✓ {fact}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid var(--glass-border)", padding: "40px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: "0.82rem" }}>
        <div className="container-main">
          <div className="tricolor-line" style={{ maxWidth: "80px", margin: "0 auto 20px" }} />
          <p style={{ marginBottom: "8px", fontWeight: 600, color: "var(--text-muted)" }}>© 2024 VoteWise — AI-Powered Civic Education for India 🇮🇳</p>
          <p>Not affiliated with the Election Commission of India. For official information, visit{" "}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>eci.gov.in</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
