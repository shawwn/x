rvr.Agent_Memory = function(agent, slot_count, type)
{
	this.agent = agent;
	this.type = type;
	this.slot_count = slot_count;
	this.slots = [];
	for (var i = 0; i < slot_count; i++)
	{
		this.slots[i] = new rvr.Agent_Memory_Slot();
	}
	this.reset();
}

rvr.Agent_Memory.prototype.reset = function()
{
	this.closest_agent = null;
	this.closest_distance = -1;
	this.last_seen = -1;
	this.last_seen_pos_x = -1;
	this.last_seen_pos_y = -1;
	this.last_seen_pos_z = -1;
	for (var i = 0; i < this.slot_count; i++)
	{
		this.slots[i].reset();
	}
};

rvr.Agent_Memory.prototype._ = function()
{
};

rvr.Agent_Memory.prototype.get_closest_visible = function()
{
	var closest_dist = 9999999999999999999999999999;
	var closest_index = -1;
	for (var i = 0; i < this.slot_count; i++)
	{
		if (slot.agent != null && slot.last_seen == rvr.now)
		{
			if (closest_dist > slot.distance)
			{
				closest_dist = slot.distance;
				closest_index = slot.agent_index;
			}
		}
	}
	return closest_index;
}

rvr.Agent_Memory.prototype.update = function()
{
	var this_index = this.agent.index;
	var this_parameters = this.agent.parameters;
	for (var i = 0; i < this.slot_count; i++)
	{
		var slot = this.slots[i];
		//console.log(slot);
		if (slot.agent != null && rvr.now - slot.last_update >= rvr.agent_memory_slot_update_freq)
		{
			if (
					slot.agent_birthdate == slot.agent.birthdate // make sure this is still actually the same agent
				&&	rvr_agents__is_active[slot.agent_index]
				&& 	!slot.agent.is_dying
				&& 	(rvr.now - slot.last_seen < rvr.agent_memory_timeout)
				)
			{
				dist = µ.distance2D(rvr_agents__pos_x[slot.agent_index], rvr_agents__pos_y[slot.agent_index], rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);
				if (dist <= this_parameters.sight_range)
				{
					if (rvr.map.trace_pixels(
						rvr_agents__pos_x[this_index], 			rvr_agents__pos_y[this_index], 			rvr_agents__pos_z[this_index] + this_parameters.sight_height,
						rvr_agents__pos_x[slot.agent_index], 	rvr_agents__pos_y[slot.agent_index], 	rvr_agents__pos_z[slot.agent_index] + slot.agent.parameters.radius / 4,
						rvr.testing__map_trace_resolution, dist) > 0.0)
					{
						if (this.type == rvr.AGENT_MEMORY_TYPE__ATTACKED || this.type == rvr.AGENT_MEMORY_TYPE__FEARED || this.type == rvr.AGENT_MEMORY_TYPE__SUPPORTED)
						{
							// drop scent for spotted enemy
							if (rvr.now - slot.last_scent_drop >= rvr.enemy_scent_drop_frequency)
							{
								//console.log('sdf', this.agent.faction_id, slot.agent.faction_id, this.type);
								slot.last_scent_drop = rvr.now;
								var tile_index = slot.agent.scent_pos_y * rvr.scent_map_size + slot.agent.scent_pos_x;
								var scent_buffer = rvr.scents.scent_buffer[this.agent.faction_id];
								var scent_strength = rvr.enemy_scent_drop_strength;
								if (this.type == rvr.AGENT_MEMORY_TYPE__ATTACKED)
								{
									var scent_channel = rvr.SCENT_CHANNEL__ATTACKED;
								}
								else if (this.type == rvr.AGENT_MEMORY_TYPE__SUPPORTED)
								{
									var scent_channel = rvr.SCENT_CHANNEL__SUPPORTED;
								}
								else if (this.type == rvr.AGENT_MEMORY_TYPE__FEARED)
								{
									var scent_channel = rvr.SCENT_CHANNEL__FEARED;
									scent_strength *= 3;
								}
								scent_buffer[tile_index * 4 + scent_channel] += scent_strength;
								if (scent_buffer[tile_index * 4 + scent_channel] > 1.0)
								{
									scent_buffer[tile_index * 4 + scent_channel] = 1.0;
								}
								rvr.temp_array[0] = scent_buffer[tile_index * 4 + 0];
								rvr.temp_array[1] = scent_buffer[tile_index * 4 + 1];
								rvr.temp_array[2] = scent_buffer[tile_index * 4 + 2];
								rvr.temp_array[3] = scent_buffer[tile_index * 4 + 3];
								rvr.scents.scent[this.agent.faction_id].set_data_subimage(rvr.temp_array, slot.agent.scent_pos_x, slot.agent.scent_pos_y, 1, 1);
							}
							else
							{
								//console.log(rvr.now - slot.last_scent_drop);
							}
						}
						slot.distance = dist;
						slot.last_seen = rvr.now;
						slot.last_seen_pos_x = rvr_agents__pos_x[slot.agent_index];
						slot.last_seen_pos_y = rvr_agents__pos_y[slot.agent_index];
						slot.last_seen_pos_z = rvr_agents__pos_z[slot.agent_index];
					}
					else
					{
						// is the last seen position still visible?
						if (rvr.map.trace_pixels(
							rvr_agents__pos_x[this_index], 	rvr_agents__pos_y[this_index], 	rvr_agents__pos_z[this_index] + this_parameters.sight_height,
							slot.last_seen_pos_x, 			slot.last_seen_pos_y, 			slot.last_seen_pos_z + slot.agent.parameters.radius / 4,
							rvr.testing__map_trace_resolution, dist) == 0.0)
						{
							slot.reset();
						}
						else
						{
							slot.distance = µ.distance2D(slot.last_seen_pos_x, slot.last_seen_pos_y, rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);
						}
					}
					slot.last_update = rvr.now;
				}
				// slot agent is out of sight range --
				else
				{

					slot.distance = µ.distance2D(slot.last_seen_pos_x, slot.last_seen_pos_y, rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);
					slot.last_update = rvr.now;
				}
			}
			// slot agent is no more, or forgotten
			else
			{
				slot.reset();
			}
		}
	}
}

rvr.Agent_Memory.prototype.maybe_remember = function(other_a, dist)
{
	this_agent_index = this.agent.index;
	other_index = other_a.index;
	var weight = 1 / dist;

	// aha, it's the player
	if (this_agent_index != 0 && other_index == 0)
	{
		weight *= 1.5;
	}

	for (var i = 0; i < this.slot_count; i++)
	{
		var slot = this.slots[i];
		//console.log(slot);
		if (
				(
						slot.agent == null
					||	rvr.agent_memory_timeout < (rvr.now - slot.last_seen)
					//||	slot.distance > dist
					||	slot.weight < weight
					||  slot.agent_index == other_index 		// can't hurt to update it
				)
				&& dist <= this.agent.parameters.sight_range
			)
		{
			//console.log('remembered!', slot.last_seen_pos_x, slot.last_seen_pos_y);
			slot.agent = other_a;
			slot.agent_index = other_index;
			slot.agent_birthdate = other_a.birthdate;
			slot.distance = dist;
			slot.last_scent_drop = -999999;
			slot.weight = weight;
			slot.last_seen = rvr.now;
			slot.last_seen_pos_x = rvr_agents__pos_x[other_index];
			slot.last_seen_pos_y = rvr_agents__pos_y[other_index];
			slot.last_seen_pos_z = rvr_agents__pos_z[other_index];
			return;
		}
	}
}
