rvr.presets.agents.player_drone =
{
	controller 							: 'player_drone',
	inherits_from 						:
	[
	],
	parameters:
	{
		faction_id 						: rvr.FACTION__PLAYER,
		move_acceleration				: 0.000005,
		move_deceleration				: 0.0000025,

		radius							: 0.4,
		radius2							: 0.8,
	},
	draw_function 						: function(here)
	{
		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_eye_color,
			here.state.pos_x, here.state.pos_y,
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			here.hue_shift, 0.95, 1, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

	},
};