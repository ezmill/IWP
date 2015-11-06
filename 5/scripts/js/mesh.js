var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var material;
var shaderMaterial;
var geometry;
var mesh;
var normalsMesh;
var time = 0.0;
var speeds = [];
var texture;
var renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);

var sphere, uniforms, attributes;

var rotationX, rotationY;

var lightl;

var controls;
init();

animate();

var gui;
var effectController;
var controls;

var texturesIndex = 0;
var textures = [
	"MatCapZBrush/Lib/eye_veins_02.jpg"
];


function init() 
{
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000 );
    camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
	camera.position.z = 367.54594531249666;
	// controls = new THREE.OrbitControls(camera);
	scene = new THREE.Scene();
	
	initGeometry();
	initShader();
	
	var r = "assets/tex/square.jpg";
    var urls = [r, r, r, r, r, r];

    var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
    textureCube.minFilter = textureCube.magFilter = THREE.NearestFilter;

    var cubeMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: 2,
        envMap: textureCube,
        refractionRatio: 0.8
        // map: THREE.ImageUtils.loadTexture("assets/tex/stockroom.jpg")
    });
	//geometry.computeTangents();
	mesh = new THREE.Mesh( geometry, cubeMaterial2);
		
	scene.add(mesh);
	
	for (var i = 0; i < mesh.geometry.vertices.length; i++) {
		speeds.push(0);
	}
	
	light = new THREE.PointLight( 0x222222, 20.5, 1000);
	light.position.set( 100, 10, 100 );
	scene.add(light);
	

	renderer = new THREE.WebGLRenderer();		
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor("white");
	container.appendChild( renderer.domElement );
	
	
	
	
	initGUI();



	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseleave', onMouseLeave, false );
}

// ------------------------------------------- geometry -----------------------------------------------------
function initGeometry() 
{
	var holes = [];
	geometry = new THREE.Geometry();
	
	var size = 15;
	var countX = window.innerWidth/14;
	var countY = window.innerHeight/14;
	
	for (var i = 0; i < countX; i++) {
		for (var j = 0; j < countY; j++) {
			geometry.vertices.push( new THREE.Vector3( i * size - size * countX / 2, j * size - size * countY / 2, 0 ) );
			geometry.vertices.push( new THREE.Vector3( i * size - size * countX / 2, j * size + size - size * countY / 2, 0 ) );
			geometry.vertices.push( new THREE.Vector3( i * size + size - size * countX / 2, j * size + size - size * countY / 2, 0 ) );
		}
	}
	
	triangles = THREE.Shape.Utils.triangulateShape ( geometry.vertices, holes );
	for( var i = 0; i < triangles.length; i++ )
	{
	    geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
	}
	geometry.mergeVertices();
	geometry.computeBoundingSphere();
	// geometry.computeCentroids();
	geometry.computeFaceNormals();
    geometry.computeBoundingSphere();
}

function initShader() 
{
	// texture = THREE.ImageUtils.loadTexture( "assets/tex/arizona-muse-by-steven-klein-for-vogue-us-august-2015.jpg" );
	texture = THREE.ImageUtils.loadTexture( "assets/tex/metal.jpg" );
	gradient = new Gradient(256,256);
	gradient.init();
	// texture = new THREE.Texture(gradient.canvas);
	// texture.minFilter = texture.magFilter = THREE.NearestFilter;

	attributes = {
	};
	
	uniforms = {
		color:     { type: "c", value: new THREE.Color( 0xff2200 ) },
		texture:   { type: "t", value: texture },
	};
	
	uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;
	
	shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent
	});
	
	material = shaderMaterial;
	// material = new THREE.MeshBasicMaterial({
	// 	color: 0xff0000
	// });
}

function initGUI() 
{
	effectController = {
		depth: 200.0,
		radius: 1.6,
		power: 1.0,
	};
	
}

function animate() 
{
	requestAnimationFrame( animate );
	
	var mouseVector = new THREE.Vector3(mouseX / 1.1, mouseY / 1.1, 0);
	texture.needsUpdate = true;
	time+= 0.01;
	gradient.update();
	for (var i = 0; i < mesh.geometry.vertices.length; i++) {
		var vector = mesh.geometry.vertices[i];
		var coord = new THREE.Vector3( vector.x, -vector.y, vector.z );
		var power = effectController.power * 100.0 / (effectController.radius * 0.1 * coord.sub(mouseVector).length() + effectController.radius * 10.0);
		
		speeds[i] -= power * power + mesh.geometry.vertices[i].z * .1;
		speeds[i] *= 0.95;
		mesh.geometry.vertices[i].z += speeds[i];
		mesh.geometry.vertices[i].z = Math.max(-effectController.depth, mesh.geometry.vertices[i].z);
	}
			// mesh.geometry.vertices[i].z = mouseVector.x;

	mesh.geometry.verticesNeedUpdate = true;	
	mesh.geometry.computeVertexNormals( true );
	mesh.geometry.normalsNeedUpdate = true;
	
	render();
}

function render() {
	// camera.lookAt(scene.position);
	renderer.render( scene, camera );
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseLeave(e) {
	mouseX = 100000000;
	mouseY = 100000000;
	e.preventDefault();
	
}

function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
	
	light.position.set(0.3 * mouseX, -0.3 * mouseY, 200);
	
}

function Gradient(WIDTH, HEIGHT){
    this.canvas, this.context;
    this.width, this.height;
    this.colors = [];
    this.hue, this.saturation, this.lightness, this.alpha;
    this.offset;
    this.init = function(){
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.hue = Math.random()*360;
        // this.saturation = Math.random()*100;
        this.saturation = 100;
        // this.lightness = Math.random()*100;
        this.lightness = 80;
        this.lightness2 = 10;
        this.alpha = 1.0;
        this.offset = 100;
    }

    this.update = function(){
        this.sampleColors();
        this.gradient=this.context.createLinearGradient(0,0,this.canvas.width,this.canvas.height);
        this.gradient.addColorStop(0, this.colors[0]);
        this.gradient.addColorStop(1, this.colors[1]);
        this.context.fillStyle=this.gradient;
        this.context.fillRect(0,0,this.canvas.width, this.canvas.height);

        this.hue += 1.0;
    }

    this.sampleColors = function(){
        this.colors[0] = hslaColor(this.hue, this.saturation, this.lightness, this.alpha)
        this.colors[1] = hslaColor(this.hue + this.offset, this.saturation, this.lightness2, this.alpha)
    }

}
function hslaColor(h,s,l,a){
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}