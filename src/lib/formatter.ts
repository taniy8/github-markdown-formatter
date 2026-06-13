export function formatText(raw: string): string {
  if (!raw.trim()) return "";

  const lines = raw.split("\n");
  const formatted = lines.map((line) => formatLine(line.trim()));
  const cleaned = formatted.filter(Boolean);

  const spaced: string[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const prev = cleaned[i - 1];
    const curr = cleaned[i];
    if (prev && prev.startsWith("-") && /^(Fixes|Closes|Related)/.test(curr)) {
      spaced.push("");
    }
    spaced.push(curr);
  }

  return spaced.join("\n");
}

function formatLine(line: string): string {
  if (!line) return "";

  line = fixIssueReferences(line);
  line = wrapCodeIdentifiers(line);
  line = convertToBullet(line);
  line = capitalizeSentence(line);

  return line;
}

function fixIssueReferences(line: string): string {
  return line.replace(/(fixes|closes|related to)\s+#?(\d+)/gi, (_, keyword, number) => {
    const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    return `${capitalized} #${number}`;
  });
}

function wrapCodeIdentifiers(line: string): string {
  if (line.startsWith("-") || /^(Fixes|Closes|Related)/.test(line)) return line;

  return line.replace(
    /\b([a-z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)+|[A-Z][a-zA-Z0-9]*(?:[A-Z][a-z]+)+|\w+\(\)|\w+\.\w+|\w+\.[a-z]{2,4})\b/g,
    "`$1`"
  );
}

function convertToBullet(line: string): string {
  const actionVerbs = [
    "added", "updated", "fixed", "removed", "changed", "passed",
    "implemented", "refactored", "created", "moved", "renamed",
    "improved", "replaced", "deleted", "migrated", "extracted",
    "simplified", "optimized", "resolved", "handled", "wrapped",
  ];

  const verbPattern = new RegExp(`^(${actionVerbs.join("|")})\\s+(.+)`, "i");
  const match = line.match(verbPattern);

  if (match) {
    const verb = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    const rest = match[2];
    return `- ${verb} ${rest}`;
  }

  return line;
}

function capitalizeSentence(line: string): string {
  if (!line) return "";

  if (line.startsWith("-") || /^(Fixes|Closes|Related)/.test(line)) return line;

  return line.charAt(0).toUpperCase() + line.slice(1);
}