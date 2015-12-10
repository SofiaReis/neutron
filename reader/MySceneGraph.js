function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	this.scene = scene;
	scene.graph = this;

	this.reader = new CGFXMLreader();
	this.root_id = null;
	 
	this.reader.open('scenes/'+filename, this);  
}

/**
 * getUniqueElement
 * Method that retrieves the element that have a 
 * nametag (ex. retrieves the object frustum inside initials)
 * @param tag Search Sentence
 * @param nametag Word to search
 * @return tempInitials Object with the nametag
 */
function getUniqueElement(tag, nametag){

	var tempInitials = tag.getElementsByTagName(nametag);
	if (tempInitials == null) {
	    return (nametag + " element in " + tag + " is missing.");
	}
	if (tempInitials.length != 1) {
	    return "either zero or more than one " + nametag + " element found in" + tag + ".";
	}
	return tempInitials[0];
}

/** 
 * getAllElements
 * Method that retrieves the elements that have a 
 * nametag (ex. retrieves the objects rotation inside initials)
 * @param tag Search Sentence
 * @param nametag Word to search
 * @return tempInitials Objects with the nametag
 */
function getAllElements(tag, nametag){

	var tempInitials = tag.getElementsByTagName(nametag);
	if (tempInitials == null) {
	    return (nametag + " element in " + tag + " is missing.");
	}
	return tempInitials;
}

