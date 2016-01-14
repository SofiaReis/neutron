 

function XMLscene(mode,diff) {
	CGFscene.call(this);
	this.mode = setSettings(mode,diff);
	this.gameDiff = this.mode[2];
	this.curTime = 0;
	this.modeP1 = this.mode[0];
	this.modeP2 = this.mode[1];
	this.boardPieces = [];


	this.x = 0;
	this.z = 0;     
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {

	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.enableTextures(true);

	this.lightEnable = []; 

	this.leaves = {};
	this.textures = {};
	this.materials = {};
	this.animations = {};
	this.a_material=null;
	this.a_texture=null;

	this.picked = null;
	this.pickedDestine = null;
	this.neutronID = null;

	this.setPickEnabled(true);
	this.i = 1;
	this.neutron = null;

	this.nextPlay = 2;
	this.processing = false;

	this.matches = [];

	this.firstPlay = true;
	this.board = new Tab(this);

	this.defaultApp = new CGFappearance(this);
	this.defaultApp.setAmbient(0.3, 0.3, 0.3, 1);
	this.defaultApp.setDiffuse(0.7, 0.7, 0.7, 1);
	this.defaultApp.setSpecular(0.0, 0.0, 0.0, 1);  
	this.defaultApp.setShininess(120);

	this.piecesAnim = [];


	this.timerPlayer2 = new Timer(this);
	this.timerPlayer1 = new Timer(this);

	this.pickingAnimation = null;
	this.playerPlaying = 1;

	this.score = new Score(this);

	this.neutronPlaying = false

	this.up = new LinearAnimation(this, 1,[[0,0,0],[0, 0.5, 0]]);
	this.down = new LinearAnimation(this, 1,[[0,0,0],[0, 0.5, 0]]);
	this.pieceAnimStatus = 0;

	this.gameFinished = false;
	this.tab = [];

	this.response = null;
	this.compPlaying = false;

	this.axis=new CGFaxis(this);
	this.setUpdatePeriod(10000/60);
};

XMLscene.prototype.cloneObject = function(obj) {
	
	console.log(obj);
	if (obj === null || typeof obj !== 'object') {

		return obj;
	}

	var temp = obj.constructor(); 
	for (var key in obj) {
		temp[key] = cloneObject(obj[key]);
	}
	console.log(temp);

	return temp;
}

function setSettings(mode,diff)
{
	var playersModes = null;
	if(mode == 1)
	{ 
		playersModes=[0,0,timeMatch(diff)];
	}
	else if(mode == 2)
	{

		playersModes=[0,2,timeMatch(diff)];
	}
	else if(mode == 3)
	{
		playersModes=[2,2,timeMatch(diff)];
	}
	return playersModes;
}

function timeMatch(diff)
{
	var time = 0;
	if(diff==1) time = 12; //9sec 
	else if(diff==2) time = 10; //6sec
	else time = 8;
	return time;
}
/**
 * convertDegtoRad
 * Method to convert degrees to radians
 * @param deg angle in degrees
 */
 XMLscene.prototype.convertDegtoRad = function(deg){
 	return (deg*Math.PI/180.0);
 }

 XMLscene.prototype.Undo = function(){

 	if((this.playerPlaying == 2 && this.modeP1 == 2) || (this.playerPlaying == 1 && this.modeP2 == 2 ))
 	{
 		console.log("You can't undo for the computer.");
 	}
 	else if(this.matches.length != 0 && this.gameFinished==false)
 	{
 		console.log("UNDO");
 		this.matches.pop();
 		var matrix = this.matches[this.matches.length-1];
 		if(this.matches.length ==1) this.firstPlay = true;
 		this.board.init(matrix[2]);
 		this.playerPlaying = matrix[0];
 		this.nextPlay = matrix[1];
 	}
 	else if(this.gameFinished==true)
 	{
 		console.log("The game is finished, you can't undo!");
 	}


 }

 XMLscene.prototype.initCameras = function () {
 	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
 	this.camDestine = [15,15,15];
 	this.camMoving = false;
 	this.camTime = 3000;
 };

 XMLscene.prototype.setDefaultAppearance = function () {
 	this.setAmbient(0.2, 0.4, 0.8, 1.0);
 	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
 	this.setSpecular(0.2, 0.4, 0.8, 1.0);
 	this.setShininess(10.0);
 };

 XMLscene.prototype.resetTab = function()
 {
 	var scene = this;
 	this.initTab(function(matrix){
 		scene.board.init(matrix);
 		scene.tab = matrix;
 		scene.matches.push([scene.playerPlaying,scene.nextPlay,matrix,1,2,2]);
 	});	
 }


 XMLscene.prototype.initTab = function(request, reqObj)
 {
 	getRequest("initTab", function(data){
 		console.log(data.target.response);
 		var board = JSON.parse(data.target.response);
 		if(typeof request === "function")
 		{
 			request.apply(reqObj,[board]);
 		}
 	},true);
 }

 XMLscene.prototype.getJogadas = function(request, reqObj)
 {
 	getRequest("getJogadas("+matrixToList(this.board.tab)+","+this.picked.i+","+this.picked.j+","+this.modeP1+")",function(data) {

 		var response = JSON.parse(data.target.response);

 		if (typeof request === "function") {
 			request.apply(reqObj,[response]);
 		}
 	},true);
 }

 XMLscene.prototype.playHNeutron = function(request, reqObj)
 {

 	getRequest("playHNeutrao("+matrixToList(this.board.tab)+","+this.picked.i+
 		","+this.picked.j+","+this.pickedDestine.i+","+this.pickedDestine.j+","+this.playerPlaying+")",function(data) {

 		var response = JSON.parse(data.target.response);

 		if (typeof request === "function") {
 			request.apply(reqObj,[response]);
 		}
 	},true);
 }

 XMLscene.prototype.playCNeutron = function(request, reqObj)
 {
 	getRequest("playCNeutrao("+matrixToList(this.board.tab)+","+this.neutron.i+
 		","+this.neutron.j+","+this.playerPlaying+")",function(data) {

 		var response = JSON.parse(data.target.response);

 		if (typeof request === "function") {
 			request.apply(reqObj,[response]);
 		}
 	},true);
 }

 XMLscene.prototype.playHuman = function(request, reqObj)
 {

 	getRequest("playHumano("+matrixToList(this.board.tab)+","+this.neutron.i+","+this.neutron.j+","+this.picked.i+
 		","+this.picked.j+","+this.pickedDestine.i+","+this.pickedDestine.j+","+this.playerPlaying+")",function(data) {

 		var response = JSON.parse(data.target.response);	
 		if (typeof request === "function") {
 			request.apply(reqObj,[response]);
 		}
 	},true);
 }

 XMLscene.prototype.playComputador = function(request, reqObj)
 {
 	console.log(this.neutron);
 	getRequest("playComputador("+matrixToList(this.board.tab)+","+this.neutron.i+","+this.neutron.j+","+this.playerPlaying+")",function(data) {

 		var response = JSON.parse(data.target.response);

 		if (typeof request === "function") {
 			request.apply(reqObj,[response]);
 		}
 	},true);
 }
/**
 * processLights
 * Method to process the parsing of Lights
 */
 XMLscene.prototype.processLights = function(){

 	this.lights = [];
 	this.lightIDs = [];

 	var i = 0;
 	for(light in this.graph.lightsInfo){
 		this.lights[i] = new CGFlight(this,i);

 		var temp_id = this.graph.lightsInfo[light].id;
 		this.lights[i].setPosition(this.graph.lightsInfo[light].position.x, this.graph.lightsInfo[light].position.y, this.graph.lightsInfo[light].position.z, this.graph.lightsInfo[light].position.w);
 		this.lights[i].setDiffuse(this.graph.lightsInfo[light].diffuse.r, this.graph.lightsInfo[light].diffuse.g, this.graph.lightsInfo[light].diffuse.b, this.graph.lightsInfo[light].diffuse.a);
 		this.lights[i].setAmbient(this.graph.lightsInfo[light].ambient.r, this.graph.lightsInfo[light].ambient.g, this.graph.lightsInfo[light].ambient.b, this.graph.lightsInfo[light].ambient.a);
 		this.lights[i].setSpecular(this.graph.lightsInfo[light].specular.r, this.graph.lightsInfo[light].specular.g, this.graph.lightsInfo[light].specular.b, this.graph.lightsInfo[light].specular.a);
 		this.lights[i].setVisible(true);

 		this.lightIDs[i]=[];
 		this.lightIDs[i].id=light;

 		if(this.graph.lightsInfo[light].enable == true){
 			this.lights[i].enable();
 			eval("this.lightEnable" + i + " = " + true);
 			this.lightEnable[i] = true;
 		}
 		else{
 			this.lights[i].disable();
 			eval("this.lightEnable" + i + " = " + false);
 			this.lightEnable[i] = false;
 		}
 		this.lights[i].update;
 		i++;
 	}

 	this.lightsLoad = true;
 };

/** 
 * processIllumination
 * Method to process the parsing of Illumination
 */
 XMLscene.prototype.processIllumination = function(){

 	this.gl.clearColor(this.graph.illuminationInfo.background.r,
 		this.graph.illuminationInfo.background.g,
 		this.graph.illuminationInfo.background.b,
 		this.graph.illuminationInfo.background.a);

 	this.setGlobalAmbientLight(this.graph.illuminationInfo.ambient.r,
 		this.graph.illuminationInfo.ambient.g,
 		this.graph.illuminationInfo.ambient.b,
 		this.graph.illuminationInfo.ambient.a);
 };

/**
 * processTextures
 * Method to process the parsing of Textures
 */
 XMLscene.prototype.processTextures = function(){

 	for(texture in this.graph.texturesInfo){
 		this.textures[texture] = new CGFtexture(this,this.graph.texturesInfo[texture].path);
 		this.textures[texture].path = this.graph.texturesInfo[texture].path;
 		this.textures[texture].amp = {};
 		this.textures[texture].amp.s = this.graph.texturesInfo[texture].amplif_factor.s; 
 		this.textures[texture].amp.t = this.graph.texturesInfo[texture].amplif_factor.t; 
 	}
 }


 XMLscene.prototype.Topo = function() {

 	if(!this.camMoving) {
 		this.camOrg=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
 		this.camDestine = [0,15,0];
 		if(!arraysEqual(this.camDestine, this.camOrg)) this.calcTransition();
 	}
 };

 XMLscene.prototype.PlayerBlack = function() {

 	if(!this.camMoving) {
 		this.camOrg=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
 		this.camDestine = [15,15,0];
 		if(!arraysEqual(this.camDestine, this.camOrg)) this.calcTransition();
 	}
 };

 XMLscene.prototype.PlayerWhite = function() {

 	if(!this.camMoving) {
 		this.camOrg=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
 		this.camDestine = [-15,15,0];
 		if(!arraysEqual(this.camDestine, this.camOrg)) this.calcTransition();
 	}
 };

 XMLscene.prototype.PlayerWin = function() {

     if(!this.camMoving) {
        this.camOrg=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
        this.camDestine = [0,10,20];
        if(!arraysEqual(this.camDestine, this.camOrg)) this.calcTransition();
    }
};

 function convertPos(x,y)
 {
 	var xi = 3;
 	var zi = -3;
 	for(var i  = 0; i < 5; i++)
 	{
 		zi++;
 		for(var j = 0; j < 5; j++)
 		{
 			xi--;

 			if(x==i && y==j)
 			{
 				var pos = [xi,zi];
 			}
 		}
 		xi = 3;
 	}
 	return pos;

 }

 XMLscene.prototype.processAnimation = function(){

 	console.log(this.firstPlay);
 	console.log(this.nextPlay);

 	if(this.firstPlay == true)
 	{

 		this.pickingAnimation = new LinearAnimation(this, 1,[[0,0,0],[(this.newPos[1]-this.oldPos[1])/2, 1, (this.newPos[0]-this.oldPos[0])/2],[(this.newPos[1]-this.oldPos[1])/2, -1, (this.newPos[0]-this.oldPos[0])/2]]);
 		console.log(this.pickingAnimation);
 		this.processing = true;
 	}
 	else if(this.nextPlay == 2)
 	{
 		if((this.modeP1 == 2 && this.playerPlaying ==1) || (this.modeP2 == 2 && this.playerPlaying == 2))
 		{
 			this.pickingAnimation = new LinearAnimation(this, 1,[[0,0,0],[(this.newPos[1]-this.oldPos[1])/2, 1, (this.newPos[0]-this.oldPos[0])/2],[(this.newPos[1]-this.oldPos[1])/2, -1, (this.newPos[0]-this.oldPos[0])/2]]);
 				console.log(this.pickingAnimation);
 			this.processing = true;
 		}else{
 			this.pickingAnimation = new LinearAnimation(this, 1,[[0,0,0],[(this.pickedDestine.xi-this.picked.xi)/2, 1, (this.pickedDestine.zi-this.picked.zi)/2],[(this.pickedDestine.xi-this.picked.xi)/2, -1, (this.pickedDestine.zi-this.picked.zi)/2]]);
 			this.processing = true;
 		}
 		
 	}
 	else if(this.nextPlay == 1){
 		

 		if((this.modeP1 == 2 && this.playerPlaying ==1) || (this.modeP2 == 2 && this.playerPlaying == 2))
 		{
 			var pos = convertPos(this.response[4], this.response[5]);
 			this.pickingAnimation = new LinearAnimation(this, 1,[[0,0,0],[(pos[1]-this.neutron.xi)/2,1,(pos[0]-this.neutron.zi)/2],[(pos[1]-this.neutron.xi)/2,-1,(pos[0]-this.neutron.zi)/2]]);
 			this.processing = true;
 		}
 		else
 		{
 			this.pickingAnimation = new LinearAnimation(this, 1,[[0,0,0],[(this.pickedDestine.xi-this.picked.xi)/2, 1, (this.pickedDestine.zi-this.picked.zi)/2],[(this.pickedDestine.xi-this.picked.xi)/2, -1, (this.pickedDestine.zi-this.picked.zi)/2]]);
 			this.processing = true;
 		}
 		
 	}
 	
 }



 XMLscene.prototype.gameHumano = function() {

 	var scene = this;
 	if(this.picked.type !=3){
 		this.playHuman(function(matrix)
 		{
 			scene.message = matrix[3];
 			scene.response = matrix;
 			if(scene.message == 1){

 				if(scene.playerPlaying == 1)
 				{
 					scene.score.setCounters(scene.timerPlayer1.seconds, 0);
 					scene.timerPlayer1.restart = true;
 					scene.timerPlayer2.restart = true;

 				} 
 				else if(scene.playerPlaying == 2)
 				{
 					scene.score.setCounters(0, scene.timerPlayer2.seconds);
 					scene.timerPlayer2.restart = true;
 					scene.timerPlayer1.restart = true;

 				} 

 				scene.board.tab = matrix[2];

 				scene.matches.push(matrix);

 				scene.setPickEnabled(false);
 				console.log("Good Move!");								

 				scene.processAnimation();				

 			}
 			else if(scene.message == 2)
 			{
 				scene.setPickEnabled(false);
 				console.log("Game Finished!");
 				scene.processAnimation();		
 				scene.gameFinished = true;
 			}
 			else
 			{
 				console.log("Invalid Move!");
 			}
 		});
 	}
 	else{
 		this.playHNeutron(function(matrix)
 		{
 			scene.message = matrix[3];
 			scene.response = matrix;

 			if(scene.message == 1){	

 				if(scene.playerPlaying == 1)
 				{
 					scene.score.setCounters(scene.timerPlayer1.seconds, 0);
 					scene.timerPlayer1.restart = true;
 					scene.timerPlayer2.restart = true;

 				} 
 				else if(scene.playerPlaying == 2)
 				{
 					scene.score.setCounters(0, scene.timerPlayer2.seconds);
 					scene.timerPlayer2.restart = true;
 					scene.timerPlayer1.restart = true;
 				} 

 				scene.board.tab = matrix[2];

 				scene.matches.push(matrix);
 				scene.processAnimation();


							}
							else if(scene.message == 2)
							{
								scene.setPickEnabled(false);
								scene.processAnimation();		
								scene.gameFinished = true;
								console.log("Game Finished!");
								console.log("Player "+ scene.playerPlaying +" WON!");
							}
							else
							{
								console.log("Invalid Move!");
							}
						});

}

};

XMLscene.prototype.updateGame = function()
{
	this.board.init(this.newBoard);
}

XMLscene.prototype.gameComputador = function() {

	var scene = this;

	if(this.nextPlay == 1)
	{
		this.playCNeutron(function(matrix)
		{
			scene.matches.push(matrix);
			scene.message = matrix[3];
			scene.response = matrix;

			if(scene.message == 1)
				{	
					if(scene.playerPlaying == 1)
					{
						scene.score.setCounters(scene.timerPlayer1.seconds, 0);
						scene.timerPlayer1.restart = true;
						scene.timerPlayer2.restart = true;

					} 
					else if(scene.playerPlaying == 2)
					{
						scene.score.setCounters(0, scene.timerPlayer2.seconds);
						scene.timerPlayer2.restart = true;
						scene.timerPlayer1.restart = true;

					} 
					scene.calculateNewPos(matrix[2]);
					scene.board.tab = matrix[2];


					console.log("Good Move!");

					scene.processAnimation();
			}
			else if(scene.message == 2)
			{
				scene.setPickEnabled(false);
				scene.processAnimation();		
				console.log("Game Finished!");
				scene.gameFinished = true;
				console.log("Player "+ scene.playerPlaying +" WON!");

			}
			else{
				console.log("Invalid Move!");
			}



		});

	}
	else if(this.nextPlay == 2)
	{
		this.playComputador(function(matrix)
		{
			scene.message = matrix[3];
			scene.response = matrix;
			if(scene.message == 1){
				if(scene.playerPlaying == 1)
				{
					scene.score.setCounters(scene.timerPlayer1.seconds, 0);
					scene.timerPlayer1.restart = true;
					scene.timerPlayer2.restart = true;

				} 
				else if(scene.playerPlaying == 2)
				{
					scene.score.setCounters(0, scene.timerPlayer2.seconds);
					scene.timerPlayer2.restart = true;
					scene.timerPlayer1.restart = true;

				} 
				scene.calculateNewPos(matrix[2]);
				scene.board.tab = matrix[2];

				scene.matches.push(matrix);
				if(scene.firstPlay == true)
				{
					console.log("First Play!");
					scene.firstPlay = false;
				}

				console.log("Good Move!");
				scene.processAnimation();

			}
			else if(scene.message == 2)
			{
				scene.setPickEnabled(false);
				scene.processAnimation();		
				console.log("Game Finished!");
				scene.gameFinished = true;
			}
			else
			{
				console.log("Invalid Move!");
			}
		});
}



}

XMLscene.prototype.calculateNewPos = function(board)
{
	
	for(var i = 0; i < board.length; i++)
	{
		for(var j = 0; j < board[0].length; j++)
		{
			if(board[i][j] != this.board.tab[i][j])
			{
				if(this.board.tab[i][j] == 0 && board[i][j] == 2)
				{
					this.newPos = convertPos(i,j);
					this.newPos.i = i;
					this.newPos.j = j;
				}
				else if(this.board.tab[i][j] == 2 && board[i][j] == 0)
				{
					this.oldPos = convertPos(i,j);
					this.newPiece = this.board.allTab[i][j][0];
					this.oldPos.i = i;
					this.oldPos.j = j;
				}
			}
				
		}
	}
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				var customId = this.pickResults[i][1];	
				console.log(obj);
				console.log(this.picked);
				if (obj instanceof Piece && this.picked == null && obj.type!=3)
				{			
					console.log("Picked object: " + obj + ", with pick id " + customId);
					this.pieceAnimStatus = 1; // up
					this.picked = obj;
				}
				else if(obj instanceof Piece && obj.type==3 && this.picked == null)
				{
					console.log("Neutron object: " + obj + ", with pick id " + customId);
					this.pieceAnimStatus = 1; // up
					this.picked = obj;
				}
				else if(obj instanceof Piece && this.picked == obj)
				{
					var ind = obj.objPiece.transformations.length-1;
					this.pickingAnimation = 2;
					this.picked = null;
					this.pickedDestine = null;
				}
				else if(obj instanceof Cell && this.picked != null){

					console.log("Destine object: " + obj + ", with pick id " + customId);
					this.pickedDestine = obj;
					this.pieceAnimStatus = 2;
					this.gameHumano();										
				}
				else if(obj instanceof Cell){
					console.log("Destine object: " + obj + ", with pick id " + customId);
					
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

XMLscene.prototype.calcTransition = function() {
	this.transitionVec = [this.camDestine[0]-this.camOrg[0],
	this.camDestine[1]-this.camOrg[1],
	this.camDestine[2]-this.camOrg[2]];

	this.camMoving = true;
};

function isOdd(num) { return num % 2;}



/**
 * processMaterials
 * Method to process the parsing of Materials
 */
 XMLscene.prototype.processMaterials = function(){



 	for(material in this.graph.materialsInfo){

 		this.materials[material] = new CGFappearance(this);
 		this.materials[material].setShininess(this.graph.materialsInfo[material].shininess);

 		this.materials[material].setSpecular(this.graph.materialsInfo[material].specular.r,
 			this.graph.materialsInfo[material].specular.g,
 			this.graph.materialsInfo[material].specular.b,
 			this.graph.materialsInfo[material].specular.a);

 		this.materials[material].setDiffuse(this.graph.materialsInfo[material].diffuse.r,
 			this.graph.materialsInfo[material].diffuse.g,
 			this.graph.materialsInfo[material].diffuse.b,
 			this.graph.materialsInfo[material].diffuse.a
 			);

 		this.materials[material].setAmbient(this.graph.materialsInfo[material].ambient.r,
 			this.graph.materialsInfo[material].ambient.g,
 			this.graph.materialsInfo[material].ambient.b,
 			this.graph.materialsInfo[material].ambient.a
 			);

 		this.materials[material].setEmission(this.graph.materialsInfo[material].emission.r,
 			this.graph.materialsInfo[material].emission.g,
 			this.graph.materialsInfo[material].emission.b,
 			this.graph.materialsInfo[material].emission.a);
 	}
 }

/**
 * processLeaves
 * Method to process the parsing of Leaves
 */
 XMLscene.prototype.processLeaves = function(){

 	for(leaf in this.graph.leavesInfo){
 		switch(this.graph.leavesInfo[leaf].type){
 			case "rectangle":
 			this.leaves[leaf] = new Rectangle(this, 
 				this.graph.leavesInfo[leaf].args.ltX, 
 				this.graph.leavesInfo[leaf].args.ltY, 
 				this.graph.leavesInfo[leaf].args.rbX, 
 				this.graph.leavesInfo[leaf].args.rbY,1,1);
 			this.leaves[leaf].type = "rectangle";
 			break;
 			case "triangle":
 			this.leaves[leaf] = new Triangle(this, 
 				this.graph.leavesInfo[leaf].args.x0, 
 				this.graph.leavesInfo[leaf].args.y0, 
 				this.graph.leavesInfo[leaf].args.z0, 
 				this.graph.leavesInfo[leaf].args.x1, 
 				this.graph.leavesInfo[leaf].args.y1, 
 				this.graph.leavesInfo[leaf].args.z1, 
 				this.graph.leavesInfo[leaf].args.x2, 
 				this.graph.leavesInfo[leaf].args.y2,
 				this.graph.leavesInfo[leaf].args.z2,1,1);
 			this.leaves[leaf].type = "triangle";
 			break;
 			case "cylinder":
 			this.leaves[leaf] = new Cylinder(this, 
 				this.graph.leavesInfo[leaf].args.height, 
 				this.graph.leavesInfo[leaf].args.bRad, 
 				this.graph.leavesInfo[leaf].args.tRad, 
 				this.graph.leavesInfo[leaf].args.stacks, 
 				this.graph.leavesInfo[leaf].args.slices);
 			this.leaves[leaf].type = "cylinder";
 			break;
 			case "sphere":
 			this.leaves[leaf] = new Sphere(this, 
 				this.graph.leavesInfo[leaf].args.rad, 
 				this.graph.leavesInfo[leaf].args.stacks, 
 				this.graph.leavesInfo[leaf].args.slices);
 			this.leaves[leaf].type = "sphere";

 			break;
 			case "plane":
 			this.leaves[leaf] = new Plane(this, 
 				this.graph.leavesInfo[leaf].parts);
 			this.leaves[leaf].type = "plane";
 			break;
 			case "patch":
 			this.leaves[leaf] = new Patch(this, 
 				this.graph.leavesInfo[leaf].order,
 				this.graph.leavesInfo[leaf].partsU,
 				this.graph.leavesInfo[leaf].partsV,
 				this.graph.leavesInfo[leaf].ctrlPoints);
 			this.leaves[leaf].type = "patch";
 			break;
 			case "terrain":
 			this.leaves[leaf] = new Terrain(this, this.graph.leavesInfo[leaf].texture,
 				this.graph.leavesInfo[leaf].height);
 			this.leaves[leaf].type = "terrain";
 			break;
 		}
 	}
 };

/**
 * processAnimations
 * Method to process the parsing of AnimationsRef
 */
 XMLscene.prototype.processAnimations = function(){

 	for(node in this.graph.nodesInfo)
 	{
 		var animref = this.graph.nodesInfo[node].animation;

 		if(animref.length > 0)
 		{
 			var idNode = this.graph.nodesInfo[node].id;
 			this.animations[idNode] = {};

 			for(var i = 0; i < animref.length; i++)
 			{
 				if(this.graph.animationsInfo[animref[i]].type == "linear"){

 					this.animations[idNode][i] = new LinearAnimation(this,
 						this.graph.animationsInfo[animref[i]].span, 
 						this.graph.animationsInfo[animref[i]].point);

 				}
 				else if(this.graph.animationsInfo[animref[i]].type == "circular"){

 					this.animations[idNode][i] = new CircularAnimation(this,
 						this.graph.animationsInfo[animref[i]].center, 
 						this.graph.animationsInfo[animref[i]].radius,
 						this.graph.animationsInfo[animref[i]].startang,
 						this.graph.animationsInfo[animref[i]].rotang,
 						this.graph.animationsInfo[animref[i]].span);

 				}
 			}
 		}	
 	}
 }

/**
 * onGraphLoaded
 * Handler called when the graph is loaded
 */
 XMLscene.prototype.onGraphLoaded = function () 
 {
	//Frustum
	this.camera.near = this.graph.initialsInfo.frustum.near;
	this.camera.far = this.graph.initialsInfo.frustum.far;

    //Axis
    this.axis = new CGFaxis(this, this.graph.initialsInfo.ref);

    //Illumination
    this.processIllumination();

	//Lights
	this.processLights();


	//Leaves
	this.processLeaves();
	//console.log(this.graph.nodesInfo);

	if(this.firstPlay == true)
		this.resetTab();

	

	//Textures
	this.processTextures();

	//Materials
	this.processMaterials();

	//Animations
	this.processAnimations();
	

	//Nodes
	for(node in this.graph.nodesInfo)
	{
		var tmatrix = mat4.create();
		for(trans in this.graph.nodesInfo[node].transformations){

			if(this.graph.nodesInfo[node].transformations[trans].type == "translation"){
				mat4.translate(tmatrix, tmatrix, 
					[this.graph.nodesInfo[node].transformations[trans].x, 
					this.graph.nodesInfo[node].transformations[trans].y, 
					this.graph.nodesInfo[node].transformations[trans].z]);
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "rotation"){
				var angle = this.graph.nodesInfo[node].transformations[trans].angle;
				var axis = this.graph.nodesInfo[node].transformations[trans].axis;
				if(axis == "x"){
					mat4.rotate(tmatrix, tmatrix, this.convertDegtoRad(angle), [1,0,0]);
				}
				else if(axis == "y"){
					mat4.rotate(tmatrix, tmatrix, this.convertDegtoRad(angle), [0,1,0]);						

				}
				else if(axis == "z"){
					mat4.rotate(tmatrix, tmatrix, this.convertDegtoRad(angle), [0,0,1]);	
				}				
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "scale"){
				mat4.scale(tmatrix,tmatrix,
					[this.graph.nodesInfo[node].transformations[trans].sx,
					this.graph.nodesInfo[node].transformations[trans].sy,
					this.graph.nodesInfo[node].transformations[trans].sz]);
			}
		}
		this.graph.nodesInfo[node].matrix = tmatrix;
	}
};

/**
 * checkIfLeaf
 * Method to determine if the node is a leaf through the node's id
 * @param id Leaf ID
 */
 XMLscene.prototype.checkIfLeaf = function (id){
 	for(var i in this.graph.leavesInfo){
 		if (id==this.graph.leavesInfo[i].id) return true;
 	}
 	return false;
 };



/**
 * processGraph
 * Method to process the graph's nodes
 * @param node Actual node of graph
 */	
 XMLscene.prototype.processGraph = function(node){

 	this.pushMatrix();

 	var material = node.material;
 	var texture = node.texture;
 	var animation = node.animation;
 	var animCounter = animation.length;
 	var nodeID = node.id;


 	if(texture != "null" ) {
 		if(material != "null"){
 			this.a_material=material;
 			this.a_texture=texture;
 			this.materials[material].setTexture(this.textures[texture]);
 			this.materials[material].apply();
 		}
 		else{
 			this.a_texture=texture;
 			this.materials[this.a_material].setTexture(this.textures[texture]);
 			this.materials[this.a_material].apply();
 		}
 	}
 	else if(material != "null"){
 		this.a_material=material;
 		if(this.a_texture!=undefined){
 			this.materials[material].setTexture(this.textures[this.a_texture]);
 		}
 		this.materials[material].apply();
 	}


 	this.multMatrix(node.matrix);

 	if(this.animations[nodeID] != undefined && animation.length > 0){
 		var animationMatrix;
 		var an = this.animations[nodeID][0];

 		if(this.animations[nodeID][0])
 			this.animations[nodeID][0].current = true;
 		if(this.animations[nodeID][node.index].finished && node.index < (animCounter-1))
 		{
 			node.index+=1;
 			this.animations[nodeID][node.index].current = true;
 		}

 		for(anim in this.animations[nodeID])
 		{
 			animationMatrix = this.animations[nodeID][anim].getMatrix();
 			if (animationMatrix != null){
 				this.multMatrix(animationMatrix);
 			}	
 		}

 	}

 	for(var i in node.descendants){

 		if(this.checkIfLeaf(node.descendants[i])){

 			if(this.a_texture==undefined){		
 				this.draw(nodeID,this.leaves[node.descendants[i]],1,1);
 			}
 			else{

 				this.draw(nodeID,this.leaves[node.descendants[i]], this.textures[this.a_texture].amp.s, this.textures[this.a_texture].amp.t);
 			}

 		}
 		else 
 			this.processGraph(this.graph.nodesInfo[node.descendants[i]]);
 	}

 	this.popMatrix();

 }

 XMLscene.prototype.registPiece = function(piece){

 	this.registerForPick(this.count, piece);
 	this.count++;
 }

/**
 * draw
 * Method to draw the primitives
 * @param leaf leaf of graph
 * @param s Amplification factor s
 * @param t Amplification factor t
 */
 XMLscene.prototype.draw = function(nodeID,leaf,s,t){

 	switch(leaf.type){ 
 		case "rectangle":

 		leaf.updateAmpl(s,t);
 		leaf.display();
 		break;
 		case "triangle":
 		leaf.updateAmpl(s,t);
 		leaf.display();
 		break;
 		case "cylinder":
 		this.scale(1,1,leaf.height);
 		leaf.display();
 		break;
 		case "sphere":
 		this.scale(leaf.radius*2, leaf.radius*2, leaf.radius*2);
 		leaf.display();
 		break;

 		case "plane":
 		leaf.display();
 		break;

 		case "patch":

 		leaf.display();
 		break;

 		case "terrain":
 		leaf.display();
 		break;

 		default:
 		return "Type of leaf " + leaf.type+ " does not exist!"; 
 		break;
 	}

 }

/**
* processInitialsTransformations
* Function that processes Initials Tranformations
*/
XMLscene.prototype.processInitialsTransformations = function(){
	this.translate(this.graph.initialsInfo.translation.x, 
		this.graph.initialsInfo.translation.y, 
		this.graph.initialsInfo.translation.z);

	this.rotate(this.convertDegtoRad(this.graph.initialsInfo.rotation['x']), 1,0,0);
	this.rotate(this.convertDegtoRad(this.graph.initialsInfo.rotation['y']), 0,1,0);
	this.rotate(this.convertDegtoRad(this.graph.initialsInfo.rotation['z']), 0,0,1);
	
	this.scale(this.graph.initialsInfo.scale.sx, 
		this.graph.initialsInfo.scale.sy, 
		this.graph.initialsInfo.scale.sz);
}

XMLscene.prototype.adjustPos = function(piece, i, j, xi, zi){
	piece.i = i;
	piece.j = j;
	piece.xi = xi;
	piece.zi = zi;
}

XMLscene.prototype.pecaHumAnim = function(piece){

	
	if(this.processing == true && this.picked == piece)
	{
		this.pickingAnimation.display();
		piece.display();
	}
	else if(this.pieceAnimStatus == 1 && this.picked == piece)
	{
		this.up.display();
		piece.display();
	}
	else if(this.pieceAnimStatus == 2 && this.picked == piece)
	{
		this.down.display();
		piece.display();
	}
	else
	{
		piece.display();
	}
}


XMLscene.prototype.pecaCompAnim = function(piece){

	 if(this.processing == true && piece == this.newPiece)
	{
		this.pickingAnimation.display();
		piece.display();
	}
	else
	{
		piece.display();
	}
	
}

XMLscene.prototype.neutronCompAnim = function(piece){

	console.log(piece);
	console.log(this.picked);
	if(this.processing == true && piece == this.neutron)
	{
		console.log("ENTREI AQUI");
		this.pickingAnimation.display();
		piece.display();
	}
	else
	{
		piece.display();
	}
	
	
}




XMLscene.prototype.displayPiecesAndCells = function()
{
	var nC = this.board.allTab.length;
	var nR = this.board.allTab[0].length;

	var xi = -3;
	var zi = 3; 

	for(var i = 0; i < nC;i++)
	{
		xi=xi+1;
		for(var j = 0; j < nR; j++)
		{
			zi = zi-1;
			if(this.board.allTab[i][j][0].type == 3)
			{
				if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
				this.neutron = this.board.allTab[i][j][0];
			} 
			if(this.board.allTab[i][j][1].type == 0)
			{
					//cells livres
					if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
					this.pushMatrix();
					this.registPiece(this.board.allTab[i][j][1]);
					this.translate(xi, 0, zi);
					this.board.allTab[i][j][1].display();
					this.popMatrix();
				}	
				else
				{	
					//cells não livres

					if(this.playerPlaying == 1 && this.firstPlay == true &&
						this.board.allTab[i][j][0].type == 1 )
					{
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
						this.pushMatrix();
						this.registPiece(this.board.allTab[i][j][0]);
						this.translate(xi, 0, zi);
						if((this.modeP2 == 2 && this.playerPlaying == 2)||(this.modeP1 == 2 && this.playerPlaying == 1)){
							this.pecaCompAnim(this.board.allTab[i][j][0]);
						}else if((this.modeP1 == 0 && this.playerPlaying == 1)||(this.modeP2 == 0 && this.playerPlaying == 2))
						{
							this.pecaHumAnim(this.board.allTab[i][j][0]);
						}
						this.popMatrix();

						if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][1].display();
						this.popMatrix();
						
						
					}
					else if(this.playerPlaying == 1 && this.firstPlay == false && this.board.allTab[i][j][0].type == 1 && this.nextPlay == 2)
					{
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
						this.pushMatrix();
						this.registPiece(this.board.allTab[i][j][0]);
						this.translate(xi, 0, zi);
						if((this.modeP2 == 2 && this.playerPlaying == 2)||(this.modeP1 == 2 && this.playerPlaying == 1)){
							this.pecaCompAnim(this.board.allTab[i][j][0]);
						}else if((this.modeP1 == 0 && this.playerPlaying == 1)||(this.modeP2 == 0 && this.playerPlaying == 2))
						{
							this.pecaHumAnim(this.board.allTab[i][j][0]);
						}
						this.popMatrix();

						if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][1].display();
						this.popMatrix();						
					}
					else if(this.playerPlaying == 2 && this.firstPlay == false && this.board.allTab[i][j][0].type == 2 && this.nextPlay == 2)
					{
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
						this.pushMatrix();
						this.registPiece(this.board.allTab[i][j][0]);
						this.translate(xi, 0, zi);
						if((this.modeP2 == 2 && this.playerPlaying == 2)||(this.modeP1 == 2 && this.playerPlaying == 1)){
							this.pecaCompAnim(this.board.allTab[i][j][0]);
						}else if((this.modeP1 == 0 && this.playerPlaying == 1)||(this.modeP2 == 0 && this.playerPlaying == 2))
						{
							this.pecaHumAnim(this.board.allTab[i][j][0]);
						}
						this.popMatrix();

						if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][1].display();
						this.popMatrix();
					}else if(this.firstPlay == false && this.nextPlay == 1 && this.board.allTab[i][j][0].type == 3){
						
						
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
						this.pushMatrix();
						this.registPiece(this.board.allTab[i][j][0]);
						this.translate(xi, 0, zi);
						if((this.modeP2 == 2 && this.playerPlaying == 2)||(this.modeP1 == 2 && this.playerPlaying == 1)){
							this.neutronCompAnim(this.board.allTab[i][j][0]);
						}else if((this.modeP1 == 0 && this.playerPlaying == 1)||(this.modeP2 == 0 && this.playerPlaying == 2))
						{
							this.pecaHumAnim(this.board.allTab[i][j][0]);
						}
						
						this.popMatrix();
						
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][1].display();
						this.popMatrix();
						

					}
					else
					{

						if(!this.processing) this.adjustPos(this.board.allTab[i][j][0],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][0].display();
						this.popMatrix();

						
						if(!this.processing) this.adjustPos(this.board.allTab[i][j][1],i,j,xi,zi);
						this.pushMatrix();
						this.translate(xi, 0, zi);
						this.board.allTab[i][j][1].display();
						this.popMatrix();
						
					}	
				}	
			}
			zi=3;
		}
	}



