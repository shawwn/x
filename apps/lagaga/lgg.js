"use strict";

window.lgg = {};

// constants *always* needed before init()

lgg.COLLISION_FLAG__NONE			= 0;
lgg.COLLISION_FLAG__ENEMIES			= 1;
lgg.COLLISION_FLAG__PLAYER			= 2;

// other constants

lgg.INTRO_DURATION								= 20;

lgg.DEBUG__TRADER_DISABLED						= false;
lgg.DEBUG__SINGULARITY_DISABLED					= true;
lgg.DEBUG__DRAW_PROJECTILE_RADIUS				= false;

lgg.ENEMY_DANGER_FACTOR__EXPLODE				= 0.0;		// the danger of a exploding enemy gets multiplied by this and added to the danger to bring
lgg.ENEMY_DANGER_ADD__EXPLODE					= 0.0;		// fixed value to add to danger to bring when an enemy explodes
lgg.ENEMY_DANGER_FACTOR__MOVING_ON				= 0.0;

lgg.PROJECTILE_RADIUS_MIN						= 0.006;
lgg.PROJECTILE_RADIUS_DAMAGE_FACTOR				= 0.006;
lgg.PROJECTILE_RADIUS_DAMAGE_FACTOR_EXPLOSION	= 8.0; // radius of explosion in relation to radius of projectile, NOT damage like the previous one

lgg.PROJECTILE_PARTICLES_SIZE_FACTOR			= 1.0; // size of particles in relation to projectile radius

lgg.PROJECTILE_HUESHIFT_MIN						= -130;
lgg.PROJECTILE_HUESHIFT_DAMAGE_FACTOR			= 15;

lgg.SHIELD_RADIUS								= 2.5;		// in relation to enemy/player radius

lgg.LEVEL_SIZE_X								= 1.5;
lgg.LEVEL_SIZE_Y								= 1.0;

lgg.STARTING__PLAYER_CREW_CABINS				= 4;

lgg.MAX_ENEMIES									= 500;

lgg.MAX_PICKUPS									= 200;
lgg.PICKUP_FADEOUT_TIME							= 500;
lgg.PICKUP_SINK_START							= 30000;
lgg.PICKUP_SINK_END								= 120000;

lgg.MAX_PROJECTILES								= 1500;

lgg.TRADER_TOODLES								= 3000;
lgg.TRADER_POUT									= 7000;
lgg.TRADER_POUT_FADEIN							= 1000;

lgg.MAX_SINGULARITY_PROJECTILES					= 200;
lgg.MAX_SINGULARITY_ENEMIES						= 25;
lgg.MAX_SINGULARITY_DRONES						= 8;
lgg.MAX_SINGULARITY_ITEMS						= 250;



lgg.projectile_radius = function(damage)
{
	return lgg.PROJECTILE_RADIUS_MIN + damage * lgg.PROJECTILE_RADIUS_DAMAGE_FACTOR;
}

lgg.projectile_hue_shift = function(damage)
{
	return lgg.PROJECTILE_HUESHIFT_MIN + damage * lgg.PROJECTILE_HUESHIFT_DAMAGE_FACTOR;
}

var inc = 0;









lgg.options_debug = [];

lgg.options_debug[lgg.DEBUG_OPTION__TIMESCALE					= inc++] = 	{ name: 'timescale', 								type: 'list', default: 7, values: [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 4, 8]},
lgg.options_debug[lgg.DEBUG_OPTION__DISABLE_SPAWNING			= inc++] = 	{ name: 'disable spawning',				 			type: 'bool', default: false },
lgg.options_debug[lgg.DEBUG_OPTION__PLAYER_DAMAGE_FACTOR		= inc++] = 	{ name: 'player damage factor', 					type: 'list', default: 5, values: [0, 0.01, 0.1, 0.2, 0.5, 1.0, 1.5, 2, 4, 8, 16]},
lgg.options_debug[lgg.DEBUG_OPTION__ENEMY_DAMAGE_FACTOR			= inc++] = 	{ name: 'enemy damage factor', 						type: 'list', default: 5, values: [0, 0.01, 0.1, 0.2, 0.5, 1.0, 1.5, 2, 4, 8, 16]},
lgg.options_debug[lgg.DEBUG_OPTION__DISABLE_BACKGROUND			= inc++] = 	{ name: 'disable background',				 		type: 'bool', default: false },
lgg.options_debug[lgg.DEBUG_OPTION__DISABLE_BACKGROUND_STARS	= inc++] = 	{ name: 'disable background stars',			 		type: 'bool', default: true },
lgg.options_debug[lgg.DEBUG_OPTION__ATTRACT_MODE 				= inc++] = 	{ name: 'attract mode',				 				type: 'bool', default: false },
lgg.options_debug[lgg.DEBUG_OPTION__SHOW_DEBUG_STUFF 			= inc++] = 	{ name: 'show debug stuff',				 			type: 'bool', default: false },
lgg.options_debug[lgg.DEBUG_OPTION__DETERMINISTIC_MODE 			= inc++] = 	{ name: 'deterministic mode',				 		type: 'bool', default: false },

lgg.options_debug_values = [];

var force_options_reload = false;

function get_bool_option(option)
{
	return (option == '1');
}

for (var i = 0, len = lgg.options_debug.length; i < len; i++)
{
	var cookie_name = "lagaga: " + lgg.options_debug[i].name;
	if (lgg.options_debug[i].type == 'bool')
	{
		lgg.options_debug_values[i] = lgg.options_debug[i].default;
		lgg.options_debug_values[i] = !force_options_reload && localStorage.getItem(cookie_name) != null ? get_bool_option(localStorage.getItem(cookie_name)) : (lgg.options_debug[i].default ? true : false);
	}
	if (lgg.options_debug[i].type == 'list')
	{
		lgg.options_debug_values[i] = lgg.options_debug[i].values[lgg.options_debug[i].default];
		lgg.options_debug_values[i] = !force_options_reload && localStorage.getItem(cookie_name) != null ? localStorage.getItem(cookie_name) : lgg.options_debug[i].values[lgg.options_debug[i].default];
	}
}

