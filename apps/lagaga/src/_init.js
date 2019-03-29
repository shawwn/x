"use strict";

lgg.init = [
	function(bootloader_status) {

		lgg.now											= 0;
		lgg.scale										= 1;
		
		lgg.show_ship_setup								= false;
		lgg.ship_setup__selected_weapon					= 0;

		lgg.show_debug_menu								= false;
		lgg.selected_debug_menu_item					= 0;
		
		lgg.debug__selected_enemy						= -1;
		lgg.debug__selected_enemy_type					= -1;

		lgg.GAMESTATE__INTRO				= 0;
		lgg.GAMESTATE__MENU					= 1;
		lgg.GAMESTATE__PLAYING				= 2;

		lgg.LEVELSTATE__WARMUP				= 0;
		lgg.LEVELSTATE__RESPAWN_SELECT		= 1;
		lgg.LEVELSTATE__RESPAWNING			= 2;
		lgg.LEVELSTATE__PLAYING				= 3;
		lgg.LEVELSTATE__TRADER				= 4;
		lgg.LEVELSTATE__TRADER_ENTER		= 5;
		lgg.LEVELSTATE__TRADER_EXIT			= 6;
		lgg.LEVELSTATE__SINGULARITY			= 7;
		lgg.LEVELSTATE__SINGULARITY_ENTER	= 8;
		lgg.LEVELSTATE__SINGULARITY_EXIT	= 9;
		lgg.LEVELSTATE__GAME_OVER			= 10;
		
		lgg.test_runs = 5;
		lgg.test_run_duration = 100000;
		
		lgg.test_enemies_alive_of_type = [];
		lgg.test_player_score = [];
		lgg.test_ = [];
		

		bootloader_status.info = 'cameras';
	},

	function(bootloader_status)
	{
		lgg.cameras = new µ.Cameras2D(lgg, window.innerWidth, window.innerHeight);

		lgg.CAM_PLAYER = lgg.cameras.add_camera(lgg.cameras.CAMERA_TYPE__PORTRAIT, false, lgg.cameras.ORIGIN__LEFT, lgg.cameras.ORIGIN__BOTTOM, 1, 1, .5, .5, 1, true);

		lgg.camera_landscape = lgg.cameras.c[lgg.CAM_LANDSCAPE];
		lgg.camera_portrait = lgg.cameras.c[lgg.CAM_PORTRAIT];
		lgg.camera_stretch = lgg.cameras.c[lgg.CAM_STRETCH];
		lgg.camera_player = lgg.cameras.c[lgg.CAM_PLAYER];
/*
		lgg.cameras.hud = new µ.Camera2D('portrait', true, 'left', 'bottom');
		lgg.cameras.hud.set_size(1.0, 1.0);
		lgg.cameras.hud.set_pos(1, 1);
*/

		bootloader_status.info = 'WebGL';
	},

	function(bootloader_status)
	{
		lgg.c = new µ.canvas_webgl('bxx', lgg.scale, -1, -1, lgg.cameras, {
				autoresize: true,
				enable_depth_test: false,
			});

		//lgg.c.refresh_size();

		//lgg.cameras.player.aspect = lgg.c.size_x / lgg.c.size_y;
		lgg.camera_player.set_pos(lgg.camera_player.aspect/2, 0.5);
/*
		lgg.cameras.hud.set_zoom(1);
		lgg.cameras.hud.set_pos(lgg.cameras.player.aspect/2, 0.5);
*/

		
		bootloader_status.info = 'WebGL Particles';
	},

	function(bootloader_status)
	{
		lgg.particlesGPU = new µ.Particles2D_uniform_arrays(lgg.c.gl, lgg.pDefsGPU, 30000, 5);
		// only used in singularity
		//lgg.particlesGPU2 = new µ.Particles2D_uniform_arrays(lgg.c.gl, lgg.pDefsGPU, 10000, 5);
		bootloader_status.info = 'Stuff';
	},

	function(bootloader_status)
	{
		// this is shitty and repeats so quickly, it might actually be useful/funny to use for something.
		//lgg.rand = new µ.PRandom(1259259259, 2756741527, 4256741557, 514847);
		//lgg.rand = new MersenneTwister(42);

		lgg.game 				= new lgg.Game();
		lgg.level 				= new lgg.Level();
		lgg.enemies 			= new lgg.Enemies();
		lgg.pickups 			= new lgg.Pickups();
		lgg.singularity 		= new lgg.Singularity();
		lgg.player 				= new lgg.Player();
		lgg.player_drones 		= new lgg.Player_Drones();
		lgg.trader 				= new lgg.Trader();
		lgg.projectiles 		= new lgg.Projectiles();
		
		lgg.level.restart();

/*
		lgg.workers__test = new Worker('apps/lagaga/src/workers/test.js');
		lgg.workers__test.onmessage = function (oEvent)
		{
			console.log("worker sez", oEvent.data);
		};
		lgg.workers__test.postMessage(lgg.enemies);
*/

		bootloader_status.info = 'audio';
	},

	function(bootloader_status)
	{
		lgg.audio = new µ.Audio();
		bootloader_status.info = 'textures';
	},

	function(bootloader_status)
	{
		lgg.tex_amber_scimitar	= lgg.c.load_texture('apps/lagaga/gfx/enemies/amber_scimitar.png');
		lgg.tex_amber_scimitar2	= lgg.c.load_texture('apps/lagaga/gfx/enemies/amber_scimitar2.png');
		lgg.tex_sunflare1		= lgg.c.load_texture('apps/lagaga/gfx/enemies/sunflare1.png');
		lgg.tex_blob_top		= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob_top.png');
		lgg.tex_blob_top2		= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob_top2.png');
		lgg.tex_blob_top3		= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob_top.png');
		lgg.tex_beholder		= lgg.c.load_texture('apps/lagaga/gfx/enemies/beholder.png');
		lgg.tex_bigmine			= lgg.c.load_texture('apps/lagaga/gfx/enemies/bigmine.png');
		lgg.tex_blob			= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob.png');
		lgg.tex_blob_fulltint	= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob_fulltint.png');
		lgg.tex_blob_inner		= lgg.c.load_texture('apps/lagaga/gfx/enemies/blob_inner.png');
		lgg.tex_carrier			= lgg.c.load_texture('apps/lagaga/gfx/enemies/carrier.png');
		lgg.tex_eye				= lgg.c.load_texture('apps/lagaga/gfx/enemies/eye.png');
		lgg.tex_eye2			= lgg.c.load_texture('apps/lagaga/gfx/enemies/eye2.png');
		lgg.tex_golfball		= lgg.c.load_texture('apps/lagaga/gfx/enemies/golfball.png');
		lgg.tex_golfball2		= lgg.c.load_texture('apps/lagaga/gfx/enemies/golfball2.png');
		lgg.tex_mine			= lgg.c.load_texture('apps/lagaga/gfx/enemies/mine.png');
		lgg.tex_saucer			= lgg.c.load_texture('apps/lagaga/gfx/enemies/saucer.png');
		
		lgg.tex_blorb_x			= lgg.c.load_texture('apps/lagaga/gfx/enemies/blorb_x.png');
		lgg.tex_blorb_y			= lgg.c.load_texture('apps/lagaga/gfx/enemies/blorb_y.png');
		lgg.tex_blorb_xy		= lgg.c.load_texture('apps/lagaga/gfx/enemies/blorb_xy.png');

		//lgg.tex_trader			= lgg.c.load_texture('img/lgg/trader.png');
		lgg.tex_trader			= lgg.c.load_texture('apps/lagaga/gfx/trader.png');
		
		//lgg.tex_backgrounds__mossy_roof	= lgg.c.load_texture('apps/lagaga/gfx/backgrounds/mossy_roof.png');
		//lgg.tex_backgrounds__building_facade = lgg.c.load_texture('apps/lagaga/gfx/backgrounds/building_facade.png');
		lgg.tex_backgrounds__sinus1 = lgg.c.load_texture('apps/lagaga/gfx/backgrounds/sinus1.png');

		lgg.tex_pod				= lgg.c.load_texture('img/lgg/pod.png');
		lgg.tex_blob2			= lgg.c.load_texture('img/lgg/blob2.png');
		lgg.tex_cube			= lgg.c.load_texture('img/lgg/cube.png');

		//lgg.tex_cube2			= lgg.c.load_texture('img/lgg/cube2.png');
		lgg.tex_pickup			= lgg.c.load_texture('apps/lagaga/gfx/pickups/pickup_frame.png');
		lgg.tex_pickup_credits  = lgg.c.load_texture('apps/lagaga/gfx/pickups/credits.png');
		lgg.tex_pickup_ball		= lgg.c.load_texture('apps/lagaga/gfx/pickups/ball.png');

		lgg.tex_player			= lgg.c.load_texture('img/lgg/player.png');
		lgg.tex_player_drone	= lgg.c.load_texture('apps/lagaga/gfx/drone.png');
		
		
		lgg.tex_singularity		= lgg.c.load_texture('img/lgg/singularity.png');
		lgg.tex_star			= lgg.c.load_texture('img/lgg/star.png');

		lgg.tex_sphere			= lgg.c.load_texture('img/lgg/sphere.png');
		lgg.tex_sphere2			= lgg.c.load_texture('img/lgg/sphere2.png');

		lgg.tex_stone1			= lgg.c.load_texture('img/tiles/stone1.png');

		/////////////////////////////////////////////////////////////

		lgg.tex__enemies__patrol		= lgg.c.load_texture('apps/lagaga/gfx/enemies/patrol.png');
		lgg.tex__enemies__patrol_light	= lgg.c.load_texture('apps/lagaga/gfx/enemies/patrol_light.png');

		bootloader_status.info = 'texture_gen';
	},

	function(bootloader_status)
	{
		lgg.tex_red		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(1, 1, function(ctx) {
			ctx.fillStyle = "hsl(0,100%,50%)";
			ctx.fillRect (0, 0, 1, 1);
		}));

		lgg.tex_circle		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			ctx.beginPath();
			ctx.arc(512 / 2, 512 / 2, 512 / 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#f00';
			ctx.fill();
		}));

		lgg.tex_circle_outline	= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			var linewidth = 512 / 24;
			ctx.beginPath();
			ctx.arc(512 / 2, 512 / 2, 512 / 2 - linewidth / 2, 0, 2 * Math.PI, false);
			ctx.strokeStyle = '#f00';
			ctx.lineWidth = linewidth;
			ctx.stroke();
		}));

		lgg.tex_circle_soft_inverse	= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
					var gradient = ctx.createRadialGradient(512/2, 512/2, 0, 512/2, 512/2, 512);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
					gradient.addColorStop(0.125,'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.5)');
					gradient.addColorStop(0.375,'hsla(0,100%,50%,0.75)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,1.0)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,1.0)');
					ctx.beginPath();
				    ctx.arc(512/2, 512/2, 512/2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
		}));


		lgg.tex_circle_softer_inverse	= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
					var gradient = ctx.createRadialGradient(512/2, 512/2, 0, 512/2, 512/2, 512);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,0)');
					gradient.addColorStop(0.125,'hsla(0,100%,50%,0.015625)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.0625)');
					gradient.addColorStop(0.375,'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,1.0)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,1.0)');
					ctx.beginPath();
				    ctx.arc(512/2, 512/2, 512/2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
		}));

		lgg.tex_circle_soft	= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
					var gradient = ctx.createRadialGradient(512/2, 512/2, 0, 512/2, 512/2, 512);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,1)');
					gradient.addColorStop(0.125,'hsla(0,100%,50%,0.75)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.5)');
					gradient.addColorStop(0.375,'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0.0)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,0.0)');
					ctx.beginPath();
				    ctx.arc(512/2, 512/2, 512/2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
		}));

		lgg.tex_circle_softer	= lgg.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
					var gradient = ctx.createRadialGradient(512/2, 512/2, 0, 512/2, 512/2, 512);
					gradient.addColorStop(0, 	'hsla(0,100%,50%,1)');
					gradient.addColorStop(0.125,'hsla(0,100%,50%,0.25)');
					gradient.addColorStop(0.25, 'hsla(0,100%,50%,0.0625)');
					gradient.addColorStop(0.375,'hsla(0,100%,50%,0.015625)');
					gradient.addColorStop(0.5, 	'hsla(0,100%,50%,0)');
					gradient.addColorStop(1, 	'hsla(0,100%,50%,0)');
					ctx.beginPath();
				    ctx.arc(512/2, 512/2, 512/2, 0, 2 * Math.PI, false);
				    ctx.fillStyle = gradient;
				    ctx.fill();
		}));

		lgg.tex_stars		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(1024, 1024, function(ctx) {
			for (var i = 750; i--; )
			{
				var size = 2 + µ.rand(0.5);
				var lum = 205 + µ.rand_int(50);
				var alpha = 1;
				ctx.beginPath();
				ctx.arc(3 + µ.rand_int(2042),3 + µ.rand_int(2042),size,0,Math.PI*2, false);
				ctx.fillStyle = "rgba("+lum+","+lum+","+lum+","+alpha+")";
				ctx.fill();
			}
		}));

		lgg.tex_star_mask		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(1024, 1024, function(ctx) {
			for (var x = 0; x < 1024; x++)
			{
				var alpha = (x < 512 ? (1 - (x / 512)) : (x - 512) / 512);
				ctx.fillStyle = "hsla(0,0%,"+100+"%, "+alpha+")";
				ctx.fillRect (x, 0, 1, 1024);
			}
		}));
