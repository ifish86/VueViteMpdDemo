




export function getRequest(url, post, callback){
    console.log('getting:'+url);
	var xmlHttpReq = false;
    var self = this;
    
    xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open('GET', url, true);
    xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.readyState == 4) {
            console.log(xmlHttpReq.response);
            callback(xmlHttpReq.response);
        }
    }.bind(callback)
    xmlHttpReq.send();
}

export function checkDataFormat(data) {
    try {
        JSON.parse(data);
    } catch(err) {
        return false;
    }
    
    return true;
}
