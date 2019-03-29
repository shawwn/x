'use strict';

civ.Game = function()
{
	this.date = 0;
	this.speed_factor = 1.0;
}

civ.Game.prototype.think = function(time_delta)
{
	this.date += time_delta * this.speed_factor;
	civ.think__in_game(time_delta);
}

civ.Game.prototype._ = function()
{
}

civ.Game.prototype._ = function()
{
	
}
