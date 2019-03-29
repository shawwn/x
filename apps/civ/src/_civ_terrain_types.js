// TERRAIN TYPES
civ.terrain_types = [];

var index = 0;

// LAYER

/*
*/

civ.TERRAIN_TYPE__NONE 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__NONE] = {
	name:							'None',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							0,
	min_elevation:					0,
	max_elevation:					1,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					1,

	can_walk:							true,
	can_swimb:							true,
	can_climb:							true,
	can_drive:							true,

};

civ.TERRAIN_TYPE__OCEAN 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__OCEAN] = {
	name:							'Ocean',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__FISH,
	harvestable_resource1_amount: 	100,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.1,
	min_elevation:					0,
	max_elevation:					.45,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					1,
};

// LAYER

civ.TERRAIN_TYPE__FROZEN_OCEAN = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__FROZEN_OCEAN] = {
	name:							'Frozen Ocean',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.425,
	max_elevation:					.5,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0,
	max_temperature:				0.4,
	min_vegetation:					0,
	max_vegetation:					1,
};

civ.TERRAIN_TYPE__CORAL_REEF 	= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__CORAL_REEF] = {
	name:							'Coral Reef',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__FISH,
	harvestable_resource1_amount: 	50,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							100,
	min_elevation:					.425,
	max_elevation:					.5,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0.5,
	max_temperature:				1,
	min_vegetation:					0.8,
	max_vegetation:					1,
};

civ.TERRAIN_TYPE__SHALLOW_OCEAN 	= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SHALLOW_OCEAN] = {
	name:							'Shallow Ocean',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__FISH,
	harvestable_resource1_amount: 	50,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.45,
	max_elevation:					.5,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0.2,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					1,
};

// LAYER

civ.TERRAIN_TYPE__BEACH 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__BEACH] = {
	name:							'Beach',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	3,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							0.8,
	min_elevation:					.5,
	max_elevation:					.525,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					1,
};

// LAYER

civ.TERRAIN_TYPE__ICE 				= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ICE] = {
	name:							'Ice',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__FISH,
	harvestable_resource1_amount: 	5,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.5,
	min_elevation:					.4,
	max_elevation:					1,
	min_humidity:					0,
	max_humidity:					1,
	min_temperature:				0,
	max_temperature:				.25,
	min_vegetation:					0,
	max_vegetation:					1,
};


civ.TERRAIN_TYPE__PLAINS 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__PLAINS] = {
	name:							'Plains',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WHEAT,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1.2,
	min_elevation:					0.525,
	max_elevation:					0.75,
	min_humidity:					0.3,
	max_humidity:					0.7,
	min_temperature:				0.25,
	max_temperature:				0.75,
	min_vegetation:					0.2,
	max_vegetation:					0.5,
};

civ.TERRAIN_TYPE__DESERT 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__DESERT] = {
	name:							'Desert',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	5,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							2,
	min_elevation:					0.5,
	max_elevation:					0.75,
	min_humidity:					0,
	max_humidity:					0.3,
	min_temperature:				0.7,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					0.2,
};


civ.TERRAIN_TYPE__ARID_PLAINS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ARID_PLAINS] = {
	name:							'Arid Plains',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							100,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.0,
	max_humidity:					.5,
	min_temperature:				.35,
	max_temperature:				.9,
	min_vegetation:					0,
	max_vegetation:					.3
};

civ.TERRAIN_TYPE__ARID_SHRUBLAND		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ARID_SHRUBLAND] = {
	name:							'Arid Shrubland',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							10,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.1,
	max_humidity:					.5,
	min_temperature:				.35,
	max_temperature:				1,
	min_vegetation:					.1,
	max_vegetation:					.4,
};


civ.TERRAIN_TYPE__ARID_FOREST		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ARID_FOREST] = {
	name:							'Arid Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							10,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.2,
	max_humidity:					.5,
	min_temperature:				.45,
	max_temperature:				1,
	min_vegetation:					.3,
	max_vegetation:					.6,
};



