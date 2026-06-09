# ProcessActivityTimeline Widget

A specialized vertical timeline widget for displaying IBM Business Automation Workflow process activities with comprehensive status tracking, assignee information, duration metrics, and process-specific details.

## Features

- **Process-Focused Timeline**: Vertical timeline optimized for BAW process activity tracking
- **Rich Status Indicators**: Visual markers for activity states (completed, active, pending, failed, skipped, waiting)
- **Timestamp Display**: Optional start time information for each activity
- **Process Details**: Support for assignee, duration, task IDs, and instance IDs
- **Interactive Activities**: Optional click handling for timeline activities
- **Compact Mode**: Space-efficient display for dense activity timelines
- **Responsive Design**: Adapts to different screen sizes
- **Carbon Design System**: Follows IBM Carbon design principles with process-specific enhancements

## Configuration Options

### processInstanceId (String)
- **Default**: `""` (empty)
- **Description**: BAW process instance ID to automatically fetch activity data
- When provided (e.g., `"2072.1072"`), the widget automatically fetches process activity data from the BAW REST API
- When empty, the widget uses manual data binding through the `ProcessActivityData` property
- **API Endpoint**: `/bas/rest/bpm/wle/v1/social/instance/{instanceId}/stream`

### baseUrl (String)
- **Default**: `""` (empty - uses current server)
- **Description**: BAW server base URL for API calls
- When empty, uses the current server URL automatically
- Example: `"https://cpd-cp4ba.apps.itz-gymn37.infra01-lb.lon04.techzone.ibm.com"`
- Only needed when widget is hosted on a different server than BAW

### showTimestamps (Boolean)
- **Default**: `true`
- **Description**: Display timestamp information for each activity
- When enabled, shows formatted start time in the activity header

### showIcons (Boolean)
- **Default**: `true`
- **Description**: Display status icons for activities
- Shows visual indicators based on activity status (checkmark for completed, etc.)

### showDetails (Boolean)
- **Default**: `true`
- **Description**: Display activity details section
- Shows assignee, duration, task ID, and instance ID when available

### compact (Boolean)
- **Default**: `false`
- **Description**: Use compact spacing for timeline activities
- Reduces vertical spacing and marker sizes for denser timelines

### clickable (Boolean)
- **Default**: `false`
- **Description**: Enable click interaction on timeline activities
- When enabled, activities become clickable and fire the `activityClicked` event

## Events

### activityClicked
- **Parameter**: `index` (Integer)
- **Description**: Fired when a timeline activity is clicked (when `clickable` is enabled)
- Provides the index of the clicked activity and activity data

## Data Model

The widget expects an array of `ProcessActivityEvent` objects with the following structure:

```javascript
{
  "name": "Activity Name",              // Required: Activity name
  "description": "Activity description", // Optional: Detailed description
  "startTime": Date,                    // Optional: Start time as Date object
  "endTime": Date,                      // Optional: End time as Date object
  "status": "active",                   // Optional: completed, active, pending, failed, skipped, waiting
  "assignee": "John Doe",               // Optional: Assigned user or system
  "duration": 1800000,                  // Optional: Duration in milliseconds
  "taskId": "TASK-001",                 // Optional: BAW task identifier
  "instanceId": "INST-123",             // Optional: BAW process instance identifier
  "activityId": "ACT-456"               // Optional: BAW activity identifier
}
```

### Status Values

- **completed**: Activity has been completed (green checkmark icon)
- **active**: Activity is currently running (pulsing blue indicator)
- **pending**: Activity is upcoming or not started (gray indicator)
- **failed**: Activity has failed (red X icon)
- **skipped**: Activity was skipped (gray forward arrow icon)
- **waiting**: Activity is waiting for input or approval (yellow clock icon)

## Usage Examples

### Automatic Data Fetching (Recommended)

The widget can automatically fetch process activity data from BAW when you provide a process instance ID:

```javascript
// Simply set the process instance ID in the widget configuration
// The widget will automatically fetch and display activity data

// In your coach view configuration:
processInstanceId: "2072.1072"  // Your BAW process instance ID

// Or bind it to a variable:
processInstanceId: tw.system.currentProcessInstanceId

// The widget will call:
// GET /bas/rest/bpm/wle/v1/social/instance/2072.1072/stream
```

### Automatic Fetching with Custom Server

```javascript
// If your widget is hosted on a different server than BAW:
processInstanceId: "2072.1072"
baseUrl: "https://cpd-cp4ba.apps.itz-gymn37.infra01-lb.lon04.techzone.ibm.com"
```

### Manual Data Binding

You can still manually provide activity data if you prefer:

```javascript
// Leave processInstanceId empty and bind data manually
processInstanceId: ""  // Empty - use manual binding

// Bind your data to the widget:
tw.local.activityTimeline = [
  {
    name: "Review Task",
    description: "Document review completed",
    startTime: new Date("2026-05-29T08:00:00"),
    status: "completed",
    assignee: "John Doe",
    duration: 1800000,
    taskId: "TASK-001"
  }
];
```

### Basic Process Timeline

