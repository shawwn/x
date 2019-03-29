plt.render_hud = function()
{
	var bar_frac = 1.0 / plt.scores_accum.bucket_count;
	var max = 0;

	for (var i = 0; i < plt.scores_accum.bucket_count; i++)
	{
		if (max < plt.scores_accum.buckets[i])
			max = plt.scores_accum.buckets[i];
	}
	if (max < plt.score)
		max = plt.score;

	var prev_bucket = plt.scores_accum.current_bucket -1;
	if (prev_bucket < 0)
	{
		prev_bucket = plt.scores_accum.bucket_count - 1;
	}

	for (var i = 0; i < plt.scores_accum.bucket_count; i++)
	{
		var frac = (plt.scores_accum.current_bucket == i ? plt.score : plt.scores_accum.buckets[i]) / max;

		if (plt.scores_accum.current_bucket == i)
		{
			var hue = (frac == 1) ? 110 : 50;
			var sat = 1;
		}
		else
		{
			var hue = 0;
			var sat = 0;
		}

		var sinn = Math.sin(plt.now / 157);

		sinn *= sinn * sinn * sinn * sinn * sinn;

		var alpha = plt.scores_accum.current_bucket == i ? (0.75 + sinn * 0.25): 1.0;

		var lum1 = (frac == 1) ? 0.25 : 0.075;
		var lum2 = (frac == 1) ? 0.5 : 0.35;

		plt.c.rectangle.draw(plt.CAM_PLAYER,
			0.0 + i * bar_frac + bar_frac * 0.5,
			-0.105 + 0.05,
			bar_frac * 0.95,
			0.09,
			90,
			0, 0, 1, 0.05 * alpha,
			0, 0, 1, 0.05 * alpha,
			0, 0, 1, 0.05 * alpha,
			0, 0, 1, 0.05 * alpha
		);

		plt.c.rectangle.draw(plt.CAM_PLAYER,
			0.0 + i * bar_frac + bar_frac * 0.5,
			-0.105 + 0.05 * frac,
			bar_frac * 0.95,
			0.09 * frac,
			90,
			hue, sat, lum1, 0.65 * alpha,
			hue, sat, lum1, 0.65 * alpha,
			hue, sat, lum2, 0.65 * alpha,
			hue, sat, lum2, 0.65 * alpha
		);
	}
	plt.c.rectangle.draw(plt.CAM_PLAYER,
		0.5,
		1.05,
		0.5,
		0.05,
		90,
		220, 0.7, 0.2, 0.55,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	plt.c.rectangle.draw(plt.CAM_PLAYER,
		0.25 + plt.energy * 0.25,
		1.05,
		plt.energy * 0.5,
		0.05,
		90,
		0 + 120 * plt.energy, 1.0, 0.3, 0.95,
		0 + 120 * plt.energy, 1.0, 0.4, 0.95,
		0 + 120 * plt.energy, 1.0, 0.6, 0.95,
		0 + 120 * plt.energy, 1.0, 0.5, 0.95
	);
/*
	var score_frac = plt.goals_scored == 0 ? 1 : (Math.max(0.5, 50 - plt.time_since_goal / 500) / 50);
	plt.c.rectangle.draw(plt.CAM_PLAYER,
		-0.125 + score_frac * 0.03,
		0.178,
		score_frac * 0.06 + 0.08,
		0.04,
		90,
		50 + 30 * score_frac, 1.0, 0.3, 0.05,
		50 + 30 * score_frac, 1.0, 0.4, 0.05,
		50 + 30 * score_frac, 1.0, 0.6, 0.75,
		50 + 30 * score_frac, 1.0, 0.5, 0.75
	);
	*/

	var blink = 1 - Math.min(500, plt.time_since_goal) / 500;
	var blink2 = 1 - Math.min(2500, plt.time_since_goal) / 2500;
	var blink3 = 1 - Math.min(1000, plt.time_since_goal) / 1000;
	if (plt.game_over == 0)
	{
		var game_over_frac = 1;
	}
	else
	{
		var game_over_frac = (plt.game_over / plt.game_over_duration);
		if (game_over_frac > 0.5)
		{
			game_over_frac = 1.0
		}
		else
		{
			game_over_frac *= 2.0 * game_over_frac;
		}
	}
	if (plt.last_goal_score > 0)
	{
		plt.fonts.draw_text(
			'+' + plt.last_goal_score, (blink3 + blink2) * 0.5,
			plt.CAM_PLAYER, plt.font_name, 1.07 - 0.035 * blink2, 1.04 - 0.025 * blink2, 0.025 + 0.065 * blink2, 0.025 + 0.065 * blink2, 0.025 * blink2,
			120, 0, 0.99, .6 * blink2,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
	}
	plt.fonts.draw_text(
		plt.empty_string + Math.floor(plt.score * game_over_frac), 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.95, 0.095, 0.105, 0.020,
		120, (plt.score >= plt.high_score ? 1 : 0), (plt.score >= plt.high_score ? .85 + blink * 0.5 : .75 + .25 * blink), 0.99,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.string__this_round, 1,
		plt.CAM_PLAYER, plt.font_name, 1.05, 0.8825, 0.055, 0.055, 0.01,
		0, 0, .3, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.empty_string + plt.previous_score, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.805, 0.095, 0.105, 0.020,
		0, 0, .3, .95,
		0, 0, .5, .95,
		0, 0, .99, .95,
		0, 0, .9, .95
		);
	plt.fonts.draw_text(
		plt.string__previous_round, 1,
		plt.CAM_PLAYER, plt.font_name, 1.05, 0.750, 0.055, 0.055, 0.01,
		0, 0, .3, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.empty_string + plt.high_score, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.660, 0.095, 0.105, 0.020,
		0, 0, .3, .95,
		0, 0, .5, .95,
		0, 0, .99, .95,
		0, 0, .9, .95
		);
	plt.fonts.draw_text(
		plt.string__high_score, 1,
		plt.CAM_PLAYER, plt.font_name, 1.05, 0.585, 0.055, 0.055, 0.01,
		0, 0, .3, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.string__empty + plt.goals_scored, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.325, 0.095, 0.105, 0.020,
		0, 0, .5, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	plt.fonts.draw_text(
		plt.string__goals_scored, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.265, 0.055, 0.055, 0.01,
		0, 0, .3, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.string__empty + plt.ball_count, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.175, 0.095, 0.105, 0.014,
		0, 0, .5, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	plt.fonts.draw_text(
		plt.string__balls_in_play, 1,
		plt.CAM_PLAYER, plt.font_name, 1.03, 0.115, 0.055, 0.055, 0.01,
		0, 0, .3, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	if (plt.show_debug)
	{
		plt.fonts.draw_text(
			Math.round(1000 / app.callback_times.read()) + plt.string__fps, 1,
			plt.CAM_PLAYER, plt.font_name, 1.03, 0.02, 0.185, 0.175, 0.028,
			0, 0, .5, .65,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
		plt.fonts.draw_text(
			Math.round(1000 / app.render_times.read()) + plt.empty_string, 1,
			plt.CAM_PLAYER, plt.font_name, 1.03, -0.065, 0.075, 0.065, 0.014,
			0, 0, .3, .95,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
		plt.fonts.draw_text(
			Math.round(1000 / app.think_times.read()) + plt.empty_string, 1,
			plt.CAM_PLAYER, plt.font_name, 1.195, -0.065, 0.075, 0.065, 0.014,
			0, 0, .3, .95,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
	}


plt.c.flush_all();
plt.fonts.flush_all();
}
