drp.think = function (time_delta)
{
	drp.now += time_delta;
	drp.game.think(time_delta);
};