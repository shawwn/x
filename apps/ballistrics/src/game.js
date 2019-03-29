btx.Game = function()
{
	this.flashlight_battery_charge = 1.0; // huh

	this.state = btx.GAMESTATE_INTRO;
	this.state_time_elapsed = 0;
}

btx.Game.prototype.think_switch = function(time_delta)
{
	this.state_time_elapsed += time_delta;
	if (this.state == btx.GAMESTATE_INTRO && this.state_time_elapsed > btx.intro_duration)
	{
		this.switch_state_to(btx.GAMESTATE_IN_MAP);
	}
}

btx.Game.prototype.think = function(time_delta)
{
	if (this.state == btx.GAMESTATE_INTRO)
	{
		
	}
	if (this.state == btx.GAMESTATE_IN_MAP)
	{
		btx.think__in_map(time_delta);
	}
}

btx.Game.prototype.switch_state_to = function(state)
{
	this.state = state;
	this.state_time_elapsed = 0;
}

btx.Game.prototype._ = function()
{
}

btx.Game.prototype._ = function()
{
	
}
