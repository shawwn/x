rvr.presets.agents.player =
{
	controller 							: 'player',
	inherits_from 						:
	[
	],
	parameters:
	{
		faction_id						: rvr.FACTION__PLAYER,
		move_acceleration				: 0.000015,
		move_deceleration				: 0.00315,

		radius							: 0.4,
		radius2							: 0.8,
		weight							: 16.0,

		sight_height					: 0.075,
		sight_range						: 6.0,
		sight_range360					: 3.5,
		sight_cone						: 360.0,
		sight_falloff					: 0.5,

		light_range						: 16.0,
		light_range360					: 16.0,
		light_cone						: 10.0,
		light_falloff					: 0.95,
		
		light_color_r					: 1.0,
		light_color_g					: 1.0,
		light_color_b					: 1.0,
		light_color_a					: 1.0,

	},

	weapons:
	[
		['flamethrower'],
		['drone_fireballs_360'],
		['drone_fireballs_spread'],
		['drone_fireballs_spread_fan'],
		['fireballs'],
		['plasma_burst'],
		

		['plasma_grenade'],
		['plasma_pistol'],
		
		['ball_lightning'],
		
	],

	draw_function 						: function(here)
	{
		here_index = here.index;

		var z_offset = Math.max(0, rvr_agents__pos_z[here_index] - here.ground_height);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_eye_no_pupil,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index] + z_offset * 0.3,
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			here.hue_shift, 0.75, 1, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_eye_color_pupil_only,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index] + z_offset * 0.3,
			here.parameters.radius2 - 0.3 + rvr.camera_stretch.mouse_pos_x * 0.4,
			here.parameters.radius2 - 0.3  + rvr.camera_stretch.mouse_pos_x * 0.4,
			here.state.facing,
			here.hue_shift - 60 * rvr.camera_stretch.mouse_pos_x, 0.75 + 0.25 * rvr.camera_stretch.mouse_pos_x, 1, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

	},
};