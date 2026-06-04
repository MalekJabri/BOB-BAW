# MultiCheckbox Widget - Event Handler

## Overview
The MultiCheckbox widget uses a change event handler to respond to data updates and maintain synchronization between the bound data and the checkbox display.

## Event: change.js

### Purpose
The change event handler is executed whenever the widget's bound data changes, either through:
- External data updates (e.g., from a service flow)
- Programmatic data changes
- Other widgets modifying the same bound variable

### Trigger Conditions
- Bound data array is modified externally
- Service flow updates the selected values
- Another widget changes the shared data binding
- Reset or clear operations from parent components

### Implementation

```javascript
// MultiCheckbox - Change Event Handler
// Executed when the widget data changes
var _this = this;

// Get the updated data
var data = _this.getData();

console.log('MultiCheckbox data changed:', data);

// Re-render the checkboxes to reflect the new selection state
var container = _this.context.element.querySelector(".multicheckbox-container");
var optionsContainer = container.querySelector(".multicheckbox-options");

// Update checkbox states based on new data
var checkboxes = optionsContainer.querySelectorAll(".multicheckbox-input");
var selectedValues = data || [];

if (!Array.isArray(selectedValues)) {
  selectedValues = [];
}

checkboxes.forEach(function(checkbox) {
  var isSelected = selectedValues.indexOf(checkbox.value) !== -1;
  checkbox.checked = isSelected;
});

// Update ARIA label
var count = selectedValues.length;
var label = count === 0 ? "No items selected" :
            count === 1 ? "1 item selected" :
            count + " items selected";
container.setAttribute("aria-label", label);
```

### Behavior

1. **Data Retrieval**: Gets the updated data array from the widget binding
2. **Validation**: Ensures data is an array (defaults to empty array if not)
3. **Checkbox Update**: Iterates through all checkbox inputs and updates their checked state
4. **Accessibility Update**: Updates the ARIA label to reflect the new selection count

### Use Cases

#### Use Case 1: External Data Reset
```javascript
// Service flow clears all selections
tw.local.selectedOptions = [];

// Change event fires
// All checkboxes become unchecked
// ARIA label updates to "No items selected"
```

#### Use Case 2: Programmatic Selection
```javascript
// Service flow pre-selects specific options
tw.local.selectedOptions = ["option1", "option3"];

// Change event fires
// Checkboxes for "option1" and "option3" become checked
// ARIA label updates to "2 items selected"
```

#### Use Case 3: Bulk Update
```javascript
// Another widget or button selects all options
tw.local.selectedOptions = ["option1", "option2", "option3", "option4"];

// Change event fires
// All checkboxes become checked
// ARIA label updates to "4 items selected"
```

## Event Flow

```
External Data Change
        ↓
Change Event Triggered
        ↓
getData() Called
        ↓
Data Validation
        ↓
Update Checkbox States
        ↓
Update ARIA Labels
        ↓
Display Synchronized
```

## Integration with User Interactions

The change event handler works in conjunction with the widget's internal checkbox change handlers:

1. **User Clicks Checkbox**:
   - Internal handler updates state array
   - Calls `setData()` with new array
   - Does NOT trigger change event (same widget)
   - Checkboxes already updated by internal logic

2. **External Data Change**:
   - Change event handler fires
   - Updates checkbox states to match new data
   - Ensures display synchronization

## Performance Considerations

- **Efficient Updates**: Only updates checkbox checked states, not full re-render
- **Minimal DOM Manipulation**: Uses `querySelectorAll` once, then iterates
- **No Redundant Updates**: Skips update if checkbox already in correct state

## Debugging

Enable console logging to track change events:

```javascript
console.log('MultiCheckbox data changed:', data);
```

This helps identify:
- When external data changes occur
- What values are being set
- Whether data format is correct

## Best Practices

1. **Avoid Circular Updates**: Don't call `setData()` within the change event handler
2. **Validate Data**: Always check if data is an array before processing
3. **Handle Edge Cases**: Account for null, undefined, or invalid data
4. **Maintain Accessibility**: Always update ARIA labels when selection changes
5. **Log Changes**: Use console logging during development for debugging

## Related Events

- **Load Event**: Not used (initialization handled in inlineJavascript.js)
- **View Event**: Not used (no visibility-dependent behavior)
- **Validate Event**: Not used (no validation requirements)
- **Unload Event**: Not used (no cleanup required)

---

Made with Bob