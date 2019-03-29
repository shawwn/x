var dummy = 0;

rvr.AGENT_GOAL_TYPE__MOVE_TOWARDS 	= dummy;	dummy++;
rvr.AGENT_GOAL_TYPE__TURN_TOWARDS 	= dummy;	dummy++;
rvr.AGENT_GOAL_TYPE__ 	= dummy;	dummy++;
rvr.AGENT_GOAL_TYPE__ 	= dummy;	dummy++;

rvr.Agent_Agent_Relation = function()
{
	this.has_attacked_me_recently = 
}


rvr.Agent_Goal.prototype.set = function(type, weight)
{
	this.timestamp = rvr.now;
	this.type = type;
	this.weight = weight;
}


