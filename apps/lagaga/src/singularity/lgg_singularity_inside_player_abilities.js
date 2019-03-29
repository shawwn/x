"use strict";

//	default slots: -1 none, 0 up, 1 right, 2 down, 3 left
lgg.singularityinside_player_abilities = [
	{
		title:			'Fireball',
		key:			'KEY_LMB',
		max_levels:		0,
		constructor:	lgg.SingularityInside_Ability__Fireball,
	},
	{
		title:			'Haste',
		key:			'KEY_H',
		max_levels:		0,
		constructor:	lgg.SingularityInside_Ability__Haste,
	},
	{
		title:			'Eye',
		key:			'KEY_E',
		max_levels:		5, // up to 3 eyes, improved eyes (speed, durability, sight range)
		constructor:	lgg.SingularityInside_Ability__RemoteEye,
	},
	{
		title:			'Slo-mo',
		key:			'KEY_C',
		max_levels:		0,
		constructor:	lgg.SingularityInside_Ability__Slomo,
	},
	{
		title:			'Exit Finder',
		key:			'KEY_X',
		max_levels:		0,
		constructor:	lgg.SingularityInside_Ability__ExitFinder,
	},
/*
	Map
	Cloak
	Dig (?)
	Drag (Blocks, Enemies, 
	Detect Enemy
	Exit Finder
	Grenades
	Telescope
	{
		title:			'',
		default_slot:	-1,
		constructor:	lgg.SingularityInside_Ability__,
	},
*/
];