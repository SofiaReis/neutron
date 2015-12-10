/**
 * Class Sphere 
 * Responsible for drawing the Sphere primitive.
 */


 /**
 * Constructor
 * Creates the object Sphere
 * @param scene Class CGFScene
 * @param rad Radius Sphere
 * @param stacks Stacks of Sphere
 * @param slices Slices of Sphere
 */
function Sphere(scene, rad, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.radius=rad;

 	this.initBuffers();
 };
 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

/**
 * initBuffers
 * Function that calculates what is necessary to draw the cylinder (vertexes of the solid,
 * normals for the lights and textcoords for texture application)
 */
 Sphere.prototype.initBuffers = function() {

	var ang_slices = 360 * (Math.PI /180.0) / this.slices;
	var ang_stacks = 180 * (Math.PI /180.0) / this.stacks;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var angStacks = 0;
	var ang_stacks_then = ang_stacks;
	var ind_j = 0;
	var aux_j = 4 * this.slices;
	
	for (j = 0; j < this.stacks; j++) {
		
		var ang_slices_now = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {

			var x0 = (Math.sin(angStacks) * Math.cos(ang_slices_now))/2;
			var y0 = Math.cos(angStacks)/2;
			var z0 = (Math.sin(angStacks) * Math.sin(ang_slices_now))/2;

			var x2 = (Math.sin(ang_stacks_then) * Math.cos(ang_slices_now))/2;
			var y2 = Math.cos(ang_stacks_then)/2;
			var z2 = (Math.sin(ang_stacks_then) * Math.sin(ang_slices_now))/2;

			ang_slices_now += ang_slices;

			var x1= (Math.sin(angStacks) * Math.cos(ang_slices_now))/2;
			var y1 = Math.cos(angStacks)/2;
			var z1 = (Math.sin(angStacks) * Math.sin(ang_slices_now))/2;

			var x3 = (Math.sin(ang_stacks_then) * Math.cos(ang_slices_now))/2;
			var y3 = Math.cos(ang_stacks_then)/2;
			var z3 = (Math.sin(ang_stacks_then) * Math.sin(ang_slices_now))/2;

			this.vertices.push(x0);
			this.vertices.push(y0);
			this.vertices.push(z0); 

			this.vertices.push(x1);
			this.vertices.push(y1);
			this.vertices.push(z1); 

			this.vertices.push(x2)
			this.vertices.push(y2);
			this.vertices.push(z2);

			this.vertices.push(x3);
			this.vertices.push(y3);
 			this.vertices.push(z3);

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j); 	
			this.indices.push(ind_i_j + 1); 
			this.indices.push(ind_i_j + 2); 

			this.indices.push(ind_i_j + 3); 
			this.indices.push(ind_i_j + 2);
			this.indices.push(ind_i_j + 1); 

			ind_i += 4;

			this.normals.push(x0);
			this.normals.push(y0);
			this.normals.push(z0);
			
			
            this.normals.push(x1);
			this.normals.push(y1);
			this.normals.push(z1);

			
			this.normals.push(x2);
			this.normals.push(y2);
			this.normals.push(z2);
			
			
            this.normals.push(x3);
			this.normals.push(y3);
			this.normals.push(z3);

			
			this.texCoords.push(0.5 - i / this.slices, j / this.stacks);
			this.texCoords.push(0.5 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(0.5- i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(0.5 - (i + 1) / this.slices, (j + 1) / this.stacks);
		}

		angStacks += ang_stacks;
		ang_stacks_then += ang_stacks;
		ind_j += aux_j;

	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };