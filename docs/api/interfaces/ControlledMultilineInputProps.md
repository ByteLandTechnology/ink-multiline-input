[**ink-multiline-input**](../README.md)

---

[ink-multiline-input](../globals.md) / ControlledMultilineInputProps

# Interface: ControlledMultilineInputProps

## Extended by

- [`MultilineInputProps`](MultilineInputProps.md)

## Properties

### cursorIndex?

> `optional` **cursorIndex**: `number`

Current cursor position (0-indexed).

---

### focus?

> `optional` **focus**: `boolean`

Whether the input is focused.

---

### highlight?

> `optional` **highlight**: `object`

Highlight range for pasted text.
Only contains the position of the pasted text.

#### end

> **end**: `number`

#### start

> **start**: `number`

---

### highlightStyle?

> `optional` **highlightStyle**: `any`

🎨 Style to apply to the line containing the cursor (Text).
This style is applied to the entire logical line where the cursor is located.

---

### mask?

> `optional` **mask**: `string`

Replace all chars and mask the value. Useful for password inputs.

---

### maxRows?

> `optional` **maxRows**: `number`

📏 The maximum number of rows to display.

---

### placeholder?

> `optional` **placeholder**: `string`

Text to display when `value` is empty.

---

### refreshKey?

> `optional` **refreshKey**: `any`

A key that triggers refresh when changed.
Changing this value forces the component to re-render.

---

### rows?

> `optional` **rows**: `number`

📏 The minimum number of rows to display.

---

### showCursor?

> `optional` **showCursor**: `boolean`

Whether to show cursor and allow navigation inside text input with arrow keys.

---

### tabSize?

> `optional` **tabSize**: `number`

Number of spaces to expand tabs to when displaying. Default: 4.

---

### textStyle?

> `optional` **textStyle**: `any`

Style to apply to the text.

---

### value

> **value**: `string`

📝 The current value to display.
