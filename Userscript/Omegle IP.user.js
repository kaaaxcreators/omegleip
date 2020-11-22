// ==UserScript==
// @name         Omegle IP
// @name:de      Omegle IP
// @namespace    https://kaaaxcreators.de
// @version      0.6
// @description  You see the IP in the chat window
// @description:de  Du siehst die IP im Chat
// @author       Bernd Storath
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// ==/UserScript==

(function() {
	tracker = "https://whatismyipaddress.com/ip/"; // sets whats the link you get redirected to when pressing "More Information"
	window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
	window.RTCPeerConnection = function(...args) {
		const pc = new window.oRTCPeerConnection(...args)
		pc.oaddIceCandidate = pc.addIceCandidate
		pc.addIceCandidate = function(iceCandidate, ...rest) {
			const fields = iceCandidate.candidate.split(' ')
			if (fields[7] === 'srflx') {
				try {
					var list = document.getElementsByClassName("logitem")[0]; // finds the first log text
					var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
					var api = 'https://ipapi.co/' + fields[4] + "/json/";
					trackerip = tracker + fields[4];

					xmlhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) { // if succeeds
							var myArr = JSON.parse(this.responseText); // gets the reponse as json objects
							ip = myArr.ip; city = myArr.city; region = myArr.region; country =  myArr.country_name; isp = myArr.org;
							list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
						}
						if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599 -> use fallback api
							try {
								var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
								var fallbackapi = 'https://api.ipdata.co/' + fields[4] + '?api-key=9395e94ad6dceab9bd0a7e4ffc48340305cede433dead3e66d8f015e'; // sets fallback api

								xmlhttp.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) { // if succeeds
										var fallback = JSON.parse(this.responseText); // gets the reponse as json objects
										ip = fallback.ip; city = fallback.city; region = fallback.region; country =  fallback.country_name; isp = fallback.asn.name;
										list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
									}
									if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
										list.innerHTML = "An error occured even on the fallback api, when before the api had a error. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";
										
									}
									if (this.status === 429) { // // error handling on html error 429
										list.innerHTML = "You exceeded your daily quota even on the fallback api, when before the api had a error. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";
										
									}
								};
								xmlhttp.open("GET", fallbackapi, true);
								xmlhttp.onerror = function () {
								  list.innerHTML = "Try disabling the adblocker";
								};	
								xmlhttp.send(); // send the request 
							}
							catch (err){
								list.innerHTML = "A Error occurred: " + err.message;
							}
						}
						if (this.status === 429) { // error handling on html error 429 -> use of the fallback api
							try {
								var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
								var fallbackapi = 'https://api.ipdata.co/' + fields[4] + '?api-key=9395e94ad6dceab9bd0a7e4ffc48340305cede433dead3e66d8f015e'; // sets fallback api

								xmlhttp.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) { // if succeeds
										var fallback = JSON.parse(this.responseText); // gets the reponse as json objects
										ip = fallback.ip; city = fallback.city; region = fallback.region; country =  fallback.country_name; isp = fallback.asn.name;
										list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
									}
									if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
										list.innerHTML = "An error occured, when before you exceeded your daily quata. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";
										
									}
									if (this.status === 429) { // error handling
										list.innerHTML = "You exceeded your daily quota, when before you exceeded your daily quata. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";
										
									}
								};
								xmlhttp.open("GET", fallbackapi, true);
								xmlhttp.onerror = function () {
								  list.innerHTML = "Try disabling the adblocker";
								};	
								xmlhttp.send(); // send the request 
							}
							catch (err){
								list.innerHTML = "A Error occurred on the fallback api: " + err.message;
							}
						}
					};
					xmlhttp.open("GET", api, true);
					xmlhttp.onerror = function () {
					  list.innerHTML = "Try disabling the adblocker";
					};	
					xmlhttp.send(); // send the request 
				}
				catch (err){
					list.innerHTML = "A Error occurred: " + err.message;
				}
			}
			return pc.oaddIceCandidate(iceCandidate, ...rest)
		}
		return pc
	}
})();