function Piece(scene, posX, posY, type) {
 	CGFobject.call(this,scene);

	this.scene = scene;

	this.type = type;

	this.material = this.type.material;
	this.texture = this.type.texture;

	this.xi = posX;
	this.yi = posY;
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

 	// Set Material e Textura
 	this.scene.materials[this.material].setTexture(this.scene.textures[this.texture]);
	this.scene.materials[this.material].apply();


 	this.scene.pushMatrix();
 	
 	this.scene.translate(this.xi, 0, this.yi);
 	this.processTransformations(this.type);
 	this.processTransformations(this.scene.graph.nodesInfo[this.type.descendants[0]]);
 	this.scene.leaves[this.scene.graph.nodesInfo[this.type.descendants[0]].descendants[0]].display();
 	this.scene.popMatrix();

 	
 	this.scene.pushMatrix();
 	this.scene.translate(this.xi, 0, this.yi);
 	this.processTransformations(this.type);
 	this.processTransformations(this.scene.graph.nodesInfo[this.type.descendants[1]]);
 	this.scene.leaves[this.scene.graph.nodesInfo[this.type.descendants[1]].descendants[0]].display();
 	this.scene.popMatrix();

 	this.scene.popMatrix();

};

