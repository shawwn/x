"use strict";


lgg.special_weapons = [];

var inc = 0;

lgg.special_weapons[lgg.PLAYER_SPECIAL_WEAPON__ = inc++] =
{
	title:				'',
	description:		'',
	energy_cost:		0.75,
	special_cost:		0.5,
	cooldown:			30000,
};

lgg.special_weapons[lgg.PLAYER_SPECIAL_WEAPON__PORTABLE_BLACK_HOLE = inc++] =
{
	title:				'Portable Black Hole',
	description:		'Sucks in nearby enemies and enemy projectiles, but also the player, their projectiles and drones drones if they get too close. Delay after deployment.',
	energy_cost:		0.75,
	special_cost:		0.8,
	cooldown:			30000,
};


lgg.special_weapons[lgg.PLAYER_SPECIAL_WEAPON__SHIELD_EMP = inc++] =
{
	title:				'Shield EMP',
	description:		'Launches a rocket that overcharges the shield capacitors of all ships on roughly the same vertical level as it when triggered by the player. The more shields a ship has, the larger the radius of the EMP blast they send out, slowing them and nearby enemies down. This effect can stack and wears off over time or by getting damaged.',
	energy_cost:		0.75,
	special_cost:		0.5,
	cooldown:			30000,
};

lgg.special_weapons[lgg.PLAYER_SPECIAL_WEAPON__SHIELD_WALL = inc++] =
{
	title:				'Shield Wall',
	description:		'Constructs a temporary vertical shield, blocking both enemies and the player, including their projectiles. There is a short delay after deployment to allow the player and their drones to get to the side they want to be on for the next 10 seconds.',
	energy_cost:		0.75,
	special_cost:		0.5,
	cooldown:			30000,
};


