'use strict';

civ.Persons = function()
{
	this.p = new Array(civ.MAX_PERSON_COUNT);
	for (var i = 0; i < civ.MAX_PERSON_COUNT; i++)
	{
		this.p[i] = new civ.Person(i);
	}
}

civ.Persons.prototype.spawn_in_mothership = function(mothership_index)
{
	for (var i = 0; i < civ.MAX_PERSON_COUNT; i++)
	{
		if (!this.p[i].is_active)
		{
			this.p[i].spawn_in_mothership(mothership_index);
			return i;
		}
	}
	return -1;
}

civ.Persons.prototype.think = function(time_delta)
{
	for (var i = 0; i < civ.MAX_PERSON_COUNT; i++)
	{
		if (this.p[i].is_active)
		{
			this.p[i].think(time_delta);
		}
	}
}

civ.Persons.prototype.draw = function(time_delta)
{
	for (var i = 0; i < civ.MAX_PERSON_COUNT; i++)
	{
		if (this.p[i].is_active)
		{
			this.p[i].draw();
		}
	}
}

civ.Persons.prototype._ = function()
{
}

civ.Persons.prototype._ = function()
{
}
