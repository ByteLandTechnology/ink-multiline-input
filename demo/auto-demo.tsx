/**
 * @fileoverview Auto Demo for ink-multiline-input
 *
 * 🎬 This file provides automated demonstrations of MultilineInput capabilities.
 * It is used to generate animated SVG recordings (via termtosvg) for documentation.
 *
 * Each demo category showcases a specific feature of the MultilineInput component:
 * - 📝 typing: Basic text input and character insertion
 * - 🧭 navigation: Cursor navigation (up, down, left, right, line-based)
 * - ✂️ editing: Text editing operations (backspace, delete, newline)
 * - 🎨 styling: Visual styles (highlight, placeholder, text style, mask)
 * - 📜 scrolling: Multi-line scrolling behavior with rows/maxRows
 *
 * @usage
 * ```bash
 * # Run a specific demo category
 * npx tsx demo/auto-demo.tsx typing
 * npx tsx demo/auto-demo.tsx navigation
 * npx tsx demo/auto-demo.tsx editing
 * npx tsx demo/auto-demo.tsx styling
 * npx tsx demo/auto-demo.tsx scrolling
 *
 * # Generate SVG animation (requires termtosvg)
 * termtosvg typing.svg -c "npx tsx demo/auto-demo.tsx typing" -t putty -g 70x20
 * ```
 */

import React, { useState, useEffect, ReactNode } from "react";
import { render, Text, Box, Spacer } from "ink";
import { MultilineInput, UncontrolledMultilineInput } from "../src/index";

// =============================================================================
// Configuration
// =============================================================================

/**
 * 🎯 Get the demo category from command line argument.
 * Defaults to "typing" if no argument is provided.
 */
const DEMO_CATEGORY = process.argv[2] || "typing";

/**
 * 📋 Available demo categories with their display names.
 * Used for validation and display purposes.
 */
const CATEGORIES: Record<string, string> = {
  typing: "📝 Text Input",
  navigation: "🧭 Cursor Navigation",
  editing: "✂️ Text Editing",
  styling: "🎨 Styling Options",
  scrolling: "📜 Scrolling Behavior",
};

// Validate the provided category
if (!Object.keys(CATEGORIES).includes(DEMO_CATEGORY)) {
  console.error(`❌ Invalid category: ${DEMO_CATEGORY}`);
  console.error(
    `📋 Available categories: ${Object.keys(CATEGORIES).join(", ")}`,
  );
  process.exit(1);
}

// =============================================================================
// Demo Layout Component
// =============================================================================

/**
 * 📐 Props for the DemoLayout component.
 */
interface DemoLayoutProps {
  /** 📌 Title of the demo */
  title: string;
  /** 📝 Current action description shown at the top */
  description?: string;
  /** 🎯 Content to render */
  children?: ReactNode;
}

/**
 * 🖼️ DemoLayout - A consistent layout wrapper for all demos.
 *
 * This component provides:
 * - A title bar showing the demo category
 * - A description area for current action
 * - A bordered content area for the demo content
 *
 * @example
 * ```tsx
 * <DemoLayout
 *   title="📝 Text Input Demo"
 *   description="Typing 'Hello World'..."
 * >
 *   <MultilineInput {...props} />
 * </DemoLayout>
 * ```
 */
export const DemoLayout: React.FC<DemoLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Box flexDirection="column" width={70}>
      {/* 🏷️ Title bar */}
      <Box paddingX={1}>
        <Text color="cyan" bold>
          {title}
        </Text>
      </Box>

      {/* 📝 Description bar - shows current action being demonstrated */}
      {description && (
        <Box paddingX={1}>
          <Text color="yellow" wrap="truncate">
            {description}
          </Text>
        </Box>
      )}

      {/* 🎯 Demo content area */}
      <Box
        borderStyle="single"
        borderColor="blue"
        flexDirection="column"
        paddingX={1}
        paddingY={1}
      >
        {children}
      </Box>
    </Box>
  );
};

// =============================================================================
// Split Demo Layout for Comparisons
// =============================================================================

/**
 * 📐 Props for the SplitDemoLayout component.
 */
