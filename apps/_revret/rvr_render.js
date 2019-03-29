"use strict";

rvr.render = function(time_delta)
{

	if (rvr.game.state == rvr.GAMESTATE_IN_MAP)
	{
		rvr.render__in_map(time_delta);
	}
	if (rvr.game.state == rvr.GAMESTATE_INTRO)
	{
		rvr.render__intro(time_delta);
	}

	//rvr.c.gl.finish();

};