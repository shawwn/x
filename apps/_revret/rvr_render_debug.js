"use strict";

rvr.render_debug_thang = function(x_offset, y_offset, title, value, width, height, spacing, line_spacing)
{

	rvr.fonts.draw_text(
		title + " " + (Math.round(value * 1000) / 1000),
		1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
		x_offset, 1.0 - y_offset,
		width, height, spacing,
		0, 0, .6, .99,
		0, 0, .7, .99,
		0, 0, .95, .99,
		0, 0, .9, .99);

	var bar_width = 0.02 * value;
	rvr.c.rectangle.draw(rvr.CAM_PORTRAIT, 0.01 + bar_width / 2, 1.0 - y_offset, bar_width, line_spacing, 90,
		0, 0, 0.5, 0.9,
		0, 0, 0.5, 0.9,
		0, 0, 0.1, 0.3,
		0, 0, 0.1, 0.3);

	y_offset += line_spacing;
	rvr.fonts.draw_text(
		rvr.strings.debug__FPS + Math.round(1000 / value),
		1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
		x_offset, 1.0 - y_offset,
		width, height, spacing,
		52, 1, .9, .99,
		52, 1, .99, .99,
		52, 1, .6, .99,
		52, 1, .5, .99);

	var bar_width = 0.1 / value;
	rvr.c.rectangle.draw(rvr.CAM_PORTRAIT, 0.01 + bar_width / 2, 1.0 - y_offset, bar_width, line_spacing, 90,
		52, 1, 0.5, 0.9,
		52, 1, 0.5, 0.9,
		52, 1, 0.1, 0.3,
		52, 1, 0.1, 0.3);
}

rvr.render_debug = function(time_delta)
{

/*
	text, fade,
	cam_id, font_index, pos_x, pos_y, width, height, spacing,
	tint_h_1, tint_s_1, tint_l_1, tint_a_1,
	tint_h_2, tint_s_2, tint_l_2, tint_a_2,
	tint_h_3, tint_s_3, tint_l_3, tint_a_3,
	tint_h_4, tint_s_4, tint_l_4, tint_a_4
*/

	var
		freq_think 				= app.think_times.read(),
		freq_render 			= app.render_times.read(),
		freq_callback 			= app.callback_times.read(),
		width = 0.065,
		width2 = width * 2,
		height = 0.06,
		spacing = 0.013,
		line_spacing = 0.04,
		x_offset = 0.035,
		y_offset = 0;

//

	y_offset += line_spacing;

	rvr.fonts.draw_text(
		rvr.strings.debug__time + (Math.round(rvr.now / 10) / 100),
		1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
		x_offset, 1.0 - y_offset,
		width, height, spacing,
		52, 1, .9, .99,
		52, 1, .99, .99,
		52, 1, .5, .99,
		52, 1, .4, .99);

//////////////////////

	y_offset += line_spacing;
	rvr.render_debug_thang(x_offset, y_offset, rvr.strings.debug__callback, freq_callback, width, height, spacing, line_spacing);
	y_offset += line_spacing;

	y_offset += line_spacing;
	rvr.render_debug_thang(x_offset, y_offset, rvr.strings.debug__render, freq_render, width, height, spacing, line_spacing);
	y_offset += line_spacing;

	y_offset += line_spacing;
	rvr.render_debug_thang(x_offset, y_offset, rvr.strings.debug__think, freq_think, width, height, spacing, line_spacing);
	y_offset += line_spacing;


	if (rvr.debug__draw_debug_text > 1)
	{

		y_offset += line_spacing;

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__ground_height + (Math.round(100000 * rvr.player_agent.ground_height) / 100000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__pos_z + (Math.round(100000 * rvr_agents__pos_z[0]) / 100000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__speed_z + (Math.round(100000 * rvr_agents__speed_z[0]) / 100000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		var depth_at_mouse = rvr.map.get_depthmap(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y);
		
		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__x + (Math.round(rvr.camera_player.mouse_pos_x * 1000) / 1000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__y + (Math.round(rvr.camera_player.mouse_pos_y * 1000) / 1000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			rvr.strings.debug__z + (Math.round(depth_at_mouse * 1000) / 1000),
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			"active projectiles " + rvr.projectiles.active_projectiles,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			"proj expl " + rvr.projectiles.count_expl,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			"proj deac " + rvr.projectiles.count_deac,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

			y_offset += line_spacing;
		rvr.fonts.draw_text(
			"proj dea " + rvr.projectiles.count_dea,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);
	/*
		var fluid_at_mouse = rvr.map.get_fluid_at(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			"fluid at mouse " + fluid_at_mouse,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);

		y_offset += line_spacing;
		rvr.fonts.draw_text(
			"z + fluid at mouse " + (depth_at_mouse + fluid_at_mouse) ,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			x_offset, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);
	//*/


	}


	// right hand side

	x_offset = 0.4;

	y_offset = line_spacing;

	if (rvr.debug__draw_scent != 0)
	{
		var string = (rvr.debug__draw_scent == 1 ? 'player' : rvr.debug__draw_scent == 2 ? 'sound' : rvr.debug__draw_scent == 3 ? 'enemies' : rvr.debug__draw_scent == 4 ? 'enemies2' : 'player + sound') + ' scent';
		rvr.fonts.draw_text(
			string,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			rvr.camera_portrait.aspect - rvr.fonts.string_width(rvr.FONT_DEFAULT, string) * width2 - 0.05, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);
		y_offset += line_spacing;
	}

	if (rvr.debug__draw_scent__channel != 4)
	{
		var string = 'scent: faction #' + rvr.debug__draw_scent__faction + ', channel #' + rvr.debug__draw_scent__channel;
		rvr.fonts.draw_text(
			string,
			1, rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
			rvr.camera_portrait.aspect - rvr.fonts.string_width(rvr.FONT_DEFAULT, string) * width2 - 0.05, 1.0 - y_offset,
			width, height, spacing,
			52, 1, .9, .99,
			52, 1, .99, .99,
			52, 1, .5, .99,
			52, 1, .4, .99);
		y_offset += line_spacing;
	}
	rvr.c.rectangle.flush_all();
	rvr.fonts.flush_all();
};