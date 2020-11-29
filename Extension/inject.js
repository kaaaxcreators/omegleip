// Start
document.addEventListener('ChromeExtensionData', function (e) { // waits for variable from contentscript
  var data = e.detail;
  tracker = data.tracker;
  trollChecked = data.trollChecked;
  enableChecked = data.enableChecked;
  api_key = data.api_key;
  console.log("Enable Checked?:", enableChecked);
  if (enableChecked) {
  	console.log("Starting the IP retrieving");
  	getIp(tracker, trollChecked, api_key);
  }
});
// Pause

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-111172400-6']);
_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Pushes Events to Google
function push(what, why) {
	_gaq.push(['_trackEvent', what, why]);
}

// Resume
function getIp(tracker, trollChecked, api_key){
	/** feature idea:
	const apis = ["http://ipwhois.app/json/", ];
	const random = Math.floor(Math.random() * apis.length);
	console.log(months[random]); **/
	// tracker = "https://whatismyipaddress.com/ip/" // sets whats the link you get redirected to when pressing "More Information"
	console.log("Tracker:", tracker);
	console.log("Troll?:", trollChecked);
  console.log("API-Key:", api_key);
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
							if (trollChecked) { // checks if the troll button checkbox is checked in the options
								list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
							}
							else {
								list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
							}
						}
						if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599 -> use fallback api
							try {
								var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
								var fallbackapi = 'https://api.ipdata.co/' + fields[4] + '?api-key=' + api_key; // sets fallback api

								xmlhttp.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) { // if succeeds
										var fallback = JSON.parse(this.responseText); // gets the reponse as json objects
										ip = fallback.ip; city = fallback.city; region = fallback.region; country =  fallback.country_name; isp = fallback.asn.name;
										if (trollChecked) { // checks if the troll button checkbox is checked in the options
											list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
										}
										else {
											list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
										}
									}
									if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
										list.innerHTML = "An error occured. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

									}
									if (this.status === 429) { // // error handling on html error 429
										list.innerHTML = "You exceeded your daily quota. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

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
								var fallbackapi = 'https://api.ipdata.co/' + fields[4] + '?api-key=' + api_key; // sets fallback api

								xmlhttp.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) { // if succeeds
										var fallback = JSON.parse(this.responseText); // gets the reponse as json objects
										ip = fallback.ip; city = fallback.city; region = fallback.region; country =  fallback.country_name; isp = fallback.asn.name;
										if (trollChecked) { // checks if the troll button checkbox is checked in the options
											list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
										}
										else {
											list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
										}
									}
									if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
										list.innerHTML = "An error occured. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

									}
									if (this.status === 429) { // error handling
										list.innerHTML = "You exceeded your daily quota. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

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
}
function sendStranger(ip, city, region, country, isp) { // send stranger own details to scare them
	var chat = document.getElementsByClassName("chatmsg")[0];
	chat.value = "IP: " + ip + "\nCity: " + city + "\nRegion: " + region + "\nCountry: " + country + "\nISP: " + isp;
	var button = document.getElementsByClassName("sendbtn")[0];
	button.click();
  push("stranger", "clicked") // sends button click event to google
	return;
}
