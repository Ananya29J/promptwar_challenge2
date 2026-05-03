"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, ChevronRight, Map, Info, X } from "lucide-react";
import type { FlowNode } from "@/lib/types";

// ─── Flow Data ─────────────────────────────────────────
const FLOW_NODES: Omit<FlowNode, "isActive" | "isCompleted">[] = [
  {
    id: "registration",
    label: "Voter Registration",
    phase: "registration",
    icon: "📝",
    description: "Citizens register to vote by submitting Form 6 (for new voters) on NVSP or at their nearest ERO office. Registration closes 30 days before polling day. Documents required: Proof of Age, Proof of Address, and a recent photograph.",
  },
  {
    id: "verification",
    label: "ID Verification",
    phase: "verification",
    icon: "🔍",
    description: "The Electoral Registration Officer (ERO) verifies your application, confirms your identity, and checks for duplicate entries. Once approved, your name appears in the Electoral Roll. You receive your EPIC (Voter ID) card.",
  },
  {
    id: "voting",
    label: "Casting Your Vote",
    phase: "voting",
    icon: "🗳️",
    description: "On polling day, visit your designated booth with valid ID. Your name is checked in the marked copy of the roll, you receive an indelible ink mark, and you proceed to the EVM. Press the button next to your candidate once and wait for the beep and green light.",
  },
  {
    id: "counting",
    label: "Vote Counting",
    phase: "counting",
    icon: "🔢",
    description: "After polling closes, VVPAT slips are matched with EVM totals. Counting is overseen by Returning Officers with party representatives present. Results are declared constituency-by-constituency as they are tallied.",
  },
  {
    id: "results",
    label: "Results & Oath",
    phase: "results",
    icon: "🏛️",
    description: "The winning candidate (with majority of valid votes) is declared elected. They receive a certificate of election and are sworn in to office. The entire cycle is monitored by the Election Commission of India to ensure fairness.",
  },
];

const PHASE_COLORS: Record<string, string> = {
  registration: "#7C3AED",
  verification: "#3B82F6",
  voting: "#10B981",
  counting: "#F59E0B",
  results: "#EC4899",
};

const PHASE_LABELS: Record<string, string> = {
  registration: "Step 1",
  verification: "Step 2",
  voting: "Step 3",
  counting: "Step 4",
  results: "Step 5",
};

