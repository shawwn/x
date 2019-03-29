rvr.presets.agents.survivor =
{
	controller							: 'survivor',
	inherits_from						:
	[
	],
	parameters:
	{
		faction_id						: rvr.FACTION__SURVIVORS,

		move_acceleration				: 0.000021,
		move_deceleration				: 0.00005,

		radius							: 0.475,
		radius2							: 0.95,

	},

	parameter_ranges_related:
	{
		radius							: [0.35, 0.45],
		radius2							: [0.7, 0.9],
		keep_distance_to_anyone_min		: [0.2, 0.5],
	},

	weapons								:
	[
		['plasma_pistol'],
	],

	draw_function 						: function(here)
	{
		here_index = here.index;

		var sat_factor = this.is_dying ? 0.0 : 1.0;
		

		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.aim_angle,
			130, 0.95 * sat_factor, -0.75 - damage_frac * 1.5, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone_light_back,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.aim_angle,
			72,
			1.0 * sat_factor,
			- 0.7 + Math.sin(rvr.now / 277) * 0.125
				 - damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone_light,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.aim_angle,
			72,
			1.0 * sat_factor,
			- 0.7 + Math.sin(rvr.now / 277) * 0.125
				 - damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},
};