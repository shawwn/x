'use strict';

civ.think = function(time_delta)
{
	civ.now += civ.game.speed_factor * time_delta;

//	console.log(civ.game.speed_factor * time_delta);

	civ.gui.think(civ.game.speed_factor * time_delta);
	civ.gamestate.think(civ.game.speed_factor * time_delta);
};
