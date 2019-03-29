"use strict";

btx.think = function(time_delta)
{
	time_delta *= btx.timescale;
	btx.now += time_delta;
	btx.game.think_switch(time_delta);
	btx.game.think(time_delta);
	//console.log(btx.map_pixels_looked_at);
};

btx.think__in_map = function(time_delta)
{

	if (btx.input.KEY_Q.pressed)
	{
		btx.desired_zoom = btx.camera_player.zoom_ + time_delta * 0.025 * btx.camera_player.zoom_;
		
	}
	if (btx.input.KEY_E.pressed)
	{
		btx.desired_zoom = btx.camera_player.zoom_ - time_delta * 0.025 * btx.camera_player.zoom_;
	}
	
	btx.desired_zoom = µ.between(btx.min_zoom, btx.desired_zoom, btx.max_zoom);
	//btx.desired_zoom = (1.0 - btx.player_agent.height) * btx.zoom_at_height_0 + btx.player_agent.height * btx.zoom_at_height_1;
	if (btx.desired_zoom != btx.camera_player.zoom_)
	{
		btx.camera_player.set_zoom(btx.camera_player.zoom_ - (btx.camera_player.zoom_ - btx.desired_zoom) / 16);
	}

	btx.camera_player.set_pos(btx.camera_stretch.mouse_pos_x * btx.world_size_x, (1 - btx.camera_stretch.mouse_pos_y) * btx.world_size_y);
	
	if (btx.input.KEY_P.pressed)
	{
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x, btx.camera_player.mouse_pos_y, 0.0);
	}
	if (btx.input.KEY_O.pressed)
	{
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x,			btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x + 1.0,	btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x - 1.0,	btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x + 2.0,	btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x - 2.0,	btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x + 3.0,	btx.camera_player.mouse_pos_y, 1.0);
		btx.map.set_fluid_at(btx.camera_player.mouse_pos_x - 3.0,	btx.camera_player.mouse_pos_y, 1.0);

	}
	
	btx.fluids.process_steps(1, btx.map.tex_material);
	
/*
	if (btx.now - btx.last_fluid_check > 2000)
	{
		btx.fluids.get_data(btx.float_fluid, 0, 0, btx.fluid_map_size, btx.fluid_map_size)
		
		var sum = 0;
		for (var i = 0; i < btx.fluid_map_size * btx.fluid_map_size; i++)
		{
			sum += btx.float_fluid[i * 4];
		}
		console.log('water', sum);

		btx.last_fluid_check = btx.now;
	}
//*/	
	
};
