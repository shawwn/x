"use strict";

lgg.SingularityInside_Drones = function()
{
	this.reset();
};
lgg.SingularityInside_Drones.prototype.reset = function()
{
	this.d = [];
	this.drones_active = 0;
	this.eyes_active = 0;
	for (var i = 0; i < lgg.MAX_SINGULARITY_DRONES; i++)
	{
		this.d.push(new lgg.SingularityInside_Drone(i));
	}
}
lgg.SingularityInside_Drones.prototype.spawn = function(pos_x, pos_y, type)
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_DRONES; i++)
	{
		if (!this.d[i].active)
		{
			if (type == 0)
			{
				this.eyes_active++;
				this.drones_active++;
			}
			var drone = this.d[i];
			drone.reset();
			drone.active = true;
			drone.type = type;
			drone.age = 0;
			drone.last_sight_update = lgg.now - 50;
			drone.lifespan = 20000;
			drone.pos_x = pos_x;
			drone.pos_y = pos_y;
			return true;
		}
	}
	return false;
}
lgg.SingularityInside_Drones.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_DRONES; i++)
	{
		if (this.d[i].active)
		{
			this.d[i].think(time_delta);
		}
		else if (this.d[i].dying > 0)
		{
			this.d[i].dying -= time_delta;
			if (this.d[i].dying < 0)
				this.d[i].dying = 0;
		}
	}
};
lgg.SingularityInside_Drones.prototype.draw = function()
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_DRONES; i++)
	{
		
		if ((this.d[i].active || this.d[i].dying > 0)/* && (lgg.singularity.inside.tile_vis[this.d[i].tile] > 0 || lgg.input.key('KEY_B').pressed)*/)
		{
			this.d[i].draw();
		}
	}
};
