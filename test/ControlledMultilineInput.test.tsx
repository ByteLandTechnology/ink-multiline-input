/**
 * Tests for ControlledMultilineInput component.
 *
 * Covers:
 * - Basic Rendering (Text display)
 * - visual cursor positioning (insertion of cursor character)
 * - Placeholder behavior (empty & unfocused)
 * - Masking (password mode)
 * - Multiline Support & Line Breaks
 * - Tab expansion
 * - Focus state handling
 * - Highlighting (text selection)
 * - Row constraints (min/max rows) - partially mocked via props
 */
import React from "react";
import { render } from "ink-testing-library";
import { describe, it, expect, vi } from "vitest";
import { ControlledMultilineInput } from "../src/ControlledMultilineInput";

// Mock MeasureBox to calculate height based on text content
// This allows testing scrolling behavior without a real layout engine
vi.mock("../src/MeasureBox", () => ({
  MeasureBox: ({ children, onHeightChange }: any) => {
    // Recursively extract text from children
    const extractText = (node: any): string => {
      if (!node) return "";
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (node.props && node.props.children)
        return extractText(node.props.children);
      return "";
    };

    React.useEffect(() => {
      const text = extractText(children);
      // Height = number of lines
      const lines = text.split("\n").length;
      // console.log(`MeasureBox Mock: text="${text.replace(/\n/g, '\\n')}", lines=${lines}`);
      onHeightChange?.(lines);
    }, [children, onHeightChange]);

    return <>{children}</>;
  },
}));

describe("ControlledMultilineInput", () => {
  // 1. Basic Rendering
  it("renders value correctly", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput value="Hello World" />,
    );
    // Cursor at 0 inserts space at start
    expect(lastFrame()).toContain(" Hello World");
  });

  // 2. Placeholder Logic
  it("renders placeholder when empty and unfocused", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput
        value=""
        placeholder="Type here..."
        focus={false}
      />,
    );
    expect(lastFrame()).toContain("Type here...");
  });

  it("renders cursor when empty and focused", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput
        value=""
        placeholder="Type here..."
        focus={true}
      />,
    );
    // Expect a cursor space (inverse space typically renders as space in text output of ink-testing-library)
    // We mainly check placeholder is NOT there.
    expect(lastFrame()).not.toContain("Type here...");
  });

  // 3. Masking
  it("renders masked value", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput value="secret" mask="*" />,
    );
    // Cursor at 0: " ******"
    expect(lastFrame()).toContain(" ******");
    expect(lastFrame()).not.toContain("secret");
  });

  // 4. Cursor Rendering
  it("handles cursor positioning rendering", () => {
    // Value: "Hello"
    // Cursor at 2: "He" + cursor + "lo"
    // The component inserts a space for the cursor.
    const { lastFrame } = render(
      <ControlledMultilineInput value="Hello" cursorIndex={2} />,
    );
    expect(lastFrame()).toContain("He llo");
  });

  // 5. Multiline & Formatting
  it("renders multiline text", () => {
    const value = "Line 1\nLine 2\nLine 3";
    // Need rows to be set to see more than 1 line if measurement fails in test env
    const { lastFrame } = render(
      <ControlledMultilineInput value={value} rows={3} />,
    );
    expect(lastFrame()).toContain("Line 1");
    expect(lastFrame()).toContain("Line 2");
    expect(lastFrame()).toContain("Line 3");
  });

  it("handles formatting with tabs", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput
        value={`a${String.fromCharCode(9)}b`}
        tabSize={2}
      />,
    );
    // Cursor at 0: " " + "a  b"
    expect(lastFrame()).toContain(" a  b");
  });

  // 6. Focus State
  it("does not show cursor when focus is false", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput value="Test" focus={false} />,
    );
    // No inserted space
    expect(lastFrame()).toContain("Test");
    expect(lastFrame()).not.toContain(" Test"); // Assuming "Test" matches exactly or assuming no prefix space
  });

  // 7. Highlighting
  it("respects highlighting", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput
        value="Highlight me"
        highlight={{ start: 0, end: 9 }}
        cursorIndex={9}
      />,
    );
    // "Highlight" + " " (cursor) + " me" -> "Highlight  me"
    expect(lastFrame()).toContain("Highlight  me");
  });

  // 8. Layout Props
  it("renders with custom rows prop (min rows)", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput value="One" rows={3} />,
    );
    expect(lastFrame()).toContain("One");
    // checking number of lines in output would be ideal, but string check works for content
  });

  it("handles carriage returns in value", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput value="Line 1\r\nLine 2" rows={2} />,
    );
    expect(lastFrame()).toContain("Line 1");
    expect(lastFrame()).toContain("Line 2");
  });

  // 9. Scrolling behavior (Visual check of visible window)
  it("scrolls to show cursor when it is out of view (bottom)", async () => {
    // 5 lines
    const value = "L1\nL2\nL3\nL4\nL5";
    // Show only 2 lines
    const { lastFrame } = render(
      <ControlledMultilineInput value={value} maxRows={2} cursorIndex={14} />, // Cursor at absolute end
    );

    // Wait for effects to settle (Measure -> State -> Scroll -> State)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should show L5 (where cursor is)
    // Cursor is at end, so L5 is intact, followed by cursor space: "L5 "
    expect(lastFrame()).toContain("L5");
    // Should NOT show L1 (scrolled out)
    // Note: Ink Testing Library might render whatever Ink sends to stdout.
    // If Ink implements overflow:hidden by not emitting text, this passes.
    // If Ink emits valid ANSI codes that hide text, toContain might still find it in raw output
    // unless we check for "visual" visibility which is hard.
    // However, usually Ink truncates children in overflow:hidden boxes.
    expect(lastFrame()).not.toContain("L1");
  });

  it("scrolls to show cursor when it is out of view (top)", () => {
    // 5 lines
    const value = "L1\nL2\nL3\nL4\nL5";
    // Show only 2 lines, Cursor at L1
    const { lastFrame } = render(
      <ControlledMultilineInput value={value} maxRows={2} cursorIndex={0} />,
    );

    expect(lastFrame()).toContain("L1");
    expect(lastFrame()).not.toContain("L5");
  });

  // 10. Edge Cases
  it("handles cursorIndex out of bounds gracefully", () => {
    // Negative index
    const { lastFrame: frame1 } = render(
      <ControlledMultilineInput value="ABC" cursorIndex={-5} />,
    );
    expect(frame1()).toContain("ABC"); // Should still render content

    // Index > length
    const { lastFrame: frame2 } = render(
      <ControlledMultilineInput value="ABC" cursorIndex={100} />,
    );
    expect(frame2()).toContain("ABC");
  });

  it("handles undefined or null highlight ranges safely", () => {
    const { lastFrame } = render(
      <ControlledMultilineInput
        value="ABC"
        highlight={{ start: 5, end: 2 }} // Invalid range
      />,
    );
    expect(lastFrame()).toContain("ABC");
  });

  // 11. Styles validity
  it("accepts and applies text style props", () => {
    // We can't easily check color output in string match without ANSI parsing,
    // but can ensure it doesn't crash.
    const { lastFrame } = render(
      <ControlledMultilineInput
        value="Styled"
        textStyle={{ color: "red", bold: true }}
        highlightStyle={{ backgroundColor: "blue" }}
      />,
    );
    expect(lastFrame()).toContain("Styled");
  });
});
