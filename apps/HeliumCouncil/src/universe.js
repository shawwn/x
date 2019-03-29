hc.Universe = function(size)
{
	this.solar_systems		= [];
	this.generate();
}

hc.Universe.prototype.generate = function()
{
	this.solar_systems.push(new hc.Solar_System());
}

hc.Universe.prototype.draw = function()
{
	for (var i = 0, len = this.solar_systems.length; i < len; i++)
	{
		this.solar_systems[i].draw();
	}
}

hc.Universe.prototype.think = function(time_delta)
{
	this.solar_systems[0].think(time_delta);
}

hc.Universe.prototype._ = function()
{
}
