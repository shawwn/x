rvr.Agents = function()
{
	this.agent_count = rvr.agent_count;
	this.agents = new Array(this.agent_count);

	this.agent_closest_to_mouse = -1;
	this.agent_closest_to_mouse_distance = -1;

	this.currently_selected_agent = -1;

	this.agent_presets_alive = {
	};

	this.agents_alive = 0;
	this.min_desired_alive_agents = Math.round(this.agent_count * 0.8);

	//console.log('agents', this.agent_count, this.min_desired_alive_agents);

	this.min_desired_alive_presets = [

		//['drone', 					50],
		['rebel', 			0],
		['survivor', 		0],
		['bandit', 			0],
	];

	for (var i = 0; i < this.agent_count; i++)
	{
		this.agents[i] = new rvr.Agent();
	}

	//this.agents[0].spawn(0, 'generic_player', rvr.AGENT_TYPE__PLAYER);
	this.spawn_into_slot(0, 'player', rvr.AGENT_TYPE__PLAYER);
	this.player_agent = 0;
	rvr.player_agent = this.agents[0];

	this.spawn_list = [
		['bandit', 				0],
		['drone', 				0],
		['drone_coward', 		0],
		['drone_scout', 		0],
		['drone_scout_armoured',0],
		['drone_sentinel', 		10],
		['drone_teaser', 		0],
		['rebel', 				0],
		['survivor', 			0],
		['turret', 				0],
	];

	if (this.agent_count > 1)
	{
		for (var i = 1; i < this.min_desired_alive_agents; i++)
		{
			var preset_index = µ.pick_randomly_from_weighted_list(this.spawn_list, function(item, index, data) {
				//console.log('=======', item[1]);
				return item[1];
			}, null);

			var preset_name = this.spawn_list[preset_index][0];

			/*

			this.agents[i].spawn(i, preset_name, rvr.AGENT_TYPE__ENEMY);
			this.agent_presets_alive[preset_name] = 1 + (this.agent_presets_alive[preset_name] ? this.agent_presets_alive[preset_name] : 0);
			this.agents_alive++;
			rvr_agents__is_active[i] = 1;
			this.agents[i].is_dying = false;

			*/

			if (preset_name !== undefined && preset_name !== null)
			{
				this.spawn(preset_name, rvr.AGENT_TYPE__ENEMY);
			}
			else
			{
				console.log('spawn fail');
			}

			//alert('stop');
		}
	}

	//alert('xvc');

	//console.log(this.agent_presets_alive);

	this.collision_check_point_count = 16;
	this.collision_check_points = new Array(this.collision_check_point_count);
	var angle_step = 360 / this.collision_check_point_count; 
	for (var i = 0; i < this.collision_check_point_count; i++)
	{
		this.collision_check_points[i] = [µ.angle_to_x(i * angle_step), µ.angle_to_y(i * angle_step)];
	}
}

rvr.Agents.prototype.think = function(time_delta)
{
	for (var i = 0; i < this.min_desired_alive_presets.length; i++)
	{
		var preset_name = this.min_desired_alive_presets[i][0];
		if (this.agent_presets_alive[preset_name] === undefined || this.agent_presets_alive[preset_name] < this.min_desired_alive_presets[i][1])
		{
			console.log('respawn specific', preset_name);
			this.spawn(preset_name, rvr.AGENT_TYPE__ENEMY);
		}
	}

	if (this.agents_alive < this.min_desired_alive_agents)
	{
		console.log('respawn general');
		var preset_index = µ.pick_randomly_from_weighted_list(this.spawn_list, function(item, index, data) {return item[1];}, null);
		if (preset_index != null)
		{
			this.spawn(this.spawn_list[preset_index][0], rvr.AGENT_TYPE__ENEMY);
		}
		else
		{
			console.log('respawn general FAIL');
		}
	}

	rvr.projectiles.agent_collision_check(time_delta);

	this.currently_selected_agent = -1;
	//this.agent_closest_to_mouse = -1;
	this.agent_closest_to_mouse_distance = 9999999999999;
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i])
		{
			var dist_from_mouse = µ.distance2D(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, rvr_agents__pos_x[i], rvr_agents__pos_y[i]);

			if ((rvr.input.KEY_I.pressed) && dist_from_mouse < 64.00 * rvr.camera_player.zoom_ && dist_from_mouse < this.agent_closest_to_mouse_distance)
			{
				this.agent_closest_to_mouse_distance = dist_from_mouse;
				this.agent_closest_to_mouse = i;
			}
			
			if (dist_from_mouse < this.agents[i].parameters.radius)
			{
				this.currently_selected_agent = i;
				//console.log(dist_from_mouse, this.agents[i].parameters.radius2);
			}
			this.agents[i].think(time_delta, i == 0);
			if (!this.agents[i].is_dying)
			{
				this.agents[i].drop_scent(time_delta);
			}
		}
	}
}

