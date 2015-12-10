/**
* Class CircularAnimation
* Representes Circular Animation and it's a subclasse of Animation
*/

/**
* Constructor
* Creates object CircularAnimation
* @param scene Class CGFScene
* @param center Center of animation
* @param radius Radius of animation
* @param angle_init Initial Angle
* @param angle_rot Animation Angle
* @param time Animation time
*/
function CircularAnimation(scene, center, radius, angle_init, angle_rot, time){
	
	Animation.call(this, scene, time);
	this.radius = radius;
	this.startang = angle_init;
	this.rotang = angle_rot;
	this.span = time;

	this.id = 2;
	this.center = center.split(" ");
	this.initial = true;
	this.finished = false;
	
	this.time = Date.now();
	this.currtime = Date.now();
	this.current = false;
	this.init();
}
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
* init
* Initializes variables that are used in the calculus on Animation update.
*/
CircularAnimation.prototype.init = function () {

	this.finalAng = this.startang + this.rotang;
	this.speed = this.rotang/(this.span*1000);
	this.currentang = this.startang;
};

/**
* update
* Function that updates the animatition during the time.
*/
CircularAnimation.prototype.update = function (curtime) {

	if(this.currentang <= this.finalAng){

		if(this.initial){
			this.initial = false;
			this.time = curtime;
			this.currtime = curtime;
		}
		else{
			this.currtime = curtime;
		}

		this.currentang = this.startang + (this.speed * (this.currtime - this.time));

		//TRANSFORMATIONS
		mat4.identity(this.matrix);
		mat4.translate(this.matrix, this.matrix,[parseFloat(this.center[0]),
			parseFloat(this.center[1]),
			parseFloat(this.center[2])]);
		mat4.rotate(this.matrix, this.matrix, (this.currentang*Math.PI)/180.0, [0,1,0]);
		mat4.translate(this.matrix, this.matrix,[this.radius,0,0]);
	}
	else{
		
		this.finished = true;
	}
};

