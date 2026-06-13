# ProcessActivityTimeline Widget

A specialized vertical timeline widget for displaying IBM Business Automation Workflow process activities with status tracking, assignee information, duration metrics, comments, and avatar-based user identity.

## Features

- **Process-Focused Timeline**: Vertical timeline optimized for BAW process activity tracking
- **Rich Status Indicators**: Visual markers for activity states (`completed`, `active`, `pending`, `failed`, `skipped`, `waiting`)
- **Avatar Rendering**: Uses BAW profile images from the avatar REST API instead of blue initial bubbles when an image is available
- **Initials Fallback**: Falls back to assignee or comment-author initials when no avatar image is returned
- **Timestamp Display**: Optional start time information for each activity
- **Process Details**: Support for assignee, duration, task IDs, and instance IDs
- **Task Comments**: Displays existing comments and supports posting new task comments
- **Interactive Activities**: Optional click handling for timeline activities
- **Compact Mode**: Space-efficient display for dense activity timelines
- **Responsive Design**: Adapts to different screen sizes
- **Carbon Design System**: Follows IBM Carbon design principles with process-specific enhancements

## Configuration Options

### processInstanceId (String)
- **Default**: `""` (empty)
- **Description**: BAW process instance ID to automatically fetch activity data
- When provided, the widget automatically fetches process activity data from the BAW REST API
- When empty, the widget uses manual data binding through the `ProcessActivityData` property
- **API Endpoint**: [`/bas/rest/bpm/wle/v1/social/instance/{instanceId}/stream`](widgets/ProcessActivityTimeline/README.md)

### baseUrl (String)
- **Default**: `""` (empty - uses current server)
- **Description**: BAW server base URL for API calls
- When empty, uses the current server URL automatically
- Example: `https://cpd-cp4ba.apps.itz-dpvnuw.infra01-lb.lon04.techzone.ibm.com`
- Only needed when the widget is hosted on a different server than BAW

### showTimestamps (Boolean)
- **Default**: `true`
- **Description**: Display timestamp information for each activity
- When enabled, shows formatted start time in the activity header

### showIcons (Boolean)
- **Default**: `true`
- **Description**: Display status icons for activities
- Shows visual indicators in the timeline marker based on activity status

### showDetails (Boolean)
- **Default**: `true`
- **Description**: Display activity details section
- Shows duration, task ID, and instance ID when available

### compact (Boolean)
- **Default**: `false`
- **Description**: Use compact spacing for timeline activities
- Reduces vertical spacing and marker sizes for denser timelines

### clickable (Boolean)
- **Default**: `false`
- **Description**: Enable click interaction on timeline activities
- When enabled, activities become clickable and fire the `activityClicked` event

## Avatar Behavior

The widget supports two avatar sources:

1. **Explicit avatar data in the bound business object**
   - Use [`assigneeAvatarImage`](widgets/ProcessActivityTimeline/widget/ProcessActivityEvent.json) with a base64 payload or full data URI
   - Optionally provide [`assigneeAvatarFormat`](widgets/ProcessActivityTimeline/widget/ProcessActivityEvent.json) such as `png`

2. **Automatic avatar lookup from BAW**
   - When only [`assignee`](widgets/ProcessActivityTimeline/widget/ProcessActivityEvent.json) is present, the widget calls the BAW avatar endpoint:
   - `GET /bas/rest/bpm/wle/v1/avatar/{userName}`
   - The response field `data.userAvatarImage` is converted into a `data:image/{format};base64,...` URL and applied to the avatar element

Example response shape:
```json
{
  "status": "200",
  "data": {
    "userID": 2,
    "userName": "cpmanager",
    "userAvatarImage": "qctuQjZsahlrFyMItdQZua5X4X0dWurFOvtnGAAAAAElFTkSuQmCC",
    "userAvatarKey": "1781270629727-2",
    "userUpdateTimestamp": "1781270629727",
    "imageFormat": "png",
    "isDefault": "false"
  }
}
```

If no image is returned, the widget displays initials instead.

## Events

### activityClicked
- **Parameter**: `index` (Integer)
- **Description**: Fired when a timeline activity is clicked when [`clickable`](widgets/ProcessActivityTimeline/widget/config.json) is enabled

## Data Model

The widget expects an array of `ProcessActivityEvent` objects.

```javascript
{
  name: "Review Task",
  description: "Document review completed",
  startTime: new Date("2026-05-29T08:00:00"),
  status: "completed",
  assignee: "cpmanager",
  assigneeAvatarImage: "qctuQjZsahlrFyMItdQZua5X4X0dWurFOvtnGAAAAAElFTkSuQmCC",
  assigneeAvatarFormat: "png",
  duration: 1800000,
  taskId: "TASK-001",
  instanceId: "INST-123",
  activityId: "ACT-456"
}
```

## Status Values

- **completed**: Activity has been completed
- **active**: Activity is currently running
- **pending**: Activity is upcoming or not started
- **failed**: Activity has failed
- **skipped**: Activity was skipped
- **waiting**: Activity is waiting for input or approval

## Usage Examples

### Automatic Data Fetching
```javascript
processInstanceId: "2072.1072"
```

The widget calls:
```javascript
GET /bas/rest/bpm/wle/v1/social/instance/2072.1072/stream
```

When assignees or comment authors are present, it also resolves avatars with:
```javascript
GET /bas/rest/bpm/wle/v1/avatar/cpmanager
```

### Manual Data Binding with Explicit Avatar
```javascript
tw.local.activityTimeline = [
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
];
```

### Manual Data Binding with Automatic Avatar Lookup
```javascript
tw.local.activityTimeline = [
  {
    name: "Manager Approval",
    description: "Awaiting manager approval",
    startTime: new Date("2026-05-29T08:35:00"),
    status: "pending",
    assignee: "cpmanager",
    taskId: "TASK-002"
  }
];
```

In this case the widget uses [`assignee`](widgets/ProcessActivityTimeline/widget/ProcessActivityEvent.json) to call the avatar endpoint automatically.

## Notes

- The widget uses BAW list binding access through [`this.getData().items`](widgets/ProcessActivityTimeline/widget/datamodel.md)
- Avatar requests are cached in memory during widget execution to avoid repeated calls for the same user
- `System` activities intentionally keep the initials fallback instead of calling the avatar endpoint