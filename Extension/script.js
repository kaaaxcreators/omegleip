tracker = "https://whatismyipaddress.com/ip/"
window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
	const pc = new window.oRTCPeerConnection(...args)
	pc.oaddIceCandidate = pc.addIceCandidate
	pc.addIceCandidate = function(iceCandidate, ...rest) {
		const fields = iceCandidate.candidate.split(' ')
		if (fields[7] === 'srflx') {
			try {
				var list = document.getElementsByClassName("logitem")[0];
				var xmlhttp = new XMLHttpRequest();
				var url = 'https://ipapi.co/' + fields[4] + "/json/";

				xmlhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var myArr = JSON.parse(this.responseText);
						trackerip = tracker + fields[4];
						list.innerHTML = "IP: " + myArr.ip + "<br/>" + "City: " + myArr.city + "<br/>" + "Region: " + myArr.region + "<br/>" + "Country: " + myArr.country_name + "<br/>" + "ISP: " + myArr.org + "<br/>" + "<a target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.onerror = function () {
				  list.innerHTML = "Try disabling the adblocker";
				};	
				xmlhttp.send();
			}
			catch (err){
				list.innerHTML = err.message;
			}
		}
		return pc.oaddIceCandidate(iceCandidate, ...rest)
	}
	return pc
} 