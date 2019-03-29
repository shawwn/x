"use strict";

btx.render = function(time_delta)
{

	if (btx.game.state == btx.GAMESTATE_IN_MAP)
	{
		btx.render__in_map(time_delta);
	}
	if (btx.game.state == btx.GAMESTATE_INTRO)
	{
		btx.render__intro(time_delta);
	}

	//btx.c.gl.finish();

};

btx.render__intro = function(time_delta)
{
}

btx.render__in_map = function(time_delta)
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
		0, 1, 1, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	btx.c.flush_all();
	
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


	// PARTICLES
	btx.particlesGPU_below.draw(btx.now, btx.c.gl, btx.camera_player);

	btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE, btx.c.gl.FUNC_ADD);
	btx.particlesGPU.draw(btx.now, btx.c.gl, btx.camera_player);
	btx.c.set_blending(btx.c.gl.SRC_ALPHA, btx.c.gl.ONE_MINUS_SRC_ALPHA, btx.c.gl.FUNC_ADD);

	
	//btx.c.gl.finish();

};