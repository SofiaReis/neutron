function Tab(scene) {
       
        CGFobject.call(this,scene);

        this.scene = scene;
        
        this.player1 = "Player 1";
        this.player2 = "Player 2";

       // this.base = new CGFtexture(this.scene, );


        //Marcadores 
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
 
    var temp = obj.constructor(); // give temp the original obj's constructor
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

 		for(var j = 0; j < this.nR; ++j)
 		{
 			zi = zi-1;
 			if(this.tab[i][j] == 1){
 				var piece = cloneObject(this.scene.graph.pieces['peça_white']);
 				piece.id = "peça_white"+i+j;
 				var ind = piece.transformations.length;
 				
 				piece.transformations[ind] = {};
 				piece.transformations[ind].type = "translation";
 				piece.transformations[ind].x = xi;
 				piece.transformations[ind].y = 0;
 				piece.transformations[ind].z = zi;
 				piece.transformations.reverse();
 				this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.push(piece.id);
 				this.scene.graph.nodesInfo[piece.id] = piece;
 				//this.scene.registerForPick(i+j+1, this.scene.graph.nodesInfo[piece.id]);
 				//console.log(i+j+1);
 				//console.log(this.scene.graph.nodesInfo[piece.id]);

 				col.push(piece);
 			}
 			else if(this.tab[i][j] == 2){

 				var piece = cloneObject(this.scene.graph.pieces['peça_black']);
 				piece.id = "peça_black"+i+j;
 				var ind = piece.transformations.length;
 				piece.transformations[ind] = {};
 				piece.transformations[ind].type = "translation";
 				piece.transformations[ind].x = xi;
 				piece.transformations[ind].y = 0;
 				piece.transformations[ind].z = zi;
 				piece.transformations.reverse();

				this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.push(piece.id);
 				this.scene.graph.nodesInfo[piece.id] = piece;
 				col.push(piece);
 			}
 			else if(this.tab[i][j] == 3)
 			{
 				
 				var piece = cloneObject(this.scene.graph.pieces['peça_neutron']);
 				piece.id = "peça_neutron"+i+j;
 				var ind = piece.transformations.length;
 				piece.transformations[ind] = {};
 				piece.transformations[ind].type = "translation";
 				piece.transformations[ind].x = xi;
 				piece.transformations[ind].y = 0;
 				piece.transformations[ind].z = zi;
 				piece.transformations.reverse();

 				this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.push(piece.id);
 				this.scene.graph.nodesInfo[piece.id] = piece;
 				col.push(piece);
 			}
 			else
 			{
 				
 				var piece = cloneObject(this.scene.graph.pieces['empty_space']);
 				piece.id = "empty_space"+i+j;
 				var ind = piece.transformations.length;
				piece.transformations[ind] = {};
 				piece.transformations[ind].type = "translation";
 				piece.transformations[ind].x = xi;
 				piece.transformations[ind].y = 0;
 				piece.transformations[ind].z = zi;
 				piece.transformations.reverse();
 				this.scene.graph.nodesInfo[piece.id] = piece;
 				this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.push(piece.id);
 				col.push(piece);
 			}
 		}
 		
 		zi=3;
 		this.pieces.push(col);		
 	}

 	for(var i = 0; i < this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.length-1;i++)
 	{
 		var descendant = this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i];
 		if(this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i] == "peça_black" ||
 			this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i] == "peça_white" ||
 			this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i] == "peça_neutron"  ||
 			this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants[i] == "empty_space")
 		{
 			var index = this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.indexOf(descendant);
 			if (index > -1) {
    			this.scene.graph.nodesInfo[this.scene.graph.root_id].descendants.splice(index, 1);
			}
 		}
 	}
 };


