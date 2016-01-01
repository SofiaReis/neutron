/**
 * Timer
 * @constructor
 */
function Timer(scene, fontText) {
 	CGFobject.call(this,scene);
	
 	this.scene=scene;

	this.minutes=0;
	this.seconds=0;
	this.timeBeg=null;
	this.paused=false;

	this.rec = new Plane(scene, 16);
	//this.rec.updateAmpl(1,1);

	this.appearance = scene.defaultApp;
	console.log(this.appearance);
	this.fontText = fontText;

	console.log("TIMER STARTED!");
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.display = function () {




	this.scene.pushMatrix();

		this.scene.rotate(this.scene.convertDegtoRad(90),1,0,0);

		console.log("Time display!");

		this.appearance.setTexture(this.fontText);
 		if(this.paused) this.displayPaused();
 		else this.displayTime();

 	this.scene.popMatrix();
};

Timer.prototype.displayTime = function () {
	
		
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		var decM = Math.floor(this.minutes/10);
		var uniM = this.minutes%10;

		var decS = Math.floor(this.seconds/10);
		var uniS = this.seconds%10;

		this.scene.activeShader.setUniformsValues({'charCoords': [decM,3]});
		this.scene.pushMatrix();
			this.scene.translate(-4,0,0);
			//this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);

			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniM,3]});
		this.scene.pushMatrix();
			this.scene.translate(-2,0,0);
			//this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [10,3]});
		this.scene.pushMatrix();
			//this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [decS,3]});
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			//this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniS,3]});
		this.scene.pushMatrix();
			this.scene.translate(4,0,0);
			//this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);

};

Timer.prototype.displayPaused = function () {
	

		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		this.scene.activeShader.setUniformsValues({'charCoords': [12,4]});
		this.scene.pushMatrix();
			this.scene.translate(-2,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [0,0]});
		this.scene.pushMatrix();
			this.scene.translate(-1,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [0,2]});
		this.scene.pushMatrix();
			this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [8,1]});
		this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [4,0]});
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(-90),1,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	
};

Timer.prototype.setFont = function (font) {

	this.fontText = font;
	this.appearance.setTexture(font);
};

Timer.prototype.updateTime = function (currTime) {

	var time_since_start = currTime - this.timeBeg;
	var total_seconds = Math.floor(time_since_start/1000);
	this.minutes=Math.floor(total_seconds/60);
	this.seconds=Math.floor(total_seconds%60);
};

Timer.prototype.setPaused = function (bool) {

	this.paused=bool;
};