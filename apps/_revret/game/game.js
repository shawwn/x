rvr.Game = function()
{
	this.flashlight_battery_charge = 1.0; // huh

	this.state = rvr.GAMESTATE_INTRO;
	this.state_time_elapsed = 0;
}

rvr.Game.prototype.think_switch = function(time_delta)
{
	this.state_time_elapsed += time_delta;
	if (this.state == rvr.GAMESTATE_INTRO && this.state_time_elapsed > rvr.intro_duration)
	{
		this.switch_state_to(rvr.GAMESTATE_IN_MAP);
	}
}

rvr.Game.prototype.think = function(time_delta)
{
	if (this.state == rvr.GAMESTATE_INTRO)
	{
		
	}
	if (this.state == rvr.GAMESTATE_IN_MAP)
	{
		rvr.think__in_map(time_delta);
	}
}

rvr.Game.prototype.switch_state_to = function(state)
{
	this.state = state;
	this.state_time_elapsed = 0;
}

rvr.Game.prototype._ = function()
{
}

rvr.Game.prototype._ = function()
{
	
}