/**
* display
* Function that makes the scene display
*/
XMLscene.prototype.display = function () {


	//picking init
	this.logPicking();
	this.clearPickRegistration();

	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
	this.loadIdentity();

	this.applyViewMatrix();
	this.setDefaultAppearance();
	if(this.gameFinished != true)
	{
		this.pushMatrix();
	this.translate(0,1,-3);
	this.scale(0.5,0.5,0.5);
	this.timerPlayer2.display();

	this.popMatrix();

	this.pushMatrix();
	this.translate(-3,1,-3);
	this.scale(0.5,0.5,0.5);
	this.timerPlayer1.display();
	this.popMatrix();

	this.pushMatrix();
	this.translate(0,2.25,-3);
	this.scale(0.5,0.5,0.5);
	this.score.display();
	this.popMatrix();
	

	}
	else
	{
		this.PlayerWin();
		this.pushMatrix();
		this.translate(-3,1,-3);
		this.scale(0.5,0.5,0.5);
		this.timerPlayer1.displayWin(this.playerPlaying);
		this.popMatrix();


	}
	

	
	if(this.graph.loadedOk)
	{

		if(this.axis.length != 0) this.axis.display();

		for (i = 0; i < this.lights.length; i++){
			var id = this.lightIDs[i];
			eval("this.enLight = this.lightEnable"+i);

			if(this.enLight){
				this.lights[i].enable();
				this.lights[i].update();
			}
			else if(!this.enLight){
				this.lights[i].disable();
				this.lights[i].update();
			}
		}

		this.count = 1;

		this.processInitialsTransformations();

		this.processGraph(this.graph.nodesInfo[this.graph.root_id]);

		if(this.playerPlaying == 1 && this.gameFinished != true && this.modeP1 !=2)
			this.PlayerWhite();
		else if(this.playerPlaying == 2 && this.gameFinished != true && this.modeP2 !=2)
			this.PlayerBlack();

		
		if((this.modeP1 == 2 && this.playerPlaying == 1) || (this.modeP2 == 2 && this.playerPlaying == 2))
		{
			if(this.neutronPlaying == false && this.nextPlay == 1)
			{
				this.neutronPlaying = true;
				this.setPickEnabled(false);
				this.gameComputador();
				this.setPickEnabled(true);
			}else if (this.compPlaying == false && this.nextPlay == 2)
			{
				this.compPlaying = true;
				this.setPickEnabled(false);
				this.gameComputador();
				this.setPickEnabled(true);
			}
			
		}
		
		this.displayPiecesAndCells();

	};	
};

