var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
	chrome.storage.sync.get(['tracker', 'troll', 'enable'], function (obj) {
		tracker = obj.tracker;
		trollChecked = obj.troll;
		enableChecked =  obj.enable;
		var data = {
			tracker: tracker,
			trollChecked: trollChecked,
			enableChecked: enableChecked,
		};
		document.dispatchEvent(new CustomEvent('ChromeExtensionData', { detail: data })); // gets variable from optionspage and sends to the script
    });
};
(document.head || document.documentElement).appendChild(s);

