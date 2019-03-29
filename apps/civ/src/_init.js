'use strict';

civ.init = [
	function(bootloader_status)
	{
		civ.debug_particles = 0;
		civ.now = 0;
		civ.scale = 2;

		civ.old_mouse_pos_x = 0;
		civ.old_mouse_pos_y = 0;
		
		civ.desired_cam_pos_x = 0;
		civ.desired_cam_pos_y = 0;
		civ.desired_zoom = civ.WORLD_SIZE_X;

		civ.temp_array3 = [0, 0, 0];
		civ.temp_array4_uint8 = new Uint8Array(4);

		bootloader_status.info = 'Cameras';
	},
	function(bootloader_status)
	{
		civ.cameras = new µ.Cameras2D(civ, window.innerWidth, window.innerHeight);
		civ.CAM_PLAYER = civ.cameras.add_camera(civ.cameras.CAMERA_TYPE__PORTRAIT, false, civ.cameras.ORIGIN__LEFT, civ.cameras.ORIGIN__BOTTOM, civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y, 0.001, 0.001, 1, true);
		civ.camera_player = civ.cameras.c[civ.CAM_PLAYER];
		civ.camera_landscape = civ.cameras.c[civ.CAM_LANDSCAPE];
		civ.camera_portrait = civ.cameras.c[civ.CAM_PORTRAIT];
		civ.camera_stretch = civ.cameras.c[civ.CAM_STRETCH];
		civ.camera_player.set_pos(civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2);
		bootloader_status.info = 'WebGL';
	},
	function(bootloader_status)
	{
		civ.c = new µ.canvas_webgl('bxx', civ.scale, -1, -1, civ.cameras, {
				autoresize: true,
			});

		civ.draw_clouds = new µ.WebGL_Rectangle_Clouds(civ.c.gl, civ.cameras.c, civ.c.textures);

		civ.draw_tiles = new µ.WebGL_Rectangle_Tiles(civ.c.gl, civ.cameras.c, civ.c.textures);
		civ.draw_tiles.set_tile_counts(civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, civ.MAP_SUBTILES_X, civ.MAP_SUBTILES_Y);

		civ.draw_subtiles = new µ.WebGL_Rectangle_Subtiles(civ.c.gl, civ.cameras.c, civ.c.textures);
		civ.draw_subtiles.set_tile_counts(civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, civ.MAP_SUBTILES_X, civ.MAP_SUBTILES_Y);

		bootloader_status.info = 'Input';
	},
	function(bootloader_status)
	{
		civ.input = new µ.input(civ.c.canvas, civ.scale, civ.cameras);
		bootloader_status.info = 'Fonts';
	},
	function(bootloader_status)
	{
		civ.fonts = new µ.WebGL_Font(civ.c, civ.c.canvas.ctx, civ.cameras.c, civ.c.textures);
		civ.FONT_DEFAULT = civ.fonts.add_font('Tahoma', 'normal', 700, 4096);
		bootloader_status.info = 'Map';
	},
	function(bootloader_status)
	{
		civ.map = new civ.Map(civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, civ.MAP_SUBTILES_X, civ.MAP_SUBTILES_Y);
		bootloader_status.info = 'Particles';
	},
	function(bootloader_status)
	{
		civ.particlesGPU = new µ.Particles2D_uniform_arrays(civ.c.gl, civ.pDefsGPU, 50000, 5);


		civ.tex_mothership					= civ.c.load_texture('apps/civ/img/beholder_bg.png');
		civ.tex_mothership_light_front		= civ.c.load_texture('apps/civ/img/beholder_light_front.png');
		civ.tex_mothership_light_back		= civ.c.load_texture('apps/civ/img/beholder_light_back.png');


		bootloader_status.info = 'Generating textures (prep)';
	},
	civ.init_generate_textures,
	function(bootloader_status)
	{
		var gtx = civ.generated_textures[civ.texture_gen_progress];
		civ[gtx[0]]	= civ.c.texture_from_canvas(µ.generate_canvas_texture(gtx[1], gtx[1], gtx[2]));
		civ.texture_gen_progress++;
		bootloader_status.progress = civ.texture_gen_progress / (civ.generated_textures.length);
		if (bootloader_status.progress < 1.0)
		{
			bootloader_status.info = 'Generating texture<br>' +gtx[0]+ '<br>' + Math.round(bootloader_status.progress * 100) + '%';
		}
		else
		{
			bootloader_status.info = 'Game';
		}
	},
	function(bootloader_status)
	{
		civ.game = new civ.Game();
		bootloader_status.info = 'Gamestate';
	},
	function(bootloader_status)
	{
		civ.gamestate = new civ.Gamestate();
		bootloader_status.info = 'GUI';
	},
	function(bootloader_status)
	{
		civ.gui = new civ.GUI();
		bootloader_status.info = 'Units';
	},
	function(bootloader_status)
	{
		civ.units = new civ.Units();
		bootloader_status.info = 'Persons';
	},
	function(bootloader_status)
	{
		civ.persons = new civ.Persons();
		bootloader_status.info = 'Player';
	},
	function(bootloader_status)
	{
		civ.player = new civ.Player();
		var mothership_index = civ.units.spawn(civ.UNIT_TYPE__MOTHERSHIP, 0, 10, 10);
		for (var i = 0; i < 250; i++)
		{
			civ.persons.spawn_in_mothership(mothership_index);
		}
		civ.player.selected_unit = mothership_index;
		bootloader_status.info = 'Stuff';
	},
	function(bootloader_status)
	{
		civ.perlin = new µ.PerlinNoise();
		civ.perlin1 = new µ.PerlinNoise();
		civ.perlin2 = new µ.PerlinNoise();
		civ.perlin3 = new µ.PerlinNoise();
		bootloader_status.info = 'Colonies';
	},
	function(bootloader_status)
	{
		civ.colonies = new civ.Colonies();
		bootloader_status.info = '';
	},
	function(bootloader_status)
	{
		bootloader_status.info = '';
	},
	function(bootloader_status)
	{
		bootloader_status.info = '';
	},
	function(bootloader_status)
	{
		bootloader_status.info = 'done!';
	},
];