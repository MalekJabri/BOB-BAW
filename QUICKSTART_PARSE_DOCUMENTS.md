# ⚡ Quick Start: Parse Business Documents

**Goal**: Extract business objects with OpenAPI specifications and BPMN processes from business documents.

**Time**: ~10 minutes  
**Difficulty**: ⭐⭐⭐ Advanced  
**Best For**: Starting from business requirements and building a complete BAW solution

---

## 📋 Prerequisites

- [ ] **IBM BAW** (v24.x or v25.x) with Process Designer access
- [ ] **Python 3.7+** installed
- [ ] **Bob AI** configured with Blueprint Parser mode
- [ ] **Business documents** (PDF, Word, Excel, etc.)

---

## 🚀 Step-by-Step Guide

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

Bob will confirm the mode switch and be ready to parse documents.

### Step 4: Parse Your Document

Request comprehensive parsing:
```
Parse LifeInsurance_Requirements.pdf and generate:
1. Business objects for all entities with OpenAPI specification
2. BPMN process configurations
3. Discovery report with entity relationships
```

Bob will analyze the document and extract:
- Business entities and their fields
- Relationships between entities
- Business processes and workflows
- Data validation rules

### Step 5: Review Generated Artifacts

Bob creates a complete set of structured artifacts:

#### 📦 Business Objects
Location: `business-objects/generated/life-insurance/`

Example `Policy.json`:
```json
{
  "name": "Policy",
  "namespace": "com.insurance.policy",
  "fields": [
    {
      "name": "policyNumber",
      "type": "String",
      "required": true,
      "description": "Unique policy identifier"
    },
    {
      "name": "premium",
      "type": "Decimal",
      "required": true,
      "description": "Monthly premium amount"
    },
    {
      "name": "startDate",
      "type": "Date",
      "required": true
    },
    {
      "name": "endDate",
      "type": "Date"
    },
    {
      "name": "status",
      "type": "String",
      "enum": ["Active", "Pending", "Cancelled", "Expired"]
    }
  ]
}
```

#### 🔌 OpenAPI Specification
Location: `business-objects/generated/life-insurance/openapi.yaml`

Complete OpenAPI 3.0 specification including:
- All business object schemas
- RESTful endpoint definitions
- Request/response models
- Data validation rules
- Ready for BAW service integration

Example snippet:
```yaml
openapi: 3.0.0
info:
  title: Life Insurance Business Objects API
  version: 1.0.0
components:
  schemas:
    Policy:
      type: object
      required:
        - policyNumber
        - premium
        - startDate
      properties:
        policyNumber:
          type: string
          description: Unique policy identifier
        premium:
          type: number
          format: decimal
        startDate:
          type: string
          format: date
```

#### 🔄 BPMN Process Configurations
Location: `business-processes/configs/life-insurance/`

Example `policy-approval.json`:
```json
{
  "process": {
    "id": "proc-policy-approval",
    "name": "Policy Approval Process",
    "version": "1.0"
  },
  "roles": [
    {"id": "role-underwriter", "name": "Underwriter"},
    {"id": "role-manager", "name": "Manager"}
  ],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Application Received"},
    {"id": "task-001", "type": "userTask", "name": "Review Application", "assignee": "role-underwriter"},
    {"id": "gateway-001", "type": "exclusiveGateway", "name": "Approved?"},
    {"id": "task-002", "type": "userTask", "name": "Manager Review", "assignee": "role-manager"},
    {"id": "end-001", "type": "endEvent", "name": "Policy Issued"}
  ],
  "flows": [...]
}
```

#### 📊 Discovery Reports
Location: `business-objects/reports/`

- **Discovery Report**: Assumptions, entity relationships, data model
- **Entity Catalog**: Complete list of business objects
- **Process Catalog**: List of discovered processes
- **Mermaid Diagrams**: Visual process flows

### Step 6: Import Business Objects into BAW

#### Option A: Import via OpenAPI (Recommended)

1. Open **BAW Process Designer**
2. Navigate to **Data** → **Business Objects**
3. Click **Import from OpenAPI**
4. Select `business-objects/generated/life-insurance/openapi.yaml`
5. Review the imported objects
6. Click **Import** to add them to your BAW environment

**Benefits:**
- Direct import into BAW
- Preserves all data types and validations
- Creates service endpoints automatically
- Maintains relationships between objects

#### Option B: Package with Toolkit

Use Package Manager mode to include business objects in a TWX file:
```
Switch to BAW Package Manager mode
```

Then:
```
Package the business objects from the life-insurance context
```

### Step 7: Import BPMN Processes

The Blueprint Parser automatically generates BPMN XML files.

Location: `business-processes/bpmn/life-insurance/`

