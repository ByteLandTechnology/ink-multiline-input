import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Spacer, Text, type TextProps } from "ink";
import { expandTabs, normalizeLineEndings } from "./utils";
import { MeasureBox } from "./MeasureBox";

export interface ControlledMultilineInputProps {
  /**
   * 📝 The current value to display.
   */
  value: string;
  /**
   * 📏 The minimum number of rows to display.
   */
  rows?: number;
  /**
   * 📏 The maximum number of rows to display.
   */
  maxRows?: number;
  /**
   * 🎨 Style to apply to the line containing the cursor (Text).
   * This style is applied to the entire logical line where the cursor is located.
   */
  highlightStyle?: any;
  /**
   * Style to apply to the text.
   */
  textStyle?: any;
  /**
   * Text to display when `value` is empty.
   */
  placeholder?: string;
  /**
   * Replace all chars and mask the value. Useful for password inputs.
   */
  mask?: string;
  /**
   * Whether to show cursor and allow navigation inside text input with arrow keys.
   */
  showCursor?: boolean;
  /**
   * Whether the input is focused.
   */
  focus?: boolean;
  /**
   * Number of spaces to expand tabs to when displaying. Default: 4.
   */
  tabSize?: number;
  /**
   * Current cursor position (0-indexed).
   */
  cursorIndex?: number;
  /**
   * Highlight range for pasted text.
   * Only contains the position of the pasted text.
   */
  highlight?: {
    start: number;
    end: number;
  };
  /**
   * A key that triggers refresh when changed.
   * Changing this value forces the component to re-render.
   */
  refreshKey?: any;
}

interface StyledText {
  value: string;
  type?: "placeholder" | "highlight" | "cursor";
}

/**
 * ⌨️ A controlled multi-line text input component for Ink applications.
 *
 * This component is responsible only for displaying the input content and cursor.
 * It doesn't handle any input logic itself.
 *
 * @param props - ⚙️ The component props.
 */
