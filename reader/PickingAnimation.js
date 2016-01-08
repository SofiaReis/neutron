function PickingAnimation(scene, time, xi, zi, xf, zf){
	
	Animation.call(this, scene, time);

	
 	this.x0 = xi * 2.5 + 5;
 	this.z0 = zi * 2.5 + 5;
 	this.xf = xf * 2.5 + 5;
 	this.zf = zf * 2.5 + 5;

 	this.currX = 0;
 	this.currZ = 0;
 	this.currY = 0;

 	this.distance = Math.sqrt(Math.pow(this.xf - this.x0, 2) + Math.pow(this.zf - this.z0, 2));
 	this.acumulatedDistance = 0;
 	this.time = 5;

 	this.angle = Math.PI;
 	this.elapsedAngle = 0;
 	this.finished = false;
}
PickingAnimation.prototype = Object.create(Animation.prototype);
PickingAnimation.prototype.constructor = PickingAnimation;

PickingAnimation.prototype.update = function (deltaTime) {

	this.dx = (this.xf - this.x0) * deltaTime / this.time;
	this.dz = (this.zf - this.z0) * deltaTime / this.time;
	var angle = this.angle * deltaTime / this.time;

	this.currX += this.dx;
	this.currZ += this.dz;
	this.elapsedAngle += angle;

	this.currY = 6 * Math.sin(this.elapsedAngle);

	this.acumulatedDistance += Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dz, 2));

	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix,[this.currX, this.currY, this.currZ]);
	mat4.rotate(this.matrix, this.matrix,this.elapsedAngle, [0, 1, 0]);
}
