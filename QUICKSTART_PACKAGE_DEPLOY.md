# ⚡ Quick Start: Package & Deploy Widgets

**Goal**: Package pre-built widgets into a TWX file and import into BAW.

**Time**: ~2 minutes  
**Difficulty**: ⭐ Easy  
**Best For**: Quick testing of pre-built widgets

---

## 📋 Prerequisites

- [ ] **IBM BAW** (v24.x or v25.x) with Process Designer access
- [ ] **Python 3.7+** installed
- [ ] **Widgets** in the `widgets/` directory

---

## 🚀 Step-by-Step Guide

### Step 1: Clone the Repository (if not done)
```bash
git clone <repository-url>
cd BAWCoachMode
```

### Step 2: Review Available Widgets

List all available widgets:
```bash
ls widgets/
```

You'll see 12+ production-ready widgets:

**Navigation & Layout**
- `Breadcrumb` - Navigation breadcrumbs with overflow handling
- `FolderTree` - Hierarchical folder tree with expand/collapse

**Data Display**
- `DateOutput` - Customizable date formatting
- `MarkdownViewer` - Markdown rendering with syntax highlighting
- `Timeline` - Event timeline with vertical layout

**Form Controls**
- `MultiSelect` - Multi-select dropdown with search
- `MultiCheckbox` - Multi-checkbox selection

**Process Visualization**
- `Stepper` - Multi-step process indicator
- `ProgressBar` - Animated progress bar
- `ProcessCircle` - Circular progress indicator

**Content Management**
- `FileNetBrowser` - FileNet document browser
- `FileNetImport` - FileNet document import
- `TasksList` - Task list with status tracking

### Step 3: Configure Your Toolkit (Optional)

Edit `toolkit.config.json` to customize:

```json
{
  "toolkit": {
    "name": "My Custom Widgets",
    "shortName": "MCW",
    "description": "Custom widget toolkit for BAW",
    "version": "1.0.0",
    "bawVersion": "25.0.1"
  },
  "widgets": {
    "include": ["*"],
    "exclude": []
  }
}
```

**Configuration Options:**
- `name` - Display name in BAW Process Designer
- `shortName` - Short identifier (2-4 characters)
- `version` - Toolkit version (increment for updates)
- `bawVersion` - Target BAW version (24.0.1 or 25.0.1)
- `include` - Widget names to include (`["*"]` for all)
- `exclude` - Widget names to skip

### Step 4: Package the Widgets

Run the packaging script:
```bash
python3 package_baw.py
```

**Expected output:**
```
✓ Loading configuration from toolkit.config.json
✓ Scanning widgets directory...
✓ Found 12 widgets:
  - Breadcrumb
  - DateOutput
  - FileNetBrowser
  - FileNetImport
  - FolderTree
  - MarkdownViewer
  - MultiCheckbox
  - MultiSelect
  - ProcessCircle
  - ProgressBar
  - Stepper
  - TasksList
✓ Scanning business objects...
✓ Found 0 business objects
✓ Generating widget XML...
✓ Building TWX package...
✓ Package created: output/My_Custom_Widgets_1.0.0.twx
✓ Package size: 2.3 MB

Success! Your toolkit is ready to import into BAW.
```

### Step 5: Locate Your TWX File

The packaged toolkit is in the `output/` directory:
```bash
ls -lh output/
```

You'll see:
```
My_Custom_Widgets_1.0.0.twx
```

### Step 6: Import into BAW

#### Method 1: Manual Import (Recommended for First Time)

1. Open **IBM BAW Process Designer**
2. Navigate to **Process App Settings** → **Toolkits**
3. Click **Import Toolkit**
4. Click **Browse** and select `output/My_Custom_Widgets_1.0.0.twx`
5. Review the toolkit information
6. Click **Import**
7. Wait for import to complete (usually 10-30 seconds)

**Success indicators:**
- ✅ "Import successful" message appears
- ✅ Toolkit appears in the Toolkits list
- ✅ Toolkit status shows as "Active"

#### Method 2: Automated Deploy via Bob AI with MCP Server

The BAW Admin MCP server enables automated deployment directly from Bob AI to your BAW server.

**Step 1: Configure MCP Server**

Create or edit `.bob/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "baw-admin": {
      "command": "npx",
      "args": [
        "-y",
        "github:MalekJabri/baw-admin-mcp-server-standalone",
        "baw-admin-mcp-server"
      ],
      "env": {
        "BAW_BASE_URL": "https://your-baw-server:9443/bas/ops",
        "BAW_USERNAME": "your-username",
        "BAW_PASSWORD": "your-password",
        "BAW_REJECT_UNAUTHORIZED": "false"
      }
    }
  }
}
```

