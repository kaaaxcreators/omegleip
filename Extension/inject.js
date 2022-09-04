"use strict"

// listen for the the custom event from the contentscript
document.addEventListener('ChromeExtensionData', ({ detail: { tracker, enable, blockList } }) => {
  if (enable) {
    GLOBAL_CONFIG.blockList = blockList;
    console.log("Starting IP Retrieval");
    resetBlocklistBasedOnLastUpdate();
    injectAnalytics();
    injectStylesheet();
    injectIPGetter(tracker);
  } else {
    console.log("IP Retrieval disabled");
  }
});

/**
 * Session Config
 * @type {{oldIP: string | null, blockList: {bigdatacloud: string[], abstractapi: string[], lastUpdated: number}}}
 */
const GLOBAL_CONFIG = {
  oldIP: null
}

/**
 * Reset Blocklist if the `lastUpdated` is not this month
 */
 // TODO: If you stay on omegle on the night of the month change, the blocklist will not be be reset, but the api key quota will be reset
function resetBlocklistBasedOnLastUpdate() {
  const lastUpdated = new Date(GLOBAL_CONFIG.blockList.lastUpdated);
  const now = new Date();
  const sameMonth = now.getMonth() === lastUpdated.getMonth();
  console.log("Omegle IP", "BlockList", `Last updated: ${lastUpdated}\nNow: ${now}\nSame month: ${sameMonth}`);
  if (!sameMonth) {
    console.log("Omegle IP", "BlockList", "Resetting blocklist");
    GLOBAL_CONFIG.blockList.bigdatacloud = [];
    GLOBAL_CONFIG.blockList.abstractapi = [];
    GLOBAL_CONFIG.blockList.lastUpdated = Date.now();
    document.dispatchEvent(new CustomEvent('persistBlockList', { detail: GLOBAL_CONFIG.blockList }));
  }
}

/**
 * Add an API key to the blocklist
 * @param {'bigdatacloud' | 'abstractapi'} provider The provider to add the key to
 * @param {string} apiKey The API key to add
 */
function addToBlockList(provider, apiKey) {
  GLOBAL_CONFIG.blockList[provider].push(apiKey);
  GLOBAL_CONFIG.blockList.lastUpdated = Date.now();
  document.dispatchEvent(new CustomEvent('persistBlockList', { detail: GLOBAL_CONFIG.blockList }));
}

/**
 * Add multiple attributes to an element
 * @param {HTMLScriptElement} elements The element to add the attributes to
 * @param {{[key: string]: string}} attributes The attributes to add to the element
 * @author <https://stackoverflow.com/a/46372063/13707908> - Modified
 */
function setAttributes(elements, attributes) {
  Object.keys(attributes).forEach((name) => {
    elements.setAttribute(name, attributes[name]);
  })
}

/**
 * Injects the analytics script into the page
 */
function injectAnalytics() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://plausible.server.kaaaxcreators.de/js/script.js';
  setAttributes(ga, {
    "defer": true,
    "data-domain": "omegle.com"
  })
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
};

/**
 * Injects the IP Getter styles into the page
 */
function injectStylesheet() {
  var style = document.createElement('style');
  style.innerHTML =
`.logbox {
  right: .5em;
}
#omegleip-information,
#omegleip-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.omegleip-link {
  color: #00e;
}
#omegleip-provider {
  text-decoration: none;
}
#omegleip-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: .5em;
}
#omegleip-buttons > * {
  flex: 1;
  border-radius: .3em;
  color: #000;
  padding: .9em;
  background:transparent;
  cursor:pointer;
  border: 1px solid #ccc;
  font-size: 1em;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}
#omegleip-buttons > *:hover {
  font-weight: bold;
  background-image: -webkit-gradient(linear,0 0,0 100%,from(#80c0ff),to(#017ffe));
  color: white;
}`;
  document.getElementsByTagName('head')[0].appendChild(style);
}

/**
 * Pick a random element from an array
 * @param {any[]} arr Array of elements to pick from
 * @returns {any} Random element from the array
 */
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get the data from the API.
 * @summary Loops through all API Keys to find a working one. Bad ones get added to the blocklist.
 * @param {'bigdatacloud' | 'abstractapi'} provider The provider to use
 * @param {string} ip The IP to get the data for
 * @returns {Promise<unknown | false>} The data from the API or `false`
 * @async
 */
async function getData(provider, ip, index = 0) {
  const apiKey = apiKeys[provider][index];

  if (apiKey === undefined) {
    return false;
  } else if (GLOBAL_CONFIG.blockList[provider].includes(apiKey)) {
    return await getData(provider, ip, index + 1);
  }

  const response = await fetch(getProviderInfo(provider).ip(ip, atob(apiKey)));
  if (!response.ok) {
    // if the api monthly limit is reached, add the api key to the blocklist
    if (response.status === 403 || response.status === 422) {
      console.log(`API key ${apiKey} for ${provider} was used to many times\nIgnoring it this session`);
      addToBlockList(provider, apiKey);
    }
    await sleep(1000);
    return getData(provider, ip, ++index);
  }

  const json = await response.json();
  return json;
}

