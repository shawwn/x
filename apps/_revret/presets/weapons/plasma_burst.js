rvr.presets.weapons.plasma_burst =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	10,
		shot_interval		:	10,
		shot_cooldown		:	10,
		reload_warmup		:	0,
		reload_interval		:	2000,
		reload_cooldown		:	0,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
		ammo_per_clip		:	0,
		shots_per_clip		:	15,

		burst_duration_min	:	-1,
		burst_duration_max	:	-1,
		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,

		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,
	},
	fire: function(self, agent)
	{
		var agent_index = agent.index;

		rvr.scents.make_sound(rvr_agents__pos_x[agent_index], rvr_agents__pos_y[agent_index], .1);

		var bullet_count = 2 + 3 * (self.shots_in_clip % 15);
		for (var i = 0; i < bullet_count; i++)
		{
			var offset = -180 + 360 * (i / bullet_count);
			rvr.projectiles.spawn(
				rvr.presets.projectiles.plasma,
				rvr_agents__pos_x[agent_index] + µ.angle_to_x(agent.state.facing + offset) * agent.parameters.radius,
				rvr_agents__pos_y[agent_index] + µ.angle_to_y(agent.state.facing + offset) * agent.parameters.radius,
				rvr_agents__pos_z[agent_index] + 0.18,
				0.95,
				1.0,
				0,
				0,
				0,
				0,
				100 + µ.rand_int(50) + (self.shots_in_clip % 15) * 30,
				agent.state.facing + offset,
				rvr.FACTION__PLAYER,
				agent,
				null,
				-1,
				-1,
				0.1);
		}
	}
};