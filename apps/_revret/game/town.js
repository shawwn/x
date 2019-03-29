rvr.Town = function()
{
	this.time_elapsed = 0;


	this.time_elapsed = 0;
}

rvr.Town.prototype.think = function(time_delta)
{
	this.time_elapsed += time_delta;
}

rvr.Town.prototype._ = function()
{
}