/** 
 * parseInitials
 * Method that parses elements of Initials
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseInitials = function(rootElement) {

	this.initialsInfo = {};
	
	//FRUSTUM
	var initials = getUniqueElement(rootElement, "INITIALS");
	var frustum = getUniqueElement(initials, "frustum");

	this.initialsInfo.frustum = {};

	this.initialsInfo.frustum['near'] = this.reader.getFloat(frustum, "near");
	this.initialsInfo.frustum['far'] = this.reader.getFloat(frustum, "far");

	//TRANSLATION
	var translation = getUniqueElement(initials, "translation");

	this.initialsInfo.translation = {};

	this.initialsInfo.translation['x'] = this.reader.getFloat(translation, "x");
	this.initialsInfo.translation['y'] = this.reader.getFloat(translation, "y");
	this.initialsInfo.translation['z'] = this.reader.getFloat(translation, "z");

	//ROTATION
	var rotation = getAllElements(initials, "rotation");
	this.initialsInfo.rotation = {};

	for (var i = 0; i < rotation.length; ++i) {
		this.initialsInfo.rotation[this.reader.getString(rotation[i], "axis")] = this.reader.getFloat(rotation[i], "angle");
	}

	//SCALE
	var scale = getUniqueElement(initials, "scale");
	this.initialsInfo.scale = {};

	this.initialsInfo.scale['sx'] = this.reader.getFloat(scale, "sx");
	this.initialsInfo.scale['sy'] = this.reader.getFloat(scale, "sy");
	this.initialsInfo.scale['sz'] = this.reader.getFloat(scale, "sz");

	//REFERENCE
	var reference = getUniqueElement(initials, "reference");
	this.initialsInfo.ref = {};

	this.initialsInfo.ref = this.reader.getFloat(reference, "length");

};

/**
 * parseIlumination
 * Method that parses elements of Illumination.
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {

	this.illuminationInfo= {};
	
	var illumination = getUniqueElement(rootElement, "ILLUMINATION");
	var ambient = getUniqueElement(illumination, "ambient");

	//AMBIENT
	this.illuminationInfo.ambient = {};

	this.illuminationInfo.ambient['r'] = this.reader.getFloat(ambient, "r");
	this.illuminationInfo.ambient['g'] = this.reader.getFloat(ambient, "g");
	this.illuminationInfo.ambient['b'] = this.reader.getFloat(ambient, "b");
	this.illuminationInfo.ambient['a'] = this.reader.getFloat(ambient, "a");

	var background = getUniqueElement(illumination, "background");
	
	//BACKGROUND
	this.illuminationInfo.background = {};

	this.illuminationInfo.background['r'] = this.reader.getFloat(background, "r");
	this.illuminationInfo.background['g'] = this.reader.getFloat(background, "g");
	this.illuminationInfo.background['b'] = this.reader.getFloat(background, "b");
	this.illuminationInfo.background['a'] = this.reader.getFloat(background, "a");
};

/**
 * parseLights
 * Method that parses elements of Lights
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseLights= function(rootElement) {

	this.lightsInfo= {};
	
	var lights = getUniqueElement(rootElement, "LIGHTS");

	for(var i = 0; i < lights.children.length; ++i){
		
		this.light = {};

		this.light['id'] = this.reader.getString(lights.children[i], "id");
		var enable = getUniqueElement(lights.children[i],"enable");
		this.light['enable'] = this.reader.getBoolean(enable, "value");

		//POSITION
		var position = getUniqueElement(lights.children[i],"position");
		this.light['position'] = {};
		this.light['position']['x'] = this.reader.getString(position, "x");
		this.light['position']['y'] = this.reader.getString(position, "y");
		this.light['position']['z'] = this.reader.getString(position, "z");
		this.light['position']['w'] = this.reader.getString(position, "w");

		//AMBIENT
		var ambient = getUniqueElement(lights.children[i],"ambient");
		this.light['ambient'] = {};
		this.light['ambient']['r'] = this.reader.getString(ambient, "r");
		this.light['ambient']['g'] = this.reader.getString(ambient, "g");
		this.light['ambient']['b'] = this.reader.getString(ambient, "b");
		this.light['ambient']['a'] = this.reader.getString(ambient, "a");

		//DIFFUSE
		var diffuse = getUniqueElement(lights.children[i],"diffuse");
		this.light['diffuse'] = {};
		this.light['diffuse']['r'] = this.reader.getString(diffuse, "r");
		this.light['diffuse']['g'] = this.reader.getString(diffuse, "g");
		this.light['diffuse']['b'] = this.reader.getString(diffuse, "b");
		this.light['diffuse']['a'] = this.reader.getString(diffuse, "a");

		//SPECULAR
		var specular = getUniqueElement(lights.children[i],"specular");
		this.light['specular'] = {};
		this.light['specular']['r'] = this.reader.getString(diffuse, "r");
		this.light['specular']['g'] = this.reader.getString(diffuse, "g");
		this.light['specular']['b'] = this.reader.getString(diffuse, "b");
		this.light['specular']['a'] = this.reader.getString(diffuse, "a");

		this.lightsInfo[this.light['id']] = this.light;
	}
};

/**
 * parseAnimations
 * Method that parses elements of Animations
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseAnimations= function(rootElement) {

	this.animationsInfo = [];
	
	var animations = getUniqueElement(rootElement, "ANIMATIONS");

	for(var i = 0; i < animations.children.length; ++i){
		this.animation = {};
		var type = this.reader.getString(animations.children[i], "type");
		this.animation['type'] = type;

		//LINEAR
		if(type == 'linear'){
			this.animation['id'] = this.reader.getString(animations.children[i], "id");
			this.animation['span'] = this.reader.getFloat(animations.children[i], "span");
			
			var points = getAllElements(animations.children[i], "controlpoint");
			this.animation['point'] = [];
			for(var j = 0; j < points.length; j++){
				
				this.animation.point[j] = [];
				this.animation.point[j]['xx'] = this.reader.getFloat(points[j], "xx");
				this.animation.point[j]['yy'] = this.reader.getFloat(points[j], "yy");
				this.animation.point[j]['zz'] = this.reader.getFloat(points[j], "zz");
			}
		//CIRCULAR	
		}else if(type == 'circular'){
			this.animation['id'] = this.reader.getString(animations.children[i], "id");
			this.animation['span'] = this.reader.getFloat(animations.children[i], "span");
			this.animation['center'] = this.reader.getString(animations.children[i], "center");
			this.animation['radius'] = this.reader.getFloat(animations.children[i], "radius");
			this.animation['startang'] = this.reader.getFloat(animations.children[i], "startang");
			this.animation['rotang'] = this.reader.getFloat(animations.children[i], "rotang");
		}
		else{
			return 'NO ANIMATION TYPE DEFINED';
		}
		this.animationsInfo[this.animation['id']] = this.animation;
	}
};


/**
 * parseTextures
 * Method that parses elements of Textures
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseTextures= function(rootElement) {

	this.texturesInfo= {};
	
	var textures = getUniqueElement(rootElement, "TEXTURES");

	for (var i = 0; i < textures.children.length; i++){
		var texture = {};

		texture['id'] = this.reader.getString(textures.children[i], "id")
		var file = getUniqueElement(textures.children[i], "file");
		texture['path'] = this.reader.getString(file, "path");

		var amplif_factor = getUniqueElement(textures.children[i], "amplif_factor");
		texture['amplif_factor'] = {};
		texture['amplif_factor']['s'] = this.reader.getFloat(amplif_factor, "s");
		texture['amplif_factor']['t'] = this.reader.getFloat(amplif_factor, "t");

		this.texturesInfo[texture['id']] = texture;
	}
};

/**
 * parseMaterials
 * Method that parses elements of Materials
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseMaterials= function(rootElement) {
	
	this.materialsInfo = {};

	var materials = getUniqueElement(rootElement, "MATERIALS");

	for (var i = 0; i < materials.children.length; i++){

		this.material = {};
		this.material['id'] = this.reader.getString(materials.children[i], "id");
		var shininess = getUniqueElement(materials.children[i], "shininess");

		//SHININESS
		this.material['shininess'] = this.reader.getFloat(shininess, "value");

		//SPECULAR
		this.material['specular'] = {};
		var specular = getUniqueElement(materials.children[i], "specular");
		this.material['specular']['r'] = this.reader.getFloat(specular, "r");
		this.material['specular']['g'] = this.reader.getFloat(specular, "g");
		this.material['specular']['b'] = this.reader.getFloat(specular, "b");
		this.material['specular']['a'] = this.reader.getFloat(specular, "a");

		//DIFFUSE
		this.material['diffuse'] = {};
		var diffuse = getUniqueElement(materials.children[i], "diffuse");
		this.material['diffuse']['r'] = this.reader.getFloat(diffuse, "r");
		this.material['diffuse']['g'] = this.reader.getFloat(diffuse, "g");
		this.material['diffuse']['b'] = this.reader.getFloat(diffuse, "b");
		this.material['diffuse']['a'] = this.reader.getFloat(diffuse, "a");

		//AMIBIENT
		this.material['ambient'] = {};
		var ambient = getUniqueElement(materials.children[i], "ambient");
		this.material['ambient']['r'] = this.reader.getFloat(ambient, "r");
		this.material['ambient']['g'] = this.reader.getFloat(ambient, "g");
		this.material['ambient']['b'] = this.reader.getFloat(ambient, "b");
		this.material['ambient']['a'] = this.reader.getFloat(ambient, "a");

		//EMISSION
		this.material['emission'] = {};
		var emission = getUniqueElement(materials.children[i], "emission");
		this.material['emission']['r'] = this.reader.getFloat(emission, "r");
		this.material['emission']['g'] = this.reader.getFloat(emission, "g");
		this.material['emission']['b'] = this.reader.getFloat(emission, "b");
		this.material['emission']['a'] = this.reader.getFloat(emission, "a");

		this.materialsInfo[this.material['id']] = this.material;
	}
};

/**
 * parseLeaves
 * Method that parses Leaves
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseLeaves= function(rootElement) {
	
	var leaves = getUniqueElement(rootElement, "LEAVES");
	this.leavesInfo = {};

	for (var i = 0; i < leaves.children.length; ++i) {
		this.leave = {};

		this.leave['id'] = this.reader.getString(leaves.children[i], "id");
		this.leave['type'] = this.reader.getString(leaves.children[i], "type");
		if(this.leave.type == "rectangle" ||
			this.leave.type == "cylinder"||
			this.leave.type == "sphere"||
			this.leave.type == "triangle"){
			
			var arguments = this.reader.getString(leaves.children[i], "args");
		}

		switch (this.leave.type) {
			case "rectangle":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 4)
					return "Rectangle - Must be 4 args: <leftTopX> <leftTopY> <rightBottomX> <rightBottomY>";
				
				this.leave['args'] = {};
				this.leave['args']['ltX'] = parseFloat(argsSplit[0]);
				this.leave['args']['ltY'] = parseFloat(argsSplit[1]);
				this.leave['args']['rbX'] = parseFloat(argsSplit[2]);
				this.leave['args']['rbY'] = parseFloat(argsSplit[3]);

				break;
			case "cylinder":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 5)
					return "Cylinder - Must be 5 args: <height> <bottomRad> <topRad> <stacks> <slices>";
				
				this.leave['args'] = {};
				this.leave['args']['height'] = parseFloat(argsSplit[0]);
				this.leave['args']['bRad'] = parseFloat(argsSplit[1]);
				this.leave['args']['tRad'] = parseFloat(argsSplit[2]);
				this.leave['args']['stacks'] = parseFloat(argsSplit[3]);
				this.leave['args']['slices'] = parseFloat(argsSplit[4]);
				
				break;
			case "sphere":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 3)
					return "Sphere - Must be 3 args: <rad> <stacks> <slices>";
				
				this.leave['args'] = {};
				this.leave['args']['rad'] = parseFloat(argsSplit[0]);
				this.leave['args']['stacks'] = parseFloat(argsSplit[1]);
				this.leave['args']['slices'] = parseFloat(argsSplit[2]);
				
				break;
			case "triangle":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 11)
					return "Triangle - Must be 9 args: <xLeftBottom> <yLeftBottom> <zLeftBottom> <xMiddleTop> <yMiddleTop> <zMiddleTop> <xRightBottom> <yRightBottom> <zRightBottom>";
				
				this.leave['args'] = {};
				this.leave['args']['x0'] = parseFloat(argsSplit[0]);
				this.leave['args']['y0'] = parseFloat(argsSplit[1]);
				this.leave['args']['z0'] = parseFloat(argsSplit[2]);

				this.leave['args']['x1'] = parseFloat(argsSplit[4]);
				this.leave['args']['y1'] = parseFloat(argsSplit[5]);
				this.leave['args']['z1'] = parseFloat(argsSplit[6]);

				this.leave['args']['x2'] = parseFloat(argsSplit[8]);
				this.leave['args']['y2'] = parseFloat(argsSplit[9]);
				this.leave['args']['z2'] = parseFloat(argsSplit[10]);
				
				break;
			case "plane":
					this.leave['parts'] = this.reader.getFloat(leaves.children[i], "parts");
				break;
			case "patch":
				this.leave['order'] = this.reader.getFloat(leaves.children[i], "order");
				this.leave['partsU'] = this.reader.getFloat(leaves.children[i], "partsU");
				this.leave['partsV'] = this.reader.getFloat(leaves.children[i], "partsV");
				var cPoints = getAllElements(leaves.children[i],"controlpoint");
				var nPoints = Math.pow((this.leave.order+1),2);
				if(nPoints != cPoints.length){ 
					console.error("PATCH: Number of Control Points wrong, need to be equal to (order+1)^2.");
					return;
				}
				var points = [];
				for(var j = 0; j < cPoints.length; j++){

					var point = new Array(4);
					point[0] = this.reader.getFloat(cPoints[j], "x");
					point[1] = this.reader.getFloat(cPoints[j], "y");
					point[2] = this.reader.getFloat(cPoints[j], "z");
					point[3] = 1;
					points.push(point);
				}
				this.leave["ctrlPoints"] = points;				
				break;
			case "terrain":
				this.leave['texture'] = this.reader.getString(leaves.children[i], "texture");
				this.leave['height'] = this.reader.getString(leaves.children[i], "heightmap");				
				break;
			default:
				return "Unknown LEAF type: " + this.leavesInfo.type;
			}
			this.leavesInfo[this.leave['id']] = this.leave;
		}

		
};



/**
 * parseNodes
 * Method that parses Nodes and their elements
 * @param rootElement XML to search
 */
