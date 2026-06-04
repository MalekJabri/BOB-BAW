// ProcessActivityTimeline Widget - Main JavaScript
// Specialized for BAW process activity tracking with automatic data fetching

// Get configuration options
var processInstanceId = this.getOption("processInstanceId") || "";
var baseUrl = this.getOption("baseUrl") || "";
var showTimestamps = this.getOption("showTimestamps") !== false; // Default true
var showIcons = this.getOption("showIcons") !== false; // Default true
var showDetails = this.getOption("showDetails") !== false; // Default true
var compact = this.getOption("compact") || false; // Default false
var clickable = this.getOption("clickable") || false; // Default false

// Register event handler for click events
this.registerEventHandlingFunction(this, "activityClicked", "index");

// Get the timeline container elements
var timelineContainer = this.context.element.querySelector(".processactivitytimeline_maincontentbox");
var timelineActivities = timelineContainer.querySelector(".timeline-activities");

// Apply layout classes
if (compact) {
	timelineContainer.classList.add("compact");
} else {
	timelineContainer.classList.remove("compact");
}

// Clear existing timeline activities
timelineActivities.innerHTML = "";

// Store reference to widget context for API calls
var widgetContext = this;

// Function to format timestamp
function formatTimestamp(timestampValue) {
	if (!timestampValue) return "";
	
	try {
		var date;
		if (timestampValue instanceof Date) {
			date = timestampValue;
		} else if (typeof timestampValue === "string") {
			date = new Date(timestampValue);
		} else {
			return timestampValue.toString();
		}
		
		// Format as locale date and time
		return date.toLocaleString();
	} catch (e) {
		return timestampValue.toString();
	}
}

