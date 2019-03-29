rvr.presets.weapons.plasma_grenade =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	50,
		shot_interval		:	1000,
		shot_cooldown		:	50,
		reload_warmup		:	50,
		reload_interval		:	3000,
		reload_cooldown		:	50,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA_GRENADE,
		ammo_per_clip		:	0,
		shots_per_clip		:	5,

		burst_duration_min	:	-1,
		burst_duration_max	:	-1,
		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,

		burst_cooldown_min	:	-1,
		burst_cooldown_max	:	-1,
	},
	fire: function(self, agent)
	{
		//var rand = µ.rand(1);
		//var offset = -10 + 20 * rand;
		var agent_index = agent.index;
		var offset = 0;
		rvr.projectiles.spawn(
			rvr.presets.projectiles.plasma_nade_stage1,
			rvr_agents__pos_x[agent_index] + µ.angle_to_x(agent.state.facing + offset) * agent.parameters.radius,
			rvr_agents__pos_y[agent_index] + µ.angle_to_y(agent.state.facing + offset) * agent.parameters.radius,
			rvr_agents__pos_z[agent_index] + 0.18,
			0.75,
			0.999,
			0,
			0,
			0,
			0,
			1500,
			agent.state.facing + offset,
			agent.parameters.faction_id,
			agent,
			null,
			-1,
			-1,
			0);

	}
};