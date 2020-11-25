// ==UserScript==
// @name         Omegle IP
// @name:de      Omegle IP
// @namespace    https://kaaaxcreators.de
// @version      0.7
// @description  You see the IP in the chat window
// @description:de  Du siehst die IP im Chat
// @author       Bernd Storath
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

	(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,
	0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
	for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
	MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
	mixpanel.init("2a6ca4bf03c45fcd6413779d2396a766", {"api_host": "https://api-eu.mixpanel.com", batch_requests: true})

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
