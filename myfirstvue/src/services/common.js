

export function stt(secs) {
    var minutes = Math.floor(secs / 60); // 7
	var seconds = secs % 60; // 30
	if (seconds < 10){
		seconds='0'+seconds.toString();
	}
	
	return minutes+':'+seconds;
}

