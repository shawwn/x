"use strict";

rvr.Agent.prototype.draw2 = function()
{
	if (this.draw_function2)
	{
		this.draw_function2(this);
	}
}
rvr.Agent.prototype.draw3 = function()
{
	if (this.draw_function3)
	{
		this.draw_function3(this);
	}
	if (this.dying)
	{
		return;
	}

	var this_index = this.index;

	if (!rvr.debug__draw_agent_directions)
	{
		return;
	}

	// last chosen scent direction
	rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
		rvr_agents__pos_x[this_index],
		rvr_agents__pos_y[this_index],
		rvr_agents__pos_x[this_index] + this.last_chosen_scent_direction_x * this.parameters.radius2,
		rvr_agents__pos_y[this_index] - this.last_chosen_scent_direction_y * this.parameters.radius2,
		0.05,
		0, 0, 0,
		0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	if (this.favourite_move_direction > -1)
	{
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			rvr_agents__pos_x[this_index] + µ.angle_to_x(this.favourite_move_direction) * this.parameters.radius2 * 1.5,
			rvr_agents__pos_y[this_index] + µ.angle_to_y(this.favourite_move_direction) * this.parameters.radius2 * 1.5,
			0.15,
			180, 1, 0.5,
			0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
	}

		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			rvr_agents__pos_x[this_index] + µ.angle_to_x(this.aim_angle) * this.parameters.radius2 * 2,
			rvr_agents__pos_y[this_index] + µ.angle_to_y(this.aim_angle) * this.parameters.radius2 * 2,
			0.05,
			30, 1, 0.5,
			0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	if (this.favourite_aim_direction > -1)
	{
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			rvr_agents__pos_x[this_index] + µ.angle_to_x(this.favourite_aim_direction) * this.parameters.radius2 * 2,
			rvr_agents__pos_y[this_index] + µ.angle_to_y(this.favourite_aim_direction) * this.parameters.radius2 * 2,
			0.05,
			10, 1, 0.5,
			0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
	}

}

rvr.Agent.prototype.draw = function()
{
	this.draw_function(this);
}


rvr.Agent.prototype.draw_shadow = function()
{
	var this_index = this.index;
	var air = rvr_agents__pos_z[this_index] - this.ground_height;
	//var air = rvr_agents__pos_z[this_index];

	rvr.c.rectangle_textured.draw(
		rvr.CAM_PLAYER, rvr.tex_circle,
		rvr_agents__pos_x[this_index] + air * this.parameters.radius * 1.75,
		rvr_agents__pos_y[this_index] - air * this.parameters.radius * 1.75,
		this.parameters.radius2 * (1 + air * .125),
		this.parameters.radius2 * (1 + air * .125),
		90,
		0, 0, 0, 0.4,
		-1,-1,-1,-1,
		-1,-1,-1,-1,
		-1,-1,-1,-1);
}

