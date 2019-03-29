"use strict";

btx.init = [
	function(bootloader_status)
	{
		btx.now 							= 0;
		btx.timescale						= 1;

		btx.scale 							= 1;

		var factor = 1;

		var one_size_fits_all 				= 512;

		btx.world_size_x 						= one_size_fits_all * factor;
		btx.world_size_y 						= one_size_fits_all * factor;
		btx.world_size_x_div_2 					= btx.world_size_x / 2;
		btx.world_size_y_div_2 					= btx.world_size_y / 2;

		btx.fluid_map_size						= one_size_fits_all;

		btx.temp_array							= new Float32Array([0, 0, 0, 1]);
		btx.temp_vector							= new Float32Array([0, 0]);

		btx.player_agent 						= null;
		btx.projectile_count 					= 500;
		btx.debug__draw_debug_text				= 0;

		btx.intro_duration	= 0;

		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		btx.cameras = new µ.Cameras2D(btx, window.innerWidth, window.innerHeight);
		btx.CAM_PLAYER = btx.cameras.add_camera(btx.cameras.CAMERA_TYPE__PORTRAIT, false, btx.cameras.ORIGIN__LEFT, btx.cameras.ORIGIN__BOTTOM, btx.world_size_x, btx.world_size_y, 0.001, 0.001, 1, true);
		btx.camera_landscape = btx.cameras.c[btx.CAM_LANDSCAPE];
		btx.camera_portrait = btx.cameras.c[btx.CAM_PORTRAIT];
		btx.camera_stretch = btx.cameras.c[btx.CAM_STRETCH];
		btx.camera_player = btx.cameras.c[btx.CAM_PLAYER];

		btx.min_zoom = 0.5;
		btx.max_zoom = Math.max(btx.world_size_x, btx.world_size_y);

		btx.normal_zoom = btx.world_size_x / 1;

		btx.desired_zoom = btx.normal_zoom;

		btx.desired_cam_pos_x = 0.0;
		btx.desired_cam_pos_y = 0.0;
		btx.desired_cam_offset_x = 0.0;
		btx.desired_cam_offset_y = 0.0;
		btx.cam_offset_x = 0.0;
		btx.cam_offset_y = 0.0;

		btx.zoom_at_height_0 = 12.0;
		btx.zoom_at_height_1 = 18.0
		
		
		btx.last_fluid_check = 0;


		bootloader_status.info = 'WebGL';
	},
	function(bootloader_status)
	{
		btx.c = new µ.canvas_webgl('bxx', btx.scale, -1, -1, btx.cameras, { autoresize: true, enable_depth_test: false});

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
			µ.log(parameters_to_query[i] + ' ' + btx.c.gl.getParameter(btx.c.gl[parameters_to_query[i]]), µ.LOGLEVEL_VERBOSE);
		}
		bootloader_status.info = 'Fonts';
	},
	function(bootloader_status)
	{
		btx.fonts = new µ.WebGL_Font(btx.c, btx.c.canvas.ctx, btx.cameras.c, btx.c.textures);
		btx.FONT_DEFAULT = btx.fonts.add_font('Tahoma', 'normal', 700, 1024);
		console.log("btx.FONT_DEFAULT", btx.FONT_DEFAULT);
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		btx.particlesGPU = new µ.Particles2D_uniform_arrays(btx.c.gl, btx.pDefsGPU, 8000, 5);
		btx.particlesGPU_below = new µ.Particles2D_uniform_arrays(btx.c.gl, btx.pDefsGPU, 2000, 5);
		//btx.particlesGPU_pixelstore = new µ.WebGL_Particles2D_Pixelstore(btx.c.gl, btx.pDefsGPU, 20000);
		bootloader_status.info = 'WebGL stuff';
	},
	function(bootloader_status)
	{

		btx.draw_screen_shader = new µ.WebGL_Rectangle_Screen_Shader1(btx.c.gl, btx.cameras.c, btx.c.textures);
		//btx.draw_scent = new µ.WebGL_Rectangle_Scent(btx.c.gl, btx.cameras.c, btx.c.textures);
		btx.draw_fluids = new µ.WebGL_Rectangle_Fluids(btx.c.gl, btx.cameras.c, btx.c.textures);
		//btx.draw_depthmap = new µ.WebGL_Rectangle_Depthmap(btx.c.gl, btx.cameras.c, btx.c.textures);
		bootloader_status.info = 'Framebuffer';
	},
	function(bootloader_status)
	{
		btx.framebuffer_gamemap = new µ.WebGL_Framebuffer(btx.c, btx.c.gl, btx.c.textures, 2048);
		bootloader_status.info = 'Game stuff';
	},
	function(bootloader_status)
	{
		btx.perlin = new µ.PerlinNoise();
		btx.game = new btx.Game();
		btx.map = new btx.Map(btx.world_size_x, btx.world_size_y);
		bootloader_status.info = 'Lights';
	},
	function(bootloader_status)
	{
		//btx.lights = new btx.Lights();
		bootloader_status.info = 'Water';
	},
	function(bootloader_status)
	{
		btx.float_fluid = new Float32Array(btx.fluid_map_size * btx.fluid_map_size * 4);
		btx.fluids = new µ.WebGL_Framebuffer_Pingpong_Fluids3(btx.c, btx.c.gl, btx.cameras.c, btx.c.textures, btx.fluid_map_size);
		bootloader_status.info = 'Loading textures';
	},
	function(bootloader_status)
	{
		bootloader_status.info = 'Generating textures (prep)';
	},

	function(bootloader_status)
	{
		var size = 128;

		btx.generated_textures = [
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
		btx.texture_gen_progress = 0;
	},

	function(bootloader_status)
	{

		var gtx = btx.generated_textures[btx.texture_gen_progress];
		btx[gtx[0]]	= btx.c.texture_from_canvas(µ.generate_canvas_texture(gtx[1], gtx[1], gtx[2]));

		btx.texture_gen_progress++;
		bootloader_status.progress = btx.texture_gen_progress / (btx.generated_textures.length);

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
		btx.input = new µ.input(btx.c.canvas, btx.scale, btx.cameras);
		btx.input.KEY_1.callback_press = function()
		{
			if (btx.input.KEY_SHIFT.pressed)
			{
				btx.timescale = 1;
			}
			else
			{
				btx.debug__draw_debug_text += 1;
				if (btx.debug__draw_debug_text > 2)
				{
					btx.debug__draw_debug_text = 0;
				}
			}
		};
		btx.input.KEY_2.callback_press = function()
		{
			if (btx.input.KEY_SHIFT.pressed)
			{
				btx.timescale = 1 / 4;
			}
			else if (btx.input.KEY_ALT_LEFT.pressed)
			{
				btx.timescale = 2;
			}
		};
		btx.input.KEY_3.callback_press = function()
		{
			if (btx.input.KEY_SHIFT.pressed)
			{
				btx.timescale = 1 / 8;
			}
			else if (btx.input.KEY_ALT_LEFT.pressed)
			{
				btx.timescale = 4;
			}
		};
		btx.input.KEY_4.callback_press = function()
		{
			if (btx.input.KEY_SHIFT.pressed)
			{
				btx.timescale = 1 / 16;
			}
		};

		btx.input.KEY_M.callback_press = function()
		{
			btx.map.generate();
		};

/*
		btx.input.KEY_O.callback_press = function()
		{
			btx.map.set_fluid_at(btx.camera_player.mouse_pos_x, btx.camera_player.mouse_pos_y, 1.0)
		}
*/
		bootloader_status.info = 'done!';
	},
];
