window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
	const pc = new window.oRTCPeerConnection(...args)
	pc.oaddIceCandidate = pc.addIceCandidate
	pc.addIceCandidate = function(iceCandidate, ...rest) {
		const fields = iceCandidate.candidate.split(' ')
		if (fields[7] === 'srflx') {
			fetch('https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_yTh7AgkgBYR3dxffS50Hm06yCcYYT&ipAddress=' + fields[4])
				.then(response => response.json())
				.then(data => obj = data)
				.then(() => console.log("IP:", obj.ip))
				.then(() => console.log("City:", obj.location.city))
				.then(() => console.log("Region:", obj.location.region))
				.then(() => console.log("Country:", obj.location.country))
		}
		return pc.oaddIceCandidate(iceCandidate, ...rest)
	}
	return pc
}