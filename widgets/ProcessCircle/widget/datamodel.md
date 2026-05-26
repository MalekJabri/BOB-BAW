# ProcessCircle Widget - Data Model

## Business Data

### Input Binding
- **Type**: Integer
- **Description**: The current progress value to display
- **Validation**: Automatically clamped between MinValue and MaxValue
- **Example**: `65` (represents 65% if MinValue=0 and MaxValue=100)

## Configuration Options

### MinValue
- **Type**: Integer
- **Default**: `0`
- **Description**: Minimum value for the progress range
- **Usage**: Defines the lower bound of the progress scale

### MaxValue
- **Type**: Integer
- **Default**: `100`
- **Description**: Maximum value for the progress range
- **Usage**: Defines the upper bound of the progress scale

### postParameter (Display Suffix)
- **Type**: String
- **Default**: `"%"`
- **Description**: Text suffix displayed after the value
- **Examples**:
  - `"%"` → displays "65%"
  - `" tasks"` → displays "65 tasks"
  - `" pts"` → displays "65 pts"
  - `""` → displays "65" (no suffix)

### CircleSize
- **Type**: String (CSS value)
- **Default**: `"12rem"`
- **Description**: Overall size of the progress circle
- **Examples**: `"12rem"`, `"200px"`, `"15rem"`

### RingThickness
- **Type**: String (CSS value)
- **Default**: `"0.5rem"`
- **Description**: Thickness of the progress ring
- **Examples**: `"0.5rem"`, `"8px"`, `"1rem"`

## Color Behavior

The widget automatically changes color based on percentage:

| Percentage Range | Color | Carbon Variable | Meaning |
|-----------------|-------|-----------------|---------|
| 0% - 49%        | 🟢 Green | `--color-success` (#198038) | Normal/Good |
| 50% - 69%       | 🟡 Yellow | `--color-warning` (#f1c21b) | Warning/Caution |
| 70% - 100%      | 🔴 Red | `--color-error` (#da1e28) | Critical/Alert |

## Calculation

The percentage is calculated as:
```
percentage = ((value - MinValue) / (MaxValue - MinValue)) × 100
```

### Example
- MinValue: 0
- MaxValue: 200
- Current Value: 150
- Calculated Percentage: 75%
- Display: "150%" (or "150" with custom postParameter)
- Color: Red (75% ≥ 70%)
