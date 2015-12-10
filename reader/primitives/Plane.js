function Plane(scene, parts) {

	CGFobject.call(this,scene);
	this.parts = parts;
	
	this.initBuffers();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;

Plane.prototype.initBuffers = function() {
  
	this.makeSurface(1, 1, 
		[0,0,1,1], [0,0,1,1], 
				[	// U = 0
						[ // V = 0..1;
							 [-1.0, 0.0, 1.0, 1 ],
							 [-1.0,  0.0, -1.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 1.0, 0.0, 1.0, 1 ],
							 [ 1.0, 0.0, -1.0, 1 ]							 
						]
					]);
};

Plane.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this.scene, getSurfacePoint,this.parts,this.parts);

};

Plane.prototype.display = function() {
	this.surface.display();
};