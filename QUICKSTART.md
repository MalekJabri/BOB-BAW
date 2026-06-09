# ⚡ Quick Start Guide

Get started with the IBM BAW Development Toolkit in minutes! Choose your path based on your goal.

---

## 🎯 Choose Your Quick Start Path

We've created focused quick start guides for each workflow:

### 📄 [Parse Business Documents](QUICKSTART_PARSE_DOCUMENTS.md)
**Extract business objects with OpenAPI specs and BPMN processes from documents**

- ⏱️ Time: ~10 minutes
- 🎯 Best for: Starting from business requirements
- 📊 Generates: Business objects, OpenAPI specs, BPMN processes
- 🔧 Difficulty: ⭐⭐⭐ Advanced

**[→ Start Parse Documents Guide](QUICKSTART_PARSE_DOCUMENTS.md)**

---

### 🤖 [Create a Custom Widget](QUICKSTART_CREATE_WIDGET.md)
**Build custom widgets with AI assistance and deploy to BAW**

- ⏱️ Time: ~5 minutes
- 🎯 Best for: Learning widget development
- 📊 Generates: Complete widget with preview files
- 🔧 Difficulty: ⭐⭐ Medium

**[→ Start Create Widget Guide](QUICKSTART_CREATE_WIDGET.md)**

---

### 🎯 [Package & Deploy Widgets](QUICKSTART_PACKAGE_DEPLOY.md)
**Package 12+ pre-built widgets and import into BAW immediately**

- ⏱️ Time: ~2 minutes
- 🎯 Best for: Quick testing of pre-built widgets
- 📊 Generates: TWX toolkit file
- 🔧 Difficulty: ⭐ Easy

**[→ Start Package & Deploy Guide](QUICKSTART_PACKAGE_DEPLOY.md)**

---

## 📚 What's in Each Guide?

### Parse Documents Guide Includes:
- Setting up business document parsing
- Generating business objects with OpenAPI specifications
- Creating BPMN process configurations
- Importing business objects into BAW via OpenAPI
- Importing BPMN processes
- Creating custom widgets based on business objects
- Complete end-to-end workflow

### Create Widget Guide Includes:
- Using Bob AI to create custom widgets
- Understanding widget file structure
- Testing widgets locally
- Creating business objects for widgets
- Packaging and deploying widgets
- Widget development best practices
- Common widget patterns and ideas

### Package & Deploy Guide Includes:
- Packaging existing widgets into TWX files
- Configuring toolkit settings
- Importing toolkits into BAW
- Using widgets in coaches
- Updating and versioning toolkits
- Selective widget packaging
- Troubleshooting deployment issues

---

## 🚀 Recommended Learning Path

For the best learning experience, follow this sequence:

1. **[Package & Deploy](QUICKSTART_PACKAGE_DEPLOY.md)** (2 min)
   - Get familiar with the toolkit
   - See widgets in action
   - Understand the deployment process

2. **[Create Widget](QUICKSTART_CREATE_WIDGET.md)** (5 min)
   - Learn widget development with AI
   - Understand widget structure
   - Practice packaging and deployment

3. **[Parse Documents](QUICKSTART_PARSE_DOCUMENTS.md)** (10 min)
   - Master the complete workflow
   - Generate business objects and processes
   - Build end-to-end solutions

---

## 📋 General Prerequisites

Before starting any quick start guide, ensure you have:

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **IBM BAW** (v24.x or v25.x) with Process Designer access
- [ ] **Python 3.7+** installed (`python3 --version`)
- [ ] **Node.js & NPX** installed (for deployment features)
- [ ] **Bob AI** configured with BAW custom modes (optional but recommended)
- [ ] **Git** (optional, for version control)

---

## 🔗 Additional Resources

**Goal**: Extract business objects with OpenAPI specifications and BPMN processes from business documents, then build widgets and deploy.

