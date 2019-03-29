"use strict";

var rvr = {};

// AGENTS

var rvr_AGENT_COUNT = 20;

var rvr_agents__is_active			= new Uint8Array(rvr_AGENT_COUNT);
var rvr_agents__pos_x				= new Float32Array(rvr_AGENT_COUNT);
var rvr_agents__pos_y				= new Float32Array(rvr_AGENT_COUNT);
var rvr_agents__pos_z				= new Float32Array(rvr_AGENT_COUNT);
var rvr_agents__speed_x				= new Float32Array(rvr_AGENT_COUNT);
var rvr_agents__speed_y				= new Float32Array(rvr_AGENT_COUNT);
var rvr_agents__speed_z				= new Float32Array(rvr_AGENT_COUNT);

var inc = 0;
rvr.AGENT_STATE__NONE 				= inc;	inc++;
rvr.AGENT_STATE__IS_ALARMED 		= inc;	inc++;
rvr.AGENT_STATE__ENEMY_IS_IN_SIGHT	= inc;	inc++;

var inc = 0;
rvr.AGENT_TYPE__NONE 			= inc;	inc++;
rvr.AGENT_TYPE__PLAYER 			= inc;	inc++;
rvr.AGENT_TYPE__PLAYER_DRONE 	= inc;	inc++;
rvr.AGENT_TYPE__ENEMY 			= inc;	inc++;


// PICKUPS

var rvr_PICKUP_COUNT = 100;

var rvr_pickups__is_active			= new Uint8Array(rvr_PICKUP_COUNT);
var rvr_pickups__type				= new Uint8Array(rvr_PICKUP_COUNT);
var rvr_pickups__hue				= new Float32Array(rvr_PICKUP_COUNT);
var rvr_pickups__pos_x				= new Float32Array(rvr_PICKUP_COUNT);
var rvr_pickups__pos_y				= new Float32Array(rvr_PICKUP_COUNT);

var inc = 0;
rvr.PICKUP_TYPE__GEM 				= inc;	inc++;

/*
rvr.PICKUP_TYPE__ 					= inc;	inc++;
*/
rvr.PICKUP_TYPE_COUNT 				= inc;	inc++;


var rvr_DRONE_SPAWN_POINT_COUNT = 150;

var rvr_CLOUD_COUNT = 150;

var rvr_ROOM_COUNT = 50;

var rvr_HUB_COUNT = 3;


rvr.presets = {};
rvr.presets.agents = {};
rvr.presets.projectiles = {};
rvr.presets.map_generators = {};
rvr.presets.weapons = {};

var inc = 0;
rvr.GAMESTATE_INTRO 			= inc;	inc++;
rvr.GAMESTATE_MAIN_MENU 		= inc;	inc++;
rvr.GAMESTATE_BASE 				= inc;	inc++;
rvr.GAMESTATE_SELECT_MAP		= inc;	inc++;
rvr.GAMESTATE_MAP_BRIEFING		= inc;	inc++;
rvr.GAMESTATE_IN_MAP			= inc;	inc++;
rvr.GAMESTATE_MAP_DEBRIEFING	= inc;	inc++;

/*
rvr.GAMESTATE_ 			= inc;	inc++;
*/


var inc = 0;
rvr.AGENT_MEMORY_TYPE__ATTACKED 		= inc;	inc++;
rvr.AGENT_MEMORY_TYPE__SUPPORTED 		= inc;	inc++;
rvr.AGENT_MEMORY_TYPE__FEARED 			= inc;	inc++;
rvr.AGENT_MEMORY_TYPE__ATTACKING 		= inc;	inc++;
/*
rvr.AGENT_MEMORY_TYPE__SUPPORTING 		= inc;	inc++;
rvr.AGENT_MEMORY_TYPE__FEARING 			= inc;	inc++;
*/
rvr.AGENT_MEMORY_TYPE_COUNT 			= inc;

var inc = 0;

/*
rvr.FACTION__NONE 			= inc;	inc++;
rvr.FACTION__PLAYER			= inc;	inc++;
rvr.FACTION__VENDOR			= inc;	inc++;
											//	runs from predators
											//	runs from monsters

rvr.FACTION__HUNTER			= inc;	inc++;
											//	attacks predators
											//	runs from mercenaries
											//	runs from monsters
	//		

rvr.FACTION__HERO			= inc;	inc++;
											//	attacks predators
											//	attacks mercenaries
											//	runs from guardians
											//	runs from monsters

rvr.FACTION__MERCENARY		= inc;	inc++;
											//	attacks players
											//	attacks hunters
											//	runs from heroes
											//	runs from guardians

	//		Arnie Asshole

rvr.FACTION__PREDATOR 		= inc;	inc++;
											//	attacks players
											//	attacks vendors
											//	runs from hunters
											//	runs from heroes

	//		spore and poison spitting mushroom

rvr.FACTION__MONSTER 		= inc;	inc++;
											//	attacks players
											//	attacks vendors
											//	attacks hunters
											//	attacks heroes

rvr.FACTION__GUARDIAN 		= inc;	inc++;
											//	attacks players
											//	attacks heroes
											//	attacks mercenaries

	//		Turrets
	//		Pierce Starer

*/

