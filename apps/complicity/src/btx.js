"use strict";


var btx = {};

btx.parse_enum = function(enum_list)
{
	for (var i = 0, len = enum_list.length; i < len; i++)
	{
		btx[enum_list[i][0]] = i;
	}
};

var inc = 0;
btx.CITYBLOCK_TYPE__EMPTY_LOT 			= inc++;
btx.CITYBLOCK_TYPE__RUINED_LOT 			= inc++;
btx.CITYBLOCK_TYPE__PUBLIC_PARK			= inc++;
btx.CITYBLOCK_TYPE__APARTMENTS 			= inc++;
btx.CITYBLOCK_TYPE__PLAYGROUND			= inc++;
btx.CITYBLOCK_TYPE__SHOPS 				= inc++;
btx.CITYBLOCK_TYPE__VILLA 				= inc++;
btx.CITYBLOCK_TYPE__HOSPITAL			= inc++;
btx.CITYBLOCK_TYPE__POLICE_STATION		= inc++;
btx.CITYBLOCK_TYPE__OFFICES 			= inc++;
btx.CITYBLOCK_TYPE__HEAVY_INDUSTRY		= inc++;
btx.CITYBLOCK_TYPES_COUNT 				= inc++;

btx.cityblock_types = [];

for (var i = 0; i < btx.CITYBLOCK_TYPES_COUNT; i++)
{
	btx.cityblock_types[i] = {

		name:				"",
		count:				0,
		probability: 		0.2,
		min_dist_to_same:	-1,
		max_num_total:		-1,
		min_size_x:			-1,
		min_size_y:			-1,
		min_area:			-1,
		max_size_x:			-1,
		max_size_y:			-1,
		max_area:			-1,
	};
}

