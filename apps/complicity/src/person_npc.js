btx.enum_goals = [
	["PERSON_GOAL__NONE", 					"none"],
	["PERSON_GOAL__WANDER_RANDOMLY", 		"wander randomly"],
	["PERSON_GOAL__WAIT", 					"wait"],
	["PERSON_GOAL__GO_INTO_HOUSE", 			"go into house"],
	["PERSON_GOAL__WANDER_AROUND_IN_HOUSE", "wander around house"],
]; btx.parse_enum(btx.enum_goals);

btx.person_goal_selection_functions = [
	// PERSON_GOAL__NONE
	function (person) {
		return 0;
	},
	// PERSON_GOAL__WANDER_RANDOMLY
	function (person)
	{
		if (person.inside_a_house && person.inside_house != -1 && person.inside_block != -1)
		{
			if (person.in_a_house_since < 30000)
			{
				return 0;
			}
			else
			{
				return person.in_a_house_since * 0.000001 * btx.game.near_noon;
			}
		}
		if (person.exhaustion <= 0.5)
		{
			return 0.1;
		}
		return 0;
	},
	// PERSON_GOAL__WAIT
	function (person)
	{
		if (person.inside_a_house)
		{
			return 1.0 - btx.game.near_noon + person.exhaustion * person.exhaustion;
		}
		return person.exhaustion * person.exhaustion;
	},
	// PERSON_GOAL__GO_INTO_HOUSE
	function (person)
	{
		if (person.inside_a_house)
		{
			return 0;
		}
		return (1.0 - person.exhaustion + (1 - btx.game.near_noon) * 4.0);
	},
	// PERSON_GOAL__WANDER_AROUND_IN_HOUSE
	function (person)
	{
		if (person.inside_a_house && person.inside_house != -1 && person.inside_block != -1)
		{
			return 0.1 + btx.game.near_noon;
		}
		return 0;
	},
];

btx.person_goal_selection_eligible = [
	[0,0],
	[0,0],
	[0,0],
	[0,0],
	[0,0],
];

btx.Person.prototype.pick_random_goal = function()
// adapted from http://roguebasin.roguelikedevelopment.org/index.php?title=Weighted_random_generator
{

	var max_roll = 0;
	var eligible_count = 0;
	for (var i = 0, len = btx.person_goal_selection_functions.length; i < len; i++)
	{
		var fitness = Math.max(0, btx.person_goal_selection_functions[i](this));
		if (fitness > 0)
		{
			btx.person_goal_selection_eligible[eligible_count][0] = i;
			btx.person_goal_selection_eligible[eligible_count][1] = fitness;
			max_roll += fitness;
			eligible_count++;
		}
	}
	if (eligible_count == 0)
	{
		return null;
	}
	var roll = Math.random() * max_roll;
	for (var i = 0; i < eligible_count; i++)
	{
		if (roll < btx.person_goal_selection_eligible[i][1])
		{
			return btx.person_goal_selection_eligible[i][0];
		}
		roll -= btx.person_goal_selection_eligible[i][1];
	}
};