### Prerequisites
- Business documents (PDF, Word, etc.)
- Bob AI with Blueprint Parser mode

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd BAWCoachMode
```

### Step 2: Prepare Your Documents

Create a directory for your documents:
```bash
mkdir -p business-blueprints
```

Place your business documents there:
```
business-blueprints/
├── LifeInsurance_Requirements.pdf
├── Claims_Process.docx
└── Policy_DataModel.xlsx
```

### Step 3: Start Bob in Blueprint Parser Mode

Open Bob AI and say:
```
Switch to BAW Blueprint Parser mode
```

### Step 4: Parse a Document

Request parsing:
```
Parse LifeInsurance_Requirements.pdf and generate:
1. Business objects for all entities
2. BPMN process configurations
3. Discovery report
```

### Step 5: Review Generated Artifacts

Bob creates structured artifacts:

**Business Objects** (`business-objects/generated/life-insurance/`):
```json
{
  "name": "Policy",
  "fields": [
    {"name": "policyNumber", "type": "String"},
    {"name": "premium", "type": "Decimal"},
    {"name": "startDate", "type": "Date"}
  ]
}
```

**OpenAPI Specification** (`business-objects/generated/life-insurance/openapi.yaml`):
- Complete OpenAPI 3.0 specification for all business objects
- Ready to import into BAW for service integration
- Includes schemas, endpoints, and data models

**BPMN Configs** (`business-processes/configs/life-insurance/`):
```json
{
  "process": {
    "id": "proc-policy-approval",
    "name": "Policy Approval Process"
  },
  "elements": [...],
  "flows": [...]
}
```

**Reports** (`business-objects/reports/`):
- Discovery report with assumptions
- Entity relationship diagrams
- Process catalogs

### Step 5a: Import Business Objects into BAW

Use the generated OpenAPI specification to import business objects:

1. Open **BAW Process Designer**
2. Go to **Data** → **Business Objects**
3. Click **Import from OpenAPI**
4. Select `business-objects/generated/life-insurance/openapi.yaml`
5. Review and confirm the import
6. Business objects are now available in your BAW environment

**Alternative**: Use the Package Manager mode to include business objects in your toolkit TWX file.

### Step 6: Import BPMN Processes (Optional)

Import the generated BPMN processes into BAW:

1. Locate BPMN files in `business-processes/bpmn/life-insurance/`
2. Open **BAW Process Designer**
3. Go to **Processes** → **Import**
4. Select the BPMN XML file
5. Review and customize the imported process

### Step 7: Create Custom Widgets (Optional)

Based on your requirements, create widgets:
```
Switch to BAW Coach Widget mode
```

Then:
```
Create a PolicyCard widget to display policy information with:
- Policy number and status
- Premium amount
- Start and end dates
- Action buttons
```

### Step 8: Package Everything

When ready:
```
Switch to BAW Package Manager mode
```

Then:
```
Package the business objects and widgets from the life-insurance context
```

### Step 9: Import Toolkit into BAW

1. Open **BAW Process Designer**
2. Go to **Process App Settings** → **Toolkits**
3. Click **Import Toolkit**
4. Select the generated TWX file from `output/`
5. Click **Import**

**🎉 Success!** You've transformed business documents into a complete BAW solution with business objects, processes, and custom widgets.

---

## Path 2: Create a Custom Widget with Bob AI

**Goal**: Use Bob AI to create a new custom widget from scratch.

### Prerequisites
- Bob AI installed and configured
- BAW custom modes loaded (`.bob/custom_modes.yaml`)

### Step 1: Start Bob in Widget Mode

Open Bob AI and say:
```
Switch to BAW Coach Widget mode
```

Bob will confirm the mode switch.

### Step 2: Request Your Widget

Be specific about what you want:
```
Create a StatusBadge widget that displays status indicators with the following features:
- Support for success, warning, error, and info states
- Color-coded badges using Carbon Design System colors
- Optional icon support
- Configurable size (small, medium, large)
```

### Step 3: Review Generated Files

Bob will create:
```
widgets/StatusBadge/
├── README.md                    # Widget documentation
├── StatusBadge.svg             # Widget icon
├── widget/
│   ├── config.json             # Widget configuration
│   ├── Layout.html             # HTML structure
│   ├── InlineCSS.css          # Styling
│   ├── inlineJavascript.js    # Widget logic
│   ├── datamodel.md           # Data model docs
│   └── eventHandler.md        # Event docs
└── AdvancePreview/
    ├── StatusBadge.html       # Preview file
    └── StatusBadgeSnippet.js  # Preview logic
