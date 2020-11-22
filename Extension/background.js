chrome.runtime.onMessage.addListener(function(message) {
    switch (message.action) {
        case "openOptionsPage":
            openOptionsPage();
            break;
        default:
            break;
    }
});

function openOptionsPage(){
	var d = new Date();
	var n = d.toLocaleTimeString();
    chrome.runtime.openOptionsPage();
	console.log(n + ": opened the Optionspage");
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        openOptionsPage();
		console.log("Installed!");
    }
});
