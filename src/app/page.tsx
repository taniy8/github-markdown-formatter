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
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">GitHub Markdown Formatter</h1>
      <p className="text-gray-500 mb-6">
        Paste your raw notes. Get clean GitHub markdown.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Input</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleTemplate("pr")}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
              >
                Simple PR
              </button>
              <button
                onClick={() => handleTemplate("detailed")}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
              >
                Detailed PR
              </button>
              <button
                onClick={() => handleTemplate("bug")}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
              >
                Bug Report
              </button>
            </div>
          </div>
          <textarea
            className="w-full min-h-[500px] border rounded-lg p-4 font-mono text-sm"
            placeholder="Paste raw GitHub text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Output</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={!output}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="w-full min-h-[500px] border rounded-lg p-4 prose prose-neutral prose-sm max-w-none">
            {output ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {output}
              </ReactMarkdown>
            ) : (
              <span className="text-gray-400">
                Formatted output will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
