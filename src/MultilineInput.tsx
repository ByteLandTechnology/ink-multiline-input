import { useState, useEffect, useMemo } from "react";
import { Key, useInput } from "ink";
import {
  ControlledMultilineInput,
  ControlledMultilineInputProps,
} from "./ControlledMultilineInput";
import { normalizeLineEndings } from "./utils";

export interface MultilineInputProps extends ControlledMultilineInputProps {
  /**
   * 🔄 Callback function triggered when the value changes.
   */
  onChange: (value: string) => void;
  /**
   * 🚀 Optional callback triggered when the submit key is pressed.
   */
  onSubmit?: (value: string) => void;
  /**
   * 🔌 Custom input hook. Use this to replace the default `useInput` from Ink.
   * Useful for routing input to specific components when multiple inputs exist.
   */
  useCustomInput?: (
    inputHandler: (input: any, key: Key) => void,
    isActive: boolean,
  ) => void;
  /**
   * ⌨️ Custom key bindings for submit and newline actions.
   */
  keyBindings?: {
    /**
     * Returns true if the key should trigger submit (default: Ctrl+Enter).
     */
    submit?: (key: Key) => boolean;
    /**
     * Returns true if the key should insert a newline (default: Enter).
     */
    newline?: (key: Key) => boolean;
  };
  /**
   * 🎨 When true, highlights recently pasted text with highlightStyle.
   */
  highlightPastedText?: boolean;
  /**
   * 🎯 Whether this input should receive keyboard input.
   * Useful for routing input when multiple inputs exist.
   */
  focus?: boolean;
}

/**
 * ⌨️ A multi-line text input component for Ink applications.
 *
 * This is the controlled version that handles input logic internally.
 * It uses ControlledMultilineInput for rendering.
 *
 * This component supports:
 * - ↕️ Vertical scrolling
 * - ↩️ Text wrapping
 * - 🖱️ Cursor navigation (up, down, left, right)
 * - 🔙 Backspace and Delete support
 *
 * @param props - ⚙️ The component props.
 */
