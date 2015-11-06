var container;
var scene, camera, light, renderer;
var renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
// var renderSize = new THREE.Vector2(740, 503);
var mouse = new THREE.Vector2(0.0,0.0);
var mouseDown = false;
var objects = [];
var time = 0.0;
init();
animate();

function init(){
	scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
    // camera = new THREE.PerspectiveCamera( 45, renderSize.x/renderSize.y, 0.01, 10000.0 );
    camera.position.set(0,0,500);
    controls = new THREE.OrbitControls(camera);
	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
	renderer.setSize( renderSize.x, renderSize.y );
	renderer.setClearColor(0xffffff,1.0);

	container = document.getElementById( 'container' );
	container.appendChild(renderer.domElement);
	var url = "assets/textures/cube.jpg";
	var urls = [];
	for(var i = 0; i < 6; i++){
		urls.push(url);
	}
	textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
	material = new THREE.MeshBasicMaterial({
		envMap: textureCube,
		color: 0xffffff,
        refractionRatio: 0.9,
        reflectivity: 0.95
	});
	for(var i = 0; i < 200; i++){
		loadModel("assets/models/gem.obj", material, {
			scale: 20.0, 
			position: new THREE.Vector3(Math.random()*renderSize.x - renderSize.x/2,Math.random()*renderSize.y  - renderSize.y/2,0.0), 
			rotation: new THREE.Vector3(Math.PI/2,Math.PI*2*Math.random(),Math.PI/3*Math.random() - 0.5)
		});
	}


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
var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );

};
function loadModel(model, material, params) {
    var loader = new THREE.OBJLoaderGEO(manager);
    loader.load(model, function(object) {

        object.traverse(function(child) {

            if (child instanceof THREE.Mesh) {
                child.material = material;
                // child.geometry.computeVertexNormals();
                // child.geometry.mergeVertices();
            }
        });
        object.scale.x = object.scale.y = object.scale.z = params.scale;
        object.position.x = params.position.x;
        object.position.y = params.position.y;
        object.position.z = params.position.z;

        object.rotation.x = params.rotation.x;
        object.rotation.y = params.rotation.y;
        object.rotation.z = params.rotation.z;

        scene.add(object);
        objects.push(object);

    }, onProgress, onError);
}

function onProgress(xhr) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }

};

function onError(xhr) {};
function draw(){
	time += 0.01;
	for(var i = 0; i < objects.length; i++){
		// objects[i].rotation.x += 0.01;
		objects[i].rotation.y += 0.01;
		// objects[i].rotation.z += 0.01;
	}
	renderer.render(scene, camera);
}