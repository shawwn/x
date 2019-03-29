'use strict';

civ.Colonies = function()
{
	this.c = new Array(civ.MAX_COLONY_COUNT);
	for (var i = 0; i < civ.MAX_COLONY_COUNT; i++)
	{
		this.c[i] = new civ.Colony(i);
	}
}

civ.Colonies.prototype.think = function(time_delta)
{
}

civ.Colonies.prototype.spawn = function(faction_id, pos_x, pos_y)
{
	for (var i = 0; i < civ.MAX_COLONY_COUNT; i++)
	{
		if (!this.c[i].is_active)
		{
			this.c[i].spawn(faction_id, pos_x, pos_y);
			return i;
		}
	}
	return -1;
}

civ.Colonies.prototype.draw = function()
{
	for (var i = 0; i < civ.MAX_COLONY_COUNT; i++)
	{
		if (this.c[i].is_active)
		{
			this.c[i].draw();
		}
	}
}

civ.Colonies.prototype._ = function()
{
	
}