XMLscene.prototype.timeOut = function(){
	if(this.firstPlay == true)
	{
		console.log("Player " + this.playerPlaying + " lost your chance to play!");
		console.log("Match played " + this.nextPlay);
		this.nextPlay = 1;
		console.log("Match to play " + this.nextPlay);
		this.playerPlaying = 2;
		console.log("Player " + this.playerPlaying + " it's your turn!");
		this.firstPlay = false;
	}
	else{
		console.log("Match played " + this.nextPlay);
		if(this.nextPlay == 1){
			console.log("Match to play " + this.nextPlay);
			this.nextPlay = 2;
		} 
		else if(this.nextPlay == 2)
		{
			console.log("Match to play " + this.nextPlay);
			this.nextPlay = 1;
			console.log("Player " + this.playerPlaying + " lost your chance to play!");
			if(this.playerPlaying == 1) this.playerPlaying = 2;
			else this.playerPlaying = 1;
			console.log("Player " + this.playerPlaying + " it's your turn!");
		} 
	}
}

XMLscene.prototype.updatePiecePos = function()
{
	if((this.modeP1 == 2 && this.playerPlaying == 1) || (this.modeP2 == 2 && this.playerPlaying == 2))
	{
		if(this.nextPlay == 1)
		{
			this.board.allTab[this.neutron.i][this.neutron.j][0] = 0;
			this.board.allTab[this.neutron.i][this.neutron.j][1].type = 0;

			this.board.allTab[this.response[4]][this.response[5]][0] = this.neutron;
			this.board.allTab[this.response[4]][this.response[5]][1].type = 1;
		}
		else
		{
			this.board.allTab[this.oldPos.i][this.oldPos.j][0] = 0;
			this.board.allTab[this.oldPos.i][this.oldPos.j][1].type = 0;

			this.board.allTab[this.newPos.i][this.newPos.j][0] = this.newPiece;
			this.board.allTab[this.newPos.i][this.newPos.j][1].type = 2;
		}
		

	}else
	{
		this.board.allTab[this.picked.i][this.picked.j][0] = 0;
		this.board.allTab[this.picked.i][this.picked.j][1].type = 0;

		this.board.allTab[this.pickedDestine.i][this.pickedDestine.j][0] = this.picked;
		this.board.allTab[this.pickedDestine.i][this.pickedDestine.j][1].type = 1;
	}
	
}