rvr.Agents.prototype.spawn_into_slot = function(slot_index, preset_name, type)
{
	this.agent_presets_alive[preset_name] = 1 + (this.agent_presets_alive[preset_name] ? this.agent_presets_alive[preset_name] : 0);
	this.agents_alive++;
	this.agents[slot_index].spawn(slot_index, preset_name, type);
	rvr_agents__is_active[slot_index] = 1;
	this.agents[slot_index].is_dying = false;
}

rvr.Agents.prototype.spawn = function(preset_name, type)
{
	var picked_slot = -1;
	for (var i = 0; i < this.agent_count; i++)
	{
		//console.log('checked', i, rvr_agents__is_active[i]);
		if (rvr_agents__is_active[i] === 0)
		{
			picked_slot = i;
			break;
		}
	}
	if (picked_slot == -1)
	{
		//console.log('checked2', i);
		for (var i = 0; i < this.agent_count; i++)
		{
			if (this.agents[i].is_dying == true)
			{
				picked_slot = i;
				break;
			}
		}
	}
	if (picked_slot > -1)
	{
		this.spawn_into_slot(picked_slot, preset_name, type)
		return picked_slot;
	}
	return false;
}

rvr.Agents.prototype.update_ground_height = function(time_delta, agent)
{
	var agent_index = agent.index;
	var agent_parameters = agent.parameters;
	var height = 0;

	for (var i = 0; i < this.collision_check_point_count; i++)
	{
		var ccp = this.collision_check_points[i];
		var height_ground = rvr.map.get_depthmap(rvr_agents__pos_x[agent_index] + ccp[0] * agent_parameters.radius, rvr_agents__pos_y[agent_index] + ccp[1] * agent_parameters.radius);
		height = Math.max(height, height_ground);

	}

// this is waaaay too expensive, do it like scents
/*
	height += rvr.map.get_fluid_at(rvr_agents__pos_x[agent_index], rvr_agents__pos_y[agent_index]);
//*/
	agent.ground_height = height;
}

rvr.Agents.prototype.check_move_viability = function(time_delta, agent, pos_x, pos_y, pos_z)
{
	var agent_state = agent.state;
	var agent_parameters = agent.parameters;
	for (var i = 0; i < this.collision_check_point_count; i++)
	{
		var ccp = this.collision_check_points[i];
		if (rvr.map.collision_check(
				pos_x + ccp[0] * agent_parameters.radius,
				pos_y + ccp[1] * agent_parameters.radius,
				pos_z + rvr.step_up_depth_threshold))
		{
			return false;
		}
	}
	return true;
}

rvr.bounce = function(time_delta, pos_x, pos_y, dir_x, dir_y, max_height, agent_index)
{
	if (rvr.map.collision_check(
			pos_x, pos_y,
			max_height))
	{
// slow down
/*
else if (height_diff > 0.0)
{
	var bleh = height_diff / .05;
	rvr_agents__speed_x[agent_index] /= 1.0 + bleh * bleh * 2;
	rvr_agents__speed_y[agent_index] /= 1.0 + bleh * bleh * 2;
}
*/

		if (rvr_agents__speed_x[agent_index] > 0 && dir_x > 0) { rvr_agents__speed_x[agent_index] *= - 0.5; }
		if (rvr_agents__speed_x[agent_index] < 0 && dir_x < 0) { rvr_agents__speed_x[agent_index] *= - 0.5; }

		if (rvr_agents__speed_y[agent_index] > 0 && dir_y > 0) { rvr_agents__speed_y[agent_index] *= - 0.5; }
		if (rvr_agents__speed_y[agent_index] < 0 && dir_y < 0) { rvr_agents__speed_y[agent_index] *= - 0.5; }

		rvr_agents__pos_x[agent_index] -= 0.00025 * time_delta * dir_x;
		rvr_agents__pos_y[agent_index] -= 0.00025 * time_delta * dir_y;

		//if (ccp[0] != 0) bounced_x = true; 
		//if (ccp[1] != 0) bounced_y = true; 
	}
}