```

### Step 4: Test Locally (Optional)

Open `widgets/StatusBadge/AdvancePreview/StatusBadge.html` in a browser to test.

### Step 5: Package and Deploy

Ask Bob:
```
Switch to BAW Package Manager mode
```

Then:
```
Package and deploy the toolkit
```

Bob will:
1. Detect the new widget
2. Package it into a TWX file
3. Offer to deploy to your BAW server (if MCP configured)

### Step 6: Import into BAW

Follow the same import steps as Path 1, Step 5.

**🎉 Success!** You've created and deployed a custom widget with AI assistance.

---

## Path 3: Package & Deploy Existing Widgets

**Goal**: Package the 12+ pre-built widgets and import them into BAW.

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd BAWCoachMode
```

### Step 2: Review Available Widgets
```bash
ls widgets/
```

You'll see widgets like:
- `ProgressBar` - Animated progress indicators
- `MultiSelect` - Multi-select dropdowns
- `Stepper` - Multi-step process indicators
- `Timeline` - Event timelines
- And 8+ more!

### Step 3: Configure Your Toolkit (Optional)

Edit `toolkit.config.json` to customize:
```json
{
  "toolkit": {
    "name": "My Custom Widgets",
    "version": "1.0.0"
  }
}
```

### Step 4: Package the Widgets
```bash
python3 package_baw.py
```

**Expected output:**
```
✓ Scanning widgets directory...
✓ Found 12 widgets
✓ Generating TWX package...
✓ Package created: output/Custom_Widgets_1.0.0.twx
```

### Step 5: Import into BAW

1. Open **BAW Process Designer**
2. Go to **Process App Settings** → **Toolkits**
3. Click **Import Toolkit**
4. Select `output/Custom_Widgets_1.0.0.twx`
5. Click **Import**

### Step 6: Use Your Widgets

1. Create a new **Coach** in Process Designer
2. Open the **Palette**
3. Find your widgets under **Custom Widgets2** (or your toolkit name)
4. Drag and drop widgets onto your coach!

**🎉 Success!** You now have 12+ custom widgets ready to use.

---

## 🔧 Common Tasks

- **[Main README](README.md)** - Complete toolkit documentation
- **[Bob Modes Guide](lab-docs/BOB_BAW_MODES_GUIDE.md)** - Detailed mode documentation
- **[Hands-On Labs](lab-docs/README.md)** - Step-by-step tutorials

### Mode-Specific Documentation
- **[Blueprint Parser Mode](docs/BAW_BLUEPRINT_PARSER_MODE.md)** - Document parsing details
- **[Coach Widget Mode](docs/BAW_COACHUI_VIEW_MODE.md)** - Widget development guide
- **[Coach Composer Mode](docs/BAW_COACH_COMPOSER_MODE.md)** - Coach creation guide
- **[Package Manager Mode](docs/BAW_PACKAGE_MANAGER_MODE.md)** - Packaging details

### Technical Resources
- **[Carbon Theme Integration](docs/CARBON_THEME_INTEGRATION.md)** - Styling guidelines
- **[API Reference](docs/API_REFERENCE.md)** - Technical API documentation
- **[IBM BAW Documentation](https://www.ibm.com/docs/en/baw)** - Official BAW docs

---

**Ready to dive deeper?** Return to the [main README](README.md) for comprehensive documentation.