/*
		lgg.tex_concrete		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(256, 256, function(ctx) {
			for (var x = 0; x < 256; x++)
			{
				for (var y = 0; y < 256; y++)
				{
					var lum = 245 + µ.rand_int(10);
					ctx.fillStyle = "rgb("+lum+","+0+","+0+")";
					ctx.fillRect (x, y, 1, 1);
				}
			}
		}));
*/

		bootloader_status.info = 'fonts';
	},
/*
	function(bootloader_status)
	{
		var make_worley_noise = function(ctx, dim, points)
		{
			var points_x = new Array(points);
			var points_y = new Array(points);

			for (var i = points; i--;)
			{
				points_x[i] = µ.rand_int(255);
				points_y[i] = µ.rand_int(255);
			}

			for (var x = 0; x < dim; x++)
			{
				for (var y = 0; y < dim; y++)
				{
					var min_dist = 9999999999999999;
					for (var i = points; i--;)
					{
						var dist = µ.distance2D(x, y, points_x[i], points_y[i]);
						if (dist < min_dist)
						{
							min_dist = dist;
						}
					}
					var hue = 280 + (min_dist*1);
					var lum = 20 + Math.floor((min_dist/2.5));
					ctx.fillStyle = "hsl("+hue+",100%,"+lum+"%)";
					ctx.fillRect (x, y, 1, 1);
				}
			}

		}
		lgg.tex_worley10		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(256, 256, function(ctx) {
			make_worley_noise(ctx, 256, 10);
		}), -1);

		lgg.tex_worley5		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(256, 256, function(ctx) {
			make_worley_noise(ctx, 256, 5);
		}), -1);

		bootloader_status.info = 'texture_gen 5';
	},
*/

