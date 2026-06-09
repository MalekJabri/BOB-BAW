/*
 * #BEGIN COPYRIGHT
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2026
 * #END COPYRIGHT
 */

var mixObject = {

    createPreview: function (containingDiv, labelText, callback) {
        var previewLayerUri = this.context.getManagedAssetUrl(
            "BPMExt-Controls.preview.js",
            this.context.assetType_WEB,
            "SYSBPMUI"
        );

        require([previewLayerUri], this.lang.hitch(this, function () {
            require([
                "dojo/dom-construct",
                "dojo/dom-class",
                "dojo/dom-attr",
                "bpmui/preview/BPMExt-Core-Designer"
            ], this.lang.hitch(this, function (domConstruct, domClass, domAttr, bpmext) {

                bpmext.uidesign.css.ensureGlyphsLoaded(this);
                bpmext.uidesign.css.ensureSparkUIClass(containingDiv);

                this.context.coachViewData.containingDiv = containingDiv;

                // Form group
                var formGroupDiv = domConstruct.create("div", null, containingDiv);
                domClass.add(formGroupDiv, "form-group");
                this.context.coachViewData.formGroupDiv = formGroupDiv;

                // Label
                var label = domConstruct.create("span", null, formGroupDiv);
                domClass.add(label, "control-label");
                label.appendChild(document.createTextNode(labelText));
                this.context.coachViewData.label = label;

                // Input container
                var inputDiv = domConstruct.create("div", null, formGroupDiv);
                domClass.add(inputDiv, "input");
                this.context.coachViewData.inputDiv = inputDiv;

                // Generate sample preview data
                this.generateSampleData(domConstruct, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass) {
        
        var examplesDiv = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(examplesDiv, "preview-examples");

        // Example 1: Low Risk
        this._createRiskExample(domConstruct, domClass, examplesDiv, 15, "Low Risk Example", "medium");

        // Example 2: Normal Risk
        this._createRiskExample(domConstruct, domClass, examplesDiv, 50, "Normal Risk Example", "medium");

        // Example 3: High Risk
        this._createRiskExample(domConstruct, domClass, examplesDiv, 75, "High Risk Example", "medium");

        // Example 4: Critical Risk
        this._createRiskExample(domConstruct, domClass, examplesDiv, 95, "Critical Risk Example", "medium");
    },

    _createRiskExample: function (domConstruct, domClass, container, score, title, iconSize) {
        
        var exampleDiv = domConstruct.create("div", null, container);
        domClass.add(exampleDiv, "preview-example");

        var titleElem = domConstruct.create("h4", null, exampleDiv);
        titleElem.appendChild(document.createTextNode(title + " (Score: " + score + ")"));

        var riskContainer = domConstruct.create("div", null, exampleDiv);
        domClass.add(riskContainer, "riskfactor-container");

        // Determine risk level
        var lowThreshold = 30;
        var highThreshold = 70;
        var riskLevel, riskLabelText, riskIcon;

        if (score <= lowThreshold) {
            riskLevel = "low";
            riskLabelText = "Low Risk";
            riskIcon = this._getLowRiskIcon();
        } else if (score < highThreshold) {
            riskLevel = "normal";
            riskLabelText = "Normal Risk";
            riskIcon = this._getNormalRiskIcon();
        } else if (score < 90) {
            riskLevel = "high";
            riskLabelText = "High Risk";
            riskIcon = this._getHighRiskIcon();
        } else {
            riskLevel = "critical";
            riskLabelText = "Critical Risk";
            riskIcon = this._getCriticalRiskIcon();
        }

        // Create risk display
        var displayDiv = domConstruct.create("div", null, riskContainer);
        domClass.add(displayDiv, "risk-display");
        domClass.add(displayDiv, riskLevel);

        // Add icon
        var iconDiv = domConstruct.create("div", null, displayDiv);
        domClass.add(iconDiv, "risk-icon");
        domClass.add(iconDiv, iconSize);
        iconDiv.innerHTML = riskIcon;

        // Add info
        var infoDiv = domConstruct.create("div", null, displayDiv);
        domClass.add(infoDiv, "risk-info");

        var labelSpan = domConstruct.create("span", null, infoDiv);
        domClass.add(labelSpan, "risk-label");
        labelSpan.appendChild(document.createTextNode(riskLabelText));

        var scoreSpan = domConstruct.create("span", null, infoDiv);
        domClass.add(scoreSpan, "risk-score");
        scoreSpan.appendChild(document.createTextNode("Score: " + score + " / 100"));
    },

    _getLowRiskIcon: function () {
        return '<svg viewBox="0 0 32 32"><defs><linearGradient id="lowGradPrev" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.3"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.1"/></linearGradient></defs><path d="M16 3 L26 7 L26 14 C26 20 22 25 16 29 C10 25 6 20 6 14 L6 7 Z" fill="url(#lowGradPrev)" stroke="currentColor" stroke-width="1.5"/><path d="M12 16 L15 19 L21 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    },

    _getNormalRiskIcon: function () {
        return '<svg viewBox="0 0 32 32"><defs><linearGradient id="normalGradPrev" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.3"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.1"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="url(#normalGradPrev)" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><path d="M16 14 L16 23" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
    },

    _getHighRiskIcon: function () {
        return '<svg viewBox="0 0 32 32"><defs><linearGradient id="highGradPrev" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.4"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.2"/></linearGradient></defs><path d="M16 4 L28 26 L4 26 Z" fill="url(#highGradPrev)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 12 L16 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="22" r="1.5" fill="currentColor"/></svg>';
    },

    _getCriticalRiskIcon: function () {
        return '<svg viewBox="0 0 32 32"><defs><linearGradient id="criticalGradPrev" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:currentColor;stop-opacity:0.5"/><stop offset="100%" style="stop-color:currentColor;stop-opacity:0.3"/></linearGradient></defs><path d="M10 4 L22 4 L28 10 L28 22 L22 28 L10 28 L4 22 L4 10 Z" fill="url(#criticalGradPrev)" stroke="currentColor" stroke-width="2"/><path d="M11 11 L21 21 M21 11 L11 21" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes if needed
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not needed for preview
    }
};

// Made with Bob