rvr.Agent.prototype.draw_debug = function()
{
	var this_state = this.state;
	var this_index = this.index;
	var damage_frac = (rvr.now - this.last_damage < 500) ? (1 - (rvr.now - this.last_damage) / 500) : 0;
	var sat = this.is_dying ? 0 : 1;

	if (this.agent_closest_to_mouse != -1 && this.agent_closest_to_mouse != this_index)
//	if (rvr.agents.currently_selected_agent != -1 && rvr.agents.currently_selected_agent != this_index)
	{
		//return;
	}


	var weapon = this.weapons[this.selected_weapon];

	var frac = 0;
	var hue = 0;

	if (weapon.state == rvr.WEAPONSTATE_WARMUP)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.shot_warmup)
		var hue = 0;
	}
	else if (weapon.state == rvr.WEAPONSTATE_INTERVAL)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.shot_interval)
		var hue = 30;
	}
	else if (weapon.state == rvr.WEAPONSTATE_COOLDOWN)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.shot_cooldown)
		var hue = 60;
	}
	else if (weapon.state == rvr.WEAPONSTATE_RELOAD_WARMUP)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.reload_warmup)
		var hue = 220;
	}
	else if (weapon.state == rvr.WEAPONSTATE_RELOAD_INTERVAL)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.reload_interval)
		var hue = 260;
	}
	else if (weapon.state == rvr.WEAPONSTATE_RELOAD_COOLDOWN)
	{
		var frac = ((rvr.now - weapon.state_since) / weapon.parameters.reload_cooldown)
		var hue = 300;
	}

	if (frac > 0)
	{
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_circle_outline,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			this.parameters.radius2 + frac,
			this.parameters.radius2,
			90,
			hue, 1, 1, 0.8,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	}



	if (rvr.agents.currently_selected_agent == this_index)
	{
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_circle_soft_reverse,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			this.parameters.sight_range * 2,
			this.parameters.sight_range * 2,
			90,
			0, 0, 1.0, 0.25,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	}
	if (!this.is_dying)
	{
		for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
		{
			var thickness = 0.5;
			if (i == rvr.AGENT_MEMORY_TYPE__ATTACKED)
			{
				var hue = 0;
			}
			if (i == rvr.AGENT_MEMORY_TYPE__SUPPORTED)
			{
				var hue = 120;
			}
			if (i == rvr.AGENT_MEMORY_TYPE__FEARED)
			{
				var hue = 220;
			}
			if (i == rvr.AGENT_MEMORY_TYPE__ATTACKING)
			{
				var hue = 0;
				thickness = 0.25;
			}
			if (i == rvr.AGENT_MEMORY_TYPE__SUPPORTING)
			{
				var hue = 120;
				thickness = 0.25;
			}
			if (i == rvr.AGENT_MEMORY_TYPE__FEARING)
			{
				var hue = 220;
				thickness = 0.15;
			}

			for (var j = 0; j < this.agent_memories[i].slot_count; j++)
			{
				var slot = this.agent_memories[i].slots[j];
				if (slot.agent_index > -1 && rvr_agents__is_active[slot.agent_index] && !slot.agent.is_dying)
				{
					var dist = µ.distance2D(rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index], slot.last_seen_pos_x, slot.last_seen_pos_y);
					if (this.parameters.sight_range >= dist)
					{
						rvr.map.trace_pixels_end_point(
							rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index], rvr_agents__pos_z[this_index] + this.parameters.sight_height,
							//rvr_agents__pos_x[slot.agent_index], rvr_agents__pos_y[slot.agent_index], rvr_agents__pos_z[slot.agent_index] + slot.agent.parameters.radius,
							slot.last_seen_pos_x, slot.last_seen_pos_y, slot.last_seen_pos_z + slot.agent.parameters.radius,
							rvr.testing__map_trace_resolution, rvr.temp_vector, dist);
						//var lum = 0.35 + 0.25 * Math.sin((rvr.now + this.index * 111) / 242);
						var lum = 0.5;
						rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
							rvr_agents__pos_x[this_index] + i / 150,
							rvr_agents__pos_y[this_index] + i / 150,
							rvr.temp_vector[0] - i / 150,
							rvr.temp_vector[1] - i / 150,
							Math.max(this.parameters.radius2 * 0.015, 0.03 * rvr.camera_player.zoom_) * thickness,
							hue, sat, lum, 0.75,
							hue, sat, lum, 0.75,
							-1, 0, 0, 0.25,
							-1, 0, 0, 0.25
							);
					}
				}
			}
		}
		rvr.c.rectangle.draw(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index] - this.parameters.radius + this.parameters.radius2 * this.state.health / 2,
			rvr_agents__pos_y[this_index] + this.parameters.radius,
			this.parameters.radius2 * this.state.health,
			this.parameters.radius2 / 5,
			90,
			60, 1, 0.5, 0.5,
			60, 1, 0.5, 0.5,
			60, 1, 0.5, 0.1,
			60, 1, 0.5, 0.1);
		rvr.c.rectangle.draw(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index] - this.parameters.radius + this.parameters.radius2 / 2,
			rvr_agents__pos_y[this_index] - this.parameters.radius,
			this.parameters.radius2,
			this.parameters.radius2 / 5,
			90,
			0, 0, 0.0, 0.25,
			0, 0, 0.0, 0.25,
			0, 0, 0.0, 0.25,
			0, 0, 0.0, 0.25);
		rvr.c.rectangle.draw(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index] - this.parameters.radius + this.parameters.radius2 * this.state.stamina / 2,
			rvr_agents__pos_y[this_index] - this.parameters.radius,
			this.parameters.radius2 * this.state.stamina,
			this.parameters.radius2 / 5,
			90,
			210, 1, 0.25 + this.state.stamina / 2, 0.5,
			210, 1, 0.25 + this.state.stamina / 2, 0.5,
			210, 1, 0.25 + this.state.stamina / 2, 0.1,
			210, 1, 0.25 + this.state.stamina / 2, 0.1);

		// circle
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_circle_thick_outline,
			rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index],
			Math.max(this.parameters.radius2, 0.05 * rvr.camera_player.zoom_),
			Math.max(this.parameters.radius2, 0.05 * rvr.camera_player.zoom_),
			90,
			
			this.faction.color_h,
			this.faction.color_s,
			this.faction.color_l,

			0.95,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		// last chosen scent direction
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER,
			rvr_agents__pos_x[this_index],
			rvr_agents__pos_y[this_index],
			rvr_agents__pos_x[this_index] + this.last_chosen_scent_direction_x * this.parameters.radius2,
			rvr_agents__pos_y[this_index] + this.last_chosen_scent_direction_y * this.parameters.radius2,
			0.05,
			0, 0, 0,
			0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	}

}