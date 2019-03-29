"use strict";

rvr.render__in_map = function(time_delta)
{
	if (rvr.game.state != rvr.GAMESTATE_IN_MAP)
	{
		return;
	}

	// start screen buffer
//*
	rvr.framebuffer_gamemap.bind_buffer();
	rvr.c.gl.clearColor(0,0,0,1);
	rvr.c.gl.clear(rvr.c.gl.COLOR_BUFFER_BIT);
//*/

	rvr.lights.new_frame();
	rvr.map.draw_floor();
	rvr.map.draw(rvr.camera_player);
	rvr.map.draw_walls(rvr.camera_player);
	rvr.c.flush_all();

	if (rvr.debug__draw_depth_map2)
	{
		//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
		//rvr.draw_fluids.draw(
		rvr.draw_depthmap.draw(
			rvr.CAM_PLAYER,
			rvr.map.tex_depthmap_interp_nearest,
			rvr.world_size_x_div_2,
			rvr.world_size_y_div_2,
			rvr.world_size_x,
			rvr.world_size_y,
			1.0, 1.0, 90,
			0, 1.0, 1.0, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);
		rvr.draw_depthmap.flush_all(rvr_agents__pos_z[0] - 0.2, rvr_agents__pos_z[0] - 0.5, rvr_agents__pos_z[0] + 0.05, rvr_agents__pos_z[0] + 0.09);
	}

/*
	rvr.player_agent.parameters.sight_cone = rvr.camera_stretch.mouse_pos_x * 360;
	rvr.player_agent.parameters.light_cone = rvr.camera_stretch.mouse_pos_x * 360;
	console.log(rvr.camera_stretch.mouse_pos_x * 360);
*/

	rvr.agents.draw_lights();
	rvr.projectiles.draw_lights();

	rvr.agents.draw_shadows();	rvr.c.flush_all();

	rvr.pickups.draw();			rvr.c.flush_all();

	rvr.agents.draw();			rvr.c.flush_all();
	rvr.agents.draw2();			rvr.c.flush_all();
	rvr.agents.draw3();			rvr.c.flush_all();

	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
	rvr.agents.draw_shields();	rvr.c.flush_all();
	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

	rvr.projectiles.draw();		rvr.c.flush_all();


	if (rvr.input.KEY_7.pressed)
	{
		//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
		rvr.draw_fluids.draw(
			rvr.CAM_PLAYER,
			rvr.fluids.current_texture,
			rvr.world_size_x_div_2,
			rvr.world_size_y_div_2,
			rvr.world_size_x,
			rvr.world_size_y,
			1.0, 1.0, 90,
			0, 1.0, 0.5, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);
		rvr.draw_fluids.flush_all();
	}
	rvr.player.draw(time_delta);

	//rvr.c.set_blending(rvr.c.gl.ONE, rvr.c.gl.ONE, rvr.c.gl.FUNC_MIN);
	//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

/*
	rvr.draw_smoke.draw(
		rvr.CAM_PLAYER,
		rvr.smoke.current_texture,
		rvr.world_size_x_div_2,
		rvr.world_size_y_div_2,
		rvr.world_size_x,
		rvr.world_size_y,
		1.0, 1.0, 90,
		0, 1.0, 1.0, 0.5,
		-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	rvr.draw_smoke.flush_all(.6, .4, .2, 0);
*/

	//rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);
	rvr.map.draw_ceilings(rvr.camera_player);
	rvr.c.flush_all();

	rvr.player_agent.draw();
	rvr.c.flush_all();

	// PARTICLES
	rvr.particlesGPU_below.draw(rvr.now, rvr.c.gl, rvr.camera_player);

	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
	rvr.particlesGPU.draw(rvr.now, rvr.c.gl, rvr.camera_player);
	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

	if (rvr.debug__draw_agent_markers || rvr.agents.currently_selected_agent > -1  || rvr.agents.agent_closest_to_mouse > -1)
	{
		rvr.agents.draw_debug();
	}



	//rvr.map.draw_visible_tiles(rvr.camera_player);

	if (rvr.debug__draw_depth_map)
	{
		rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
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
	}



	// UNBIND BUFFER

	rvr.framebuffer_gamemap.unbind_buffer();

	rvr.lights.render();

	rvr.draw_screen_shader.draw(rvr.CAM_STRETCH,
		rvr.framebuffer_gamemap.framebuffer_texture,
		0.5, 0.5,
		1, 1,
		1, 1, 90,
		0, 1, 1, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	rvr.draw_screen_shader.flush_all(rvr.lights.framebuffer.framebuffer_texture);


	// draw scents
//*
	if (rvr.debug__draw_scent__channel != 4)
	{
		var scent = rvr.scents.scent[rvr.debug__draw_scent__faction];
		if (scent !== undefined)
		{
			rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);
			rvr.draw_scent.draw(
				rvr.CAM_PLAYER,
				scent.current_texture,
				rvr.world_size_x_div_2,
				rvr.world_size_y_div_2,
				rvr.world_size_x,
				rvr.world_size_y,
				1.0, 1.0, 90,
				0, 1.0, 1.0, 0.5, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

			if (rvr.debug__draw_scent__channel == 0)
				rvr.draw_scent.flush_all(1, 0, 0, 0);
			else if (rvr.debug__draw_scent__channel == 1)
				rvr.draw_scent.flush_all(0, 1, 0, 0);
			else if (rvr.debug__draw_scent__channel == 2)
				rvr.draw_scent.flush_all(0, 0, 1, 0);
			else if (rvr.debug__draw_scent__channel == 3)
				rvr.draw_scent.flush_all(rvr.scent_weight__self, rvr.scent_weight__attacked, rvr.scent_weight__feared, 0);

			rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);
		}
		else
		{
			// debug...
		}
	}
//*/
	rvr.gui.draw(time_delta);
	rvr.c.flush_all();
	if (rvr.debug__draw_debug_text > 0)
	{
		rvr.render_debug(time_delta);
		rvr.c.flush_all();
	}

};