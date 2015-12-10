/**
 * Class Animation
 * Main class for representing one Animation
 */

 /**
 * Constructor
 * Create the object Animation
 * @param scene CGFscene object
 * @param time Time for animation
 */
function Animation(scene, time){
	this.scene = scene;
	this.time = time;	
	this.matrix = mat4.create();
}
Animation.prototype.constructor = Animation;

/**
 * getMatrix
 * Gets object matrix.
 * @return matrix Animation matrix
 */
Animation.prototype.getMatrix = function(){
	return this.matrix;
}