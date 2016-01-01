function Tab(scene) {
       
        CGFobject.call(this,scene);

        this.scene = scene;
        
        this.player1 = "Player 1";
        this.player2 = "Player 2";
 
        this.p1Points = 0;
        this.p2Points = 0;

        this.pieces = [];

        console.log("Tab created!");

        this.initBuffers();
};

 Tab.prototype = Object.create(CGFobject.prototype);
 Tab.prototype.constructor = Tab;

 function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); 
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}

 Tab.prototype.init = function(matrix) {
 	this.tab = matrix;

 	this.nR = this.tab.length;
 	this.nC = this.tab[0].length;

 	var xi = -3;
 	var zi = 3; 	
 	for(var i = 0; i < this.nC; ++i)
 	{
 		xi=xi+1;
 		var col = [];
 		var line = [];

 		for(var j = 0; j < this.nR; ++j)
 		{
 			zi = zi-1;
 			if(this.tab[i][j] == 1){
 				var piece = new Piece(this.scene, xi,zi,cloneObject(this.scene.graph.pieces['peça_white']));
 				col.push(piece);
 			}
 			else if(this.tab[i][j] == 2){
 				var piece = new Piece(this.scene, xi,zi,cloneObject(this.scene.graph.pieces['peça_black']));
 				col.push(piece);
 			}
 			else if(this.tab[i][j] == 3)
 			{
 				var piece = new Piece(this.scene, xi,zi,cloneObject(this.scene.graph.pieces['peça_neutron']));
 				col.push(piece);
 			}
 		}
 		
 		zi=3;
 		this.pieces.push(col);		
 	}
 	this.removeDescendant("peça_white");
 	this.removeDescendant("peça_black");
 	this.removeDescendant("peça_neutron");
 };


Tab.prototype.removeDescendant = function(type){

	for(var i = 0; i < this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.length;i++)
 	{
 		var descendant = this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i];
 		if(this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i] == type)
 		{
 			var index = this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.indexOf(descendant);
 			if (index > -1) {
    			this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.splice(index, 1);
			}
 		}
 	}
}

