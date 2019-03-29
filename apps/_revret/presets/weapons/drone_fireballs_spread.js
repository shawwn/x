rvr.presets.weapons.drone_fireballs_spread =
{
	data:
	{
	},
	parameters:
	{
		shot_warmup			:	0,
		shot_interval		:	20,
		shot_cooldown		:	0,
		reload_warmup		:	50,
		reload_interval		:	300,
		reload_cooldown		:	50,
		ammo_type			: 	rvr.AMMOTYPE_PLASMA,
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
		//speechSynthesis.speak(rvr.voice__pew);
		var agent_index = agent.index;
		//rvr.scents.make_sound(rvr_agents__pos_x[agent_index], rvr_agents__pos_y[agent_index], .1);
		var spread = 33;
		var spread2 = 23;
		var bullets = 5;
		for (var i = 0; i < bullets; i++)
		{
			var frac	= -0.5 + (i + 1) / (bullets + 1);
			var offset	= spread * frac;

			var frac2	= 1.0 - Math.abs(frac) * 2.0;
			rvr.player_agent.state.last_shot = rvr.now;
			//rvr.scents.make_sound(rvr_agents__pos_x[0], rvr_agents__pos_y[0], 1);
			var angle = agent.aim_angle +  offset - spread2 * 0.5 + spread2 * ((self.shots_in_clip + 0) % 5) / 4;

			rvr.projectiles.spawn(
				rvr.presets.projectiles.fireball,
				rvr_agents__pos_x[agent_index] + µ.angle_to_x(angle) * agent.parameters.radius,
				rvr_agents__pos_y[agent_index] + µ.angle_to_y(angle) * agent.parameters.radius,
				rvr_agents__pos_z[agent_index] + 0.18,
				1.0 + 0.5 * frac2,
				0.995,
				0.000025,
				0,
				0,
				0,
				3000,
				angle,
				agent.faction_id,
				agent,
				null,
				-1,
				-1,
				0.15);
		}
	}
};