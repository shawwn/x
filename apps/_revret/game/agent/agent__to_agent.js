rvr.Agent.prototype.oh_look_they_are_ijamming = function(time_delta)
{

	var this_state = this.state;
	var this_parameters = this.parameters;
	var this_index = this.index;

	var closest_other_agent = null;
	var closest_other_agent_index = -1;
	var closest_other_agent_distance = -1;

	for (var i = 0; i < rvr.agents.agent_count; i++)
	{
		if (i == this.index || !rvr_agents__is_active[i])
		{
			continue;
		}

		var other_a = rvr.agents.agents[i];

		// COLLISION

		var dist = -1;

		// this totally kills performance, causing this and other functions to not get optimized in chrome... what?
		// it was made obsolete by wanting to know close agents, not just colliding ones, but still, leave this in to uncomment and profile every now and then :P
		//var dist_m = µ.distance2D_manhattan(rvr_agents__pos_x[i], rvr_agents__pos_y[i], rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);

		var combined_radius = this_parameters.radius + other_a.parameters.radius;
		//if (dist_m < combined_radius)
		{

			dist = µ.distance2D(rvr_agents__pos_x[i], rvr_agents__pos_y[i], rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);
			var dist_hulls = dist - combined_radius;
			// player is handled separately

			if (other_a.type != rvr.AGENT_TYPE__PLAYER && this.type != rvr.AGENT_TYPE__PLAYER && (closest_other_agent_distance == -1 || closest_other_agent_distance > dist_hulls))
			{
				closest_other_agent = other_a;
				closest_other_agent_index = i;
				closest_other_agent_distance = dist_hulls;
			}


			var overlap = combined_radius - dist;
			if (overlap > 0)
			{
/*
				var angle = µ.vector2D_to_angle(rvr_agents__pos_x[i] - rvr_agents__pos_x[this_index], rvr_agents__pos_y[i] - rvr_agents__pos_y[this_index]);
				var move_x = µ.angle_to_x(angle) * overlap / 250;
				var move_y = µ.angle_to_y(angle) * overlap / 250;
				
//*/
//*
				µ.vector2D_normalize(rvr_agents__pos_x[i] - rvr_agents__pos_x[this_index], rvr_agents__pos_y[i] - rvr_agents__pos_y[this_index], this.temp_vector)
				var move_x = this.temp_vector[0] * overlap / 200;
				var move_y = this.temp_vector[1] * overlap / 200;
//*/
				var weight_ratio = this_parameters.weight / (other_a.parameters.weight + this_parameters.weight);
				rvr_agents__speed_x[i] += move_x * weight_ratio;
				rvr_agents__speed_y[i] += move_y * weight_ratio;
				rvr_agents__speed_x[this_index] -= move_x * (1 - weight_ratio);
				rvr_agents__speed_y[this_index] -= move_y * (1 - weight_ratio);
			}
		}
	}


	if (this.is_dying || this.type == rvr.AGENT_TYPE__PLAYER)
	{
		return;
	}

	// push away a bit from closest agent that is *too* close
	if (closest_other_agent_distance < this_parameters.keep_distance_to_anyone_min)
	{
		µ.vector2D_normalize(rvr_agents__pos_x[closest_other_agent_index] - rvr_agents__pos_x[this_index], rvr_agents__pos_y[closest_other_agent_index] - rvr_agents__pos_y[this_index], this.temp_vector)
			var move_x = this.temp_vector[0] * this.parameters.move_acceleration;
			var move_y = this.temp_vector[1] * this.parameters.move_acceleration;
			rvr_agents__speed_x[this_index] += -move_x * 5;
			rvr_agents__speed_y[this_index] += -move_y * 5;
	}

}

