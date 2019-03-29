"use strict";

/*

ALL DRONES

	follows the player (or a previous drone)

*/




/*


EVENT

	flyby
		a few allied spaceships fly through the screen, shooting at enemies
		if there is already a flyby in progress, even better allies spawn

FIXED DURATION

	credit magnet
		attracts nearby credit pickups
	
	increased regeneration
		increases shield and hull regeneration for a short time, if the player has any in the first place (and only spawns if they do)

LIMITED



*/

lgg.pickup_types = [
	{
		'title':				'bullet swirl',
		'weight':				function()
		{
			return 10;
		},
		'danger_subtract':		4,
		'min_danger':			10,
		'probability':			0.0025,
		'texture':				0,
		'hue':		 			0,
		'trail_hue': 			0,
		'gravity':				0.00000008,
		'radius':				1.35,
		'spawn_speed_min': 		0.0000125,
		'spawn_speed_max': 		0.000175,
		'effect':				function(pos_x, pos_y)
		{
			for (var i = 0; i < 20; i++)
			{
				var factor = µ.rand(1);
				lgg.projectiles.spawn(
					lgg.player.pos_x - lgg.player.radius * 0.005 + µ.rand(lgg.player.radius * 0.01),
					lgg.player.pos_y + lgg.player.radius * 0.75 + lgg.player.radius * µ.rand(.025),
					90 - 5 * 0.01 + i * 0.01, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 1.5, 
					5000 + 5000 * factor, 0.000186, .9989 + .001099 * factor,
					0.05, 0.0000075, 580000000, 0 + µ.rand_int(100),
					0, 0, 0, 0);
			}
		},
	},


	{
		'title':				'1 credit',
		'weight':				function()
		{
			return 1000;
		},
		'danger_subtract':		.5,
		'min_danger':			1,
		'probability':			0.25,
		'texture':				1,
		'hue':		 			56,
		'trail_hue': 			56,
		'gravity':				0.0000000250,
		'radius':				0.6,
		'spawn_speed_min': 		0.000025,
		'spawn_speed_max': 		0.000075,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_credits(10);
		},
	},
	{
		'title':				'10 credits',
		'weight':				function()
		{
			return 100;
		},
		'danger_subtract':		2.5,
		'min_danger':			5,
		'probability':			0.15,
		'texture':				1,
		'hue':		 			66,
		'trail_hue': 			66,
		'gravity':				0.0000000300,
		'radius':				0.8,
		'spawn_speed_min': 		0.000025,
		'spawn_speed_max': 		0.000075,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_credits(50);
		},
	},
	{
		'title':				'100 credits',
		'weight':				function()
		{
			return 10;
		},
		'danger_subtract':		5,
		'min_danger':			10,
		'probability':			0.1,
		'texture':				1,
		'hue':		 			76,
		'trail_hue': 			76,
		'gravity':				0.0000000350,
		'radius':				1.0,
		'spawn_speed_min': 		0.000025,
		'spawn_speed_max': 		0.000075,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_credits(100);
		},
	},

	{
		'weight':				function()
		{
			return lgg.player.health <= 0.8 ? 20 : 0;
		},
		'danger_subtract':		8,
		'min_danger':			8,
		'probability':			0.01,
		'texture':				0,
		'hue':		 			120,
		'trail_hue': 			120,
		'gravity':				0.00000008,
		'radius':				1.5,
		'spawn_speed_min': 		0.000025,
		'spawn_speed_max': 		0.00025,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_health(0.2);
		},
	},
	{
		'weight':				function()
		{
			
			return lgg.player.health <= 0.95 ? 30 : 0;
		},
		'danger_subtract':		4,
		'min_danger':			4,
		'probability':			0.01,
		'texture':				0,
		'hue':		 			120,
		'trail_hue': 			120,
		'gravity':				0.00000008,
		'radius':				1,
		'spawn_speed_min': 		0.000035,
		'spawn_speed_max': 		0.00035,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_health(0.05);
		},
	},
	{
		'weight':				function()
		{
			return lgg.player.energy <= 0.5 ? 50 : 0;
		},
		'danger_subtract':		2,
		'min_danger':			2,
		'probability':			0.005,
		'texture':				0,
		'hue':		 			220,
		'trail_hue': 			220,
		'gravity':				0.00000008,
		'radius':				1,
		'spawn_speed_min': 		0.000035,
		'spawn_speed_max': 		0.00035,
		'effect':				function(pos_x, pos_y)
		{
			lgg.player.gain_energy(1);
		},
	},
];