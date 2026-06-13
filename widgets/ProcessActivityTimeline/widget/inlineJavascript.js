// ProcessActivityTimeline Widget - Main JavaScript
// Specialized for BAW process activity tracking with automatic data fetching

var processInstanceId = this.getOption("processInstanceId") || this.context.bpm.system.instanceId;
var baseUrl = this.getOption("baseUrl") || "";
var showTimestamps = this.getOption("showTimestamps") !== false;
var showIcons = this.getOption("showIcons") !== false;
var showDetails = this.getOption("showDetails") !== false;
var compact = this.getOption("compact") || false;
var clickable = this.getOption("clickable") || false;

this.registerEventHandlingFunction(this, "activityClicked", "index");

var timelineContainer = this.context.element.querySelector(".processactivitytimeline_maincontentbox");
var timelineActivities = timelineContainer.querySelector(".timeline-activities");

if (compact) {
	timelineContainer.classList.add("compact");
} else {
	timelineContainer.classList.remove("compact");
}

timelineActivities.innerHTML = "";

var widgetContext = this;
var avatarCache = {};

function formatTimestamp(timestampValue) {
	if (!timestampValue) {
		return "";
	}

	try {
		var date;
		if (timestampValue instanceof Date) {
			date = timestampValue;
		} else if (typeof timestampValue === "string") {
			date = new Date(timestampValue);
		} else {
			return timestampValue.toString();
		}

		return date.toLocaleString();
	} catch (e) {
		return timestampValue.toString();
	}
}

function formatDuration(durationMs) {
	if (!durationMs || durationMs <= 0) {
		return "";
	}

	var seconds = Math.floor(durationMs / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);

	if (days > 0) {
		return days + "d " + (hours % 24) + "h";
	}
	if (hours > 0) {
		return hours + "h " + (minutes % 60) + "m";
	}
	if (minutes > 0) {
		return minutes + "m " + (seconds % 60) + "s";
	}
	return seconds + "s";
}

function getStatusText(status) {
	var statusMap = {
		completed: "Completed",
		active: "Active",
		pending: "Pending",
		failed: "Failed",
		skipped: "Skipped",
		waiting: "Waiting"
	};
	return statusMap[status] || status || "Pending";
}

function getApiBaseUrl() {
	if (baseUrl) {
		return baseUrl;
	}
	return window.location.protocol + "//" + window.location.host;
}

function escapeHtml(value) {
	if (value === null || value === undefined) {
		return "";
	}

	return String(value)
		.replace(/&/g, "&")
		.replace(/</g, "<")
		.replace(/>/g, ">");
}

function getInitials(name) {
	if (!name) {
		return "?";
	}

	var parts = String(name).replace(/\s+/g, " ").trim().split(" ");
	var initials = parts.map(function (part) {
		return part.charAt(0);
	}).join("").substring(0, 2).toUpperCase();

	return initials || "?";
}

function normalizeAvatarImage(imageValue, imageFormat) {
	if (!imageValue) {
		return "";
	}

	if (imageValue.indexOf("data:image/") === 0) {
		return imageValue;
	}

	return "data:image/" + (imageFormat || "png") + ";base64," + imageValue;
}

function applyAvatarToElement(avatarElement, displayName, avatarImage, imageFormat) {
	if (!avatarElement) {
		return;
	}

	var safeName = displayName || "User";
	avatarElement.classList.remove("has-image");
	avatarElement.style.backgroundImage = "";
	avatarElement.textContent = getInitials(safeName);
	avatarElement.setAttribute("aria-label", safeName);

	if (avatarImage) {
		avatarElement.classList.add("has-image");
		avatarElement.style.backgroundImage = "url('" + normalizeAvatarImage(avatarImage, imageFormat) + "')";
		avatarElement.textContent = "";
	}
}

function fetchUserAvatar(userName, callback) {
	if (!userName || userName === "System") {
		callback(null);
		return;
	}

	if (avatarCache.hasOwnProperty(userName)) {
		callback(avatarCache[userName]);
		return;
	}

	var apiUrl = getApiBaseUrl() + "/bas/rest/bpm/wle/v1/avatar/" + encodeURIComponent(userName);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", apiUrl, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.withCredentials = true;

	xhr.onload = function () {
		var avatarData = null;

		if (xhr.status >= 200 && xhr.status < 300) {
			try {
				var response = JSON.parse(xhr.responseText);
				var payload = response && response.data ? response.data : response;

				if (payload && payload.userAvatarImage) {
					avatarData = {
						userName: payload.userName || userName,
						userAvatarImage: payload.userAvatarImage,
						userAvatarKey: payload.userAvatarKey || "",
						userUpdateTimestamp: payload.userUpdateTimestamp || "",
						imageFormat: payload.imageFormat || "png",
						isDefault: payload.isDefault
					};
				}
			} catch (e) {
				console.warn("Unable to parse avatar response for user:", userName, e);
			}
		}

		avatarCache[userName] = avatarData;
		callback(avatarData);
	};

	xhr.onerror = function () {
		avatarCache[userName] = null;
		callback(null);
	};

	xhr.send();
}

