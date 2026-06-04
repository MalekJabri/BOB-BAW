# ProcessActivityTimeline Widget - Data Model

## Overview

The ProcessActivityTimeline widget displays a vertical timeline of BAW process activities with comprehensive tracking information. It expects an array of `ProcessActivityEvent` objects bound to the widget's data property.

## Data Binding

The widget uses a list binding with the following configuration:

```json
{
  "bindingType": {
    "name": "ProcessActivityData",
    "isList": true,
    "type": "ProcessActivityEvent"
  }
}
```

## ProcessActivityEvent Business Object

Each process activity is represented by a `ProcessActivityEvent` business object with the following properties:

### Required Properties

#### name (String)
- **Description**: The name of the process activity
- **Example**: `"Review Task"`, `"Data Validation"`, `"Manager Approval"`
- **Usage**: This is the primary identifier for the activity and should be descriptive
- **Alternative**: Can also use `activityName` property

### Optional Properties

#### activityName (String)
- **Description**: Alternative property for activity name (alias for `name`)
- **Example**: `"Document Review"`
- **Usage**: Provides flexibility for different BAW naming conventions
- **Note**: If both `name` and `activityName` are provided, `name` takes precedence

#### description (String)
- **Description**: Detailed description of the activity
- **Example**: `"Manager reviewing and approving the submitted request"`
- **Usage**: Provides additional context about what the activity does
- **Display**: Shown below the activity name in a lighter font

#### startTime (Date)
- **Description**: Start time of the activity as a Date object
- **Example**: `new Date("2026-05-29T08:00:00")`
- **Usage**: Indicates when the activity started or is scheduled to start
- **Display**: Automatically formatted using `toLocaleString()` when `showTimestamps` is enabled
- **Alternative**: Can also use `timestamp` property

#### timestamp (Date)
- **Description**: Alternative timestamp property (alias for `startTime`)
- **Example**: `new Date("2026-05-29T08:35:00")`
- **Usage**: Provides flexibility for different BAW timestamp conventions
- **Note**: If both `startTime` and `timestamp` are provided, `startTime` takes precedence

#### endTime (Date)
- **Description**: End time of the activity as a Date object
- **Example**: `new Date("2026-05-29T08:35:00")`
- **Usage**: Indicates when the activity completed
- **Note**: Currently stored but not displayed; reserved for future enhancements

#### status (String)
- **Description**: Current status of the process activity
- **Allowed Values**:
  - `"completed"` - Activity has been completed (green checkmark icon)
  - `"active"` - Activity is currently running (pulsing blue indicator)
  - `"pending"` - Activity is upcoming or not started (gray indicator)
  - `"failed"` - Activity has failed (red X icon)
  - `"skipped"` - Activity was skipped (gray forward arrow icon)
  - `"waiting"` - Activity is waiting for input or approval (yellow clock icon)
- **Default**: `"pending"` if not specified
- **Usage**: Determines the visual appearance, icon, and status badge of the activity

#### assignee (String)
- **Description**: User or system assigned to the activity
- **Example**: `"John Doe"`, `"System"`, `"Finance Team"`
- **Usage**: Identifies who is responsible for the activity
- **Display**: Shown in the activity details section when `showDetails` is enabled

#### duration (Integer)
- **Description**: Duration of the activity in milliseconds
- **Example**: `1800000` (30 minutes), `5000` (5 seconds)
- **Usage**: Tracks how long the activity took to complete
- **Display**: Automatically formatted (e.g., "30m 0s", "5s") when `showDetails` is enabled
- **Note**: Typically only meaningful for completed activities

#### taskId (String)
- **Description**: BAW task identifier
- **Example**: `"TASK-001"`, `"TSK-12345"`
- **Usage**: Links the activity to a specific BAW task for traceability
- **Display**: Shown in the activity details section when `showDetails` is enabled

#### instanceId (String)
- **Description**: BAW process instance identifier
- **Example**: `"INST-12345"`, `"PI-67890"`
- **Usage**: Links the activity to a specific BAW process instance
- **Display**: Shown in the activity details section when `showDetails` is enabled

#### activityId (String)
- **Description**: BAW activity identifier
- **Example**: `"ACT-456"`, `"ACTV-789"`
- **Usage**: Unique identifier for the activity within BAW
- **Note**: Currently stored but not displayed; reserved for future enhancements

## Data Access Pattern

The widget accesses the process activity data using BAW's list binding pattern:

```javascript
// CORRECT: Access array through .items property
var activityData = this.getData().items;

// WRONG: Direct access doesn't work with list bindings
var activityData = this.getData(); // Returns object, not array
```

This is because BAW automatically wraps list data in an object with an `items` property when `isList: true` is set in the binding configuration.

## Example Data Structures

### Minimal Process Timeline

```javascript
[
  {
    "name": "Activity 1"
  },
  {
    "name": "Activity 2"
  },
  {
    "name": "Activity 3"
  }
]
```

### Complete Process Timeline

