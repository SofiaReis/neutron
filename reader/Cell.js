function Cell(scene,xi,zi) {
 	CGFobject.call(this,scene);

 	this.scene = scene;
 	this.xi = xi;
 	this.zi = zi;

 	this.plan = new Plane(this.scene, 20);	
};

Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.display = function() {

	this.scene.pushMatrix();

	this.scene.translate(this.xi, -0.1, this.zi);
	this.scene.scale(0.5,0,0.5);
	this.plan.display();
 
	

	this.scene.popMatrix();

}