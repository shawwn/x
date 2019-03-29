function get_bool_option(option)
{
	return (option == '1');
}

asbx.init = [
	function(bootloader_status)
	{
		asbx.now = 0;
		asbx.scale = 1;

		asbx.is_intro = true;
		asbx.intro_fade = 0;
		asbx.intro_fade_duration = 200;

		asbx.old_mouse_x = 0;
		asbx.old_mouse_y = 0;

		asbx.material_player = new p2.Material();
		asbx.material_wall	 = new p2.Material();

		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		asbx.cameras = new µ.Cameras2D(asbx, window.innerWidth, window.innerHeight);
		asbx.camera_landscape = asbx.cameras.c[asbx.CAM_LANDSCAPE];
		asbx.camera_portrait = asbx.cameras.c[asbx.CAM_PORTRAIT];
		asbx.camera_stretch = asbx.cameras.c[asbx.CAM_STRETCH];
		asbx.CAM_PLAYER = asbx.cameras.add_camera(asbx.cameras.CAMERA_TYPE__PORTRAIT, false, asbx.cameras.ORIGIN__LEFT, asbx.cameras.ORIGIN__BOTTOM, 1.0, 1.0, 1.0, 1.0, 1, true);
		asbx.camera_player = asbx.cameras.c[asbx.CAM_PLAYER];
		asbx.desired_zoom = 2.0;
		asbx.camera_player.set_zoom(asbx.desired_zoom);
		bootloader_status.info = 'WebGL';
	},
	function(bootloader_status)
	{
		asbx.c = new µ.canvas_webgl('bxx', asbx.scale, -1, -1, asbx.cameras, {
				autoresize: true,
			});
		bootloader_status.info = 'Initialize texture loading';
	},
	function(bootloader_status)
	{
		asbx.tex_golfball		= asbx.c.load_texture('apps/AdventureSandbox/textures/wall_wavy.png');
		asbx.tex_tile_wall		= asbx.c.load_texture('apps/AdventureSandbox/textures/wall.png');
		bootloader_status.info = 'Fonts';
	},
	function(bootloader_status)
	{
		asbx.fonts = new µ.WebGL_Font(asbx.c, asbx.c.canvas.ctx, asbx.cameras.c, asbx.c.textures);
		asbx.font_name = asbx.fonts.add_font('Georgia', 'normal', 400, 2048);
		asbx.font_name_bold = asbx.fonts.add_font('Tahoma', 'normal', 700, 2048);

		asbx.framebuffer = new µ.WebGL_Framebuffer(asbx.c, asbx.c.gl, asbx.c.textures, 1024);

		bootloader_status.info = 'Area';
	},
	function(bootloader_status)
	{
		asbx.current_area = new asbx.Area(asbx.AREATYPE_SIDE, 64, 64, 2, 2);
		
		
		
		bootloader_status.info = 'Player';
	},
	function(bootloader_status)
	{
		asbx.player = new asbx.Player();

		asbx.player.spawn_into_world(asbx.current_area);

		asbx.current_area.generate_physics();


		bootloader_status.info = 'Input';
	},
	function(bootloader_status)
	{
		asbx.input = new µ.input(asbx.c.canvas, asbx.scale, asbx.cameras);

		asbx.show_debug = false;
		asbx.input.KEY_F1.callback_press = function()
		{
			asbx.show_debug = !asbx.show_debug;
		};
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		asbx.particlesGPU = new µ.Particles2D_uniform_arrays(asbx.c.gl, asbx.pDefsGPU, 20000, 5);
		asbx.particlesGPU_top = new µ.Particles2D_uniform_arrays(asbx.c.gl, asbx.pDefsGPU, 20000, 5);
		bootloader_status.info = 'Generate textures';
	},
	function(bootloader_status)
	{
		asbx.tex_circle	= asbx.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			ctx.beginPath();
		    ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
		    ctx.fillStyle = '#f00';
		    ctx.fill();
		}));
		asbx.tex_circle_soft_reverse	= asbx.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			var gradient = ctx.createRadialGradient(256,256,0,256,256,258);
		    gradient.addColorStop(0, 'hsla(0,100%,50%,0)');
		    gradient.addColorStop(0.25, 'hsla(0,100%,50%,0)');
		    gradient.addColorStop(0.5, 'hsla(0,100%,50%,0.2)');
		    gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.3)');
		    gradient.addColorStop(1, 'hsla(0,100%,50%,1)');
			ctx.beginPath();
		      ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
		      ctx.fillStyle = gradient;
		      ctx.fill();
		}));
		asbx.tex_circle_soft	= asbx.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			var gradient = ctx.createRadialGradient(256,256,0,256,256,258);
		    gradient.addColorStop(1, 'hsla(0,100%,50%,0)');
		    gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.25)');
		    gradient.addColorStop(0.5, 'hsla(0,100%,50%,0.5)');
		    gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.75)');
		    gradient.addColorStop(0, 'hsla(0,100%,50%,1)');
			ctx.beginPath();
		      ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
		      ctx.fillStyle = gradient;
		      ctx.fill();
		}));

		//asbx.options__ball_trail = localStorage.getItem("dodgygame_options__ball_trail") != null ? get_bool_option(localStorage.getItem("dodgygame_options__ball_trail")) : true;
		//localStorage.setItem("dodgygame_options__speed", asbx.options__speed);

		bootloader_status.info = 'done!';
	},
];