function Tab(scene) {
       
        CGFobject.call(this,scene);

        this.scene = scene;

        this.pieces = [];
        this.cells = [];
        this.allTab = [];

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
    this.cells = [];
    this.allTab = [];

 	this.nR = this.tab.length;
 	this.nC = this.tab[0].length;

 	var piece = null;
 	var cell = null;
 	var xi = -3;
 	var zi = 3; 	
 	for(var i = 0; i < this.nR; ++i)
 	{
 		xi=xi+1;
 		var lin = [];

 		for(var j = 0; j < this.nC; ++j)
 		{
 			zi = zi-1;
 			var pos = new Array(2);
 			if(this.tab[i][j] == 1){
 				piece = new Piece(this.scene,xi,zi,i,j,cloneObject(this.scene.graph.pieces['peça_white']),1);

 				cell = new Cell(this.scene,xi,zi,i,j, cloneObject(this.scene.graph.pieces['cell']),1);

 				pos[0] = piece;
 				pos[1] = cell;

 				lin.push(pos);
 			}
 			else if(this.tab[i][j] == 2){
 				piece = new Piece(this.scene,xi,zi,i,j,cloneObject(this.scene.graph.pieces['peça_black']),2);

 				cell = new Cell(this.scene,xi,zi,i,j, cloneObject(this.scene.graph.pieces['cell']),1);
 				
 				pos[0] = piece;
 				pos[1] = cell;

 				lin.push(pos);
 			}
 			else if(this.tab[i][j] == 3)
 			{
 				piece = new Piece(this.scene,xi,zi,i,j,cloneObject(this.scene.graph.pieces['peça_neutron']),3);

 				cell = new Cell(this.scene,xi,zi,i,j, cloneObject(this.scene.graph.pieces['cell']),1);
 				
 				pos[0] = piece;
 				pos[1] = cell;

 				lin.push(pos);
 			}
 			else if(this.tab[i][j] == 0)
 			{
 				cell = new Cell(this.scene,xi,zi,i,j, cloneObject(this.scene.graph.pieces['cell']),0);
 				
 				pos[0] = 0;
 				pos[1] = cell;

 				lin.push(pos);
 			}
 		}
 		
 		zi=3;	
 		this.allTab.push(lin);
 	}

 	this.removeDescendant("peça_white");
 	this.removeDescendant("peça_black");
 	this.removeDescendant("peça_neutron");
 	this.removeDescendant("cell");
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