MySceneGraph.prototype.parseNodes = function(rootElement){

	var nodeList = getUniqueElement(rootElement, 'NODES');
	var nodes = nodeList.getElementsByTagName('NODE');

	this.nodesInfo = [];

	for(var i = 0; i < nodes.length; i++){

		this.node = [];
		var id = this.reader.getString(nodes[i],"id");
		this.node['id'] = this.reader.getString(nodes[i],"id");
		this.node['visited'] = false;
		this.node['index'] = 0;

		var animRef = nodes[i].getElementsByTagName('ANIMATIONREF');
		this.node['animation'] = [];
		for(var j = 0; j < animRef.length; j++)
		{	
			this.node['animation'][j] = this.reader.getString(animRef[j], 'id');
		}

		var material = getUniqueElement(nodes[i],'MATERIAL');
		
		if(material.tagName == 'MATERIAL'){
			this.node['material'] = [];
			this.node['material'] = this.reader.getString(material, 'id');
		}

		var texture = getUniqueElement(nodes[i], "TEXTURE");
		if(texture.tagName == 'TEXTURE'){
			this.node['texture'] = [];
			this.node['texture'] = this.reader.getString(texture, 'id');
		}
		var descendants = getUniqueElement(nodes[i], "DESCENDANTS");
		this.node['descendants'] = [];
		var desc = descendants.getElementsByTagName('DESCENDANT');

		for(var j = 0; j < desc.length; j++){
			var id_d = this.reader.getString(desc[j], 'id');
			this.node['descendants'][j] = id_d;
		}

		var transformations = nodes[i].getElementsByTagName('*');


		this.node['transformations'] = [];
		var order = 0;

		for(var j = 0; j < transformations.length; j++){

			this.node['transformations'][order] = {};
			
			if(transformations[j].tagName == "TRANSLATION"){
			
			this.node['transformations'][order].type = "translation";
			this.node['transformations'][order].x = this.reader.getFloat(transformations[j], 'x');
			this.node['transformations'][order].y= this.reader.getFloat(transformations[j],'y');
			this.node['transformations'][order].z = this.reader.getFloat(transformations[j],'z');
			order++;
			}

			if(transformations[j].tagName == "ROTATION"){

			this.node['transformations'][order].type = "rotation";
			this.node['transformations'][order].axis = this.reader.getString(transformations[j],'axis');
			this.node['transformations'][order].angle = this.reader.getFloat(transformations[j],'angle');
			order++;
			}

			if(transformations[j].tagName == "SCALE"){

			this.node['transformations'][order].type = "scale";
			this.node['transformations'][order].sx = this.reader.getFloat(transformations[j],'sx');
			this.node['transformations'][order].sy = this.reader.getFloat(transformations[j],'sy');
			this.node['transformations'][order].sz = this.reader.getFloat(transformations[j],'sz');
			order++;

			}
		}
		this.nodesInfo[this.node['id']] = this.node;
	}

	var root = nodeList.getElementsByTagName('ROOT');
	this.root_id = root[0].attributes.getNamedItem("id").value;

};

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	var error = this.parseInitials(rootElement);
	var error = this.parseIllumination(rootElement);
	var error = this.parseLights(rootElement);
	var error = this.parseTextures(rootElement);
	var error = this.parseMaterials(rootElement);
	var error = this.parseLeaves(rootElement);
	var error = this.parseNodes(rootElement);
	var error = this.parseAnimations(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	this.scene.onGraphLoaded();
};
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};