btx.Person.prototype.decide_goal = function(forced_pick)
{
	//if (this.current_goal == btx.PERSON_GOAL__NONE)
	{
		var pick = forced_pick != -1 && forced_pick != undefined ? forced_pick : this.pick_random_goal();

		this.current_goal__time_left = 0;
		this.current_goal__target_pos_x = -1;
		this.current_goal__target_pos_y = -1;
		this.current_goal__target_node_id = -1;
		this.current_goal__target_block_id = -1;
		this.current_goal__target_house_id = -1;
		this.current_activity__time_left = 0;
		this.next_movement_target_pos_x = -1;
		this.next_movement_target_pos_y = -1;


		if (pick == btx.PERSON_GOAL__WANDER_RANDOMLY)
		{
			this.current_goal = btx.PERSON_GOAL__WANDER_RANDOMLY;
			this.previous_goal = btx.PERSON_GOAL__WANDER_RANDOMLY;
			this.current_activity = btx.PERSON_ACTION__NONE;
			this.pick_random_wander_target();
		}
		if (pick == btx.PERSON_GOAL__GO_INTO_HOUSE)
		{
			this.current_goal = btx.PERSON_GOAL__GO_INTO_HOUSE;
			this.previous_goal = btx.PERSON_GOAL__GO_INTO_HOUSE;
			this.current_activity = btx.PERSON_ACTION__NONE;

			this.pick_house_to_go_to();
		}
		else if (pick == btx.PERSON_GOAL__WAIT)
		{
			this.current_goal = btx.PERSON_GOAL__WAIT;
			this.previous_goal = btx.PERSON_GOAL__WAIT;
			this.current_activity = btx.PERSON_ACTION__NONE;
			this.current_goal__target_node_id = -1;
		}
		else if (pick == btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE)
		{
			this.current_goal = btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE;
			this.previous_goal = btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE;
			this.current_activity = btx.PERSON_ACTION__NONE;
			this.pick_random_house_wander_target();
		}
	}
}

btx.enum_activities = [
	["PERSON_ACTION__NONE",					"none"],
	["PERSON_ACTION__RUN_TO_SAFETY",		"run to safety"],
	["PERSON_ACTION__REST",					"rest"],
	["PERSON_ACTION__WAIT",					"wait"],
	["PERSON_ACTION__WALK_TO_POINT",		"walk to point"],
	["PERSON_ACTION__LEAVE_HOUSE",			"leave house"],
]; btx.parse_enum(btx.enum_activities);

btx.person_emergency_activity_selection_functions = [
	// PERSON_ACTION__NONE
	function (person) {return 11},
	// PERSON_ACTION__RUN_TO_SAFETY
	function (person)
	{
		if (person.on_a_street)
		{
			return 999999999999;
		}
		return 0;
	},
	// PERSON_ACTION__REST
	function (person)
	{
		if (person.exhaustion >= 0.85)
		{
			return (person.exhaustion - 0.85) * 5;
		}
		return 0;
	},
];

btx.person_emergency_activity_selection_eligible = [
	[0,0],
	[0,0],
	[0,0],
];

btx.Person.prototype.pick_emergency_activity = function()
// adapted from http://roguebasin.roguelikedevelopment.org/index.php?title=Weighted_random_generator
{
	var max_roll = 0;
	var eligible_count = 0;
	for (var i = 0, len = btx.person_emergency_activity_selection_functions.length; i < len; i++)
	{
		var fitness = Math.max(0, btx.person_emergency_activity_selection_functions[i](this));
		if (fitness > 0)
		{
			btx.person_emergency_activity_selection_eligible[eligible_count][0] = i;
			btx.person_emergency_activity_selection_eligible[eligible_count][1] = fitness;
			max_roll += fitness;
			eligible_count++;
		}
	}
	if (eligible_count == 0)
	{
		return null;
	}
	var roll = Math.random() * max_roll;
	for (var i = 0; i < eligible_count; i++)
	{
		if (roll < btx.person_emergency_activity_selection_eligible[i][1])
		{
			return btx.person_emergency_activity_selection_eligible[i][0];
		}
		roll -= btx.person_emergency_activity_selection_eligible[i][1];
	}
};

btx.Person.prototype.decide_emergency_activity = function()
{
	var pick = this.pick_emergency_activity();
	if (pick != 0 && pick != null && pick != undefined)
	{
		this.current_activity = pick;
		if (this.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY)
		{
			var closest_node_id = -1;
			var closest_node_dist = 99999999999999;
			for (var i = 0, len = btx.navmesh.nodes.length; i < len; i++)
			{
				var node = btx.navmesh.nodes[i];
				var dist = µ.distance2D(this.pos_x, this.pos_y, node.pos_x, node.pos_y);
				if (dist < closest_node_dist)
				{
					closest_node_dist = dist;
					closest_node_id = i;
				}
			}
			if (closest_node_id != -1)
			{
				var closest_node = btx.navmesh.nodes[closest_node_id];
				this.next_movement_target_pos_x = closest_node.pos_x;
				this.next_movement_target_pos_y = closest_node.pos_y;
			}
		}
		if (this.current_activity == btx.PERSON_ACTION__REST)
		{
			this.current_activity__time_left = 1500 + µ.rand(2500);
		}
	}
}


