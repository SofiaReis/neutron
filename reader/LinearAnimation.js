/**
* Class LinearAnimation
* Representes Linear Animation and it's a subclasse of Animation
*/

/**
* Constructor
* Creates object LinearAnimation
* @param scene Class CGFScene
* @param time Animation time
* @param c_points Array with Animation Control points
*/
function LinearAnimation(scene, time, c_points){
	
	Animation.call(this, scene, time);

	this.id = 1;

	this.c_points = c_points;
	this.span = time;
	this.dist = 0;
	this.startTime = 0;
	this.currtime = 0;
	this.initial = true;
	this.current = false;
	this.rotAng = 0;
	this.finished = false;

	this.init();
}
LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/**
* init
* Initializes variables that are used in the calculus on Animation update.
*/
LinearAnimation.prototype.init = function () {

	this.directions = [];
	this.index=0;


	for(var i = 0; i < (this.c_points.length-1); i++){
		var v = vec3.fromValues(
			this.c_points[i+1].xx - this.c_points[i].xx,
			this.c_points[i+1].yy - this.c_points[i].yy,
			this.c_points[i+1].zz - this.c_points[i].zz);

		var distVec = Math.sqrt(Math.pow(v[0],2)+
			Math.pow(v[1],2)+
			Math.pow(v[2],2));
		this.dist += distVec;
		this.directions[i] = v;
	}

	this.tranX = this.c_points[0].xx;
	this.tranY = this.c_points[0].yy;
	this.tranZ = this.c_points[0].zz;

	this.speed = this.dist/this.span;	
}

/**
* update
* Function that updates the animatition during the time.
*/
LinearAnimation.prototype.update = function (curtime){

	if(this.index<(this.c_points.length-1) &&
		this.tranX==this.c_points[this.index+1].xx &&
		this.tranY==this.c_points[this.index+1].yy &&
		this.tranZ==this.c_points[this.index+1].zz)
	{
		this.index++;
	}
	if(this.index == (this.c_points.length-1))
	{
		this.finished = true;
	}

	if(this.initial)
	{
		this.initial = false;
		this.startTime = 0;
		this.currtime = curtime;
	}
	else
	{
		this.currtime = curtime;
	}

	if(!this.finished)
	{
		var delta = (this.currtime - this.startTime)*0.001;
		this.startTime = this.currtime;
		var vel = (this.dist/this.span)*delta;

			var d_norm = Math.sqrt(Math.pow(this.directions[this.index][0],2)
				+Math.pow(this.directions[this.index][1],2)
				+Math.pow(this.directions[this.index][2],2));
			if(d_norm != 0){
				this.directions[this.index][0] /= d_norm;
				this.directions[this.index][1] /= d_norm;
				this.directions[this.index][2] /= d_norm;
			}

		this.directions[this.index][0] *= vel;
		this.directions[this.index][1] *= vel;
		this.directions[this.index][2] *= vel;

		this.tranX +=this.directions[this.index][0];
		this.tranY +=this.directions[this.index][1];
		this.tranZ +=this.directions[this.index][2];

		if((this.directions[this.index][0] > 0 && this.tranX > this.c_points[this.index+1].xx) || (this.directions[this.index][0] < 0 && this.tranX < this.c_points[this.index+1].xx))
			this.tranX = this.c_points[this.index+1].xx;
		if((this.directions[this.index][1] > 0 && this.tranY > this.c_points[this.index+1].yy) || (this.directions[this.index][1] < 0 && this.tranY < this.c_points[this.index+1].yy))
			this.tranY = this.c_points[this.index+1].yy;
		if((this.directions[this.index][2] > 0 && this.tranZ > this.c_points[this.index+1].zz) || (this.directions[this.index][2] < 0 && this.tranZ < this.c_points[this.index+1].zz))
			this.tranZ = this.c_points[this.index+1].zz;

		//ANGLE CALCULUS
		var AB = vec2.fromValues(this.c_points[this.index+1].xx-this.c_points[this.index].xx,
			this.c_points[this.index+1].zz-this.c_points[this.index].zz);

		var BC = vec2.fromValues(0,1);

		this.rotAng = Math.acos(((AB[0]*BC[0])+(AB[1]*BC[1]))/
				(Math.sqrt(Math.pow(AB[0],2)+Math.pow(AB[1],2))+
				Math.sqrt(Math.pow(BC[0],2)+Math.pow(BC[1],2))))*(180/Math.PI);

		// TRANSFORMATIONS
		mat4.identity(this.matrix);
		mat4.translate(this.matrix, this.matrix,[this.tranX, this.tranY, this.tranZ]);
		mat4.rotate(this.matrix, this.matrix,this.rotAng, [0, 1, 0]);
	
	}
}
