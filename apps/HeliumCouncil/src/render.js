"use strict";

hc.render = function(time_delta)
{

	if (hc.game.state == hc.GAMESTATE_IN_MAP)
	{
		hc.render__in_map(time_delta);
	}
	if (hc.game.state == hc.GAMESTATE_INTRO)
	{
		hc.render__intro(time_delta);
	}

	//hc.c.gl.finish();

};

hc.render__intro = function(time_delta)
{
}

hc.render__in_map = function(time_delta)
{


	hc.c.rectangle_textured.draw(
		hc.CAM_PLAYER,
		hc.tex_noise,
		hc.universe_size_x_div_2,
		hc.universe_size_y_div_2,
		hc.universe_size_x,
		hc.universe_size_y,
		90,
		0, 1, 1, 0.1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	hc.c.flush_all();

	hc.universe.draw();
	
	// PARTICLES
	hc.particlesGPU_below.draw(hc.now, hc.c.gl, hc.camera_player);

	hc.c.set_blending(hc.c.gl.SRC_ALPHA, hc.c.gl.ONE, hc.c.gl.FUNC_ADD);
	hc.particlesGPU.draw(hc.now, hc.c.gl, hc.camera_player);
	hc.c.set_blending(hc.c.gl.SRC_ALPHA, hc.c.gl.ONE_MINUS_SRC_ALPHA, hc.c.gl.FUNC_ADD);

	
	//hc.c.gl.finish();

};