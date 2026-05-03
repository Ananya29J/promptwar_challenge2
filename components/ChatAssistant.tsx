"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, ChevronDown } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI Election Guide 🗳️ I can help you with voter registration, election procedures, candidate info, and more. What would you like to know?",
  timestamp: Date.now(),
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          currentPage: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.response || "I'm having trouble connecting right now. Please try again!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: "Connection error. Please check your internet and try again.", timestamp: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="AI Election Guide Chat"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: "90px",
              right: "24px",
              width: "min(380px, calc(100vw - 48px))",
              height: "520px",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              background: "var(--bg)",
              backdropFilter: "blur(24px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px var(--shadow-card), 0 0 0 1px var(--glass-border)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--bg-2)",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "var(--gradient-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Bot size={18} color="white" aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>Election Guide AI</div>
                <div style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                  Online — Ask me anything
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{ background: "var(--bg-2)", border: "none", borderRadius: "8px", padding: "6px", color: "var(--text-muted)", cursor: "none" }}
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div className="chat-bubble-ai" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              style={{
                padding: "16px",
                borderTop: "1px solid var(--glass-border)",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about voting, registration…"
                aria-label="Chat message input"
                maxLength={300}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              <button
                id="chat-send-btn"
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 42, height: 42,
                  borderRadius: "12px",
                  background: input.trim() ? "var(--grad-saffron)" : "var(--bg-3)",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white",
                  cursor: "none",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        id="chat-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat assistant"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF9933 0%, #E6741A 50%, #138808 100%)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 201,
          boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
          cursor: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} color="white" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} color="white" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
        {hasUnread && (
          <span
            aria-label="New message"
            style={{
              position: "absolute", top: "2px", right: "2px",
              width: 12, height: 12, borderRadius: "50%",
              background: "#EF4444", border: "2px solid var(--bg)",
            }}
          />
        )}
      </motion.button>
    </>
  );
}
