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

                var formGroupDiv = domConstruct.create("div", null, containingDiv);
                domClass.add(formGroupDiv, "form-group");
                this.context.coachViewData.formGroupDiv = formGroupDiv;

                var label = domConstruct.create("span", null, formGroupDiv);
                domClass.add(label, "control-label");
                label.appendChild(document.createTextNode(labelText));
                this.context.coachViewData.label = label;

                var inputDiv = domConstruct.create("div", null, formGroupDiv);
                domClass.add(inputDiv, "input");
                this.context.coachViewData.inputDiv = inputDiv;

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

        var mainContainer = domConstruct.create("div", null, inputDiv);
        domClass.add(mainContainer, "widget_maincontentbox");

        var timelineContainer = domConstruct.create("div", null, mainContainer);
        domClass.add(timelineContainer, "preview-timeline-container");

        var timelineLine = domConstruct.create("div", null, timelineContainer);
        domClass.add(timelineLine, "preview-timeline-line");

        var activitiesContainer = domConstruct.create("div", null, timelineContainer);
        domClass.add(activitiesContainer, "preview-timeline-activities");

        var sampleActivities = [
            {
                name: "Process Started",
                description: "Process instance initiated",
                timestamp: "08:00 AM",
                status: "completed",
                assignee: "System"
            },
            {
                name: "Review Task",
                description: "Document review in progress",
                timestamp: "08:05 AM",
                status: "active",
                assignee: "cpmanager",
                avatarType: "image",
                comments: [
                    {
                        author: "John Smith",
                        content: "This looks good to me",
                        published: "08:10 AM",
                        avatarType: "initials"
                    },
                    {
                        author: "Jane Doe",
                        content: "I agree, ready to proceed",
                        published: "08:15 AM",
                        avatarType: "image"
                    }
                ]
            },
            {
                name: "Manager Approval",
                description: "Awaiting manager approval",
                timestamp: "Pending",
                status: "pending",
                assignee: "Finance Team"
            }
        ];

        sampleActivities.forEach(function (activity) {
            var activityDiv = domConstruct.create("div", null, activitiesContainer);
            domClass.add(activityDiv, "preview-activity");
            domClass.add(activityDiv, activity.status);

            var markerDiv = domConstruct.create("div", null, activityDiv);
            domClass.add(markerDiv, "preview-activity-marker");

            var iconDiv = domConstruct.create("div", null, markerDiv);
            domClass.add(iconDiv, "preview-activity-icon");
            if (activity.status === "completed") {
                domClass.add(iconDiv, "preview-icon-completed");
            } else if (activity.status === "active") {
                domClass.add(iconDiv, "preview-icon-active");
            } else {
                domClass.add(iconDiv, "preview-icon-pending");
            }

            var contentDiv = domConstruct.create("div", null, activityDiv);
            domClass.add(contentDiv, "preview-activity-content");

            var headerDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(headerDiv, "preview-activity-header");

            var headerLeftDiv = domConstruct.create("div", null, headerDiv);
            domClass.add(headerLeftDiv, "preview-activity-header-left");

            var nameDiv = domConstruct.create("div", null, headerLeftDiv);
            domClass.add(nameDiv, "preview-activity-name");
            nameDiv.appendChild(document.createTextNode(activity.name));

            if (activity.assignee) {
                var userInfoDiv = domConstruct.create("div", null, headerLeftDiv);
                domClass.add(userInfoDiv, "preview-user-info");

                var userAvatarDiv = domConstruct.create("div", null, userInfoDiv);
                domClass.add(userAvatarDiv, "preview-user-avatar");

                if (activity.avatarType === "image") {
                    domClass.add(userAvatarDiv, "has-image");
                    userAvatarDiv.style.backgroundImage = "url('data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%2216%22 fill=%22%23d0e2ff%22/%3E%3Ccircle cx=%2216%22 cy=%2212%22 r=%226%22 fill=%22%230f62fe%22/%3E%3Cpath d=%22M8 27c1.8-4.6 5.1-7 8-7s6.2 2.4 8 7%22 fill=%22%230f62fe%22/%3E%3C/svg%3E')";
                } else {
                    userAvatarDiv.appendChild(document.createTextNode(this.getInitials(activity.assignee)));
                }

                var userNameDiv = domConstruct.create("div", null, userInfoDiv);
                domClass.add(userNameDiv, "preview-user-name");
                userNameDiv.appendChild(document.createTextNode(activity.assignee));
            }

            var statusDiv = domConstruct.create("div", null, headerDiv);
            domClass.add(statusDiv, "preview-activity-status");
            statusDiv.appendChild(document.createTextNode(activity.status.toUpperCase()));

            var timestampDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(timestampDiv, "preview-activity-timestamp");
            timestampDiv.appendChild(document.createTextNode(activity.timestamp));

            var descDiv = domConstruct.create("div", null, contentDiv);
            domClass.add(descDiv, "preview-activity-description");
            descDiv.appendChild(document.createTextNode(activity.description));

            if (activity.comments && activity.comments.length > 0) {
                var commentsDiv = domConstruct.create("div", null, contentDiv);
                domClass.add(commentsDiv, "preview-comments");

                activity.comments.forEach(this.lang.hitch(this, function (comment) {
                    var commentDiv = domConstruct.create("div", null, commentsDiv);
                    domClass.add(commentDiv, "preview-comment");

                    var avatarDiv = domConstruct.create("div", null, commentDiv);
                    domClass.add(avatarDiv, "preview-comment-avatar");

                    if (comment.avatarType === "image") {
                        domClass.add(avatarDiv, "has-image");
                        avatarDiv.style.backgroundImage = "url('data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%2216%22 fill=%22%23d9fbfb%22/%3E%3Ccircle cx=%2216%22 cy=%2212%22 r=%226%22 fill=%22%23009999%22/%3E%3Cpath d=%22M8 27c1.8-4.6 5.1-7 8-7s6.2 2.4 8 7%22 fill=%22%23009999%22/%3E%3C/svg%3E')";
                    } else {
                        avatarDiv.appendChild(document.createTextNode(this.getInitials(comment.author)));
                    }

                    var commentContentDiv = domConstruct.create("div", null, commentDiv);
                    domClass.add(commentContentDiv, "preview-comment-content");

                    var commentTextDiv = domConstruct.create("div", null, commentContentDiv);
                    var authorSpan = domConstruct.create("strong", null, commentTextDiv);
                    authorSpan.appendChild(document.createTextNode(comment.author + ": "));
                    commentTextDiv.appendChild(document.createTextNode(comment.content));

                    var commentTimeDiv = domConstruct.create("div", null, commentContentDiv);
                    domClass.add(commentTimeDiv, "preview-comment-time");
                    commentTimeDiv.appendChild(document.createTextNode(comment.published));
                }));
            }
        }, this);

        this.context.coachViewData.mainContainer = mainContainer;
        this.context.coachViewData.activitiesContainer = activitiesContainer;
    },

    getInitials: function (name) {
        if (!name) {
            return "?";
        }

        var parts = String(name).replace(/\s+/g, " ").trim().split(" ");
        var initials = parts.map(function (part) {
            return part.charAt(0);
        }).join("").substring(0, 2).toUpperCase();

        return initials || "?";
    },

    propertyChanged: function (propertyName, propertyValue) {
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
    }
};

// Made with Bob