export default function FlowMapPage() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setExpandedNode(nodeId === expandedNode ? null : nodeId);
  };

  const markComplete = (nodeId: string) => {
    setCompletedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const progress = Math.round((completedNodes.size / FLOW_NODES.length) * 100);

  const activeNode = FLOW_NODES.find((n) => n.id === expandedNode);
  const activeColor = activeNode ? PHASE_COLORS[activeNode.phase] : "var(--saffron)";

  return (
    <div className="container-main" style={{ padding: "40px 24px 80px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <div className="badge badge-primary" style={{ marginBottom: "16px" }}>
          <Map size={10} aria-hidden="true" />
          Visual Flow Map
        </div>
        <h1 style={{ marginBottom: "16px" }}>
          How Elections{" "}
          <span className="gradient-text">Work</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.8 }}>
          Explore the complete election journey — from voter registration to final results. Click any node to dive deeper, and mark steps as you learn them.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="glass-card" style={{ padding: "24px 32px", marginBottom: "48px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontWeight: 600 }}>Your Journey Progress</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{completedNodes.size}/{FLOW_NODES.length} steps</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {FLOW_NODES.map((node) => (
            <div
              key={node.id}
              title={node.label}
              style={{
                width: 12, height: 12,
                borderRadius: "50%",
                background: completedNodes.has(node.id)
                  ? PHASE_COLORS[node.phase]
                  : activeNodeId === node.id
                  ? "var(--glass-border)"
                  : "var(--bg-3)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop flow map */}
      <div className="flow-map-desktop">
        {/* Node row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
          {FLOW_NODES.map((node, i) => {
            const color = PHASE_COLORS[node.phase];
            const isActive = activeNodeId === node.id;
            const isCompleted = completedNodes.has(node.id);

            return (
              <div key={node.id} style={{ display: "flex", alignItems: "center" }}>
                {/* Connector */}
                {i > 0 && (
                  <motion.div
                    style={{
                      width: "clamp(40px, 6vw, 80px)",
                      height: "2px",
                      background: completedNodes.has(FLOW_NODES[i - 1].id)
                        ? `linear-gradient(90deg, ${PHASE_COLORS[FLOW_NODES[i-1].phase]}, ${color})`
                        : "var(--glass-border)",
                      transition: "background 0.5s",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Node */}
                <div className="flow-node">
                  <motion.button
                    id={`flow-node-${node.id}`}
                    onClick={() => handleNodeClick(node.id)}
                    aria-expanded={expandedNode === node.id}
                    aria-label={`${node.label}: ${isCompleted ? "Completed" : "Not completed"}. ${expandedNode === node.id ? "Click to collapse" : "Click to expand"}`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 80, height: 80,
                      borderRadius: "50%",
                      background: isCompleted ? color : isActive ? `${color}22` : "var(--bg-2)",
                      border: `2px solid ${isActive || isCompleted ? color : "var(--glass-border)"}`,
                      boxShadow: isActive ? `0 0 0 4px ${color}22, 0 0 24px ${color}44` : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "none",
                      transition: "all 0.3s",
                      fontSize: "1.8rem",
                      position: "relative",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={30} color="white" aria-hidden="true" />
                    ) : (
                      <span aria-hidden="true">{node.icon}</span>
                    )}
                    {/* Step label */}
                    <div style={{
                      position: "absolute",
                      top: "-22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                    }}>
                      {PHASE_LABELS[node.phase]}
                    </div>
                  </motion.button>

                  <div style={{ textAlign: "center", maxWidth: "110px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: isActive ? color : "var(--text)", lineHeight: 1.3 }}>
                      {node.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        <AnimatePresence>
          {expandedNode && activeNode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="glass-card"
                style={{
                  padding: "32px",
                  border: `1px solid ${activeColor}33`,
                  background: `${activeColor}08`,
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "16px",
                      background: `${activeColor}22`,
                      border: `1px solid ${activeColor}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.5rem",
                    }}>
                      {activeNode.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: activeColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                        {PHASE_LABELS[activeNode.phase]} of 5
                      </div>
                      <h3>{activeNode.label}</h3>
                    </div>
                  </div>
                  <button
                    id={`close-node-${expandedNode}`}
                    onClick={() => setExpandedNode(null)}
                    aria-label="Close detail panel"
                    style={{ background: "var(--bg-2)", border: "none", borderRadius: "8px", padding: "6px", color: "var(--text-muted)", cursor: "none", flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "24px" }}>
                  {activeNode.description}
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    id={`mark-complete-${expandedNode}`}
                    onClick={() => markComplete(expandedNode)}
                    aria-pressed={completedNodes.has(expandedNode)}
                    className="btn-primary"
                    style={{
                      padding: "10px 20px",
                      fontSize: "0.85rem",
                      background: completedNodes.has(expandedNode)
                        ? "rgba(16,185,129,0.2)"
                        : "var(--grad-saffron)",
                      border: completedNodes.has(expandedNode) ? "1px solid rgba(16,185,129,0.4)" : "none",
                      color: completedNodes.has(expandedNode) ? "#10B981" : "white",
                    }}
                  >
                    {completedNodes.has(expandedNode) ? (
                      <><CheckCircle size={14} aria-hidden="true" /> Completed</>
                    ) : (
                      <><Circle size={14} aria-hidden="true" /> Mark as Learned</>
                    )}
                  </button>
                  {/* Navigate to next */}
                  {FLOW_NODES.findIndex((n) => n.id === expandedNode) < FLOW_NODES.length - 1 && (
                    <button
                      id={`next-node-${expandedNode}`}
                      onClick={() => {
                        const idx = FLOW_NODES.findIndex((n) => n.id === expandedNode);
                        handleNodeClick(FLOW_NODES[idx + 1].id);
                      }}
                      className="btn-secondary"
                      style={{ padding: "10px 20px", fontSize: "0.85rem" }}
                      aria-label="Go to next step"
                    >
                      Next Step <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile list view */}
      <div className="flow-map-mobile" style={{ display: "none" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FLOW_NODES.map((node, i) => {
            const color = PHASE_COLORS[node.phase];
            const isCompleted = completedNodes.has(node.id);
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  id={`mobile-flow-node-${node.id}`}
                  onClick={() => handleNodeClick(node.id)}
                  aria-expanded={expandedNode === node.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: isCompleted ? `${color}12` : expandedNode === node.id ? `${color}10` : "var(--bg-2)",
                    border: `1px solid ${expandedNode === node.id || isCompleted ? color + "44" : "var(--glass-border)"}`,
                    cursor: "none",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{node.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{node.label}</div>
                    <div style={{ fontSize: "0.78rem", color: color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {PHASE_LABELS[node.phase]}
                    </div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle size={20} color={color} aria-label="Completed" />
                  ) : (
                    <Info size={20} color="var(--text-muted)" aria-hidden="true" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedNode === node.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "20px", background: `${color}06`, border: `1px solid ${color}22`, borderTop: "none", borderRadius: "0 0 16px 16px" }}>
                        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: "16px" }}>
                          {node.description}
                        </p>
                        <button
                          id={`mobile-mark-${node.id}`}
                          onClick={() => markComplete(node.id)}
                          aria-pressed={isCompleted}
                          className="btn-primary"
                          style={{ padding: "10px 18px", fontSize: "0.82rem" }}
                        >
                          {isCompleted ? "✓ Learned!" : "Mark as Learned"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: "24px 32px", marginTop: "32px" }}>
        <h4 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={16} aria-hidden="true" style={{ color: "var(--saffron)" }} />
          Phase Legend
        </h4>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {FLOW_NODES.map((node) => (
            <button
              key={node.id}
              id={`legend-${node.id}`}
              onClick={() => handleNodeClick(node.id)}
              aria-label={`Jump to ${node.label}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "transparent",
                border: "none",
                cursor: "none",
              }}
            >
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: PHASE_COLORS[node.phase],
                boxShadow: `0 0 8px ${PHASE_COLORS[node.phase]}66`,
              }} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{node.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .flow-map-desktop { display: none; }
          .flow-map-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
