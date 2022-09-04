/**
 * Save select box and checkbox state
 */
function save_options() {
	const tracker = document.getElementById('tracker').value;
	const enable = document.getElementById("enable").checked;
	chrome.storage.sync.set({
		tracker,
		enable,
	}, () => {
		// Update status to let user know options were saved and reloads omegle to take changes in place.
		chrome.tabs.query({url: "https://www.omegle.com/*"}, (tab) => {
			if (typeof(tab[0]) !== 'undefined') {
				chrome.tabs.reload(tab[0].id)
			}
		})
		const status = document.getElementById('status');
		status.textContent = 'Options saved';
		setTimeout(() => {
			status.textContent = '';
		}, 750);
	});
}

/**
 * Restore select box and checkbox state
 */
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		tracker: "https://whatismyipaddress.com/ip/",
		enable: true,
	}, (items) => {
		document.getElementById('tracker').value = items.tracker;
		document.getElementById("enable").checked = items.enable;
	});
}
// Event Listeners
window.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);