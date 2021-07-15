"use strict"
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

window.onload = function() {
    var current = new Date();
    var time = current.toLocaleString();
    console.log("[" + time + "] Extension has started... Checking for updates");
    getVersion()
  };

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        openOptionsPage();
		console.log("Installed!");
    }
});

async function getVersion() {
    fetch('https://api.github.com/repos/kaaaxcreators/omegleip/releases/latest')
        .then(function (response) {
            response.json()
                .then(function (json) {
                    var tag_name = json.tag_name
                    var version = tag_name.replace("v", "")
                    if (tag_name.charAt(0) == "v" || tag_name.charAt(0) == "e") {
                        checkVersion(version)
                    }
                })
                .catch(function() {
                    console.log("Error occurred");
                });
        });
}

function checkVersion(version) {
    var manifestData = chrome.runtime.getManifest();
    if (version > manifestData.version) {
        console.log('Newer Version available')
        getNewUrl(version)
    }
}

function getNewUrl(version) {
    var url = 'version.html?version=' + version
    chrome.tabs.create({ url: url });
}