```javascript
// Simple process activity timeline
var activityData = [
  {
    name: "Process Started",
    description: "Process instance initiated",
    startTime: new Date("2026-05-29T08:00:00"),
    status: "completed",
    assignee: "System",
    duration: 5000
  },
  {
    name: "Review Task",
    description: "Document review and approval",
    startTime: new Date("2026-05-29T08:05:00"),
    status: "completed",
    assignee: "John Doe",
    duration: 1800000,
    taskId: "TASK-001"
  },
  {
    name: "Data Validation",
    description: "Validating submitted data",
    startTime: new Date("2026-05-29T08:35:00"),
    status: "active",
    assignee: "System"
  }
];
```

### Complete Process Activity Timeline

```javascript
// Comprehensive process timeline with all details
var activityData = [
  {
    name: "Initiate Request",
    description: "User submitted new request",
    startTime: new Date("2026-05-29T08:00:00"),
    endTime: new Date("2026-05-29T08:00:05"),
    status: "completed",
    assignee: "Jane Smith",
    duration: 5000,
    taskId: "TASK-001",
    instanceId: "INST-12345",
    activityId: "ACT-001"
  },
  {
    name: "Manager Review",
    description: "Manager reviewing and approving request",
    startTime: new Date("2026-05-29T08:05:00"),
    endTime: new Date("2026-05-29T08:35:00"),
    status: "completed",
    assignee: "Bob Manager",
    duration: 1800000,
    taskId: "TASK-002",
    instanceId: "INST-12345",
    activityId: "ACT-002"
  },
  {
    name: "System Processing",
    description: "Automated data processing and validation",
    startTime: new Date("2026-05-29T08:35:00"),
    status: "active",
    assignee: "System",
    instanceId: "INST-12345",
    activityId: "ACT-003"
  },
  {
    name: "Finance Approval",
    description: "Awaiting finance department approval",
    status: "pending",
    assignee: "Finance Team",
    instanceId: "INST-12345",
    activityId: "ACT-004"
  }
];
```

### Process Timeline with Various States

```javascript
// Timeline showing different activity states
var activityData = [
  {
    name: "Data Entry",
    status: "completed",
    assignee: "User A",
    duration: 300000
  },
  {
    name: "Validation Check",
    status: "completed",
    assignee: "System",
    duration: 5000
  },
  {
    name: "Manual Review",
    status: "active",
    assignee: "Reviewer B"
  },
  {
    name: "Quality Check",
    status: "failed",
    assignee: "QA Team",
    description: "Quality standards not met"
  },
  {
    name: "Optional Step",
    status: "skipped",
    assignee: "System",
    description: "Skipped based on business rules"
  },
  {
    name: "Final Approval",
    status: "waiting",
    assignee: "Director",
    description: "Waiting for director availability"
  }
];
```

## Styling

The widget uses Carbon Design System colors with process-specific enhancements:

- **Success Green**: `#198038` (completed state)
- **Primary Blue**: `#0f62fe` (active state)
- **Gray**: `#c6c6c6` (pending state)
- **Alert Red**: `#da1e28` (failed state)
- **Warning Yellow**: `#fdd13a` (waiting state)
- **Text Colors**: Carbon gray scale

## Accessibility

- Semantic HTML structure
- Clear visual hierarchy
- Sufficient color contrast
- Keyboard navigation support (when clickable)
- Screen reader friendly content
- Status badges with clear text labels

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with appropriate polyfills)
- Responsive design for mobile and tablet devices

## Best Practices

1. **Activity Names**: Use clear, descriptive names that identify the process step
2. **Status Consistency**: Use status values consistently across your process timeline
3. **Assignee Information**: Always provide assignee information for accountability
4. **Duration Tracking**: Include duration for completed activities to track performance
5. **Process IDs**: Include task and instance IDs for traceability
6. **Compact Mode**: Use for processes with many activities in limited space
7. **Clickable Activities**: Enable for drill-down into activity details

## Process-Specific Features

### Duration Formatting
The widget automatically formats duration values:
- Less than 1 minute: Shows seconds (e.g., "45s")
- Less than 1 hour: Shows minutes and seconds (e.g., "5m 30s")
- Less than 1 day: Shows hours and minutes (e.g., "2h 15m")
- 1 day or more: Shows days and hours (e.g., "3d 4h")

### Status Badge Colors
Each status has a distinct color scheme for quick visual identification:
- **Completed**: Green badge with dark green text
- **Active**: Blue badge with dark blue text (with pulsing animation)
- **Pending**: Gray badge with gray text
- **Failed**: Red badge with dark red text
- **Skipped**: Gray badge with gray text
- **Waiting**: Yellow badge with dark yellow text

### Activity Details Section
When `showDetails` is enabled, the widget displays:
- **Assignee**: User or system responsible for the activity
- **Duration**: Time taken to complete the activity (formatted)
- **Task ID**: BAW task identifier for reference
- **Instance ID**: BAW process instance identifier for tracking

## Related Widgets

- **Timeline**: For general chronological events
- **Stepper**: For step-by-step process flows
- **ProgressBar**: For single progress indicators

## Version History

- **1.0.0** (2026-05-29): Initial release
  - Process-focused vertical timeline layout
  - Six status states (completed, active, pending, failed, skipped, waiting)
  - Timestamp and duration display
  - Assignee and process ID tracking
  - Interactive activities
  - Compact mode
  - Responsive design
  - Carbon Design System integration

---

Made with Bob