interface SplitDemoLayoutProps {
  /** 📌 Title of the demo */
  title: string;
  /** 📝 Current action description shown at the top */
  description?: string;
  /** 🔵 Left side label */
  leftLabel: string;
  /** 🟣 Right side label */
  rightLabel: string;
  /** 🔵 Left side content */
  leftContent: ReactNode;
  /** 🟣 Right side content */
  rightContent: ReactNode;
}

/**
 * 🖼️ SplitDemoLayout - Side-by-side comparison layout.
 *
 * This component renders two content areas side by side for comparing
 * different configurations or states of the MultilineInput component.
 */
export const SplitDemoLayout: React.FC<SplitDemoLayoutProps> = ({
  title,
  description,
  leftLabel,
  rightLabel,
  leftContent,
  rightContent,
}) => {
  return (
    <Box flexDirection="column" width={70}>
      {/* 🏷️ Title bar */}
      <Box paddingX={1}>
        <Text color="cyan" bold>
          {title}
        </Text>
      </Box>

      {/* 📝 Description bar */}
      {description && (
        <Box paddingX={1}>
          <Text color="yellow" wrap="truncate">
            {description}
          </Text>
        </Box>
      )}

      {/* 🔀 Split view container */}
      <Box flexDirection="row">
        {/* 🔵 Left side */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          <Box paddingX={1}>
            <Text color="green" bold>
              {leftLabel}
            </Text>
          </Box>
          <Box
            borderStyle="single"
            borderColor="green"
            flexDirection="column"
            paddingX={1}
          >
            {leftContent}
          </Box>
        </Box>

        {/* 🟣 Right side */}
        <Box flexDirection="column" flexBasis={1} flexGrow={1} flexShrink={0}>
          <Box paddingX={1}>
            <Text color="magenta" bold>
              {rightLabel}
            </Text>
          </Box>
          <Box
            borderStyle="single"
            borderColor="magenta"
            flexDirection="column"
            paddingX={1}
          >
            {rightContent}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// =============================================================================
// Demo Components
// =============================================================================

/**
 * 📝 TypingDemo - Demonstrates basic text input.
 *
 * This demo showcases:
 * 1. Initial empty state with placeholder
 * 2. Character-by-character typing animation via simulated input
 * 3. Cursor movement as text is typed
 * 4. Multi-line text input with newlines
 *
 * Uses useCustomInput to capture the input handler and simulate typing.
 */
const TypingDemo = () => {
  const [description, setDescription] = useState(
    "🚀 Initializing typing demo...",
  );
  const [value, setValue] = useState("");

  // 🎯 Store the input handler reference for simulated typing
  const inputHandlerRef = React.useRef<
    ((input: string, key: any) => void) | null
  >(null);

  // 🔧 Custom input hook that captures the handler for automation
  const useCustomInput = (
    handler: (input: string, key: any) => void,
    _isActive: boolean,
  ) => {
    // Store the handler reference so we can call it programmatically
    inputHandlerRef.current = handler;
  };

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Text to type character by character
    const textToType =
      "Hello, World!\nThis is a multiline input.\nEnjoy typing! 🎉";
    let currentIndex = 0;

    // === Demo Sequence ===

    // Step 1: Show placeholder state
    timeouts.push(
      setTimeout(
        () => setDescription("📭 Empty state with placeholder..."),
        500,
      ),
    );

    // Step 2: Start typing
    timeouts.push(
      setTimeout(
        () => setDescription("⌨️ Typing text character by character..."),
        2000,
      ),
    );

    // Type each character with delay using the captured input handler
    timeouts.push(
      setTimeout(() => {
        const typingInterval = setInterval(() => {
          if (currentIndex < textToType.length) {
            const char = textToType[currentIndex];
            // 🎹 Simulate key press through the input handler
            if (inputHandlerRef.current) {
              if (char === "\n") {
                // Simulate Enter key for newline
                inputHandlerRef.current("", { return: true });
              } else {
                // Simulate normal character input
                inputHandlerRef.current(char!, {});
              }
            }
            currentIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 100);

        // Store interval for cleanup
        timeouts.push(
          setTimeout(
            () => {
              setDescription("✅ Typing complete!");
            },
            textToType.length * 100 + 500,
          ),
        );
      }, 2500),
    );

    // Exit after demo completes
    timeouts.push(
      setTimeout(() => process.exit(0), 2500 + textToType.length * 100 + 2000),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <DemoLayout title="📝 Text Input Demo" description={description}>
      <Box flexDirection="column">
        <Text color="gray" dimColor>
          MultilineInput Component:
        </Text>
        <MultilineInput
          value={value}
          onChange={setValue}
          placeholder="Type something here..."
          rows={5}
          maxRows={5}
          highlightStyle={{ backgroundColor: "blue" }}
          useCustomInput={useCustomInput}
        />
      </Box>
    </DemoLayout>
  );
};

/**
 * 🧭 NavigationDemo - Demonstrates cursor navigation.
 *
 * This demo showcases:
 * 1. Using UncontrolledMultilineInput to control cursor position
 * 2. Moving cursor left and right
 * 3. Moving cursor up and down between lines
 * 4. Line-based cursor positioning
 */
const NavigationDemo = () => {
  const [description, setDescription] = useState(
    "🚀 Initializing navigation demo...",
  );
  const [cursorIndex, setCursorIndex] = useState(0);

  // Fixed text content for navigation demo
  const value = "Line 1: Hello\nLine 2: World\nLine 3: Demo\nLine 4: Test";

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // === Demo Sequence ===

    // Step 1: Initial position
    timeouts.push(
      setTimeout(() => setDescription("📍 Starting at position 0..."), 500),
    );

    // Step 2: Move right through first line
    timeouts.push(
      setTimeout(() => setDescription("➡️ Moving cursor right..."), 2000),
    );
    let pos = 0;
    for (let i = 0; i < 14; i++) {
      const delay = 2500 + i * 200;
      timeouts.push(
        setTimeout(() => {
          pos++;
          setCursorIndex(pos);
        }, delay),
      );
    }

    // Step 3: Move to next line (past newline)
    timeouts.push(
      setTimeout(() => {
        setDescription("⬇️ Moving to next line...");
        setCursorIndex(15); // Past the newline
      }, 5500),
    );

    // Step 4: Continue moving down
    timeouts.push(
      setTimeout(() => {
        setDescription("⬇️ Moving down to Line 3...");
        setCursorIndex(29); // Line 3 start
      }, 7000),
    );

    // Step 5: Move left
    timeouts.push(
      setTimeout(() => setDescription("⬅️ Moving cursor left..."), 8500),
    );
    for (let i = 0; i < 5; i++) {
      const delay = 9000 + i * 200;
      timeouts.push(
        setTimeout(() => {
          setCursorIndex((prev) => Math.max(0, prev - 1));
        }, delay),
      );
    }

    // Step 6: Jump to end
    timeouts.push(
      setTimeout(() => {
        setDescription("🏁 Jumping to end of text...");
        setCursorIndex(value.length);
      }, 10500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 12000));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [value.length]);

  return (
    <DemoLayout title="🧭 Cursor Navigation Demo" description={description}>
      <Box flexDirection="column">
        <Text color="gray" dimColor>
          Cursor position: {cursorIndex} / {value.length}
        </Text>
        <UncontrolledMultilineInput
          value={value}
          cursorIndex={cursorIndex}
          rows={5}
          maxRows={5}
          showCursor={true}
          focus={true}
          highlightStyle={{ backgroundColor: "blue" }}
        />
      </Box>
    </DemoLayout>
  );
};

/**
 * ✂️ EditingDemo - Demonstrates text editing operations.
 *
 * This demo showcases:
 * 1. Typing text via simulated input
 * 2. Backspace to delete characters
 * 3. Inserting newlines
 * 4. Editing in the middle of text
 *
 * Uses useCustomInput to capture the input handler and simulate editing.
 */
const EditingDemo = () => {
  const [description, setDescription] = useState(
    "🚀 Initializing editing demo...",
  );
  const [value, setValue] = useState("");

  // 🎯 Store the input handler reference for simulated editing
  const inputHandlerRef = React.useRef<
    ((input: string, key: any) => void) | null
  >(null);

  // 🔧 Custom input hook that captures the handler for automation
  const useCustomInput = (
    handler: (input: string, key: any) => void,
    _isActive: boolean,
  ) => {
    inputHandlerRef.current = handler;
  };

  // 🎹 Helper function to simulate typing a character
  const simulateType = (char: string) => {
    if (inputHandlerRef.current) {
      if (char === "\n") {
        inputHandlerRef.current("", { return: true });
      } else {
        inputHandlerRef.current(char, {});
      }
    }
  };

  // 🔙 Helper function to simulate backspace
  const simulateBackspace = () => {
    if (inputHandlerRef.current) {
      inputHandlerRef.current("", { backspace: true });
    }
  };

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // === Demo Sequence ===

    // Step 1: Type initial text "Hello World"
    timeouts.push(
      setTimeout(() => setDescription("⌨️ Typing initial text..."), 500),
    );
    const initialText = "Hello World";
    for (let i = 0; i < initialText.length; i++) {
      const delay = 1000 + i * 100;
      timeouts.push(
        setTimeout(() => {
          simulateType(initialText[i]!);
        }, delay),
      );
    }

    // Step 2: Delete some characters using backspace
    timeouts.push(
      setTimeout(
        () => setDescription("🔙 Using backspace to delete 'World'..."),
        2500,
      ),
    );
    for (let i = 0; i < 5; i++) {
      const delay = 3000 + i * 300;
      timeouts.push(
        setTimeout(() => {
          simulateBackspace();
        }, delay),
      );
    }

    // Step 3: Type new text "Ink!"
    timeouts.push(
      setTimeout(() => setDescription("⌨️ Typing 'Ink!'..."), 4800),
    );
    const newText = "Ink!";
    for (let i = 0; i < newText.length; i++) {
      const delay = 5200 + i * 200;
      timeouts.push(
        setTimeout(() => {
          simulateType(newText[i]!);
        }, delay),
      );
    }

    // Step 4: Insert newline
    timeouts.push(
      setTimeout(() => setDescription("↩️ Inserting newline..."), 6500),
    );
    timeouts.push(
      setTimeout(() => {
        simulateType("\n");
      }, 7000),
    );

    // Step 5: Type more text
    timeouts.push(
      setTimeout(() => setDescription("⌨️ Typing on new line..."), 7500),
    );
    const moreText = "Multiline editing works! 🎨";
    for (let i = 0; i < moreText.length; i++) {
      const delay = 8000 + i * 80;
      timeouts.push(
        setTimeout(() => {
          simulateType(moreText[i]!);
        }, delay),
      );
    }

    // Step 6: Complete
    timeouts.push(
      setTimeout(
        () => setDescription("✅ Editing demo complete!"),
        8000 + moreText.length * 80 + 500,
      ),
    );

    // Exit after demo completes
    timeouts.push(
      setTimeout(() => process.exit(0), 8000 + moreText.length * 80 + 2000),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <DemoLayout title="✂️ Text Editing Demo" description={description}>
      <Box flexDirection="column">
        <Text color="gray" dimColor>
          Value length: {value.length} characters
        </Text>
        <MultilineInput
          value={value}
          onChange={setValue}
          rows={4}
          maxRows={4}
          highlightStyle={{ backgroundColor: "blue" }}
          useCustomInput={useCustomInput}
        />
      </Box>
    </DemoLayout>
  );
};

/**
 * 🎨 StylingDemo - Demonstrates styling options.
 *
 * This demo showcases:
 * 1. Placeholder text styling
 * 2. Highlight style for current line
 * 3. Text style customization
 * 4. Focus and unfocus states
 * 5. Mask for password-like input
 *
 * Uses useCustomInput to capture the input handler and simulate typing.
 */
const StylingDemo = () => {
  const [description, setDescription] = useState(
    "🚀 Initializing styling demo...",
  );
  const [focusLeft, setFocusLeft] = useState(false);
  const [focusRight, setFocusRight] = useState(false);
  const [valueLeft, setValueLeft] = useState("");
  const [valueRight, setValueRight] = useState(
    "Some text\nwith multiple\nlines here",
  );
  // 🎭 Mask state for password-like display
  const [maskRight, setMaskRight] = useState<string | undefined>(undefined);

  // 🎯 Store the input handler reference for simulated typing (left input)
  const leftInputHandlerRef = React.useRef<
    ((input: string, key: any) => void) | null
  >(null);

  // 🔧 Custom input hook that captures the handler for automation
  const useCustomInputLeft = (
    handler: (input: string, key: any) => void,
    _isActive: boolean,
  ) => {
    leftInputHandlerRef.current = handler;
  };

  // 🎹 Helper function to simulate typing a character in left input
  const simulateTypeLeft = (char: string) => {
    if (leftInputHandlerRef.current) {
      leftInputHandlerRef.current(char, {});
    }
  };

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // === Demo Sequence ===

    // Step 1: Show unfocused state with placeholder
    timeouts.push(
      setTimeout(
        () => setDescription("👁️ Unfocused state - showing placeholder..."),
        500,
      ),
    );

    // Step 2: Focus left input
    timeouts.push(
      setTimeout(() => setDescription("🔵 Focusing left input..."), 2500),
    );
    timeouts.push(setTimeout(() => setFocusLeft(true), 3000));

    // Step 3: Type in left input using simulated input
    timeouts.push(
      setTimeout(() => setDescription("⌨️ Typing in left input..."), 4000),
    );
    const leftText = "Typing here!";
    for (let i = 0; i < leftText.length; i++) {
      const delay = 4500 + i * 100;
      timeouts.push(
        setTimeout(() => {
          simulateTypeLeft(leftText[i]!);
        }, delay),
      );
    }

    // Step 4: Switch focus to right input
    timeouts.push(
      setTimeout(
        () => setDescription("🟣 Switching focus to right input..."),
        6500,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        setFocusLeft(false);
        setFocusRight(true);
      }, 7000),
    );

    // Step 5: Show both styling options
    timeouts.push(
      setTimeout(
        () => setDescription("🎨 Compare: Blue highlight vs Green highlight"),
        8500,
      ),
    );

    // Step 6: Enable mask on right input (password mode)
    timeouts.push(
      setTimeout(
        () => setDescription("🎭 Enabling mask='*' on right input..."),
        10500,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        setMaskRight("*");
      }, 11000),
    );

    // Step 7: Change mask character
    timeouts.push(
      setTimeout(() => setDescription("🔒 Changing mask to '●'..."), 13000),
    );
    timeouts.push(
      setTimeout(() => {
        setMaskRight("●");
      }, 13500),
    );

    // Step 8: Remove mask
    timeouts.push(
      setTimeout(
        () => setDescription("👁️ Removing mask - text visible again..."),
        15500,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        setMaskRight(undefined);
      }, 16000),
    );

    // Step 9: Remove focus from both
    timeouts.push(
      setTimeout(
        () =>
          setDescription("👁️ Removing focus - cursor and highlight hidden..."),
        18000,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        setFocusLeft(false);
        setFocusRight(false);
      }, 18500),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), 20500));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <SplitDemoLayout
      title="🎨 Styling Options Demo"
      description={description}
      leftLabel="Blue Highlight"
      rightLabel={maskRight ? `Green + Mask='${maskRight}'` : "Green Highlight"}
      leftContent={
        <MultilineInput
          value={valueLeft}
          onChange={setValueLeft}
          placeholder="Enter text here..."
          focus={focusLeft}
          rows={4}
          maxRows={4}
          highlightStyle={{ backgroundColor: "blue" }}
          textStyle={{ color: "white" }}
          useCustomInput={useCustomInputLeft}
        />
      }
      rightContent={
        <MultilineInput
          value={valueRight}
          onChange={setValueRight}
          placeholder="Enter text here..."
          focus={focusRight}
          rows={4}
          maxRows={4}
          highlightStyle={{ backgroundColor: "green" }}
          textStyle={{ color: "yellow" }}
          mask={maskRight}
        />
      }
    />
  );
};