/*
	function(bootloader_status)
	{
		lgg.tex_singularity_map		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(1024, 1024, function(ctx) {}), -1);
		bootloader_status.info = 'fonts';
	},
*/
	function(bootloader_status)
	{

		lgg.fonts = new µ.WebGL_Font(lgg.c, lgg.c.canvas.ctx, lgg.cameras.c, lgg.c.textures);
		lgg.FONT_DEFAULT = lgg.fonts.add_font('Tahoma', 'normal', 700, 2048);
		
		bootloader_status.info = 'input';
	},

	function(bootloader_status)
	{
		lgg.input = new µ.input(lgg.c.canvas, lgg.scale, lgg.cameras);
	
		
		lgg.input.KEY_F1.callback_press = function()
		{
			lgg.show_debug_menu = !lgg.show_debug_menu;
		};
	
		lgg.input.KEY_TAB.callback_press = function()
		{
			lgg.show_ship_setup = !lgg.show_ship_setup;
		}
		
		lgg.input.KEY_Q.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT] = 1;
					}
				}
			}
		}

		lgg.input.KEY_W.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT] = 1;
					}
				}
			}
		}

		lgg.input.KEY_E.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT] = 1;
					}
				}
			}
		}

		lgg.input.KEY_A.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT] = 1;
					}
				}
			}
		}

		lgg.input.KEY_S.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR] = 1;
					}
				}
			}
		}

		lgg.input.KEY_D.callback_press = function()
		{
			if (lgg.show_ship_setup)
			{
				if (lgg.input.KEY_SHIFT.pressed)
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] -= 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] < 0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] = 0;
					}
				}
				else
				{
					lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] += 0.1;
					if (lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] > 1.0)
					{
						lgg.player.weapons[lgg.ship_setup__selected_weapon].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT] = 1;
					}
				}
			}
		}

