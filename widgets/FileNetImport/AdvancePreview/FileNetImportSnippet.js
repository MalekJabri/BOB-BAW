/*************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-I23
 * Copyright IBM Corp. 2019, 2020. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *************************************************************************/
/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * Copyright IBM Corp. 2019 - 2022. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *
 * #END COPYRIGHT
 */

// ── Sample data for the designer preview ────────────────────
var PREVIEW_QUEUE = [
  { type: "file",   name: "annual-report.pdf",    path: "",                    size: "1.2 MB",  status: "success" },
  { type: "file",   name: "contract.docx",         path: "",                    size: "340 KB",  status: "success" },
  { type: "file",   name: "architecture.png",      path: "ProjectA/diagrams",   size: "820 KB",  status: "pending" },
  { type: "file",   name: "spec.pdf",              path: "ProjectA/docs",       size: "2.1 MB",  status: "pending" },
  { type: "file",   name: "README.md",             path: "ProjectA",            size: "4 KB",    status: "error"   }
];

var PREVIEW_LOG = [
  { type: "success", msg: "✓ Imported: annual-report.pdf (ID: {C3D4E5F6-...})" },
  { type: "success", msg: "✓ Imported: contract.docx (ID: {D4E5F6A7-...})" },
  { type: "info",    msg: "ℹ Created folder: ProjectA" },
  { type: "info",    msg: "ℹ Created folder: ProjectA/docs" },
  { type: "info",    msg: "ℹ Created folder: ProjectA/diagrams" },
  { type: "error",   msg: "✗ Failed: ProjectA/README.md — Unsupported content type" }
];

