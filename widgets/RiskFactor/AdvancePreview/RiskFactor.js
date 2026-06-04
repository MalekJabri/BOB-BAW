// RiskFactor Preview JavaScript
(function() {
  'use strict';
  
  // Sample data for preview
  var sampleData = {
    message: "This is a preview of the RiskFactor widget"
  };
  
  // Render preview
  function renderPreview() {
    var container = document.getElementById('widget-preview');
    
    // Create widget HTML
    var widgetHTML = `
      <div class="riskfactor-container">
        <div class="riskfactor-content">
          <p>${sampleData.message}</p>
        </div>
      </div>
    `;
    
    container.innerHTML = widgetHTML;
  }
  
  // Initialize preview on load
  window.addEventListener('DOMContentLoaded', renderPreview);
})();