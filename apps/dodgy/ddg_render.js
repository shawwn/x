plt.render = function()
{
/*
	plt.goal_display_x = plt.goal_x * 0.15 + 0.85 * plt.goal_display_x;
	plt.goal_display_y = plt.goal_y * 0.15 + 0.85 * plt.goal_display_y;
*/
	plt.goal_display_x = plt.goal_x;
	plt.goal_display_y = plt.goal_y;
	plt.goal_display_hue = plt.goal_hue * 0.55 + 0.45 * plt.goal_display_hue;
	if (plt.game_over == 0)
	{
		var game_over_frac = 1;
	}
	else
	{
		var game_over_frac = (plt.game_over / plt.game_over_duration);

		if (game_over_frac > 0.5)
		{
			plt.camera_player.set_zoom(1.2 - (1.0 - game_over_frac) * 0.4);
		}
		else
		{
			if (game_over_frac <= 0.25)
			{
				plt.energy = 1 - game_over_frac * 4;
			}
			plt.camera_player.set_zoom(1.2 - (game_over_frac) * 0.4);
		}
		game_over_frac *= game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac;
	}
	plt.camera_player.set_pos(plt.player_x, plt.player_y);
	var goal_dist = µ.distance2D(
			plt.player_x,
			plt.player_y,
			plt.goal_x,
			plt.goal_y
			);
/*
	plt.c.rectangle.draw(plt.CAM_PLAYER,
		0.5,
		0.5,
		2.0,
		2.0,
		90,
		180, 0.9, 0.15, 0.8,
		180, 0.9, 0.15, 0.8,
		180, 0.9, 0.02, 0.8,
		180, 0.9, 0.02, 0.8
	);
*/
	if (plt.config__draw_background)
	{
		plt.c.rectangle.draw(plt.CAM_PLAYER,
			0.5,
			0.5,
			1.0,
			1.0,
			90,
			210, 0.945, 0.02, 0.9,
			210, 0.945, 0.02, 0.9,
			210, 0.995, 0.12, 0.9,
			210, 0.995, 0.12, 0.9
		);
	}
	plt.render_hud();
//	plt.c.flush_all();
	if (plt.config__draw_halos)
	{
		plt.render_halos();
		plt.c.flush_all();
	}
	if (plt.config__draw_shadows)
	{
		plt.render_shadows();
		plt.c.flush_all();
	}
	if (plt.config__draw_particles)
	{
		plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
		plt.particlesGPU.draw(plt.now, plt.c.gl, plt.camera_player);
		plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
	}
	// draw pickups
	for (var i = 0; i < plt.MAX_PICKUP_COUNT; i++)
	{
		if (plt.pickup_active[i] == 1)
		{
			if (plt.pickup_type[i] == plt.PICKUPTYPE_STERNTALER)
			{
				plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_cube,
					plt.pickup_x[i],
					plt.pickup_y[i],
					plt.pickup_radius[i] * 2.0 * game_over_frac,
					plt.pickup_radius[i] * 2.0 * game_over_frac,
					90,
					116, 0.45, 1.0, 0.999,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
			else if (plt.pickup_type[i] == plt.PICKUPTYPE_INSTABOMB)
			{
				plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine,
					plt.pickup_x[i],
					plt.pickup_y[i],
					plt.pickup_radius[i] * 2.0 * game_over_frac,
					plt.pickup_radius[i] * 2.0 * game_over_frac,
					90,
					0, 0.95, 1.5, 0.999,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);

				plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine,
					plt.pickup_x[i],
					plt.pickup_y[i],
					plt.instabomb_range * 2 * game_over_frac,
					plt.instabomb_range * 2 * game_over_frac,
					(plt.now * 0.47 + i * 17423) % 360,
					0, 1, 1.5, 0.2,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);

				plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine,
					plt.pickup_x[i],
					plt.pickup_y[i],
					plt.instabomb_range * 1.5 * game_over_frac,
					plt.instabomb_range * 1.5 * game_over_frac,
					(plt.now * 0.37 + i * 17423) % 360,
					0, 1, 0.5, 0.1,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);

				plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine,
					plt.pickup_x[i],
					plt.pickup_y[i],
					plt.instabomb_range * 1.0 * game_over_frac,
					plt.instabomb_range * 1.0 * game_over_frac,
					(plt.now * 0.27 + i * 17423) % 360,
					0, 1, 0.15, 0.1,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
		}
	}
	var goal_blink = plt.is_intro ? (0.75 + 0.25 * Math.sin(plt.now / 130)) : 1;
	plt.c.rectangle_textured.draw(
		plt.CAM_PLAYER,
		plt.tex_blob,
		plt.goal_display_x,
		plt.goal_display_y,
		plt.goal_radius * 2 * game_over_frac,
		plt.goal_radius * 2 * game_over_frac,
		90,
		plt.goal_display_hue + (plt.goal_is_moving ? 80 : 0), 0.8, (1.0 - 0.05 * goal_dist), 0.99 * goal_blink,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.rectangle_textured.draw(
		plt.CAM_PLAYER,
		plt.tex_goal_overlay,
		plt.goal_display_x,
		plt.goal_display_y,
		plt.goal_radius * 2 * game_over_frac,
		plt.goal_radius * 2 * game_over_frac,
		90,
		50 + (plt.goal_is_moving ? 110 : 0), 0.99, 1.0, 0.99 * goal_blink,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.flush_all();
	plt.dmg_frac_display = 0.8 * plt.dmg_frac_display + 0.2 * (plt.time_since_last_damage_taken > 300 ? 0 : (1 - plt.time_since_last_damage_taken / 300));
	plt.c.rectangle_textured.draw(
		plt.CAM_PLAYER,
		plt.tex_player,
		plt.player_x,
		plt.player_y,
		plt.cursor_radius * 2 * game_over_frac,
		plt.cursor_radius * 2 * game_over_frac,
		90,
		30 - 10 * plt.dmg_frac_display, 1, 1.95, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.rectangle_textured.draw(
		plt.CAM_PLAYER,
		plt.tex_player_overlay,
		plt.player_x,
		plt.player_y,
		plt.cursor_radius * 2 * game_over_frac,
		plt.cursor_radius * 2 * game_over_frac,
		90,
		52 + 22 * plt.dmg_frac_display, 1 + 0.5 * plt.dmg_frac_display, 1, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.rectangle_textured.draw(
		plt.CAM_PLAYER,
		plt.tex_player_overlay2,
		plt.player_x,
		plt.player_y,
		plt.cursor_radius * 2 * game_over_frac,
		plt.cursor_radius * 2 * game_over_frac,
		90,
		152 + 92 * plt.dmg_frac_display, 1, 1, plt.dmg_frac_display,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	for (var i = plt.player_trail_length - 1; i >= 0 ; i--)
	{
		var frac = 1 - i / (plt.player_trail_length - 1);
		plt.c.rectangle_textured.draw(
			plt.CAM_PLAYER,
			plt.tex_player,
			plt.player_trail_x[i],
			plt.player_trail_y[i],
			plt.cursor_radius * 2 * game_over_frac * (0.3 + 0.7 * frac),
			plt.cursor_radius * 2 * game_over_frac * (0.3 + 0.7 * frac),
			90,
			30 - 10 * plt.dmg_frac_display - 440 * (1 - frac), 1, 1.95, 0.25 + 0.75 * frac,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
	}
/*
plt.c.flush_all();
	plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_circle,
		plt.player_x,
		plt.player_y,
		plt.cursor_radius * 2 * game_over_frac,
		plt.cursor_radius * 2 * game_over_frac,
		1, 1, 90,
		60, 1.0, 1.0, 0.35,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
*/

	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}

		plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_golfball,
			plt.balls_x[i],
			plt.balls_y[i],
			plt.balls_radius[i] * 2.5 * game_over_frac,
			plt.balls_radius[i] * 2.5 * game_over_frac,
			90,
			0, 0, 0.0, 0.57,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_golfball,
			plt.balls_x[i],
			plt.balls_y[i],
			plt.balls_radius[i] * 2 * game_over_frac,
			plt.balls_radius[i] * 2 * game_over_frac,
			90,
			0, 0, 1.1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
	}
	for (var i = 0; i < plt.mines_count; i++)
	{
		if (plt.mines_age[i] <= plt.mines_duration[i])
		{
			
			var age_frac = plt.mines_age[i] / plt.mines_duration[i];

			plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine,
				plt.mines_x[i],
				plt.mines_y[i],
				plt.mines_radius[i] * 2 * game_over_frac,
				plt.mines_radius[i] * 2 * game_over_frac,
				plt.mines_facing[i] + 90 * age_frac,
				plt.mines_hue[i], 2 - 1.5 * age_frac, 1.0, 1.0,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
			);

			plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_mine_overlay,
				plt.mines_x[i],
				plt.mines_y[i],
				plt.mines_radius[i] * 2 * game_over_frac,
				plt.mines_radius[i] * 2 * game_over_frac,
				plt.mines_facing[i] + 27 * age_frac,
				30 + 10 * age_frac, 0.5 + 0.95 * age_frac, 1.0, 1.0,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
			);
		}
	}
	plt.c.flush_all();
	if (plt.config__draw_particles)
	{
		plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
		plt.particlesGPU_top.draw(plt.now, plt.c.gl, plt.camera_player);
		plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
	}
	if (plt.is_intro || plt.intro_fade < plt.intro_fade_duration)
	{
		plt.render_intro();
	}
};

plt.render_intro = function()
{
	var offset = 0.005;
	var width = 0.105;
	var height = 0.095;
	var spacing = 0.025;
	var alpha = 1 - plt.intro_fade / plt.intro_fade_duration;
	plt.fonts.draw_text(
		'Dodgy', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.1 + 0.005, 0.9 - 0.005, width * 3, height * 3, spacing * 3,
		0, 0, 0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'Dodgy', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.1 + 0.002, 0.9 - 0.002, width * 3, height * 3, spacing * 3,
		0, 0, 0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'Game', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.3 + 0.005, 0.71 - 0.005, width * 3, height * 3, spacing * 3,
		0, 0, 0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'Game', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.3 + 0.002, 0.71 - 0.002, width * 3, height * 3, spacing * 3,
		0, 0, 0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.flush_all();
	plt.fonts.draw_text(
		'Dodgy', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.1, 0.9, width * 3, height * 3, spacing * 3,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'Game', alpha,
		plt.CAM_PLAYER, plt.font_name, 0.3, 0.71, width * 3, height * 3, spacing * 3,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'F2: reset high score', alpha,
		plt.CAM_PLAYER, plt.font_name2, 0.02, 0.40, width, height, spacing,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'1-9: change speed', alpha,
		plt.CAM_PLAYER, plt.font_name2, 0.02, 0.32, width, height, spacing,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'T: toggle trail', alpha,
		plt.CAM_PLAYER, plt.font_name2, 0.02, 0.24, width, height, spacing,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'M: toggle mines', alpha,
		plt.CAM_PLAYER, plt.font_name2, 0.02, 0.16, width, height, spacing,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		'S: toggle spinning', alpha,
		plt.CAM_PLAYER, plt.font_name2, 0.02, 0.08, width, height, spacing,
		120, 0, 0.99, .9  *alpha,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		"spin: " + (plt.options__spin_balls ? 'on' : 'off'), alpha,
		plt.CAM_PLAYER, plt.font_name2, -.33, 0.055, 0.075, 0.065, 0.01,
		0, 0, .4, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		"mines " + (plt.options__spawn_mines ? 'on' : 'off'), alpha,
		plt.CAM_PLAYER, plt.font_name2, -.33, 0.115, 0.075, 0.065, 0.01,
		0, 0, .4, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		"trail " + (plt.options__goal_trail ? 'on' : 'off'), alpha,
		plt.CAM_PLAYER, plt.font_name2, -.33, 0.175, 0.075, 0.065, 0.01,
		0, 0, .4, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		"speed " + (plt.options__speed), alpha,
		plt.CAM_PLAYER, plt.font_name2, -.33, 0.235, 0.075, 0.065, 0.01,
		0, 0, .4, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.flush_all();
}

plt.render_halos = function()
{
	if (plt.game_over == 0)
	{
		var game_over_frac = 1;
	}
	else
	{
		var game_over_frac = (plt.game_over / plt.game_over_duration);
		game_over_frac *= game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac;
	}
	var goal_dist = µ.distance2D(plt.player_x, plt.player_y, plt.goal_x, plt.goal_y);
	var dmg_frac = plt.time_since_last_damage_taken > 300 ? 0 : (1 - plt.time_since_last_damage_taken / 300);
	plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_circle_soft,
		plt.player_x,
		plt.player_y,
		plt.cursor_radius * (4 + 7 * plt.dmg_frac_display) * game_over_frac,
		plt.cursor_radius * (4 + 7 * plt.dmg_frac_display) * game_over_frac,
		90,
		60, 1.0, 0.5, 0.125 + 0.125 * plt.dmg_frac_display,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_circle_soft,
		plt.goal_display_x,
		plt.goal_display_y,
		plt.goal_radius * (5 - 2.5 * goal_dist) * game_over_frac,
		plt.goal_radius * (5 - 2.5 * goal_dist) * game_over_frac,
		90,
		plt.goal_display_hue + (plt.goal_is_moving ? 80 : 0), 1.0, 0.7, 0.25 - goal_dist / 40,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}

		plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_circle_soft,
			plt.balls_x[i],
			plt.balls_y[i],
			plt.balls_radius[i] * 7 * game_over_frac,
			plt.balls_radius[i] * 7 * game_over_frac,
			90,
			0, 0, 1, 0.125,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
	}
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
	plt.c.flush_all();
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
}

plt.render_shadows = function()
{
	if (plt.game_over == 0)
	{
		var game_over_frac = 1;
	}
	else
	{
		var game_over_frac = (plt.game_over / plt.game_over_duration);
		game_over_frac *= game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac * game_over_frac;
	}
	var goal_dist = µ.distance2D(plt.player_x, plt.player_y, plt.goal_x, plt.goal_y);
	plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_blob,
		plt.goal_display_x + 0.006,
		plt.goal_display_y - 0.006,
		plt.goal_radius * 2 * game_over_frac,
		plt.goal_radius * 2 * game_over_frac,
		90,
		0, 0, 0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	/*
	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}

		plt.c.rectangle_textured.draw(plt.CAM_PLAYER, plt.tex_circle,
			plt.balls_x[i] + 0.004,
			plt.balls_y[i] - 0.004,
			plt.balls_radius[i] * 2 * game_over_frac,
			plt.balls_radius[i] * 2 * game_over_frac,
			90,
			0, 0, 0, 0.25,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
	}
*/
}