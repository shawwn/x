rvr.Player_Remote_Eye = function()
{
	this.is_active = false;
	this.pos_x = 0;
	this.pos_y = 0;
	this.pos_z = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.speed_z = 0;

	this.sight_range = 12.0;
	this.sight_range360 = 3.0;
	this.sight_cone = 360.0;
	this.sight_direction = 0;
	this.sight_falloff = 0.05;

	this.light_range = 12.0;
	this.light_range360 = 6.0;
	this.light_cone = 360.0;
	this.light_direction = 0;
	this.light_falloff = 0.45;

}


rvr.Player_Remote_Eye.prototype.fire = function()
{
	this.is_active = true;
	this.age = 0;
	this.speed_x = rvr_agents__speed_x[0] + µ.angle_to_x(rvr.player_agent.state.facing) * 0.005;
	this.speed_y = rvr_agents__speed_y[0] + µ.angle_to_y(rvr.player_agent.state.facing) * 0.005;
	this.sight_direction = rvr.player_agent.state.facing;
	this.light_direction = rvr.player_agent.state.facing;
	this.speed_z = 0.0075;
	this.pos_x = rvr_agents__pos_x[0];
	this.pos_y = rvr_agents__pos_y[0];
	this.pos_z = rvr.map.get_depthmap(this.pos_x, this.pos_y);
}

rvr.Player_Remote_Eye.prototype.think = function(time_delta)
{
	if (this.is_active)
	{
		this.age += time_delta;
	}
	this.sight_direction = (this.sight_direction + 0.16 * time_delta) % 360;
	this.light_direction = (this.light_direction + 0.16 * time_delta) % 360;

	this.speed_z -= 0.00001 * time_delta;
	var ground_height_x = rvr.map.get_depthmap(this.pos_x + this.speed_x * time_delta, this.pos_y);
	var ground_height_y = rvr.map.get_depthmap(this.pos_x, this.pos_y + this.speed_y * time_delta);
	if (ground_height_x > this.pos_z)
	{
		this.speed_x *= -0.8;
	}
	if (ground_height_y > this.pos_z)
	{
		this.speed_y *= -0.8;
	}
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.pos_z += this.speed_z * time_delta;
	var ground_height = rvr.map.get_depthmap(this.pos_x, this.pos_y);
	if (this.pos_z < ground_height)
	{
		this.pos_z = ground_height;
		this.speed_z *= -0.6;
		this.speed_x *= 0.5;
		this.speed_y *= 0.5;
	}
}

rvr.Player_Remote_Eye.prototype.draw = function(time_delta)
{
	if (this.is_active)
	{

//		var sight_range = (this.sight_range + Math.sin(rvr.now / 500) * 0.5 * this.sight_range) * rvr.map.one_over_size_x;
//		var sight_range360 = (this.sight_range360 + Math.sin(rvr.now / 500) * 0.5 * this.sight_range360) * rvr.map.one_over_size_x;

		var sight_range 	= this.sight_range * rvr.map.one_over_size_x;
		var sight_range360 	= this.sight_range360 * rvr.map.one_over_size_x;

		var light_range 	= this.light_range * rvr.map.one_over_size_x;
		var light_range360 	= this.light_range360 * rvr.map.one_over_size_x;

		rvr.light_and_shadow.set_camera2_range(sight_range);
		rvr.light_and_shadow.set_camera2_range360(sight_range360);
		rvr.light_and_shadow.set_camera2_position(this.pos_x * rvr.map.one_over_size_x, this.pos_y * rvr.map.one_over_size_y, this.pos_z + 0.04);
		rvr.light_and_shadow.set_camera2_direction(this.sight_direction);
		rvr.light_and_shadow.set_camera2_cone(this.sight_cone);
		rvr.light_and_shadow.set_camera2_falloff(this.sight_falloff);

		var hue = (rvr.now / 30) % 360
		µ.HSL_to_RGB(hue, 0.5, 0.5, rvr.temp_array);

		//rvr.temp_array[0] = 0.195;
		//rvr.temp_array[1] = 0.195;
		//rvr.temp_array[2] = 0.995;

		rvr.lights.add(
			this.pos_x * rvr.map.one_over_size_x,
			this.pos_y * rvr.map.one_over_size_y,
			this.pos_z,
			light_range,
			light_range360,
			this.light_falloff,
			rvr.temp_array[0], rvr.temp_array[1], rvr.temp_array[2], 1.0,
			this.light_direction,
			this.light_cone
			);

		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_eye_color_pupil_fullframe,
			//0.5, 0.5,
			this.pos_x, this.pos_y,
			0.75 + 0.25 * this.pos_z,
			0.75 + 0.25 * this.pos_z,
			this.sight_direction,
			hue, 1, 1.5, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1
			);

	}
}

rvr.Player_Remote_Eye.prototype._ = function()
{
	
}
