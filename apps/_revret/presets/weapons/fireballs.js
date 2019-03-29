rvr.presets.weapons.fireballs =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	150,
		shot_interval		:	750,
		shot_cooldown		:	50,
		reload_warmup		:	50,
		reload_interval		:	500,
		reload_cooldown		:	50,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
		ammo_per_clip		:	0,
		shots_per_clip		:	11100,

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

		var offset = -.5 + µ.rand(1);

		rvr.projectiles.spawn(
			rvr.presets.projectiles.fireball,
			rvr_agents__pos_x[agent_index] + µ.angle_to_x(agent.aim_angle) * agent.parameters.radius,
			rvr_agents__pos_y[agent_index] + µ.angle_to_y(agent.aim_angle) * agent.parameters.radius,
			rvr_agents__pos_z[agent_index] + 0.18,
			0.875,
			1.0,
			0,
			0,
			0,
			0,
			5000,
			agent.aim_angle + offset,
			agent.faction_id,
			agent,
			null,
			-1,
			-1,
			0.1);

	}
};