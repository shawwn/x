"use strict";

lgg.Player_Drones = function()
{
	this.reset();
};

lgg.Player_Drones.prototype.reset = function()
{
	this.drones = [];
}

lgg.Player_Drones.prototype.add_drone = function()
{
	this.drones.push(new lgg.Player_Drone(this.drones.length));
}

lgg.Player_Drones.prototype.think = function(time_delta)
{
	for (var i = 0, len = this.drones.length; i < len; i++)
	{
		this.drones[i].think(time_delta);
	}
}

lgg.Player_Drones.prototype.draw = function()
{
	for (var i = 0, len = this.drones.length; i < len; i++)
	{
		this.drones[i].draw();
	}
}

lgg.Player_Drones.prototype._ = function()
{
}

