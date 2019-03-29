"use strict";

lgg.Pickup = function(id)
{
	this.id = id;
	this.reset();
};

lgg.Pickup.prototype.reset = function()
{
	this.active = false;
	this.age = 0;
	this.type = null;
	this.type_id = 0;
	this.heading = 90;
	this.rotation_speed = 0;
	this.picked_up = 0;
	this.pos_x = 0;
	this.pos_y = 0;
	this.radius = 0;
	this.speed_x = 0;
	this.speed_y = 0;
}

lgg.Pickup.prototype.think = function(time_delta)
{
	this.age += time_delta;
	if (this.picked_up)
	{
		this.picked_up -= time_delta;
		if (this.picked_up <= 0)
		{
			this.active = false;
			return;
		}
	}
	// bounce off sides
	if (this.pos_x > lgg.level.size_x - this.radius)
	{
		this.pos_x = lgg.level.size_x - this.radius;
		this.speed_x *= -1;
	}
	if (this.pos_x < this.radius)
	{
		this.pos_x = this.radius;
		this.speed_x *= -1;
	}
	
	if (this.age >= lgg.PICKUP_SINK_START)
	{
		var sink_time = lgg.PICKUP_SINK_END - lgg.PICKUP_SINK_START;
		var frac = Math.min(sink_time, this.age - lgg.PICKUP_SINK_START) / sink_time
		var lower_bound = this.radius * 2 - this.radius * 3 * frac * frac * frac;
	}
	else
	{
		var lower_bound = this.radius * 2;
	}
	
	// bounce off bottom cuz fun
	if (this.pos_y < lower_bound)
	{
		this.pos_y = lower_bound;
		this.speed_y *= -.7;
	}
	// sunk
	if (this.pos_y < -this.radius)
	{
		this.active = false;
		return;
	}

	this.heading = (this.heading + this.rotation_speed * time_delta) % 360;
	var old_x =this.pos_x;
	var old_y =this.pos_y;
	this.speed_y -= time_delta * this.type.gravity;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	if (!this.picked_up)
	{
		// player collision
		var dist_from_player = µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, this.pos_x, this.pos_y);
		var overlap = (this.radius + lgg.player.radius) - dist_from_player;
		if (overlap > 0)
		{
			this.picked_up = lgg.PICKUP_FADEOUT_TIME;
		}
	}
	if (this.picked_up == lgg.PICKUP_FADEOUT_TIME)
	{
		lgg.pickup_types[this.type_id].effect(this.pos_x, this.pos_y);
	}

	this.rotation_speed *= 0.9995;
	if (!this.picked_up)
	{
		this.speed_x *= 0.9995;
		this.speed_y *= 0.9995;
	}
}