/**
* update
* Function that makes the scene update
* @param curtime Program time
*/
XMLscene.prototype.update = function(curtime){


	for(node in this.animations){
		
		var animationsNode = this.animations[node];
		
		for(anim in animationsNode){
			if(animationsNode[anim].current)
			{
				animationsNode[anim].update(curtime);
			}
		}
	}

	if(this.pieceAnimStatus == 1)
	{
		this.up.update(curtime);
	}
	else if(this.pieceAnimStatus == 2)
	{
		this.down.update(curtime);
	}

	if(this.processing == true)
	{
		this.pickingAnimation.update(curtime);
		if(this.pickingAnimation.ended == true && this.gameFinished != true)
		{
			this.updatePiecePos();

			if((this.modeP1 == 0 && this.playerPlaying == 1 && this.nextPlay == 2) || (this.modeP2 == 0 && this.playerPlaying ==2 && this.nextPlay == 2))
			{
				console.log("Player Playing: "+ this.playerPlaying);
				this.playerPlaying = this.response[0];
				console.log("Player at next: " + this.playerPlaying);
				console.log("New Play: " + this.response[1]);
				if(this.firstPlay == true)
				{
				console.log("First Play!");
				this.firstPlay = false;
				this.nextPlay = 1;
				}
				else
				{
					this.nextPlay = this.response[1];
				}

				console.log("NX "+ this.response[3]);
				console.log("NY "+ this.response[4]);

				this.setPickEnabled(true);
				this.picked = null;
				this.pickedDestine = null;
				this.processing = false;
				this.neutronPlaying = false;
				this.compPlaying = false;
			}
			else if((this.modeP1 == 2 && this.playerPlaying == 1 && this.nextPlay == 2) || (this.modeP2 == 2 && this.playerPlaying ==2 && this.nextPlay == 2))
			{
				console.log("Player Playing: "+ this.playerPlaying);
				this.playerPlaying = this.response[0];
				console.log("Player at next: " + this.playerPlaying);
				console.log("New Play: " + this.response[1]);
				this.nextPlay = this.response[1];
				this.setPickEnabled(true);
				this.picked = null;
				this.pickedDestine = null;
				this.processing = false;
				this.neutronPlaying = false;
				this.compPlaying = false;
			}
			else if((this.modeP1 == 2 && this.playerPlaying == 1 && this.nextPlay == 1) || (this.modeP2 == 2 && this.playerPlaying ==2 && this.nextPlay == 1))
			{
				console.log(this.response);
				this.nextPlay = this.response[1];
				console.log("New Play: " + this.response[1])

				console.log("Player Playing: "+ this.playerPlaying);

				console.log("NX "+ this.response[4]);
				console.log("NY "+ this.response[5]);

				this.setPickEnabled(true);
				this.processing = false;

							
			}
			else if((this.modeP1 == 0 && this.playerPlaying == 1 && this.nextPlay == 1) || (this.modeP2 == 0 && this.playerPlaying ==2 && this.nextPlay == 1))
			{
				console.log(this.response);
				this.nextPlay = this.response[1];
				console.log("New Play: " + this.response[1])

				console.log("Player Playing: "+ this.playerPlaying);

				console.log("NX "+ this.response[4]);
				console.log("NY "+ this.response[5]);

				this.setPickEnabled(true);
				this.picked = null;
				this.pickedDestine = null;
				this.processing = false;
			}
			
		} 	
	}

	if(this.gameFinished != true)
	{
		if(!this.timerPlayer1.timeBeg && this.playerPlaying == 1) this.timerPlayer1.timeBeg = curtime;
	if(this.playerPlaying == 1) this.timerPlayer1.updateTime(curtime);
	if(this.timerPlayer1.seconds == this.gameDiff  && this.playerPlaying == 1)
	{
		this.timeOut();
		this.score.setCounters(this.timerPlayer1.seconds,0);
		this.timerPlayer1.timeBeg = null;
		if(this.picked != null)
		{
			this.down.update(curtime);
			this.picked = null;
		} 	 
	}

	if(!this.timerPlayer2.timeBeg && this.playerPlaying ==2) this.timerPlayer2.timeBeg = curtime;
	if(this.playerPlaying == 2) this.timerPlayer2.updateTime(curtime);
	if(this.timerPlayer2.seconds == this.gameDiff && this.playerPlaying == 2)
	{
		this.timeOut();
		this.score.setCounters(0, this.timerPlayer2.seconds);
		this.timerPlayer2.timeBeg = null;	 
		if(this.picked != null)
		{
			this.down.update(curtime);
			this.picked = null;

		}
	}

	}

	if(this.camMoving) {
		if(!this.camTransBeg) this.camTransBeg = curtime;
		else
		{
			var time_since_start = curtime - this.camTransBeg;
			if(time_since_start>=this.camTime) { 
				this.camera.setPosition(this.camDestine);
				this.camTransBeg=null;
				this.camMoving=false;
			}
			else {
				var time_perc = time_since_start / this.camTime;
				var new_pos = [this.camOrg[0]+(this.transitionVec[0]*time_perc),
				this.camOrg[1]+(this.transitionVec[1]*time_perc),
				this.camOrg[2]+(this.transitionVec[2]*time_perc)];
				this.camera.setPosition(new_pos);
			}
		}
	}
}


/*****
* TP3 - initialize Board
****/
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