export const ControlledMultilineInput = ({
  value,
  rows,
  maxRows,
  highlightStyle,
  textStyle,
  placeholder = "",
  mask,
  showCursor = true,
  focus = true,
  tabSize = 4,
  cursorIndex = 0,
  highlight,
  refreshKey,
}: ControlledMultilineInputProps) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [markerHeight, setMarkerHeight] = useState(0);

  // 🔄 Format text for display: normalize line endings (\r\n, \r → \n) and expand tabs
  const formatText = useCallback(
    (text: string, isPlaceholder: boolean = false): string => {
      const normalized = normalizeLineEndings(text);
      // 🎭 Apply mask: replace all chars except newlines with mask char
      let result = normalized;
      if (!isPlaceholder && mask) {
        result = normalized.replace(/[^\n]/g, mask);
      } else {
        result = expandTabs(normalized, tabSize);
      }
      return result;
    },
    [tabSize, mask],
  );

  // 🎨 Build styled text segments split at cursor position
  // Returns text segments before and after cursor, each with type for styling
  const { preCursor, postCursor } = useMemo((): {
    preCursor: StyledText[];
    postCursor: StyledText[];
  } => {
    // 📭 Handle empty or undefined value
    if (!value) {
      // Show placeholder when not focused
      if (placeholder && !focus) {
        return {
          preCursor: [
            { value: formatText(placeholder, true), type: "placeholder" },
          ],
          postCursor: [],
        };
      }
      // Show cursor only when focused
      return {
        preCursor: [{ value: " ", type: "cursor" }],
        postCursor: [],
      };
    }

    // ✂️ Split value at cursor position
    const textBefore = value.slice(0, cursorIndex);
    const textAfter = value.slice(cursorIndex);

    // �️ When unfocused, show plain text without cursor and highlight
    if (!focus) {
      return {
        preCursor: [{ value: formatText(value) }],
        postCursor: [],
      };
    }

    // �🔍 Check if highlight range is valid
    const hasValidHighlight =
      highlight &&
      highlight.end > highlight.start &&
      highlight.start >= 0 &&
      highlight.end <= value.length;

    if (!hasValidHighlight) {
      // 📍 No explicit highlight: highlight the current cursor line
      const formattedBefore = formatText(textBefore);
      const formattedAfter = formatText(textAfter);
      // Find cursor line boundaries
      const lineStart = formattedBefore.lastIndexOf("\n") + 1;
      const lineEnd = formattedAfter.indexOf("\n");
      return {
        preCursor: [
          { value: formattedBefore.slice(0, lineStart) },
          { value: formattedBefore.slice(lineStart), type: "highlight" },
          { value: showCursor && focus ? " " : "", type: "cursor" },
        ],
        postCursor: [
          { value: formattedAfter.slice(0, lineEnd), type: "highlight" },
          { value: formattedAfter.slice(lineEnd) },
        ],
      };
    } else {
      // 🎯 Explicit highlight range provided (e.g., pasted text)
      return {
        preCursor: [
          { value: formatText(textBefore.slice(0, highlight.start)) },
          {
            value: formatText(
              textBefore.slice(
                highlight.start,
                Math.min(highlight.end, cursorIndex),
              ),
            ),
            type: "highlight",
          },
          { value: formatText(textBefore.slice(highlight.end)) },
          { value: " ", type: "cursor" },
        ],
        postCursor: [
          {
            value: formatText(
              textAfter.slice(0, Math.max(highlight.start - cursorIndex, 0)),
            ),
          },
          {
            value: formatText(
              textAfter.slice(
                Math.max(highlight.start - cursorIndex, 0),
                Math.max(highlight.end - cursorIndex, 0),
              ),
            ),
            type: "highlight",
          },
          {
            value: formatText(
              textAfter.slice(Math.max(highlight.end - cursorIndex, 0)),
            ),
          },
        ],
      };
    }
  }, [
    cursorIndex,
    showCursor,
    focus,
    value,
    placeholder,
    mask,
    highlight,
    formatText,
    refreshKey,
  ]);

  // 📏 Measure marker height and update scroll offset when marker content changes
  // The scroll behavior follows "keep cursor visible" pattern:
  // - If cursor line is above the viewport → scroll up so cursor is at top
  // - If cursor line is below the viewport → scroll down so cursor is at bottom
  // - Otherwise → keep current scroll position (don't change)
  // Calculate visible lines count based on measured content height
  const visibleRows = useMemo(() => {
    // Use measured content height if available, otherwise calculate line count
    if (contentHeight !== undefined) {
      return Math.max(
        rows ?? maxRows ?? 1,
        Math.min(maxRows ?? rows ?? 1, contentHeight),
      );
    }
    return 1;
  }, [rows, maxRows, contentHeight]);

  // Update scroll offset based on cursor position and visible lines count
  // useEffect(() => {
  //   if (markerContent !== prevMarkerContent.current) {
  //     prevMarkerContent.current = markerContent;
  //   }
  // }, [markerContent]);

  // Update scroll offset when marker height changes
  useEffect(() => {
    if (markerHeight !== undefined && visibleRows !== undefined) {
      // markerHeight represents the number of lines from start to cursor (1-indexed)
      const cursorLineEnd = markerHeight;
      setScrollOffset((prevOffset) => {
        const viewportStart = prevOffset;
        const viewportEnd = prevOffset + visibleRows;

        if (cursorLineEnd <= viewportStart) {
          return Math.max(0, cursorLineEnd - 1);
        } else if (cursorLineEnd > viewportEnd) {
          return cursorLineEnd - visibleRows;
        } else if (contentHeight) {
          if (contentHeight < visibleRows) {
            return 0;
          } else if (contentHeight < viewportEnd) {
            return contentHeight - visibleRows;
          }
        }
        return prevOffset;
      });
    }
  }, [markerHeight, visibleRows, contentHeight]);

  // 🎨 Convert styledText.type to TextProps style
  const getStyle = useCallback(
    (type?: "placeholder" | "highlight" | "cursor"): TextProps => {
      switch (type) {
        case "placeholder":
          return { ...textStyle, dimColor: true };
        case "highlight":
          return highlightStyle ?? textStyle;
        case "cursor":
          return {
            ...(highlightStyle ?? textStyle),
            inverse: showCursor && focus,
          };
        default:
          return textStyle;
      }
    },
    [textStyle, highlightStyle, showCursor, focus],
  );

  return (
    <Box
      height={visibleRows}
      overflow="hidden"
      flexDirection="column"
      flexGrow={0}
      flexShrink={0}
    >
      <Box flexDirection="column">
        {/* 📝 Full Content: The actual visible content with complete text */}
        {/* Height is set to match outer container, overflow hidden clips the content */}
        {/* marginTop on inner Box scrolls the text up based on scrollOffset */}
        <Box
          height={visibleRows}
          overflowY="hidden"
          flexShrink={0}
          flexDirection="column"
        >
          <Box marginTop={-scrollOffset} flexDirection="column">
            <MeasureBox onHeightChange={setContentHeight}>
              <Text>
                {preCursor?.map((segment, idx) => (
                  <Text key={idx} {...getStyle(segment.type)}>
                    {segment.value}
                  </Text>
                ))}
                {postCursor?.map((segment, idx) => (
                  <Text key={idx} {...getStyle(segment.type)}>
                    {segment.value}
                  </Text>
                ))}
              </Text>
            </MeasureBox>
          </Box>
          <Spacer />
        </Box>

        {/* 📏 Cursor Height Marker: measures content height up to cursor for scroll positioning */}
        {/* Hidden below main content; its height determines scroll behavior */}
        <MeasureBox onHeightChange={setMarkerHeight}>
          <Text>
            {preCursor?.map((segment, idx) => (
              <Text key={idx} {...getStyle(segment.type)}>
                {segment.value}
              </Text>
            ))}
          </Text>
        </MeasureBox>
      </Box>
    </Box>
  );
};
