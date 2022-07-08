

export function stt(secs) {
    if (secs === undefined) {
        return '0:00';
    }
    var minutes = Math.floor(secs / 60); // 7
	var seconds = secs % 60; // 30
	if (seconds < 10){
		seconds='0'+seconds.toString();
	}
	
	return minutes+':'+seconds;
}

export function coverPath(path) {
    return 'http://192.168.0.190:3001/mm/cover.php?dir='+path+'&type=album';
}
