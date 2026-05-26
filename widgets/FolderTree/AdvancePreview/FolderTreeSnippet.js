/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2024-2026
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

                // Generate preview folder tree
                this.generateSampleData(domConstruct, domClass, domAttr);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass, domAttr) {
        // Create main widget container
        var widgetDiv = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(widgetDiv, "ufm-widget");
        domAttr.set(widgetDiv, "role", "region");
        domAttr.set(widgetDiv, "aria-label", "Folder Tree Manager");

        // Create main container
        var containerDiv = domConstruct.create("div", null, widgetDiv);
        domClass.add(containerDiv, "ufm-container");

        // Create files panel
        var filesPanel = domConstruct.create("div", null, containerDiv);
        domClass.add(filesPanel, "ufm-files-panel");
        domAttr.set(filesPanel, "role", "main");
        domAttr.set(filesPanel, "aria-label", "Files and folders");

        // Files header
        var filesHeader = domConstruct.create("div", null, filesPanel);
        domClass.add(filesHeader, "ufm-files-header");

        var filesTitle = domConstruct.create("h2", null, filesHeader);
        domClass.add(filesTitle, "ufm-files-title");
        filesTitle.textContent = "Uploaded files";

        var refreshBtn = domConstruct.create("button", null, filesHeader);
        domClass.add(refreshBtn, "ufm-refresh-btn");
        domAttr.set(refreshBtn, "type", "button");
        domAttr.set(refreshBtn, "aria-label", "Refresh file list");
        domAttr.set(refreshBtn, "title", "Refresh");

        var refreshIcon = domConstruct.create("span", null, refreshBtn);
        domClass.add(refreshIcon, "ufm-refresh-icon");
        domAttr.set(refreshIcon, "aria-hidden", "true");
        refreshIcon.textContent = "↻";

        // Selection controls
        var selectionControls = domConstruct.create("div", null, filesPanel);
        domClass.add(selectionControls, "ufm-selection-controls");

        var selectAllBtn = domConstruct.create("button", null, selectionControls);
        domClass.add(selectAllBtn, "ufm-select-all-btn");
        domAttr.set(selectAllBtn, "type", "button");
        domAttr.set(selectAllBtn, "aria-label", "Select all files");
        selectAllBtn.textContent = "Select all";

        var separator = domConstruct.create("span", null, selectionControls);
        domClass.add(separator, "ufm-separator");
        separator.textContent = "/";

        var unselectAllBtn = domConstruct.create("button", null, selectionControls);
        domClass.add(unselectAllBtn, "ufm-unselect-all-btn");
        domAttr.set(unselectAllBtn, "type", "button");
        domAttr.set(unselectAllBtn, "aria-label", "Unselect all files");
        unselectAllBtn.textContent = "Unselect all";

        var fileCount = domConstruct.create("span", null, selectionControls);
        domClass.add(fileCount, "ufm-file-count");
        domAttr.set(fileCount, "role", "status");
        domAttr.set(fileCount, "aria-live", "polite");
        fileCount.textContent = "Sample files";

        // Files list
        var filesList = domConstruct.create("div", null, filesPanel);
        domClass.add(filesList, "ufm-files-list");
        domAttr.set(filesList, "role", "list");
        domAttr.set(filesList, "aria-label", "Files and folders");

        // Sample file items
        var sampleFiles = [
            { name: "📁 Documents", indent: 0 },
            { name: "📄 Report.pdf", indent: 20 },
            { name: "📄 Summary.docx", indent: 20 },
            { name: "📁 Images", indent: 0 },
            { name: "🖼️ Photo1.jpg", indent: 20 }
        ];

        for (var i = 0; i < sampleFiles.length; i++) {
            var file = sampleFiles[i];
            var fileItem = domConstruct.create("div", null, filesList);
            domClass.add(fileItem, "ufm-file-item");
            domAttr.set(fileItem, "role", "listitem");
            if (file.indent > 0) {
                fileItem.style.marginLeft = file.indent + "px";
            }

            var checkbox = domConstruct.create("input", null, fileItem);
            domAttr.set(checkbox, "type", "checkbox");
            domAttr.set(checkbox, "aria-label", "Select " + (file.name.includes("📁") ? "folder" : "file"));

            var fileName = domConstruct.create("span", null, fileItem);
            fileName.textContent = file.name;
        }
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes in preview
        if (propertyName === "showSelectionControls") {
            var controls = this.context.coachViewData.inputDiv.querySelector(".ufm-selection-controls");
            if (controls) {
                controls.style.display = propertyValue ? "flex" : "none";
            }
        } else if (propertyName === "showFileCount") {
            var fileCount = this.context.coachViewData.inputDiv.querySelector(".ufm-file-count");
            if (fileCount) {
                fileCount.style.display = propertyValue ? "inline" : "none";
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob