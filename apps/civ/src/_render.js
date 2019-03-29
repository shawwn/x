'use strict';

civ.render = function()
{

	if (civ.input.KEY_M.pressed)
	{
		civ.map.generate();
	}

//*
	civ.draw_tiles.draw(
		civ.CAM_PLAYER,
		civ.map.tex_terrain_tiles,
		civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
		civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
		90,
		0, 1, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.draw_tiles.flush_all(civ.now, civ.map.tex_tiles_data1);
//*/

//*
	civ.draw_subtiles.draw(
		civ.CAM_PLAYER,
		civ.map.tex_subtiles,
		civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
		civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
		90,
		0, 1, 1, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.draw_subtiles.flush_all();
//*/

// GRID
/*
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_outline,
		civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
		civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
		civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, 90,
		0, 1, 0, 0.2,
		120, -1, -1, -1,
		220, -1, -1, -1,
		320, -1, -1, -1);
/*
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_thick_outline,
		civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
		civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
		civ.MAP_TOTAL_TILES_X, civ.MAP_TOTAL_TILES_Y, 90,
		0, 1, 0.0, 0.3,
		120, -1, -1, -1,
		220, -1, -1, -1,
		320, -1, -1, -1);
//*/

	civ.c.flush_all();

	civ.colonies.draw();
	civ.persons.draw();
	civ.c.flush_all();

	civ.units.draw();
	civ.c.flush_all();

/*
	for (var i = 0; i < 15; i++)
	{
		civ.draw_clouds.draw(
			civ.CAM_PLAYER,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			(civ.now + 1000000 * i) * (2.2345235465 + 0.0524354 * i)
			);
	}
*/

	civ.draw_clouds.flush_all(civ.now * 2.2);


	civ.gui.draw();
	civ.c.flush_all();

	if (civ.input.KEY_D.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_tiles_data1,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	else if (civ.input.KEY_J.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_terrain_height,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	else if (civ.input.KEY_B.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_biome_tiles,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	else if (civ.input.KEY_T.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_temperature_tiles,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	else if (civ.input.KEY_V.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_vegetation_tiles,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	else if (civ.input.KEY_H.pressed)
	{
		civ.c.rectangle_textured.draw(
			civ.CAM_PLAYER,
			civ.map.tex_humidity_tiles,
			civ.WORLD_SIZE_X / 2, civ.WORLD_SIZE_Y / 2,
			civ.WORLD_SIZE_X, civ.WORLD_SIZE_Y,
			1.0, 1.0, 90,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}

	var res = 520;
	var bar_width = 1 / res;

	var wobble = 0.025;

	for (var i = 0; i < res; i++)
	{
		var frac = i / res;
		var b = µ.bezier(frac, [
					0,
					0,
					0
				,
					wobble * Math.sin(civ.now / 2346.23456654),
					wobble * Math.sin(civ.now / 6734.23484563),
					wobble * Math.sin(civ.now / 124.23484563)
				,
					wobble * Math.sin(civ.now / 4245.46534554),
					wobble * Math.sin(civ.now / 3123.55634563),
					wobble * Math.sin(civ.now / 234.56784345)
				,
					wobble * Math.sin(civ.now / 1452.13467467575367),
					wobble * Math.sin(civ.now / 1237.44567454356764),
					wobble * Math.sin(civ.now / 124.45678343)
				,
					wobble * Math.sin(civ.now / 1573.1453675478723456),
					wobble * Math.sin(civ.now / 1345.2436786546754672),
					wobble * Math.sin(civ.now / 314.05467456)
				,
					0,
					0,
					0
			]);

//		console.log(b[0], b[1]);

		var size = civ.perlin1.noise(frac * 20 + civ.now * 0.003, frac * 20, civ.now * 0.0003);

		var hue = 220 * civ.perlin1.noise(b[2], b[2], frac * 12 + civ.now * 0.0005);

		civ.c.rectangle_textured.draw(
			civ.CAM_STRETCH,
			civ.tex_circle_thick_outline,
			civ.camera_stretch.mouse_pos_x + b[0],
			1 - civ.camera_stretch.mouse_pos_y + b[1],
			.58 * size * frac * (1-frac),
			.58 * size * frac * (1-frac),
			1, 1,
			90,
			hue, 1, 1, 0.35,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);




	}

	civ.c.flush_all();


	

	civ.c.set_blending(civ.c.gl.SRC_ALPHA, civ.c.gl.ONE, civ.c.gl.FUNC_ADD);
	civ.particlesGPU.draw(civ.now, civ.c.gl, civ.camera_player);
	civ.c.set_blending(civ.c.gl.SRC_ALPHA, civ.c.gl.ONE_MINUS_SRC_ALPHA, civ.c.gl.FUNC_ADD);


//*
	var factor = 0.4;

	civ.fonts.draw_text(
		civ.string__think + civ.string__space + (Math.round(1000 / app.think_times.read() * 10) / 10),
		civ.CAM_STRETCH, civ.FONT_DEFAULT, 0.015, 0.95, 0.075 * factor, 0.155 * factor, 0.015 * factor,
		0, 0, .1, .9,
		0, 0, .4, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	civ.fonts.draw_text(
		civ.string__render + civ.string__space + (Math.round(1000 / app.render_times.read() * 10) / 10),
		civ.CAM_STRETCH, civ.FONT_DEFAULT, 0.015, 0.9, 0.075 * factor, 0.155 * factor, 0.015 * factor,
		0, 0, .1, .9,
		0, 0, .4, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	civ.fonts.draw_text(
		civ.string__callback + civ.string__space + (Math.round(1000 / app.callback_times.read() * 10) / 10),
		civ.CAM_STRETCH, civ.FONT_DEFAULT, 0.015, 0.85, 0.075 * factor, 0.155 * factor, 0.015 * factor,
		0, 0, .1, .9,
		0, 0, .4, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);


	civ.fonts.flush_all();

};
