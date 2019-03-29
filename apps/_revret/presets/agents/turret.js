rvr.presets.agents.turret =
{
	controller							: 'turret',
	inherits_from						:
	[
	],
	drop_list							: 'default',
	parameters:
	{
		faction_id						: rvr.FACTION__BANDITS,

		move_acceleration				: 0.00000,
		move_deceleration				: 0.0000,

		radius							: 0.45,
		radius2							: 0.9,

	},

	weapons								:
	[
		['flamethrower'],
	],

	draw_function 						: function(here)
	{
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		here_index = here.index;

		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.aim_angle,
			255, 0.05 * sat_factor, -1.0 - damage_frac * 1.5, 1,
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
			120,
			(0.2 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			- 1.8 + Math.sin(rvr.now / 777) * 0.25
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
			120,
			(0.2 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			- 1.8 + Math.sin(rvr.now / 777) * 0.25
				 - damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},
};