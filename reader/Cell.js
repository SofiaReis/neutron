function Cell(scene,xi,zi,obj,type) {
 	CGFobject.call(this,scene);

 	this.scene = scene;
 	this.xi = xi;
 	this.zi = zi;
 	this.objPiece = obj;
 	this.type = type;
 	this.material = this.objPiece.material;
};

Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.display = function() {

	this.scene.pushMatrix();	
	this.scene.translate(this.xi, 0, this.zi);
	this.processTransformations(this.objPiece);
	this.scene.leaves[this.objPiece.descendants[0]].display();
	this.scene.popMatrix();

}

Cell.prototype.processTransformations = function(descendant)
{
	var x = 0; var y = 0; var z = 0;
	var len = descendant.transformations.length;
	for(var i = 0; i < len; i++)
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