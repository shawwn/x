asbx.render = function()
{

	//asbx.camera_player.set_zoom(1.2);
/*
	asbx.goal_display_x = asbx.goal_x * 0.15 + 0.85 * asbx.goal_display_x;
	asbx.goal_display_y = asbx.goal_y * 0.15 + 0.85 * asbx.goal_display_y;
*/

	

/*
	asbx.c.rectangle.draw(asbx.CAM_PLAYER,
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

	asbx.c.rectangle.draw(asbx.CAM_STRETCH,
		0.5,
		0.5,
		1.0,
		1.0,
		90,
		210, 0.945, 0.52, 0.9,
		210, 0.945, 0.52, 0.9,
		210, 0.995, 0.52, 0.9,
		210, 0.995, 0.52, 0.9
	);

	asbx.c.flush_all();

/*
	asbx.c.set_blending(asbx.c.gl.SRC_ALPHA, asbx.c.gl.ONE, asbx.c.gl.FUNC_ADD);
	asbx.particlesGPU.draw(asbx.now, asbx.c.gl, asbx.camera_player);
	asbx.c.set_blending(asbx.c.gl.SRC_ALPHA, asbx.c.gl.ONE_MINUS_SRC_ALPHA, asbx.c.gl.FUNC_ADD);
*/



	asbx.current_area.draw();
	asbx.c.flush_all();
	
	asbx.fonts.flush_all();




	asbx.player.draw();
	asbx.c.rectangle_textured.flush_all();

	//asbx.framebuffer.unbind_buffer();


/*
	asbx.c.rectangle_textured.draw(
		asbx.CAM_STRETCH,
		asbx.framebuffer.framebuffer_texture,
		0.5,
		0.5,
		1.0,
		1.0,
		90,
		0, 1, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);

//*/

	var size_x = 0.45;
	var size_y = 0.45;
	var spacing = 0.0775;

	var fade = asbx.camera_stretch.mouse_pos_x;

	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0 + 0.005, 0.535 - 0.005, size_x, size_y, spacing,
		0, 0, 0, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0 + 0.005, 0.535 + 0.005, size_x, size_y, spacing,
		0, 0, 0, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0 - 0.005, 0.535 - 0.005, size_x, size_y, spacing,
		0, 0, 0, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0 - 0.005, 0.535 + 0.005, size_x, size_y, spacing,
		0, 0, 0, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	asbx.fonts.flush_all();


	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0, 0.535, size_x, size_y, spacing,
		0, 0, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);




	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0, 0.235, size_x * 0.3, size_y * 0.3, spacing * 0.3,
		0, 0, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);




	asbx.fonts.draw_text(
		"123456789 abcdefg", fade,
		asbx.CAM_PLAYER, asbx.font_name,
		- asbx.camera_player.aspect * 0.25 + 0.0, 0.135, size_x * 0.1, size_y * 0.1, spacing * 0.1,
		0, 0, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	asbx.fonts.flush_all();

/*

	text,
	cam_id, font_index,
	pos_x, pos_y, width, height, spacing,
	tint_h_1, tint_s_1, tint_l_1, tint_a_1,
	tint_h_2, tint_s_2, tint_l_2, tint_a_2,
	tint_h_3, tint_s_3, tint_l_3, tint_a_3,
	tint_h_4, tint_s_4, tint_l_4, tint_a_4

*/



	
	asbx.c.set_blending(asbx.c.gl.SRC_ALPHA, asbx.c.gl.ONE, asbx.c.gl.FUNC_ADD);
	asbx.particlesGPU_top.draw(asbx.now, asbx.c.gl, asbx.camera_player);
	asbx.c.set_blending(asbx.c.gl.SRC_ALPHA, asbx.c.gl.ONE_MINUS_SRC_ALPHA, asbx.c.gl.FUNC_ADD);

};
