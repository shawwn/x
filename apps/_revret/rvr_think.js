"use strict";

rvr.think = function(time_delta)
{
	time_delta *= rvr.timescale;

	rvr.map_pixels_looked_at = 0;
	rvr.now += time_delta;
	rvr.game.think_switch(time_delta);
	rvr.game.think(time_delta);
	//console.log(rvr.map_pixels_looked_at);


};