var mixObject = {

  createPreview: function(containingDiv, labelText, callback) {
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
      ], this.lang.hitch(this, function(domConstruct, domClass, domAttr, bpmext) {

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
        this.generateSampleData(domConstruct, domClass, domAttr);

        callback();
      }));
    }));
  },

  getLabelDomElement: function() {
    return this.context.coachViewData.label;
  },

  generateSampleData: function(domConstruct, domClass, domAttr) {
    // Create main widget container
    var widgetDiv = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
    domClass.add(widgetDiv, "fnimport-preview-wrap");

    // Drop Zone
    var dropzone = domConstruct.create("div", null, widgetDiv);
    domClass.add(dropzone, "fnimport-preview-dropzone");

    var dropzoneIcon = domConstruct.create("div", null, dropzone);
    domClass.add(dropzoneIcon, "fnimport-preview-dropzone-icon");

    var dropzoneTitle = domConstruct.create("p", null, dropzone);
    domClass.add(dropzoneTitle, "fnimport-preview-dropzone-title");
    dropzoneTitle.textContent = "Drop files or folders here";

    var dropzoneSubtitle = domConstruct.create("p", null, dropzone);
    domClass.add(dropzoneSubtitle, "fnimport-preview-dropzone-subtitle");
    dropzoneSubtitle.textContent = "Drag and drop documents or entire folder structures. Subfolders will be preserved.";

    var browseBtn = domConstruct.create("button", { type: "button" }, dropzone);
    domClass.add(browseBtn, "fnimport-preview-browse-btn");
    browseBtn.textContent = "Browse files";

    // Queue container
    var queueDiv = domConstruct.create("div", null, widgetDiv);
    domClass.add(queueDiv, "fnimport-preview-queue");
    this.context.coachViewData.queueDiv = queueDiv;

    // Build preview queue
    this._buildPreviewQueue(domConstruct, queueDiv);

    // Action bar
    var actionsDiv = domConstruct.create("div", null, widgetDiv);
    domClass.add(actionsDiv, "fnimport-preview-actions");

    var importBtn = domConstruct.create("button", { type: "button" }, actionsDiv);
    domClass.add(importBtn, "fnimport-preview-btn-import");
    importBtn.textContent = "↑ Import to FileNet";

    var clearBtn = domConstruct.create("button", { type: "button" }, actionsDiv);
    domClass.add(clearBtn, "fnimport-preview-btn-clear");
    clearBtn.textContent = "Clear all";

    // Log container
    var logDiv = domConstruct.create("div", null, widgetDiv);
    domClass.add(logDiv, "fnimport-preview-log");
    this.context.coachViewData.logDiv = logDiv;

    // Build preview log
    this._buildPreviewLog(domConstruct, logDiv);

    // Config hint
    var hintDiv = domConstruct.create("div", null, widgetDiv);
    domClass.add(hintDiv, "fnimport-preview-config-hint");
    hintDiv.innerHTML = "⚙ Configure <strong>graphqlEndpoint</strong> and <strong>parentFolderId</strong> in the widget properties panel.";
    this.context.coachViewData.hintDiv = hintDiv;
  },

  // ── Build sample queue items ─────────────────────────────
  _buildPreviewQueue: function(domConstruct, queueEl) {
    var self = this;

    // Group by top-level folder
    var groups  = {};
    var rootFiles = [];

    PREVIEW_QUEUE.forEach(function(item) {
      if (item.path) {
        var top = item.path.split("/")[0];
        if (!groups[top]) groups[top] = [];
        groups[top].push(item);
      } else {
        rootFiles.push(item);
      }
    });

    // Root-level files
    rootFiles.forEach(function(item) {
      self._appendQueueItem(domConstruct, queueEl, item);
    });

    // Grouped folders
    Object.keys(groups).forEach(function(folderName) {
      var header = domConstruct.create("div", {
        className: "fnimport-preview-folder-header"
      }, queueEl);
      header.textContent = "📁 " + folderName + " (" + groups[folderName].length + " files)";

      groups[folderName].forEach(function(item) {
        self._appendQueueItem(domConstruct, queueEl, item);
      });
    });
  },

  _appendQueueItem: function(domConstruct, queueEl, item) {
    var row = domConstruct.create("div", {
      className: "fnimport-preview-queue-item"
    }, queueEl);

    // Icon
    var iconClass = item.type === "folder"
      ? "fnimport-preview-item-icon fnimport-preview-icon-folder"
      : "fnimport-preview-item-icon fnimport-preview-icon-document";
    domConstruct.create("span", { className: iconClass }, row);

    // Path info
    var pathDiv = domConstruct.create("div", { className: "fnimport-preview-item-path" }, row);
    if (item.path) {
      var prefix = domConstruct.create("span", {
        className: "fnimport-preview-item-folder-prefix"
      }, pathDiv);
      prefix.textContent = "📁 " + item.path;
    }
    var nameSpan = domConstruct.create("span", {
      className: "fnimport-preview-item-name"
    }, pathDiv);
    nameSpan.textContent = item.name;

    // Size
    var sizeSpan = domConstruct.create("span", {
      className: "fnimport-preview-item-size"
    }, row);
    sizeSpan.textContent = item.size;

    // Status badge
    var badgeClass = "fnimport-preview-badge fnimport-preview-badge-" + item.status;
    var badge = domConstruct.create("span", { className: badgeClass }, row);
    var badgeLabels = { pending: "Pending", success: "✓ Done", error: "✗ Failed" };
    badge.textContent = badgeLabels[item.status] || item.status;
  },

  // ── Build sample log entries ─────────────────────────────
  _buildPreviewLog: function(domConstruct, logEl) {
    PREVIEW_LOG.forEach(function(entry) {
      var row = domConstruct.create("div", {
        className: "fnimport-preview-log-entry fnimport-preview-log-" + entry.type
      }, logEl);
      row.textContent = entry.msg;
    });
  },

  getLabelDomElement: function() {
    return this.context.coachViewData.label;
  },

  propertyChanged: function(propertyName, propertyValue) {
    // Handle config option changes in preview
    if (propertyName === "graphqlEndpoint" || propertyName === "parentFolderId") {
      var hint = this.context.coachViewData.hintDiv;
      if (hint) {
        hint.style.display = (propertyValue && propertyValue.length > 0) ? "none" : "block";
      }
    }
  },

  modelChanged: function(propertyName, propertyValue) {
    // Not required for preview
  }
};

// Made with Bob