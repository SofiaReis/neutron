/**
 * Timer
 * @constructor
 */
function Timer(scene) {
 	CGFobject.call(this,scene);
	
 	this.scene=scene;

	this.minutes=0;
	this.seconds=0;
	this.timeBeg=0;
	this.paused=false;

	this.rec = new Plane(scene, 16);

	this.restart = false;

	this.scene.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");
    this.scene.textShader.setUniformsValues({'dims': [16, 16]});
	this.appearance = scene.defaultApp;
	this.fontText = new CGFtexture(this.scene, "textures/cells.png");
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.display = function () {

	this.scene.pushMatrix();

		this.scene.rotate(this.scene.convertDegtoRad(90),1,0,0);

		this.appearance.setTexture(this.fontText);
		this.displayTime();

 	this.scene.popMatrix();
};

Timer.prototype.displayWin = function (player){

	this.scene.pushMatrix();

		this.appearance.setTexture(this.fontText);

		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		this.scene.rotate(this.scene.convertDegtoRad(90),1,0,0);

		this.scene.activeShader.setUniformsValues({'charCoords': [15,5]});
		this.scene.pushMatrix();
			this.scene.translate(2,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [3,4]});
		this.scene.pushMatrix();
			this.scene.translate(4,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [14,4]});
		this.scene.pushMatrix();
			this.scene.translate(6,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

			this.scene.activeShader.setUniformsValues({'charCoords': [6,5]});
		this.scene.pushMatrix();
			this.scene.translate(8,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [10,4]});
		this.scene.pushMatrix();
			this.scene.translate(10,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [13,5]});
		this.scene.pushMatrix();
			this.scene.translate(12,-2,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		if(player == 1)
		{
			this.scene.activeShader.setUniformsValues({'charCoords': [14,3]});
			this.scene.pushMatrix();
			this.scene.translate(2,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
			this.scene.popMatrix();
		}
		else{
			this.scene.activeShader.setUniformsValues({'charCoords': [13,3]});
			this.scene.pushMatrix();
			this.scene.translate(2,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
			this.scene.popMatrix();

		}

		this.scene.activeShader.setUniformsValues({'charCoords': [1,1]});
			this.scene.pushMatrix();
			this.scene.translate(4,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
			this.scene.popMatrix();


		this.scene.activeShader.setUniformsValues({'charCoords': [8,5]});
		this.scene.pushMatrix();
			this.scene.translate(6,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [6,4]});
		this.scene.pushMatrix();
			this.scene.translate(8,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [1,4]});
		this.scene.pushMatrix();
			this.scene.translate(10,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [14,2]});
		this.scene.pushMatrix();
			this.scene.translate(12,-2,2);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();


		this.scene.setActiveShaderSimple(this.scene.defaultShader);
		this.scene.popMatrix();



}

Timer.prototype.displayTime = function () {
	
		
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		var decS = 15-Math.floor(this.seconds/10);
		var uniS = 15-this.seconds%10;

		this.scene.activeShader.setUniformsValues({'charCoords': [decS,3]});
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniS,3]});
		this.scene.pushMatrix();
			this.scene.translate(4,0,0);
			this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);

};

Timer.prototype.setFont = function (font) {

	this.fontText = font;
	this.appearance.setTexture(font);
};

Timer.prototype.updateTime = function (currTime) {

	if(this.restart == true)
	{
		this.timeBeg = currTime;
		this.restart = false;
	} 
	var time_since_start = currTime - this.timeBeg;
	var total_seconds = Math.floor(time_since_start/1000);
	this.seconds=Math.floor(total_seconds%60);
};

Timer.prototype.setPaused = function (bool) {
	this.paused=bool;
};
