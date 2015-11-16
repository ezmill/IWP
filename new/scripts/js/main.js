var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, 2500*(window.innerWidth/3750));
// var renderSize = new THREE.Vector2(740, 503);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var r2 = 0.0;
var time = 0.0;
var mask;
init();
animate();

function init(){
	scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    camera.position.set(0,0,0);

	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
	renderer.setSize( renderSize.x, renderSize.y );
	renderer.setClearColor(0xffffff,1.0);

	container = document.getElementById( 'container' );
	container.appendChild(renderer.domElement);

	texture = THREE.ImageUtils.loadTexture("assets/textures/test.jpg");
	mask = new Mask();
	mask.init();
	alpha = new THREE.Texture(mask.canvas);
	alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
	alpha.needsUpdate = true;
	shader = new RgbShiftShader();
	material = new THREE.ShaderMaterial({
		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		side: 2,
		transparent: true
	});
	material.uniforms["texture"].value = texture;
	material.uniforms["alpha"].value = alpha;
	material.uniforms["resolution"].value = renderSize;
	material.uniforms["r2"].value = r2;
	material.uniforms["time"].value = time;
	geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
	document.addEventListener("keydown", onKeyDown);
}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mask.mouse = new THREE.Vector2(event.pageX, event.pageY);
	mouse.x = ( event.clientX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.clientY / renderSize.y ) * 2 + 1;
	material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
}
function onMouseDown(){
	mouseDown = true;
}
function onMouseUp(){
	mouseDown = false;
	// r2 = 0;
}
function draw(){
	time += 0.01;
	material.uniforms["time"].value = time;
	mask.update();
	alpha.needsUpdate = true;
	if(mouseDown){
		r2 = 1.0;
		material.uniforms["r2"].value = r2;
	}
	renderer.render(scene, camera);
}
function onKeyDown(e){
	console.log(e);
	if(e.keyCode == '88'){
		mask.switchColor();
	}
}