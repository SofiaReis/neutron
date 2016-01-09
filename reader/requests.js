function getRequest(requestString, onSuccess, onError, port,assinc) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    console.log(request);
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, assinc);
    console.log(request);
    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    console.log(request);
    request.send();
}

function matrixToList(matrix) {

    var list = "[";
    for(mat in matrix)
        list += "[" + matrix[mat] + "],";
    list = list.substring(0, list.length - 1);
    list += "]";   
    return list;

}
