# MultiCheckbox Widget - Data Model

## Overview
The MultiCheckbox widget manages an array of selected values from a list of checkbox options.

## Input Data Structure

### Bound Data
- **Type**: `String[]` (Array of strings)
- **Description**: Array of currently selected values
- **Required**: No (defaults to empty array)

```javascript
// Example: Two options selected
["option1", "option3"]

// Example: No options selected
[]

// Example: All options selected
["option1", "option2", "option3", "option4"]
```

## Configuration Options Data

### Options List
- **Property**: `options`
- **Type**: `NameValuePair[]` (Array of objects with `value` and `name` properties)
- **Required**: Yes
- **Description**: List of available checkbox options

```javascript
[
  { value: "option1", name: "First Option" },
  { value: "option2", name: "Second Option" },
  { value: "option3", name: "Third Option" }
]
```

**Important**: When bound as a list in BAW, the data will be wrapped in an object with an `items` property. The widget automatically handles this by accessing `options.items`.

## Output Data Structure

### Updated Selection
- **Type**: `String[]` (Array of strings)
- **Description**: Updated array of selected values after user interaction
- **Trigger**: Fires on checkbox toggle

```javascript
// User checks "option2", previously had ["option1"]
["option1", "option2"]

// User unchecks "option1", previously had ["option1", "option2"]
["option2"]
```

## Data Flow

1. **Initialization**: Widget reads bound data to determine initial checkbox states
2. **User Interaction**: User clicks a checkbox
3. **State Update**: Widget updates internal state array
4. **Data Binding**: Widget calls `setData()` with updated array
5. **Change Event**: Change event fires with new data
6. **Re-render**: Checkboxes update to reflect new state

## Validation Rules

- Selected values must exist in the options list
- Invalid values in bound data are ignored
- Empty array is valid (no selections)
- Duplicate values are automatically deduplicated

## Example Scenarios

### Scenario 1: Initial Load with Pre-selected Values
```javascript
// Bound data
["option1", "option3"]

// Options
[
  { value: "option1", name: "Email Notifications" },
  { value: "option2", name: "SMS Notifications" },
  { value: "option3", name: "Push Notifications" }
]

// Result: "Email Notifications" and "Push Notifications" are checked
```

### Scenario 2: User Toggles Selection
```javascript
// Initial state
["option1"]

// User checks "option2"
// New state
["option1", "option2"]

// User unchecks "option1"
// Final state
["option2"]
```

### Scenario 3: Dynamic Options Update
```javascript
// Original options
[
  { value: "opt1", name: "Option 1" },
  { value: "opt2", name: "Option 2" }
]

// Selected values
["opt1"]

// Options updated (opt1 removed)
[
  { value: "opt2", name: "Option 2" },
  { value: "opt3", name: "Option 3" }
]

// Selected values remain ["opt1"] but checkbox won't display
// Consider clearing selections when options change
```

## Integration with BAW

### Business Object Binding
```javascript
// Business object with string array property
{
  "selectedPreferences": ["email", "sms"]
}

// Bind to widget data
tw.local.userPreferences.selectedPreferences
```

### Service Flow Integration
```javascript
// Input variable: tw.local.selectedOptions (String[])
// Widget updates this variable on change
// Output can be used in subsequent service calls
```

## Best Practices

1. **Validate Options**: Ensure options array is not empty before rendering
2. **Handle Null Data**: Widget handles null/undefined by defaulting to empty array
3. **Preserve Selections**: When updating options, consider preserving valid selections
4. **Clear Invalid**: Remove selected values that no longer exist in options
5. **Type Safety**: Ensure all values are strings for consistency

---

Made with Bob