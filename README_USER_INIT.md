# User Toolkit Initialization Guide

## Overview

This guide explains how to initialize your personal toolkit configuration for the BAW multi-user lab environment. Each user must run the initialization script to avoid conflicts when deploying to the same BAW environment.

## Why This Is Needed

When multiple users deploy toolkits to the same BAW environment, conflicts occur if they share:
- **Toolkit IDs** - Each toolkit needs a unique identifier
- **Business Object Class IDs** - Each custom type needs unique class IDs
- **Toolkit Names** - Each toolkit needs a distinguishable name

The `init_user_toolkit.py` script automatically generates unique values for your toolkit.

## Prerequisites

- Python 3.6 or higher
- Access to the project directory
- Your assigned user ID (1-99)

## Quick Start

### Step 1: Run the Initialization Script

From the project root directory, run:

```bash
python init_user_toolkit.py
```

### Step 2: Provide Your Information

The script will prompt you for:

```
Enter your username (e.g., Alice, Bob): Alice
Enter your user ID (1-99): 1
```

**Important:** 
- Choose a unique username (your name or identifier)
- Use a unique user ID number (coordinate with other lab users)

### Step 3: Review and Confirm

The script will show a summary:

```
📋 Configuration Summary:
   Username: Alice
   User ID: 1
   Toolkit GUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

Proceed with initialization? (yes/no):
```

Type `yes` to proceed.

### Step 4: Verify Success

You should see output like:

```
✅ Toolkit initialization completed successfully!

Your toolkit is now configured for: Alice (ID: 1)

Next steps:
1. Package your toolkit: python toolkit_packager/package_toolkit.py
2. Deploy to BAW environment
3. Start building your custom widgets!
```

## What Gets Changed

The script modifies two files:

### 1. `toolkit.config.json`

**Before:**
```json
{
  "toolkit": {
    "name": "Custom Widgets",
    "shortName": "CW",
    "id": "2066.cebc1c06-68a5-4d2e-986a-aaae3072cefb"
  }
}
```

**After (for user "Alice" with ID 1):**
```json
{
  "toolkit": {
    "name": "Custom Widgets - Alice",
    "shortName": "CW_1",
    "id": "2066.a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

### 2. `toolkit_packager/baw_custom_types.json`

All business object `classId` values are regenerated with new unique GUIDs:

**Before:**
```json
"StepItem": {
  "classId": "/12.cc351e20-a6a4-45e2-bab8-698faaf34d85"
}
```

**After:**
```json
"StepItem": {
  "classId": "/12.new-unique-guid-here",
  "user": "Alice"
}
```

## Backups

The script automatically creates timestamped backups:
- `toolkit.config.json.backup_YYYYMMDD_HHMMSS`
- `toolkit_packager/baw_custom_types.json.backup_YYYYMMDD_HHMMSS`

You can restore from these backups if needed.

## After Initialization

### Package Your Toolkit

```bash
python toolkit_packager/package_toolkit.py
```

This creates: `output/Custom_Widgets_Alice_1.0.0.twx`

### Deploy to BAW

1. Log into BAW Process Center
2. Navigate to Process Apps → Toolkits
3. Import your `.twx` file
4. Your toolkit will appear as "Custom Widgets - Alice"

## Multi-User Lab Coordination

### User ID Assignment

Coordinate with other lab users to avoid ID conflicts:

| User | Username | User ID | Toolkit ShortName |
|------|----------|---------|-------------------|
| User 1 | Alice | 1 | CW_1 |
| User 2 | Bob | 2 | CW_2 |
| User 3 | Charlie | 3 | CW_3 |
| ... | ... | ... | ... |

### Git Workflow

**⚠️ IMPORTANT:** Do NOT commit your personalized configuration files!

Add to `.gitignore`:
```
# User-specific toolkit configurations
toolkit.config.json
toolkit_packager/baw_custom_types.json
*.backup_*
```

Each user should:
1. Clone the repository
2. Run `init_user_toolkit.py`
3. Work with their personalized configs locally
4. Only commit widget code changes, not config files

## Troubleshooting

### Error: Files not found

```
❌ Error: toolkit.config.json not found!
```

**Solution:** Run the script from the project root directory:
```bash
cd /path/to/BAWCoachMode
python init_user_toolkit.py
```

### Error: Invalid JSON

```
❌ Error: Invalid JSON in toolkit.config.json
```

**Solution:** Restore from backup or re-clone the repository:
```bash
cp toolkit.config.json.backup_YYYYMMDD_HHMMSS toolkit.config.json
```

### Conflict: User ID already in use

If you accidentally use the same user ID as another lab user:
1. Run `init_user_toolkit.py` again
2. Choose a different user ID
3. Re-package and re-deploy

## Re-initialization

To re-initialize (e.g., to change your username or ID):

1. Run the script again:
   ```bash
   python init_user_toolkit.py
   ```

2. Provide new values when prompted

3. The script will create new backups and update the files

## Advanced: Manual Configuration

If you prefer to manually edit the files:

1. **Generate a new GUID:**
   ```bash
   python -c "import uuid; print(uuid.uuid4())"
   ```

2. **Update `toolkit.config.json`:**
   - Change `toolkit.name`
   - Change `toolkit.shortName`
   - Change `toolkit.id` to `2066.{your-new-guid}`

3. **Update `toolkit_packager/baw_custom_types.json`:**
   - Generate new GUIDs for each `classId`
   - Format: `/12.{your-new-guid}`

## Support

For issues or questions:
1. Check this README
2. Review the script output for error messages
3. Restore from backups if needed
4. Contact your lab instructor

## Summary

✅ **DO:**
- Run `init_user_toolkit.py` before your first deployment
- Use a unique user ID
- Keep your configs local (don't commit)
- Coordinate with other lab users

❌ **DON'T:**
- Skip initialization (will cause conflicts)
- Use the same user ID as another user
- Commit personalized config files to git
- Manually edit GUIDs (use the script)

---

**Ready to start?** Run `python init_user_toolkit.py` now!