function hydrateAvatarElement(avatarElement, displayName, explicitAvatarImage, explicitImageFormat) {
	applyAvatarToElement(avatarElement, displayName, explicitAvatarImage, explicitImageFormat);

	if (explicitAvatarImage || !displayName || displayName === "System") {
		return;
	}

	fetchUserAvatar(displayName, function (avatarData) {
		if (avatarData && avatarData.userAvatarImage) {
			applyAvatarToElement(
				avatarElement,
				avatarData.userName || displayName,
				avatarData.userAvatarImage,
				avatarData.imageFormat
			);
		}
	});
}

function mapStreamEventToActivity(event) {
	var activityName = "Activity";
	if (event.object && event.object.displayName) {
		activityName = event.object.displayName;
	}

	var assignee = "System";
	if (event.actor && event.actor.displayName) {
		assignee = event.actor.displayName;
	}

	var description = "";
	if (event.content) {
		description = event.content.replace(/<[^>]*>/g, "").trim();
	}

	var activity = {
		name: activityName,
		description: description,
		startTime: event.published || new Date(),
		status: "completed",
		assignee: assignee
	};

	var contentLower = (event.content || "").toLowerCase();
	var verb = (event.verb || "").toLowerCase();

	if (contentLower.indexOf("completed") >= 0 || contentLower.indexOf("complete") >= 0) {
		activity.status = "completed";
	} else if (contentLower.indexOf("started") >= 0 || contentLower.indexOf("work started") >= 0 || verb.indexOf("start") >= 0) {
		activity.status = "active";
	} else if (contentLower.indexOf("created") >= 0 || contentLower.indexOf("claimed") >= 0) {
		activity.status = "pending";
	} else if (contentLower.indexOf("failed") >= 0 || contentLower.indexOf("error") >= 0) {
		activity.status = "failed";
	} else if (contentLower.indexOf("skipped") >= 0) {
		activity.status = "skipped";
	} else if (contentLower.indexOf("waiting") >= 0 || contentLower.indexOf("awaiting") >= 0) {
		activity.status = "waiting";
	}

	if (event.object && event.object.id) {
		if (event.object.objectType === "ibm.bpm.task") {
			activity.taskId = event.object.id;
		} else if (event.object.objectType === "ibm.bpm.instance") {
			activity.instanceId = event.object.id;
		}
	}

	if (event.replies && event.replies.items && Array.isArray(event.replies.items)) {
		activity.comments = event.replies.items.map(function (reply) {
			return {
				author: reply.author ? (reply.author.displayName || "Unknown") : "Unknown",
				content: reply.content || "",
				published: reply.published || "",
				id: reply.id || ""
			};
		});
	}

	return activity;
}

function groupActivitiesByTask(activities) {
	var taskGroups = {};
	var processActivities = [];

	activities.forEach(function (activity) {
		if (activity.taskId) {
			if (!taskGroups[activity.taskId]) {
				taskGroups[activity.taskId] = [];
			}
			taskGroups[activity.taskId].push(activity);
		} else {
			activity.isProcessEvent = true;
			processActivities.push(activity);
		}
	});

	var result = [];

	processActivities.forEach(function (activity) {
		result.push(activity);
	});

	Object.keys(taskGroups).forEach(function (taskId) {
		var taskEvents = taskGroups[taskId];

		taskEvents.sort(function (a, b) {
			var timeA = new Date(a.startTime || a.timestamp);
			var timeB = new Date(b.startTime || b.timestamp);
			return timeA - timeB;
		});

		var mainActivity = taskEvents[taskEvents.length - 1];
		mainActivity.isTaskEvent = true;
		mainActivity.subEvents = taskEvents.slice(0, -1);

		result.push(mainActivity);
	});

	result.sort(function (a, b) {
		var timeA = new Date(a.startTime || a.timestamp);
		var timeB = new Date(b.startTime || b.timestamp);
		return timeB - timeA;
	});

	return result;
}

