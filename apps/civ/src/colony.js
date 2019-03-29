'use strict';

civ.Colony = function(index)
{
	this.index = index;
	this.reset();
}

civ.Colony.prototype.reset = function()
{
	this.is_active = false;
	this.age = 0;
	this.storage_wheat = new civ.Storage(20, 1000 * 60 * 5);
	this.storage_fish = new civ.Storage(20, 1000 * 60 * 1);
	this.storage_wood = new civ.Storage(1, 0);
	this.faction_id = -1;
	this.pos_x = -1;
	this.pos_y = -1;
}

civ.Colony.prototype.think = function(time_delta)
{
	this.age += time_delta;
}

civ.Colony.prototype.spawn = function(faction_id, pos_x, pos_y)
{
	this.reset();
	this.faction_id = faction_id;
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.is_active = true;
	console.log(faction_id, pos_x, pos_y);
}

civ.Colony.prototype.draw = function()
{
	civ.c.rectangle_textured.draw(
	civ.CAM_PLAYER,
	civ.tex_circle,
	this.pos_x,
	this.pos_y,
	civ.COLONY_BASE_RADIUS,
	civ.COLONY_BASE_RADIUS,
	1, 1,
	90,
	0, 0, 2, 0.5,
	-1, -1, -1, -1,
	-1, -1, -1, -1,
	-1, -1, -1, -1);
}


civ.Colony.prototype._ = function()
{
	
}
