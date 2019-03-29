"use strict";

btx.render = function(time_delta)
{

	btx.game.render();

	//btx.c.gl.finish();

};

btx.render__generating = function(time_delta)
{
	btx.c.rectangle_textured.draw(
		btx.CAM_STRETCH,
		btx.tex_noise,
		0.5 - (1 - btx.game.world_gen_phase / btx.WORLD_GEN_PHASE__DONE) * 0.5,
		0.5,
		1.0 * btx.game.world_gen_phase / btx.WORLD_GEN_PHASE__DONE,
		1.0,
		90,
		120 + btx.game.world_gen_phase * 30 + 10 * btx.game.world_gen_phase_progress, 1, 0.5, 0.5, -1,-1, 0.5, -1,-1,-1,0.2,-1, -1,-1,0.2,-1);

	btx.c.rectangle_textured.draw(
		btx.CAM_STRETCH,
		btx.tex_noise,
		0.5,
		0.5,
		1.0,
		1.0,
		90,
		btx.game.world_gen_phase * 30 + 10 * btx.game.world_gen_phase_progress, 1, 0.3 - 0.2 * (1 - btx.game.world_gen_phase_progress), 0.5, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	btx.c.rectangle_textured.draw(
		btx.CAM_STRETCH,
		btx.tex_noise,
		0.5 - (1 - btx.game.world_gen_phase_progress) * 0.5,
		0.5,
		1.0 * btx.game.world_gen_phase_progress,
		0.33,
		90,
		btx.game.world_gen_phase * 30 + 10 * btx.game.world_gen_phase_progress, 1, 0.5, 0.95, -1,-1, 0.5, -1,-1,-1,0.2,-1, -1,-1,0.2,-1);
	btx.c.flush_all();




	btx.fonts.draw_text(
			"" + btx.game.world_gen_phase, 1,
			btx.CAM_STRETCH, btx.FONT_DEFAULT, 0.3, 0.43, 1.4, 1.4, 0.005,
			0, 0, .5, .1,
			0, 0, .7, .1,
			0, 0, .99, .19,
			0, 0, .9, .19
			);
	btx.fonts.flush_all();

}


btx.render__in_game = function(time_delta)
{

	btx.framebuffer_gamemap.bind_buffer();
	btx.c.gl.clearColor(0,0,0,1);
	btx.c.gl.clear(btx.c.gl.COLOR_BUFFER_BIT);

	btx.streets.draw();
	btx.cityblocks.draw();

	btx.persons.draw();
/*
		btx.draw_fluids.draw(
			btx.CAM_PLAYER,
			btx.fluids.current_texture,
			btx.world_size_x_div_2,
			btx.world_size_y_div_2,
			btx.world_size_x,
			btx.world_size_y,
			1.0, 1.0, 90,
			0, 1.0, 0.5, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		//btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);
		btx.draw_fluids.flush_all();
*/

	// PARTICLES
	btx.particlesGPU_below.draw(btx.now, btx.c.gl, btx.camera_player);

	btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);
	btx.particlesGPU.draw(btx.now, btx.c.gl, btx.camera_player);
	btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);

	btx.framebuffer_gamemap.unbind_buffer();

	if (btx.options_debug_values[btx.DEBUG_OPTION__ENABLE_LIGHTS])
	{

		btx.framebuffer_light_block.bind_buffer();
		btx.c.gl.clearColor(0,0,0,1);
		btx.c.gl.clear(btx.c.gl.COLOR_BUFFER_BIT);

		for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
		{
			var block = btx.cityblocks.cityblocks[i];
			block.draw_light_block();
		}

		btx.c.rectangle_textured.flush_all();
		btx.framebuffer_light_block.unbind_buffer();

		btx.framebuffer_lights.bind_buffer();
		btx.c.gl.clearColor(0,0,0,1);
		btx.c.gl.clear(btx.c.gl.COLOR_BUFFER_BIT);
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);

		for (var i = 0, len = btx.streets.street_lamps.length; i < len; i++)
		{
			btx.streets.street_lamps[i].draw();
		}
		btx.persons.draw_lights();
		btx.light_flashes.draw();
		btx.c.rectangle_textured_rgb.flush_all();
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);
		btx.framebuffer_lights.unbind_buffer();

		btx.framebuffer_displacement.bind_buffer();
		btx.c.gl.clearColor(0,0,0,1);
		btx.c.gl.clear(btx.c.gl.COLOR_BUFFER_BIT);
		// additive messes up the direction..
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);
		btx.light_flashes.draw_displacement();
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);
		btx.framebuffer_displacement.unbind_buffer();

		btx.draw_screen_shader.draw(btx.CAM_STRETCH,
			btx.framebuffer_gamemap.framebuffer_texture,
			0.5, 0.5,
			1, 1,
			1, 1, 90,
			0, 1, 1, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.draw_screen_shader.flush_all(	btx.framebuffer_lights.framebuffer_texture,
											btx.framebuffer_light_block.framebuffer_texture,
											btx.framebuffer_displacement.framebuffer_texture,
											btx.game.current_time / (24 * 3600),
											btx.weather.current_cloud_density,
											btx.options_debug_values[btx.DEBUG_OPTION__BLOOM_THRESHOLD],
											btx.options_debug_values[btx.DEBUG_OPTION__BLOOM_STRENGTH],
											btx.options_debug_values[btx.DEBUG_OPTION__LIGHT_AMPLIFICATION]);
		// draw a little bit of the light on top
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);
		btx.c.rectangle_textured_rgb_flipped.draw(
			btx.CAM_STRETCH,
			btx.framebuffer_lights.framebuffer_texture,
			0.5,
			0.5,
			1.0,
			1.0,
			1, 1, 90,
			.2, .2, .2, 0.5, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb_flipped.flush_all();
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);
		
		btx.streets.draw_lamps();
	}
	else
	{
		btx.c.rectangle_textured_rgb_flipped.draw(
			btx.CAM_STRETCH,
			btx.framebuffer_gamemap.framebuffer_texture,
			0.5,
			0.5,
			1.0,
			1.0,
			1, 1, 90,
			1, 1, 1, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb_flipped.flush_all();
	}
	if (btx.options_debug_values[btx.DEBUG_OPTION__DRAW_CLOUDS])
	{
		btx.rectangle_clouds.draw(btx.CAM_PLAYER, btx.world_size_x_div_2, btx.world_size_y_div_2, btx.world_size_x, btx.world_size_y, 1.0);


		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);
		btx.rectangle_clouds.flush_all(		btx.game.time_elapsed,
											btx.weather.current_cloud_density,
											btx.weather.current_cloud_pattern,
											btx.weather.current_fogginess,
											btx.weather.cloud_offset_x,
											btx.weather.cloud_offset_y);
		btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);


		btx.rectangle_clouds.flush_all(		btx.game.time_elapsed,
											btx.weather.current_cloud_density,
											btx.weather.current_cloud_pattern,
											btx.weather.current_fogginess,
											btx.weather.cloud_offset_x,
											btx.weather.cloud_offset_y);
											
	}
	if (btx.options_debug_values[btx.DEBUG_OPTION__GANGS_AND_COPS])
	{
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			//btx.tex_noise,
			btx.map.tex_render,
			btx.world_size_x_div_2,
			btx.world_size_y_div_2,
			btx.world_size_x,
			btx.world_size_y,
			90,
			0, 1, 1, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.flush_all();
	}
	if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_ONLY_LIGHTS])
	{
		btx.c.rectangle_textured_rgb_flipped.draw(
			btx.CAM_STRETCH,
			btx.map.tex_render,
			0.5,
			0.5,
			1.0,
			1.0,
			1, 1, 90,
			1, 1, 1, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.flush_all();
		btx.c.rectangle_textured_rgb_flipped.draw(
			btx.CAM_STRETCH,
			btx.framebuffer_lights.framebuffer_texture,
			//btx.framebuffer_light_block.framebuffer_texture,
			//btx.framebuffer_displacement.framebuffer_texture,
			0.5,
			0.5,
			1.0,
			1.0,
			1, 1, 90,
			1, 1, 1, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.flush_all();
	}
	btx.navmesh.draw();
	btx.persons.draw_hud();
	btx.render__hud();
	//btx.c.gl.finish();
	

};