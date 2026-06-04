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

        // Create main container
        var mainContainer = domConstruct.create("div", null, inputDiv);
        domClass.add(mainContainer, "widget_maincontentbox");

        // Create timeline container
        var timelineContainer = domConstruct.create("div", null, mainContainer);
        domClass.add(timelineContainer, "preview-timeline-container");

        // Create timeline line
        var timelineLine = domConstruct.create("div", null, timelineContainer);
        domClass.add(timelineLine, "preview-timeline-line");

        // Create activities container
        var activitiesContainer = domConstruct.create("div", null, timelineContainer);
        domClass.add(activitiesContainer, "preview-timeline-activities");

        // Sample activities data
        var sampleActivities = [
            {
                name: "Process Started",
                description: "Process instance initiated",
                timestamp: "08:00 AM",
                status: "completed"
            },
            {
                name: "Review Task",
                description: "Document review in progress",
                timestamp: "08:05 AM",
                status: "active",
                comments: [
                    {
                        author: "John Smith",
                        content: "This looks good to me",
                        published: "08:10 AM"
                    },
                    {
                        author: "Jane Doe",
                        content: "I agree, ready to proceed",
                        published: "08:15 AM"
                    }
                ]
            },
            {
                name: "Manager Approval",
                description: "Awaiting manager approval",
                timestamp: "Pending",
                status: "pending"
            }
        ];

        // Create activity items
        sampleActivities.forEach(function(activity, index) {
            // Activity container
            var activityDiv = domConstruct.create("div", null, activitiesContainer);
            domClass.add(activityDiv, "preview-activity");
            domClass.add(activityDiv, activity.status);

            // Activity marker
            var markerDiv = domConstruct.create("div", null, activityDiv);
            domClass.add(markerDiv, "preview-activity-marker");

            // Activity icon
            var iconDiv = domConstruct.create("div", null, markerDiv);
            domClass.add(iconDiv, "preview-activity-icon");
            if (activity.status === "completed") {
                domClass.add(iconDiv, "preview-icon-completed");
            } else if (activity.status === "active") {
                domClass.add(iconDiv, "preview-icon-active");
            } else {
                domClass.add(iconDiv, "preview-icon-pending");
            }

            // Activity content
            var contentDiv = domConstruct.create("div", null, activityDiv);
            domClass.add(contentDiv, "preview-activity-content");

            // Activity header
            var headerDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(headerDiv, "preview-activity-header");

            // Timestamp
            var timestampDiv = domConstruct.create("div", null, headerDiv);
            domClass.add(timestampDiv, "preview-activity-timestamp");
            timestampDiv.appendChild(document.createTextNode(activity.timestamp));

            // Status badge
            var statusDiv = domConstruct.create("div", null, headerDiv);
            domClass.add(statusDiv, "preview-activity-status");
            statusDiv.appendChild(document.createTextNode(activity.status.toUpperCase()));

            // Activity name
            var nameDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(nameDiv, "preview-activity-name");
            nameDiv.appendChild(document.createTextNode(activity.name));

            // Activity description
            var descDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(descDiv, "preview-activity-description");
            descDiv.appendChild(document.createTextNode(activity.description));

            // Comments section if present
            if (activity.comments && activity.comments.length > 0) {
                var commentsDiv = domConstruct.create("div", null, contentDiv);
                domClass.add(commentsDiv, "preview-comments");

                activity.comments.forEach(function(comment) {
                    var commentDiv = domConstruct.create("div", null, commentsDiv);
                    domClass.add(commentDiv, "preview-comment");

                    // Comment avatar
                    var avatarDiv = domConstruct.create("div", null, commentDiv);
                    domClass.add(avatarDiv, "preview-comment-avatar");
                    var initials = comment.author.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
                    avatarDiv.appendChild(document.createTextNode(initials));

                    // Comment content
                    var commentContentDiv = domConstruct.create("div", null, commentDiv);
                    domClass.add(commentContentDiv, "preview-comment-content");

                    var commentTextDiv = domConstruct.create("div", null, commentContentDiv);
                    var authorSpan = domConstruct.create("strong", null, commentTextDiv);
                    authorSpan.appendChild(document.createTextNode(comment.author + ": "));
                    commentTextDiv.appendChild(document.createTextNode(comment.content));

                    var commentTimeDiv = domConstruct.create("div", null, commentContentDiv);
                    domClass.add(commentTimeDiv, "preview-comment-time");
                    commentTimeDiv.appendChild(document.createTextNode(comment.published));
                });
            }
        });

        // Store references for updates
        this.context.coachViewData.mainContainer = mainContainer;
        this.context.coachViewData.activitiesContainer = activitiesContainer;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes
        if (propertyName === "compact" && this.context.coachViewData.mainContainer) {
            var mainContainer = this.context.coachViewData.mainContainer;
            if (propertyValue === true) {
                mainContainer.style.padding = "0.5rem";
            } else {
                mainContainer.style.padding = "1rem";
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Usually not needed for preview
    }
};

// Made with Bob