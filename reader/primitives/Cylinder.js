/**
 * Class Cylinder 
 * Responsible for drawing the cylinder primitive.
 */

 /**
 * Constructor
 * Creates the object Cylinder
 * @param scene Class CGFScene
 * @param height Cylinder height
 * @param bRad Bottom circle raidius
 * @param tRad Top circle raidius
 * @param stacks Stacks of cylinder
 * @param slices Slices of cylinder
 */
function Cylinder(scene, height, bRad, tRad, stacks, slices) {
       
        CGFobject.call(this,scene);

        this.height=height;
        this.bRad=bRad;
        this.tRad=tRad;
        this.slices=slices;
        this.stacks=stacks;
        
        this.initBuffers();
};
 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;
 
 /**
 * initBuffers
 * Function that calculates what is necessary to draw the cylinder (vertexes of the solid,
 * normals for the lights and textcoords for texture application)
 */
 Cylinder.prototype.initBuffers = function() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
 
        var ang = 360 * (Math.PI / 180.0) / this.slices;
 
        var ind_j = 0;
        var aux_j = 4 * this.slices;
 
        var aux_br = 1;
        var aux_tr = 0;
 
        for (j = 0; j < this.stacks; j++) {
               
                var angAux = 0;
                var ind_i = 0;
 
                for (i = 0; i < this.slices; i++) {
 
                        var x1 = Math.cos(angAux) * (aux_br * this.bRad + aux_tr * this.tRad);
                        var y1 = Math.sin(angAux) * (aux_br * this.bRad + aux_tr * this.tRad);
                        var z1 = j / this.stacks - 0.5;
                        var x3 = Math.cos(angAux) * ((aux_br-1/this.stacks) * this.bRad + (aux_tr+1/this.stacks) * this.tRad);
                        var y3 = Math.sin(angAux) * ((aux_br-1/this.stacks) * this.bRad + (aux_tr+1/this.stacks) * this.tRad);
                        angAux += ang;
                        var x2 = Math.cos(angAux) * (aux_br * this.bRad + aux_tr * this.tRad);
                        var y2 = Math.sin(angAux) * (aux_br * this.bRad + aux_tr * this.tRad);
                        var z2 = (j + 1) / this.stacks - 0.5;
                        var x4 = Math.cos(angAux) * ((aux_br-1/this.stacks) * this.bRad + (aux_tr+1/this.stacks) * this.tRad);
                        var y4 = Math.sin(angAux) * ((aux_br-1/this.stacks) * this.bRad + (aux_tr+1/this.stacks) * this.tRad);
                        
                        this.vertices.push(x1);
                        this.vertices.push(y1);
                        this.vertices.push(z1); 
                        
                        this.vertices.push(x2);
                        this.vertices.push(y2);
                        
                        this.vertices.push(z1);
                        this.vertices.push(x3)
                        this.vertices.push(y3);
                        
                        this.vertices.push(z2);         
                        this.vertices.push(x4);
                        this.vertices.push(y4);
                        this.vertices.push(z2); 
 
                        var ind_i_j = ind_i + ind_j;
 
                        this.indices.push(ind_i_j);             
                        this.indices.push(ind_i_j + 1); 
                        this.indices.push(ind_i_j + 2); 
 
                        this.indices.push(ind_i_j + 3); 
                        this.indices.push(ind_i_j + 2); 
                        this.indices.push(ind_i_j + 1); 
 
                        ind_i += 4;
 
                       
                        this.normals.push(x1);
                        this.normals.push(y1);
                        this.normals.push(0);
                       
                        this.normals.push(x2);
                        this.normals.push(y2);
                        this.normals.push(0);
 
                        this.normals.push(x1);
                        this.normals.push(y1);
                        this.normals.push(0);
                       
                        this.normals.push(x2);
                        this.normals.push(y2);
                        this.normals.push(0);
 
                        this.texCoords.push(1 - i / this.slices, j / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
                        this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
 
                }                      
                ind_j += aux_j;
 
                aux_br -= 1/this.stacks;
                aux_tr += 1/this.stacks;
               
        }
 
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
 
 };