btx.Person.prototype.decide_activity = function(time_delta)
{
	if (this.current_goal == btx.PERSON_GOAL__WANDER_RANDOMLY)
	{
		// gotta leave the house first
		if (this.inside_a_house && this.inside_house != -1 && this.inside_block != -1)
		{
			this.current_activity = btx.PERSON_ACTION__LEAVE_HOUSE;
		}
		else
		{
			this.current_activity = btx.PERSON_ACTION__WALK_TO_POINT;
		}
		//this.pick_random_wander_target();

		if (this.next_movement_target_pos_x == -1)
		{
			this.pick_next_movement_target();
		}
	}
	else if (this.current_goal == btx.PERSON_GOAL__WAIT)
	{
		this.current_activity = btx.PERSON_ACTION__WAIT;
		this.current_activity__time_left = 500;
	}
	else if (this.current_goal == btx.PERSON_GOAL__GO_INTO_HOUSE)
	{
		this.current_activity = btx.PERSON_ACTION__WALK_TO_POINT;
		this.pick_next_movement_target();
	}
	else if (this.current_goal == btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE)
	{
		this.current_activity = btx.PERSON_ACTION__WALK_TO_POINT;
		this.pick_random_house_wander_target();
	}
}

btx.Person.prototype.determine_location = function()
{
	this.inside_block = -1;
	for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
	{
		var block = btx.cityblocks.cityblocks[i];
		if (
				this.pos_x > block.pos_x - block.size_x * 0.5
			&&	this.pos_x < block.pos_x + block.size_x * 0.5
			&&	this.pos_y > block.pos_y - block.size_y * 0.5
			&&	this.pos_y < block.pos_y + block.size_y * 0.5
			)
		{
			this.inside_block = i;
			break;
		}
	}
	this.on_a_street_crossing = false;
	for (var j = 0, len2 = btx.streets.street_crossings.length; j < len2; j++)
	{
		var street_crossing = btx.streets.street_crossings[j];
		if (street_crossing.is_horizontal)
		{
			if (	this.pos_x > street_crossing.start_x - btx.person_radius2
				&& 	this.pos_x < street_crossing.end_x + btx.person_radius2
				&& this.pos_y > street_crossing.start_y - btx.street_crossing_width
				&&	this.pos_y < street_crossing.start_y + btx.street_crossing_width
				)
			{
				this.on_a_street_crossing = true;
				break;
			}
		}
		else
		{
			if (	this.pos_y > street_crossing.start_y - btx.person_radius2
				&& 	this.pos_y < street_crossing.end_y + btx.person_radius2
				&& this.pos_x > street_crossing.start_x - btx.street_crossing_width
				&&	this.pos_x < street_crossing.start_x + btx.street_crossing_width
				)
			{
				this.on_a_street_crossing = true;
				break;
			}
		}
	}
	this.on_a_street = false;
	if (!this.on_a_street_crossing)
	{
		if (this.inside_block != -1)
		{
			var block = btx.cityblocks.cityblocks[this.inside_block];
			if (this.pos_x < block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 - btx.person_radius2)
			{
				this.on_a_street = true;
			}
			else if (this.pos_x > block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 + btx.person_radius2)
			{
				this.on_a_street = true;
			}
			else if (this.pos_y > block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 + btx.person_radius2)
			{
				this.on_a_street = true;
			}
			else if (this.pos_y < block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 - btx.person_radius2)
			{
				this.on_a_street = true;
			}
		}
	}
}

