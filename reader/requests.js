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

/*
* Function to save the current possible moves in the using variables
* @param id Position in prolog
*/
function curPossibleMoves(id)
{

    console.log("Requesting possible moves...");
    // Compose Request String
    waiting = true;
    var requestString = "[jog_poss, [";
    for(var i = 0; i < 5; i++){
        if(i == 0)
            requestString = requestString.concat("[" + prologBoard[i] + "]"); 
        else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
    }
    requestString = requestString.concat("]," + id[0] + "," + id[1] + ",");

    if(nextPlay == "1"){
        requestString = requestString.concat("3]");
    }
    else if(nextPlay == "2"){
        requestString = requestString.concat(player + "]");
    }
    this.postGameRequest(requestString,this.posMovesHandler);

};

/*
* Function to request an inteligent move from the game
*/
function requestIntMove()
{

    console.log("Requesting inteligent move for P" + player + "...");
    // Compose Request String
    waiting = true;
    if(nextPlay == "2"){
        var requestString = "[jogada_ale, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
    }
    else{
        var requestString = "[jogada_int, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
    }

    this.postGameRequest(requestString,this.moveHandler);

};

/*
* Function to save the current possible moves in the using variables
*/
function requestRandMove()
{

    console.log("Requesting random move for P" + player + "...");
    // Compose Request String

    waiting = true;
    if(nextPlay == "2"){
        var requestString = "[jogada_ale, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + neutron.x + ", " + neutron.y + ", " + player + "]");
    }
    else{
        var requestString = "[jogada_ale_neutron, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + neutron.x + "," + neutron.y + "," + player + "]");
    }

    this.postGameRequest(requestString,this.moveHandler);

};

/*
* Function to request making a move from prolog server
* @param id1 Inicial position in prolog
* @param id2 Final position in prolog
*/
function requestMove(id1, id2)
{

    movesAllowed = [];
    this.lastPicked = [];
    console.log("Requesting move for P" + player + "...");
    // Compose Request String

    waiting = true;

    if(nextPlay == "2"){
        var requestString = "[jogada, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + neutron.x + ", " + neutron.y + ", " + id1 + ", " + id2 + ", " + player + "]");
    }
    else{
        var requestString = "[jogada_neutrao, [";
        for(var i = 0; i < 5; i++){
            if(i == 0)
                requestString = requestString.concat("[" + prologBoard[i] + "]"); 
            else requestString = requestString.concat(",[" + prologBoard[i] + "]"); 
        }
        requestString = requestString.concat("]," + id1 + "," + id2 + "," + player + "]");
    }

    this.postGameRequest(requestString,this.moveHandler);

    

};


/*
* Function to handle reply because of a move
* @param data Variable to get the response from
*/
function moveHandler(data){
    response=JSON.parse(data.target.response);
    console.log(response.message);
    if(response.message != "Move Invalid"){
        if(player != response.newPlayer){
            camerachange=true;
            cameraangle=0;
            if(player=="1"){
            camerasetposition=true;
        }
        }
        player = response.newPlayer;
        nextPlay = response.newPlay;
        lastBoard = prologBoard;
        prologBoard = JSON.parse(response.newBoard);
        movie.push(prologBoard);
        animating = true;
        

    }

    if (response.message == "The End"){
        console.log("Player " + player + " won!!");
        winner = player;
        finished=true;
        console.debug(this);
    }
    waiting = false;
    clearBoard = true;
};

/*
* Function to handle reply from curPossMoves
* @param data Variable to get the response from
*/
function posMovesHandler(data){
    response=JSON.parse(data.target.response);
    console.log(response.message);
    console.log("Possible moves: " + response.newBoard);
    movesAllowed = JSON.parse(response.newBoard);
    clearBoard = true;
    waiting = false;
};

function matrixToList(matrix) {

    var list = "[";
    for(mat in matrix)
        list += "[" + matrix[mat] + "],";
    list = list.substring(0, list.length - 1);
    list += "]";   
    console.log(list);   
    return list;

}

function listToMatrix(list) {
    return JSON.parse(list);
}