var inc = 0;
rvr.FLOOR__HURRY_UP_MECHANIC__SEEKER_GROUP 			= inc;	inc++;
rvr.FLOOR__HURRY_UP_MECHANIC__SEEKER_BADDIE 		= inc;	inc++;
rvr.FLOOR__HURRY_UP_MECHANIC_COUNT 					= inc;	inc++;
/*
rvr.FLOOR__HURRY_UP_MECHANIC__ 			= inc;	inc++;
*/

var inc = 0;
rvr.FLOOR__TILESET__CELLAR 			= inc;	inc++;
/*
rvr.FLOOR__TILESET__ 			= inc;	inc++;
*/

var inc = 0;
rvr.FLOOR____ 			= inc;	inc++;
/*
rvr.FLOOR____ 			= inc;	inc++;
*/

rvr.Floor = function(depth)
{
	this.depth = depth;
	this.hurry_up_mechanic = µ.rand_int(rvr.FLOOR__HURRY_UP_MECHANIC_COUNT - 1)
	this.time_elapsed = 0;
	this.time_until_hurry_up = (300 - Math.max(depth, 20) * 10) * 1000;
}

rvr.Floor.prototype.think = function(time_delta)
{
	this.time_elapsed += time_delta;
}

rvr.Floor.prototype._ = function()
{
	
}