civ.TERRAIN_TYPE__ARID_JUNGLE		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ARID_JUNGLE] = {
	name:							'Arid Jungle',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							10,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.3,
	max_humidity:					.5,
	min_temperature:				.5,
	max_temperature:				1,
	min_vegetation:					.5,
	max_vegetation:					1,
};


civ.TERRAIN_TYPE__ARID_HILLS 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__ARID_HILLS] = {
	name:							'Arid Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							100,
	min_elevation:					.7,
	max_elevation:					.95,
	min_humidity:					0,
	max_humidity:					.5,
	min_temperature:				.15,
	max_temperature:				1,
	min_vegetation:					.0,
	max_vegetation:					.3,
};



civ.TERRAIN_TYPE__GRASS_SAVANNAH		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__GRASS_SAVANNAH] = {
	name:							'Grass Savannah',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					0.0,
	max_humidity:					0.5,
	min_temperature:				0.65,
	max_temperature:				1.0,
	min_vegetation:					0.1,
	max_vegetation:					0.5,
};


civ.TERRAIN_TYPE__SHRUB_SAVANNAH		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SHRUB_SAVANNAH] = {
	name:							'Shrub Savannah',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					0.0,
	max_humidity:					0.5,
	min_temperature:				0.65,
	max_temperature:				1.0,
	min_vegetation:					0.4,
	max_vegetation:					0.7,
};


civ.TERRAIN_TYPE__TREE_SAVANNAH		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TREE_SAVANNAH] = {
	name:							'Tree Savannah',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					0.0,
	max_humidity:					0.5,
	min_temperature:				0.65,
	max_temperature:				1.0,
	min_vegetation:					0.65,
	max_vegetation:					1.0,
};



civ.TERRAIN_TYPE__GRASS_SAVANNAH_HILLS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__GRASS_SAVANNAH_HILLS] = {
	name:							'Grass Savannah Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.7,
	max_elevation:					.95,
	min_humidity:					0.0,
	max_humidity:					0.5,
	min_temperature:				0.65,
	max_temperature:				1.0,
	min_vegetation:					0.1,
	max_vegetation:					0.5,
};


civ.TERRAIN_TYPE__SHRUB_SAVANNAH_HILLS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SHRUB_SAVANNAH_HILLS] = {
	name:							'Shrub Savannah Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.7,
	max_elevation:					.95,
	min_humidity:					0.0,
	max_humidity:					0.5,
	min_temperature:				0.65,
	max_temperature:				1.0,
	min_vegetation:					0.4,
	max_vegetation:					0.7,
};


civ.TERRAIN_TYPE__TREE_SAVANNAH_HILLS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TREE_SAVANNAH_HILLS] = {
	name:							'Tree Savannah Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.7,
	max_elevation:					.95,
	min_humidity:					.0,
	max_humidity:					.5,
	min_temperature:				.65,
	max_temperature:				1,
	min_vegetation:					.65,
	max_vegetation:					1,
};



civ.TERRAIN_TYPE__STEPPE		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__STEPPE] = {
	name:							'Steppe',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,
	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.1,
	max_humidity:					0.4,
	min_temperature:				.3,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					.3,
};

civ.TERRAIN_TYPE__MUD		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MUD] = {
	name:							'Mud',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,
	weight:							0.5,
	min_elevation:					.525,
	max_elevation:					.6,
	min_humidity:					.3,
	max_humidity:					1,
	min_temperature:				.3,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					.3,
};


civ.TERRAIN_TYPE__MUD_PLAINS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MUD_PLAINS] = {
	name:							'Mud Plains',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.5,
	min_elevation:					.6,
	max_elevation:					.85,
	min_humidity:					.3,
	max_humidity:					1,
	min_temperature:				.3,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					.3,
};


civ.TERRAIN_TYPE__MUD_HILLS		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MUD_HILLS] = {
	name:							'Mud Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	10,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.5,
	min_elevation:					.7,
	max_elevation:					.9,
	min_humidity:					.3,
	max_humidity:					1,
	min_temperature:				.3,
	max_temperature:				1,
	min_vegetation:					0,
	max_vegetation:					.3,
};

