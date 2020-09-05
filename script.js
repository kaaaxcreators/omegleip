(function() {
    console.log("--------------------------------------------------");
    console.log("To change the tracker type in \"tracker = <url>=\"");
    console.log("Example and Default: \"tracker = \"https://whatismyipaddress.com/ip/\"");
    console.log("--------------------------------------------------");
    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection
    window.RTCPeerConnection = function(...args) {
        const pc = new window.oRTCPeerConnection(...args)
        pc.oaddIceCandidate = pc.addIceCandidate
        pc.addIceCandidate = function(iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ')
            if (fields[7] === 'srflx') {
                console.log('IP Address:', fields[4]);
                console.log("https://whatismyipaddress.com/ip/" + fields[4]);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest)
        }
        return pc
    }
})();