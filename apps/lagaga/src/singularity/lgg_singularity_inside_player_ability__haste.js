"use strict";

lgg.SingularityInside_Ability__Haste = function()
{
	this.reset();
}
lgg.SingularityInside_Ability__Haste.prototype.reset = function()
{
	this.last_shot = -99999;
	this.duration = 2000;
	this.recharge_speed = 0.5;
	this.charged = this.duration;
	this.active  = false;
	this.ready = true;
}
lgg.SingularityInside_Ability__Haste.prototype.pressed = function(player, time_delta)
{
	//lgg.audio.set_sound_var(player.sound_id, 1, this.charged / this.duration);
	if (this.ready)
	{
		this.active = true;
		this.whee(player, time_delta);
	}
	else
	{
		this.charge(player, time_delta);
	}
}
lgg.SingularityInside_Ability__Haste.prototype.released = function(player, time_delta)
{
	//lgg.audio.set_sound_var(player.sound_id, 1, this.charged / this.duration);
	if (this.active)
	{
		this.whee(player, time_delta);
	}
	else
	{
		this.charge(player, time_delta);
	}
}
lgg.SingularityInside_Ability__Haste.prototype.whee = function(player, time_delta)
{
	this.charged -= time_delta
	if (this.charged <= 0)
	{
		this.charged = 0;
		player.acceleration = player.base_acceleration;
		player.air_control = player.base_air_control;
		player.friction = 0.992;
		this.ready = false;
		this.active= false;
	}
	else
	{
		player.acceleration = player.base_acceleration * 1.125;
		player.air_control = player.base_air_control * 1.125;
		player.friction = 0.98;
	}
}
lgg.SingularityInside_Ability__Haste.prototype.charge = function(player, time_delta)
{
	player.acceleration = player.base_acceleration;
	player.air_control = player.base_air_control;
	player.friction = player.base_friction;
	this.charged += time_delta * this.recharge_speed;
	if (this.charged >= this.duration)
	{
		this.ready = true;
		this.charged = this.duration;
	}
	
	var velocity = Math.abs(player.speed_x) + Math.abs(player.speed_y);

}