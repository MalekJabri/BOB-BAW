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

// Made with Bob
