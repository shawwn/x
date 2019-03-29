rvr.presets.weapons.drone_fireballs_360 =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	0,
		shot_interval		:	435,
		shot_cooldown		:	0,
		reload_warmup		:	50,
		reload_interval		:	17500,
		reload_cooldown		:	50,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
		ammo_per_clip		:	0,
		shots_per_clip		:	3,

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
		var spread = 360;
		var bullets = 8 - 2 * (self.shots_in_clip % 3);
		var offset1	 = 0; //-5 + µ.rand(10);
		for (var i = 0; i < bullets; i++)
		{
			var offset	 = -spread * 0.5 + spread * i / (bullets);
			rvr.player_agent.state.last_shot = rvr.now;
			//rvr.scents.make_sound(rvr_agents__pos_x[0], rvr_agents__pos_y[0], 1);
			var angle = agent.aim_angle + offset1 + offset + 30 * (self.shots_in_clip % 3);
			//var angle = 50 * (self.shots_in_clip % 4);
			rvr.projectiles.spawn(
				rvr.presets.projectiles.fireball,
				rvr_agents__pos_x[agent_index] + µ.angle_to_x(angle) * agent.parameters.radius,
				rvr_agents__pos_y[agent_index] + µ.angle_to_y(angle) * agent.parameters.radius,
				rvr_agents__pos_z[agent_index] + 0.18,
				0.0,
				0.8 + 0.02 * (self.shots_in_clip % 3),
				0.0004 + 0.00021 * (self.shots_in_clip % 3),
				0,
				0.0 + 0.05 * (self.shots_in_clip % 3),
				0,
				1490 * 1.55 + µ.rand_int(80) + 200 * (self.shots_in_clip % 3),
				angle,
				agent.faction_id,
				agent,
				null,
				-1,
				-1,
				0.25);
		}
	}
};