/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2026
 *
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

                // Generate preview progress circle
                this.generateSampleData(domConstruct, domAttr, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domAttr, domClass) {
        // Example progress value (65%)
        var value = 65;
        var minValue = 0;
        var maxValue = 100;
        var postParameter = "%";

        // Create container
        var container = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(container, "process-circle-container");
        this.context.coachViewData.container = container;

        // Create progress circle
        var progressCircle = domConstruct.create("div", null, container);
        domClass.add(progressCircle, "process-circle");
        this.context.coachViewData.progressCircle = progressCircle;

        // Set ARIA attributes
        domAttr.set(progressCircle, {
            "role": "progressbar",
            "aria-label": "Progress indicator",
            "aria-valuemin": minValue,
            "aria-valuemax": maxValue,
            "aria-valuenow": value,
            "data-post": postParameter
        });

        // Set CSS custom properties
        progressCircle.style.setProperty("--value", value);
        progressCircle.style.setProperty("--min", minValue);
        progressCircle.style.setProperty("--max", maxValue);
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle configuration option changes
        if (!this.context.coachViewData.progressCircle) {
            return;
        }

        var progressCircle = this.context.coachViewData.progressCircle;

        switch (propertyName) {
            case "MinValue":
                progressCircle.setAttribute("aria-valuemin", propertyValue);
                progressCircle.style.setProperty("--min", propertyValue);
                break;
            case "MaxValue":
                progressCircle.setAttribute("aria-valuemax", propertyValue);
                progressCircle.style.setProperty("--max", propertyValue);
                break;
            case "postParameter":
                progressCircle.setAttribute("data-post", propertyValue);
                break;
            case "CircleSize":
                progressCircle.style.setProperty("--circle-size", propertyValue);
                break;
            case "RingThickness":
                progressCircle.style.setProperty("--size", propertyValue);
                break;
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Handle data binding changes
        if (propertyName === "ProgressValue" && this.context.coachViewData.progressCircle) {
            var progressCircle = this.context.coachViewData.progressCircle;
            progressCircle.setAttribute("aria-valuenow", propertyValue);
            progressCircle.style.setProperty("--value", propertyValue);
        }
    }
};

// Made with Bob