/*
lgg.PLAYER_WEAPON_DIRECTION__FRONT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__LEFT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__RIGHT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT	= index++;
lgg.PLAYER_WEAPON_DIRECTION__REAR			= index++;
*/

		lgg.input.KEY_CURSOR_UP.callback_press = function()
		{
			if (lgg.show_debug_menu)
			{
				lgg.selected_debug_menu_item--;
				if (lgg.selected_debug_menu_item < 0)
				{
					lgg.selected_debug_menu_item = lgg.options_debug.length - 1;
				}
			}
			else if (lgg.show_ship_setup)
			{
				lgg.ship_setup__selected_weapon++;
				if (lgg.ship_setup__selected_weapon >= lgg.weapons.length)
				{
					lgg.ship_setup__selected_weapon = 0;
				}
			}
		};
		lgg.input.KEY_CURSOR_DOWN.callback_press = function()
		{
			if (lgg.show_debug_menu)
			{
				lgg.selected_debug_menu_item++;
				if (lgg.selected_debug_menu_item >= lgg.options_debug.length)
				{
					lgg.selected_debug_menu_item = 0;
				}
			}
			else if (lgg.show_ship_setup)
			{
				lgg.ship_setup__selected_weapon--;
				if (lgg.ship_setup__selected_weapon < 0)
				{
					lgg.ship_setup__selected_weapon = lgg.weapons.length - 1;
				}
			}
		};

		lgg.input.KEY_CURSOR_LEFT.callback_press = function()
		{
			if (lgg.show_debug_menu)
			{
				var option = lgg.options_debug[lgg.selected_debug_menu_item];
				var cookie_name = "lagaga: " + option.name;
				if (option.type == 'bool')
				{
					lgg.options_debug_values[lgg.selected_debug_menu_item] = !lgg.options_debug_values[lgg.selected_debug_menu_item];
					localStorage.setItem(cookie_name, lgg.options_debug_values[lgg.selected_debug_menu_item] ? "1" : "0");
				}
				if (option.type == 'list')
				{
					for (var i = 0, len = option.values.length; i < len; i++)
					{
						if (option.values[i] == lgg.options_debug_values[lgg.selected_debug_menu_item])
						{
							break;
						}
					}
					i -= 1;
					if (i < 0)
					{
						i = option.values.length - 1;
					}
					lgg.options_debug_values[lgg.selected_debug_menu_item] = option.values[i];
					localStorage.setItem(cookie_name, lgg.options_debug_values[lgg.selected_debug_menu_item]);
				}
			}
		};

		lgg.input.KEY_CURSOR_RIGHT.callback_press = function()
		{
			if (lgg.show_debug_menu)
			{
				var option = lgg.options_debug[lgg.selected_debug_menu_item];
				var cookie_name = "lagaga: " + option.name;
				if (option.type == 'bool')
				{
					lgg.options_debug_values[lgg.selected_debug_menu_item] = !lgg.options_debug_values[lgg.selected_debug_menu_item];
					localStorage.setItem(cookie_name, lgg.options_debug_values[lgg.selected_debug_menu_item] ? "1" : "0");
				}
				if (option.type == 'list')
				{
					for (var i = 0, len = option.values.length; i < len; i++)
					{
						if (option.values[i] == lgg.options_debug_values[lgg.selected_debug_menu_item])
						{
							break;
						}
					}
					i += 1;
					if (i >= option.values.length)
					{
						i = 0;
					}
					lgg.options_debug_values[lgg.selected_debug_menu_item] = option.values[i];
					localStorage.setItem(cookie_name, lgg.options_debug_values[lgg.selected_debug_menu_item]);
				}
			}
		};

		lgg.input.KEY_1.callback_press = function()
		{
			lgg.debug__selected_enemy_type--;
			if (lgg.debug__selected_enemy_type < -1)
			{
				lgg.debug__selected_enemy_type = lgg.etypes.length - 1;
			}
		}

		lgg.input.KEY_2.callback_press = function()
		{
			lgg.debug__selected_enemy_type++;
			if (lgg.debug__selected_enemy_type >= lgg.etypes.length)
			{
				lgg.debug__selected_enemy_type = -1;
			}
		}

		lgg.input.KEY_3.callback_press = function()
		{
			if (lgg.debug__selected_enemy_type > -1)
			{
				lgg.enemies.spawn_enemy(lgg.etypes[lgg.debug__selected_enemy_type], lgg.level.size_x * 0.1 + µ.rand(lgg.level.size_x * 0.8), lgg.level.size_y * 1.01 + µ.rand(lgg.level.size_y * 0.01), -1);
			}
		}
		
		lgg.input.KEY_4.callback_press = function()
		{
			if (lgg.debug__selected_enemy_type > -1)
			{
				for (var i = 0; i < 3; i++)
				{
					lgg.enemies.spawn_enemy(lgg.etypes[lgg.debug__selected_enemy_type], lgg.level.size_x * 0.1 + µ.rand(lgg.level.size_x * 0.8), lgg.level.size_y * 1.01 + µ.rand(lgg.level.size_y * 0.01), -1);
				}
			}
		}
		
		lgg.input.KEY_5.callback_press = function()
		{
			for (var i = 0; i < lgg.etypes.length; i++)
			{
				lgg.enemies.spawn_enemy(lgg.etypes[i], lgg.level.size_x * 0.1 + µ.rand(lgg.level.size_x * 0.8), lgg.level.size_y * 1.1 + µ.rand(lgg.level.size_y * 0.1), -1);
			}
		}
		
		bootloader_status.info = 'done!';
	},
];
