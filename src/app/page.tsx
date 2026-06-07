"use client";

import { useState } from "react";
import { formatText } from "@/lib/formatter";

export default function Home() {
  const [input, setInput] = useState("");
  const output = formatText(input);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">
        GitHub Markdown Formatter
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Input</h2>

          <textarea
            className="w-full min-h-[500px] border rounded-lg p-4"
            placeholder="Paste raw GitHub text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Output</h2>

          <div className="min-h-[500px] border rounded-lg p-4 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>
    </main>
  );
}