btx.Person.prototype.goal_done = function(time_delta)
{
	if (this.current_goal == btx.PERSON_GOAL__GO_INTO_HOUSE)
	{
		this.enter_house(this.current_goal__target_block_id, this.current_goal__target_house_id);
	}
}

btx.Person.prototype.activity_done = function(time_delta)
{
	this.current_activity__time_left = 0;
	this.next_distance_check = 0;
	if (this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE)
	{
		if (this.inside_a_house && this.inside_house != -1 && this.inside_block != -1)
		{
			this.leave_house(this.inside_block, this.inside_house);
		}
		this.next_movement_target_pos_x = -1;
		this.next_movement_target_pos_y = -1;
	}
	else if (	this.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY
			||	this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE
			||	this.current_activity == btx.PERSON_ACTION__WALK_TO_POINT)
	{
		this.next_movement_target_pos_x = -1;
		this.next_movement_target_pos_y = -1;
	}
}


btx.Person.prototype.check_goal_status = function(time_delta)
{
	if (this.current_goal == btx.PERSON_GOAL__WAIT)
	{
		return (this.current_activity__time_left <= 0);
	}
	else
	{
		if (this.next_goal_distance_check <= 0)
		{
			var dist_to_target = µ.distance2D(this.pos_x, this.pos_y, this.current_goal__target_pos_x, this.current_goal__target_pos_y);
			this.next_goal_distance_check = Math.max(100, dist_to_target * 500);

			if (this.current_goal == btx.PERSON_GOAL__WANDER_RANDOMLY)
			{
				return (dist_to_target < 0.25)
			}
			else if (this.current_goal == btx.PERSON_GOAL__GO_INTO_HOUSE)
			{
				return (dist_to_target < 0.15)
			}
			else if (this.current_goal == btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE)
			{
				return (dist_to_target < 0.25)
			}
		}
	}
}



btx.Person.prototype.check_activity_status = function(time_delta)
{
	if (	this.current_activity == btx.PERSON_ACTION__WAIT
		||	this.current_activity == btx.PERSON_ACTION__REST)
	{
		return (this.current_activity__time_left <= 0);
	}
	else if (	this.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY
			||	this.current_activity == btx.PERSON_ACTION__WALK_TO_POINT
			||	this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE)
	{
		if (this.next_distance_check <= 0)
		{
			var dist_to_target = µ.distance2D(this.pos_x, this.pos_y, this.next_movement_target_pos_x, this.next_movement_target_pos_y);
			this.next_distance_check = Math.max(100, dist_to_target * 500);
			return (dist_to_target < 0.35);
		}
	}
}

btx.Person.prototype.decide_input = function(time_delta)
{
	if (	this.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY
			||	this.current_activity == btx.PERSON_ACTION__WALK_TO_POINT
			||	this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE)
	{
		if (this.next_movement_target_pos_x != -1)
		{
			var angle = µ.vector2D_to_angle(this.next_movement_target_pos_x - this.pos_x, this.next_movement_target_pos_y - this.pos_y);
			this.move_direction(time_delta, angle, this.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY);
		}
		else
		{
			console.log('~#~', this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE, this.next_movement_target_pos_x);
		}
	}
}


