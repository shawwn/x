rvr.Agent_Goals = function()
{
	this.stack = new Array(5);
}

rvr.Agent_Goals.prototype.think = function(time_delta)
{
	this.time_elapsed += time_delta;
}

rvr.Agent_Goals.prototype._ = function()
{
}