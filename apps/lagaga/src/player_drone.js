"use strict";

lgg.Player_Drone = function(id)
{
	this.id	= id;
	
	this.reset();
};

lgg.Player_Drone.prototype.reset = function()
{
	this.active 		= false;
	this.pos_x			= 0;
	this.pos_y			= 0;
	this.acceleration	= 0.0005;
	this.friction		= 0.9925;
	this.brake_friction	= 0.9;
	this.speed_x		= 0;
	this.speed_y		= 0;
	this.radius			= 0.01;
	this.radius2		= this.radius * 2;
	
	this.type			= 0;
	
	this.health			= 1.0;
	this.armour			= 1.0;
	this.shield			= 0;
	this.shield_max		= 0;
}

lgg.Player_Drone.prototype.spawn = function(type)
{
}

lgg.Player_Drone.prototype.think = function(time_delta)
{
		
	this.speed_x *= Math.pow(this.friction, time_delta);
	this.speed_y *= Math.pow(this.friction, time_delta);

	if (this.id == 0)
	{
		var follow_dist = 0.015;
		var target_pos_x = lgg.player.pos_x;
		var target_pos_y = lgg.player.pos_y;
		var target_radius = lgg.player.radius;
	}
	else
	{
		var follow_dist = 0.0075;
		var target_pos_x = lgg.player_drones.drones[this.id - 1].pos_x;
		var target_pos_y = lgg.player_drones.drones[this.id - 1].pos_y;   
		var target_radius = lgg.player_drones.drones[this.id - 1].radius;
	}
	
		
	var dest_angle = µ.vector2D_to_angle(target_pos_x - this.pos_x, target_pos_y - this.pos_y);
	var dist = µ.distance2D(target_pos_x, target_pos_y, this.pos_x, this.pos_y);
	
	var dist_outside = dist - target_radius - this.radius;
		
	if (dist_outside > follow_dist)
	{
		var desired_acceleration_x = µ.angle_to_x(dest_angle) * this.acceleration;
		var desired_acceleration_y = µ.angle_to_y(dest_angle) * this.acceleration;
	}
	else if (dist_outside > 0.00025)
	{
		this.speed_x *= Math.pow(this.brake_friction, time_delta);
		this.speed_y *= Math.pow(this.brake_friction, time_delta);
		var desired_acceleration_x = -µ.angle_to_x(dest_angle) * this.acceleration * 0.05;
		var desired_acceleration_y = -µ.angle_to_y(dest_angle) * this.acceleration * 0.05;
	}
	else
	{
		var desired_acceleration_x = -µ.angle_to_x(dest_angle) * this.acceleration * 0.95;
		var desired_acceleration_y = -µ.angle_to_y(dest_angle) * this.acceleration * 0.95;
	}

	this.speed_x = this.speed_x * 0.995 + 0.005 * desired_acceleration_x * time_delta;
	this.speed_y = this.speed_y * 0.995 + 0.005 * desired_acceleration_y * time_delta;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	
}

lgg.Player_Drone.prototype.draw = function()
{
	lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_player_drone, this.pos_x, this.pos_y, this.radius2, this.radius2, 90,
		0, 0.5, 0.5, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
}





lgg.Player_Drone.prototype._ = function()
{
}

