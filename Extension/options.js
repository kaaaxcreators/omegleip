// Inject Google Analytics
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-111172400-5']);
	_gaq.push(['_trackPageview']);
	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();

// Pushes Events to Google
function push(what, why) {
	_gaq.push(['_trackEvent', what, why]);
}

// Saves options to chrome.storage
function save_options() {
	var tracker = document.getElementById('tracker').value;
	var troll = document.getElementById("troll").checked;
	var enable = document.getElementById("enable").checked;
	chrome.storage.sync.set({
		tracker: tracker,
		troll: troll,
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
		enable: "true",
	}, function(items) {
		document.getElementById('tracker').value = items.tracker;
		document.getElementById("troll").checked = items.troll;
		document.getElementById("enable").checked = items.enable;
	});
}
// Event Listeners
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('save').addEventListener('click', push("save", "clicked"));
var troll = document.querySelector("input[name=troll]");
troll.addEventListener( 'change', function() {
    if(this.checked) {
        push("troll", "enable")
    } else {
        push("troll", "disable")
    }
});
var enable = document.querySelector("input[name=enable]");
enable.addEventListener( 'change', function() {
    if(this.checked) {
        push("enable", "enable")
    } else {
        push("enable", "disable")
    }
});
var tracker = document.querySelector("input[name=tracker]");
tracker.addEventListener( 'focusout', function() {
		value = tracker.value;
    push("tracker", value)
});
