function Score(scene) {
 	CGFobject.call(this,scene);
	
 	this.scene=scene;
 	
 	this.rec = new Plane(scene, 16);

	this.scene.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");
    this.scene.textShader.setUniformsValues({'dims': [16, 16]});
	this.appearance = scene.defaultApp;
	this.fontText = new CGFtexture(this.scene, "textures/cells.png");

	this.counter1=0;
	this.counter2=0;
};

Score.prototype = Object.create(CGFobject.prototype);
Score.prototype.constructor = Score;

Score.prototype.display = function () {

	this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(90),1,0,0);
 		//TEXT
 		this.appearance.setTexture(this.fontText);
 		this.displayScore();

 	this.scene.popMatrix();
};

Score.prototype.displayScore = function () {
	
	this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.scene.textShader);
		this.appearance.apply();

		var cenW = 15-Math.floor(this.counter1/100);
		var decW = 15-Math.floor(this.counter1/10);
		var uniW = 15-this.counter1%10;

		var cenB = 15-Math.floor(this.counter1/100);
		var decB = 15-Math.floor(this.counter2/10);
		var uniB = 15-this.counter2%10;


		this.scene.activeShader.setUniformsValues({'charCoords': [cenB,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(-2,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [decB,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(-4,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [uniB,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(-6,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [2,2]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.rec.display();
		this.scene.popMatrix();


		this.scene.activeShader.setUniformsValues({'charCoords': [cenW,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(6,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.activeShader.setUniformsValues({'charCoords': [decW,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(4,0,0);
			this.rec.display();
		this.scene.popMatrix();



		this.scene.activeShader.setUniformsValues({'charCoords': [uniW,3]});
		this.scene.pushMatrix();
		this.scene.rotate(this.scene.convertDegtoRad(180),0,1,0);
			this.scene.translate(2,0,0);
			this.rec.display();
		this.scene.popMatrix();

		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	this.scene.popMatrix();
};

Score.prototype.setCounters = function (c1,c2) {

	this.counter1+=c1;
	this.counter2+=c2;
};