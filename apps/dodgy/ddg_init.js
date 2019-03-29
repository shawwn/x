function get_bool_option(option)
{
	return (option == '1');
}
plt.init = [
	function(bootloader_status)
	{
		plt.now = 0;		
		plt.cameras = new µ.Cameras2D(plt, window.innerWidth, window.innerHeight);
		plt.camera_landscape = plt.cameras.c[plt.CAM_LANDSCAPE];
		plt.camera_portrait = plt.cameras.c[plt.CAM_PORTRAIT];
		plt.camera_stretch = plt.cameras.c[plt.CAM_STRETCH];
		plt.CAM_PLAYER = plt.cameras.add_camera(plt.cameras.CAMERA_TYPE__PORTRAIT, false, plt.cameras.ORIGIN__LEFT, plt.cameras.ORIGIN__BOTTOM, 1.0, 1.0, 1.0, 1.0, 1, true);
		plt.camera_player = plt.cameras.c[plt.CAM_PLAYER];
		plt.camera_player.set_zoom(1.2);
		plt.scale = 1;
		plt.c = new µ.canvas_webgl('bxx', plt.scale, -1, -1, plt.cameras, { autoresize: true, });
		plt.c.canvas.style.cursor = 'none';

		plt.tex_circle	= plt.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
			ctx.beginPath();
		    ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
		    ctx.fillStyle = '#f00';
		    ctx.fill();
		}));
		plt.tex_circle_soft_reverse	= plt.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
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
		plt.tex_circle_soft	= plt.c.texture_from_canvas(µ.generate_canvas_texture(512, 512, function(ctx) {
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

		plt.tex_golfball		= plt.c.load_texture('apps/dodgy/img/sphere.png');
		plt.tex_player			= plt.c.load_texture('apps/dodgy/img/fireball3.png');
		plt.tex_player_overlay	= plt.c.load_texture('apps/dodgy/img/fireball3_overlay.png');
		plt.tex_player_overlay2	= plt.c.load_texture('apps/dodgy/img/fireball3_overlay2.png');
		plt.tex_blob			= plt.c.load_texture('apps/dodgy/img/fireball.png');
		plt.tex_goal_overlay	= plt.c.load_texture('apps/dodgy/img/fireball_veins.png');
		plt.tex_mine			= plt.c.load_texture('apps/dodgy/img/sphere3.png');
		plt.tex_mine_overlay	= plt.c.load_texture('apps/dodgy/img/sphere3_overlay.png');
		plt.tex_cube			= plt.c.load_texture('apps/dodgy/img/cube.png');

		plt.empty_string 		= "";
		plt.string__fps			= ' fps';
		plt.particles__fog = 0;
		plt.particles__fog_bounce = 1;
		plt.particles__fog2 = 2;
		plt.particles__fire = 3;

/*
		plt.particlesGPU = new µ.WebGL_Particles2D_Pixelstore(plt.c.gl, plt.pDefsGPU, 20000, 5);
		plt.particlesGPU_top = new µ.WebGL_Particles2D_Pixelstore(plt.c.gl, plt.pDefsGPU, 20000, 5);
*/
		if (plt.config__draw_particles)
		{
			plt.particlesGPU = new µ.Particles2D_uniform_arrays(plt.c.gl, plt.pDefsGPU, 10000, 5);
			plt.particlesGPU_top = new µ.Particles2D_uniform_arrays(plt.c.gl, plt.pDefsGPU, 10000, 5);
		}

		plt.game_over = 0;
		plt.game_over_duration = 1500;

		plt.time_since_goal = 0;
		plt.goals_scored = 0;
		plt.last_goal_score = 0;
		plt.score = 0;
		plt.previous_score = 0;

		plt.dynamic_slowdown_factor = 200;
		plt.dynamic_slowdown_base = 200;
		plt.dynamic_slowdown_per_ball = 2;

		plt.options__ball_trail = localStorage.getItem("dodgygame_options__ball_trail") != null ? get_bool_option(localStorage.getItem("dodgygame_options__ball_trail")) : true;
		plt.options__goal_trail = localStorage.getItem("dodgygame_options__goal_trail") != null ? get_bool_option(localStorage.getItem("dodgygame_options__goal_trail")) : true;
		plt.options__spawn_mines = localStorage.getItem("dodgygame_options__spawn_mines") != null ? get_bool_option(localStorage.getItem("dodgygame_options__spawn_mines")) : true;
		plt.options__spin_balls = localStorage.getItem("dodgygame_options__spin_balls") != null ? get_bool_option(localStorage.getItem("dodgygame_options__spin_balls")) : false;
		plt.options__speed = localStorage.getItem("dodgygame_options__speed") != null ? localStorage.getItem("dodgygame_options__speed") : 1;
		plt.high_score = localStorage.getItem("dodgygame_highscore") != null ? localStorage.getItem("dodgygame_highscore") : 0;
		plt.energy = 1;
		plt.time_since_last_damage_taken = 100000;
		plt.dmg_frac_display = 0;
		plt.is_intro = true;
		plt.intro_fade = 0;
		plt.intro_fade_duration = 1500;

		plt.player_trail_length = 0;
		plt.player_trail_intertia = 0.75;
		plt.player_trail_x = new Float32Array(plt.player_trail_length);
		plt.player_trail_y = new Float32Array(plt.player_trail_length);
		plt.player_x = 0;
		plt.player_y = 0;
		plt.old_mouse_x = 0;
		plt.old_mouse_y = 0;
		plt.cursor_radius = 0.0175;

		plt.MAX_BALL_COUNT = 500;
		plt.ball_radius = 0.0125;
		plt.ball_count = 0;
		plt.balls_active = new Uint8Array(plt.MAX_BALL_COUNT);
		plt.balls_angle = new Float32Array(plt.MAX_BALL_COUNT);
		plt.balls_angle_speed = new Float32Array(plt.MAX_BALL_COUNT);
		plt.balls_radius = new Float32Array(plt.MAX_BALL_COUNT);
		plt.balls_x = new Float32Array(plt.MAX_BALL_COUNT);
		plt.balls_y = new Float32Array(plt.MAX_BALL_COUNT);
		plt.speed = new Float32Array(plt.MAX_BALL_COUNT);
		plt.speed_x = new Float32Array(plt.MAX_BALL_COUNT);
		plt.speed_y = new Float32Array(plt.MAX_BALL_COUNT);

		plt.MAX_MINE_COUNT = 50;

		plt.mine_duration = 1500;
		plt.mine_radius_min = 0.015;
		plt.mine_radius_max = 0.015;
		plt.mine_duration_min = 1500;
		plt.mine_duration_max = 2000;
		plt.mines_count = 0;
		plt.mines_radius = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_age = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_duration = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_x = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_y = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_facing = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_speed_x = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_speed_y = new Float32Array(plt.MAX_MINE_COUNT);
		plt.mines_hue = new Float32Array(plt.MAX_MINE_COUNT);
		
		plt.base_pickup_radius = 0.01;
		var inc = 0;
		plt.PICKUPTYPE_STERNTALER = inc++; 		// drop quickly from above, give a few points
		plt.PICKUPTYPE_INSTABOMB = inc++;
		plt.PICKUPTYPE_ENERGY = inc++;
		plt.PICKUPTYPE_ARMOUR = inc++;
		plt.PICKUPTYPE_FROSTWAVE = inc++;		// freezes all balls and enemies (though not projectiles)

		plt.MAX_PICKUP_COUNT = 100;
		plt.pickup_active = new Uint8Array(plt.MAX_PICKUP_COUNT);
		for (var i = 0; i < plt.MAX_PICKUP_COUNT; i++)
		{
			plt.pickup_active[i] = 0;
		}
		plt.pickup_type = new Uint8Array(plt.MAX_PICKUP_COUNT);
		plt.pickup_x = new Float32Array(plt.MAX_PICKUP_COUNT);
		plt.pickup_y = new Float32Array(plt.MAX_PICKUP_COUNT);
		plt.pickup_speed_x = new Float32Array(plt.MAX_PICKUP_COUNT);
		plt.pickup_speed_y = new Float32Array(plt.MAX_PICKUP_COUNT);
		plt.pickup_radius = new Float32Array(plt.MAX_PICKUP_COUNT);

		plt.instabomb_range = 0.2;
/*
		plt.PICKUPTYPE_ = inc; inc++;
*/
		plt.goal_radius = 0.035;
		plt.goal_x = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
		plt.goal_y = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
		plt.goal_is_moving = false;
		plt.goal_has_spawned = true;
		plt.goal_speed_x = 0;
		plt.goal_speed_y = 0;
		plt.goal_display_x = plt.goal_x;
		plt.goal_display_y = plt.goal_y;
		plt.goal_hue = 117;
		plt.goal_display_hue = plt.goal_hue;

		plt.input = new µ.input(plt.c.canvas, plt.scale, plt.cameras);
		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		plt.font_name = plt.fonts.add_font('Georgia', 'normal', 400, 4096);
		plt.font_name2 = plt.fonts.add_font('Tahoma', 'normal', 400, 4096);
		plt.scores_accum = new µ.Le_Accumulator(30);
		plt.show_debug = false;
		
		plt.string__empty = '';
		plt.string__space = ' ';
		plt.string__this_round = "this round";
		plt.string__previous_round = "previous round";
		plt.string__high_score = "high score";
		plt.string__goals_scored = "goals scored";
		plt.string__balls_in_play = "balls in play";
		plt.string__ = '';
		plt.string__ = '';
		plt.string__ = '';

		plt.input.KEY_F1.callback_press = function()
		{
			plt.show_debug = !plt.show_debug;
		};
		plt.input.KEY_F2.callback_press = function()
		{
			plt.high_score = 0;
			localStorage.setItem("dodgygame_highscore", 0);
		};
		plt.input.KEY_1.callback_press = function()
		{
			plt.options__speed = 0.25;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_2.callback_press = function()
		{
			plt.options__speed = 0.5;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_3.callback_press = function()
		{
			plt.options__speed = 0.75;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_4.callback_press = function()
		{
			plt.options__speed = 1.0;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_5.callback_press = function()
		{
			plt.options__speed = 1.25;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_6.callback_press = function()
		{
			plt.options__speed = 1.5;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_7.callback_press = function()
		{
			plt.options__speed = 1.75;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_8.callback_press = function()
		{
			plt.options__speed = 2.0;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_9.callback_press = function()
		{
			plt.options__speed = 2.5;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_0.callback_press = function()
		{
			plt.options__speed = 3.0;
			localStorage.setItem("dodgygame_options__speed", plt.options__speed);
		};
		plt.input.KEY_T.callback_press = function()
		{
			plt.options__goal_trail = !plt.options__goal_trail;
			plt.options__ball_trail = !plt.options__ball_trail;
			localStorage.setItem("dodgygame_options__goal_trail", plt.options__goal_trail ? "1" : "0");
			localStorage.setItem("dodgygame_options__ball_trail", plt.options__ball_trail ? "1" : "0");
		};
		plt.input.KEY_M.callback_press = function()
		{
			plt.options__spawn_mines = !plt.options__spawn_mines;
			localStorage.setItem("dodgygame_options__spawn_mines", plt.options__spawn_mines ? "1" : "0");
		};
		plt.input.KEY_S.callback_press = function()
		{
			plt.options__spin_balls = !plt.options__spin_balls;
			localStorage.setItem("dodgygame_options__spin_balls", plt.options__spin_balls ? "1" : "0");
		};
		bootloader_status.info = 'done!';
	},
];