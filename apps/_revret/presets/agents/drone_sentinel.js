rvr.presets.agents.drone_sentinel =
{
	controller							: 'enemy',
	inherits_from						:
	[
	],
	drop_list							: 'default',
	parameters:
	{
		faction_id						: rvr.FACTION__DRONES,

		move_acceleration				: 0.000015,
		move_deceleration				: 0.0005,

		radius							: 0.5,
		radius2							: 1.0,
		weight							: 4.0,


		keep_distance_to_attacked_min	: 3.5,
		keep_distance_to_attacked_max	: 7.0,

		keep_distance_to_supported_min	: 1.5,
		keep_distance_to_supported_max	: 16.0,

		sight_range						: 24.0,
		sight_range360					: 24.0,


		light_range						: 2.0,
		light_range360					: 2.0,
		light_cone						: 10.0,
		light_falloff					: 0.75,
		
		light_color_r					: 1.0,
		light_color_g					: 1.0,
		light_color_b					: 1.0,
		light_color_a					: 1.0,

	},

	parameter_ranges:
	{
	},

	parameter_ranges_related:
	{
		radius							: [0.35, 0.4],
		radius2							: [0.7, 0.8],
		weight							: [4.0, 6.4],
	},

	weapons:
	[
		['drone_fireballs_360'],
	],


	draw_function 						: function(here)
	{
		var here_index = here.index;
		var sat_factor = this.is_dying ? 0.0 : 1.0;

		var damage_frac = (rvr.now - here.last_damage < 500) ? (1 - (rvr.now - here.last_damage) / 500) : 0;




		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			rvr.tex_sphere,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			0, 1.0 * sat_factor, - 0.75 - damage_frac * 0.21, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			rvr.tex_drone,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2 * 0.8,
			here.parameters.radius2 * 0.8,
			here.aim_angle,
			0, 1.0 * sat_factor, 0.3 + damage_frac * 1.5, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		var hue = here.hue_shift;

/*		
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_drone_light,
			//0.5, 0.5,
			rvr_agents__pos_x[here_index],
			rvr_agents__pos_y[here_index],
			here.parameters.radius2,
			here.parameters.radius2,
			here.state.facing,
			//120 - 120 * here.state.alarm_level,
			hue,
			(0.9 + Math.sin(rvr.now / 333) * 0.1) * sat_factor,
			1.25 + Math.sin(rvr.now / 777) * 0.25
				 + damage_frac * 1.5,

			1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
*/
		//if (here.state.flags & rvr.AGENT_STATE__IS_ALARMED)
		{

			var pulse1 = here.is_dying ? 0 : here.parameters.radius2 / 8 + Math.sin((rvr.now + here.index * 1234.6) / (227 + here.index * .00123)) * here.parameters.radius2 / 16;
			var pulse2 = here.is_dying ? 0 : Math.sin(rvr.now / 123) * 0.125
					 + Math.sin(rvr.now / 333) * 0.125
					 + Math.sin(rvr.now / 777) * 0.125
					 + Math.sin(rvr.now / 1111) * 0.125;
			var pulse3 = here.is_dying ? 0 : Math.sin(rvr.now / (27 + here.index * .010)) * 0.125
					 + Math.sin(rvr.now / (39 + here.index * .07)) * 0.125
					 + Math.sin(rvr.now / (56 + here.index * .023)) * 0.125
					 + Math.sin(rvr.now / (60 + here.index * .029)) * 0.125;

			rvr.c.rectangle_textured.draw(
				rvr.CAM_PLAYER, rvr.tex_drone_light_front,
				rvr_agents__pos_x[here_index],
				rvr_agents__pos_y[here_index],
				here.parameters.radius2 * 0.8 - pulse1,
				here.parameters.radius2 * 0.8 - pulse1,
				here.aim_angle,
				hue,
				1 * sat_factor,
				1.25 + pulse2 + damage_frac * 1.5,
				1.0,
				-1,-1,-1,-1,
				-1,-1,-1,-1,
				-1,-1,-1,-1);

			rvr.c.rectangle_textured.draw(
				rvr.CAM_PLAYER, rvr.tex_drone_light_back,
				rvr_agents__pos_x[here_index],
				rvr_agents__pos_y[here_index],
				here.parameters.radius2 * 0.8,
				here.parameters.radius2 * 0.8,
				here.aim_angle,
				hue,
				2 * sat_factor,
				1.0 + pulse3 + damage_frac * 1.5,
				1.0,
				-1,-1,-1,-1,
				-1,-1,-1,-1,
				-1,-1,-1,-1);

			rvr.c.rectangle_textured.draw(
				rvr.CAM_PLAYER,
				rvr.text_drone_arm,
				rvr_agents__pos_x[here_index],
				rvr_agents__pos_y[here_index],
				here.parameters.radius2 * 1.1,
				here.parameters.radius2 * 1.1,
				180 + here.aim_angle,
				hue,
				2 * sat_factor,
				1.0 + damage_frac * 1.5,
				1.0,
				-1,-1,-1,-1,
				-1,-1,-1,-1,
				-1,-1,-1,-1);


		}
	},
};

if (rvr.debug__scent_benchmark)
{
	console.log(
			'move_acceleration', rvr.presets.agents.drone_sentinel.parameters.move_acceleration,
			'move_deceleration', rvr.presets.agents.drone_sentinel.parameters.move_deceleration)
}
