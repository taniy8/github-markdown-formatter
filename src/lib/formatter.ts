export function formatText(text: string): string {
  return text.replace(
    /fixes\s+(\d+)/gi,
    "Fixes #$1"
  );
}