function fetchProcessActivityData(instanceId, callback) {
	var apiUrl = getApiBaseUrl() + "/bas/rest/bpm/wle/v1/social/instance/" + instanceId + "/stream";
	var xhr = new XMLHttpRequest();

	xhr.open("GET", apiUrl, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.withCredentials = true;

	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			try {
				var response = JSON.parse(xhr.responseText);
				var activities = [];

				if (response.items && Array.isArray(response.items)) {
					activities = response.items.map(mapStreamEventToActivity);
				} else if (response.data && response.data.items) {
					activities = response.data.items.map(mapStreamEventToActivity);
				} else if (response.data && response.data.stream) {
					activities = response.data.stream.map(mapStreamEventToActivity);
				} else if (response.stream) {
					activities = response.stream.map(mapStreamEventToActivity);
				} else if (Array.isArray(response)) {
					activities = response.map(mapStreamEventToActivity);
				}

				callback(null, groupActivitiesByTask(activities));
			} catch (e) {
				callback(e, null);
			}
		} else {
			callback(new Error("API request failed: " + xhr.status), null);
		}
	};

	xhr.onerror = function () {
		callback(new Error("Network error"), null);
	};

	xhr.send();
}

function submitComment(taskId, message, callback) {
	var apiUrl = getApiBaseUrl() + "/bas/rest/bpm/wle/v1/social/task/" + taskId + "/comment?message=" + encodeURIComponent(message);
	var xhr = new XMLHttpRequest();

	xhr.open("POST", apiUrl, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.withCredentials = true;

	xhr.onload = function () {
		callback(xhr.status >= 200 && xhr.status < 300);
	};

	xhr.onerror = function () {
		callback(false);
	};

	xhr.send();
}

function createActivityItem(activity, index) {
	var div = document.createElement("div");
	div.className = "timeline-item timeline-activity";

	var status = activity.status || "pending";
	div.classList.add(status);

	if (activity.isTaskEvent) {
		div.classList.add("task-event");
	} else if (activity.isProcessEvent) {
		div.classList.add("process-event");
	}

	if (activity.subEvents && activity.subEvents.length > 0) {
		div.classList.add("has-drilldown");
	}

	var marker = document.createElement("div");
	marker.className = "timeline-marker activity-marker";

	if (showIcons) {
		if (status === "completed") {
			marker.textContent = "✓";
			div.classList.add("milestone");
		} else if (status === "active") {
			marker.textContent = "!";
			div.classList.add("critical");
		} else if (status === "failed") {
			marker.textContent = "✗";
		} else if (status === "waiting") {
			marker.textContent = "⏱";
		} else {
			marker.textContent = String(index + 1);
		}
	} else {
		marker.textContent = String(index + 1);
	}

	div.appendChild(marker);

	var contentDiv = document.createElement("div");
	contentDiv.className = "timeline-content activity-content";

	var headerDiv = document.createElement("div");
	headerDiv.className = "timeline-header activity-header";

	var headerLeft = document.createElement("div");

	var nameDiv = document.createElement("div");
	nameDiv.className = "activity-name";
	nameDiv.textContent = activity.name || activity.activityName || ("Activity " + (index + 1));
	headerLeft.appendChild(nameDiv);

	if (activity.assignee) {
		var userInfoDiv = document.createElement("div");
		userInfoDiv.className = "user-info";

		var avatarDiv = document.createElement("div");
		avatarDiv.className = "user-avatar";
		hydrateAvatarElement(avatarDiv, activity.assignee, activity.assigneeAvatarImage, activity.assigneeAvatarFormat);
		userInfoDiv.appendChild(avatarDiv);

		var userDetailsDiv = document.createElement("div");

		var userNameDiv = document.createElement("div");
		userNameDiv.className = "user-name";
		userNameDiv.textContent = activity.assignee;
		userDetailsDiv.appendChild(userNameDiv);

		if (showTimestamps && (activity.startTime || activity.timestamp)) {
			var timestampDiv = document.createElement("div");
			timestampDiv.className = "timestamp activity-timestamp";
			timestampDiv.textContent = formatTimestamp(activity.startTime || activity.timestamp);
			userDetailsDiv.appendChild(timestampDiv);
		}

		userInfoDiv.appendChild(userDetailsDiv);
		headerLeft.appendChild(userInfoDiv);
	}

	headerDiv.appendChild(headerLeft);

	var statusDiv = document.createElement("div");
	statusDiv.className = "tag activity-status";
	statusDiv.textContent = getStatusText(status);
	headerDiv.appendChild(statusDiv);

	contentDiv.appendChild(headerDiv);

	if (activity.description) {
		var descDiv = document.createElement("div");
		descDiv.className = "activity-description";
		descDiv.textContent = activity.description;
		contentDiv.appendChild(descDiv);
	}

	if (showDetails) {
		var metaItems = [];

		if (activity.duration) {
			metaItems.push("Duration: " + formatDuration(activity.duration));
		}
		if (activity.taskId) {
			metaItems.push("Task ID: " + activity.taskId);
		}
		if (activity.instanceId) {
			metaItems.push("Instance ID: " + activity.instanceId);
		}

		if (metaItems.length > 0) {
			var metaDiv = document.createElement("div");
			metaDiv.className = "activity-meta";
			metaDiv.textContent = metaItems.join(" • ");
			contentDiv.appendChild(metaDiv);
		}
	}

	var commentsDiv = document.createElement("div");
	commentsDiv.className = "timeline-comments";

	if (activity.comments && activity.comments.length > 0) {
		activity.comments.forEach(function (comment) {
			var commentDiv = document.createElement("div");
			commentDiv.className = "timeline-comment";

			var commentAvatarDiv = document.createElement("div");
			commentAvatarDiv.className = "user-avatar";
			hydrateAvatarElement(commentAvatarDiv, comment.author, comment.authorAvatarImage, comment.authorAvatarFormat);
			commentDiv.appendChild(commentAvatarDiv);

			var commentContentDiv = document.createElement("div");
			commentContentDiv.className = "comment-content";

			var commentText = document.createElement("div");
			commentText.innerHTML = "<strong>" + escapeHtml(comment.author) + ":</strong> " + escapeHtml(comment.content);
			commentContentDiv.appendChild(commentText);

			if (comment.published) {
				var commentTime = document.createElement("div");
				commentTime.className = "timestamp";
				commentTime.textContent = formatTimestamp(comment.published);
				commentContentDiv.appendChild(commentTime);
			}

			commentDiv.appendChild(commentContentDiv);
			commentsDiv.appendChild(commentDiv);
		});
	}

	if (activity.taskId) {
		var commentInputDiv = document.createElement("div");
		commentInputDiv.className = "comment-input-container";

		var commentInput = document.createElement("textarea");
		commentInput.className = "comment-input";
		commentInput.placeholder = "Add a comment...";
		commentInput.rows = 2;
		commentInputDiv.appendChild(commentInput);

		var commentButton = document.createElement("button");
		commentButton.className = "comment-submit-button";
		commentButton.textContent = "Post";
		commentButton.onclick = function () {
			var message = commentInput.value.trim();
			if (!message) {
				return;
			}

			commentButton.disabled = true;
			submitComment(activity.taskId, message, function (success) {
				commentButton.disabled = false;
				if (success) {
					commentInput.value = "";
				}
			});
		};
		commentInputDiv.appendChild(commentButton);

		commentsDiv.appendChild(commentInputDiv);
	}

	if (commentsDiv.childNodes.length > 0) {
		contentDiv.appendChild(commentsDiv);
	}

	div.appendChild(contentDiv);

	if (clickable) {
		div.classList.add("clickable");
		div.onclick = function () {
			widgetContext.fireEvent("activityClicked", index);
		};
	}

	return div;
}

function getDefaultActivities() {
	return [
		{
			name: "Process Started",
			description: "Process instance initiated",
			startTime: "2026-05-29T08:00:00",
			status: "completed",
			assignee: "System",
			duration: 5000
		},
		{
			name: "Review Task",
			description: "Document review and approval",
			startTime: "2026-05-29T08:05:00",
			status: "completed",
			assignee: "John Doe",
			duration: 1800000,
			taskId: "TASK-001"
		},
		{
			name: "Manager Approval",
			description: "Awaiting manager approval",
			status: "pending",
			assignee: "Jane Smith",
			taskId: "TASK-002"
		}
	];
}

function renderActivities(activities) {
	timelineActivities.innerHTML = "";

	if (!activities || !activities.length) {
		activities = getDefaultActivities();
	}

	activities.forEach(function (activity, index) {
		timelineActivities.appendChild(createActivityItem(activity, index));
	});
}

var boundData = this.getData();
var boundItems = boundData && boundData.items ? boundData.items : null;

if (processInstanceId) {
	fetchProcessActivityData(processInstanceId, function (error, activities) {
		if (error) {
			console.error("Failed to fetch process activity data:", error);
			renderActivities(boundItems && boundItems.length ? boundItems : getDefaultActivities());
			return;
		}

		renderActivities(activities);
	});
} else {
	renderActivities(boundItems && boundItems.length ? boundItems : getDefaultActivities());
}

// Made with Bob