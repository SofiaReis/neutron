function Piece2(scene, id1,id2) {
 	CGFobject.call(this,scene);

 	this.scene = scene;

 	this.id1 = id1;
 	this.id2 = id2;
	
	this.height = 0;
	
};

Piece2.prototype = Object.create(CGFobject.prototype);
Piece2.prototype.constructor = Piece2;

Piece2.prototype.display = function() {

 	this.scene.pushMatrix();
 		
 	this.scene.popMatrix();

};