/**
 * Deconstruct the data from the API into a usable format
 * @param {unknown} data 
 * @param {'bigdatacloud' | 'abstractapi'} provider 
 * @returns Information about the Stranger in a usable format
 */
function destructData(data, provider) {
  const obj = {
    ip: '',
    city: '',
    region: '',
    country: '',
    isp: '',
    vpn: 'N/A',
    provider: provider
  }
  switch (provider) {
    case 'bigdatacloud':
      obj.ip = data.ip;
      obj.city = data.location.localityName;
      obj.region = data.location.isoPrincipalSubdivision;
      obj.country = data.country.isoName;
      obj.isp = data.network.organisation;
      return obj;
    case 'abstractapi':
      obj.ip = data.ip_address;
      obj.city = data.city;
      obj.region = data.region;
      obj.country = data.country;
      obj.isp = data.connection.isp_name;
      obj.isVPN = data.security.is_vpn ? 'Yes' : 'No';
      return obj;
  }
}

/**
 * Get Information about the Provider
 * @param {'bigdatacloud' | 'abstractapi'} provider Provider that was used
 * @returns {{name: string, url: string, ip: (ip: string, apiKey: string) => string}} Information about the Provider
 */
function getProviderInfo(provider) {
  const obj = {
    name: '',
    url: '',
    ip: ''
  }
  switch (provider) {
    case 'bigdatacloud':
      obj.name = 'BigDataCloud';
      obj.url = 'https://bigdatacloud.com';
      obj.ip = (ip, apiKey) => `https://api.bigdatacloud.net/data/ip-geolocation-full?ip=${ip}&key=${apiKey}`;
      return obj;
    case 'abstractapi':
      obj.name = 'abstract';
      obj.url = 'https://abstractapi.com';
      obj.ip = (ip, apiKey) => `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${ip}`;
      return obj;
  }
}

const createWrapperElement = () => {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-wrapper";
  baseElement.className = "statuslog";
  return baseElement;
};

/**
 * Display the information about the Stranger
 * @param {HTMLDivElement} list Element to but the Information into
 * @param {{data: unknown, provider: 'bigdatacloud' | 'abstractapi'}} data Data from the API
 * @param {string} tracker The tracker to use
 */
function displayDetails(list, data, tracker) {
  const baseElement = createWrapperElement();
  const information = destructData(data.data, data.provider);

  const informationText = createInformationText(information);
  baseElement.appendChild(informationText);

  const links = createLinks(tracker, information);
  baseElement.appendChild(links);

  const buttons = createButtons(information);
  baseElement.appendChild(buttons);

  list.replaceChildren(baseElement);
}

/**
 * 
 * @param {HTMLDivElement} list Element to but the Information into
 * @param {string} tracker The tracker to use
 * @param {string} ip IP of the Stranger
 */
function displayError(list, tracker, ip) {
  const baseElement = createWrapperElement();
  
  const errorText = createErrorText();
  baseElement.appendChild(errorText);
  
  const errorLinks = createErrorLinks(tracker, ip);
  baseElement.appendChild(errorLinks);
  
  list.replaceChildren(baseElement);
}

function createErrorText() {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-information";
  baseElement.textContent = "Couldn't get Information about the Stranger";
  return baseElement;
}

function createErrorLinks(tracker, ip) {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-links";
 
  const link = createMoreInfoLink(tracker, ip);
  baseElement.appendChild(link);
  
  return baseElement;
}

/**
 * Create the text element for the information
 * @param {{ip: string, city: string, region: string, country: string, isp: string, vpn: string}} information Information about the Stranger
 */
function createInformationText(information) {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-information";

  const ipElement = document.createElement('div');
  ipElement.textContent = `IP: ${information.ip}`;
  const cityElement = document.createElement('div');
  cityElement.textContent = `City: ${information.city}`;
  const regionElement = document.createElement('div');
  regionElement.textContent = `Region: ${information.region}`;
  const countryElement = document.createElement('div');
  countryElement.textContent = `Country: ${information.country}`;
  const ispElement = document.createElement('div');
  ispElement.textContent = `ISP: ${information.isp}`;
  const vpnElement = document.createElement('div');
  vpnElement.textContent = `VPN: ${information.vpn}`;

  baseElement.replaceChildren(ipElement, cityElement, regionElement, countryElement, ispElement, vpnElement);

  return baseElement;
}

/**
 * Create the links for the information
 * @param {string} tracker The tracker to use
 * @param {{ip: string, provider: string}} information Information about the Stranger
 * @param {'bigdatacloud' | 'abstractapi'} provider Provider that was used
 * @returns 
 */
function createLinks(tracker, information) {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-links";

  const link = createMoreInfoLink(tracker, information.ip);
  baseElement.appendChild(link);

  const providerLink = createProviderLink(information.provider);
  baseElement.appendChild(providerLink);

  return baseElement;
}

/**
 * Create the link to the tracker
 * @param {'bigdatacloud' | 'abstractapi'} tracker The tracker to use
 * @param {string} ip IP of the Stranger
 */
