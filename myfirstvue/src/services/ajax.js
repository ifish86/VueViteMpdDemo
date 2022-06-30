




export function getRequest(url, post, headers, callback){
    console.log('getting:'+url);
	var xmlHttpReq = false;
    var self = this;
    
    xmlHttpReq = new XMLHttpRequest();
    if (post) {
        xmlHttpReq.open('POST', url, true);
    } else {
        xmlHttpReq.open('GET', url, true);
    }
    
    xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.readyState == 4) {
            callback(xmlHttpReq.response, url, post, headers);
        }
    }.bind(callback, post, url, headers)
    
    if (headers) {
        xmlHttpReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    } else {
        xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    
    if (post) {
        xmlHttpReq.send(post);
    } else {
        xmlHttpReq.send();
    }
}

export function checkDataFormat(data) {
    console.log(data.length);
    if (data == undefined || data == null || data.length < 4) {
        return false;
    }
    try {
        JSON.parse(data);
    } catch(err) {
        return false;
    }
    
    return true;
}
