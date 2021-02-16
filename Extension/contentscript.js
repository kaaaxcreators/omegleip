var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
    chrome.storage.sync.get({
  		tracker: "https://whatismyipaddress.com/ip/",
  		troll: "true",
      	api: "random",
  		enable: "true",
  	}, function (obj) {
		tracker = obj.tracker;
		trollChecked = obj.troll;
		enableChecked =  obj.enable;
    	api_key = obj.api;
		var data = {
			tracker: tracker,
			trollChecked: trollChecked,
			enableChecked: enableChecked,
      		api_key: api_key,
		};
		document.dispatchEvent(new CustomEvent('ChromeExtensionData', { detail: data })); // gets variable from optionspage and sends to the script
    });
};
(document.head || document.documentElement).appendChild(s);
