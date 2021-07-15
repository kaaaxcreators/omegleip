/* eslint-disable no-redeclare */
// ==UserScript==
// @name         Omegle IP
// @name:de      Omegle IP
// @namespace    https://omegleip.kaaaxcreators.de
// @version      1.4
// @description  You see the IP in the chat window
// @description:de  Du siehst die IP im Chat
// @author       Bernd Storath
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// @license      GPL-3.0-only; https://raw.githubusercontent.com/kaaaxcreators/omegleip/master/LICENSE
// @run-at       document-end
// @antifeature  ads, tracking
// ==/UserScript==

function setAttributes(elements, attributes) {
	Object.keys(attributes).forEach(function (name) {
		elements.setAttribute(name, attributes[name]);
	})
}

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
var tracker = "https://whatismyipaddress.com/ip/"; // sets whats the link you get redirected to when pressing "More Information"
var api_list = ["8145d1cec79548918b7a1049655d3564", "d605ac624e444e28ad44ca5239bfcd5f", "4ee7c1b7bbd84348b5eb17dc19337b2a", "aefc960b2bcf4db3a4ab0180833917ff", "cdd0e14f2a724d86b5a9c319588bf46e", "0a8c250fb87a481d9da1292d85a209e5"]
var api_key = api_list[Math.floor(Math.random() * api_list.length)];
var tagline = document.getElementById("tagline")
var height = tagline.offsetHeight;
var ip,city,region,country,isp;
tagline.innerHTML = "<div onclick=\"myFunctions.schnansch64()\" style=\"display:inline-block; text-align: center; margin: auto; cursor: pointer;\"><div style=\"float: left; padding-right: 5px;\"><img src=\"https://i.imgur.com/N3XyfVk.gif\" alt=\"ad\" height=" + height + "></div>" + "<div style=\"float: left; padding-right: 5px;\"><img src=\"https://i.imgur.com/pKJaNZQ.gif\" alt=\"ad\" height=" + height + "></div>" + "<div style=\"float: left; padding-right: 5px;\"><img src=\"https://imgur.com/iCisxBM.gif\" alt=\"ad\" height=" + height + "></div><div style=\"float: left;\"><img src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqjE_SCfhipjea8SFmhtpNV5bV5q2oKf9NNw&usqp=CAU\" alt=\"ad\" height=" + height + "></div></div>"
window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
window.RTCPeerConnection = function (...args) {
	const pc = new window.oRTCPeerConnection(...args)
	pc.oaddIceCandidate = pc.addIceCandidate
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

var myFunctions = window.myFunctions = {};
myFunctions.schnansch64 = function () {
	var links = ["//stawhoph.com/afu.php?zoneid=3948439", "//whugesto.net/afu.php?zoneid=3924203", "//stawhoph.com/afu.php?zoneid=3948441"];
	var link = links[Math.floor(Math.random() * links.length)];
	window.open(link, "ad");
};