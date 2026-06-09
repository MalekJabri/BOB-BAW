# RiskFactor Widget

A BAW Coach View widget that displays risk levels with color-coded icons and badges based on integer risk score thresholds.

## Overview

The RiskFactor widget provides a visual representation of risk scores with automatic level classification, distinct icons for each risk level, and configurable thresholds. It's designed for scenarios where risk assessment needs to be clearly communicated with immediate visual feedback.

## Features

- **Automatic Risk Classification**: Converts numeric scores (0-100) into risk levels
- **Four Risk Levels**: Low, Normal, High, and Critical with distinct visual treatments
- **Unique Icons**: Different SVG icons for each risk level
- **Color-Coded Display**: Carbon Design System colors for consistent branding
- **Configurable Thresholds**: Customize the score ranges for each risk level
- **Pulse Animation**: High and Critical risks pulse to draw attention
- **Flexible Display**: Toggle score and label visibility
- **Responsive Sizing**: Three icon sizes (small, medium, large)

## Risk Levels

| Level | Default Range | Icon | Color | Animation |
|-------|---------------|------|-------|-----------|
| **Low** | 0-30 | Shield with checkmark | Green | None |
| **Normal** | 31-69 | Circle with crosshair | Blue | None |
| **High** | 70-89 | Warning triangle | Red | Pulse |
| **Critical** | 90-100 | Alert with X | Dark Red | Pulse |

## Data Binding

The widget expects a single integer value representing the risk score:

```javascript
// Example: Bind to a process variable
tw.local.riskScore = 75; // High risk
```

## Configuration Options

### lowThreshold (Integer)
- **Default**: 30
- **Description**: Maximum score for low risk classification
- **Example**: Setting to 40 means scores 0-40 are "Low Risk"

### highThreshold (Integer)
- **Default**: 70
- **Description**: Minimum score for high risk classification
- **Example**: Setting to 60 means scores 60-89 are "High Risk"

### showLabel (Boolean)
- **Default**: true
- **Description**: Display the risk level text label
- **Example**: "LOW RISK", "HIGH RISK"

### showScore (Boolean)
- **Default**: true
- **Description**: Display the numeric risk score
- **Example**: "Score: 75 / 100"

### iconSize (String)
- **Default**: "medium"
- **Options**: "small" (24px), "medium" (32px), "large" (48px)
- **Description**: Size of the risk icon

## Usage Examples

### Basic Usage
1. Add the RiskFactor widget to your coach
2. Bind the widget to an integer variable (0-100)
3. The widget automatically displays the appropriate risk level

### Custom Thresholds
Configure thresholds for specific business rules:
- **Conservative**: lowThreshold=20, highThreshold=50
- **Moderate**: lowThreshold=30, highThreshold=70 (default)
- **Lenient**: lowThreshold=40, highThreshold=80

### Display Variations
- **Icon Only**: Set showLabel=false, showScore=false
- **Label Only**: Set showScore=false, iconSize="small"
- **Full Display**: Keep all options enabled (default)

## Use Cases

### Insurance Underwriting
Display applicant risk scores with automatic classification:
- Low Risk: Standard rates
- Normal Risk: Slightly elevated premiums
- High Risk: Significant premium increase
- Critical Risk: Requires manual review

### Credit Assessment
Show creditworthiness ratings:
- Low Risk: Excellent credit (0-30)
- Normal Risk: Good credit (31-69)
- High Risk: Fair credit (70-89)
- Critical Risk: Poor credit (90-100)

### Security Monitoring
Indicate threat levels in real-time:
- Low Risk: Normal operations
- Normal Risk: Elevated monitoring
- High Risk: Active threat detected
- Critical Risk: Immediate action required

### Quality Control
Display defect risk scores:
- Low Risk: Acceptable quality
- Normal Risk: Minor issues
- High Risk: Significant defects
- Critical Risk: Production halt

## Styling

The widget uses Carbon Design System colors and follows IBM design guidelines:

- **Typography**: IBM Plex Sans font family
- **Colors**: Carbon color palette (Green, Blue, Red)
- **Spacing**: Consistent 12-16px padding
- **Borders**: 1px solid with rounded corners
- **Shadows**: Subtle elevation on hover

## Events

### Change Event
The widget includes a change event handler that automatically re-renders when the risk score changes. No additional configuration needed.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)

## Version History

- **1.0.0**: Initial release with four risk levels and configurable thresholds

## Related Widgets

- **ProgressBar**: For linear progress indication
- **ProcessCircle**: For circular progress visualization
- **Timeline**: For event-based risk tracking

## Support

For issues or questions, refer to the BAW Coach View documentation or contact your system administrator.

---

**Made with Bob** - IBM Business Automation Workflow Custom Widget
