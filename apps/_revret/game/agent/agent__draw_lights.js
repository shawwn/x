"use strict";

rvr.Agent.prototype.draw_lights = function(camera, is_player)
{
	if (this.is_dying)
		return;

	var this_state = this.state;

	var this_index = this.index;
	var this_parameters = this.parameters;


//*
	if (this_parameters.light_range > 0 || this_parameters.light_range_360 > 0)
	{
		//console.log("light");
			rvr.lights.add(
				rvr_agents__pos_x[this_index],
				rvr_agents__pos_y[this_index],
				rvr_agents__pos_z[this_index] + this_parameters.sight_height,
				this_parameters.light_range,
				this_parameters.light_range360,
				this_parameters.light_falloff,
				this_parameters.light_color_r, this_parameters.light_color_g, this_parameters.light_color_b, this_parameters.light_color_a,
				this_state.facing,
				this_parameters.light_cone
				);
	}



	if (this.type == rvr.AGENT_TYPE__PLAYER)
	{
		//console.log(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y);
		var pulse = Math.sin(rvr.now / 200);
/*
		rvr.map_shadow.set_light_range(this_parameters.sight_range * rvr.map.one_over_size_x);
		rvr.map_shadow.set_light_range360(this_parameters.sight_range360 * rvr.map.one_over_size_x);
		rvr.map_shadow.set_light_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + rvr.player.sight_height);
		rvr.map_shadow.set_light_direction(this_state.facing);
		rvr.map_shadow.set_light_cone(this_parameters.sight_cone);
*/

		rvr.light_and_shadow.set_camera_range(this_parameters.sight_range * rvr.map.one_over_size_x);
		rvr.light_and_shadow.set_camera_range360(this_parameters.sight_range360 * rvr.map.one_over_size_x);
		rvr.light_and_shadow.set_camera_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + rvr.player.sight_height);
		rvr.light_and_shadow.set_camera_direction(this_state.facing);
		rvr.light_and_shadow.set_camera_cone(this_parameters.sight_cone);
		rvr.light_and_shadow.set_camera_falloff(this_parameters.sight_falloff);

		rvr.light_and_shadow2.set_camera_range(this_parameters.sight_range * rvr.map.one_over_size_x);
		rvr.light_and_shadow2.set_camera_range360(this_parameters.sight_range360 * rvr.map.one_over_size_x);
		rvr.light_and_shadow2.set_camera_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + rvr.player.sight_height);
		rvr.light_and_shadow2.set_camera_direction(this_state.facing);
		rvr.light_and_shadow2.set_camera_cone(this_parameters.sight_cone);
		rvr.light_and_shadow2.set_camera_falloff(this_parameters.sight_falloff);

	}
	if (this.type == rvr.AGENT_TYPE__PLAYER_DRONE)
	{
		var pulse = Math.sin(rvr.now / 170);
/*
		rvr.map_shadow.set_light2_range(this_parameters.sight_range  * rvr.map.one_over_size_x);
		rvr.map_shadow.set_light2_range360(this_parameters.sight_range360  * rvr.map.one_over_size_x);
		rvr.map_shadow.set_light2_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index]  * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + 0.09);
		rvr.map_shadow.set_light2_direction(this_state.facing);
		rvr.map_shadow.set_light2_cone(this_parameters.sight_cone);
*/
		rvr.light_and_shadow.set_camera2_range((this_parameters.sight_range + pulse * this_parameters.sight_range / 2) * rvr.map.one_over_size_x);
		rvr.light_and_shadow.set_camera2_range360((this_parameters.sight_range360 + pulse * this_parameters.sight_range360 / 2) * rvr.map.one_over_size_x);
		rvr.light_and_shadow.set_camera2_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + 0.09);
		rvr.light_and_shadow.set_camera2_direction(this.state.facing);
		rvr.light_and_shadow.set_camera2_cone(this_parameters.sight_cone);
		rvr.light_and_shadow.set_camera2_falloff(this_parameters.sight_falloff + pulse * this_parameters.sight_falloff / 2);

		rvr.light_and_shadow2.set_camera2_range((this_parameters.sight_range + pulse * this_parameters.sight_range / 2) * rvr.map.one_over_size_x);
		rvr.light_and_shadow2.set_camera2_range360((this_parameters.sight_range360 + pulse * this_parameters.sight_range360 / 2) * rvr.map.one_over_size_x);
		rvr.light_and_shadow2.set_camera2_position(rvr_agents__pos_x[this_index] * rvr.map.one_over_size_x, rvr_agents__pos_y[this_index] * rvr.map.one_over_size_y, rvr_agents__pos_z[this_index] + 0.09);
		rvr.light_and_shadow2.set_camera2_direction(this.state.facing);
		rvr.light_and_shadow2.set_camera2_cone(this_parameters.sight_cone);
		rvr.light_and_shadow2.set_camera2_falloff(this_parameters.sight_falloff + pulse * this_parameters.sight_falloff / 2);
	}
}
