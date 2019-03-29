rvr.presets.agents.drone =
{

	controller							: 'enemy',

	inherits_from						:
	[
	],

	drop_list							: 'default',

	parameters:
	{
		faction_id						: rvr.FACTION__DRONES,

		move_acceleration				: 0.0000150,
		move_deceleration				: 0.0000225,

		radius							: 0.4,
		radius2							: 0.8,
		weight							: 2.0,

	},

	weapons								:
	[
		['plasma_pistol'],
	],

	ammo								:
	[
		[rvr.AMMOTYPE_PLASMA, 100],
	],

	ammo_recharge						:
	[
		[rvr.AMMOTYPE_PLASMA, 10, 1000],
	],

	draw_function 						: function(here)
	{
		var here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		var sat_factor = this.is_dying ? 0.0 : 1.0;
		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			this.is_dying ? rvr.tex_orb_bg_blinds2 : rvr.tex_orb_bg,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			0, 0.5 * sat_factor, 0.5 + damage_frac * 1.5, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
		var hue = here.hue_shift + (here.can_see_prey ? 0 : 90);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			rvr.tex_orb_light,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2 * 0.6,
			here.parameters.radius2 * 0.6,
			90,
			//120 - 120 * here.state.alarm_level,
			hue,
			1.0 * sat_factor,
			(1.25 + (this.is_dying ? 0 : Math.sin(rvr.now / 277) * 0.25)) * (this.is_dying ? 0.5 : 1.0)
				 + damage_frac * 1.5,
			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
	},
};





