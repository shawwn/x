"use strict";


/*

	triple shot
	
	twin shot
	
	homing shot

*/


lgg.weapons = [];

var index = 0;

lgg.weapons[lgg.PLAYER_WEAPON__BALL_LIGHTNING = index++] =
{
	damage:				-1,
	
	energy_cost:		0.75,
	shot_delay:			150,
	
	can_charge:			false,
	charge_time_min:	0,
	charge_time_max:	0,
	can_hold_charge:	false,
	title:				'Ball Lightning',

	fire: function(direction, movement_angle)
	{
		var angle = lgg.weapon_directions_angle[direction];
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle, false, lgg.PROJECTILE_TYPE__BALL_LIGHTNING, lgg.DAMAGE_TYPE__ELECTRICITY, 0.02,
			10000, 0.000478, 0.99945,
			0, 0, -1, 0,
			0, 0, 0, 0);
	},
};


lgg.weapons[lgg.PLAYER_WEAPON__SINGLE_SHOT = index++] =
{
	damage:				1.0,
	energy_cost:		0.1,
	shot_delay:			100,
	
	can_charge:			false,
	charge_time_min:	0,
	charge_time_max:	0,
	can_hold_charge:	false,
	title:				'Single Shot',

	fire: function(direction, movement_angle)
	{
		var angle = lgg.weapon_directions_angle[direction];
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 1.0,
			3500, 0.000678, 0.99985,
			0, 0, -1, 0,
			0, 0, 0, 0);
	},
};

lgg.weapons[lgg.PLAYER_WEAPON__SWEEP_SPREAD	= index++] =
{
	damage:				3.0,
	energy_cost:		0.3,
	shot_delay:			250,
	title:				'Sweep Spread',
	fire: function(direction, movement_angle)
	{
		var angle = lgg.weapon_directions_angle[direction];
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle - 2, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.125,
			5000, 0.000478, 0.999915,
			0, 0, -1, 0,
			0, 0, 0, 0);
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle - 1, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.625,
			5000, 0.000478, 0.999915,
			0, 0, -1, 0,
			0, 0, 0, 0);
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 1.5,
			5000, 0.000478, 0.999915,
			0, 0, -1, 0,
			0, 0, 0, 0);
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle + 1, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.625,
			5000, 0.000478, 0.999915,
			0, 0, -1, 0,
			0, 0, 0, 0);
		lgg.projectiles.spawn(
			lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
			lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
			angle + 2, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.125,
			5000, 0.000478, 0.999915,
			0, 0, -1, 0,
			0, 0, 0, 0);
	},
};

lgg.weapons[lgg.PLAYER_WEAPON__SHOTGUN = index++] =
{
	damage:				3,
	energy_cost:		0.2,
	shot_delay:			150,
	title:				'Shotgun',
	fire: function(direction, movement_angle)
	{
		var angle = lgg.weapon_directions_angle[direction];
		var side = lgg.weapon_directions_side[direction];
		var count = 12;
		for (var i = 0; i < count; i++)
		{
			var frac = i / (count - 1);
			lgg.projectiles.spawn(
				lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
				lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
				angle - .4 + frac * .8, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
				3000 - 2500 * frac, 0.00015 + frac * 0.00005, 0.975 - 0.015 * (frac),
				0, 0, -1, 0,
				0, 0, -0.005 + µ.rand(0.01), 0.0000035 + 0.00002 * frac);
		}
	},
};

lgg.weapons[lgg.PLAYER_WEAPON__SWIRL = index++] =
{
	damage:				0.5,
	energy_cost:		0.075,
	shot_delay:			500,
	title:				'Swirl',
	fire: function(direction, movement_angle)
	{
		//for (var i = 0; i < 4; i++)
		{
			//var i = 0;
			lgg.projectiles.spawn(
				lgg.player.pos_x + lgg.player.radius * 0.85 * lgg.weapon_directions_x[direction],
				lgg.player.pos_y + lgg.player.radius * 0.85 * lgg.weapon_directions_y[direction],
				90, false, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5,
				15000, 0.0000186, 0.999,
				0.025, 0.00000045, 580000000, 0,
				0, 0, 0, 0);
		}
	},
};