**Configuration Parameters:**
- `BAW_BASE_URL` - Your BAW server URL with `/bas/ops` endpoint
- `BAW_USERNAME` - BAW administrator username
- `BAW_PASSWORD` - BAW administrator password
- `BAW_REJECT_UNAUTHORIZED` - Set to `"false"` for self-signed certificates (development only)

**Security Note:** For production environments, use environment variables or secure credential management instead of storing passwords in the config file.

**Step 2: Deploy via Bob AI**

1. Open Bob AI and say:
```
Switch to BAW Package Manager mode
```

2. Then request deployment:
```
Deploy the toolkit to the BAW server
```

**Step 3: Monitor Deployment**

Bob will automatically:
1. ✅ Connect to BAW server via MCP
2. ✅ Upload the TWX file
3. ✅ Initiate installation
4. ✅ Monitor installation progress
5. ✅ Report completion status

**Expected Output:**
```
✓ Connecting to BAW server...
✓ Uploading toolkit: My_Custom_Widgets_1.0.0.twx
✓ Installation initiated (Operation ID: abc123)
✓ Monitoring installation progress...
  - Status: Processing
  - Status: Installing widgets
  - Status: Registering components
✓ Installation complete!
✓ Toolkit "My Custom Widgets" v1.0.0 is now active

Deployment successful! The toolkit is ready to use in BAW Process Designer.
```

**Troubleshooting MCP Deployment:**

If deployment fails, Bob will provide detailed error messages:
- **Connection errors**: Check BAW_BASE_URL and network connectivity
- **Authentication errors**: Verify BAW_USERNAME and BAW_PASSWORD
- **Installation errors**: Check BAW logs for detailed error information

**Prerequisites for Method 2:**
- ✅ Node.js and NPX installed
- ✅ MCP server configured in `.bob/mcp.json`
- ✅ BAW server accessible from your machine
- ✅ Valid BAW administrator credentials
- ✅ Bob AI with MCP support enabled

### Step 7: Verify Installation

1. In **BAW Process Designer**, go to **Toolkits**
2. Find your toolkit (e.g., "My Custom Widgets")
3. Verify:
   - ✅ Status is "Active"
   - ✅ Version matches (e.g., 1.0.0)
   - ✅ All widgets are listed

### Step 8: Use Your Widgets

#### Create a Test Coach

1. In Process Designer, create a new **Coach**
2. Name it "Widget Test Coach"
3. Open the **Palette** panel
4. Expand your toolkit section (e.g., "My Custom Widgets")
5. You'll see all your widgets listed

#### Add Widgets to Coach

1. **Drag and drop** a widget onto the coach canvas
2. Configure properties in the **Properties** panel
3. Bind to data if needed
4. Preview the coach

#### Example: Using ProgressBar Widget

1. Drag **ProgressBar** onto the coach
2. Set properties:
   - `value`: 65
   - `max`: 100
   - `label`: "Task Completion"
   - `showPercentage`: true
3. Click **Preview** to see it in action

**🎉 Success!** You now have 12+ custom widgets ready to use in your BAW applications.

---

## 🔄 Updating Your Toolkit

### Step 1: Make Changes

- Add new widgets to `widgets/` directory
- Modify existing widgets
- Update business objects

### Step 2: Update Version

Edit `toolkit.config.json`:
```json
{
  "toolkit": {
    "version": "1.0.1"  // Increment version
  }
}
```

### Step 3: Repackage

```bash
python3 package_baw.py
```

### Step 4: Reimport to BAW

1. In BAW Process Designer, go to **Toolkits**
2. Find your toolkit
3. Click **Update** or **Import** the new version
4. BAW will replace the old version

**Note:** Existing coaches using the widgets will automatically use the updated version.

---

## 📦 Selective Widget Packaging

### Include Specific Widgets Only

Edit `toolkit.config.json`:
```json
{
  "widgets": {
    "include": ["ProgressBar", "Stepper", "MultiSelect"],
    "exclude": []
  }
}
```

### Exclude Specific Widgets

```json
{
  "widgets": {
    "include": ["*"],
    "exclude": ["FileNetBrowser", "FileNetImport"]
  }
}
```

Then repackage:
```bash
python3 package_baw.py
```

---

## 🚀 Advanced Deployment

