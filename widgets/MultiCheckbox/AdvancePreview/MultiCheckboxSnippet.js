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

                // Generate preview content
                this.generateSampleData(domConstruct, domAttr, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domAttr, domClass) {
        var inputDiv = this.context.coachViewData.inputDiv;
        
        // Create checkbox group container
        var checkboxGroup = domConstruct.create("div", null, inputDiv);
        domClass.add(checkboxGroup, "preview-checkbox-group");
        
        // Sample checkbox options
        var sampleOptions = [
            { value: "option1", name: "Option 1", checked: true },
            { value: "option2", name: "Option 2", checked: false },
            { value: "option3", name: "Option 3", checked: true },
            { value: "option4", name: "Option 4", checked: false }
        ];
        
        // Create checkbox items
        sampleOptions.forEach(function(option) {
            var checkboxItem = domConstruct.create("div", null, checkboxGroup);
            domClass.add(checkboxItem, "preview-checkbox-item");
            
            // Checkbox visual
            var checkbox = domConstruct.create("div", null, checkboxItem);
            domClass.add(checkbox, "preview-checkbox");
            
            if (option.checked) {
                // Add checkmark SVG for checked items
                checkbox.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 11.7L3.3 8.5l.7-.7 2.5 2.5 5.2-5.2.7.7z"/></svg>';
            } else {
                // Empty checkbox for unchecked items
                domAttr.set(checkbox, "style", "background-color: transparent; border: 1px solid #8d8d8d;");
            }
            
            // Label
            var labelSpan = domConstruct.create("span", null, checkboxItem);
            domClass.add(labelSpan, "preview-checkbox-label");
            labelSpan.appendChild(document.createTextNode(option.name));
        });
        
        // Store reference for updates
        this.context.coachViewData.checkboxGroup = checkboxGroup;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes
        if (propertyName === "layout" && this.context.coachViewData.checkboxGroup) {
            var checkboxGroup = this.context.coachViewData.checkboxGroup;
            if (propertyValue === "horizontal") {
                checkboxGroup.style.flexDirection = "row";
                checkboxGroup.style.flexWrap = "wrap";
            } else {
                checkboxGroup.style.flexDirection = "column";
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Usually not needed for preview
    }
};

// Made with Bob