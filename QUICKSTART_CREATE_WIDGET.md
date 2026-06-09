# ⚡ Quick Start: Create a Custom Widget

**Goal**: Use Bob AI to create a custom BAW coach view widget from scratch.

**Time**: ~5 minutes  
**Difficulty**: ⭐⭐ Medium  
**Best For**: Learning widget development with AI assistance

---

## 📋 Prerequisites

- [ ] **IBM BAW** (v24.x or v25.x) with Process Designer access
- [ ] **Python 3.7+** installed
- [ ] **Bob AI** configured with Coach Widget mode
- [ ] **Modern web browser** for testing

---

## 🚀 Step-by-Step Guide

### Step 1: Clone the Repository (if not done)
```bash
git clone <repository-url>
cd BAWCoachMode
```

### Step 2: Start Bob in Widget Mode

Open Bob AI and say:
```
Switch to BAW Coach Widget mode
```

Bob will confirm the mode switch and be ready to create widgets.

### Step 3: Request Your Widget

Be specific about what you want. Here's an example:

```
Create a StatusBadge widget that displays status indicators with the following features:
- Support for success, warning, error, and info states
- Color-coded badges using Carbon Design System colors
- Optional icon support from Carbon Icons
- Configurable size (small, medium, large)
- Configurable text label
- Accessible with proper ARIA attributes
```

**Tips for better results:**
- Be specific about functionality
- Mention design system (Carbon)
- Include accessibility requirements
- Specify data model structure
- List any events the widget should fire

### Step 4: Review Generated Files

Bob creates a complete widget structure:

```
widgets/StatusBadge/
├── README.md                    # Widget documentation
├── StatusBadge.svg             # Widget icon for BAW palette
├── widget/
│   ├── config.json             # Widget configuration
│   ├── Layout.html             # HTML structure
│   ├── InlineCSS.css          # Widget styling
│   ├── inlineJavascript.js    # Widget logic
│   ├── datamodel.md           # Data model documentation
│   └── eventHandler.md        # Event documentation
└── AdvancePreview/
    ├── StatusBadge.html       # Standalone preview file
    └── StatusBadgeSnippet.js  # Preview logic
```

### Step 5: Review the Widget Configuration

Check `widget/config.json`:
```json
{
  "name": "StatusBadge",
  "displayName": "Status Badge",
  "description": "Displays status indicators with color-coded badges",
  "version": "1.0.0",
  "category": "Display",
  "properties": [
    {
      "name": "status",
      "type": "String",
      "defaultValue": "info",
      "description": "Status type: success, warning, error, info"
    },
    {
      "name": "label",
      "type": "String",
      "defaultValue": "Status",
      "description": "Badge text label"
    },
    {
      "name": "size",
      "type": "String",
      "defaultValue": "medium",
      "description": "Badge size: small, medium, large"
    },
    {
      "name": "showIcon",
      "type": "Boolean",
      "defaultValue": true,
      "description": "Show status icon"
    }
  ],
  "events": [
    {
      "name": "onClick",
      "description": "Fired when badge is clicked"
    }
  ]
}
```

### Step 6: Test Locally

Open the preview file in your browser:
```bash
# Option 1: Direct open
open widgets/StatusBadge/AdvancePreview/StatusBadge.html

# Option 2: Use Python server
cd widgets/StatusBadge/AdvancePreview
python3 -m http.server 8000
# Visit http://localhost:8000/StatusBadge.html
```

**What to test:**
- ✅ All status types (success, warning, error, info)
- ✅ Different sizes (small, medium, large)
- ✅ Icon visibility toggle
- ✅ Click events
- ✅ Responsive behavior
- ✅ Accessibility (keyboard navigation, screen readers)

### Step 7: Request Modifications (if needed)

If you need changes, ask Bob:

```
Update the StatusBadge widget to:
- Add a "neutral" status type with gray color
- Support custom colors via a color property
- Add a tooltip on hover
- Include animation when status changes
```

Bob will update the widget files accordingly.

### Step 8: Create Business Object (if needed)

If your widget needs a specific data structure:

```
Create a business object for StatusBadge with:
- status (String enum: success, warning, error, info, neutral)
- label (String)
- timestamp (Date)
- details (String)
```

Bob will create `widgets/StatusBadge/widget/StatusBadge.json`.

### Step 9: Package the Widget

Switch to Package Manager mode:
```
Switch to BAW Package Manager mode
```

Then package:
```
Package and deploy the toolkit
```

Bob will:
1. Detect the new StatusBadge widget
2. Scan for any business objects
3. Generate a TWX file in `output/`
4. Offer to deploy to BAW server (if MCP configured)

**Expected output:**
```
✓ Scanning widgets directory...
✓ Found 13 widgets (including StatusBadge)
✓ Scanning business objects...
✓ Generating TWX package...
✓ Package created: output/Custom_Widgets_1.0.1.twx
```

### Step 10: Import into BAW

1. Open **BAW Process Designer**
2. Go to **Process App Settings** → **Toolkits**
3. Click **Import Toolkit**
4. Select `output/Custom_Widgets_1.0.1.twx`
5. Click **Import**

### Step 11: Use Your Widget