rvr.FACTION__NONE 			= inc;	inc++;
rvr.FACTION__PLAYER 		= inc;	inc++;
rvr.FACTION__SURVIVORS 		= inc;	inc++;
rvr.FACTION__REBELS 		= inc;	inc++;
rvr.FACTION__BANDITS 		= inc;	inc++;
rvr.FACTION__DRONES			= inc;	inc++;
rvr.FACTION_COUNT 			= inc;	inc++;
/*
rvr.FACTION__ 			= inc;	inc++;
*/

var inc = 0;
rvr.SCENT_CHANNEL__SELF			= inc;	inc++;
rvr.SCENT_CHANNEL__ATTACKED		= inc;	inc++;
rvr.SCENT_CHANNEL__FEARED		= inc;	inc++;


var inc = 0;
rvr.AMMOTYPE_PLASMA_GRENADE 	= inc;	inc++;
rvr.AMMOTYPE_PLASMA				= inc;	inc++;
rvr.AMMOTYPE_ 					= inc;	inc++;


var inc = 0;
rvr.WEAPONSTATE_IDLE 		= inc;	inc++;
rvr.WEAPONSTATE_WARMUP 		= inc;	inc++;
rvr.WEAPONSTATE_COOLDOWN 	= inc;	inc++;
rvr.WEAPONSTATE_INTERVAL	= inc;	inc++;
rvr.WEAPONSTATE_RELOAD_WARMUP	= inc;	inc++;
rvr.WEAPONSTATE_RELOAD_COOLDOWN	= inc;	inc++;
rvr.WEAPONSTATE_RELOAD_INTERVAL	= inc;	inc++;

// "dislike" in this context means "attack on sight"
// individuals can still consider other individuals (who attacked them for example) as "ad-hoc" enemies
// likewise with considering them friends and/or allies - maybe, if I can find cool uses for that

rvr.faction_dislike = [];
rvr.faction_dislike[rvr.FACTION__LONE] 		= rvr.FACTION__NONE;
rvr.faction_dislike[rvr.FACTION__PLAYER] 	= rvr.FACTION__NONE;
rvr.faction_dislike[rvr.FACTION__SURVIVORS] = rvr.FACTION__NONE;
rvr.faction_dislike[rvr.FACTION__REBELS] 	= rvr.FACTION__BANDITS | rvr.FACTION__DRONES;
rvr.faction_dislike[rvr.FACTION__BANDITS] 	= rvr.FACTION__PLAYER | rvr.FACTION__SURVIVORS | rvr.FACTION__REBELS;
rvr.faction_dislike[rvr.FACTION__DRONES] 	= rvr.FACTION__PLAYER | rvr.FACTION__SURVIVORS | rvr.FACTION__REBELS | rvr.FACTION__BANDITS;


// "like" in this context means "support by default"

rvr.faction_like = [];
rvr.faction_like[rvr.FACTION__LONE] 		= rvr.FACTION__NONE;
rvr.faction_like[rvr.FACTION__PLAYER] 		= rvr.FACTION__PLAYER;
rvr.faction_like[rvr.FACTION__SURVIVORS] 	= rvr.FACTION__SURVIVORS;
rvr.faction_like[rvr.FACTION__REBELS] 		= rvr.FACTION__REBELS;
rvr.faction_like[rvr.FACTION__BANDITS] 		= rvr.FACTION__BANDITS;
rvr.faction_like[rvr.FACTION__DRONES] 		= rvr.FACTION__DRONES;

rvr.ALERTNESS_LEVEL__DEAD 					= 0;
rvr.ALERTNESS_LEVEL__COMATOSE				= 0;	// e.g. a "dead" drone that can be repaired, but not simply woken up.. 
rvr.ALERTNESS_LEVEL__UNCONCSCIOUS 			= 0; 	// everything from a living being knocked out for a few seconds to sleeping
rvr.ALERTNESS_LEVEL__AWAKE 					= 0;
rvr.ALERTNESS_LEVEL__ALERT 					= 0;	// something interesting happened, not sure yet if it's important
rvr.ALERTNESS_LEVEL__ALARMED				= 0;	// something important happened (e.g. enemy or threat nearby)
rvr.ALERTNESS_LEVEL__ALOT					= 0;	// "I can't feel my face.. from the inside.." ^_^


rvr.ALERTNESS_LEVEL__ENEMY_WAS_IN_SIGHT		= 0;
rvr.ALERTNESS_LEVEL__ENEMY_IS_IN_SIGHT		= 0;



var inc = 0;
rvr.DAMAGE_TYPE__HEAT 			= inc;	inc++;
rvr.DAMAGE_TYPE__PLASMA 		= inc;	inc++;
rvr.DAMAGE_TYPE_COUNT 			= inc;



var inc = 0;
rvr.FLOOR_TYPE__STONE 			= inc;	inc++;
rvr.FLOOR_TYPE__SAND 			= inc;	inc++;
rvr.FLOOR_TYPE__GRASS 			= inc;	inc++;
rvr.FLOOR_TYPE__METAL 			= inc;	inc++;
rvr.FLOOR_TYPE__WOOD 			= inc;	inc++;

rvr.FLOOR_TYPE__ 			= inc;	inc++;