function createMoreInfoLink(tracker, ip) {
  const link = document.createElement('a');
  link.className = "omegleip-link";
  link.href = tracker + ip;
  link.target = "_blank";
  link.textContent = "More Information";
  return link;
}


/**
 * Create the link to the provider
 * @param {'bigdatacloud' | 'abstractapi'} provider 
 */
function createProviderLink(provider) {
  const providerLink = document.createElement('a');
  providerLink.className = "omegleip-link";
  providerLink.id = "omegleip-provider";
  const providerInfo = getProviderInfo(provider);
  providerLink.href = providerInfo.url;
  providerLink.target = "_blank";
  providerLink.textContent = `IP Data provided by ${providerInfo.name}`;
  return providerLink;
}

function createButtons(information) {
  const baseElement = document.createElement('div');
  baseElement.id = "omegleip-buttons";
  
  const trollButton = createTrollButton(information);
  baseElement.appendChild(trollButton);

  const skipButton = createSkipButton();
  baseElement.appendChild(skipButton);

  return baseElement;
}

/**
 * Create the button that sends information about the stranger to him
 * @param {{ip: string, city: string, region: string, country: string, isp: string}} information Information about the Stranger
 */
function createTrollButton(information) {
  const button = document.createElement('input');
  button.id = "omegleip-troll";
  button.type = "button";
  button.value = "Send Infos to Stranger";
  button.addEventListener('click', sendStranger(information));
  return button;
}

/**
 * Send information about the Stranger to him
 * @param {{ip: string, city: string, region: string, country: string, isp: string}} information Information about the Stranger
 */
function sendStranger(information) {
  return () => {
    const chat = document.getElementsByClassName("chatmsg")[0];
    chat.value = 
`IP: ${information.ip}
City: ${information.city}
Region: ${information.region}
Country: ${information.country}
ISP: ${information.isp}`;
    const button = document.getElementsByClassName("sendbtn")[0];
    button.click();
  }
}

/**
 * Create the button that instantly skips the stranger 
 */
function createSkipButton() {
  const button = document.createElement('input');
  button.id = "omegleip-skip";
  button.type = "button";
  button.value = "Instant Skip";
  button.addEventListener('click', skipStranger);
  return button;
}

/**
 * Instantly Skip the Stranger
 */
const skipStranger = () => {
  const button = document.getElementsByClassName("disconnectbtn")[0];
  switch (button.textContent) {
    case 'StopEsc':
      button.click();
      button.click();
      break;
    case 'Really?Esc':
      button.click();
      break;
  }
}

/**
 * Inject the IP Getter into the Website
 * @param {string} tracker Tracker to use
 */
function injectIPGetter(tracker) {
  window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
  window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args)
    pc.oaddIceCandidate = pc.addIceCandidate // save old instance
    pc.addIceCandidate = async function (iceCandidate, ...rest) {
      const fields = iceCandidate.candidate.split(' ');
      if (fields[7] === 'srflx' && GLOBAL_CONFIG.oldIP !== fields[4]) {
        GLOBAL_CONFIG.oldIP = fields[4];
        console.log("New Victim:", fields[4]);
        const ip = fields[4];
        const list = document.getElementsByClassName("logitem")[0];

        const data = { data: false, provider: '' };
        data.data = await getData('bigdatacloud', ip);
        data.provider = 'bigdatacloud';
        if (!data.data) {
          data.data = await getData('abstractapi', ip);
          data.provider = 'abstractapi';
        }

        if (!data.data) {
           displayError(list, tracker, ip);
        } else {
          displayDetails(list, data, tracker);
        }
      }
      if (pc.signalingState !== 'closed') {
        return pc.oaddIceCandidate(iceCandidate, ...rest)
      }
    }
    return pc
  }
}

const apiKeys = {
  bigdatacloud: [
    'ODE0NWQxY2VjNzk1NDg5MThiN2ExMDQ5NjU1ZDM1NjQ=',
    'ZDYwNWFjNjI0ZTQ0NGUyOGFkNDRjYTUyMzliZmNkNWY=',
    'NGVlN2MxYjdiYmQ4NDM0OGI1ZWIxN2RjMTkzMzdiMmE=',
    'YWVmYzk2MGIyYmNmNGRiM2E0YWIwMTgwODMzOTE3ZmY=',
    'Y2RkMGUxNGYyYTcyNGQ4NmI1YTljMzE5NTg4YmY0NmU=',
    'MGE4YzI1MGZiODdhNDgxZDlkYTEyOTJkODVhMjA5ZTU=',
  ],
  abstractapi: [
    'NDhjMGVlZjdlYTcwNGFjOTgyMjNkZWZhMDI1ZDVkMjA=',
    'MjJmYjhjMTQzOTRjNDZjYmE4M2ExZDYzNWExMzI0OGQ=',
    'M2Y2YjE4MTQxOTA5NDRhMjkxZTBkYTI0NDJkYmY3Yjc=',
    'OGRiMWFmNTU0ZTM0NGVlYzhiMzg4ZjY1NWE1NmI2MjQ=',
    'NjE2ZDlhYjI3NzQ5NGY1MmIxYTg5NWM3YzNlOTZhNjg=',
  ],
}