### Deploy to Multiple Environments

Create environment-specific configurations:

**Development** (`toolkit.config.dev.json`):
```json
{
  "toolkit": {
    "name": "Custom Widgets DEV",
    "version": "1.0.0-dev"
  }
}
```

**Production** (`toolkit.config.prod.json`):
```json
{
  "toolkit": {
    "name": "Custom Widgets",
    "version": "1.0.0"
  }
}
```

Package for specific environment:
```bash
# Development
cp toolkit.config.dev.json toolkit.config.json
python3 package_baw.py

# Production
cp toolkit.config.prod.json toolkit.config.json
python3 package_baw.py
```

### Automated Deployment Script

Create `deploy.sh`:
```bash
#!/bin/bash

# Package widgets
echo "Packaging widgets..."
python3 package_baw.py

# Get the latest TWX file
TWX_FILE=$(ls -t output/*.twx | head -1)

echo "Packaged: $TWX_FILE"
echo "Ready to deploy to BAW"

# Optional: Upload to BAW server
# Use BAW REST API or MCP server for automated deployment
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 Troubleshooting

### Issue: Python command not found
```bash
# Try python instead of python3
python --version

# Or install Python
# macOS: brew install python3
# Windows: Download from python.org
# Linux: sudo apt-get install python3
```

### Issue: Package creation fails
```bash
# Check Python version (need 3.7+)
python3 --version

# Verify you're in the correct directory
pwd  # Should show .../BAWCoachMode

# Check if widgets directory exists
ls widgets/

# Check for errors in widget files
python3 package_baw.py --verbose
```

### Issue: TWX import fails in BAW
**Possible causes:**
1. **Version mismatch** - Check `bawVersion` in config matches your BAW version
2. **Duplicate toolkit ID** - Ensure toolkit ID is unique
3. **Corrupted TWX** - Repackage the toolkit
4. **Insufficient permissions** - Verify you have import rights in BAW

**Solutions:**
```bash
# Repackage with clean build
rm -rf output/*.twx
python3 package_baw.py

# Check TWX file integrity
unzip -t output/*.twx
```

### Issue: Widgets not appearing in palette
1. Verify toolkit import was successful
2. Check toolkit is **Active** in BAW
3. Refresh Process Designer (F5)
4. Clear browser cache
5. Check widget config.json files are valid

### Issue: Widget styling looks wrong
1. Verify Carbon theme is loaded in BAW
2. Check widget CSS for errors
3. Test widget in preview file first
4. Review browser console for CSS errors

---

## 📚 What You've Learned

- ✅ How to package widgets into TWX files
- ✅ Configuring toolkit settings
- ✅ Importing toolkits into BAW
- ✅ Using widgets in coaches
- ✅ Updating and versioning toolkits
- ✅ Selective widget packaging
- ✅ Troubleshooting common issues

---

## 📖 Next Steps

- **[Parse Business Documents](QUICKSTART_PARSE_DOCUMENTS.md)** - Create business objects and processes
- **[Create Custom Widgets](QUICKSTART_CREATE_WIDGET.md)** - Build your own widgets
- **[Complete Documentation](README.md)** - Full toolkit documentation
- **[Package Manager Guide](docs/BAW_PACKAGE_MANAGER_MODE.md)** - Detailed packaging documentation
- **[Hands-On Labs](lab-docs/README.md)** - Step-by-step tutorials

---

## ✅ Quick Reference

### Essential Commands
```bash
# Package all widgets
python3 package_baw.py

# List available widgets
ls widgets/

# Check output
ls -lh output/

# Test widget preview
open widgets/[WidgetName]/AdvancePreview/[WidgetName].html
```

### Configuration Files
- **Main Config**: `toolkit.config.json`
- **Widget Config**: `widgets/[WidgetName]/widget/config.json`
- **Output Location**: `output/`

### Version Management
```json
{
  "toolkit": {
    "version": "1.0.0"  // Major.Minor.Patch
  }
}
```

**Version Guidelines:**
- **Major** (1.x.x) - Breaking changes
- **Minor** (x.1.x) - New features, backward compatible
- **Patch** (x.x.1) - Bug fixes

### Bob AI Commands
```
# Switch to Package Manager mode
"Switch to BAW Package Manager mode"

# Package toolkit
"Package and deploy the toolkit"

# Deploy to server
"Deploy the toolkit to the BAW server"
```

---

**Ready to build more?** [Create Custom Widgets →](QUICKSTART_CREATE_WIDGET.md)