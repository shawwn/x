"use strict";

var index = 0;

lgg.drone_types = [];

lgg.drone_types[lgg.DRONE_TYPE__STANDARD_SHOOTER = index++] =
{
	'title':					'',
	'weapon_front':				false,
	'weapon_side':				false,
	'weapon_back':				false,
	
	'shield':					0,
	'shield_recharge':			0,
	'armour':					1.0,

	'energy':					0,
	'energy_recharge_amount':	0,
	'energy_recharge_freq':		0,
	
	'draw':						function(d)
	{
		
	},

	'take_damage':						function(d, amount)
	{
		
	},

	'think':						function(d)
	{
		
	},
};



/*

	cheap shot
		low armour, no shield
		shoots infrequent low damage plasma shots, forward only

	glass cannon
		very low armour, lower shield, quick shield regeneration
		shoots high damage plasma bursts, forwards and sideways
		
	side cannon
		medium armour
		shoots to the sides
		
	energy drainer
		does shield damage only
		
	pickup collector
		can collect credit pickups
		
	paralyzer
		shoots projectiles that slow down enemies
	
	nanite cloud thrower
		throws a close range cloud of nanites that do more damage to ships the more shield they have
		
	repair drone MK1
		light armour
		repairs nearby drones every now and then by a low amount

	repair drone MK2
		light armour
		repairs nearby drones very frequently by a low amount
		
	repair drone MK3
		heavy armour
		medium shield, fast recharge rate
		repairs nearby drones every now and then by a large amount

	repair drone MK4
		medium armour
		light shield, fast recharge rate
		repairs nearby drones very frequently by a large amount
	
	selfless drone
		when the player is damaged, it slowly transfers some of its own hull integrity towards the player
		

*/