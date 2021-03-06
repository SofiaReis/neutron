function Piece(scene,xi, zi, i,j,obj,type) {
 	CGFobject.call(this,scene);

	this.scene = scene;

	this.objPiece = obj;

	this.material = this.objPiece.material;
	this.texture = this.objPiece.texture;

	this.i = i;
	this.j = j;

	this.xi = xi;
	this.zi = zi;

	this.type = type;
	this.height = 0;
};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.processTransformations = function(descendant)
{
	var x = 0; var y = 0; var z = 0;

	for(var i = 0; i < descendant.transformations.length; i++)
	{
		if(descendant.transformations[i].type == "scale")
		{
			this.scene.scale(descendant.transformations[i].sx,descendant.transformations[i].sy,descendant.transformations[i].sz);
		}
		else if(descendant.transformations[i].type == "translation")
		{
			this.scene.translate(descendant.transformations[i].x, descendant.transformations[i].y, descendant.transformations[i].z);
		}
		else if(descendant.transformations[i].type == "rotation")
		{
			if(descendant.transformations[i].axis == "x") x=1;
			else if(descendant.transformations[i].axis == "y") y=1;
			else if(descendant.transformations[i].axis == "z") z=1;
			this.scene.rotate(this.scene.convertDegtoRad(descendant.transformations[i].angle), x,y,z);
		}
		x=0;y=0;z=0;
	}

}

Piece.prototype.display = function() {

 	this.scene.pushMatrix();

 	this.scene.materials[this.material].setTexture(this.scene.textures[this.texture]);
	this.scene.materials[this.material].apply();

 	this.scene.pushMatrix();
 	this.processTransformations(this.objPiece);
 	this.processTransformations(this.scene.graph.nodesInfo[this.objPiece.descendants[0]]);
 	this.scene.leaves[this.scene.graph.nodesInfo[this.objPiece.descendants[0]].descendants[0]].display();
 	this.scene.popMatrix();

 	
 	this.scene.pushMatrix();
 	this.processTransformations(this.objPiece);
 	this.processTransformations(this.scene.graph.nodesInfo[this.objPiece.descendants[1]]);
 	this.scene.leaves[this.scene.graph.nodesInfo[this.objPiece.descendants[1]].descendants[0]].display();
 	this.scene.popMatrix();

 	this.scene.popMatrix();

};

