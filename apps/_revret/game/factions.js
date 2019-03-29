rvr.Factions = function()
{
	this.factions = [];

	this.factions[rvr.FACTION__NONE] = new rvr.Faction(
		// rel_attack
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			true, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			true, //rvr.FACTION__SURVIVORS
			true, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		0,0,0.3
	);

	this.factions[rvr.FACTION__PLAYER] = new rvr.Faction(
		// rel_attack
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		150,1,0.5
	);
	this.factions[rvr.FACTION__SURVIVORS] = new rvr.Faction(
		// rel_attack
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			true, //rvr.FACTION__SURVIVORS
			true, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		120,1,0.5
	);
	this.factions[rvr.FACTION__REBELS] = new rvr.Faction(
		// rel_attack
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			true, //rvr.FACTION__SURVIVORS
			true, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		60,1,0.5
	);
	this.factions[rvr.FACTION__BANDITS] = new rvr.Faction(
		// rel_attack
		[
			true, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			true, //rvr.FACTION__SURVIVORS
			true, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		0,1,0.5
	);
	this.factions[rvr.FACTION__DRONES] = new rvr.Faction(
		// rel_attack
		[
			true, //rvr.FACTION__NONE
			true, //rvr.FACTION__PLAYER
			true, //rvr.FACTION__SURVIVORS
			true, //rvr.FACTION__REBELS
			true, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		// rel_support
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			true, //rvr.FACTION__DRONES
		],
		// rel_fear
		[
			false, //rvr.FACTION__NONE
			false, //rvr.FACTION__PLAYER
			false, //rvr.FACTION__SURVIVORS
			false, //rvr.FACTION__REBELS
			false, //rvr.FACTION__BANDITS
			false, //rvr.FACTION__DRONES
		],
		280,1,0.5
	);

	//this.factions[] = new Faction();
	//rel_attack, rel_support, rel_fear
/*

rvr.FACTION__NONE
rvr.FACTION__PLAYER
rvr.FACTION__SURVIVORS
rvr.FACTION__REBELS
rvr.FACTION__BANDITS
rvr.FACTION__DRONES
*/

}

rvr.Factions.prototype._ = function()
{
};