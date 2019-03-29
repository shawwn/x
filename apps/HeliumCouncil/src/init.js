"use strict";

hc.init = [
	function(bootloader_status)
	{
		hc.now 									= 0;
		hc.timescale							= 1;
		hc.scale 								= 1;

		hc.universe_size_x 						= 1000.0;
		hc.universe_size_y 						= 1000.0;
		hc.universe_size_x_div_2 				= hc.universe_size_x / 2;
		hc.universe_size_y_div_2 				= hc.universe_size_y / 2;


		hc.temp_array							= new Float32Array([0, 0, 0, 1]);
		hc.temp_vector							= new Float32Array([0, 0]);

		hc.player_agent 						= null;
		hc.projectile_count 					= 500;
		hc.debug__draw_debug_text				= 0;

		hc.intro_duration	= 0;

		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		hc.cameras = new µ.Cameras2D(hc, window.innerWidth, window.innerHeight);
		hc.CAM_PLAYER = hc.cameras.add_camera(hc.cameras.CAMERA_TYPE__PORTRAIT, false, hc.cameras.ORIGIN__LEFT, hc.cameras.ORIGIN__BOTTOM, hc.universe_size_x, hc.universe_size_y, 0.001, 0.001, 1, true);
		hc.camera_landscape = hc.cameras.c[hc.CAM_LANDSCAPE];
		hc.camera_portrait = hc.cameras.c[hc.CAM_PORTRAIT];
		hc.camera_stretch = hc.cameras.c[hc.CAM_STRETCH];
		hc.camera_player = hc.cameras.c[hc.CAM_PLAYER];

		hc.min_zoom = 0.5;
		hc.max_zoom = Math.max(hc.universe_size_x, hc.universe_size_y);

		hc.normal_zoom = hc.universe_size_x;

		hc.desired_zoom = hc.normal_zoom;

		hc.desired_cam_pos_x = 0.0;
		hc.desired_cam_pos_y = 0.0;
		hc.desired_cam_offset_x = 0.0;
		hc.desired_cam_offset_y = 0.0;
		hc.cam_offset_x = 0.0;
		hc.cam_offset_y = 0.0;

		hc.zoom_at_height_0 = 12.0;
		hc.zoom_at_height_1 = 18.0
		
		
		hc.last_fluid_check = 0;


		bootloader_status.info = 'WebGL';
	},
	function(bootloader_status)
	{
		hc.c = new µ.canvas_webgl('bxx', hc.scale, -1, -1, hc.cameras, { autoresize: true, enable_depth_test: false});

		var parameters_to_query = [
			'MAX_VERTEX_ATTRIBS',
			'MAX_VARYING_VECTORS',
			'MAX_VERTEX_UNIFORM_VECTORS',
			'MAX_FRAGMENT_UNIFORM_VECTORS',
			'MAX_TEXTURE_IMAGE_UNITS',
			'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
			'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
			'MAX_VIEWPORT_DIMS',
			'MAX_RENDERBUFFER_SIZE',
			'MAX_TEXTURE_SIZE',
		];

		for (var i = 0; i < parameters_to_query.length; i++)
		{
			µ.log(parameters_to_query[i] + ' ' + hc.c.gl.getParameter(hc.c.gl[parameters_to_query[i]]), µ.LOGLEVEL_VERBOSE);
		}
		bootloader_status.info = 'Fonts';
	},
	function(bootloader_status)
	{
		hc.fonts = new µ.WebGL_Font(hc.c, hc.c.canvas.ctx, hc.cameras.c, hc.c.textures);
		hc.FONT_DEFAULT = hc.fonts.add_font('Tahoma', 'normal', 700, 1024);
		console.log("hc.FONT_DEFAULT", hc.FONT_DEFAULT);
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		hc.particlesGPU = new µ.Particles2D_uniform_arrays(hc.c.gl, hc.pDefsGPU, 38000, 5);
		hc.particlesGPU_below = new µ.Particles2D_uniform_arrays(hc.c.gl, hc.pDefsGPU, 2000, 5);
		//hc.particlesGPU_pixelstore = new µ.WebGL_Particles2D_Pixelstore(hc.c.gl, hc.pDefsGPU, 20000);
		bootloader_status.info = 'WebGL stuff';
	},
	function(bootloader_status)
	{

		hc.draw_screen_shader = new µ.WebGL_Rectangle_Screen_Shader1(hc.c.gl, hc.cameras.c, hc.c.textures);
		//hc.draw_scent = new µ.WebGL_Rectangle_Scent(hc.c.gl, hc.cameras.c, hc.c.textures);
		hc.draw_fluids = new µ.WebGL_Rectangle_Fluids(hc.c.gl, hc.cameras.c, hc.c.textures);
		//hc.draw_depthmap = new µ.WebGL_Rectangle_Depthmap(hc.c.gl, hc.cameras.c, hc.c.textures);
		bootloader_status.info = 'Framebuffer';
	},
	function(bootloader_status)
	{
		hc.framebuffer_gamemap = new µ.WebGL_Framebuffer(hc.c, hc.c.gl, hc.c.textures, 2048);
		bootloader_status.info = 'Game stuff';
	},
	function(bootloader_status)
	{
		hc.perlin = new µ.PerlinNoise();
		hc.game = new hc.Game();
		hc.universe = new hc.Universe(hc.universe_size_x, hc.universe_size_y);
		bootloader_status.info = 'Lights';
	},
	function(bootloader_status)
	{
		//hc.lights = new hc.Lights();
		bootloader_status.info = 'Loading textures';
	},
	function(bootloader_status)
	{
		bootloader_status.info = 'Generating textures (prep)';
	},

	function(bootloader_status)
	{
		var size = 128;

		hc.generated_textures = [
			[
				'tex_noise',
				size,
				function(ctx, size_x, size_y, data)
				{
					for (var x = 0; x < size_x; x++)
					{
						for (var y = 0; y < size_y; y++)
						{
							//var lum = 200 + µ.rand_int(55);
							var lum = 40 + µ.rand(20);
							//ctx.fillStyle = "rgb("+lum+","+lum+","+lum+")";
							ctx.fillStyle = "hsl(0,100%,"+lum+"%)";
							ctx.fillRect (x, y, 1, 1);
						}
					}
				}
			],
			[
				'tex_soft_square',
				size,
				function(ctx, size_x, size_y, data)
				{
					var edge_dist = size_x / 4;
					for (var x = 0; x < size_x; x++)
					{
						for (var y = 0; y < size_y; y++)
						{
							if (x > edge_dist && x < size_x - edge_dist && y > edge_dist && y < size_y - edge_dist)
							{
								continue;
							}
							var alpha = 1;
							if (x < edge_dist)				alpha *= x/edge_dist;
							else if (x > (size_x - edge_dist))	alpha *= (size_x-x)/edge_dist;
							if (y < edge_dist)				alpha *= y/edge_dist;
							else if (y > (size_y - edge_dist))	alpha *= (size_y-y)/edge_dist;
							ctx.fillStyle = "rgba(255,255,255,"+alpha+")";
							ctx.fillRect (x, y, 1, 1); // heh!
						}
					}
					ctx.fillStyle = "rgba(255,255,255,1)";
					ctx.fillRect (edge_dist, edge_dist, size_x-edge_dist*2, size_y-edge_dist*2);
				}
			],
			[
				'tex_square_outline',
				size,
				function(ctx, size_x, size_y, data)
				{
					ctx.lineWidth = size_x / 16;
					ctx.strokeStyle = "rgb(255,0,0)";
					ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
				}
			],
			[
				'tex_circle',
				size,
				function(ctx, size_x, size_y, data)
				{
					ctx.beginPath();
					ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
					ctx.fillStyle = '#f00';
					ctx.fill();
				}
			],
			[
				'tex_circle_thick_outline',
				size,
				function(ctx, size_x, size_y, data)
				{
					var linewidth = size_x / 8;
					ctx.beginPath();
					ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
					ctx.strokeStyle = '#f00';
					ctx.lineWidth = linewidth;
					ctx.stroke();
				}
			],
			[
				'tex_circle_soft_reverse',
				size,
				function(ctx, size_x, size_y, data)
				{
					var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0.5)');
					gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.75)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,1)');
					ctx.beginPath();
				    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
				}
			],
			[
				'tex_circle_soft',
				size,
				function(ctx, size_x, size_y, data)
				{
					var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,1)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.75)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0.5)');
					gradient.addColorStop(0.75, 'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,0)');
					ctx.beginPath();
				    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
				}
			],
			[
				'tex_white_circle_soft',
				size,
				function(ctx, size_x, size_y, data)
				{
					var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
					gradient.addColorStop(0, 	'hsla(0,0%,100%,1)');
					gradient.addColorStop(0.25, 'hsla(0,0%,100%,0.5)');
					gradient.addColorStop(0.5, 	'hsla(0,0%,100%,0.25)');
					gradient.addColorStop(0.75, 'hsla(0,0%,100%,0.125)');
					gradient.addColorStop(1, 	'hsla(0,0%,100%,0)');
					ctx.beginPath();
				    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
				}
			],
			[
				'tex_circle_shield',
				size,
				function(ctx, size_x, size_y, data)
				{
					var gradient = ctx.createRadialGradient(size_x/2, size_y/2, 0, size_x/2, size_y/2, size_x);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0)');
					gradient.addColorStop(0.66, 'hsla(0,100%,50%,1)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,1)');

					ctx.beginPath();
					ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
					ctx.fillStyle = gradient;
					ctx.fill();
				}
			],
			[
				'tex_bar_shield',
				size,
				function(ctx, size_x, size_y, data)
				{

					var gradient = ctx.createLinearGradient(0, 0, size_x, size_y);
					gradient.addColorStop(0, 	'hsla(0,100%,100%,1)');
					gradient.addColorStop(0.25, 'hsla(5,100%,40%,1)');
					gradient.addColorStop(0.75, 'hsla(10,100%,30%,1)');
					gradient.addColorStop(1, 	'hsla(15,100%,20%,1)');
					ctx.lineWidth = size_x / 32;
					ctx.strokeStyle = "rgb(255,0,0)";
					ctx.fillStyle = gradient;
					ctx.fillRect (0, 0, size_x, size_y);
					//ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
				}
			],

		];
		bootloader_status.info = 'Generating textures';
		hc.texture_gen_progress = 0;
	},

	function(bootloader_status)
	{

		var gtx = hc.generated_textures[hc.texture_gen_progress];
		hc[gtx[0]]	= hc.c.texture_from_canvas(µ.generate_canvas_texture(gtx[1], gtx[1], gtx[2]));

		hc.texture_gen_progress++;
		bootloader_status.progress = hc.texture_gen_progress / (hc.generated_textures.length);

		if (bootloader_status.progress < 1.0)
		{
			bootloader_status.info = 'Generating texture<br>' +gtx[0]+ '<br>' + Math.round(bootloader_status.progress * 100) + '%';
		}
		else
		{
			bootloader_status.info = 'Input';
		}
	},
	function(bootloader_status)
	{
		hc.input = new µ.input(hc.c.canvas, hc.scale, hc.cameras);
		hc.input.KEY_1.callback_press = function()
		{
			hc.timescale = 1;
		};
		hc.input.KEY_2.callback_press = function()
		{
			if (hc.input.KEY_SHIFT.pressed)
			{
				hc.timescale = 1 / 4;
			}
			else if (hc.input.KEY_ALT_LEFT.pressed)
			{
				hc.timescale = 2;
			}
		};
		hc.input.KEY_3.callback_press = function()
		{
			if (hc.input.KEY_SHIFT.pressed)
			{
				hc.timescale = 1 / 8;
			}
			else if (hc.input.KEY_ALT_LEFT.pressed)
			{
				hc.timescale = 4;
			}
		};
		hc.input.KEY_4.callback_press = function()
		{
			if (hc.input.KEY_SHIFT.pressed)
			{
				hc.timescale = 1 / 16;
			}
			else if (hc.input.KEY_ALT_LEFT.pressed)
			{
				hc.timescale = 8
			}
		};

		hc.input.KEY_M.callback_press = function()
		{
			hc.map.generate();
		};

/*
		hc.input.KEY_O.callback_press = function()
		{
			hc.map.set_fluid_at(hc.camera_player.mouse_pos_x, hc.camera_player.mouse_pos_y, 1.0)
		}
*/
		bootloader_status.info = 'done!';
	},
];
