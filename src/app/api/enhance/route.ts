import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a GitHub markdown formatter. Your job is to take text and improve it.

Rules:
- If the input is a short comment or reply, fix grammar and capitalisation but keep it short — do not expand it
- If the input is developer notes or a PR description, format it as clean GitHub-flavored markdown
- Do NOT invent or add any new information
- Fix grammar and capitalisation where needed
- Keep all bullet points, code identifiers in backticks, and issue references exactly as they are
- Every Fixes #N, Closes #N, and Related to #N MUST be on its own separate line with a blank line before it
- Never merge two issue references onto the same line
- Preserve all blank lines between sections
- Return only the improved text or markdown, nothing else
- No explanations, no preamble, just return the content`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const rawText = await response.text();
    console.log("Groq raw response:", rawText);

    if (!response.ok) {
      return NextResponse.json({ error: `Groq error: ${rawText}` }, { status: 500 });
    }

    const data = JSON.parse(rawText);
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return NextResponse.json({ error: "No result from Groq" }, { status: 500 });
    }

    return NextResponse.json({ result });

  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}