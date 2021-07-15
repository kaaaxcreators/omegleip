"use strict"
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
	this.remove();
	// get data from storage (or rather from the optionspage)
	chrome.storage.sync.get({
		tracker: "https://whatismyipaddress.com/ip/",
		troll: "true",
		api: "random",
		enable: "true",
	}, function (obj) {
		var tracker = obj.tracker;
		var trollChecked = obj.troll;
		var enableChecked =  obj.enable;
		var api_key = obj.api;
		var data = {
			tracker: tracker,
			trollChecked: trollChecked,
			enableChecked: enableChecked,
			api_key: api_key
		};
		// send custom event with that data
		document.dispatchEvent(new CustomEvent('ChromeExtensionData', { detail: data }));
	});
};
(document.head || document.documentElement).appendChild(s);
