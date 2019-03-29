rvr.presets.weapons.flamethrower =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	5,
		shot_interval		:	5,
		shot_cooldown		:	5,
		reload_warmup		:	75,
		reload_interval		:	50,
		reload_cooldown		:	75,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
		ammo_per_clip		:	0,
		shots_per_clip		:	126,

		burst_duration_min	:	-1,
		burst_duration_max	:	-1,
		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,

		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,
	},
	fire: function(self, agent)
	{
		//speechSynthesis.speak(rvr.voice__pew);

		var agent_index = agent.index;
		//rvr.scents.make_sound(rvr_agents__pos_x[agent_index], rvr_agents__pos_y[agent_index], .1);


/*
				type,
				pos_x,
				pos_y,
				pos_z,
				speed_factor,
				friction,
				acceleration,
				homing_acceleration,
				turn_speed,
				turn_acceleration,
				lifespan,
				angle,
				faction_id,
				source_agent,
				target_agent,
				target_pos_x,
				target_pos_y,
				damage
*/
		for (var i = 0; i < 5; i++)
		{
			var offset = -2 + µ.rand(4);
			var speed_factor = µ.rand(1);
			rvr.projectiles.spawn(
				rvr.presets.projectiles.firepuff,
				rvr_agents__pos_x[agent_index] + µ.angle_to_x(agent.aim_angle) * agent.parameters.radius,
				rvr_agents__pos_y[agent_index] + µ.angle_to_y(agent.aim_angle) * agent.parameters.radius,
				rvr_agents__pos_z[agent_index] + 0.18,
				3.5 + 0.25 * speed_factor,
				0.998 - 0.0005 * speed_factor,
				0,
				0,
				0,
				0,
				900 + 200 * speed_factor + µ.rand_int(50),
				agent.aim_angle + offset,
				agent.faction_id,
				agent,
				null,
				-1,
				-1,
				0.2);
		}


	}
};