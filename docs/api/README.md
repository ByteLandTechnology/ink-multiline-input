**ink-multiline-input**

---

# ink-multiline-input 📝

> A robust multi-line text input component for [Ink](https://github.com/vadimdemedes/ink) applications. 🚀

## Features ✨

- ↕️ **Vertical Scrolling**: Automatically scrolls to keep the cursor in view.
- 🖱️ **Cursor Navigation**: Full support for arrow keys (Up, Down, Left, Right).
- 🔙 **Editing**: Supports Backspace and Delete keys.
- 🎨 **Customization**: Style the active line with `highlightStyle`.
- 🎭 **Mask Support**: Hide text with mask characters for password inputs.
- 📏 **Flexible Sizing**: Control visible rows with `rows` and `maxRows`.

## Installation 📦

```bash
npm install ink-multiline-input
```

## Usage 🛠️

```tsx
import React, { useState } from "react";
import { render, Box } from "ink";
import { MultilineInput } from "ink-multiline-input";

const App = () => {
  const [value, setValue] = useState("");

  return (
    <Box padding={1}>
      <MultilineInput
        value={value}
        onChange={setValue}
        rows={3}
        maxRows={10}
        placeholder="Type something here..."
        highlightStyle={{ backgroundColor: "blue" }}
        textStyle={{ color: "white" }}
        onSubmit={(val) => console.log("Submitted:", val)}
        keyBindings={{
          submit: (key) => key.ctrl && key.return,
        }}
      />
    </Box>
  );
};

render(<App />);
```

## Props ⚙️

### MultilineInput (Controlled)

| Prop                  | Type                      | Default | Description                                                       |
| --------------------- | ------------------------- | ------- | ----------------------------------------------------------------- |
| `value`               | `string`                  | -       | 📝 The current value of the input.                                |
| `onChange`            | `(value: string) => void` | -       | 🔄 Callback function triggered when the value changes.            |
| `onSubmit`            | `(value: string) => void` | -       | 🚀 (Optional) Callback triggered when the submit key is pressed.  |
| `rows`                | `number`                  | -       | 📏 (Optional) Minimum number of rows to display.                  |
| `maxRows`             | `number`                  | -       | 📏 (Optional) Maximum number of rows to display.                  |
| `highlightStyle`      | `TextProps`               | -       | 🎨 (Optional) Style to apply to the current line.                 |
| `textStyle`           | `TextProps`               | -       | 🔤 (Optional) Style to apply to the text.                         |
| `placeholder`         | `string`                  | `""`    | 📭 (Optional) Text to display when value is empty.                |
| `mask`                | `string`                  | -       | 🎭 (Optional) Character to mask text (e.g., `"*"` for passwords). |
| `showCursor`          | `boolean`                 | `true`  | 🖱️ (Optional) Whether to show the cursor.                         |
| `focus`               | `boolean`                 | `true`  | 🎯 (Optional) Whether this input should receive keyboard input.   |
| `tabSize`             | `number`                  | `4`     | ↔️ (Optional) Number of spaces to expand tabs to.                 |
| `keyBindings`         | `object`                  | -       | ⌨️ (Optional) Custom key bindings for `submit` and `newline`.     |
| `highlightPastedText` | `boolean`                 | `false` | 🎨 (Optional) Highlight recently pasted text.                     |
| `useCustomInput`      | `function`                | -       | 🔌 (Optional) Custom input hook to replace default `useInput`.    |

### Key Bindings

You can customize which keys trigger specific actions:

```tsx
keyBindings={{
  submit: (key) => key.ctrl && key.return, // Ctrl+Enter to submit
  newline: (key) => key.return, // Enter for newline (default)
}}
```

### UncontrolledMultilineInput

For advanced use cases where you want to control the cursor position yourself, use `UncontrolledMultilineInput`:

```tsx
import { UncontrolledMultilineInput } from "ink-multiline-input";

<UncontrolledMultilineInput
  value={text}
  cursorIndex={cursorPos}
  rows={5}
  maxRows={10}
  showCursor={true}
  focus={true}
/>;
```

## API Documentation 📚

For detailed API documentation, see the [API Reference](_media/README.md).

## License 📄

MIT