```javascript
[
  {
    "name": "Initiate Request",
    "description": "User submitted new request",
    "startTime": new Date("2026-05-29T08:00:00"),
    "endTime": new Date("2026-05-29T08:00:05"),
    "status": "completed",
    "assignee": "Jane Smith",
    "duration": 5000,
    "taskId": "TASK-001",
    "instanceId": "INST-12345",
    "activityId": "ACT-001"
  },
  {
    "name": "Manager Review",
    "description": "Manager reviewing and approving request",
    "startTime": new Date("2026-05-29T08:05:00"),
    "endTime": new Date("2026-05-29T08:35:00"),
    "status": "completed",
    "assignee": "Bob Manager",
    "duration": 1800000,
    "taskId": "TASK-002",
    "instanceId": "INST-12345",
    "activityId": "ACT-002"
  },
  {
    "name": "System Processing",
    "description": "Automated data processing and validation",
    "startTime": new Date("2026-05-29T08:35:00"),
    "status": "active",
    "assignee": "System",
    "instanceId": "INST-12345",
    "activityId": "ACT-003"
  },
  {
    "name": "Finance Approval",
    "description": "Awaiting finance department approval",
    "status": "pending",
    "assignee": "Finance Team",
    "instanceId": "INST-12345",
    "activityId": "ACT-004"
  }
]
```

### Process Timeline with Various States

```javascript
[
  {
    "name": "Data Entry",
    "description": "User entered required information",
    "startTime": new Date("2026-05-29T08:00:00"),
    "status": "completed",
    "assignee": "User A",
    "duration": 300000
  },
  {
    "name": "Validation Check",
    "description": "System validated submitted data",
    "startTime": new Date("2026-05-29T08:05:00"),
    "status": "completed",
    "assignee": "System",
    "duration": 5000
  },
  {
    "name": "Manual Review",
    "description": "Reviewer checking data quality",
    "startTime": new Date("2026-05-29T08:10:00"),
    "status": "active",
    "assignee": "Reviewer B"
  },
  {
    "name": "Quality Check",
    "description": "Quality standards verification",
    "status": "failed",
    "assignee": "QA Team",
    "taskId": "TASK-QA-001"
  },
  {
    "name": "Optional Step",
    "description": "Conditional processing step",
    "status": "skipped",
    "assignee": "System"
  },
  {
    "name": "Final Approval",
    "description": "Director approval required",
    "status": "waiting",
    "assignee": "Director"
  }
]
```

## Default Data

If no data is bound to the widget, it displays a default process timeline with sample activities:

```javascript
[
  {
    "name": "Process Started",
    "description": "Process instance initiated",
    "startTime": "2026-05-29T08:00:00",
    "status": "completed",
    "assignee": "System",
    "duration": 5000
  },
  {
    "name": "Review Task",
    "description": "Document review and approval",
    "startTime": "2026-05-29T08:05:00",
    "status": "completed",
    "assignee": "John Doe",
    "duration": 1800000,
    "taskId": "TASK-001"
  },
  {
    "name": "Data Validation",
    "description": "Validating submitted data",
    "startTime": "2026-05-29T08:35:00",
    "status": "active",
    "assignee": "System"
  },
  {
    "name": "Manager Approval",
    "description": "Awaiting manager approval",
    "status": "pending",
    "assignee": "Jane Smith"
  },
  {
    "name": "Final Processing",
    "description": "Final processing and completion",
    "status": "pending",
    "assignee": "System"
  }
]
```

## Data Validation

The widget handles missing or invalid data gracefully:

- **Missing name**: Displays `"Activity N"` where N is the activity index + 1
- **Missing status**: Defaults to `"pending"`
- **Missing startTime/timestamp**: Timestamp section is not displayed
- **Missing assignee**: Assignee detail is not displayed
- **Missing duration**: Duration detail is not displayed
- **Empty array**: Displays default sample timeline
- **Null/undefined data**: Displays default sample timeline

## Duration Formatting

The widget automatically formats duration values for display:

| Duration Range | Format Example |
|---------------|----------------|
| < 1 minute | "45s" |
| < 1 hour | "5m 30s" |
| < 1 day | "2h 15m" |
| ≥ 1 day | "3d 4h" |

## Best Practices

1. **Always provide activity names**: Names are the primary identifier for activities
2. **Use consistent status values**: Use the predefined status values for consistent visual representation
3. **Include timestamps for tracking**: Provide start times for better process visibility
4. **Track assignees**: Always specify who is responsible for each activity
5. **Record durations**: Include duration for completed activities to track performance
6. **Use process IDs**: Include task and instance IDs for traceability and debugging
7. **Chronological order**: Provide activities in the order they occur in the process
8. **Status progression**: Use status values that accurately reflect the current state

## Related Documentation

- See [`README.md`](../README.md) for widget features and configuration options
- See [`eventHandler.md`](eventHandler.md) for event handling details
- See [`ProcessActivityEvent.json`](ProcessActivityEvent.json) for the business object definition

---

Made with Bob