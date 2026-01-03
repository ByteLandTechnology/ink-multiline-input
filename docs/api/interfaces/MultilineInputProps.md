[**ink-multiline-input**](../README.md)

---

[ink-multiline-input](../globals.md) / MultilineInputProps

# Interface: MultilineInputProps

📦 Exports the MultilineInput components and their props.

## Extends

- [`ControlledMultilineInputProps`](ControlledMultilineInputProps.md)

## Properties

### cursorIndex?

> `optional` **cursorIndex**: `number`

Current cursor position (0-indexed).

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`cursorIndex`](ControlledMultilineInputProps.md#cursorindex)

---

### focus?

> `optional` **focus**: `boolean`

🎯 Whether this input should receive keyboard input.
Useful for routing input when multiple inputs exist.

#### Overrides

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`focus`](ControlledMultilineInputProps.md#focus)

---

### highlight?

> `optional` **highlight**: `object`

Highlight range for pasted text.
Only contains the position of the pasted text.

#### end

> **end**: `number`

#### start

> **start**: `number`

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`highlight`](ControlledMultilineInputProps.md#highlight)

---

### highlightPastedText?

> `optional` **highlightPastedText**: `boolean`

🎨 When true, highlights recently pasted text with highlightStyle.

---

### highlightStyle?

> `optional` **highlightStyle**: `any`

🎨 Style to apply to the line containing the cursor (Text).
This style is applied to the entire logical line where the cursor is located.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`highlightStyle`](ControlledMultilineInputProps.md#highlightstyle)

---

### keyBindings?

> `optional` **keyBindings**: `object`

⌨️ Custom key bindings for submit and newline actions.

#### newline()?

> `optional` **newline**: (`key`) => `boolean`

Returns true if the key should insert a newline (default: Enter).

##### Parameters

###### key

`Key`

##### Returns

`boolean`

#### submit()?

> `optional` **submit**: (`key`) => `boolean`

Returns true if the key should trigger submit (default: Ctrl+Enter).

##### Parameters

###### key

`Key`

##### Returns

`boolean`

---

### mask?

> `optional` **mask**: `string`

Replace all chars and mask the value. Useful for password inputs.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`mask`](ControlledMultilineInputProps.md#mask)

---

### maxRows?

> `optional` **maxRows**: `number`

📏 The maximum number of rows to display.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`maxRows`](ControlledMultilineInputProps.md#maxrows)

---

### onChange()

> **onChange**: (`value`) => `void`

🔄 Callback function triggered when the value changes.

#### Parameters

##### value

`string`

#### Returns

`void`

---

### onSubmit()?

> `optional` **onSubmit**: (`value`) => `void`

🚀 Optional callback triggered when the submit key is pressed.

#### Parameters

##### value

`string`

#### Returns

`void`

---

### placeholder?

> `optional` **placeholder**: `string`

Text to display when `value` is empty.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`placeholder`](ControlledMultilineInputProps.md#placeholder)

---

### refreshKey?

> `optional` **refreshKey**: `any`

A key that triggers refresh when changed.
Changing this value forces the component to re-render.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`refreshKey`](ControlledMultilineInputProps.md#refreshkey)

---

### rows?

> `optional` **rows**: `number`

📏 The minimum number of rows to display.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`rows`](ControlledMultilineInputProps.md#rows)

---

### showCursor?

> `optional` **showCursor**: `boolean`

Whether to show cursor and allow navigation inside text input with arrow keys.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`showCursor`](ControlledMultilineInputProps.md#showcursor)

---

### tabSize?

> `optional` **tabSize**: `number`

Number of spaces to expand tabs to when displaying. Default: 4.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`tabSize`](ControlledMultilineInputProps.md#tabsize)

---

### textStyle?

> `optional` **textStyle**: `any`

Style to apply to the text.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`textStyle`](ControlledMultilineInputProps.md#textstyle)

---

### useCustomInput()?

> `optional` **useCustomInput**: (`inputHandler`, `isActive`) => `void`

🔌 Custom input hook. Use this to replace the default `useInput` from Ink.
Useful for routing input to specific components when multiple inputs exist.

#### Parameters

##### inputHandler

(`input`, `key`) => `void`

##### isActive

`boolean`

#### Returns

`void`

---

### value

> **value**: `string`

📝 The current value to display.

#### Inherited from

[`ControlledMultilineInputProps`](ControlledMultilineInputProps.md).[`value`](ControlledMultilineInputProps.md#value)
