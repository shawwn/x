"use strict";

lgg.render_HUD = function(time_delta)
{
	// game

	var font_width = 0.04;
	var font_height = 0.03;
	var used_font = lgg.FONT_DEFAULT;

	var i = 1;

	var font_spacing = 0.0075;

	lgg.fonts.draw_text(
		Math.floor(lgg.player.credits) + lgg.string__credits, 1,
		lgg.CAM_PORTRAIT, used_font,
		lgg.camera_portrait.aspect - 0.35, 1.0 - font_height * i * 0.7, font_width, font_height, font_spacing,
		30, 1, .3, 1,
		40,1, .5, 1,
		56,1, .9, 1,
		52,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		Math.floor(lgg.player.score) + lgg.string__score, 1,
		lgg.CAM_PORTRAIT, used_font,
		lgg.camera_portrait.aspect - 0.35, 1.0 - font_height * i * 0.7, font_width, font_height, font_spacing,
		200, 1, .1, 1,
		220,1, .15, 1,
		210,1, .75, 1,
		230,1, .75, 1
		); i++;


	for (var j = 0, len = lgg.etypes.length; j < len; j++)
	{
		if (lgg.debug__selected_enemy_type == j)
		{
			var sat = 1;
		}
		else
		{
			var sat = 0.2;
		}
		lgg.fonts.draw_text(
			lgg.etypes[j].id + lgg.string__space + lgg.string__space + lgg.etypes[j].title, 1,
			lgg.CAM_PORTRAIT, used_font,
			lgg.camera_portrait.aspect - 0.35, 1.0 - font_height * i * 0.7, font_width * 0.6, font_height * 0.7, font_spacing * 0.8,
			100, sat, .1, 1,
			120, sat, .15, 1,
			110, sat, .75, 1,
			130, sat, .75, 1
			);
		lgg.fonts.draw_text(
			lgg.enemies.enemies_alive_of_type[j] + ' / ' + lgg.enemies.enemies_alive_of_type_other_than[j], 1,
			lgg.CAM_PORTRAIT, used_font,
			lgg.camera_portrait.aspect - 0.50, 1.0 - font_height * i * 0.7, font_width * 0.6, font_height * 0.7, font_spacing * 0.8,
			100, sat, .1, 1,
			120, sat, .15, 1,
			110, sat, .75, 1,
			130, sat, .75, 1
			); i++;
	}




	// debug

	var font_width = 0.032;
	var font_height = 0.032;
	var used_font = lgg.FONT_DEFAULT;

	var i = 1;

	var font_spacing = 0.0064;

/*
	var total = µ.lead_target_stats.failed + µ.lead_target_stats.bailed + µ.lead_target_stats.successes;

	lgg.fonts.draw_text(
		"successes: " + (µ.lead_target_stats.successes / total) + " (" + (Math.round(µ.lead_target_stats.attempts_for_success / µ.lead_target_stats.successes * 100) / 100) + ")", 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"bailed: " + (µ.lead_target_stats.bailed / total), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"failed: " + (µ.lead_target_stats.failed / total) + " (" + (Math.round(µ.lead_target_stats.attempts_for_failures / µ.lead_target_stats.failed * 100) / 100) + ")", 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

*/

	lgg.fonts.draw_text(
		lgg.string__stage + lgg.level.stage, 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		lgg.string__time + (Math.round(lgg.level.state_time / 60) / 1000), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;


	lgg.fonts.draw_text(
		"enemies alive: " + lgg.enemies.enemies_alive, 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;



	lgg.fonts.draw_text(
		"danger in play: " + (Math.round(lgg.level.danger_in_play * 100) / 100) + " + " + (Math.round(lgg.level.danger_to_bring * 100) / 100) + " = " + (Math.round((lgg.level.danger_in_play + lgg.level.danger_to_bring) * 100) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"stage danger: "	+ (Math.round(lgg.level.danger_overcome_this_stage * 100) / 100)
							+ " / "
							+ (Math.round(lgg.level.danger_per_stage * 100) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"danger overcome: " + (Math.round(lgg.level.danger_overcome * 100) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"danger passed by: " + (Math.round(lgg.level.danger_passed_by * 100) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"pickup danger accum: " + (Math.round(lgg.pickups.danger_accum * 100) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"spawn freq: " + (Math.round(lgg.level.spawn_freq / 10) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;

	lgg.fonts.draw_text(
		"spawn in: " + (Math.round((lgg.level.spawn_freq - (lgg.now - lgg.enemies.last_spawn)) / 10) / 100), 1,
		lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
		0, 1, .3, 1,
		20,1, .5, 1,
		60,1, .9, 1,
		40,1, .7, 1
		); i++;


	if (lgg.options_debug_values[lgg.DEBUG_OPTION__SHOW_DEBUG_STUFF])
	{
		i++;
		var hue = (lgg.now / 77.4) % 360;
		var callback_times_avg = app.callback_times.read();
		lgg.fonts.draw_text(
			"callback ms          " + (Math.round(callback_times_avg * 1000) / 1000), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 0, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;
		lgg.fonts.draw_text(
			"callback FPS         " + Math.round(1000 / callback_times_avg), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 10, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;

		var render_callback_times_avg = app.render_times.read();
		lgg.fonts.draw_text(
			"render callback ms  " + (Math.round(render_callback_times_avg * 1000) / 1000), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 20, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;
		lgg.fonts.draw_text(
			"render callback FPS " + Math.round(1000 / render_callback_times_avg), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 30, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;

		var think_times_avg = app.think_times.read();
		lgg.fonts.draw_text(
			"think ms              " + (Math.round(think_times_avg * 1000) / 1000), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 40, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;
		lgg.fonts.draw_text(
			"think FPS             " + Math.round(1000/think_times_avg), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 50, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;

		var render_times_avg = app.render_times.read();
		lgg.fonts.draw_text(
			"render ms             " + (Math.round(render_times_avg * 1000) / 1000), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 60, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;
		lgg.fonts.draw_text(
			"render FPS            " + Math.round(1000/render_times_avg), 1,
			lgg.CAM_PORTRAIT, used_font, 0.05, 1.0 - font_height * i * 0.8, font_width, font_height, font_spacing,
			hue + 70, 1, 0.35, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			); i++;
	}


// lgg.camera_landscape.one_over_aspect

	if (lgg.show_debug_menu)
	{
		var shadow_offset = 0.00085;

		var pos_x = 0.20;
		var pos_y = 0.315;
		var size_x = 0.015;
		var size_y = 0.0145;
		var spacing_y = -0.0105;
		for (var i = 0, len = lgg.options_debug.length; i < len; i++)
		{
			var option = lgg.options_debug[i];
			var hue = 0;
			var sat = 0;
			var lum = 1;
			if (lgg.selected_debug_menu_item == i)
			{
				var hue = 56;
				var sat = 1;
				var lum = 0.5;
			}
			lgg.fonts.draw_text(option.name, 1, lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT,
					pos_x + 0.08 + shadow_offset,
					pos_y - shadow_offset + spacing_y * i,
					size_x,
					size_y,
					0.0042,
					0, 0, 0, .8,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			lgg.fonts.draw_text(
					option.name, 1, lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT,
					pos_x + 0.08,
					pos_y + spacing_y * i,
					size_x,
					size_y,
					0.0042,
					hue, sat, lum, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			var value = lgg.options_debug_values[i];
			if (option.type == 'bool')
			{
				var str_value = value ? 'yes' : 'no';
			}
			else if (option.type == 'list')
			{
				var str_value = "" + value;
			}
			lgg.fonts.draw_text(str_value, 1, lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT,
					pos_x + 0.01 + shadow_offset,
					pos_y - shadow_offset + spacing_y * i,
					size_x,
					size_y,
					0.0042,
					0, 0, 0, .8,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			lgg.fonts.draw_text(str_value, 1, lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT,
					pos_x + 0.01,
					pos_y + spacing_y * i,
					size_x,
					size_y,
					0.0042,
					hue, sat, lum, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
		}
	}

	lgg.fonts.flush_all();
};