rvr.Agent_Memory_Slot = function()
{
	this.reset();
}

rvr.Agent_Memory_Slot.prototype.reset = function()
{
	this.agent = null;
	this.agent_index = -1;
	this.agent_birthdate = -1;
	this.weight = 0;
	this.distance = -1;
	this.last_seen = 0;
	this.last_update = 0;
	this.last_seen_pos_x = -1;
	this.last_seen_pos_y = -1;
	this.last_seen_pos_z = -1;
	this.last_scent_drop = -999999;
};