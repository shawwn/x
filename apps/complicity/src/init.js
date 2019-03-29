"use strict";

btx.init = [
	function(bootloader_status)
	{
		btx.now 								= 0;
		btx.timescale							= 1;
		btx.scale 								= 1;
		btx.grid_size 							= 256;
		btx.world_size_x 						= 80;
		btx.world_size_y 						= 80;

		btx.skip_navmesh						= false;

		btx.world_size_x_div_2 					= btx.world_size_x / 2;
		btx.world_size_y_div_2 					= btx.world_size_y / 2;

		btx.street_crossing_width				= 1.0;
		btx.street_width						= 4.0;
		btx.sidewalk_width						= 1.25;
		btx.person_radius						= 0.15;
		btx.person_radius2						= 0.3;
		btx.wall_thickness						= 0.3;

		btx.selected_cityblock 					= -1;
		btx.selected_house						= -1;

		btx.person_count						= 100;
		btx.vehicle_count						= 50;
		btx.lightflash_count					= 1000;

		btx.temp_array							= new Float32Array([0, 0, 0, 1]);
		btx.temp_vector							= new Float32Array([0, 0]);

		btx.player_agent 						= null;
		btx.projectile_count 					= 500;
		btx.debug__draw_debug_text				= 0;

		btx.show_debug_menu						= false;
		btx.selected_debug_menu_item			= 0;

		btx.temp_vector 						= new Float32Array([0, 0]);

		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		btx.cameras 			= new µ.Cameras2D(btx, window.innerWidth, window.innerHeight);
		btx.camera_landscape 	= btx.cameras.c[btx.CAM_LANDSCAPE];
		btx.camera_portrait 	= btx.cameras.c[btx.CAM_PORTRAIT];
		btx.camera_stretch 		= btx.cameras.c[btx.CAM_STRETCH];
		btx.CAM_PLAYER 			= btx.cameras.add_camera(btx.cameras.CAMERA_TYPE__PORTRAIT, false, btx.cameras.ORIGIN__LEFT, btx.cameras.ORIGIN__BOTTOM, btx.world_size_x, btx.world_size_y, 0.001, 0.001, 1, true);
		btx.camera_player 		= btx.cameras.c[btx.CAM_PLAYER];

		btx.min_zoom = 2;
		btx.max_zoom = Math.max(btx.world_size_x, btx.world_size_y);

		btx.normal_zoom = 16;

		btx.desired_zoom = btx.normal_zoom;
		btx.desired_cam_pos_x = 0.0;
		btx.desired_cam_pos_y = 0.0;
		btx.desired_cam_offset_x = 0.0;
		btx.desired_cam_offset_y = 0.0;
		btx.cam_offset_x = 0.0;
		btx.cam_offset_y = 0.0;

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
		btx.FONT_DEFAULT = btx.fonts.add_font('Tahoma', 'normal', 700, 2048);
		console.log("btx.FONT_DEFAULT", btx.FONT_DEFAULT);
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		btx.particlesGPU = new µ.Particles2D_uniform_arrays(btx.c.gl, btx.pDefsGPU, 8000, 5);
		btx.particlesGPU_below = new µ.Particles2D_uniform_arrays(btx.c.gl, btx.pDefsGPU, 2000, 5);
		bootloader_status.info = 'WebGL stuff';
	},
	function(bootloader_status)
	{
		btx.rectangle_clouds = new µ.WebGL_Rectangle_Clouds(btx.c.gl, btx.cameras.c, btx.c.textures);
		btx.draw_screen_shader = new µ.WebGL_Rectangle_Screen_Shader2(btx.c.gl, btx.cameras.c, btx.c.textures);
		bootloader_status.info = 'Framebuffers';
	},
	function(bootloader_status)
	{
		btx.framebuffer_lights 			= new µ.WebGL_Framebuffer(btx.c, btx.c.gl, btx.c.textures, 512);
		btx.framebuffer_displacement 	= new µ.WebGL_Framebuffer(btx.c, btx.c.gl, btx.c.textures, 512);
		btx.framebuffer_gamemap 		= new µ.WebGL_Framebuffer(btx.c, btx.c.gl, btx.c.textures, 1024);
		btx.framebuffer_light_block		= new µ.WebGL_Framebuffer(btx.c, btx.c.gl, btx.c.textures, 512);
		bootloader_status.info = 'Game stuff';
	},
	function(bootloader_status)
	{
		btx.perlin 			= new µ.PerlinNoise();
		btx.game 			= new btx.Game();
		btx.map 			= new btx.Map(btx.grid_size);
		btx.player 			= new btx.Player();
		btx.streets 		= new btx.Streets();
		btx.light_flashes 	= new btx.Light_Flashes();
		btx.cityblocks 		= new btx.Cityblocks();
		btx.navmesh 		= new btx.Navmesh();
		btx.persons 		= new btx.Persons();
		btx.vehicles		= new btx.Vehicles();
		btx.weather			= new btx.Weather();
		bootloader_status.info = 'Loading textures';
	},
	function(bootloader_status)
	{
		//btx.tex_grass							= btx.c.load_texture('apps/complicity/img/grass.png');
		btx.tex_phone_booth						= btx.c.load_texture('apps/complicity/img/phone_booth.png');
		btx.tex_sphere_thingy1					= btx.c.load_texture('apps/complicity/img/sphere_thingy1.png');

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
				'tex_square_outline8',
				size,
				function(ctx, size_x, size_y, data)
				{
					ctx.lineWidth = size_x / 8;
					ctx.strokeStyle = "rgb(255,0,0)";
					ctx.strokeRect (0, 0, size_x - 1, size_y - 1);
				}
			],
			[
				'tex_square_outline32',
				size,
				function(ctx, size_x, size_y, data)
				{
					ctx.lineWidth = size_x / 32;
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
				'tex_circle_outline',
				size,
				function(ctx, size_x, size_y, data)
				{
					var linewidth = size_x / 16;
					ctx.beginPath();
					ctx.arc(size_x / 2, size_y / 2, size_x / 2 - linewidth / 2, 0, 2 * Math.PI, false);
					ctx.strokeStyle = '#f00';
					ctx.lineWidth = linewidth;
					ctx.stroke();
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
					gradient.addColorStop(0.125,'hsla(0,100%,50%,0.75)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.5)');
					gradient.addColorStop(0.375,'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0)');
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
					gradient.addColorStop(0.125,'hsla(0,0%,100%,0.5)');
					gradient.addColorStop(0.25, 'hsla(0,0%,100%,0.25)');
					gradient.addColorStop(0.375,'hsla(0,0%,100%,0.125)');
					gradient.addColorStop(0.5, 	'hsla(0,0%,100%,0.0)');
					ctx.beginPath();
				    ctx.arc(size_x / 2, size_y / 2, size_x / 2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
				}
			],
			[
				'tex_circle_displacement',
				size,
				function(ctx, size_x, size_y, data)
				{
					var max_dist = size_x / 2;
					for (var x = 0; x < size_x; x++)
					{
						for (var y = 0; y < size_y; y++)
						{
							var dist = µ.distance2D(x, y, size_y / 2, size_y / 2);
							var lum = 40 + µ.rand(20);
							var frac = Math.max(0, (1.0 - dist / max_dist));
							var frac_x = x / (size_x - 1);
							var frac_y = y / (size_y - 1);
							if (frac)
							{
								ctx.fillStyle = "rgb(" + Math.round(100 + frac_x * 155) + "," + Math.round(100 + frac_y * 155) + "," + Math.round(frac * 255) + ")";
								ctx.fillRect (x, y, 1, 1);
							}
						}
					}
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
			for (var i = 0; i < btx.CITYBLOCK_TYPES_COUNT; i++)
			{
				btx.cityblock_types[i].count = 0;
			}
			btx.map.generate();
			btx.streets = new btx.Streets();
			btx.cityblocks = new btx.Cityblocks();
			btx.navmesh = new btx.Navmesh();
			btx.persons = new btx.Persons();
			for (var i = 0; i < btx.person_count; i++)
			{
				btx.persons.add_person();
			}
			btx.selected_cityblock = -1;
			btx.game.reset();
		};

		btx.input.KEY_KP1.callback_press = function()
		{
			btx.game.spectated_person = -1;
		};
		btx.input.KEY_KP2.callback_press = function()
		{
			btx.game.spectated_person--;
			if (btx.game.spectated_person < 0)
			{
				btx.game.spectated_person = btx.person_count - 1;
			}
		};
		btx.input.KEY_KP3.callback_press = function()
		{
			btx.game.spectated_person++;
			if (btx.game.spectated_person >= btx.person_count)
			{
				btx.game.spectated_person = 0;
			}
		};

		btx.input.KEY_KP0.callback_press = function()
		{
			btx.game.spectated_person = btx.find_closest_person_to(btx.camera_player.mouse_pos_x, btx.camera_player.mouse_pos_y);
			if (btx.game.spectated_person != -1)
			{
				var person = btx.persons.persons[btx.game.spectated_person];
			}
			console.log(person.current_goal, person.current_activity, person.inside_a_house, person.inside_house);
		};


		btx.input.KEY_KP5.callback_press = function()
		{
			btx.game.spectated_person = btx.find_closest_person_to(btx.camera_player.mouse_pos_x, btx.camera_player.mouse_pos_y);
			if (btx.game.spectated_person != -1)
			{
				btx.player.control_person(btx.game.spectated_person);
			}
		};

		btx.input.KEY_F1.callback_press = function()
		{
			btx.show_debug_menu = !btx.show_debug_menu;
		};

		btx.input.KEY_CURSOR_DOWN.callback_press = function()
		{
			if (btx.show_debug_menu)
			{
				btx.selected_debug_menu_item++;
				if (btx.selected_debug_menu_item >= btx.options_debug.length)
				{
					btx.selected_debug_menu_item = 0;
				}
			}
		};
		btx.input.KEY_CURSOR_UP.callback_press = function()
		{
			if (btx.show_debug_menu)
			{
				btx.selected_debug_menu_item--;
				if (btx.selected_debug_menu_item < 0)
				{
					btx.selected_debug_menu_item = btx.options_debug.length - 1;
				}
			}
		};

		btx.input.KEY_CURSOR_LEFT.callback_press = function()
		{
			if (btx.show_debug_menu)
			{
				var option = btx.options_debug[btx.selected_debug_menu_item];
				if (option.type == 'bool')
				{
					btx.options_debug_values[btx.selected_debug_menu_item] = !btx.options_debug_values[btx.selected_debug_menu_item];
					localStorage.setItem("complicity_option_" + btx.selected_debug_menu_item, btx.options_debug_values[btx.selected_debug_menu_item] ? "1" : "0");
				}
				if (option.type == 'list')
				{
					for (var i = 0, len = option.values.length; i < len; i++)
					{
						if (option.values[i] == btx.options_debug_values[btx.selected_debug_menu_item])
						{
							break;
						}
					}
					i -= 1;
					if (i < 0)
					{
						i = option.values.length - 1;
					}
					btx.options_debug_values[btx.selected_debug_menu_item] = option.values[i];
					localStorage.setItem("complicity_option_" + btx.selected_debug_menu_item, btx.options_debug_values[btx.selected_debug_menu_item]);
				}
			}
		};

		btx.input.KEY_CURSOR_RIGHT.callback_press = function()
		{
			if (btx.show_debug_menu)
			{
				var option = btx.options_debug[btx.selected_debug_menu_item];
				if (option.type == 'bool')
				{
					btx.options_debug_values[btx.selected_debug_menu_item] = !btx.options_debug_values[btx.selected_debug_menu_item];
					localStorage.setItem("complicity_option_" + btx.selected_debug_menu_item, btx.options_debug_values[btx.selected_debug_menu_item] ? "1" : "0");
				}
				if (option.type == 'list')
				{
					for (var i = 0, len = option.values.length; i < len; i++)
					{
						if (option.values[i] == btx.options_debug_values[btx.selected_debug_menu_item])
						{
							break;
						}
					}
					i += 1;
					if (i >= option.values.length)
					{
						i = 0;
					}
					btx.options_debug_values[btx.selected_debug_menu_item] = option.values[i];
					localStorage.setItem("complicity_option_" + btx.selected_debug_menu_item, btx.options_debug_values[btx.selected_debug_menu_item]);
				}
			}
		};

		btx.input.KEY_SPACE.callback_press = function()
		{
			btx.game.current_time = 24 * 3600 * btx.camera_stretch.mouse_pos_x;
		};
		bootloader_status.info = 'done!';
	},
];

btx.find_closest_person_to = function(pos_x, pos_y)
{
	var closest_dist = 9999999999;
	var closest_person_id = -1;
	for (var i = 0, len = btx.persons.persons.length; i < len; i++)
	{
		var dist = µ.distance2D(pos_x, pos_y, btx.persons.persons[i].pos_x, btx.persons.persons[i].pos_y);
		if (dist < closest_dist)
		{
			closest_dist = dist;
			closest_person_id = i;
		}
	}
	return closest_person_id;
};

