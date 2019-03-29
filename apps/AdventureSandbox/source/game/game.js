asbx.GAMETIME_SCALE

asbx.GAMETIME_MONTHS_PER_YEAR 		= 12;
asbx.GAMETIME_WEEKS_PER_MONTH 		= 4;
asbx.GAMETIME_DAYS_PER_WEEK 		= 7;
asbx.GAMETIME_HOURS_PER_DAY 		= 24;
asbx.GAMETIME_MINUTES_PER_HOUR 		= 60;
asbx.GAMETIME_SECONDS_PER_MINUTE 	= 60;

var inc = 0;

asbx.GAMESTATE__LOADING 		= inc++;
asbx.GAMESTATE__INTRO 			= inc++;
asbx.GAMESTATE__MAIN_MENU 		= inc++;
asbx.GAMESTATE__ 				= inc++;

asbx.Game = function()
{
	this.reset();
};

asbx.Game.prototype.reset = function()
{
	this.time_milliseconds = 0;

	this.time_minute 		= 0;
	this.time_hour 			= 0;
	this.time_day_of_week 	= 0;
	this.time_day_of_month 	= 0;
	this.time_day_of_year 	= 0;
	this.time_month 		= 0;
	this.time_year 			= 0;

	this.is_paused 		= false;
};

asbx.Game.prototype.update_calendar = function()
{

};

asbx.Game.prototype.think = function(time_delta)
{
	if (this.is_paused)
	{
		return;
	}
	this.time_ingame += time_delta;
};

asbx.Game.prototype._ = function()
{

};

asbx.Game.prototype.__ = function()
{

};