1. Create a new **Coach** in Process Designer
2. Open the **Palette**
3. Find **StatusBadge** under your toolkit category
4. Drag and drop onto your coach
5. Configure properties in the Properties panel
6. Bind to data if needed

**🎉 Success!** You've created and deployed a custom widget with AI assistance.

---

## 🎨 Widget Development Best Practices

### Design Guidelines
- ✅ Follow Carbon Design System patterns
- ✅ Use Carbon color tokens and spacing
- ✅ Implement responsive design
- ✅ Support light and dark themes

### Accessibility
- ✅ Include proper ARIA labels and roles
- ✅ Support keyboard navigation
- ✅ Provide focus indicators
- ✅ Test with screen readers

### Code Quality
- ✅ Use clear, descriptive variable names
- ✅ Add comments for complex logic
- ✅ Handle edge cases and errors
- ✅ Validate input data

### Documentation
- ✅ Document all properties and events
- ✅ Provide usage examples
- ✅ Include data model specifications
- ✅ Add troubleshooting tips

---

## 💡 Widget Ideas

### Data Display Widgets
- **DataCard** - Display key metrics with icons
- **StatisticPanel** - Show statistics with trends
- **InfoTooltip** - Contextual help tooltips
- **AlertBanner** - System alerts and notifications

### Form Widgets
- **DateRangePicker** - Select date ranges
- **TagInput** - Multi-tag input field
- **RatingStars** - Star rating component
- **ColorPicker** - Color selection widget

### Navigation Widgets
- **TabNavigation** - Tabbed interface
- **Pagination** - Page navigation controls
- **BreadcrumbTrail** - Navigation breadcrumbs
- **SideNavigation** - Collapsible side menu

### Process Widgets
- **ProcessTimeline** - Visual process timeline
- **TaskCard** - Task display card
- **ApprovalFlow** - Approval workflow visualization
- **StatusTracker** - Multi-step status tracker

---

## 🔄 Common Widget Patterns

### Pattern 1: Simple Display Widget
```
Create a [WidgetName] widget that displays [data] with:
- Read-only display
- Carbon Design System styling
- Responsive layout
- Optional icon
```

### Pattern 2: Interactive Input Widget
```
Create a [WidgetName] widget for [purpose] with:
- User input capability
- Data validation
- Change event firing
- Error state display
- Carbon form styling
```

### Pattern 3: Complex Component Widget
```
Create a [WidgetName] widget that combines:
- Multiple sub-components
- Internal state management
- Multiple events (onChange, onSubmit, onCancel)
- Business object integration
- Advanced interactions
```

---

## 🐛 Troubleshooting

### Issue: Widget doesn't appear in BAW palette
**Solution:**
1. Verify TWX import was successful
2. Check toolkit is enabled in Process App Settings
3. Refresh the Process Designer
4. Clear browser cache
5. Check widget config.json is valid

### Issue: Widget styling looks wrong
**Solution:**
1. Verify Carbon CSS is loaded
2. Check for CSS conflicts
3. Test in preview file first
4. Review InlineCSS.css for errors
5. Ensure proper CSS class names

### Issue: Widget events not firing
**Solution:**
1. Check event handler implementation
2. Verify event is registered in config.json
3. Test in preview file with console logging
4. Check BAW coach binding configuration
5. Review eventHandler.md documentation

### Issue: Widget data binding fails
**Solution:**
1. Verify business object structure matches widget expectations
2. Check property types in config.json
3. Test with sample data in preview
4. Review datamodel.md documentation
5. Check BAW coach variable binding

---

## 📚 What You've Learned

- ✅ How to create widgets with Bob AI assistance
- ✅ Understanding widget file structure
- ✅ Testing widgets locally before deployment
- ✅ Packaging and deploying widgets to BAW
- ✅ Widget development best practices
- ✅ Common widget patterns and use cases

---

## 📖 Next Steps

- **[Parse Business Documents](QUICKSTART_PARSE_DOCUMENTS.md)** - Create widgets based on business requirements
- **[Package & Deploy](QUICKSTART_PACKAGE_DEPLOY.md)** - Deploy your widgets
- **[Widget Development Guide](docs/BAW_COACHUI_VIEW_MODE.md)** - Detailed widget documentation
- **[Carbon Design System](docs/CARBON_THEME_INTEGRATION.md)** - Styling guidelines
- **[Hands-On Labs](lab-docs/README.md)** - Step-by-step tutorials

---

## ✅ Quick Reference

### Essential Bob Commands
```
# Switch to Widget mode
"Switch to BAW Coach Widget mode"

# Create widget
"Create a [WidgetName] widget that [description]"

# Modify widget
"Update the [WidgetName] widget to [changes]"

# Create business object
"Create a business object for [WidgetName] with [fields]"

# Package
"Switch to BAW Package Manager mode"
"Package and deploy the toolkit"
```

### File Locations
- **Widget Source**: `widgets/[WidgetName]/widget/`
- **Preview Files**: `widgets/[WidgetName]/AdvancePreview/`
- **Documentation**: `widgets/[WidgetName]/README.md`
- **Output TWX**: `output/`

---

**Ready for the next step?** [Package & Deploy →](QUICKSTART_PACKAGE_DEPLOY.md)