rvr.Agents.prototype.get_agent_index_closest_to = function(pos_x, pos_y, pos_z, range, range_z, ignored_agent)
{
	var min_dist = 999999999999;
	var closest_agent_index = -1;
	for (var i = 0; i < this.agent_count; i++)
	{
		//console.log('checked', i, rvr_agents__is_active[i]);
		if (rvr_agents__is_active[i] === 1 && !this.agents[i].is_dying && ignored_agent !== this.agents[i])
		{
			var dist = µ.distance2D(pos_x, pos_y, rvr_agents__pos_x[i], rvr_agents__pos_y[i]);
			if (dist < range && dist < min_dist)
			{
				//console.log('? ', dist);	
				min_dist = dist;
				closest_agent_index = i;
			}
			else
			{
				//console.log('# ', dist);
			}
		}
	}
	return closest_agent_index;
}

rvr.Agents.prototype.collision_check = function(time_delta, agent)
{
	var agent_state = agent.state;
	var agent_index = agent.index;
	var agent_parameters = agent.parameters;

	var new_pos_x = rvr_agents__pos_x[agent_index] + time_delta * rvr_agents__speed_x[agent_index];
	var new_pos_y = rvr_agents__pos_y[agent_index] + time_delta * rvr_agents__speed_y[agent_index];

	var max_height = rvr_agents__pos_z[agent_index] + (agent.is_on_ground ? rvr.step_up_depth_threshold : 0.001);

	var bounced_x = false;
	var bounced_y = false;

	//for (var i = 0; i < this.collision_check_point_count; i++)
	for (var i = this.collision_check_point_count - 1; i >= 0 ; i--)
	{
		var ccp = this.collision_check_points[i];

		rvr.bounce(
			time_delta,
			new_pos_x + ccp[0] * agent_parameters.radius,
			new_pos_y + ccp[1] * agent_parameters.radius,
			ccp[0],
			ccp[1],
			max_height,
			agent_index
			);
	}
// for some reason (something like) this is necessary to keep agents from getting stick when moving diagonally into walls

		rvr.bounce(
			time_delta,
			new_pos_x + 0 * agent_parameters.radius * 1.05,
			new_pos_y + 1 * agent_parameters.radius * 1.05,
			0,
			1,
			max_height,
			agent_index
			);

		rvr.bounce(
			time_delta,
			new_pos_x +  0 * agent_parameters.radius * 1.05,
			new_pos_y + -1 * agent_parameters.radius * 1.05,
			0,
			-1,
			max_height,
			agent_index
			);

		rvr.bounce(
			time_delta,
			new_pos_x + 1 * agent_parameters.radius * 1.05,
			new_pos_y + 0 * agent_parameters.radius * 1.05,
			1,
			0,
			max_height,
			agent_index
			);

		rvr.bounce(
			time_delta,
			new_pos_x + -1 * agent_parameters.radius * 1.05,
			new_pos_y +  0 * agent_parameters.radius * 1.05,
			-1,
			0,
			max_height,
			agent_index
			);

}


rvr.Agents.prototype.draw2 = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			this.agents[i].draw2();
		}
	}
}


rvr.Agents.prototype.draw3 = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			this.agents[i].draw3();
		}
	}
}

rvr.Agents.prototype.draw_shields = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			var agent = this.agents[i];
			if (agent.shield > 0)
			{
				var damage_frac = (rvr.now - agent.last_damage < 200) ? (1 - (rvr.now - agent.last_damage) / 200) : 0;

				var lum = 0.5 + 0.05 * Math.sin((rvr.now + agent.index * 11211) / 122);


				var hue = 220 + 30 * Math.sin((rvr.now + agent.index * 123211) / 337);
				var one_minus_shield = 1 - agent.shield;
				rvr.c.rectangle_textured.draw(
					rvr.CAM_PLAYER, rvr.tex_circle_shield,
					rvr_agents__pos_x[i],
					rvr_agents__pos_y[i],
					agent.parameters.radius2 * (1.0 + 0.4 * (1 - one_minus_shield * one_minus_shield)),
					agent.parameters.radius2 * (1.0 + 0.4 * (1 - one_minus_shield * one_minus_shield)),
					90,
					hue, 1, lum + damage_frac, 0.8 * (1 - one_minus_shield * one_minus_shield * one_minus_shield),
					-1,-1,-1,-1,
					-1,-1,-1,-1,
					-1,-1,-1,-1);
			}
		}
	}
}

