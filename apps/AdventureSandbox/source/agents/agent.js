asbx.Agent = function()
{
	this.body		= new asbx.Body();
}

asbx.Agent.prototype.reset = function()
{
	this.body.reset();

	this.preset_id = -1;
	
	this.health 	= 1;
	this.stamina	= 1;
	this.is_player	= false;
}

asbx.Agent.prototype.spawn = function()
{
	
}


asbx.Agent.prototype.__ = function()
{
	
}
