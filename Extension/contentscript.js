"use strict"
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = () => {
	s.remove();
	// get data from storage
	chrome.storage.sync.get({
		tracker: "https://whatismyipaddress.com/ip/",
		troll: true,
		enable: true,
		blockList: {
			"bigdatacloud": [],
			"abstractapi": [],
			"lastUpdated": 0
		}
	}, ({tracker, troll, enable, blockList}) => {
		const data = {
			tracker,
			troll,
			enable,
			blockList
		};
		// send custom event with that data
		document.dispatchEvent(new CustomEvent('ChromeExtensionData', { detail: data }));
	});
};
(document.head || document.documentElement).appendChild(s);

document.addEventListener('persistBlockList', ({detail: blockList}) => {
	chrome.storage.sync.set({ blockList });
});
