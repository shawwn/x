rvr.Agent.prototype.drop_scent = function(time_delta)
{
	var tile_index = this.scent_pos_y * rvr.scent_map_size + this.scent_pos_x;
	if (!this.is_dying && rvr.now - this.last_scent_drop > rvr.enemy_scent_drop_frequency)
	{
		//rvr.scent.queue_pixel_add(2, 1.0, this.scent_pos_x, this.scent_pos_y);
		var scent_buffer = rvr.scents.scent_buffer[this.faction_id];
		this.last_scent_drop = rvr.now + µ.rand_int(rvr.enemy_scent_drop_frequency_max);
		scent_buffer[tile_index * 4 + rvr.SCENT_CHANNEL__SELF] += rvr.enemy_scent_drop_strength;
		rvr.temp_array[0] = scent_buffer[tile_index * 4 + 0];
		rvr.temp_array[1] = scent_buffer[tile_index * 4 + 1];
		rvr.temp_array[2] = scent_buffer[tile_index * 4 + 2];
		rvr.temp_array[3] = scent_buffer[tile_index * 4 + 3];
		rvr.scents.scent[this.faction_id].set_data_subimage(rvr.temp_array, this.scent_pos_x, this.scent_pos_y, 1, 1);
	}
}

rvr.Agent.prototype.move_into_scent_direction = function(time_delta)
{
	var this_index = this.index;	
	var	best_scent_tile_x_direction = 0;
	var	best_scent_tile_y_direction = 0;
	var j = 0;
	var best_scent_strength = -99999;
	if ( 		rvr.now - this.last_scent_check < rvr.enemy_scent_check_frequency
			&&	this.old_scent_pos_x == this.scent_pos_x
			&&	this.old_scent_pos_y == this.scent_pos_y
		)
	{
		best_scent_tile_x_direction = this.last_chosen_scent_direction_x;
		best_scent_tile_y_direction = this.last_chosen_scent_direction_y;
	}
	else
	{
		this.last_scent_check = rvr.now;
		for (var x = -1; x < 2; x++)
		{
			for (var y = -1; y < 2; y++)
			{
				var tile_x = this.scent_pos_x + x;
				var tile_y = this.scent_pos_y + y;
				var tile_index = tile_y * rvr.scent_map_size + tile_x;
				if (tile_x >= 0 && tile_x < rvr.scent_map_size &&	tile_y >= 0 && tile_y < rvr.scent_map_size)
				{
					// don't bother checking scent if we couldn't move there anyway
					if ((x == 0 && y == 0) || rvr.agents.check_move_viability(
							time_delta,
							this,
							rvr_agents__pos_x[this_index] + rvr.scent_tile_world_size_x * x,
							rvr_agents__pos_y[this_index] - rvr.scent_tile_world_size_y * y, // notice the flipped thingy
							rvr_agents__pos_z[this_index]
						))
					{
						var scent_buffer = rvr.scents.scent_buffer[this.faction_id];
						var self_scent = 		scent_buffer[tile_index * 4 + rvr.SCENT_CHANNEL__SELF];
						var attacked_scent = 	scent_buffer[tile_index * 4 + rvr.SCENT_CHANNEL__ATTACKED];
						var feared_scent = 		scent_buffer[tile_index * 4 + rvr.SCENT_CHANNEL__FEARED];

						var scent_strength = 	self_scent * rvr.scent_weight__self
											+	attacked_scent * rvr.scent_weight__attacked
											+ 	feared_scent * rvr.scent_weight__feared;
		
						if ((best_scent_strength < scent_strength) || (scent_strength != 0 && best_scent_strength == scent_strength && µ.rand_int(1) == 0))
						{
							best_scent_strength = scent_strength;
							best_scent_tile_x_direction = x;
							best_scent_tile_y_direction = y;
						}
					}
				}
			}
		}
	}
	if (best_scent_tile_x_direction != 0 || best_scent_tile_y_direction != 0)
	{
		this.last_chosen_scent_direction_x = best_scent_tile_x_direction;
		this.last_chosen_scent_direction_y = best_scent_tile_y_direction;
		//needs to be flipped
		best_scent_tile_y_direction *= -1;
		//console.log(best_scent_strength, best_scent_tile_x_direction, best_scent_tile_y_direction);
		rvr_agents__speed_x[this_index] += best_scent_tile_x_direction * this.parameters.move_acceleration * time_delta;
		rvr_agents__speed_y[this_index] += best_scent_tile_y_direction * this.parameters.move_acceleration * time_delta;
		if (best_scent_tile_x_direction >= 0 && rvr_agents__speed_x[this_index] < 0)
		{
			rvr_agents__speed_x[this_index] += this.parameters.move_deceleration * time_delta;
			if (rvr_agents__speed_x[this_index] > 0)
			{
				rvr_agents__speed_x[this_index] = 0;
			}
		}
		if (best_scent_tile_x_direction <= 0 && rvr_agents__speed_x[this_index] > 0)
		{
			rvr_agents__speed_x[this_index] -= this.parameters.move_deceleration * time_delta;
			if (rvr_agents__speed_x[this_index] < 0)
			{
				rvr_agents__speed_x[this_index] = 0;
			}
		}
		if (best_scent_tile_y_direction >= 0 && rvr_agents__speed_y[this_index] < 0)
		{
			rvr_agents__speed_y[this_index] += this.parameters.move_deceleration * time_delta;
			if (rvr_agents__speed_y[this_index] > 0)
			{
				rvr_agents__speed_y[this_index] = 0;
			}
		}
		if (best_scent_tile_y_direction <= 0 && rvr_agents__speed_y[this_index] > 0)
		{
			rvr_agents__speed_y[this_index] -= this.parameters.move_deceleration * time_delta;
			if (rvr_agents__speed_y[this_index] < 0)
			{
				rvr_agents__speed_y[this_index] = 0;
			}
		}

		var angle_to_turn = µ.turn(this.state.facing, µ.vector2D_to_angle(best_scent_tile_x_direction, best_scent_tile_y_direction));
		this.state.facing += (angle_to_turn / 200) * time_delta;

	}
}