'use strict';

///////////////////
var civ = {};

civ.WORLD_SIZE_X 				= 1000;
civ.WORLD_SIZE_Y 				= 1000;
civ.ONE_OVER_WORLD_SIZE_X 		= 1 / 2000;
civ.ONE_OVER_WORLD_SIZE_Y 		= 1 / 2000;
civ.MAP_TERRAIN_TILES_X 		= 32;
civ.MAP_TERRAIN_TILES_Y 		= 32;
civ.MAP_SUBTILES_X 				= 4;
civ.MAP_SUBTILES_Y 				= 4;
civ.MAP_TOTAL_TILES_X 			= civ.MAP_TERRAIN_TILES_X * civ.MAP_SUBTILES_X;
civ.MAP_TOTAL_TILES_Y 			= civ.MAP_TERRAIN_TILES_Y * civ.MAP_SUBTILES_Y;

// GAME
civ.DEFAULT_GAME_SPEED 					= 1; // milliseconds per game minute
civ.RANDOM_SUBTILE_UPDATES_PER_TICK 	= 150;
civ.HARVESTABLE_REGROWTH_PER_TICK 		= 0.3;

// FACTIONS
civ.PLAYER_FACTION_ID 			= 0;

// COLONIES
civ.MAX_COLONY_COUNT			= 100;
civ.COLONY_BASE_RADIUS 			= 1.5;

// PERSONS
civ.MAX_PERSON_COUNT			= 5000;
civ.PERSON__BASE_SPEED 			= 0.00125;
civ.PERSON__BASE_RADIUS			= 0.3;
civ.PERSON__BASE_HARVEST_RATE	= 0.00021;
civ.PERSON__BASE_BUILD_RATE		= 0.000021;
civ.PERSON__BASE_BOREDOM_RATE	= 0.005;
civ.PERSON__BASE_UNBOREDOM_RATE	= 0.0001;

// UNITS
civ.MAX_UNIT_COUNT				= 100;
civ.UNIT__BASE_RADIUS			= .5;
civ.UNIT__BASE_ACCELERATION		= 0.0000075;

///////////////////
var index = 0;
civ.RESOURCE_TYPE__NONE 		= index; index++;
civ.RESOURCE_TYPE__FOOD 		= index; index++;
civ.RESOURCE_TYPE__WOOD 		= index; index++;
civ.RESOURCE_TYPE__STONE 		= index; index++;
civ.RESOURCE_TYPE__IRON_ORE 	= index; index++;
civ.RESOURCE_TYPE__IRON		 	= index; index++;
civ.RESOURCE_TYPE__GOLD_ORE		= index; index++;
civ.RESOURCE_TYPE__GOLD 		= index; index++;
civ.RESOURCE_TYPE__COAL 		= index; index++;
civ.RESOURCE_TYPE__SPICE 		= index; index++;
civ.RESOURCE_TYPE__FURS 		= index; index++;

civ.RESOURCE_TYPE__ 		= index; index++;
civ.RESOURCE_TYPE__ 		= index; index++;
civ.RESOURCE_TYPE__ 		= index; index++;

///////////////////
var index = 0;
civ.TERRAIN_FEATURE__NONE 			= index; index++;

civ.TERRAIN_FEATURE__RIVER 			= index; index++;
civ.TERRAIN_FEATURE__ANCIENT_RUINS	= index; index++;

civ.TERRAIN_FEATURE__ 				= index; index++;
civ.TERRAIN_FEATURE__ 				= index; index++;
civ.TERRAIN_FEATURE__ 				= index; index++;
civ.TERRAIN_FEATURE__ 				= index; index++;

///////////////////
var index = 0;
civ.BUILDING_TYPE__NONE 			= index; index++;

civ.BUILDING_TYPE__COLONY 			= index; index++;
civ.BUILDING_TYPE__FARM				= index; index++;
civ.BUILDING_TYPE__NATURAL_RESERVE 	= index; index++;
civ.BUILDING_TYPE__STONE_WALL		= index; index++;



civ.BUILDING_TYPE__ 				= index; index++;
civ.BUILDING_TYPE__ 				= index; index++;
civ.BUILDING_TYPE__ 				= index; index++;



/*

speechSynthesis.onvoiceschanged = function() {
      var msg = new SpeechSynthesisUtterance();
      msg.voice = this.getVoices().filter(v => v.name == 'Cellos')[0];
      msg.text = Object.keys(window).join(' ');
      this.speak(msg);
    };

*/