btx.Person.prototype.pick_next_movement_target = function()
{
	if (this.current_activity == btx.PERSON_ACTION__LEAVE_HOUSE)
	{
		if (this.inside_a_house && this.inside_house != -1 && this.inside_block != -1)
		{
			var block = btx.cityblocks.cityblocks[this.inside_block];
			var house = block.houses[this.inside_house];
			this.next_movement_target_pos_x = house.door_x;
			this.next_movement_target_pos_y = house.door_y;
		}
		else
		{
			console.log('I wanna leave the house but I am already outside?')
		}
		return;
	}

	var closest_node_id = -1;
	var closest_node_dist = 99999999999999;
	for (var i = 0, len = btx.navmesh.nodes.length; i < len; i++)
	{
		var node = btx.navmesh.nodes[i];
		var dist = µ.distance2D(this.pos_x, this.pos_y, node.pos_x, node.pos_y);
		if (dist < closest_node_dist)
		{
			closest_node_dist = dist;
			closest_node_id = i;
		}
	}
	if (closest_node_id != -1)
	{
		var closest_node = btx.navmesh.nodes[closest_node_id];
		// we are not actually *at* the closest node, get there first
		if (closest_node_dist > 0.5)
		{
			this.next_movement_target_pos_x = closest_node.pos_x;
			this.next_movement_target_pos_y = closest_node.pos_y;

		}
		else
		{
			var closest_node2_id = -1;
			var closest_node2_dist = 99999999999999;
			var closest_node = btx.navmesh.nodes[closest_node_id];
			for (var i = 0, len = closest_node.connected_to.length; i < len; i++)
			{
				var node2 = btx.navmesh.nodes[closest_node.connected_to[i]];
				var dist = btx.navmesh.nodeflows[this.current_goal__target_node_id][closest_node.connected_to[i]];
				if (dist < closest_node2_dist)
				{
					closest_node2_dist = dist;
					closest_node2_id = i;
				}
			}
			if (closest_node2_id != -1)
			{
				var node2 = btx.navmesh.nodes[closest_node.connected_to[closest_node2_id]];
				this.next_movement_target_pos_x = node2.pos_x;
				this.next_movement_target_pos_y = node2.pos_y;
			}
		}
	}
}

btx.Person.prototype.pick_house_to_go_to = function()
{
	//this.door_navmesh_node_id
	var found_one = false;
	while (!found_one)
	{
		var block_id = µ.rand_int(btx.cityblocks.cityblocks.length - 1);
		var block = btx.cityblocks.cityblocks[block_id];
		if (block.houses.length > 0)
		{
			var house_id = µ.rand_int(block.houses.length - 1);
			var house = block.houses[house_id];
			found_one = true
			var node_id = house.door_navmesh_node_id
			var node = btx.navmesh.nodes[node_id];
		}
/*
		var node_id = µ.rand_int(btx.navmesh.nodes.length - 1);
		var node = btx.navmesh.nodes[node_id];
		if (node.type == btx.NAVMESH_NODE_TYPE__HOUSE_DOOR)
		{
			found_one = true;
		}
*/
	}
	this.current_goal__target_pos_x = node.pos_x;
	this.current_goal__target_pos_y = node.pos_y;
	this.current_goal__target_node_id = node_id;
	this.current_goal__target_block_id = block_id;
	this.current_goal__target_house_id = house_id;

}

btx.Person.prototype.pick_random_wander_target = function()
{
	var node_id = µ.rand_int(btx.navmesh.nodes.length - 1);
	var node = btx.navmesh.nodes[node_id];
	this.current_goal__target_pos_x = node.pos_x;
	this.current_goal__target_pos_y = node.pos_y;
	this.current_goal__target_node_id = node_id;
	this.current_goal__target_block_id = -1;
	this.current_goal__target_house_id = -1;
}

btx.Person.prototype.pick_random_house_wander_target = function()
{
	var block = btx.cityblocks.cityblocks[this.inside_block];
	var house = block.houses[this.inside_house];
	this.current_goal__target_pos_x = house.pos_x - house.size_x * 0.5 + btx.person_radius * 1.0 + µ.rand(house.size_x - btx.person_radius * 2.0);
	this.current_goal__target_pos_y = house.pos_y - house.size_y * 0.5 + btx.person_radius * 1.0 + µ.rand(house.size_y - btx.person_radius * 2.0);
	this.current_goal__target_node_id = -1;
	this.current_goal__target_block_id = this.inside_block;
	this.current_goal__target_house_id = this.inside_house;
	this.current_goal__target_node_id = -1;
	this.next_movement_target_pos_x = this.current_goal__target_pos_x;
	this.next_movement_target_pos_y = this.current_goal__target_pos_y;
	this.current_activity__time_left = -1;
}