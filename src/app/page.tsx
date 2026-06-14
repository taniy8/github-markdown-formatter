"use client";

import { useState, useEffect, useRef } from "react";
import { formatText } from "@/lib/formatter";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { templates } from "@/lib/templates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [input, setInput] = useLocalDraft("draft");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const output = formatText(input);
  const displayOutput = aiMode && aiOutput ? aiOutput : output;
  const lineCount = input ? input.split("\n").length : 0;
  const charCount = input ? input.length : 0;

  useEffect(() => {
    setMounted(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
    const savedAiMode = localStorage.getItem("aiMode");
    if (savedAiMode === "true") setAiMode(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading && output) handleAiToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, output, aiMode]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleEnhance() {
    if (!output) return;
    setLoading(true);
    setAiOutput("");
    setAiError(false);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: output }),
      });
      const data = await res.json();
      if (data.result) {
        setAiOutput(data.result);
        showToast("✦ AI enhancement complete");
      } else {
        setAiError(true);
      }
    } catch (err) {
      console.error("AI enhance failed:", err);
      setAiError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleAiToggle() {
    const next = !aiMode;
    setAiMode(next);
    localStorage.setItem("aiMode", String(next));
    if (next && output && !aiOutput) handleEnhance();
    if (!next) {
      setAiOutput("");
      setAiError(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(displayOutput);
    setCopied(true);
    showToast("✓ Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([displayOutput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Downloaded output.md");
  }

  function handleTemplate(key: string) {
    setInput(templates[key]);
    setAiOutput("");
    setAiError(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function handleClear() {
    setInput("");
    setAiOutput("");
    setAiMode(false);
    setAiError(false);
    localStorage.setItem("aiMode", "false");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  if (!mounted) return null;

  const btnBase: React.CSSProperties = {
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    backgroundColor: "#21262d",
    color: "#8b949e",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#238636",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
          borderBottom: "1px solid #21262d",
          backgroundColor: "#161b22",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg height="24" viewBox="0 0 16 16" width="24" fill="#e6edf3">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#e6edf3" }}>
            Markdown Formatter
          </span>
        </div>
        <a
          href="https://github.com/taniy8/github-markdown-formatter"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "12px", color: "#8b949e", textDecoration: "none" }}
        >
          View on GitHub →
        </a>
      </header>

      {/* Tagline */}
      <div style={{ padding: "20px 32px 0 32px" }}>
        <p style={{ fontSize: "14px", color: "#8b949e", margin: 0 }}>
          Transform raw developer notes into clean GitHub-flavored Markdown.
        </p>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "pr", label: "Simple PR" },
            { key: "detailed", label: "Detailed PR" },
            { key: "bug", label: "Bug Report" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTemplate(key)}
              style={btnBase}
            >
              {label}
            </button>
          ))}

          <div
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "#30363d",
              margin: "0 2px",
            }}
          />

          <button
            onClick={handleAiToggle}
            disabled={loading}
            title="Use AI to improve grammar and clarity (Ctrl+Enter)"
            style={{
              ...btnBase,
              border: aiMode ? "1px solid #388bfd" : "1px solid #30363d",
              backgroundColor: aiMode ? "#1c2d4a" : "#21262d",
              color: aiMode ? "#58a6ff" : "#8b949e",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            <span style={{ fontSize: "9px" }}>{aiMode ? "●" : "○"}</span>
            {loading ? "Enhancing..." : "AI Mode"}
          </button>

          <span
            style={{
              fontSize: "11px",
              color: "#484f58",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Ctrl+Enter
          </span>

          <div
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "#30363d",
              margin: "0 2px",
            }}
          />

          {input && (
            <button
              onClick={handleClear}
              title="Clear editor"
              style={{ ...btnBase, color: "#f85149" }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {input && (
            <span style={{ fontSize: "11px", color: "#484f58" }}>
              {lineCount} lines · {charCount} chars
            </span>
          )}
          <button
            onClick={handleDownload}
            disabled={!displayOutput || loading}
            title="Download as .md file"
            style={{
              ...btnBase,
              color: !displayOutput ? "#484f58" : "#8b949e",
              cursor: !displayOutput ? "not-allowed" : "pointer",
            }}
          >
            ↓ Download
          </button>
          <button
            onClick={handleCopy}
            disabled={!displayOutput || loading}
            title="Copy markdown to clipboard"
            style={{
              ...btnBase,
              padding: "6px 20px",
              border: copied ? "1px solid #2ea043" : "1px solid #388bfd",
              backgroundColor: copied ? "#1a4428" : "#1c2d4a",
              color: !displayOutput
                ? "#484f58"
                : copied
                  ? "#3fb950"
                  : "#58a6ff",
              cursor: !displayOutput ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {copied ? "✓ Copied" : "Copy Markdown"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{ height: "1px", backgroundColor: "#21262d", margin: "0 32px" }}
      />

      {/* Editor */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          flex: 1,
          padding: "16px 32px 32px 32px",
          gap: "16px",
        }}
      >
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "#6e7681",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Input
          </span>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setAiOutput("");
              setAiError(false);
            }}
            placeholder={
              "fixed critical bug in authService\nadded JWT validation to middleware\nrefactored userController to use async await\nupdated README.md with setup instructions\nfixes 287\ncloses 301"
            }
            style={{
              flex: 1,
              minHeight: "540px",
              width: "100%",
              backgroundColor: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "6px",
              padding: "20px",
              color: "#e6edf3",
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
              fontSize: "13px",
              lineHeight: "1.7",
              resize: "none",
            }}
          />
        </div>

        {/* Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#6e7681",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Preview
            </span>
            {aiMode && !aiError && aiOutput && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#58a6ff",
                  backgroundColor: "#1c2d4a",
                  padding: "2px 10px",
                  borderRadius: "4px",
                  border: "1px solid #388bfd",
                  fontWeight: 500,
                }}
              >
                ✦ AI Enhanced
              </span>
            )}
            {aiError && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#f85149",
                  backgroundColor: "#2d1a1a",
                  padding: "2px 10px",
                  borderRadius: "4px",
                  border: "1px solid #f85149",
                }}
              >
                ⚠ AI failed — showing basic output
              </span>
            )}
          </div>
          <div
            style={{
              flex: 1,
              minHeight: "540px",
              backgroundColor: "#0d1117",
              border:
                aiMode && !aiError ? "1px solid #388bfd" : "1px solid #30363d",
              borderRadius: "6px",
              padding: "20px 24px",
              overflowY: "auto",
              transition: "border-color 0.2s ease",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#58a6ff",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  ✦ Enhancing with AI...
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#388bfd",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : displayOutput ? (
              <div className="gh-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {displayOutput}
                </ReactMarkdown>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span style={{ fontSize: "13px", color: "#484f58" }}>
                  Formatted GitHub Markdown will appear here.
                </span>
                <span style={{ fontSize: "12px", color: "#30363d" }}>
                  Start typing or choose a template above.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "14px 32px",
          borderTop: "1px solid #21262d",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "12px", color: "#484f58" }}>
          Built with Next.js · TypeScript · Tailwind · Groq
        </span>
      </footer>
    </div>
  );
}
