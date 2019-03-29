"use strict";

/*

	players can come across escape pods, which require delicate handling:
	when they get hit once by the player they turn off their protection field and open after 3 seconds, allowing the astronaut to tumble down and get collected by the player
	
	
	when there are no free crew cabins, the astronaut will get dropped off at the next trader, netting a reward depending on their skills
	if there is already a crew member with an ability the astronout also shares, they will pout and not join even with suffcient crew cabins, and give a much smaller reward
	while it's possible to "kick out" crew members at a trading station, the astronauts you picked up always leave first

	crew members have these stats:
		morale				their benefits get scaled by this
		health				their benefits get scaled by this, when it reaches zero and the ship has no cryogenic chamber, they die, otherwise they get frozen to get revived for a hefty fee in a space hospital
	
	crew members have these attributes:
		stamina				how quickly their health goes up and down in response to events
		attitude			how quickly their morale goes up and down in response to events

	each possible crew member offers a unique benefit:
		heal other crew members over time
		entertains crew members, reducing morale loss and improving morale gain
		repair hull over time
		recharge shield over time
		decrease trader prices
		increase frequency of trader spawns
		increase quality of trader spawns
		increase speed bost, improves braking
		create a small force field that weakens incoming projectiles
		decrease energy use of all weapons
		increase fire rate of all weapons
		increase damage of all weapons

	possible likes
		destroying several enemies of the same type in a row
		destroying different enemy types in a row
		buying things at the trader
		collecting pickups

	possible dislikes

		player armour getting hit
		player shields getting hit
		player drone getting hit
		missing pickups
		not buying anything at the trader
		the player letting an escape pod pass by
		the player killing an astronaut rather than rescuing them

*/

lgg.Crew_Member = function()
{
	this.reset();
};

lgg.Crew_Member.prototype.reset = function()
{
	this.health			= 1;
	this.experience		= 0;
	this.rank			= 0;
}

lgg.Crew_Member.prototype.enemy_destroyed = function()
{
}

lgg.Crew_Member.prototype.damage_taken = function()
{
}

lgg.Crew_Member.prototype.visited_trader = function()
{
}



lgg.Crew_Member.prototype._ = function()
{
}

