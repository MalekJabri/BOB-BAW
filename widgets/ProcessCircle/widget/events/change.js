// ProcessCircle Widget - Change Event Handler
// Executed when the widget data changes
var _this = this;

try {
    // Get the progress circle element
    var processCircle = _this.context.element.querySelector('.process-circle');
    
    if (!processCircle) {
        console.error('ProcessCircle: Widget element not found in change event');
        return;
    }
    
    // Get configuration options with defaults
    var maxValue = _this.getOption("MaxValue") || 100;
    var minValue = _this.getOption("MinValue") || 0;
    var postParameter = _this.getOption("postParameter") || "%";
    var circleSize = _this.getOption("CircleSize") || "12rem";
    var ringThickness = _this.getOption("RingThickness") || "0.5rem";
    
    // Get updated value
    var currentValue = _this.getData() || 0;
    
    // Validate value range
    if (currentValue < minValue) currentValue = minValue;
    if (currentValue > maxValue) currentValue = maxValue;
    
    // Update ARIA attributes for accessibility
    processCircle.setAttribute("aria-valuenow", currentValue);
    processCircle.setAttribute("aria-valuemin", minValue);
    processCircle.setAttribute("aria-valuemax", maxValue);
    processCircle.setAttribute("data-post", postParameter);
    
    // Update CSS custom properties for visual display
    processCircle.style.setProperty("--value", currentValue);
    processCircle.style.setProperty("--min", minValue);
    processCircle.style.setProperty("--max", maxValue);
    processCircle.style.setProperty("--circle-size", circleSize);
    processCircle.style.setProperty("--size", ringThickness);
    
    console.log('ProcessCircle: Value updated to', currentValue);
    
} catch (error) {
    console.error('ProcessCircle: Change event error', error);
}

// Made with Bob