rvr.Agent.prototype.check_out_some_agents = function()
{
	var this_index = this.index;
	var this_parameters = this.parameters;

	for (var i = 0; i < 30; i++)
	{
		this.next_agent_to_check_out = (this.next_agent_to_check_out + 1) % rvr.agent_count;
		if (this.next_agent_to_check_out == this.index)
		{
			continue;
		}
		if (rvr_agents__is_active[this.next_agent_to_check_out] == 0 || rvr.agents.agents[this.next_agent_to_check_out].is_dying == true)
		{
			continue;
		}

		var other_a = rvr.agents.agents[this.next_agent_to_check_out];

		// out of sight, out of mind
		dist = µ.distance2D(rvr_agents__pos_x[this.next_agent_to_check_out], rvr_agents__pos_y[this.next_agent_to_check_out], rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index]);
		if (dist > this_parameters.sight_range)
		{
			continue;
		}
		if (rvr.map.trace_pixels(
			rvr_agents__pos_x[this_index], 						rvr_agents__pos_y[this_index], 						rvr_agents__pos_z[this_index] + this_parameters.sight_height,
			rvr_agents__pos_x[this.next_agent_to_check_out], 	rvr_agents__pos_y[this.next_agent_to_check_out], 	rvr_agents__pos_z[this.next_agent_to_check_out] + other_a.parameters.radius / 4,
			rvr.testing__map_trace_resolution, dist) == 0.0)
		{
			continue;
		}

		//console.log(this.agent_memories[rvr.AGENT_MEMORY_TYPE__ATTACKED]);

		// rel_attack
		if (this.faction.rel_attack[other_a.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__ATTACKED].maybe_remember(other_a, dist);
		}
		// rel_support
		if (this.faction.rel_support[other_a.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__SUPPORTED].maybe_remember(other_a, dist);
		}
		// rel_fear
		if (this.faction.rel_fear[other_a.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__FEARED].maybe_remember(other_a, dist);
		}
/*
		// rel_attacking
		if (other_a.faction.rel_attack[this.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__ATTACKING].maybe_remember(other_a, dist);
		}
		// rel_supported
		if (other_a.faction.rel_support[this.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__SUPPORTING].maybe_remember(other_a, dist);
		}
		// rel_feared
		if (other_a.faction.rel_fear[this.faction_id])
		{
			this.agent_memories[rvr.AGENT_MEMORY_TYPE__FEARING].maybe_remember(other_a, dist);
		}
*/
	}

}

rvr.Agent.prototype.update_agent_memories = function()
{
	for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
	{
		this.agent_memories[i].update();
	}
}

rvr.Agent.prototype.relate_to_others = function(time_delta)
{
	var this_parameters = this.parameters;
	var this_index = this.index;
	this.favourite_move_direction = -1;
	this.favourite_move_direction_weight = -999999999999999;
	this.favourite_aim_direction = -1;
	this.favourite_aim_direction_weight = -999999999999999;

	for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
	{
		if (
				i == rvr.AGENT_MEMORY_TYPE__ATTACKED
			||	i == rvr.AGENT_MEMORY_TYPE__ATTACKING
			||	i == rvr.AGENT_MEMORY_TYPE__SUPPORTED
			||	i == rvr.AGENT_MEMORY_TYPE__FEARED
			)
		{
			for (var j = 0; j < this.agent_memories[i].slot_count; j++)
			{
				this.relate_to_other(time_delta, this.agent_memories[i].slots[j], i);
			}
		}
	}

	if (this.favourite_move_direction > -1)
	{
		var move_x = µ.angle_to_x(this.favourite_move_direction) * this_parameters.move_acceleration * time_delta;
		var move_y = µ.angle_to_y(this.favourite_move_direction) * this_parameters.move_acceleration * time_delta;
/*
		if (rvr.agents.check_move_viability(
				time_delta,
				this,
				rvr_agents__pos_x[this_index] + move_x * time_delta,
				rvr_agents__pos_y[this_index] + move_y * time_delta,
				rvr_agents__pos_z[this_index]
			))
*/
		{
			rvr_agents__speed_x[this_index] += move_x;
			rvr_agents__speed_y[this_index] += move_y;
		}
		//else
		{
			//this.move_into_scent_direction(time_delta);
		}

		var angle_to_turn = µ.turn(this.state.facing, this.favourite_move_direction);
		this.state.facing += (angle_to_turn / 200) * time_delta;

	}
	else if (this_index != 0)
	{
		this.move_into_scent_direction(time_delta);
	}

	if (this.favourite_aim_direction > -1)
	{
		var angle_to_turn = µ.turn(this.aim_angle, this.favourite_aim_direction);
		this.aim_angle = (this.aim_angle + (angle_to_turn / 40) * time_delta) % 360;

		//if (Math.abs(this.aim_angle - this.favourite_aim_direction) <= this.parameters.aim_tolerance)
		{
			//console.log('trigger');
			this.trigger_weapon();
		}
		//else
		{
			//console.log(Math.abs(this.aim_angle - this.favourite_aim_direction), this.parameters.aim_tolerance, Math.abs(this.aim_angle - this.favourite_aim_direction) <= this.parameters.aim_tolerance);
		}
	}
	else
	{
		//var angle_to_turn = µ.turn(this.aim_angle, this.state.facing);
		//this.aim_angle = (this.aim_angle + (angle_to_turn / 200) * time_delta) % 360;
	}
}

