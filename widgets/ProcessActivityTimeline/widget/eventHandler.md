# ProcessActivityTimeline Widget - Event Handler

## Overview

The ProcessActivityTimeline widget supports event handling for interactive process activity timelines. This document describes the available events and how to use them.

## Events

### activityClicked Event

The `activityClicked` event is fired when a user clicks on a timeline activity (when the `clickable` configuration option is enabled).

#### Configuration

To enable the event, set the `clickable` configuration option to `true`:

```javascript
// In the widget configuration
clickable: true
```

#### Event Data

When the event is fired, it provides the following data:

- **index** (Integer): The zero-based index of the clicked activity in the timeline
- **activity** (ProcessActivityEvent): The complete activity object that was clicked

#### Event Handler Example

```javascript
// In your coach view or service flow
// Handle the activityClicked event

function handleActivityClick(index, activity) {
  console.log("Activity clicked at index:", index);
  console.log("Activity data:", activity);
  
  // Access activity properties
  var activityName = activity.name;
  var activityStatus = activity.status;
  var assignee = activity.assignee;
  var taskId = activity.taskId;
  
  // Perform actions based on the clicked activity
  if (activity.status === "active") {
    // Navigate to active task details
    navigateToTask(taskId);
  } else if (activity.status === "failed") {
    // Show error details
    showErrorDialog(activity);
  }
}
```

#### Use Cases

1. **Navigate to Task Details**: Click an activity to view detailed task information
2. **Show Activity History**: Display complete activity history and audit trail
3. **Drill-Down to Process Instance**: Navigate to the process instance details
4. **Display Error Information**: Show detailed error messages for failed activities
5. **Open Activity Form**: Launch the activity's associated form or UI
6. **View Assignee Information**: Display assignee details and contact information

## Event Registration

The widget automatically registers the event handler using BAW's event handling system:

```javascript
// In inlineJavascript.js
this.registerEventHandlingFunction(this, "activityClicked", "index");
```

This registration allows the widget to fire boundary events that can be caught by the containing coach view or service flow.

## Change Event

The widget also supports the standard BAW `change` event, which is fired when the widget's bound data changes.

### Change Event Handler

The change event is handled in the `change.js` file:

```javascript
// widgets/ProcessActivityTimeline/widget/events/change.js
var _this = this;

// Get the updated data
var data = _this.getData();

console.log('ProcessActivityTimeline data changed:', data);

// The widget will automatically re-render through inlineJavascript.js
```

### When Change Event Fires

The change event fires in the following scenarios:

1. **Data Binding Update**: When the bound data variable is updated
2. **Process Activity Status Change**: When an activity's status changes
3. **New Activity Added**: When a new activity is added to the timeline
4. **Activity Removed**: When an activity is removed from the timeline
5. **Activity Properties Updated**: When any activity property is modified

## Event Flow Example

### Scenario: User Clicks on Active Activity

1. User clicks on an activity with status "active"
2. Widget fires `activityClicked` event with activity index and data
3. Coach view receives the event
4. Coach view navigates to the task details page
5. User completes the task
6. Process updates the activity status to "completed"
7. Widget's bound data changes
8. Widget fires `change` event
9. Widget re-renders with updated activity status

### Implementation Example

```javascript
// In your coach view

// Handle activity click
function onActivityClicked(index, activity) {
  if (activity.status === "active" && activity.taskId) {
    // Store current activity for later reference
    tw.local.selectedActivity = activity;
    
    // Navigate to task details
    navigateToTaskDetails(activity.taskId);
  } else if (activity.status === "pending") {
    // Show message that activity is not yet started
    showMessage("This activity has not started yet.");
  } else if (activity.status === "completed") {
    // Show activity completion details
    showActivitySummary(activity);
  }
}

// Handle data change
function onActivityDataChanged() {
  // Refresh any dependent data or UI elements
  refreshProcessSummary();
  updateProcessMetrics();
}
```

## Best Practices

1. **Enable Clickable Selectively**: Only enable `clickable` when you have meaningful actions to perform on click
2. **Provide Visual Feedback**: Use hover states to indicate clickable activities
3. **Handle All Status Types**: Implement appropriate actions for each activity status
4. **Error Handling**: Always handle cases where activity data might be incomplete
5. **Performance**: Avoid heavy operations in click handlers; use asynchronous processing when needed
6. **User Feedback**: Provide clear feedback when an activity is clicked (loading indicators, navigation, etc.)
7. **Accessibility**: Ensure keyboard navigation works for clickable activities

## Event Debugging

To debug event handling, enable console logging:

```javascript
// In your event handler
function onActivityClicked(index, activity) {
  console.log("=== Activity Clicked ===");
  console.log("Index:", index);
  console.log("Activity Name:", activity.name);
  console.log("Activity Status:", activity.status);
  console.log("Activity Data:", JSON.stringify(activity, null, 2));
  console.log("=======================");
  
  // Your event handling logic here
}
```

## Related Documentation

- See [`README.md`](../README.md) for widget features and configuration options
- See [`datamodel.md`](datamodel.md) for data structure details
- See [`ProcessActivityEvent.json`](ProcessActivityEvent.json) for the business object definition

---

Made with Bob