var dummy = 0;

rvr.TOWN_AGENT_TYPE__CITIZEN 	= dummy;	dummy++;
rvr.TOWN_AGENT_TYPE__GUARD 		= dummy;	dummy++;
rvr.TOWN_AGENT_TYPE__VOLUNTEER 	= dummy;	dummy++;
rvr.TOWN_AGENT_TYPE__TRADER 	= dummy;	dummy++;

rvr.Town_Agent = function(type)
{
/*
	this. = ;
*/

	this.type = type;

	this.robustness = 1;

	this.health = 1;
	this.morale = 0;

}

rvr.Town_Agent.prototype.think = function(time_delta)
{
	
}

rvr.Town_Agent.prototype._ = function()
{
}