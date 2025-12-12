/**
 * 🔄 Expands tab characters to spaces with a fixed width.
 *
 * @param text - The input string containing tabs.
 * @param tabSize - The number of spaces each tab expands to.
 * @returns The expanded string with tabs replaced by spaces.
 */
export function expandTabs(text: string, tabSize: number): string {
  return text.replace(/\t/g, " ".repeat(tabSize));
}

/**
 * 📝 Normalizes line endings to LF (\n).
 * Converts CRLF (\r\n) and CR (\r) to LF (\n).
 *
 * @param text - The input string with various line endings.
 * @returns The string with normalized line endings.
 */
export function normalizeLineEndings(text: string): string {
  // Handle undefined/null input
  if (text == null) {
    return "";
  }
  // First replace CRLF with LF, then replace remaining CR with LF
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
