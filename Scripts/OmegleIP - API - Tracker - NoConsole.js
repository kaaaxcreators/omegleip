getIp();

// Resume
function getIp() {
	tracker = "https://whatismyipaddress.com/ip/";
	console.log("Tracker:", tracker);
	api_list = ["8145d1cec79548918b7a1049655d3564", "d605ac624e444e28ad44ca5239bfcd5f", "4ee7c1b7bbd84348b5eb17dc19337b2a", "aefc960b2bcf4db3a4ab0180833917ff", "cdd0e14f2a724d86b5a9c319588bf46e", "0a8c250fb87a481d9da1292d85a209e5"]
	api_key = api_list[Math.floor(Math.random() * api_list.length)];
	console.log("API-Key:", api_key);
	var tagline = document.getElementById("tagline")
	var height = tagline.offsetHeight;
	window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
	window.RTCPeerConnection = function (...args) {
		const pc = new window.oRTCPeerConnection(...args)
		pc.oaddIceCandidate = pc.addIceCandidate
		pc.addIceCandidate = function (iceCandidate, ...rest) {
			const fields = iceCandidate.candidate.split(' ')
			if (fields[7] === 'srflx') {
				try {
					var list = document.getElementsByClassName("logitem")[0]; // finds the first log text
					var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
					var api = 'https://ipapi.co/' + fields[4] + "/json/";
					trackerip = tracker + fields[4];
					xmlhttp.onreadystatechange = function () {
						if (this.readyState == 4 && this.status == 200) { // if succeeds
							var myArr = JSON.parse(this.responseText); // gets the response as json objects
							ip = myArr.ip;
							city = myArr.city;
							region = myArr.region;
							country = myArr.country_name;
							isp = myArr.org;
							list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
						}
						if (this.status > 299 && this.status < 600) { // error handling on html error 300 - 599 -> use fallback api
							try {
								var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
								var fallbackapi = 'https://api.bigdatacloud.net/data/ip-geolocation-full?ip=' + fields[4] + '&key=' + api_key;

								xmlhttp.onreadystatechange = function () {
									if (this.readyState == 4 && this.status == 200) { // if succeeds
										var fallback = JSON.parse(this.responseText); // gets the response as json objects
										ip = fallback.ip;
										city = fallback.location.localityName;
										region = fallback.location.isoPrincipalSubdivision;
										country = fallback.country.isoName;
										isp = fallback.network.organisation;
										list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
									}
									if (this.status > 299 && this.status < 600) { // error handling on html error 300 - 599 -> use fallback api
										try {
											var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
											var fall2backapi = 'https://ipwhois.app/json/' + fields[4]; // sets fallback api

											xmlhttp.onreadystatechange = function () {
												if (this.readyState == 4 && this.status == 200) { // if succeeds
													var fall2back = JSON.parse(this.responseText); // gets the response as json objects
													ip = fall2back.ip;
													city = fall2back.city;
													region = fall2back.region;
													country = fall2back.country;
													isp = fall2back.isp;
													message = fall2back.message;
													list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
													if (message === "you've hit the monthly limit") {
														list.innerHTML = "You exceeded your daily quota. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";
													}
												}
												if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
													list.innerHTML = "An error occurred. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "Reloading the Page may work" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

												}
												if (this.status === 429) { // // error handling on html error 429
													list.innerHTML = "You exceeded your daily quota. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

												}
											};
											xmlhttp.open("GET", fall2backapi, true);
											xmlhttp.onerror = function () {
												list.innerHTML = "Try disabling the AdBlocker";
											};
											xmlhttp.send(); // send the request
										} catch (err) {
											list.innerHTML = "A Error occurred: " + err.message;
										}
									}
								};
								xmlhttp.open("GET", fallbackapi, true);
								xmlhttp.onerror = function () {
									list.innerHTML = "Try disabling the AdBlocker";
								};
								xmlhttp.send(); // send the request
							} catch (err) {
								list.innerHTML = "A Error occurred: " + err.message;
							}
						}
					};
					xmlhttp.open("GET", api, true);
					xmlhttp.onerror = function () {
						list.innerHTML = "Try disabling the AdBlocker";
					};
					xmlhttp.send(); // send the request
				} catch (err) {
					list.innerHTML = "A Error occurred: " + err.message;
				}
			}
			return pc.oaddIceCandidate(iceCandidate, ...rest)
		}
		return pc
	}
}

function sendStranger(ip, city, region, country, isp) { // send stranger own details to scare them
	var chat = document.getElementsByClassName("chatmsg")[0];
	chat.value = "IP: " + ip + "\nCity: " + city + "\nRegion: " + region + "\nCountry: " + country + "\nISP: " + isp;
	var button = document.getElementsByClassName("sendbtn")[0];
	button.click();
	return;
}