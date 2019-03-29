hc.Game = function()
{
	this.flashlight_battery_charge = 1.0; // huh

	this.state = hc.GAMESTATE_INTRO;
	this.state_time_elapsed = 0;
}

hc.Game.prototype.think_switch = function(time_delta)
{
	this.state_time_elapsed += time_delta;
	if (this.state == hc.GAMESTATE_INTRO && this.state_time_elapsed > hc.intro_duration)
	{
		this.switch_state_to(hc.GAMESTATE_IN_MAP);
	}
}

hc.Game.prototype.think = function(time_delta)
{
	if (this.state == hc.GAMESTATE_INTRO)
	{
		
	}
	if (this.state == hc.GAMESTATE_IN_MAP)
	{
		hc.think__in_map(time_delta);
	}
}

hc.Game.prototype.switch_state_to = function(state)
{
	this.state = state;
	this.state_time_elapsed = 0;
}

hc.Game.prototype._ = function()
{
}

hc.Game.prototype._ = function()
{
	
}
