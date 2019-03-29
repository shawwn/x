rvr.presets.agents.drone_coward =
{
	controller							: 'enemy',
	inherits_from						:
	[
		'drone'
	],
	drop_list							: 'default',
	parameters:
	{
		faction_id						: rvr.FACTION__DRONES,

		move_acceleration				: 0.0000125,
		move_deceleration				: 0.00005,

		radius							: 0.3,
		radius2							: 0.6,
		weight							: 2.0,

		keep_distance_to_attacked_min	: 3.0,
		keep_distance_to_attacked_max	: 9999.0,
		keep_distance_to_attacker_min	: 10.0,
		keep_distance_to_attacker_max	: 12.0,

	},
	draw_function 						: function(here)
	{
		var here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;

		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_orb_bg,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			0, 0.5 * sat_factor, 4.5 - damage_frac * 4.125, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		var hue = 120;

		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_orb_light,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2 * 1.35,
			here.parameters.radius2 * 1.35,
			90,
			//120 - 120 * here.state.alarm_level,
			hue,
			1.0 * sat_factor,
			- 0.75 + Math.sin(rvr.now / 277) * 0.25
				 - damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

	},
};





