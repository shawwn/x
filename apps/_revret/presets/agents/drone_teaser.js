rvr.presets.agents.drone_teaser =
{
	controller							: 'enemy',
	inherits_from						:
	[
	],
	drop_list							: 'default',
	parameters:
	{
		faction_id						: rvr.FACTION__DRONES,

		move_acceleration				: 0.0000025,
		move_deceleration				: 0.0000000125,

		radius							: 0.4,
		radius2							: 0.8,
		weight							: 2.0,

	},
	draw_function 						: function(here)
	{
		here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;

		var hue = 220 + here.hue_shift;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_blob2,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			hue, 0.15 * sat_factor, 0.25 + damage_frac * 0.25, 1.0,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},

	draw2 						: function(here)
	{
		here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;

		var hue = 220 + here.hue_shift;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_blob,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius * 1.5,
			here.parameters.radius * 1.5,
			here.aim_angle,
			hue, 0.6 * sat_factor, 0.95 + damage_frac * 1.5 + 0.25 * Math.sin(rvr.now / 237), 1.0,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

	},

	draw3 						: function(here)
	{
		here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;

		var now = (rvr.now + here.index * 1234);

		var hue = 52 + here.hue_shift + (here.can_see_prey ? -42 + 20 * Math.sin(now / 47) : 60);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone_teaser_lights,
			rvr_agents__pos_x[here_index], rvr_agents__pos_y[here_index],
			here.parameters.radius * 1.5,
			here.parameters.radius * 1.5,
			here.aim_angle,
			hue, 1.0 * sat_factor, 0.8 + 0.2 * Math.sin(now / 37) + damage_frac * 1.5, 1.0,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},

	think_post 						: function(here)
	{
		here.distance_to_player
	}
};