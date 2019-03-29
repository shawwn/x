rvr.Pickup = function(index)
{
	this.index = index;
	this.reset();
}

rvr.Pickup.prototype.reset = function()
{
	var index = this.index;
	rvr_pickups__hue[index] = µ.rand(360);
	rvr_pickups__is_active[index] = 0;
	rvr_pickups__pos_x[index] = -1;
	rvr_pickups__pos_y[index] = -1;
	this.type = 0;
}

rvr.Pickup.prototype.draw = function()
{
}

rvr.Pickup.prototype.spawn = function(pos_x, pos_y, type)
{

	var this_index = this.index;
	rvr_pickups__is_active[this_index] = 1;
	rvr_pickups__pos_x[this_index] = pos_x;
	rvr_pickups__pos_y[this_index] = pos_y;
	rvr_pickups__type[this_index] = type;
}

rvr.Pickup.prototype.think = function(time_delta)
{
	var this_index = this.index;
	dist = µ.distance2D(rvr_agents__pos_x[0], rvr_agents__pos_y[0], rvr_pickups__pos_x[this_index], rvr_pickups__pos_y[this_index]);
	if (dist < rvr.player_agent.parameters.radius)
	{
		this.picked_up();
	}
}

rvr.Pickup.prototype.picked_up = function()
{
	var this_index = this.index;
	rvr_pickups__is_active[this_index] = 0;

	for (var i = 0; i < 5; i++)
	{
			rvr.particlesGPU.spawn(
				rvr.now + i * 10,
				1,
				rvr_pickups__pos_x[this_index],
				rvr_pickups__pos_y[this_index],
				rvr_pickups__pos_x[this_index],
				rvr_pickups__pos_y[this_index],
				0.25 + 0.3125 * i,
				0,
				0,
				0, 0.0,
				rvr.particles__pickup,
				900 - 30 * i,		//	lifespan
				rvr_pickups__hue[this_index], 1 + i / 5, 0.95, 0.5,
				360,		//	vary_angle
				0.0,		//	vary_angle_vel
				0.0,		//	vary_pos_x
				0.0,		//	vary_pos_y
				0.0,		//	vary_size
				0.0,		//	vary_vel_x
				0.0,		//	vary_vel_y
				0,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				0			//	vary_birthdate
			);

			rvr.particlesGPU.spawn(
				rvr.now + i * 10,
				1,
				rvr_pickups__pos_x[this_index],
				rvr_pickups__pos_y[this_index],
				rvr_pickups__pos_x[this_index],
				rvr_pickups__pos_y[this_index],
				.125 + .15825 * i,
				0,
				0,
				0, 0.0,
				rvr.particles__pickup,
				700 - 20 * i,		//	lifespan
				rvr_pickups__hue[this_index], 1 + i / 5, 0.95, 0.5,
				360,		//	vary_angle
				0.0,		//	vary_angle_vel
				0.0,		//	vary_pos_x
				0.0,		//	vary_pos_y
				0.0,		//	vary_size
				0.0,		//	vary_vel_x
				0.0,		//	vary_vel_y
				0,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				0			//	vary_birthdate
			);

	}

}

rvr.Pickup.prototype._ = function()
{
}