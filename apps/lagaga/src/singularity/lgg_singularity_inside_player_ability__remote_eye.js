"use strict";

lgg.SingularityInside_Ability__RemoteEye = function()
{
	this.reset();
}
lgg.SingularityInside_Ability__RemoteEye.prototype.reset = function()
{
	this.last_shot = -99999;
	this.level = 0;
	this.eyes_active = 0;
	this.max_eyes = 7;
}
lgg.SingularityInside_Ability__RemoteEye.prototype.pressed = function(player, time_delta)
{
	if (lgg.singularity.inside.drones.eyes_active < this.max_eyes && lgg.now - this.last_shot > 500)
	{
		this.eyes_active++;
		lgg.singularity.inside.drones.spawn(player.pos_x + µ.angle_to_x(player.heading) * player.radius, player.pos_y + µ.angle_to_y(player.heading) * player.radius, 0);
		this.last_shot = lgg.now;
	}
}
lgg.SingularityInside_Ability__RemoteEye.prototype.released = function(player, time_delta)
{
}