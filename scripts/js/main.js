var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var r2 = 0.0;
var time = 0.0;
var effect;
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

	texture = THREE.ImageUtils.loadTexture("assets/textures/arizona-muse-by-steven-klein-for-vogue-us-august-2015.jpg");
	shaders = new EffectShaders();
	effect = new Effect("gradient", scene, camera, renderer, texture, shaders);
	effect.init();

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}

function onMouseMove(event){
	mouse.x = ( event.clientX / renderSize.x ) * 2 - 1;
    mouse.y = - ( event.clientY / renderSize.y ) * 2 + 1;
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
	effect.update();
	renderer.render(scene, camera);
}