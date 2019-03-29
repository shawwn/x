rvr.Spawner = function(pos_x, pos_y)
{
	this.pos_x = pos_x;
	this.pos_y = pos_y;

	this.is_active = false;

	this.last_spawn = 0;
}

rvr.Spawner.prototype.blah = function(time_delta)
{
	this.time_elapsed += time_delta;
}

rvr.Spawner.prototype._ = function()
{
}