rvr.Agent.prototype.consider_move_direction = function(direction, weight)
{
	if (weight > this.favourite_move_direction_weight)
	{
		this.favourite_move_direction = direction;
		this.favourite_move_direction_weight = weight;
	}
}

rvr.Agent.prototype.consider_aim_direction = function(direction, weight)
{
	if (weight > this.favourite_aim_direction_weight)
	{
		this.favourite_aim_direction = direction;
		this.favourite_aim_direction_weight = weight;
	}
}

rvr.Agent.prototype.relate_to_other = function(time_delta, slot, memory_type)
{
	if (slot.agent_index == -1)
	{
		return;
	}
	var this_parameters = this.parameters;

	var dist_min = 0.5;
	var dist_max = 2.0;
	var weight = 0;

	var other = false;
	var follow = false;
	if (memory_type == rvr.AGENT_MEMORY_TYPE__ATTACKED)
	{
		dist_min = this_parameters.keep_distance_to_attacked_min;
		dist_max = this_parameters.keep_distance_to_attacked_max;
		weight = 1;
		follow = true;
	}
	else if (memory_type == rvr.AGENT_MEMORY_TYPE__SUPPORTED)
	{
		//console.log(memory_type);
		var other = true;
		dist_min = this_parameters.keep_distance_to_supported_min;
		dist_max = this_parameters.keep_distance_to_supported_max;
		weight = 0.75;
	}
	else if (memory_type == rvr.AGENT_MEMORY_TYPE__FEARED)
	{
		dist_min = this_parameters.keep_distance_to_feared_min;
		dist_max = this_parameters.keep_distance_to_feared_max;
		weight = 1.25;
	}
	else if (memory_type == rvr.AGENT_MEMORY_TYPE__ATTACKING && this.state.health <= this.parameters.flee_health_threshold)
	{

		dist_min = this_parameters.keep_distance_to_attacking_min;
		dist_max = this_parameters.keep_distance_to_attacking_max;
		weight = 1.5;
		follow = true;
	}
	else
	{
		return;
	}

	

	var this_state = this.state;
	var this_index = this.index;
	var this_parameters = this.parameters;

// prefer player
	weight *= slot.agent_index == 0 ? 1.01 : 1;

	//console.log(this.index, slot.agent_index, memory_type, slot);

	if (this.type != rvr.AGENT_TYPE__PLAYER && !this.is_dying)
	{
		if ((slot.last_seen_pos_z - rvr_agents__pos_z[this_index]) < rvr.step_up_depth_threshold)
		{
			// only enforce min/max distance when we have recently seen the agent
			if (rvr.now - slot.last_seen < 200)
			{
				// move towards
				if (slot.distance - (this.parameters.radius + slot.agent.parameters.radius) > dist_max)
				{
					//console.log('move towards');
					this.consider_move_direction(
						µ.vector2D_to_angle(slot.last_seen_pos_x - rvr_agents__pos_x[this_index], slot.last_seen_pos_y - rvr_agents__pos_y[this_index]),
						weight - slot.distance / 1000);
				}
				// move away
				else if (slot.distance - (this.parameters.radius + slot.agent.parameters.radius) < dist_min)
				{
					//console.log('move away');
					this.consider_move_direction(
						(180 + µ.vector2D_to_angle(slot.last_seen_pos_x - rvr_agents__pos_x[this_index], slot.last_seen_pos_y - rvr_agents__pos_y[this_index])) % 360,
						weight - slot.distance / 1000);
				}
				else
				{
					// nah
				}
				if (memory_type == rvr.AGENT_MEMORY_TYPE__ATTACKED)
				{
					this.consider_aim_direction(
						µ.vector2D_to_angle(slot.last_seen_pos_x - rvr_agents__pos_x[this_index], slot.last_seen_pos_y - rvr_agents__pos_y[this_index]),
						weight - slot.distance / 1000);
				}
			}
			else if (follow)
			{
				// not arrived at where the agent was last seen
				if (slot.distance > this_parameters.radius * 2)
				{
					//console.log('go to last seen');
					this.consider_move_direction(
						µ.vector2D_to_angle(slot.last_seen_pos_x - rvr_agents__pos_x[this_index], slot.last_seen_pos_y - rvr_agents__pos_y[this_index]),
						weight - (rvr.now - slot.last_seen) / 10000000);
				}
				else
				{
					slot.reset();
				}
			}
		}
	}
}
