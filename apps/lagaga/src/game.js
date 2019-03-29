"use strict";

lgg.Game = function()
{
	this.state = lgg.GAMESTATE__PLAYING;
	this.state_time = 0;
	this.think = function(time_delta)
	{
		this.state_time += time_delta;
		if (this.state == lgg.GAMESTATE__INTRO && lgg.input.KEY_SPACE.pressed)
		{
			this.state_time += time_delta * 9;
		}
		if (this.state == lgg.GAMESTATE__INTRO && (this.state_time > lgg.INTRO_DURATION /* || lgg.input.key('KEY_SPACE').pressed */ ))
		{
			lgg.now = lgg.INTRO_DURATION; // cheap way to prevent the particles from showing up
/*
			this.state = lgg.GAMESTATE__MENU;
		}
		else if (this.state == lgg.GAMESTATE__MENU)
		{
*/
			this.state = lgg.GAMESTATE__PLAYING;
		}
		else if (this.state == lgg.GAMESTATE__PLAYING)
		{
			
		}
	}
};