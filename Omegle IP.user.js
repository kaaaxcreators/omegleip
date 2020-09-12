// ==UserScript==
// @name         Omegle IP
// @namespace    https://kaaaxcreators.de
// @version      0.2
// @description  Ctrl + Shift + I to open console
// @author       Bernd Storath
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// ==/UserScript==

(function() {
    console.log("--------------------------------------------------");
    console.log("Instructions: https://github.com/kaaax0815/omegleip");
    console.log("--------------------------------------------------");
    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection
    window.RTCPeerConnection = function(...args) {
        const pc = new window.oRTCPeerConnection(...args)
        pc.oaddIceCandidate = pc.addIceCandidate
        pc.addIceCandidate = function(iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ')
            if (fields[7] === 'srflx') {
				fetch('https://ipapi.co/' + fields[4] + "/json/")
				.then(response => response.json())
				.then(data => obj = data)
				.then(() => console.log("IP:", obj.ip))
				.then(() => console.log("City:", obj.city))
				.then(() => console.log("Region:", obj.region))
				.then(() => console.log("Country:", obj.country_name))
				.then(() => console.log("ISP:", obj.org))
				.then(() => console.log("--------------------------------------"))
				.catch(function() {
					console.log("Disable Adblocker!!");
				});
				console.log(tracker + fields[4]);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest)
        }
        return pc
    }
})();