civ.TERRAIN_TYPE__TUNDRA = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TUNDRA] = {
	name:							'Tundra',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					0,
	max_humidity:					.8,
	min_temperature:				.1,
	max_temperature:				.4,
	min_vegetation:					0,
	max_vegetation:					.3,
};

civ.TERRAIN_TYPE__WETLANDS = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__WETLANDS] = {
	name:							'Wetlands',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							.75,
	min_elevation:					.55,
	max_elevation:					.85,
	min_humidity:					.5,
	max_humidity:					1,
	min_temperature:				.2,
	max_temperature:				1,
	min_vegetation:					.2,
	max_vegetation:					.4,
};

civ.TERRAIN_TYPE__SWAMP = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SWAMP] = {
	name:							'Swamp',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.5,
	max_humidity:					1,
	min_temperature:				.2,
	max_temperature:				1,
	min_vegetation:					.0,
	max_vegetation:					.3,
};

civ.TERRAIN_TYPE__SHRUB_SWAMP = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SHRUB_SWAMP] = {
	name:							'Shrub Swamp',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					.525,
	max_elevation:					.85,
	min_humidity:					.5,
	max_humidity:					1,
	min_temperature:				.2,
	max_temperature:				1,
	min_vegetation:					.25,
	max_vegetation:					.5,
};

civ.TERRAIN_TYPE__SWAMP_FOREST = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SWAMP_FOREST] = {
	name:							'Swamp Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.85,
	min_humidity:					0.5,
	max_humidity:					1.0,
	min_temperature:				0.2,
	max_temperature:				1.0,
	min_vegetation:					0.4,
	max_vegetation:					1.0,
};

civ.TERRAIN_TYPE__SWAMP_FOREST_HILLS = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SWAMP_FOREST_HILLS] = {
	name:							'Swamp Forest Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.7,
	max_elevation:					0.9,
	min_humidity:					0.5,
	max_humidity:					1.0,
	min_temperature:				0.2,
	max_temperature:				1.0,
	min_vegetation:					0.4,
	max_vegetation:					1.0,
};

civ.TERRAIN_TYPE__MARSH = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MARSH] = {
	name:							'Marsh',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.6,
	min_humidity:					0.5,
	max_humidity:					1.0,
	min_temperature:				0.3,
	max_temperature:				0.85,
	min_vegetation:					0.1,
	max_vegetation:					0.5,
};


civ.TERRAIN_TYPE__MARSH_MEADOW = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MARSH_MEADOW] = {
	name:							'Marsh Meadow',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.6,
	max_elevation:					0.8,
	min_humidity:					0.5,
	max_humidity:					1.0,
	min_temperature:				0.3,
	max_temperature:				0.85,
	min_vegetation:					0.1,
	max_vegetation:					0.5,
};

civ.TERRAIN_TYPE__SHRUBLAND 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SHRUBLAND] = {
	name:							'Shrubland',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WOOD,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.85,
	min_humidity:					0.2,
	max_humidity:					0.7,
	min_temperature:				0.2,
	max_temperature:				0.75,
	min_vegetation:					0.25,
	max_vegetation:					0.5,
};

civ.TERRAIN_TYPE__LIGHT_FOREST 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__LIGHT_FOREST] = {
	name:							'Light Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WOOD,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.85,
	min_humidity:					0.2,
	max_humidity:					0.7,
	min_temperature:				0.2,
	max_temperature:				0.75,
	min_vegetation:					0.4,
	max_vegetation:					0.7,
};

civ.TERRAIN_TYPE__FOREST 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__FOREST] = {
	name:							'Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WOOD,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.8,
	min_humidity:					0.3,
	max_humidity:					1.0,
	min_temperature:				0.3,
	max_temperature:				0.7,
	min_vegetation:					0.6,
	max_vegetation:					1,
};

