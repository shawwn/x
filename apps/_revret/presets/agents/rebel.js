rvr.presets.agents.rebel =
{
	controller							: 'survivor',
	inherits_from						:
	[
	],
	parameters:
	{
		faction_id						: rvr.FACTION__REBELS,

		move_acceleration				: 0.000006,
		move_deceleration				: 0.00005,

		radius							: 0.475,
		radius2							: 0.95,

	},

	weapons								:
	[
		['drone_fireballs_spread'],
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
			110, 0.45 * sat_factor, -0.45 - damage_frac * 0.75, 1,
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
			//120 - 120 * here.state.alarm_level,
			52,
			(0.9 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			- (here.can_see_prey ? 1.0 : 2.0) + Math.sin(rvr.now / 1777) * 0.25
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
			//120 - 120 * here.state.alarm_level,
			52,
			(0.9 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			- (here.can_see_prey ? 1.0 : 2.0) + Math.sin(rvr.now / 777) * 0.25
				 - damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},
};