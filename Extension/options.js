// Saves options to chrome.storage
function save_options() {
	var tracker = document.getElementById('tracker').value;
	var troll = document.getElementById("troll").checked;
	var api = document.getElementById('api').value;
	var enable = document.getElementById("enable").checked;
	chrome.storage.sync.set({
		tracker: tracker,
		troll: troll,
		api:  api,
		enable: enable,
	}, function() {
		// Update status to let user know options were saved and reloads omegle to take changes in place.
		chrome.tabs.query({url: "https://www.omegle.com/*"}, function(tab) {
				if ( typeof(tab[0]) !== 'undefined' ) {
					chrome.tabs.reload(tab[0].id)
				}
		})
		var status = document.getElementById('status');
		status.textContent = 'Options saved';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		tracker: "https://whatismyipaddress.com/ip/",
		troll: "true",
		api: "random",
		enable: "true",
	}, function(items) {
		document.getElementById('tracker').value = items.tracker;
		document.getElementById("troll").checked = items.troll;
		document.getElementById("api").value = items.api;
		document.getElementById("enable").checked = items.enable;
	});
}
// Event Listeners
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);