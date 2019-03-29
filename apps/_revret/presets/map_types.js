rvr.presets.map_types = [];

rvr.presets.map_types.push(
	{
		name: 			'treasure_map',
		description: 	'',
		weight: 		0.02,
		parameters:
		{
			'spawners_acivate_after' 	: 60,
		},

		factors:
		{
			'loot'						: 5, 
			'min_number_of_spawners'	: 5,
			'max_number_of_spawners'	: 5,
			'drone_movement_speed'		: 1,
		}
		flags:
		{
			'spawners_start_inactive' 	: true,
			'exit_activates_spawners' 	: true,
			'start_without_agents' 		: true,
		},
	}

);