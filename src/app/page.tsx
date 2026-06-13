"use client";

import { useState, useEffect } from "react";
import { formatText } from "@/lib/formatter";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { templates } from "@/lib/templates";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [input, setInput] = useLocalDraft("draft");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const output = formatText(input);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleTemplate(key: string) {
    setInput(templates[key]);
  }

  if (!mounted) return null;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
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

      <main
        style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#8b949e", margin: 0 }}>
          Paste raw notes. Get clean GitHub markdown.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { key: "pr", label: "Simple PR" },
              { key: "detailed", label: "Detailed PR" },
              { key: "bug", label: "Bug Report" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTemplate(key)}
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "1px solid #30363d",
                  backgroundColor: "#21262d",
                  color: "#8b949e",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button
              onClick={handleDownload}
              disabled={!output}
              style={{
                fontSize: "12px",
                padding: "5px 12px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                backgroundColor: "#21262d",
                color: !output ? "#484f58" : "#8b949e",
                cursor: !output ? "not-allowed" : "pointer",
              }}
            >
              ↓ Download
            </button>
            <button
              onClick={handleCopy}
              disabled={!output}
              style={{
                fontSize: "12px",
                padding: "5px 12px",
                borderRadius: "6px",
                border: copied ? "1px solid #2ea043" : "1px solid #30363d",
                backgroundColor: copied ? "#1a4428" : "#21262d",
                color: !output ? "#484f58" : copied ? "#3fb950" : "#8b949e",
                cursor: !output ? "not-allowed" : "pointer",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#8b949e",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Input
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                "fixed bug with login\nadded validation to userService\nfixes 42"
              }
              style={{
                flex: 1,
                minHeight: "520px",
                width: "100%",
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "16px",
                color: "#e6edf3",
                fontFamily: "ui-monospace, monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                resize: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#8b949e",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Preview
            </span>
            <div
              style={{
                flex: 1,
                minHeight: "520px",
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "16px",
                overflowY: "auto",
              }}
            >
              {output ? (
                <div className="gh-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {output}
                  </ReactMarkdown>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#484f58",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  Output will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #21262d",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "12px", color: "#484f58" }}>
          Built with Next.js · TypeScript · Tailwind
        </span>
      </footer>
    </div>
  );
}
