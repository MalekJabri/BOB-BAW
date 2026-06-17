# ProcessActivityTimeline Widget - Data Model

## Overview

The ProcessActivityTimeline widget displays a vertical timeline of BAW process activities with status tracking, comments, and avatar-aware assignee rendering. It expects an array of `ProcessActivityEvent` objects bound to the widget data property.

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

Each process activity is represented by a `ProcessActivityEvent` business object with the following properties.

### Required Properties

#### name (String)
- **Description**: The name of the process activity
- **Example**: `"Review Task"`, `"Data Validation"`, `"Manager Approval"`
- **Usage**: Primary identifier for the activity
- **Alternative**: Can also use `activityName`

### Optional Properties

#### activityName (String)
- **Description**: Alternative property for activity name
- **Example**: `"Document Review"`
- **Usage**: Used when `name` is not provided

#### description (String)
- **Description**: Detailed description of the activity
- **Example**: `"Manager reviewing and approving the submitted request"`
- **Display**: Shown below the activity name

#### startTime (Date)
- **Description**: Start time of the activity
- **Example**: `new Date("2026-05-29T08:00:00")`
- **Display**: Formatted with [`toLocaleString()`](widgets/ProcessActivityTimeline/widget/inlineJavascript.js:39) when [`showTimestamps`](widgets/ProcessActivityTimeline/widget/config.json) is enabled

#### timestamp (Date)
- **Description**: Alternative timestamp property
- **Usage**: Used when `startTime` is not provided

#### endTime (Date)
- **Description**: End time of the activity
- **Usage**: Reserved for future enhancements

#### status (String)
- **Description**: Current status of the process activity
- **Allowed Values**:
  - `completed`
  - `active`
  - `pending`
  - `failed`
  - `skipped`
  - `waiting`
- **Default**: `pending` if not specified
- **Usage**: Determines marker styling and status badge text

#### assignee (String)
- **Description**: User or system assigned to the activity
- **Example**: `"cpmanager"`, `"System"`, `"Finance Team"`
- **Display**: Shown in the activity header beside the avatar

#### assigneeAvatarImage (String)
- **Description**: Base64 avatar image or full data URI for the assignee
- **Example**: `"qctuQjZsahlrFyMItdQZua5X4X0dWurFOvtnGAAAAAElFTkSuQmCC"`
- **Usage**: When present, the widget renders the profile image directly without calling the avatar API

#### assigneeAvatarFormat (String)
- **Description**: Image format for `assigneeAvatarImage`
- **Example**: `"png"`
- **Usage**: Used to build the `data:image/{format};base64,...` URL when the image is provided as raw base64

#### duration (Integer)
- **Description**: Duration of the activity in milliseconds
- **Example**: `1800000`
- **Display**: Rendered as formatted text such as `30m 0s` when [`showDetails`](widgets/ProcessActivityTimeline/widget/config.json) is enabled

#### taskId (String)
- **Description**: BAW task identifier
- **Example**: `"TASK-001"`
- **Display**: Included in the details row and used for comment posting

#### instanceId (String)
- **Description**: BAW process instance identifier
- **Example**: `"INST-12345"`
- **Display**: Included in the details row when available

#### activityId (String)
- **Description**: BAW activity identifier
- **Example**: `"ACT-456"`
- **Usage**: Stored for traceability

## Avatar Resolution Rules

The widget resolves avatars in this order:

1. Use [`assigneeAvatarImage`](widgets/ProcessActivityTimeline/widget/ProcessActivityEvent.json) if it exists
2. Otherwise call `GET /bas/rest/bpm/wle/v1/avatar/{assignee}` for non-system users
3. If no image is available, render initials from the assignee name

The same initials fallback is used for comment authors.

## Data Access Pattern

The widget accesses list-bound data using the BAW list wrapper:

```javascript
var activityData = this.getData().items;
```

Direct access through `this.getData()` does not return the array when `isList: true`.

## Example Data Structures

### Minimal Process Timeline
```javascript
[
  {
    name: "Activity 1"
  },
  {
    name: "Activity 2"
  }
]
```

### Timeline with Explicit Avatar
```javascript
[
  {
    name: "Review Task",
    description: "Document review completed",
    startTime: new Date("2026-05-29T08:00:00"),
    status: "completed",
    assignee: "cpmanager",
    assigneeAvatarImage: "qctuQjZsahlrFyMItdQZua5X4X0dWurFOvtnGAAAAAElFTkSuQmCC",
    assigneeAvatarFormat: "png",
    duration: 1800000,
    taskId: "TASK-001"
  }
]
```

### Timeline with Automatic Avatar Lookup
```javascript
[
  {
    name: "Manager Approval",
    description: "Awaiting manager approval",
    startTime: new Date("2026-05-29T08:35:00"),
    status: "pending",
    assignee: "cpmanager",
    taskId: "TASK-002",
    instanceId: "INST-12345"
  }
]
```

## Default Data

If no data is bound and no process stream is returned, the widget renders a small fallback timeline with sample activities so the coach does not appear empty.

## Notes

- Avatar requests are cached during widget execution
- `System` entries do not trigger avatar API calls
- Comment author avatars currently use the same automatic lookup and initials fallback behavior as assignees