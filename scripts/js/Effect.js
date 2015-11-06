function Effect(NAME, SCENE, CAMERA, RENDERER, TEXTURE, SHADERS){
	this.name = NAME;
	this.scene = SCENE;
	this.camera = CAMERA;
	this.renderer = RENDERER;
	this.texture = TEXTURE;
	this.shaders = SHADERS;

	this.init = function(){
		this.initMesh();
	}	

	this.update = function(){
	}

	this.initMesh = function(){
		this.shader = this.shaders[this.name];
		this.material = new THREE.ShaderMaterial({
		    uniforms: this.shader.uniforms,
		    vertexShader: this.shader.vertexShader,
		    fragmentShader: this.shader.fragmentShader    
		});
		this.material.uniforms["texture"].value = this.texture;
		this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y);
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 0);
		this.scene.add(this.mesh);
	}
}