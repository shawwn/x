"use strict";

rvr.render__intro = function(time_delta)
{

	var
		width = 0.065 * 8,
		width2 = width * 2 * 8,
		height = 0.06 * 8,
		spacing = 0.013 * 8,
		line_spacing = 0.04 * 8,
		y_offset = 0;

	var frac = rvr.game.state_time_elapsed / rvr.intro_duration;
//

	y_offset += line_spacing;
	
	var frac2 = frac * (1 - frac) * 4;

	rvr.fonts.draw_text(
		"blah", 1,
		rvr.CAM_STRETCH, rvr.FONT_DEFAULT,
		0.075 + 0.15 * frac,
		0.5,
		width, height, spacing,
		125 + 150 * frac, 1, .9, .95,
		125 + 150 * frac, 1, .99, .95,
		152 + 350 * frac2, 1, .5, .95,
		152 + 350 * frac2, 1, .45, .95);

	rvr.fonts.draw_text(
		"?", 1,
		rvr.CAM_STRETCH, rvr.FONT_DEFAULT,
		0.035 + 0.7 * frac,
		0.1,
		width / 2, height / 2, spacing / 2,
		125 + 150 * frac2, 1, .9, .25 * frac2,
		125 + 150 * frac2, 1, .99, .25 * frac2,
		152 + 350 * frac, 1, .5 * frac, .95 * frac2,
		152 + 350 * frac, 1, .45, .95 * frac2);

rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);

rvr.fonts.flush_all();


	
	rvr.c.rectangle_textured.draw(
		rvr.CAM_PLAYER,
		rvr.map.tex_depthmap_interp_linear,
		//rvr.map.tex_depthmap_interp_nearest,
		rvr.world_size_x_div_2,
		rvr.world_size_y_div_2,
		rvr.world_size_x,
		rvr.world_size_y,
		90,
		0, 1, 1, 0.1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	rvr.c.flush_all();
	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

	rvr.c.flush_all();

};