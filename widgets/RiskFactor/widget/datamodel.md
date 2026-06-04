## Business Data

The RiskFactor widget expects an integer value representing the risk score.

### Data Type

- **Type**: Integer
- **Range**: 0 to 100
- **Description**: Numeric risk score that determines the risk level and visual presentation

### Risk Level Calculation

The widget automatically calculates the risk level based on configurable thresholds:

| Risk Level | Default Range | Icon | Color | Animation |
|------------|---------------|------|-------|-----------|
| **Low Risk** | 0 - 30 | Shield with checkmark | Green (#198038) | None |
| **Normal Risk** | 31 - 69 | Circle with crosshair | Blue (#0043ce) | None |
| **High Risk** | 70 - 89 | Warning triangle | Red (#da1e28) | Pulse |
| **Critical Risk** | 90 - 100 | Alert with X | Dark Red (#a2191f) | Pulse |

### Configuration Options

The widget provides several configuration options to customize behavior:

1. **lowThreshold** (Integer, default: 30)
   - Maximum score for low risk classification
   - Scores from 0 to this value are considered "Low Risk"

2. **highThreshold** (Integer, default: 70)
   - Minimum score for high risk classification
   - Scores from this value to 89 are "High Risk"
   - Scores 90+ are always "Critical Risk"

3. **showLabel** (Boolean, default: true)
   - Display the risk level text label (e.g., "Low Risk", "High Risk")

4. **showScore** (Boolean, default: true)
   - Display the numeric risk score (e.g., "Score: 75 / 100")

5. **iconSize** (String, default: "medium")
   - Size of the risk icon: "small" (24px), "medium" (32px), or "large" (48px)

### Example Data

```javascript
// Low risk score
25

// Normal risk score
50

// High risk score
75

// Critical risk score
95
```

### Visual Presentation

The widget displays:
- **Icon**: Color-coded SVG icon representing the risk level
- **Label**: Risk level text (if enabled)
- **Score**: Numeric score out of 100 (if enabled)
- **Background**: Color-coded background matching the risk level
- **Animation**: Pulsing effect for high and critical risk levels

### Use Cases

- **Insurance Underwriting**: Display applicant risk scores
- **Credit Assessment**: Show creditworthiness ratings
- **Security Monitoring**: Indicate threat levels
- **Quality Control**: Display defect risk scores
- **Compliance**: Show regulatory risk assessments
- **Project Management**: Indicate project risk levels
