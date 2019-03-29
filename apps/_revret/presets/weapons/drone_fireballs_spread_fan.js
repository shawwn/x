rvr.presets.weapons.drone_fireballs_spread_fan =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	0,
		shot_interval		:	15,
		shot_cooldown		:	0,
		reload_warmup		:	50,
		reload_interval		:	1500,
		reload_cooldown		:	50,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
		ammo_per_clip		:	0,
		shots_per_clip		:	7,

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
		var spread = 0;
		var spread2 = 0;
		var bullets = 5;
		var offset1	 = 0;
		var sfrac = ((self.shots_in_clip + 0) % 7) / 6;
		for (var i = 0; i < bullets; i++)
		{
			var bfrac = i / bullets;
			var offset	 = -spread * 0.5 + spread * (i + 1) / (bullets + 1);
			rvr.player_agent.state.last_shot = rvr.now;
			//rvr.scents.make_sound(rvr_agents__pos_x[0], rvr_agents__pos_y[0], 1);
			var angle = agent.aim_angle + offset1 + offset - spread2 * 0.5 + spread2 * sfrac;

			rvr.projectiles.spawn(
				rvr.presets.projectiles.fireball,
				rvr_agents__pos_x[agent_index] + µ.angle_to_x(angle) * agent.parameters.radius,
				rvr_agents__pos_y[agent_index] + µ.angle_to_y(angle) * agent.parameters.radius,
				rvr_agents__pos_z[agent_index] + 0.18,
				1.0,
				0.7 + 0.15 * bfrac,
				0.0005,
				0,
				- 0.2 + bfrac * 0.1 + sfrac * 0.3,
				0,
				1490 + bfrac * 40 + sfrac * 90 + µ.rand_int(50),
				angle,
				agent.faction_id,
				agent,
				null,
				-1,
				-1,
				0.05);
		}
	}
};