rvr.presets.agents.drone_scout_armoured =
{
	controller							: 'enemy',
	inherits_from						:
	[
		'drone',
	],
	drop_list							: 'default',
	parameters:
	{
		move_acceleration				: 0.000002,
		move_deceleration				: 0.000001,

		radius							: 0.5,
		radius2							: 1.0,
		weight							: 8.0,
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
			0, 0.5 * sat_factor, 0.5 + damage_frac * 1.5, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		var hue = here.hue_shift;

		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_orb_light,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			0,
			//120 - 120 * here.state.alarm_level,
			hue,
			(0.9 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			1.25 + Math.sin(rvr.now / 777) * 0.25
				 + damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);


		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone_armour,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2 * 1,
			here.parameters.radius2 * 1,
			here.state.facing,
			0, 1, 1 + damage_frac, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);


	},
};