To import:
1. Open **BAW Process Designer**
2. Go to **Processes** → **Import Process**
3. Select the BPMN XML file (e.g., `policy-approval.bpmn`)
4. Review the imported process
5. Customize as needed (add coaches, services, etc.)

### Step 8: Create Custom Widgets (Optional)

Based on your business objects, create custom widgets:

```
Switch to BAW Coach Widget mode
```

Then:
```
Create a PolicyCard widget to display policy information with:
- Policy number and status badge
- Premium amount with currency formatting
- Start and end dates
- Action buttons for renewal and cancellation
- Use the Policy business object as the data model
```

Bob will create a complete widget that works with your business objects.

### Step 9: Create Coaches (Optional)

Use Coach Composer mode to create complete forms:

```
Switch to BAW Coach Composer mode
```

Then:
```
Create a Policy Application coach using:
- Policy business object
- Standard BAW input widgets for data entry
- PolicyCard widget for preview
- Validation based on business rules
```

### Step 10: Package Everything

When ready to deploy:

```
Switch to BAW Package Manager mode
```

Then:
```
Package the complete life-insurance solution including:
- Business objects
- Custom widgets
- Coaches
```

Bob will create a TWX file in `output/` directory.

### Step 11: Deploy to BAW

1. Open **BAW Process Designer**
2. Go to **Process App Settings** → **Toolkits**
3. Click **Import Toolkit**
4. Select the generated TWX file from `output/`
5. Click **Import**

**🎉 Success!** You've transformed business documents into a complete BAW solution with:
- ✅ Business objects with OpenAPI specs
- ✅ BPMN processes
- ✅ Custom widgets
- ✅ Complete coaches
- ✅ Ready-to-use toolkit

---

## 🔄 Iterative Refinement

### Refine Business Objects

Ask Bob to enhance the generated objects:
```
Review the Policy business object and add:
- Validation rules for premium ranges
- Calculated fields for total coverage
- Relationships to Customer and Beneficiary objects
```

### Enhance BPMN Processes

Request process improvements:
```
Update the Policy Approval process to include:
- Parallel approval paths for high-value policies
- Automated risk assessment task
- Email notifications at key milestones
```

### Generate Mermaid Diagrams

Visualize your processes:
```
Generate a Mermaid diagram for the Policy Approval process
```

---

## 📚 What You've Learned

- ✅ How to parse business documents with Blueprint Parser mode
- ✅ Understanding generated business objects and OpenAPI specs
- ✅ Importing business objects into BAW via OpenAPI
- ✅ Working with BPMN process configurations
- ✅ Creating custom widgets based on business objects
- ✅ Building complete BAW solutions from requirements

---

## 🐛 Troubleshooting

### Issue: Bob doesn't extract all entities
**Solution**: Be more specific in your request:
```
Parse the document and extract:
- All customer-related entities (Customer, Address, Contact)
- All policy-related entities (Policy, Coverage, Premium)
- All claim-related entities (Claim, ClaimItem, Payment)
```

### Issue: OpenAPI import fails in BAW
**Solution**: 
1. Verify the OpenAPI file is valid (use online validators)
2. Check BAW version compatibility (24.x or 25.x)
3. Ensure no duplicate object names
4. Review BAW logs for specific errors

### Issue: BPMN process is too complex
**Solution**: Ask Bob to simplify:
```
Simplify the Policy Approval process to include only:
- Start event
- Review task
- Approval gateway
- End event
```

---

## 📖 Next Steps

- **[Create Custom Widgets](QUICKSTART_CREATE_WIDGET.md)** - Build widgets for your business objects
- **[Package & Deploy](QUICKSTART_PACKAGE_DEPLOY.md)** - Package your complete solution
- **[Complete Documentation](README.md)** - Full toolkit documentation
- **[Blueprint Parser Mode Guide](docs/BAW_BLUEPRINT_PARSER_MODE.md)** - Detailed mode documentation

---

## ✅ Quick Reference

### Essential Bob Commands
```
# Switch to Blueprint Parser mode
"Switch to BAW Blueprint Parser mode"

# Parse document
"Parse [document-name] and generate business objects and BPMN processes"

# Refine objects
"Review the [ObjectName] business object and add [requirements]"

# Generate diagrams
"Generate a Mermaid diagram for the [ProcessName] process"
```

### File Locations
- **Business Objects**: `business-objects/generated/[context]/`
- **OpenAPI Specs**: `business-objects/generated/[context]/openapi.yaml`
- **BPMN Configs**: `business-processes/configs/[context]/`
- **BPMN XML**: `business-processes/bpmn/[context]/`
- **Reports**: `business-objects/reports/`
- **Diagrams**: `business-processes/diagrams/[context]/`

---

**Ready for the next step?** [Create Custom Widgets →](QUICKSTART_CREATE_WIDGET.md)