/* eslint-disable no-redeclare */
"use strict"
// listen for the the custom event from the contentscript
document.addEventListener('ChromeExtensionData', function (e) {
	var data = e.detail;
	var tracker = data.tracker;
	var trollChecked = data.trollChecked;
	var enableChecked = data.enableChecked;
	var api_key = data.api_key;
	console.log("Enable Checked?:", enableChecked);
	if (enableChecked) {
		console.log("Starting the IP retrieving");
		getIp(tracker, trollChecked, api_key);
	}
});

/**
 * attributes helper function
 * @param {HTMLScriptElement} elements The element to add the attributes to
 * @param {{[key: string]: string}} attributes The attributes to add to the element
 * @author <https://stackoverflow.com/a/46372063/13707908> - Modified
 */
function setAttributes(elements, attributes) {
	Object.keys(attributes).forEach(function (name) {
		elements.setAttribute(name, attributes[name]);
	})
}

// add ackee analytics to the page
(function () {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ackee.server.kaaaxcreators.de/tracker.js';
	setAttributes(ga, {
		"data-ackee-server": "https://ackee.server.kaaaxcreators.de",
		"data-ackee-domain-id": "ffb2160c-f29d-4e49-bfc7-dc5dd1120426",
    "data-ackee-opts": '{"detailed":true}'
	})
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

// Init Global Variables
var /**@type string */ip,
/**@type string*/city,
/**@type string*/region,
/**@type string*/country,
/**@type string*/isp;

/**
 * Main Function
 * @param {string} tracker the url of the tracker
 * @param {boolean} trollChecked if the user has checked the troll checkbox
 * @param {string} api_key a bigdatacloud api key or `random`
 */
function getIp(tracker, trollChecked, api_key) {
	// Log settings from optionspage
	console.log("Tracker:", tracker);
	console.log("Troll?:", trollChecked);
	// api key is random pick a random key
	if (api_key == "random") {
		var api_list = ["8145d1cec79548918b7a1049655d3564", "d605ac624e444e28ad44ca5239bfcd5f", "4ee7c1b7bbd84348b5eb17dc19337b2a", "aefc960b2bcf4db3a4ab0180833917ff", "cdd0e14f2a724d86b5a9c319588bf46e", "0a8c250fb87a481d9da1292d85a209e5"]
		api_key = api_list[Math.floor(Math.random() * api_list.length)];
	}
	console.log("API-Key:", api_key);
	// ad ads
	var tagline = document.getElementById("tagline")
	var height = tagline.offsetHeight;
	tagline.innerHTML = "<div onclick=\"schnansch64()\" style=\"display:inline-block; text-align: center; margin: auto; cursor: pointer;\"><div style=\"float: left; padding-right: 5px;\"><img src=\"https://i.imgur.com/N3XyfVk.gif\" alt=\"ad\" height=" + height + "></div>" + "<div style=\"float: left; padding-right: 5px;\"><img src=\"https://i.imgur.com/pKJaNZQ.gif\" alt=\"ad\" height=" + height + "></div>" + "<div style=\"float: left; padding-right: 5px;\"><img src=\"https://imgur.com/iCisxBM.gif\" alt=\"ad\" height=" + height + "></div><div style=\"float: left;\"><img src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqjE_SCfhipjea8SFmhtpNV5bV5q2oKf9NNw&usqp=CAU\" alt=\"ad\" height=" + height + "></div></div>"
	// intercept rtc connection
	window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
	window.RTCPeerConnection = function (...args) {
		const pc = new window.oRTCPeerConnection(...args)
		pc.oaddIceCandidate = pc.addIceCandidate // save old instance
		pc.addIceCandidate = async function (iceCandidate, ...rest) {
			const fields = iceCandidate.candidate.split(' ')
			if (fields[7] === 'srflx') {
				try {
					/**
					 * the IP of the stranger
					 * @type string
					 */
					var strangerIP = fields[4];
					/**
					 * First Chat Text
					 * @type HTMLDivElement
					 */
					var list = document.getElementsByClassName("logitem")[0];
					/**
					 * Display the Information of the Stranger
					 * @param {any} data The returned data from the server
					 * @param {'ipapi' | 'bigdatacloud' | 'ipwhois' | 'freegeoip' | 'extreme-ip-lookup'} endpoint The Endpoint of the API Request
					 */
					// eslint-disable-next-line no-inner-declarations
					function setText(data, endpoint) {
						switch (endpoint) {
							case 'ipapi':
								ip = data.ip;
								city = data.city;
								region = data.region;
								country = data.country_name;
								isp = data.org;
								break;
							case 'bigdatacloud':
								ip = data.ip;
								city = data.location.localityName;
								region = data.location.isoPrincipalSubdivision;
								country = data.country.isoName;
								isp = data.network.organisation;
								break;
							case 'ipwhois':
								ip = data.ip;
								city = data.city;
								region = data.region;
								country = data.country;
								isp = data.isp;
								break;
							case 'freegeoip':
								ip = data.ip;
								city = data.city;
								region = data.region_name;
								country = data.country_name;
								isp = '';
                break;
							case 'extreme-ip-lookup':
								ip = data.query;
								city = data.city;
								region = data.region;
								country = data.country;
								isp = data.org;
                break;
							default:
								ip = '';
								city = '';
								region = '';
								country = '';
								isp = '';
								break;
						}
						/**
						 * Div with Stranger Details
						 */
						var baseElement = document.createElement('div');
						/**
						 * The Tracker Link
						 */
						var link = document.createElement('a');
						link.href = tracker + strangerIP;
						link.style = "color:black;";
						link.target = "_blank";
						link.textContent = "More Information"
						baseElement.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + link.outerHTML;
						if (trollChecked) {
							/**
							 * Send Stranger Button
							 */
							var button = '<button style="background-color:white; text cursor:pointer" onclick="sendStranger()">Send Infos to Stranger</button>'
							baseElement.innerHTML += "<br/>" + button;
						}
						list.innerHTML = baseElement.innerHTML;
					}
					var result = await fetch('https://ipapi.co/' + strangerIP + "/json/");
					if (result.ok) {
						var data = await result.json();
						setText(data, 'ipapi');
					} else {
						var result = await fetch('https://api.bigdatacloud.net/data/ip-geolocation-full?ip=' + strangerIP + '&key=' + api_key);
						if (result.ok) {
							var data = await result.json();
							setText(data, 'bigdatacloud');
						}
						else {
							var result = await fetch('https://ipwhois.app/json/' + strangerIP);
							var data = await result.json();
							if (result.ok && data.message !== "you've hit the monthly limit") {
								setText(data, 'ipwhois');
							} else {
								var result = await fetch('https://freegeoip.app/json/' + strangerIP);
								if (result.ok) {
									var data = await result.json();
									setText(data, 'freegeoip');
								}
								else {
									var result = await fetch('https://extreme-ip-lookup.com/json/' + strangerIP);
									if (result.ok) {
										var data = await result.json();
										setText(data, 'extreme-ip-lookup');
									} else {
										list.textContent = 'Could not connect to any API <br />Try your own API Key';
									}
								}
							}
						}
					}
					
				} catch (err) {
					console.error(err.message || err);
					if (err.message == 'Failed to fetch') {
						list.textContent = 'Try disabling your adblocker'
					} else {
						list.textContent = `An Error occurred: ${err.message || err}`;
					}
				}
			}
			return pc.oaddIceCandidate(iceCandidate, ...rest)
		}
		return pc
	}
}

/**
 * Send Stranger his own details
 */
// eslint-disable-next-line no-unused-vars
function sendStranger() { // send stranger own details to scare them
	var chat = document.getElementsByClassName("chatmsg")[0];
	chat.value = "IP: " + ip + "\nCity: " + city + "\nRegion: " + region + "\nCountry: " + country + "\nISP: " + isp;
	var button = document.getElementsByClassName("sendbtn")[0];
	button.click();
}

/**
 * Open a ad in a new tab
 */
// eslint-disable-next-line no-unused-vars
function schnansch64() {
	var links = ["//stawhoph.com/afu.php?zoneid=3948439", "//whugesto.net/afu.php?zoneid=3924203", "//stawhoph.com/afu.php?zoneid=3948441"]
	var link = links[Math.floor(Math.random() * links.length)];
	window.open(link, "ad");
}