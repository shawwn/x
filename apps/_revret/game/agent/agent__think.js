rvr.Agent.prototype.think = function(time_delta)
{
	var is_player = this.type == rvr.AGENT_TYPE__PLAYER;
	var is_player_drone = this.type == rvr.AGENT_TYPE__PLAYER_DRONE;
	var this_index = this.index;
	var this_state = this.state;
	var this_parameters = this.parameters;

	for (var i = 0; i < this.weapons.length; i++)
	{
		this.weapons[i].think(time_delta);
	}

	this.old_scent_pos_x = this.scent_pos_x;
	this.old_scent_pos_y = this.scent_pos_y;

	this.scent_pos_x = µ.between(0, Math.floor((		rvr_agents__pos_x[this_index] * rvr.map.size_x_over_one) * rvr.scent_map_size), rvr.scent_map_size - 1);
	this.scent_pos_y = µ.between(0, Math.floor((1.0 - 	rvr_agents__pos_y[this_index] * rvr.map.size_y_over_one) * rvr.scent_map_size), rvr.scent_map_size - 1);

	//if (!is_player_drone && rvr.enemy_deactivation_distance < µ.distance2D_manhattan(rvr_agents__pos_x[this_index], rvr_agents__pos_y[this_index], rvr_agents__pos_x[0], rvr_agents__pos_y[0]))
	{
		//return;
	}

	this.oh_look_they_are_ijamming(time_delta);
	this.check_out_some_agents();
	this.update_agent_memories();

	if (this.is_dodging_since > 0)
	{
		this.is_dodging_since += time_delta;
	}
	if (this.is_dodging_since > rvr.dodge_duration)
	{
		this.is_dodging_since = 0;
	}
	if (this.is_dodging_since > 0)
	{
		//rvr_agents__speed_x[this_index] *= 1.49999;
		//rvr_agents__speed_y[this_index] *= 1.49999;
	}
	else
	{
		rvr_agents__speed_x[this_index] *= Math.pow(this_parameters.friction, time_delta);
		rvr_agents__speed_y[this_index] *= Math.pow(this_parameters.friction, time_delta);
	}

	// burning?

	/*
		burn_threshold_start					: 5.0,			// how much
		burn_threshold_stop						: 0.0,
		burn_damage								: 1.5,			// receive this much fire damage for every point of burn per second
		burn_receive							: 1.5,			// receive this much burn for every point of burn damage
		burn_wear_off							: 0.2,			// lose this much burn every second
*/	
	if (!this.is_burning) {

		if (this.burning >= this.parameters.burn_threshold_start)
		{
			this.is_burning = true;
		}
	}

	if (this.is_burning)
	{
		if (this.burning <= this.parameters.burn_threshold_stop)
		{
			this.is_burning = false;
		}
		else
		{
			this.receive_damage(0, 0, this.parameters.burn_damage * this.burning * time_delta)

			rvr.particlesGPU.spawn(
				rvr.now,
				2 * this.burning,
				rvr_agents__pos_x[this.index],
				rvr_agents__pos_y[this.index],
				rvr_agents__pos_x[this.index],
				rvr_agents__pos_y[this.index],
				0.7,
				0,
				0,
				0, 0.0,
				rvr.particles__firepuff,
				400,		//	lifespan
				0, 1, 1, 0.3,
				360,		//	vary_angle
				0.5 + 0.25 * this.burning,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.25,			//	vary_size
				0.25,		//	vary_vel_x
				0.25,		//	vary_vel_y
				50,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				5			//	vary_birthdate
			);
		}
	}

	this.burning -= this.parameters.burn_wear_off * time_delta
	if (this.burning < 0)
	{
		this.burning = 0;
	}

	if (!this.is_dying)
	{
		this.relate_to_others(time_delta);
	}

	if (is_player && !rvr.input.KEY_ALT_RIGHT.pressed)
	{
		var angle_mouse = µ.vector2D_to_angle(rvr.camera_player.mouse_pos_x - rvr_agents__pos_x[this_index], rvr.camera_player.mouse_pos_y - rvr_agents__pos_y[this_index]);
		var angle_to_turn = µ.turn(this_state.facing, angle_mouse);
		this_state.facing = (this_state.facing + (angle_to_turn / 50) * time_delta) % 360;
		var angle_to_turn = µ.turn(this.aim_angle, angle_mouse);
		this.aim_angle = (this.aim_angle + (angle_to_turn / 50) * time_delta) % 360;

	}

	rvr.agents.update_ground_height(time_delta, this);
	
	// start falling if above ground
	if (this.is_on_ground && rvr_agents__pos_z[this_index] > this.ground_height)
	{
		this.is_on_ground = false;
	}
	// apply gravity
	if (!this.is_on_ground)
	{
		rvr_agents__speed_z[this_index] -= 0.0000055 * time_delta;
	}

	rvr.agents.collision_check(time_delta, this);

	//rvr_agents__speed_y[this_index] -= 0.000005 * time_delta;


	rvr_agents__pos_x[this_index] += time_delta * rvr_agents__speed_x[this_index];
	rvr_agents__pos_y[this_index] += time_delta * rvr_agents__speed_y[this_index];
	rvr_agents__pos_z[this_index] += time_delta * rvr_agents__speed_z[this_index];

	var inertia = 0.99;

	if (rvr_agents__pos_z[this_index] <= this.ground_height)
	{
		rvr_agents__pos_z[this_index] = rvr_agents__pos_z[this_index] * inertia + this.ground_height * (1 - inertia);
		if (rvr_agents__speed_z[this_index] < 0.0)
		{
			rvr_agents__speed_z[this_index] = 0.0;
		}
		this.is_on_ground = true;
	}



	if (is_player)
	{
		//rvr_agents__pos_z[this_index] = 1.0;
	}

/*
	this_state.movement_angle = µ.vector2D_to_angle(rvr_agents__speed_x[this_index], rvr_agents__speed_y[this_index]);
	if (!is_player)
	{
		var angle_to_turn = µ.turn(this_state.facing, this_state.movement_angle);
		this_state.facing += (angle_to_turn / 200) * time_delta;
	}
*/
	
	if (rvr_agents__pos_x[this_index] - this_parameters.radius < 0) rvr_agents__pos_x[this_index] = this_parameters.radius;
	if (rvr_agents__pos_y[this_index] - this_parameters.radius < 0) rvr_agents__pos_y[this_index] = this_parameters.radius;
	if (rvr_agents__pos_x[this_index] + this_parameters.radius > rvr.world_size_x) rvr_agents__pos_x[this_index] = rvr.world_size_x - this_parameters.radius;
	if (rvr_agents__pos_y[this_index] + this_parameters.radius > rvr.world_size_y) rvr_agents__pos_y[this_index] = rvr.world_size_y - this_parameters.radius;

	this_state.stamina += this_parameters.stamina_recharge * time_delta;

	if (this_state.stamina > 1)
		this_state.stamina = 1;
}