"use strict";

lgg.SingularityInside_Items = function()
{
	this.reset();
};
lgg.SingularityInside_Items.prototype.reset = function()
{
	this.d = [];
	this.last_spawn = -50000;
	for (var i = 0; i < lgg.MAX_SINGULARITY_ITEMS; i++)
	{
		this.d.push(new lgg.SingularityInside_Drone(i));
	}
	this.drones_active = 0;
}
lgg.SingularityInside_Items.prototype.spawn = function(pos_x, pos_y, type)
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_ITEMS; i++)
	{
		if (!this.d[i].active)
		{
			var drone = this.d[i];
			drone.reset();
			drone.active = true;
			drone.pos_x = pos_x;
			drone.pos_y = pos_y;
			return true;
		}
	}
	return false;
}
lgg.SingularityInside_Items.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_ITEMS; i++)
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
lgg.SingularityInside_Items.prototype.draw = function()
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_ITEMS; i++)
	{
		
		if ((this.d[i].active || this.d[i].dying > 0)/* && (lgg.singularity.inside.tile_vis[this.d[i].tile] > 0 || lgg.input.key('KEY_B').pressed)*/)
		{
		
			this.d[i].draw();
		}
	}
};
