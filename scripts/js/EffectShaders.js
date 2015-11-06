var vertexSnippet = [
	"varying vec2 vUv;",
	"void main() {",
	"    vUv = uv;",
	"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	"}"
]
var EffectShaders = function(){
	this.gradient = {
		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: vertexSnippet.join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"varying vec2 vUv;",

			"void main() {",
			"	vec4 color = texture2D(texture, vUv);",
			"    gl_FragColor = color;",
			"}"
		
		].join("\n")
	}
}