"use strict";

btx.think = function(time_delta)
{
	time_delta *= btx.timescale;
	btx.now += time_delta;
	btx.game.think_switch(time_delta);
	btx.game.think(time_delta);
	//console.log(btx.map_pixels_looked_at);
};

btx.think__in_game = function(time_delta)
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
	if (btx.desired_zoom != btx.camera_player.zoom_)
	{
		btx.camera_player.set_zoom(btx.camera_player.zoom_ - (btx.camera_player.zoom_ - btx.desired_zoom) / 16);
	}

	if (btx.game.spectated_person != -1)
	{
		btx.camera_player.set_pos(		btx.camera_player.pos_x * 0.95 + (btx.persons.persons[btx.game.spectated_person].pos_x) * 0.05,
										btx.camera_player.pos_y * 0.95 + (btx.persons.persons[btx.game.spectated_person].pos_y) * 0.05);
	}
	else
	{
		btx.camera_player.set_pos(		btx.camera_player.pos_x * 0.95 + (btx.camera_stretch.mouse_pos_x * btx.world_size_x) * 0.05,
										btx.camera_player.pos_y * 0.95 + ((1 - btx.camera_stretch.mouse_pos_y) * btx.world_size_y) * 0.05);
	}

	btx.camera_player.recalc_mouse();

	btx.selected_cityblock = -1;
	btx.selected_house = -1;
	for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
	{
		var block = btx.cityblocks.cityblocks[i];
		if (
					(block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5) < btx.camera_player.mouse_pos_x
				&&	(block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5) > btx.camera_player.mouse_pos_x
				&&	(block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5) < btx.camera_player.mouse_pos_y
				&&	(block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5) > btx.camera_player.mouse_pos_y)
		{
			btx.selected_cityblock = i;
			for (var j = 0, len2 = btx.cityblocks.cityblocks[i].houses.length; j < len2; j++)
			{
				var house = block.houses[j];
				if (
							(house.pos_x - house.size_x * 0.5) < btx.camera_player.mouse_pos_x
						&&	(house.pos_x + house.size_x * 0.5) > btx.camera_player.mouse_pos_x
						&&	(house.pos_y - house.size_y * 0.5) < btx.camera_player.mouse_pos_y
						&&	(house.pos_y + house.size_y * 0.5) > btx.camera_player.mouse_pos_y)
				{
					btx.selected_house = j;
					break;
				}
			}
			break;
		}
	}

	// lights
	for (var j = 0; j < 8; j++)
	{
		var duration = 1250 + µ.rand(250);
		btx.light_flashes.add(
								btx.camera_player.mouse_pos_x - .1 + µ.rand(0.2),
								btx.camera_player.mouse_pos_y - .1 + µ.rand(0.2),
								duration,
								duration * (0.01 + µ.rand(0.2)),
								1.1 + µ.rand(1.2),
								0.35,
								.1, 0.095, 0.04 + µ.rand(0.04));
	}

	btx.light_flashes.think(time_delta);

	btx.weather.think(time_delta * btx.options_debug_values[btx.DEBUG_OPTION__DAYCYCLE_SCALE]);

	btx.persons.think(time_delta);

};