// Function to format duration
function formatDuration(durationMs) {
	if (!durationMs || durationMs <= 0) return "";
	
	var seconds = Math.floor(durationMs / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	
	if (days > 0) {
		return days + "d " + (hours % 24) + "h";
	} else if (hours > 0) {
		return hours + "h " + (minutes % 60) + "m";
	} else if (minutes > 0) {
		return minutes + "m " + (seconds % 60) + "s";
	} else {
		return seconds + "s";
	}
}

// Function to get status display text
function getStatusText(status) {
	var statusMap = {
		"completed": "Completed",
		"active": "Active",
		"pending": "Pending",
		"failed": "Failed",
		"skipped": "Skipped",
		"waiting": "Waiting"
	};
	return statusMap[status] || status || "Pending";
}

// Function to map BAW stream event to ProcessActivityEvent
function mapStreamEventToActivity(event) {
	// Extract activity name from object or content
	var activityName = "Activity";
	if (event.object && event.object.displayName) {
		activityName = event.object.displayName;
	}
	
	// Extract assignee from actor
	var assignee = "System";
	if (event.actor && event.actor.displayName) {
		assignee = event.actor.displayName;
	}
	
	// Parse content to extract description (remove HTML tags)
	var description = "";
	if (event.content) {
		// Remove HTML tags and decode entities
		description = event.content.replace(/<[^>]*>/g, '').trim();
	}
	
	// Map BAW stream event structure to our ProcessActivityEvent format
	var activity = {
		name: activityName,
		description: description,
		startTime: event.published || new Date(),
		status: "completed", // Default status
		assignee: assignee
	};
	
	// Determine status based on verb and content
	var contentLower = (event.content || "").toLowerCase();
	var verb = (event.verb || "").toLowerCase();
	
	if (contentLower.indexOf("completed") >= 0 || contentLower.indexOf("complete") >= 0) {
		activity.status = "completed";
	} else if (contentLower.indexOf("started") >= 0 || contentLower.indexOf("work started") >= 0) {
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
	
	// Add additional fields if available
	if (event.object) {
		if (event.object.id) {
			// Determine if it's a task or instance ID based on objectType
			if (event.object.objectType === "ibm.bpm.task") {
				activity.taskId = event.object.id;
			} else if (event.object.objectType === "ibm.bpm.instance") {
				activity.instanceId = event.object.id;
			}
		}
	}
	
	// Extract comments from replies
	if (event.replies && event.replies.items && Array.isArray(event.replies.items)) {
		activity.comments = event.replies.items.map(function(reply) {
			return {
				author: reply.author ? reply.author.displayName : "Unknown",
				content: reply.content || "",
				published: reply.published || "",
				id: reply.id || ""
			};
		});
	}
	
	return activity;
}

// Function to group activities by task ID
function groupActivitiesByTask(activities) {
	var taskGroups = {};
	var processActivities = [];
	
	// Group activities by task ID
	activities.forEach(function(activity) {
		if (activity.taskId) {
			if (!taskGroups[activity.taskId]) {
				taskGroups[activity.taskId] = [];
			}
			taskGroups[activity.taskId].push(activity);
		} else {
			// Process-level activities (not task-specific)
			processActivities.push(activity);
		}
	});
	
	// Convert grouped tasks into timeline items
	var result = [];
	
	// Add process-level activities first
	processActivities.forEach(function(activity) {
		result.push(activity);
	});
	
	// Add grouped task activities
	Object.keys(taskGroups).forEach(function(taskId) {
		var taskEvents = taskGroups[taskId];
		
		// Sort events by timestamp (oldest first)
		taskEvents.sort(function(a, b) {
			var timeA = new Date(a.startTime || a.timestamp);
			var timeB = new Date(b.startTime || b.timestamp);
			return timeA - timeB;
		});
		
		// Use the most recent event as the main activity
		var mainActivity = taskEvents[taskEvents.length - 1];
		
		// Add sub-events to the main activity
		mainActivity.subEvents = taskEvents.slice(0, -1);
		
		result.push(mainActivity);
	});
	
	return result;
}

// Function to fetch process activity data from BAW REST API
function fetchProcessActivityData(instanceId, callback) {
	// Determine base URL
	var apiBaseUrl = baseUrl;
	if (!apiBaseUrl) {
		// Use current server URL
		apiBaseUrl = window.location.protocol + "//" + window.location.host;
	}
	
	// Construct API URL
	var apiUrl = apiBaseUrl + "/bas/rest/bpm/wle/v1/social/instance/" + instanceId + "/stream";
	
	console.log("Fetching process activity data from:", apiUrl);
	
	// Create XMLHttpRequest
	var xhr = new XMLHttpRequest();
	xhr.open("GET", apiUrl, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.withCredentials = true; // Include credentials for authentication
	
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			try {
				var response = JSON.parse(xhr.responseText);
				console.log("API Response:", response);
				
				// Extract activities from response
				var activities = [];
				if (response.items && Array.isArray(response.items)) {
					// Map stream events to activities
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
				
				// Group activities by task
				var groupedActivities = groupActivitiesByTask(activities);
				
				console.log("Grouped activities:", groupedActivities);
				callback(null, groupedActivities);
			} catch (e) {
				console.error("Error parsing API response:", e);
				callback(e, null);
			}
		} else {
			console.error("API request failed with status:", xhr.status);
			callback(new Error("API request failed: " + xhr.status), null);
		}
	};
	
	xhr.onerror = function() {
		console.error("Network error while fetching process activity data");
		callback(new Error("Network error"), null);
	};
	
	xhr.send();
}

// Function to submit a comment to a task
function submitComment(taskId, message, callback) {
	// Determine base URL
	var apiBaseUrl = baseUrl;
	if (!apiBaseUrl) {
		// Use current server URL
		apiBaseUrl = window.location.protocol + "//" + window.location.host;
	}
	
	// Construct API URL with message parameter
	var apiUrl = apiBaseUrl + "/bas/rest/bpm/wle/v1/social/task/" + taskId + "/comment?message=" + encodeURIComponent(message);
	
	console.log("Submitting comment to:", apiUrl);
	
	// Create XMLHttpRequest
	var xhr = new XMLHttpRequest();
	xhr.open("POST", apiUrl, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.withCredentials = true; // Include credentials for authentication
	
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			console.log("Comment submitted successfully");
			callback(true);
		} else {
			console.error("Failed to submit comment. Status:", xhr.status);
			callback(false);
		}
	};
	
	xhr.onerror = function() {
		console.error("Network error while submitting comment");
		callback(false);
	};
	
	xhr.send();
}

// Function to create a process activity timeline item
function createActivityItem(activity, index) {
	var div = document.createElement("div");
	div.className = "timeline-item timeline-activity";
	
	// Determine activity status
	var status = activity.status || "pending";
	div.classList.add(status);
	
	// Add clickable class if there are sub-events
	if (activity.subEvents && activity.subEvents.length > 0) {
		div.classList.add("has-drilldown");
	}
	
	// Create activity marker (circle)
	var marker = document.createElement("div");
	marker.className = "timeline-marker activity-marker";
	
	// Add icon/text to marker based on status
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
			marker.textContent = (index + 1).toString();
		}
	} else {
		marker.textContent = (index + 1).toString();
	}
	
	div.appendChild(marker);
	
	// Create activity content container
	var contentDiv = document.createElement("div");
	contentDiv.className = "timeline-content activity-content";
	
	// Create activity header
	var headerDiv = document.createElement("div");
	headerDiv.className = "timeline-header activity-header";
	
	// Create left side of header (name and user info)
	var headerLeft = document.createElement("div");
	
	// Create activity name
	var nameDiv = document.createElement("div");
	nameDiv.className = "activity-name";
	nameDiv.textContent = activity.name || activity.activityName || "Activity " + (index + 1);
	headerLeft.appendChild(nameDiv);
	
	// Create user info section if assignee exists
	if (activity.assignee) {
		var userInfoDiv = document.createElement("div");
		userInfoDiv.className = "user-info";
		
		// Create user avatar
		var avatarDiv = document.createElement("div");
		avatarDiv.className = "user-avatar";
		// Get initials from assignee name
		var initials = activity.assignee.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
		avatarDiv.textContent = initials;
		userInfoDiv.appendChild(avatarDiv);
		
		// Create user details container
		var userDetailsDiv = document.createElement("div");
		
		// User name
		var userNameDiv = document.createElement("div");
		userNameDiv.className = "user-name";
		userNameDiv.textContent = activity.assignee;
		userDetailsDiv.appendChild(userNameDiv);
		
		// Timestamp
		if (showTimestamps && (activity.startTime || activity.timestamp)) {
			var timestampDiv = document.createElement("div");
			timestampDiv.className = "timestamp activity-timestamp";
			var timestampValue = activity.startTime || activity.timestamp;
			timestampDiv.textContent = formatTimestamp(timestampValue);
			userDetailsDiv.appendChild(timestampDiv);
		}
		
		userInfoDiv.appendChild(userDetailsDiv);
		headerLeft.appendChild(userInfoDiv);
	}
	
	headerDiv.appendChild(headerLeft);
	
	// Create status badge (right side of header)
	var statusDiv = document.createElement("div");
	statusDiv.className = "tag activity-status";
	statusDiv.textContent = getStatusText(status);
	headerDiv.appendChild(statusDiv);
	
	contentDiv.appendChild(headerDiv);
	
	// Create activity description if provided
	if (activity.description) {
		var descDiv = document.createElement("div");
		descDiv.className = "activity-description";
		descDiv.textContent = activity.description;
		contentDiv.appendChild(descDiv);
	}
	
	// Add comments section if present or if activity has taskId
	var commentsDiv = document.createElement("div");
	commentsDiv.className = "timeline-comments";
	
	// Display existing comments
	if (activity.comments && activity.comments.length > 0) {
		activity.comments.forEach(function(comment) {
			var commentDiv = document.createElement("div");
			commentDiv.className = "timeline-comment";
			
			// Comment avatar
			var avatarDiv = document.createElement("div");
			avatarDiv.className = "user-avatar";
			var initials = comment.author.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
			avatarDiv.textContent = initials;
			commentDiv.appendChild(avatarDiv);
			
			// Comment content
			var commentContentDiv = document.createElement("div");
			commentContentDiv.className = "comment-content";
			
			var commentText = document.createElement("div");
			commentText.innerHTML = "<strong>" + comment.author + ":</strong> " + comment.content;
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
	
	// Add comment input section for tasks
	if (activity.taskId) {
		var commentInputDiv = document.createElement("div");
		commentInputDiv.className = "comment-input-section";
		
		// Comment input container
		var inputContainer = document.createElement("div");
		inputContainer.className = "comment-input-container";
		
		// Text input
		var commentInput = document.createElement("input");
		commentInput.type = "text";
		commentInput.className = "comment-input";
		commentInput.placeholder = "Add a comment...";
		commentInput.setAttribute("data-task-id", activity.taskId);
		inputContainer.appendChild(commentInput);
		
		// Submit button
		var submitBtn = document.createElement("button");
		submitBtn.className = "comment-submit-btn";
		submitBtn.textContent = "Post";
		submitBtn.setAttribute("data-task-id", activity.taskId);
		submitBtn.onclick = function() {
			var taskId = this.getAttribute("data-task-id");
			var input = this.previousElementSibling;
			var message = input.value.trim();
			
			if (message) {
				// Disable button during submission
				submitBtn.disabled = true;
				submitBtn.textContent = "Posting...";
				
				submitComment(taskId, message, function(success) {
					// Re-enable button
					submitBtn.disabled = false;
					submitBtn.textContent = "Post";
					
					if (success) {
						// Insert comment immediately in UI
						var newCommentDiv = document.createElement("div");
						newCommentDiv.className = "timeline-comment";
						
						// Comment avatar
						var avatarDiv = document.createElement("div");
						avatarDiv.className = "user-avatar";
						// Use current user initials (you can get from BAW context if available)
						var currentUser = "User"; // Default, could be enhanced to get actual user
						var initials = currentUser.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
						avatarDiv.textContent = initials;
						newCommentDiv.appendChild(avatarDiv);
						
						// Comment content
						var commentContentDiv = document.createElement("div");
						commentContentDiv.className = "comment-content";
						
						var commentText = document.createElement("div");
						commentText.innerHTML = "<strong>" + currentUser + ":</strong> " + message;
						commentContentDiv.appendChild(commentText);
						
						// Timestamp
						var commentTime = document.createElement("div");
						commentTime.className = "timestamp";
						commentTime.textContent = "Just now";
						commentContentDiv.appendChild(commentTime);
						
						newCommentDiv.appendChild(commentContentDiv);
						
						// Insert before the input section
						commentsDiv.insertBefore(newCommentDiv, commentInputDiv);
						
						// Clear input
						input.value = "";
					}
				});
			}
		};
		inputContainer.appendChild(submitBtn);
		
		commentInputDiv.appendChild(inputContainer);
		commentsDiv.appendChild(commentInputDiv);
	}
	
	// Only append comments div if there are comments or input section
	if (activity.comments && activity.comments.length > 0 || activity.taskId) {
		contentDiv.appendChild(commentsDiv);
	}
	
	div.appendChild(contentDiv);
	
	// Add sub-events (drilldown) if present
	if (activity.subEvents && activity.subEvents.length > 0) {
		var drilldownDiv = document.createElement("div");
		drilldownDiv.className = "timeline-drilldown";
		drilldownDiv.style.display = "none"; // Hidden by default
		
		activity.subEvents.forEach(function(subEvent) {
			var subEventDiv = document.createElement("div");
			subEventDiv.className = "timeline-sub-event";
			
			// Sub-event content
			var subContentDiv = document.createElement("div");
			subContentDiv.className = "sub-event-content";
			
			// Sub-event description
			var subDescDiv = document.createElement("div");
			subDescDiv.className = "sub-event-description";
			subDescDiv.textContent = subEvent.description || subEvent.name;
			subContentDiv.appendChild(subDescDiv);
			
			// Sub-event timestamp and assignee
			var subMetaDiv = document.createElement("div");
			subMetaDiv.className = "sub-event-meta";
			
			if (subEvent.assignee) {
				var subAssigneeSpan = document.createElement("span");
				subAssigneeSpan.textContent = subEvent.assignee;
				subMetaDiv.appendChild(subAssigneeSpan);
				
				if (subEvent.startTime || subEvent.timestamp) {
					var separator = document.createElement("span");
					separator.textContent = " • ";
					subMetaDiv.appendChild(separator);
				}
			}
			
			if (subEvent.startTime || subEvent.timestamp) {
				var subTimeSpan = document.createElement("span");
				var timestampValue = subEvent.startTime || subEvent.timestamp;
				subTimeSpan.textContent = formatTimestamp(timestampValue);
				subMetaDiv.appendChild(subTimeSpan);
			}
			
			subContentDiv.appendChild(subMetaDiv);
			subEventDiv.appendChild(subContentDiv);
			drilldownDiv.appendChild(subEventDiv);
		});
		
		div.appendChild(drilldownDiv);
		
		// Add toggle button
		var toggleBtn = document.createElement("button");
		toggleBtn.className = "drilldown-toggle";
		toggleBtn.textContent = "Show " + activity.subEvents.length + " earlier event" + (activity.subEvents.length > 1 ? "s" : "");
		toggleBtn.onclick = function(e) {
			e.stopPropagation();
			var isExpanded = drilldownDiv.style.display !== "none";
			drilldownDiv.style.display = isExpanded ? "none" : "block";
			toggleBtn.textContent = isExpanded
				? "Show " + activity.subEvents.length + " earlier event" + (activity.subEvents.length > 1 ? "s" : "")
				: "Hide earlier events";
		};
		contentDiv.appendChild(toggleBtn);
	}
	
	// Add click event handler if clickable
	if (clickable) {
		div.addEventListener("click", function(e) {
			e.preventDefault();
			
			// Call custom onClick handler if provided
			if (activity.onClick && typeof activity.onClick === "function") {
				activity.onClick(activity, index);
			}
			
			// Fire boundary event for activity click
			if (typeof me !== "undefined" && me.ui && me.ui.fireEvent) {
				me.ui.fireEvent("activityClicked", {
					index: index,
					activity: activity
				});
			}
		});
	}
	
	return div;
}

// Function to render timeline activities
function renderActivities(activities) {
	// Clear existing activities
	timelineActivities.innerHTML = "";
	
	if (activities && Array.isArray(activities) && activities.length > 0) {
		activities.forEach(function(activity, index) {
			var activityItem = createActivityItem(activity, index);
			timelineActivities.appendChild(activityItem);
		});
	} else {
		// Show message when no activities found
		var messageDiv = document.createElement("div");
		messageDiv.className = "timeline-activity";
		messageDiv.style.textAlign = "center";
		messageDiv.style.padding = "2rem";
		messageDiv.style.color = "#525252";
		messageDiv.textContent = "No process activities found";
		timelineActivities.appendChild(messageDiv);
	}
}

// Main logic: Check if we should fetch data or use bound data
if (processInstanceId && processInstanceId.trim() !== "") {
	// Fetch data from BAW REST API
	console.log("Fetching process activity data for instance:", processInstanceId);
	
	// Show loading indicator
	var loadingDiv = document.createElement("div");
	loadingDiv.className = "timeline-activity";
	loadingDiv.style.textAlign = "center";
	loadingDiv.style.padding = "2rem";
	loadingDiv.textContent = "Loading process activities...";
	timelineActivities.appendChild(loadingDiv);
	
	fetchProcessActivityData(processInstanceId, function(error, activities) {
		if (error) {
			console.error("Error fetching process activity data:", error);
			// Show error message
			timelineActivities.innerHTML = "";
			var errorDiv = document.createElement("div");
			errorDiv.className = "timeline-activity";
			errorDiv.style.textAlign = "center";
			errorDiv.style.padding = "2rem";
			errorDiv.style.color = "#da1e28";
			errorDiv.textContent = "Error loading process activities: " + error.message;
			timelineActivities.appendChild(errorDiv);
		} else {
			// Render fetched activities
			renderActivities(activities);
		}
	});
} else {
	// Use bound data
	var activityData = widgetContext.getData().items;
	
	if (activityData && Array.isArray(activityData) && activityData.length > 0) {
		renderActivities(activityData);
	} else {
		// Show default sample activities
		var defaultActivities = [
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
				name: "Data Validation",
				description: "Validating submitted data",
				startTime: "2026-05-29T08:35:00",
				status: "active",
				assignee: "System"
			},
			{
				name: "Manager Approval",
				description: "Awaiting manager approval",
				status: "pending",
				assignee: "Jane Smith"
			},
			{
				name: "Final Processing",
				description: "Final processing and completion",
				status: "pending",
				assignee: "System"
			}
		];
		
		renderActivities(defaultActivities);
	}
}

// Made with Bob