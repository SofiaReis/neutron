/*
* Interface
* @constructor
* Creates Object Interface
*/
function Interface () {
	CGFinterface.call(this);
}
Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/*
* init
* Initializing Interface
* @param app application
*/
Interface.prototype.init = function(app){
	CGFinterface.prototype.init.call(this,app);

	this.gui = new dat.GUI();
	this.loaded = 0;
	this.lightsInterface = this.gui.addFolder("LIGHTS");
	this.cameras = this.gui.addFolder("CAMERAS");
	this.cameras.add(this.scene,"Topo");
	this.cameras.add(this.scene,"PlayerWhite");
	this.cameras.add(this.scene,"PlayerBlack");
	this.cameras = this.gui.addFolder("REVERT MATCH");
	this.cameras.add(this.scene,"Undo");
	return true;
}

/*
* update
* Updates Interface
*/
Interface.prototype.update = function(){
	if(this.loaded == 0 && this.scene.lightsLoad)
	{
		this.loaded = 1;

		for(var i in this.scene.lights){

			var nome = "lightEnable" + i;
			this.lightsInterface.add(this.scene, nome).name("Light " + i);
			
		}
	}
	
}