btx.cityblock_types[btx.CITYBLOCK_TYPE__EMPTY_LOT] = {
	name:				"Empty Lot",
	count:				0,
	probability: 		0.02,
	min_dist_to_same:	100,
	max_num_total:		-1,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__RUINED_LOT] = {
	name:				"Ruined Lot",
	count:				0,
	probability: 		0.01,
	min_dist_to_same:	100,
	max_num_total:		-1,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			10,
	max_size_y:			10,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__PUBLIC_PARK] = {
	name:				"Public Park",
	count:				0,
	probability: 		0.25,
	min_dist_to_same:	40,
	max_num_total:		-1,
	min_size_x:			10,
	min_size_y:			10,
	min_area:			-1,
	max_size_x:			50,
	max_size_y:			50,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__APARTMENTS] = {
	name:				"Apartment",
	count:				0,
	probability: 		0.85,
	min_dist_to_same:	30,
	max_num_total:		-1,
	min_size_x:			4,
	min_size_y:			4,
	min_area:			30,
	max_size_x:			50,
	max_size_y:			50,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__PLAYGROUND] = {
	name:				"Playground",
	count:				0,
	probability: 		0.8,
	min_dist_to_same:	10,
	max_num_total:		-1,
	min_size_x:			4,
	min_size_y:			4,
	min_area:			16,
	max_size_x:			20,
	max_size_y:			20,
	max_area:			400,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__SHOPS] = {
	name:				"Shops",
	count:				0,
	probability: 		0.5,
	min_dist_to_same:	20,
	max_num_total:		-1,
	min_size_x:			10,
	min_size_y:			10,
	min_area:			-1,
	max_size_x:			40,
	max_size_y:			40,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__VILLA] = {
	name:				"Villa",
	count:				0,
	probability: 		0.5,
	min_dist_to_same:	30,
	max_num_total:		-1,
	min_size_x:			10,
	min_size_y:			10,
	min_area:			-1,
	max_size_x:			80,
	max_size_y:			80,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__HOSPITAL] = {
	name:				"Hospital",
	count:				0,
	probability: 		0.75,
	min_dist_to_same:	150,
	max_num_total:		10,
	min_size_x:			10,
	min_size_y:			10,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__POLICE_STATION] = {
	name:				"Police Station",
	count:				0,
	probability: 		0.5,
	min_dist_to_same:	100,
	max_num_total:		15,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__OFFICES] = {
	name:				"Offices",
	count:				0,
	probability: 		0.2,
	min_dist_to_same:	40,
	max_num_total:		-1,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

btx.cityblock_types[btx.CITYBLOCK_TYPE__HEAVY_INDUSTRY] = {
	name:				"Heavy Industry",
	count:				0,
	probability: 		0.3,
	min_dist_to_same:	50,
	max_num_total:		-1,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

/*

btx.cityblock_types[] = {
	count:				0,
	probability: 		0.2,
	min_dist_to_same:	100,
	max_num_total:		2,
	min_size_x:			-1,
	min_size_y:			-1,
	min_area:			-1,
	max_size_x:			-1,
	max_size_y:			-1,
	max_area:			-1,
};

*/


/*

cemetery
electronics store
bakery
flower shop
pharmacy
tattoo parlor
café
bar
tennis court
golf course
concert hall
library
prison

*/


var inc = 0;

btx.HOUSE_TYPE__RUIN 				= inc++;
btx.HOUSE_TYPE__VILLA 				= inc++;
btx.HOUSE_TYPE__HOSPITAL 			= inc++;
btx.HOUSE_TYPE__POLICE_STATION		= inc++;


// many
btx.HOUSE_TYPE__PARKING_LOT 			= inc++;

// apartments
btx.HOUSE_TYPE__APARTMENT 			= inc++;
btx.HOUSE_TYPE__DOCUMENT_FORGER		= inc++;
btx.HOUSE_TYPE__GANG_HIDEOUT		= inc++;

// shops
btx.HOUSE_TYPE__SHOP 					= inc++;
btx.HOUSE_TYPE__CAR_MECHANIC 			= inc++;
btx.HOUSE_TYPE__GROCERY_STORE 			= inc++;
btx.HOUSE_TYPE__CLOTHING_STORE			= inc++;
btx.HOUSE_TYPE__HAIR_SALON 				= inc++;
btx.HOUSE_TYPE__COSMETIC_SURGEON		= inc++;
btx.HOUSE_TYPE__WEAPON_SHOP				= inc++;
btx.HOUSE_TYPE__NIGHT_CLUB 				= inc++;
btx.HOUSE_TYPE__GAS_STATION				= inc++;
btx.HOUSE_TYPE__RESTAURANT				= inc++;

// offices
btx.HOUSE_TYPE__OFFICE 					= inc++;
btx.HOUSE_TYPE__INSURANCE_OFFICE		= inc++;
btx.HOUSE_TYPE__APP_SWEATSHOP			= inc++;

// heavy industries
btx.HOUSE_TYPE__WAREHOUSE 				= inc++;
btx.HOUSE_TYPE__POWER_PLANT 			= inc++;
btx.HOUSE_TYPE__WASTE_DISPOSAL 			= inc++;

btx.HOUSE_TYPE__ 				= inc++;

btx.house_types = [];

btx.house_types[btx.HOUSE_TYPE__PARKING_LOT] = {
	name:				"Parking Lot",
};

btx.house_types[btx.HOUSE_TYPE__RUIN] = {
	name:				"Ruin",
};

btx.house_types[btx.HOUSE_TYPE__VILLA] = {
	name:				"Villa",
};

btx.house_types[btx.HOUSE_TYPE__HOSPITAL] = {
	name:				"Hospital",
};

btx.house_types[btx.HOUSE_TYPE__POLICE_STATION] = {
	name:				"Police Station",
};

// apartments

btx.house_types[btx.HOUSE_TYPE__APARTMENT] = {
	name:				"Apartment",
};

btx.house_types[btx.HOUSE_TYPE__DOCUMENT_FORGER] = {
	name:				"Document Forger",
};

btx.house_types[btx.HOUSE_TYPE__GANG_HIDEOUT] = {
	name:				"Gang Hideout",
};

// shops

btx.house_types[btx.HOUSE_TYPE__SHOP] = {
	name:				"Shop",
};

btx.house_types[btx.HOUSE_TYPE__CAR_MECHANIC] = {
	name:				"Car Mechanic",
};

btx.house_types[btx.HOUSE_TYPE__GROCERY_STORE] = {
	name:				"Grocery Store",
};

btx.house_types[btx.HOUSE_TYPE__CLOTHING_STORE] = {
	name:				"Clothing Store",
};

btx.house_types[btx.HOUSE_TYPE__HAIR_SALON] = {
	name:				"Hair Salon",
};

btx.house_types[btx.HOUSE_TYPE__COSMETIC_SURGEON] = {
	name:				"Cpsmetic Surgeon",
};

btx.house_types[btx.HOUSE_TYPE__WEAPON_SHOP] = {
	name:				"Weapon Shop",
};

btx.house_types[btx.HOUSE_TYPE__NIGHT_CLUB] = {
	name:				"Night Club",
};

btx.house_types[btx.HOUSE_TYPE__GAS_STATION] = {
	name:				"Gas Station",
};

btx.house_types[btx.HOUSE_TYPE__RESTAURANT] = {
	name:				"Restaurant",
};

// offices

btx.house_types[btx.HOUSE_TYPE__OFFICE] = {
	name:				"Office",
};

btx.house_types[btx.HOUSE_TYPE__INSURANCE_OFFICE] = {
	name:				"Insurance Office",
};

btx.house_types[btx.HOUSE_TYPE__APP_SWEATSHOP] = {
	name:				"App Sweatshop",
};


// heavy industries

btx.house_types[btx.HOUSE_TYPE__WAREHOUSE] = {
	name:				"Warehouse",
};
btx.house_types[btx.HOUSE_TYPE__POWER_PLANT] = {
	name:				"Power Plant",
};
btx.house_types[btx.HOUSE_TYPE__WASTE_DISPOSAL] = {
	name:				"Waste Disposal",
};

/*

btx.house_types[] = {
	name:				"",
};

*/

var inc = 0;
btx.JOB_TYPE__COP 				= inc++;
btx.JOB_TYPE__PARAMEDIC			= inc++;
btx.JOB_TYPE__STORE_CLERK		= inc++;
btx.JOB_TYPE__ 				= inc++;

btx.job_types = [];

btx.job_types[btx.JOB_TYPE__COP] = {

	min_agility:				-1,
	min_strength:				-1,

}

var inc = 0;
btx.DEBUG_OPTION__ENABLE_LIGHTS 							= inc++;
btx.DEBUG_OPTION__SHOW_ONLY_LIGHTS 							= inc++;
btx.DEBUG_OPTION__DRAW_CLOUDS 								= inc++;
btx.DEBUG_OPTION__GANGS_AND_COPS							= inc++;
btx.DEBUG_OPTION__SHOW_NAVMESH_NODES 						= inc++;
btx.DEBUG_OPTION__SHOW_CONNECTIONS_BETWEEN_NAVMESH_NODES 	= inc++;
btx.DEBUG_OPTION__SHOW_PERSON_NAVIGATION 					= inc++;
btx.DEBUG_OPTION__SHOW_PERSON_AI 							= inc++;
btx.DEBUG_OPTION__TIMESCALE 								= inc++;
btx.DEBUG_OPTION__DAYCYCLE_SCALE							= inc++;
btx.DEBUG_OPTION__SHOW_WEATHER_VARS							= inc++;
btx.DEBUG_OPTION__BLOOM_THRESHOLD							= inc++;
btx.DEBUG_OPTION__BLOOM_STRENGTH							= inc++;
btx.DEBUG_OPTION__LIGHT_AMPLIFICATION						= inc++;


btx.options_debug = [
	{ name: 'enable light',								type: 'bool', default: true },
	{ name: 'show only lights',							type: 'bool', default: false },
	{ name: 'draw clouds', 								type: 'bool', default: false },
	{ name: 'show gangs & cops',						type: 'bool', default: false },
	{ name: 'show navmesh nodes', 						type: 'bool', default: false },
	{ name: 'show connections between navmesh nodes', 	type: 'bool', default: false },
	{ name: 'show person navigation',				 	type: 'bool', default: false },
	{ name: 'show person AI',				 			type: 'bool', default: false },
	{ name: 'timescale', 								type: 'list', default: 0, values: [0, 0.1, 0.5, 1, 2, 4, 8, 16, 32]},
	{ name: 'daycycle_scale', 							type: 'list', default: 1, values: [0, 1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]},
	{ name: 'show weather variables',				 	type: 'bool', default: false },
	{ name: 'bloom threshold',	 						type: 'list', default: 0, values: [0.001, 0.1, .25, .5, .75, .8, .85, .90, .925, .95]},
	{ name: 'bloom strength',	 						type: 'list', default: 0, values: [0, .1, .25, .5, .75, 1, 1.5, 2, 3, 4, 8, 12]},
	{ name: 'light amplification',						type: 'list', default: 10, values: [0.0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64]},
];


function get_bool_option(option)
{
	return (option == '1');
}

btx.options_debug_values = [];

var force_options_reload = false;

for (var i = 0, len = btx.options_debug.length; i < len; i++)
{
	var cookie_name = "complicity_option_" + i;
	if (btx.options_debug[i].type == 'bool')
	{
		btx.options_debug_values[i] = btx.options_debug[i].default;
		btx.options_debug_values[i] = !force_options_reload && localStorage.getItem(cookie_name) != null ? get_bool_option(localStorage.getItem(cookie_name)) : (btx.options_debug[i].default ? true : false);
	}
	if (btx.options_debug[i].type == 'list')
	{
		btx.options_debug_values[i] = btx.options_debug[i].values[btx.options_debug[i].default];
		btx.options_debug_values[i] = !force_options_reload && localStorage.getItem(cookie_name) != null ? localStorage.getItem(cookie_name) : btx.options_debug[i].values[btx.options_debug[i].default];
	}
}

