grd.Agents = function ()
{
	this.reset();
};

grd.Agents.prototype.reset = function ()
{
	this.last_spawn = grd.now;
	this.a = new Array(grd.EVO__MAX_AGENTS);
	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		this.a[i] = new grd.Agent();
	}
};

grd.Agents.prototype.spawn = function ()
{
	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		if (this.a[i].active == false)
		{
			this.a[i].reset();
			this.a[i].active = true;
			return true;
		}
	}
};

grd.Agents.prototype.draw = function ()
{
	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		if (this.a[i].active == true)
		{
			this.a[i].draw();
		}
	}
};
