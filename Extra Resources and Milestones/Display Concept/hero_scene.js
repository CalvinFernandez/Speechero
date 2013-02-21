var hero_scene = {
		// scene sizing 
	WIDTH:  500,
	HEIGHT: 500,
	
	// camera attributes
	VIEW_ANGLE: 45,
	ASPECT: this.WIDTH / this.HEIGHT,
	NEAR: 1,
	FAR: 1000,

	// scene lighting 
	light_color: 0xffffff,
	light_intensity: 0.5,
	directionalLight: 0,	// our lighting object

	// our scene container is here
	container: document.getElementById("hero_scene_container"),	

	//	variables for renderer camera and scene
	renderer: 0,
	camera: 0,
	scene: 0,	
	
	// create our renderer, camera and scene
	_init: function(JSONargs)
	{
		// updating dimensions
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;
		this.ASPECT = this.WIDTH / this.HEIGHT;

		// create a webgl renderer
		this.renderer 
			= new THREE.WebGLRenderer();
		this.renderer.setSize(this.WIDTH, this.HEIGHT);
		
		// create scene object
		this.scene
			= new THREE.Scene();
		
		// create camera object
		this.camera
			= new THREE.PerspectiveCamera(this.VIEW_ANGLE, 
										this.ASPECT, 
										this.NEAR, 
										this.FAR);
		
		// set initial camera position, default is (0,0,0)
		this.camera.position.z = 300;
		this.container.appendChild(this.renderer.domElement);

		this.directionalLight = new THREE.DirectionalLight(this.light_color, this.light_intensity);
		this.directionalLight.position.set(0, 0, 1);
		this.scene.add( this.directionalLight );
	},

	// Animates and renders. Needs to be called if 
	// we want to see anything.
	_animate: function() 
	{
		requestAnimationFrame( hero_scene._animate );
		hero_scene.renderer.render(hero_scene.scene, hero_scene.camera);
	},

	_addObject: function(THREEobject)
	{
		this.scene.add( THREEobject );
	}
};