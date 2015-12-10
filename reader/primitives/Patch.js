/**
* Class Patch
* Responsible for drawing Nurbs with order between 1 and 3.
*/

/**
* Constructor 
* Creates the object Patch
* @param scene Class CGFscene
* @param order Nurb order (U and V)
* @param partsU Number of partes in U
* @param partsV Number of partes in V
* @param c_points Array with all control points
*/
function Patch(scene, order, partsU, partsV, c_points) {

	CGFobject.call(this, scene);

	this.knots = createKnot(order);
	this.partsU = partsU;
	this.partsV = partsV;
	this.order = order;
	this.controlVertexes = createMatrixCV(order, c_points);

	this.initBuffers();
}
Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor=Patch;


/**
* initBuffers 
* Calls the function makeSurface
*/
Patch.prototype.initBuffers = function() {

	 this.makeSurface(this.order, 
					 this.order, 
					this.knots,
					this.knots, 
					this.controlVertexes);

}

/**
* makeSurface 
* Responsable for create the nurb and is respective object
* @param degree1 Nurb order U
* @param degree2 Nurb order V
* @param knots1 Nurb Knot U
* @param knots2 Nurb Knot V
* @param controlvertexes Patch Control Points
*/
Patch.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	
	this.nurbObj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU,this.partsV) ;
};

/**
* display
* Function that display the nurb Object
*/
Patch.prototype.display = function() {
	this.nurbObj.display();
};

/**
* createKnot
* Calculates the knot for a specific order
* @order Patch order
*/
function createKnot(order){
	var i = order+1;
	var knot = new Array(i);
	var n = i*2;

	for(var j = 0; j < n;j++)
	{
		if(j < i)
			knot[j] = 0;
		else
			knot[j] = 1;
	}
	return knot;
}

/**
* createMatrixCV
* Calculates the matrix with the control points.
* @order Patch order
* @c_points Control Points
*/
function createMatrixCV(order, c_points){

	var n = order+1;
	var CV = [];
	var index = 0;

	for(var i = 0; i < n; i++)
	{
		var temp = [];
		for(var j = 0; j < n; j++)
		{
			temp[j] = c_points[index];
			index++;
		}
		CV[i] = temp;
	}

	return CV;

}