/**
 * 📜 ScrollingDemo - Demonstrates scrolling behavior.
 *
 * This demo showcases:
 * 1. Adding lines to trigger scrolling
 * 2. Automatic scroll to keep cursor visible
 * 3. rows and maxRows configuration
 * 4. Content overflow handling
 */
const ScrollingDemo = () => {
  const [description, setDescription] = useState(
    "🚀 Initializing scrolling demo...",
  );
  const [value, setValue] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Generate multiple lines of text
    const lines = [
      "Line 1: Welcome to scrolling demo! 🎬",
      "Line 2: This demonstrates auto-scroll",
      "Line 3: The view scrolls to cursor",
      "Line 4: Keep adding more content",
      "Line 5: Watch the scroll in action",
      "Line 6: Almost there...",
      "Line 7: One more line!",
      "Line 8: And another one",
      "Line 9: Scrolling continues",
      "Line 10: Final line! 🏁",
    ];

    // === Demo Sequence ===

    // Step 1: Initial state
    timeouts.push(
      setTimeout(
        () => setDescription("📝 Starting with empty input (maxRows=5)..."),
        500,
      ),
    );

    // Step 2: Add lines one by one
    let currentText = "";
    lines.forEach((line, index) => {
      const delay = 1500 + index * 1000;
      timeouts.push(
        setTimeout(() => {
          setDescription(`➕ Adding line ${index + 1}...`);
        }, delay - 200),
      );
      timeouts.push(
        setTimeout(() => {
          currentText = currentText ? currentText + "\n" + line : line;
          setValue(currentText);
          setCursorIndex(currentText.length);
        }, delay),
      );
    });

    // Step 3: Scroll to top
    const afterLinesDelay = 1500 + lines.length * 1000;
    timeouts.push(
      setTimeout(
        () => setDescription("⬆️ Moving cursor to top..."),
        afterLinesDelay + 500,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        setCursorIndex(0);
      }, afterLinesDelay + 1000),
    );

    // Step 4: Scroll back to bottom
    timeouts.push(
      setTimeout(
        () => setDescription("⬇️ Moving cursor to bottom..."),
        afterLinesDelay + 2500,
      ),
    );
    timeouts.push(
      setTimeout(() => {
        const finalText = lines.join("\n");
        setCursorIndex(finalText.length);
      }, afterLinesDelay + 3000),
    );

    // Step 5: Complete
    timeouts.push(
      setTimeout(
        () => setDescription("✅ Scrolling demo complete!"),
        afterLinesDelay + 4500,
      ),
    );

    // Exit after demo completes
    timeouts.push(setTimeout(() => process.exit(0), afterLinesDelay + 6000));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <DemoLayout title="📜 Scrolling Behavior Demo" description={description}>
      <Box flexDirection="column">
        <Text color="gray" dimColor>
          Lines: {value.split("\n").filter(Boolean).length} | Cursor:{" "}
          {cursorIndex}
        </Text>
        <UncontrolledMultilineInput
          value={value}
          cursorIndex={cursorIndex}
          rows={3}
          maxRows={5}
          showCursor={true}
          focus={true}
          highlightStyle={{ backgroundColor: "blue" }}
        />
      </Box>
    </DemoLayout>
  );
};

// =============================================================================
// Main Demo Component
// =============================================================================

/**
 * 🎬 Demo - Main component that renders the selected demo category.
 *
 * This component:
 * 1. Maps the category name to the corresponding demo component
 * 2. Renders the selected demo within a fixed-size container
 */
const Demo = () => {
  // Map category names to their corresponding demo components
  const categoryMap: Record<string, React.ComponentType> = {
    typing: TypingDemo,
    navigation: NavigationDemo,
    editing: EditingDemo,
    styling: StylingDemo,
    scrolling: ScrollingDemo,
  };

  const DemoComponent = categoryMap[DEMO_CATEGORY];

  if (!DemoComponent) {
    return <Text color="red">❌ Category not found: {DEMO_CATEGORY}</Text>;
  }

  return (
    <Box flexDirection="column" width={70} height={20}>
      <DemoComponent />
    </Box>
  );
};

// =============================================================================
// Entry Point
// =============================================================================

// 🧹 Clear the terminal before starting the demo
console.clear();

// 🎬 Render the demo with incremental rendering for smoother updates
render(<Demo />, {
  exitOnCtrlC: true,
});