export const MultilineInput = ({
  value,
  onChange,
  onSubmit,
  keyBindings,
  showCursor = true,
  highlightPastedText = false,
  focus = true,
  useCustomInput = (inputHandler, isActive) =>
    useInput(inputHandler, { isActive: isActive }),
  ...controlledProps
}: MultilineInputProps) => {
  // State for cursor position and paste tracking
  const [cursorIndex, setCursorIndex] = useState(value.length);
  const [pasteLength, setPasteLength] = useState(0);

  // Clamp cursor if value changes externally
  useEffect(() => {
    if (cursorIndex > value.length) {
      setCursorIndex(value.length);
    }
  }, [value, cursorIndex]);

  // Handle input
  useCustomInput((input, key) => {
    const submitKey = keyBindings?.submit ?? ((key) => key.return && key.ctrl);
    const newlineKey = keyBindings?.newline ?? ((key) => key.return);
    // Check custom key bindings first
    if (submitKey(key)) {
      onSubmit?.(value);
      return;
    } else if (newlineKey(key)) {
      const newValue =
        value.slice(0, cursorIndex) + "\n" + value.slice(cursorIndex);
      onChange(newValue);
      setCursorIndex(cursorIndex + 1);
      setPasteLength(0);
      return;
    }

    // Ignore known navigation/control keys that shouldn't be treated as text input
    if (key.tab || (key.shift && key.tab) || (key.ctrl && input === "c")) {
      return;
    }

    if (keyBindings?.newline?.(key)) {
      const newValue =
        value.slice(0, cursorIndex) + "\n" + value.slice(cursorIndex);
      onChange(newValue);
      setCursorIndex(cursorIndex + 1);
      setPasteLength(0);
      return;
    }

    // Capture pasted text width
    let nextPasteLength = 0;
    if (input.length > 1) {
      nextPasteLength = input.length;
    }

    // Default behavior if no custom binding matched
    if (key.upArrow) {
      if (showCursor) {
        const lines = normalizeLineEndings(value).split("\n");
        let currentLineIndex = 0;
        let currentPos = 0;
        let col = 0;

        // Find current line and column
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line === undefined) continue;
          const lineLen = line.length;
          const lineEnd = currentPos + lineLen;
          if (cursorIndex >= currentPos && cursorIndex <= lineEnd) {
            currentLineIndex = i;
            col = cursorIndex - currentPos;
            break;
          }
          currentPos = lineEnd + 1; // +1 for newline
        }

        if (currentLineIndex > 0) {
          const targetLineIndex = currentLineIndex - 1;
          const targetLine = lines[targetLineIndex];
          if (targetLine !== undefined) {
            const targetLineLen = targetLine.length;
            const newCol = Math.min(col, targetLineLen);

            // Calculate new absolute index
            let newIndex = 0;
            for (let i = 0; i < targetLineIndex; i++) {
              newIndex += lines[i]!.length + 1;
            }
            newIndex += newCol;
            setCursorIndex(newIndex);
            setPasteLength(0);
          }
        }
      }
    } else if (key.downArrow) {
      if (showCursor) {
        const lines = normalizeLineEndings(value).split("\n");
        let currentLineIndex = 0;
        let currentPos = 0;
        let col = 0;

        // Find current line and column
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line === undefined) continue;
          const lineLen = line.length;
          const lineEnd = currentPos + lineLen;
          if (cursorIndex >= currentPos && cursorIndex <= lineEnd) {
            currentLineIndex = i;
            col = cursorIndex - currentPos;
            break;
          }
          currentPos = lineEnd + 1; // +1 for newline
        }

        if (currentLineIndex < lines.length - 1) {
          const targetLineIndex = currentLineIndex + 1;
          const targetLine = lines[targetLineIndex];
          if (targetLine !== undefined) {
            const targetLineLen = targetLine.length;
            const newCol = Math.min(col, targetLineLen);

            // Calculate new absolute index
            let newIndex = 0;
            for (let i = 0; i < targetLineIndex; i++) {
              newIndex += lines[i]!.length + 1;
            }
            newIndex += newCol;
            setCursorIndex(newIndex);
            setPasteLength(0);
          }
        }
      }
    } else if (key.leftArrow) {
      if (showCursor) {
        setCursorIndex(Math.max(0, cursorIndex - 1));
        setPasteLength(0);
      }
    } else if (key.rightArrow) {
      if (showCursor) {
        setCursorIndex(Math.min(value.length, cursorIndex + 1));
        setPasteLength(0);
      }
    } else if (key.return) {
      const newValue =
        value.slice(0, cursorIndex) + "\n" + value.slice(cursorIndex);
      onChange(newValue);
      setCursorIndex(cursorIndex + 1);
      setPasteLength(0);
    } else if (key.backspace || key.delete) {
      if (cursorIndex > 0) {
        const newValue =
          value.slice(0, cursorIndex - 1) + value.slice(cursorIndex);
        onChange(newValue);
        setCursorIndex(cursorIndex - 1);
        setPasteLength(0);
      }
    } else {
      // Normal input
      if (input) {
        const newValue =
          value.slice(0, cursorIndex) + input + value.slice(cursorIndex);
        onChange(newValue);
        setCursorIndex(cursorIndex + input.length);
        setPasteLength(nextPasteLength);
      }
    }
  }, focus);

  // Calculate paste highlight only
  const highlight = useMemo(() => {
    if (highlightPastedText && pasteLength > 1) {
      return {
        start: Math.max(0, cursorIndex - pasteLength),
        end: cursorIndex,
      };
    }

    return undefined;
  }, [cursorIndex, pasteLength, highlightPastedText]);

  // Render using ControlledMultilineInput
  return (
    <ControlledMultilineInput
      {...controlledProps}
      value={value}
      cursorIndex={cursorIndex}
      highlight={highlight}
      showCursor={showCursor}
      focus={focus}
    />
  );
};
