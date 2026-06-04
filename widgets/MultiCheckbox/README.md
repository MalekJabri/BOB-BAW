# MultiCheckbox Widget

A multi-checkbox widget for IBM Business Automation Workflow that allows users to select multiple values from a list of options displayed as checkboxes.

## Overview

The MultiCheckbox widget provides a simple and accessible way to present multiple selection options directly as checkboxes, without requiring a dropdown interface. It follows Carbon Design System principles and supports various layout options.

## Features

- **Direct Checkbox Display**: All options are visible as checkboxes without dropdown interaction
- **Multiple Selection**: Users can select multiple values simultaneously
- **Flexible Layouts**: Supports vertical, horizontal, and compact layouts
- **Carbon Design System**: Follows IBM Carbon Design System styling and patterns
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive**: Adapts to different screen sizes
- **Configurable**: Customizable label, helper text, and disabled state

## Data Binding

### Input Data
- **Type**: `String[]` (Array of strings)
- **Description**: Array of selected values
- **Example**: `["option1", "option3"]`

### Output Data
- **Type**: `String[]` (Array of strings)
- **Description**: Updated array of selected values when checkboxes are toggled
- **Example**: `["option1", "option2", "option3"]`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `NameValuePair[]` | `[]` | Array of available options with `value` and `name` properties |
| `label` | `String` | `""` | Label text displayed above the checkboxes |
| `layout` | `String` | `"vertical"` | Layout direction: `"vertical"`, `"horizontal"`, or `"compact"` |
| `disabled` | `Boolean` | `false` | Disable all checkboxes |
| `helperText` | `String` | `""` | Helper text displayed below the checkboxes |

## Usage Example

### Basic Usage
```javascript
// Options configuration
var options = [
  { value: "option1", name: "First Option" },
  { value: "option2", name: "Second Option" },
  { value: "option3", name: "Third Option" }
];

// Initial selected values
var selectedValues = ["option1"];
```

### Vertical Layout (Default)
```javascript
// Configuration
{
  options: options,
  label: "Select your preferences",
  layout: "vertical",
  helperText: "You can select multiple options"
}
```

### Horizontal Layout
```javascript
// Configuration
{
  options: options,
  label: "Choose features",
  layout: "horizontal"
}
```

### Compact Layout
```javascript
// Configuration
{
  options: options,
  layout: "compact"
}
```

## Events

### Change Event
The widget fires a change event whenever the selection changes. The change event handler updates the display to reflect the new selection state.

## Styling

The widget uses Carbon Design System colors and typography:
- **Primary Color**: `#0f62fe` (IBM Blue)
- **Text Color**: `#161616` (Gray 100)
- **Border Color**: `#8d8d8d` (Gray 50)
- **Background**: `#f4f4f4` (Gray 10)
- **Font Family**: IBM Plex Sans

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles for screen readers
- Focus indicators following Carbon Design System
- Semantic HTML structure
- High contrast mode support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Implementation Notes

1. The widget expects options in the format `{ value: string, name: string }`
2. Selected values are stored as an array of strings matching the `value` property
3. The widget automatically handles the `.items` property when options are bound as a list
4. Layout changes are applied via CSS classes
5. Disabled state affects all checkboxes simultaneously

## Related Widgets

- **MultiSelect**: Dropdown-based multi-select with search functionality
- **Radio Button Group**: Single selection from multiple options

## Version History

- **1.0.0** (2026-06-03): Initial release

## License

Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation 2026. All Rights Reserved.

---

Made with Bob