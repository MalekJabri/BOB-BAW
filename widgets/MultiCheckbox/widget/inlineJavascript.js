// Store widget context reference
var widget = this;

// Get DOM elements
var container = widget.context.element.querySelector(".multicheckbox-container");
var labelElement = container.querySelector(".multicheckbox-label");
var selectAllWrapper = container.querySelector(".multicheckbox-select-all-wrapper");
var selectAllInput = container.querySelector(".multicheckbox-select-all-input");
var optionsContainer = container.querySelector(".multicheckbox-options");
var helperText = container.querySelector(".multicheckbox-helper-text");

// Get configuration options
var options = widget.getOption("options");
var label = widget.getOption("label") || "";
var layout = widget.getOption("layout") || "vertical";
var showSelectAll = widget.getOption("showSelectAll");
var disabled = widget.getOption("disabled");
var helperTextValue = widget.getOption("helperText") || "";

// Validate and ensure options is an array with .items property
if (options && options.items && Array.isArray(options.items)) {
  options = options.items;
} else if (!options || !Array.isArray(options)) {
  options = [];
}

// Set default values
if (showSelectAll === undefined || showSelectAll === null) showSelectAll = true;
if (disabled === undefined || disabled === null) disabled = false;

// Get selected values from bound data
var selectedValues = widget.getData() || [];
if (!Array.isArray(selectedValues)) {
  selectedValues = [];
}

// State management
var state = {
  selectedValues: selectedValues,
  allOptions: options.slice() // Create a copy
};

// Initialize widget
function init() {
  // Set label
  if (label) {
    labelElement.textContent = label;
  }
  
  // Set helper text
  if (helperTextValue) {
    helperText.textContent = helperTextValue;
  }
  
  // Show/hide Select All
  if (!showSelectAll) {
    selectAllWrapper.style.display = "none";
  }
  
  // Set layout
  if (layout === "horizontal") {
    container.classList.add("horizontal");
  } else if (layout === "compact") {
    container.classList.add("compact");
  }
  
  // Set disabled state
  if (disabled) {
    container.classList.add("disabled");
    if (selectAllInput) selectAllInput.disabled = true;
  }
  
  // Attach Select All event listener
  if (showSelectAll && selectAllInput) {
    selectAllInput.addEventListener("change", handleSelectAllChange);
  }
  
  // Render checkboxes
  renderCheckboxes();
  updateSelectAllState();
}

// Render checkboxes
function renderCheckboxes() {
  optionsContainer.innerHTML = "";
  
  if (state.allOptions.length === 0) {
    var noOptions = document.createElement("div");
    noOptions.className = "multicheckbox-no-options";
    noOptions.textContent = "No options available";
    optionsContainer.appendChild(noOptions);
    return;
  }
  
  state.allOptions.forEach(function(option, index) {
    var optionEl = document.createElement("label");
    optionEl.className = "multicheckbox-option";
    optionEl.setAttribute("role", "listitem");
    
    if (disabled) {
      optionEl.classList.add("disabled");
    }
    
    // Hidden checkbox input
    var input = document.createElement("input");
    input.type = "checkbox";
    input.className = "multicheckbox-input";
    input.value = option.value;
    input.id = "multicheckbox-" + widget.context.viewid + "-" + index;
    
    var isSelected = state.selectedValues.indexOf(option.value) !== -1;
    if (isSelected) {
      input.checked = true;
    }
    
    if (disabled) {
      input.disabled = true;
    }
    
    // Custom checkbox
    var checkbox = document.createElement("span");
    checkbox.className = "multicheckbox-checkbox";
    checkbox.setAttribute("aria-hidden", "true");
    checkbox.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 11.7L3.3 8.5l.7-.7 2.5 2.5 5.2-5.2.7.7z"/></svg>';
    
    // Label text
    var labelText = document.createElement("span");
    labelText.className = "multicheckbox-label-text";
    labelText.textContent = option.name;
    labelText.setAttribute("for", input.id);
    
    // Assemble option
    optionEl.appendChild(input);
    optionEl.appendChild(checkbox);
    optionEl.appendChild(labelText);
    
    // Change handler
    input.addEventListener("change", function(e) {
      handleCheckboxChange(option.value, e.target.checked);
    });
    
    optionsContainer.appendChild(optionEl);
  });
}

// Handle checkbox change
function handleCheckboxChange(value, checked) {
  if (disabled) return;
  
  var index = state.selectedValues.indexOf(value);
  
  if (checked && index === -1) {
    // Add to selected values
    state.selectedValues.push(value);
  } else if (!checked && index !== -1) {
    // Remove from selected values
    state.selectedValues.splice(index, 1);
  }
  
  // Update data binding
  widget.setData(state.selectedValues);
  
  // Update Select All state
  updateSelectAllState();
  
  // Update ARIA label
  updateAriaLabel();
}

// Handle Select All change
function handleSelectAllChange(e) {
  if (disabled) return;
  
  // Clear indeterminate state first
  if (selectAllInput) {
    selectAllInput.indeterminate = false;
  }
  
  var checked = e.target.checked;
  
  if (checked) {
    // Select all options
    state.selectedValues = state.allOptions.map(function(opt) {
      return opt.value;
    });
  } else {
    // Deselect all options
    state.selectedValues = [];
  }
  
  // Update data binding - check if binding exists first
  try {
    if (widget && widget.context && widget.context.binding) {
      widget.setData(state.selectedValues);
    }
  } catch (error) {
    console.log('MultiCheckbox: Unable to update data binding', error);
  }
  
  // Update all checkboxes to match
  var checkboxes = optionsContainer.querySelectorAll(".multicheckbox-input");
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = checked;
  });
  
  // Update ARIA label
  updateAriaLabel();
}

// Update Select All checkbox state
function updateSelectAllState() {
  if (!showSelectAll || !selectAllInput) return;
  
  var allSelected = state.selectedValues.length === state.allOptions.length && state.allOptions.length > 0;
  var someSelected = state.selectedValues.length > 0 && state.selectedValues.length < state.allOptions.length;
  
  selectAllInput.checked = allSelected;
  selectAllInput.indeterminate = someSelected;
}

// Update ARIA label
function updateAriaLabel() {
  var count = state.selectedValues.length;
  var label = count === 0 ? "No items selected" :
              count === 1 ? "1 item selected" :
              count + " items selected";
  container.setAttribute("aria-label", label);
}

// Initialize the widget
init();
updateAriaLabel();

// Made with Bob