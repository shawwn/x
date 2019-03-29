"use strict";

rvr.init = [
	function(bootloader_status)
	{
		rvr.now 							= 0;
		rvr.timescale						= 1;
		rvr.mode 							= 0;
		rvr.scale 							= 1;

		var factor = 1;

		rvr.world_size_x 					= 256 * factor;
		rvr.world_sectors_x					= 8;
		rvr.world_sectorsize_x				= rvr.world_size_x / rvr.world_sectors_x;

		rvr.world_size_y 					= 256 * factor;
		rvr.world_sectors_y					= 8;
		rvr.world_sectorsize_y				= rvr.world_size_y / rvr.world_sectors_y;

		rvr.enemy_deactivation_distance 	= 64;

		rvr.world_size_x_div_2 				= rvr.world_size_x / 2;
		rvr.world_size_y_div_2 				= rvr.world_size_y / 2;
		
		var one_size_fits_all 				= 128 * factor;

		var smoke_map_factor 				= 2;

		rvr.tile_size_x 					= rvr.world_size_x / one_size_fits_all;
		rvr.tile_size_y 					= rvr.world_size_y / one_size_fits_all;

		rvr.map_texture_size 				= one_size_fits_all;
		rvr.depth_map_size 					= one_size_fits_all;
		rvr.fluid_map_size 					= one_size_fits_all;

		rvr.smoke_map_size 					= one_size_fits_all * smoke_map_factor;

		rvr.drawn_depth_map_scale 			= 16 / factor; // used for drawing, since linear interpolation looks bad with the "actual" resolution, and no interpolation flickers a lot

		rvr.step_up_depth_threshold 		= 0.05;

		rvr.temp_array						= new Float32Array([0, 0, 0, 1]);
		rvr.temp_vector						= new Float32Array([0, 0]);

		rvr.player_agent 					= null;
		
		// scents
		rvr.scent_map_size 					= one_size_fits_all;
		rvr.scent_tile_world_size_x 		= (1 / rvr.scent_map_size) * rvr.world_size_x;
		rvr.scent_tile_world_size_y 		= (1 / rvr.scent_map_size) * rvr.world_size_x;
		rvr.scent_update_frequency			= 10;
		rvr.scent_buffer_update_frequency	= 500;
		rvr.last_scent_update				= -rvr.scent_update_frequency;
		rvr.last_scent_buffer_update		= -rvr.scent_buffer_update_frequency;
		rvr.enemy_scent_drop_frequency		= 50;
		rvr.enemy_scent_drop_frequency_max	= 50;
		rvr.enemy_scent_drop_strength		= 0.85;
		rvr.scent_weight__self 				= -0.00000001;
		rvr.scent_weight__attacked			= 1.0;
		rvr.scent_weight__feared 			= -2.0;
		rvr.enemy_scent_check_frequency		= rvr.scent_buffer_update_frequency;
		rvr.scent_buffer 					= new Float32Array(rvr.scent_map_size * rvr.scent_map_size * 4);

		rvr.screen_shake					= 0;

		rvr.projectile_count 				= 500;

		rvr.agent_count						= rvr_AGENT_COUNT;
		rvr.agent_memory_slots 				= 3;
		rvr.agent_memory_timeout			= 10000;
		rvr.agent_memory_slot_update_freq	= 100;

		rvr.debug__draw_debug_text			= 0;
		rvr.debug__render_shadow_mode		= 1;
		rvr.debug__draw_agent_markers		= false;
		rvr.debug__draw_agent_directions	= false;
		rvr.debug__draw_cursor_line			= false;
		rvr.debug__draw_depth_map			= false;
		rvr.debug__draw_depth_map2			= false;
		rvr.debug__draw_scent				= 0;

		rvr.debug__draw_scent__faction		= 0;
		rvr.debug__draw_scent__channel		= 4;

		rvr.min_stamina_to_start_sprint		= 0.1;
		rvr.min_time_between_dodges			= 850;
		rvr.dodge_duration					= 50;
		rvr.dodge_speed_factor				= 10.0;

		rvr.sprint_speed_factor				= 1.45;
		rvr.testing__map_trace_resolution	= 0.125;

		rvr.intro_duration	= 0;

		/*
		rvr.voice__pew = new SpeechSynthesisUtterance();
		rvr.voice__pew.voice = speechSynthesis.getVoices().filter(v => v.name == 'Alex')[0];
		rvr.voice__pew.rate = 10;
		rvr.voice__pew.pitch = 2;
		rvr.voice__pew.text = 'p';
		*/


		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		rvr.cameras = new µ.Cameras2D(rvr, window.innerWidth, window.innerHeight);
		rvr.CAM_PLAYER = rvr.cameras.add_camera(rvr.cameras.CAMERA_TYPE__PORTRAIT, false, rvr.cameras.ORIGIN__LEFT, rvr.cameras.ORIGIN__BOTTOM, rvr.world_size_x, rvr.world_size_y, 0.001, 0.001, 1, true);
		rvr.camera_landscape = rvr.cameras.c[rvr.CAM_LANDSCAPE];
		rvr.camera_portrait = rvr.cameras.c[rvr.CAM_PORTRAIT];
		rvr.camera_stretch = rvr.cameras.c[rvr.CAM_STRETCH];
		rvr.camera_player = rvr.cameras.c[rvr.CAM_PLAYER];

		rvr.min_zoom = 0.5;
		rvr.max_zoom = Math.max(rvr.world_size_x, rvr.world_size_y);

		rvr.normal_zoom = rvr.world_size_x / 16;

		rvr.desired_zoom = rvr.normal_zoom;

		rvr.desired_cam_pos_x = 0.0;
		rvr.desired_cam_pos_y = 0.0;
		rvr.desired_cam_offset_x = 0.0;
		rvr.desired_cam_offset_y = 0.0;
		rvr.cam_offset_x = 0.0;
		rvr.cam_offset_y = 0.0;

		rvr.zoom_at_height_0 = 12.0;
		rvr.zoom_at_height_1 = 18.0
		bootloader_status.info = 'WebGL';
	},
	function(bootloader_status)
	{
		rvr.c = new µ.canvas_webgl('bxx', rvr.scale, -1, -1, rvr.cameras, { autoresize: true, enable_depth_test: false});

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
			µ.log(parameters_to_query[i] + ' ' + rvr.c.gl.getParameter(rvr.c.gl[parameters_to_query[i]]), µ.LOGLEVEL_VERBOSE);
		}
		bootloader_status.info = 'Fonts';
	},
	function(bootloader_status)
	{
		rvr.fonts = new µ.WebGL_Font(rvr.c, rvr.c.canvas.ctx, rvr.cameras.c, rvr.c.textures);
		rvr.FONT_DEFAULT = rvr.fonts.add_font('Tahoma', 'normal', 700, 1024);
		console.log("rvr.FONT_DEFAULT", rvr.FONT_DEFAULT);
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		rvr.particlesGPU = new µ.Particles2D_uniform_arrays(rvr.c.gl, rvr.pDefsGPU, 40000, 5);
		rvr.particlesGPU_below = new µ.Particles2D_uniform_arrays(rvr.c.gl, rvr.pDefsGPU, 20000, 5);
		//rvr.particlesGPU_pixelstore = new µ.WebGL_Particles2D_Pixelstore(rvr.c.gl, rvr.pDefsGPU, 20000);
		bootloader_status.info = 'Factions';
	},
	function(bootloader_status)
	{
		rvr.factions = new rvr.Factions();
		bootloader_status.info = 'Game';
	},
	function(bootloader_status)
	{
		rvr.game = new rvr.Game();
		bootloader_status.info = 'Pickups';
	},
	function(bootloader_status)
	{
		rvr.pickups = new rvr.Pickups();
		bootloader_status.info = 'GUI';
	},
	function(bootloader_status)
	{
		rvr.gui = new rvr.GUI();
		bootloader_status.info = 'Map';
	},
	function(bootloader_status)
	{
		rvr.map = new rvr.Map(rvr.world_size_x, rvr.world_size_y);
		rvr.map.generate(1, 0, µ.rand_int(9999999999999));
		bootloader_status.info = 'Agents';
	},
	function(bootloader_status)
	{
		rvr.agents = new rvr.Agents();
		bootloader_status.info = 'WebGL stuff';
	},
	function(bootloader_status)
	{
		rvr.draw_screen_shader = new µ.WebGL_Rectangle_Screen_Shader1(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		rvr.draw_smoke = new µ.WebGL_Rectangle_Smoke(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		rvr.draw_scent = new µ.WebGL_Rectangle_Scent(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		rvr.draw_fluids = new µ.WebGL_Rectangle_Fluids(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		rvr.draw_depthmap = new µ.WebGL_Rectangle_Depthmap(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		bootloader_status.info = 'Framebuffer';
	},
	function(bootloader_status)
	{
		rvr.framebuffer_gamemap = new µ.WebGL_Framebuffer(rvr.c, rvr.c.gl, rvr.c.textures, 1024);
		bootloader_status.info = 'Lights';
	},
	function(bootloader_status)
	{
		rvr.lights = new rvr.Lights();
		var pixel_data_definition = ['pos_x','pos_y','range','falloff','color_r','color_g','color_b','color_a', 'direction', 'cone', 'range360', 'pos_z'];
		rvr.pixel_store__lights = new µ.WebGL_PixelStore(rvr.c, 'lights', pixel_data_definition, 64);
		rvr.pixel_store__lights.render_data_texture();
		bootloader_status.info = 'Shadows';
	},
	function(bootloader_status)
	{
		rvr.max_light_count = 50;
		rvr.light_and_shadow2 = new µ.WebGL_Rectangle_Light_and_Shadow2(rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.max_light_count);
		rvr.light_and_shadow2.set_texture_step(rvr.map_texture_size);
		bootloader_status.info = 'New Shadows';
	},
	function(bootloader_status)
	{
		rvr.light_and_shadow = new µ.WebGL_Rectangle_Light_and_Shadow(rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.pixel_store__lights);
		rvr.light_and_shadow.set_texture_step(rvr.map_texture_size);
		bootloader_status.info = 'Old shadows';
	},
	function(bootloader_status)
	{
		rvr.map_shadow = new µ.WebGL_Rectangle_Textured_Shadow(rvr.c.gl, rvr.cameras.c, rvr.c.textures);
		rvr.map_shadow.set_texture_step(rvr.map_texture_size);
		bootloader_status.info = 'Scents';
	},
	function(bootloader_status)
	{
		rvr.scents = new rvr.Scents();
// sound scent, deprecated
/*
		rvr.scent = new µ.WebGL_Framebuffer_Pingpong(rvr.c, rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.scent_map_size);
		rvr.scent.set_parameters(
			1.1, 0.05,
			1000.0, 0, 0.95, 0.9, 0.01, 0.0000000000000000000000000001,
			0.00000001, 0, 0.985, 0.965, 0.000001, 0.0000000001,
			0.0000000000001, 0, 0.95, 0.99, 0.0001, 0.000000000000000000001
		);
*/
/*
		SelfFactor1, CornerPenalty1, FalloffAboveOne1, FalloffBelowOne1, DecayAboveOne1, DecayBelowOne1,
		SelfFactor2, CornerPenalty2, FalloffAboveOne2, FalloffBelowOne2, DecayAboveOne2, DecayBelowOne2,
		SelfFactor3, CornerPenalty3, FalloffAboveOne3, FalloffBelowOne3, DecayAboveOne3, DecayBelowOne3

*/
		bootloader_status.info = 'Smoke';
	},
	function(bootloader_status)
	{
		rvr.smoke = new µ.WebGL_Framebuffer_Pingpong(rvr.c, rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.smoke_map_size);
		rvr.smoke.set_parameters(
			0.0, 1.1,
			0.1, 100.1, 0.995, 0.995, 0.01, 0.0000001,
			0.1, 100.1, 0.995, 0.95, 0.01, 0.0000000001,
			0.1, 100.1, 0.995, 0.5, 0.01, 0.00000000000001
		);
		bootloader_status.info = 'Player';
	},


	function(bootloader_status)
	{
		rvr.player = new rvr.Player();
		bootloader_status.info = 'Water';
	},
	function(bootloader_status)
	{
		rvr.fluids = new µ.WebGL_Framebuffer_Pingpong_Fluids(rvr.c, rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.fluid_map_size);
		bootloader_status.info = 'Projectiles';
	},
	function(bootloader_status)
	{
		rvr.projectiles = new rvr.Projectiles();
		bootloader_status.info = 'Loading textures';
	},
	function(bootloader_status)
	{
		rvr.tex_sphere					= rvr.c.load_texture('apps/_revret/img/sphere.png');

		rvr.tex_drone					= rvr.c.load_texture('apps/_revret/img/beholder.png');
		rvr.tex_drone_light				= rvr.c.load_texture('apps/_revret/img/beholder_light.png');
		rvr.tex_drone_light_front		= rvr.c.load_texture('apps/_revret/img/beholder_light_front.png');
		rvr.tex_drone_light_back		= rvr.c.load_texture('apps/_revret/img/beholder_light_back.png');


		rvr.tex_drone_teaser_lights		= rvr.c.load_texture('apps/_revret/img/drone_teaser_lights.png');

		rvr.tex_platform				= rvr.c.load_texture('apps/_revret/img/platform.png');

		rvr.tex_gem						= rvr.c.load_texture('apps/_revret/img/gem.png');

		rvr.tex_eye_no_pupil			= rvr.c.load_texture('apps/_revret/img/eye_no_pupil.png');
		rvr.tex_eye						= rvr.c.load_texture('apps/_revret/img/eye.png');
		rvr.tex_eye_color				= rvr.c.load_texture('apps/_revret/img/eye_color.png');
		rvr.tex_eye_color_pupil_only	= rvr.c.load_texture('apps/_revret/img/eye_color_pupil_only.png');
		rvr.tex_eye_color_pupil_fullframe	= rvr.c.load_texture('apps/_revret/img/eye_color_pupil_fullframe.png');

		rvr.tex_blob					= rvr.c.load_texture('apps/_revret/img/blob_bright.png');
		rvr.tex_blob2					= rvr.c.load_texture('apps/_revret/img/blob2.png');

		rvr.tex_orb_bg					= rvr.c.load_texture('apps/_revret/img/orb_bg.png');
		rvr.tex_orb_bg_blinds1			= rvr.c.load_texture('apps/_revret/img/orb_bg_blinds1.png');
		rvr.tex_orb_bg_blinds2			= rvr.c.load_texture('apps/_revret/img/orb_bg_blinds2.png');

		rvr.tex_orb_light				= rvr.c.load_texture('apps/_revret/img/orb_light.png');

		rvr.tex_drone_armour			= rvr.c.load_texture('apps/_revret/img/drone_armour.png');

		rvr.text_drone_arm				= rvr.c.load_texture('apps/_revret/img/drone_arm.png');

		rvr.tex_tile_stone1				= rvr.c.load_texture('apps/_revret/img/tiles/stone1.png');

		bootloader_status.info = 'Generating textures (prep)';
	},

	function(bootloader_status)
	{
		var size = 512;

		rvr.generated_textures = [
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
		rvr.texture_gen_progress = 0;
	},

	function(bootloader_status)
	{
		
		var gtx = rvr.generated_textures[rvr.texture_gen_progress];
		rvr[gtx[0]]	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(gtx[1], gtx[1], gtx[2]));

		rvr.texture_gen_progress++;
		bootloader_status.progress = rvr.texture_gen_progress / (rvr.generated_textures.length);

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
		rvr.input = new µ.input(rvr.c.canvas, rvr.scale, rvr.cameras);
		rvr.input.KEY_F1.callback_press = function()
		{
			if (rvr.input.KEY_SHIFT.pressed)
			{
				rvr.timescale = 1;
			}
			else
			{
				rvr.debug__draw_debug_text += 1;
				if (rvr.debug__draw_debug_text > 2)
				{
					rvr.debug__draw_debug_text = 0;
				}
			}
		};
		rvr.input.KEY_F2.callback_press = function()
		{
			if (rvr.input.KEY_SHIFT.pressed)
			{
				rvr.timescale = 1 / 4;
			}
			else if (rvr.input.KEY_ALT_LEFT.pressed)
			{
				rvr.timescale = 2;
			}
		};
		rvr.input.KEY_F3.callback_press = function()
		{
			if (rvr.input.KEY_SHIFT.pressed)
			{
				rvr.timescale = 1 / 8;
			}
			else if (rvr.input.KEY_ALT_LEFT.pressed)
			{
				rvr.timescale = 4;
			}
		};
		rvr.input.KEY_F4.callback_press = function()
		{
			if (rvr.input.KEY_SHIFT.pressed)
			{
				rvr.timescale = 1 / 16;
			}
		};
		rvr.input.KEY_1.callback_press = function()
		{
			rvr.debug__render_shadow_mode += 1;
			if (rvr.debug__render_shadow_mode > 2) // skip the dumb ones
			{
				rvr.debug__render_shadow_mode = 0;
			}
		};
		rvr.input.KEY_2.callback_press = function()
		{
			rvr.debug__draw_scent += 1;
			if (rvr.debug__draw_scent > 5)
			{
				rvr.debug__draw_scent = 0;
			}
		};

		rvr.input.KEY_KP1.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__NONE)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__NONE;
		};
		rvr.input.KEY_KP2.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__PLAYER)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__PLAYER;
		};
		rvr.input.KEY_KP3.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__SURVIVORS)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__SURVIVORS;
		};
		rvr.input.KEY_KP4.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__REBELS)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__REBELS;
		};
		rvr.input.KEY_KP5.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__BANDITS)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__BANDITS;
		};
		rvr.input.KEY_KP6.callback_press = function()
		{
			if (rvr.debug__draw_scent__faction == rvr.FACTION__DRONES)
				rvr.debug__draw_scent__channel = (rvr.debug__draw_scent__channel + 1) % 5;
			rvr.debug__draw_scent__faction		= rvr.FACTION__DRONES;
		};


		rvr.input.KEY_3.callback_press = function()
		{
			rvr.debug__draw_depth_map = rvr.debug__draw_depth_map ? false : true;
		};
		rvr.input.KEY_4.callback_press = function()
		{
			rvr.debug__draw_depth_map2 = rvr.debug__draw_depth_map2 ? false : true;
		};
		rvr.input.KEY_B.callback_press = function()
		{
			if (rvr.input.KEY_SHIFT.pressed)
			{
				rvr.debug__draw_agent_directions = rvr.debug__draw_agent_directions ? false : true;
			}
			else
			{
				rvr.debug__draw_agent_markers = rvr.debug__draw_agent_markers ? false : true;
			}
		};
		
		rvr.input.KEY_R.callback_press = function()
		{
			rvr.player_agent.switch_to_next_weapon();
		};
		rvr.input.KEY_N.callback_press = function()
		{
			rvr.debug__draw_cursor_line = rvr.debug__draw_cursor_line ? false : true;
		};
		rvr.input.KEY_TAB.callback_press = function()
		{
			rvr.gui.toggle_inventory();
		};
		rvr.input.KEY_C.callback_press = function()
		{
			rvr.gui.toggle_minimap();
		};
		rvr.input.KEY_X.callback_press = function()
		{
			rvr.player.remote_eye.fire();
		};
		rvr.input.KEY_T.callback_press = function()
		{
			rvr_agents__pos_x[0] = rvr.camera_player.mouse_pos_x;
			rvr_agents__pos_y[0] = rvr.camera_player.mouse_pos_y;
			rvr.desired_cam_pos_x = rvr.camera_player.mouse_pos_x;
			rvr.desired_cam_pos_y = rvr.camera_player.mouse_pos_y;
			//rvr.camera_player.set_pos(rvr.desired_cam_pos_x, rvr.desired_cam_pos_y);
		};
		bootloader_status.info = 'done!';
	},
];