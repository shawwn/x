'use strict';

civ.Units = function()
{
	this.u = new Array(civ.MAX_UNIT_COUNT);
	for (var i = 0; i < civ.MAX_UNIT_COUNT; i++)
	{
		this.u[i] = new civ.Unit(i);
	}
}

civ.Units.prototype.think = function(time_delta)
{
	for (var i = 0; i < civ.MAX_UNIT_COUNT; i++)
	{
		if (this.u[i].is_active)
		{
			this.u[i].think(time_delta);
		}
	}
}

civ.Units.prototype.spawn = function(unit_type, faction_id, pos_x, pos_y)
{
	for (var i = 0; i < civ.MAX_UNIT_COUNT; i++)
	{
		if (!this.u[i].is_active)
		{
			this.u[i].spawn(unit_type, faction_id, pos_x, pos_y);
			return i;
		}
	}
	return -1;
}

civ.Units.prototype.draw = function()
{
	for (var i = 0; i < civ.MAX_UNIT_COUNT; i++)
	{
		if (this.u[i].is_active)
		{
			this.u[i].draw();
		}
	}
}


civ.Units.prototype._ = function()
{
	
}
