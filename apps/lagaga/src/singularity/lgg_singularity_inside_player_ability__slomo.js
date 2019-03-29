"use strict";

lgg.SingularityInside_Ability__Slomo = function()
{
	this.reset();
}

lgg.SingularityInside_Ability__Slomo.prototype.reset = function()
{
}

lgg.SingularityInside_Ability__Slomo.prototype.pressed = function(player, time_delta)
{
	player.time_factor = 0.3;
}

lgg.SingularityInside_Ability__Slomo.prototype.released = function(player, time_delta)
{
	player.time_factor = 1;
}