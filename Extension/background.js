"use strict"

// Check whether new version is installed
chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason === "install"){
    chrome.runtime.openOptionsPage();
    console.log("Installed!");
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'checkVersion') {
    getVersion();
  }
});

async function getVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/kaaaxcreators/omegleip/releases/latest');
    const json = await response.json();
    const tag_name = json.tag_name;
    const version = tag_name.replace("v", "");
    if (tag_name.charAt(0) == "v") {
        checkVersion(version)
    }
  } catch (e) {
    console.log(e);
  }
}

function checkVersion(version) {
  const manifestData = chrome.runtime.getManifest();
  if (version > manifestData.version) {
      console.log('Newer Version available')
      getNewUrl(version)
  }
}

function getNewUrl(version) {
  const url = 'version.html?version=' + version;
  chrome.tabs.create({ url: url });
}