rvr.Agents.prototype.draw = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			this.agents[i].draw();
		}
	}
}

rvr.Agents.prototype.draw_shadows = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		var a = this.agents[i];
		if (rvr_agents__is_active[i] === 1)
		{
			a.draw_shadow();
		}
	}
}

rvr.Agents.prototype.draw_debug = function()
{
	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			this.agents[i].draw_debug();
		}
	}

	if (this.agent_closest_to_mouse > -1)
	{
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
			rvr.camera_player.mouse_pos_x,
			rvr.camera_player.mouse_pos_y,
			rvr_agents__pos_x[this.agent_closest_to_mouse],
			rvr_agents__pos_y[this.agent_closest_to_mouse],
			0.01 * rvr.camera_player.zoom_,
			234, 1, 0.5,
			0.25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
	}

	if (!rvr.debug__draw_cursor_line)
	{
		return;
	}

// maybe use that for the alternative movement mode
/*

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0],
		rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing) * 1.0,
		rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing) * 1.0,
		0.005 * rvr.camera_player.zoom_,
		0, 0, 0.5,
		0.2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0],
		rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing + 90) * 1.0,
		rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing + 90) * 1.0,
		0.005 * rvr.camera_player.zoom_,
		0, 0, 0.5,
		0.2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0],
		rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing - 90) * 1.0,
		rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing - 90) * 1.0,
		0.005 * rvr.camera_player.zoom_,
		0, 0, 0.5,
		0.2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0],
		rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing + 180) * 1.0,
		rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing + 180) * 1.0,
		0.005 * rvr.camera_player.zoom_,
		0, 0, 0.5,
		0.2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
*/
/*

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0],
		0.005 * rvr.camera_player.zoom_,
		52, 1, 0.95, 0.05,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
*/
	var mouse_depth = rvr.map.get_depthmap(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y);


	rvr.map.trace_pixels_end_point(
		rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, mouse_depth,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr_agents__pos_z[0] + rvr.player_agent.parameters.sight_height,
		rvr.testing__map_trace_resolution, rvr.temp_vector, -1);

	var hue = 		rvr.map.trace_pixels(
		rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, mouse_depth,
		rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr_agents__pos_z[0] + rvr.player_agent.parameters.sight_height,
		rvr.testing__map_trace_resolution, -1) ? 120 : 0;

	rvr.c.rectangle.draw(rvr.CAM_PLAYER, rvr.temp_vector[0], rvr.temp_vector[1], 0.125, 0.125, ((rvr.now % 1000) / 1000) * 360,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3);

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER, rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, rvr.temp_vector[0], rvr.temp_vector[1],
		0.01 * rvr.camera_player.zoom_,
		hue, 1, 0.5,
		0.25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);



	rvr.map.trace_pixels_end_point(
		rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr_agents__pos_z[0] + rvr.player_agent.parameters.sight_height,
		rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, mouse_depth,
		rvr.testing__map_trace_resolution, rvr.temp_vector, -1);

	var hue = 		rvr.map.trace_pixels(
		rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr_agents__pos_z[0] + rvr.player_agent.parameters.sight_height,
		rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, mouse_depth,
		rvr.testing__map_trace_resolution, -1) ? 120 : 0;

	rvr.c.rectangle.draw(rvr.CAM_PLAYER, rvr.temp_vector[0], rvr.temp_vector[1], 0.125, 0.125, ((rvr.now % 1000) / 1000) * 360,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3,
		hue, 1, 0.5, 0.3);

	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER, rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr.temp_vector[0], rvr.temp_vector[1],
		0.01 * rvr.camera_player.zoom_,
		hue, 1, 0.5,
		0.25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

}


rvr.Agents.prototype.draw_lights = function()
{
//*



	rvr.lights.add(
		rvr.camera_player.mouse_pos_x * rvr.map.one_over_size_x,
		rvr.camera_player.mouse_pos_y * rvr.map.one_over_size_y,
		rvr.map.get_depthmap(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y) + 0.01,
		0.25 * rvr.map.one_over_size_x,
		0.25 * rvr.map.one_over_size_x,
		0.2,
		1.0, 1.0, 1.0, 0.95,
		0,
		180
		);
//*/

	for (var i = 0; i < this.agent_count; i++)
	{
		if (rvr_agents__is_active[i] === 1)
		{
			this.agents[i].draw_lights(null, i == 0);
		}
	}
}

rvr.Agents.prototype._ = function()
{
	
}