civ.TERRAIN_TYPE__BOREAL_FOREST = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__BOREAL_FOREST] = {
	name:							'Boreal Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1.5,
	min_elevation:					0.525,
	max_elevation:					0.85,
	min_humidity:					0,
	max_humidity:					0.6,
	min_temperature:				0.1,
	max_temperature:				0.5,
	min_vegetation:					0.5,
	max_vegetation:					1,
};

civ.TERRAIN_TYPE__TAIGA = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TAIGA] = {
	name:							'Taiga',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.85,
	min_humidity:					0,
	max_humidity:					0.8,
	min_temperature:				0.1,
	max_temperature:				0.35,
	min_vegetation:					0.3,
	max_vegetation:					0.7,
};


civ.TERRAIN_TYPE__TROPICAL_FOREST			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TROPICAL_FOREST] = {
	name:							'Tropical Forest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WOOD,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.9,
	min_humidity:					0.55,
	max_humidity:					0.9,
	min_temperature:				0.6,
	max_temperature:				0.9,
	min_vegetation:					0.6,
	max_vegetation:					1,
};


civ.TERRAIN_TYPE__TROPICAL_RAINFOREST			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__TROPICAL_RAINFOREST] = {
	name:							'Tropical Rainforest',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__WOOD,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.525,
	max_elevation:					0.9,
	min_humidity:					0.75,
	max_humidity:					1.0,
	min_temperature:				0.6,
	max_temperature:				0.9,
	min_vegetation:					0.6,
	max_vegetation:					1,
};


civ.TERRAIN_TYPE__LOW_HILLS = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__LOW_HILLS] = {
	name:							'Low Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							0.75,
	min_elevation:					0.65,
	max_elevation:					0.85,
	min_humidity:					0.3,
	max_humidity:					0.7,
	min_temperature:				0.3,
	max_temperature:				0.8,
	min_vegetation:					0,
	max_vegetation:					1,
};

// LAYER

civ.TERRAIN_TYPE__HILLS 			= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__HILLS] = {
	name:							'Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.7,
	max_elevation:					0.9,
	min_humidity:					0.2,
	max_humidity:					1.0,
	min_temperature:				0.3,
	max_temperature:				0.8,
	min_vegetation:					0.0,
	max_vegetation:					1.0,
};

// LAYER

civ.TERRAIN_TYPE__MOUNTAINS 		= index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__MOUNTAINS] = {
	name:							'Mountains',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__STONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1.2,
	min_elevation:					0.85,
	max_elevation:					1.0,
	min_humidity:					0.0,
	max_humidity:					1.0,
	min_temperature:				0.2,
	max_temperature:				1.0,
	min_vegetation:					0.0,
	max_vegetation:					1.0,
};

civ.TERRAIN_TYPE__SNOWY_MOUNTAINS = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SNOWY_MOUNTAINS] = {
	name:							'Snowy Mountains',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.85,
	max_elevation:					1.0,
	min_humidity:					0.0,
	max_humidity:					1.0,
	min_temperature:				0.0,
	max_temperature:				0.3,
	min_vegetation:					0.0,
	max_vegetation:					1.0,
};

civ.TERRAIN_TYPE__SNOWY_HILLS = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__SNOWY_HILLS] = {
	name:							'Snowy Hills',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,

	weight:							1,
	min_elevation:					0.7,
	max_elevation:					0.95,
	min_humidity:					0.0,
	max_humidity:					1.0,
	min_temperature:				0.0,
	max_temperature:				0.3,
	min_vegetation:					0.0,
	max_vegetation:					1.0,
};

civ.TERRAIN_TYPE__COUNT = index; index++;
console.log('terrain type count', civ.TERRAIN_TYPE__COUNT);

/*
civ.TERRAIN_TYPE__ = index; index++;
civ.terrain_types[civ.TERRAIN_TYPE__] = {
	name:							'-',
	harvestable_resource1_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource1_amount: 	0,
	harvestable_resource2_type: 	civ.RESOURCE_TYPE__NONE,
	harvestable_resource2_amount: 	0,
};
*/
