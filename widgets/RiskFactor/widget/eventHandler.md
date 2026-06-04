# RiskFactor Event Handlers

## Available Events

### load
Executed when the widget is first loaded.

```javascript
// Initialize widget state
var data = this.getData();
console.log('Widget loaded with data:', data);
```

### change
Executed when the widget data changes.

```javascript
// Handle data changes
var newData = this.getData();
console.log('Data changed:', newData);
// Update UI accordingly
```

### view
Executed when the widget becomes visible.

```javascript
// Refresh widget display
render();
```

### validate
Executed during form validation.

```javascript
// Validate widget data
var data = this.getData();
if (!data.message) {
  return {
    valid: false,
    message: "Message is required"
  };
}
return { valid: true };
```

### unload
Executed when the widget is being removed.

```javascript
// Cleanup resources
console.log('Widget unloading');
```
