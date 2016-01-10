function PickingAnimation(scene, time, xi, zi, xf, zf){
	
	Animation.call(this, scene, time);

	
 	this.x0 = xi;
 	this.z0 = zi;
 	this.xf = xf;
 	this.zf = zf;

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

PickingAnimation.prototype.update = function (curtime) {

	this.dx = (this.xf - this.x0) * curtime / this.time;
	this.dz = (this.zf - this.z0) * curtime / this.time;
	var angle = this.angle * curtime / this.time;

	this.currX += this.dx;
	this.currZ += this.dz;
	this.elapsedAngle += angle;

	this.currY = 6 * Math.sin(this.elapsedAngle);

	this.acumulatedDistance += Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dz, 2));

	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix,[this.currX, this.currY, this.currZ]);
	mat4.rotate(this.matrix, this.matrix,this.elapsedAngle, [0, 1, 0]);
}
