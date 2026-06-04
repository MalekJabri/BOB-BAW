// RiskFactor Widget - BAW Implementation

// Get the risk score from BAW binding
var riskScore = this.getData();

// Get configuration options
var lowThreshold = this.getOption("lowThreshold");
if (lowThreshold === null || lowThreshold === undefined) {
    lowThreshold = 30;
}

var highThreshold = this.getOption("highThreshold");
if (highThreshold === null || highThreshold === undefined) {
    highThreshold = 70;
}

var showLabel = this.getOption("showLabel");
if (showLabel === null || showLabel === undefined) {
    showLabel = true;
}

var showScore = this.getOption("showScore");
if (showScore === null || showScore === undefined) {
    showScore = true;
}

var iconSize = this.getOption("iconSize");
if (!iconSize) {
    iconSize = "medium";
}

// Get DOM container
var container = this.context.element.querySelector("#riskFactorContainer");

// Function to get risk level icons with improved designs
function getLowRiskIcon() {
    // Shield with checkmark - represents protection and safety
    return '<svg viewBox="0 0 32 32"><defs><linearGradient id="lowGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.3"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.1"/></linearGradient></defs><path d="M16 3 L26 7 L26 14 C26 20 22 25 16 29 C10 25 6 20 6 14 L6 7 Z" fill="url(#lowGrad)" stroke="currentColor" stroke-width="1.5"/><path d="M12 16 L15 19 L21 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function getNormalRiskIcon() {
    // Info circle with "i" - represents informational/moderate status
    return '<svg viewBox="0 0 32 32"><defs><linearGradient id="normalGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.3"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.1"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="url(#normalGrad)" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><path d="M16 14 L16 23" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
}

function getHighRiskIcon() {
    // Warning triangle with exclamation - represents caution
    return '<svg viewBox="0 0 32 32"><defs><linearGradient id="highGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.4"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.2"/></linearGradient></defs><path d="M16 4 L28 26 L4 26 Z" fill="url(#highGrad)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 12 L16 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="22" r="1.5" fill="currentColor"/></svg>';
}

function getCriticalRiskIcon() {
    // Octagon with X - represents stop/danger
    return '<svg viewBox="0 0 32 32"><defs><linearGradient id="criticalGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.5"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.3"/></linearGradient></defs><path d="M10 4 L22 4 L28 10 L28 22 L22 28 L10 28 L4 22 L4 10 Z" fill="url(#criticalGrad)" stroke="currentColor" stroke-width="2"/><path d="M11 11 L21 21 M21 11 L11 21" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
}

// Function to update the risk display
function updateRiskDisplay(score, lowThresh, highThresh, showLbl, showScr, size) {
    if (!container) return;
    
    container.innerHTML = "";
    
    // Validate risk score
    if (score === null || score === undefined || isNaN(score)) {
        container.innerHTML = '<div class="risk-display"><span style="color: #525252;">No risk score available</span></div>';
        return;
    }
    
    // Ensure score is within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk level
    var riskLevel, riskLabelText, riskIcon;
    
    if (score <= lowThresh) {
        riskLevel = "low";
        riskLabelText = "Low Risk";
        riskIcon = getLowRiskIcon();
    } else if (score < highThresh) {
        riskLevel = "normal";
        riskLabelText = "Normal Risk";
        riskIcon = getNormalRiskIcon();
    } else if (score < 90) {
        riskLevel = "high";
        riskLabelText = "High Risk";
        riskIcon = getHighRiskIcon();
    } else {
        riskLevel = "critical";
        riskLabelText = "Critical Risk";
        riskIcon = getCriticalRiskIcon();
    }
    
    // Create risk display
    var displayDiv = document.createElement("div");
    displayDiv.className = "risk-display " + riskLevel;
    
    // Add icon
    var iconDiv = document.createElement("div");
    iconDiv.className = "risk-icon " + size;
    iconDiv.innerHTML = riskIcon;
    displayDiv.appendChild(iconDiv);
    
    // Add info
    var infoDiv = document.createElement("div");
    infoDiv.className = "risk-info";
    
    if (showLbl) {
        var labelSpan = document.createElement("span");
        labelSpan.className = "risk-label";
        labelSpan.textContent = riskLabelText;
        infoDiv.appendChild(labelSpan);
    }
    
    if (showScr) {
        var scoreSpan = document.createElement("span");
        scoreSpan.className = "risk-score";
        scoreSpan.textContent = "Score: " + score + " / 100";
        infoDiv.appendChild(scoreSpan);
    }
    
    displayDiv.appendChild(infoDiv);
    container.appendChild(displayDiv);
}

// Initial render
updateRiskDisplay(riskScore, lowThreshold, highThreshold, showLabel, showScore, iconSize);

// Store reference to widget instance
var me = this;

// Listen for data changes (BAW automatic updates)
if (this.context && this.context.binding) {
    var binding = this.context.binding;
    
    // Watch for changes to the bound data
    if (binding.addDataChangeListener) {
        binding.addDataChangeListener(function(newValue) {
            var newScore = 0;
            
            if (typeof newValue === "number") {
                newScore = newValue;
            }
            
            newScore = Math.max(0, Math.min(100, newScore));
            updateRiskDisplay(newScore, lowThreshold, highThreshold, showLabel, showScore, iconSize);
        });
    }
}

// Made with Bob
