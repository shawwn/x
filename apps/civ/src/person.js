'use strict';


var index = 0;
civ.PERSON_LOCATION__NONE 					= index; index++;
civ.PERSON_LOCATION__IN_MOTHERSHIP 			= index; index++;
civ.PERSON_LOCATION__ENTERING_MOTHERSHIP 	= index; index++;
civ.PERSON_LOCATION__EXITING_MOTHERSHIP 	= index; index++;
civ.PERSON_LOCATION__OUTSIDE			 	= index; index++;

var index = 0;
civ.PERSON_ACTION__NONE 					= index; index++;
civ.PERSON_ACTION__IDLE 					= index; index++;
civ.PERSON_ACTION__SLEEPING 				= index; index++;
civ.PERSON_ACTION__WALKING_TOWARDS_GOAL		= index; index++;
civ.PERSON_ACTION__HARVESTING 				= index; index++;
civ.PERSON_ACTION__CONSTRUCTIING 			= index; index++;
civ.PERSON_ACTION__WALKING_HOME				= index; index++;
civ.PERSON_ACTION__UNLOADING				= index; index++;
civ.PERSON_ACTION__ 						= index; index++;

var index = 0;
civ.PERSON_GOAL__NONE 					= index; index++;
civ.PERSON_GOAL__HARVEST_SUBTILE		= index; index++;
civ.PERSON_GOAL__CONSTRUCT_BUILDING		= index; index++;
civ.PERSON_GOAL__WALK_HOME 			= index; index++;
civ.PERSON_GOAL__WALK_TO 			= index; index++;
civ.PERSON_GOAL__ENTER_MOTHERSHIP 	= index; index++;
civ.PERSON_GOAL__ENTER_COLONY 		= index; index++;
civ.PERSON_GOAL__CONSTRUCT			= index; index++;

civ.PERSON_GOAL__TRADE_WITH_COLONY	= index; index++;

civ.PERSON_GOAL__ 					= index; index++;
civ.PERSON_GOAL__ 					= index; index++;

civ.Person = function(index)
{
	this.index = index;
	this.reset();
}

civ.Person.prototype.reset = function()
{
	this.is_active					= false;
	this.pos_x 						= 0;
	this.pos_y 						= 0;
	this.speed_x 						= 0;
	this.speed_y 						= 0;
	this.subtile_x 					= -1;
	this.subtile_y 					= -1;
	this.location_mothership_index 	= -1;
	this.location_colony_index 		= -1;

	this.hunger 					= 0;
	this.thirst 					= 0;
	this.boredom					= 0;

	this.money						= 0;
	this.social_standing			= 0;
	this.moral_integrity			= 0;
	this.courage					= 0;

	this.load_carried				= 0;
	this.max_load					= 0.2;

	this.location 					= civ.PERSON_LOCATION__NONE;
	this.action 					= civ.PERSON_ACTION__NONE;
	this.action_time_elapsed 		= 0;

	this.goal 						= civ.PERSON_GOAL__NONE;
	this.goal_time_elapsed 			= 0;
	this.goal_pos_x		 			= -1;
	this.goal_pos_x 				= -1;
	this.goal_subtile_x 			= -1;
	this.goal_subtile_y 			= -1;
	this.goal_subtile_index			= -1;
}

civ.Person.prototype.spawn_in_mothership = function(mothership_index)
{
	console.log('spawned dood or doodette in mothership');

	this.reset();
	this.is_active					= true;
	this.location 					= civ.PERSON_LOCATION__IN_MOTHERSHIP;
	this.location_mothership_index	= mothership_index;
};

civ.Person.prototype.draw = function()
{
	var hue = 120 * Math.pow(this.load_carried / this.max_load, 2);

/*
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle,
		this.pos_x,
		this.pos_y,
		civ.PERSON__BASE_RADIUS * .1 * civ.camera_player.zoom_,
		civ.PERSON__BASE_RADIUS * .1 * civ.camera_player.zoom_,
		1, 1,
		90,
		hue, 1, .9, 0.7,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
*/

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_mothership,
		this.pos_x,
		this.pos_y,
		civ.PERSON__BASE_RADIUS,
		civ.PERSON__BASE_RADIUS,
		1, 1,
		90,
		hue, 1, 0.5, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_mothership_light_front,
		this.pos_x,
		this.pos_y,
		civ.PERSON__BASE_RADIUS,
		civ.PERSON__BASE_RADIUS,
		1, 1,
		90,
		hue, 1, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

/*
civ.c.rectangle.draw_line(civ.CAM_PLAYER,
	this.pos_x,
	this.pos_y,
	this.goal_pos_x,
	this.goal_pos_y,
	civ.PERSON__BASE_RADIUS * 0.7,
		56, 1, 0.0, .25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
civ.c.rectangle.draw_line(civ.CAM_PLAYER,
	this.pos_x,
	this.pos_y,
	this.goal_pos_x,
	this.goal_pos_y,
	civ.PERSON__BASE_RADIUS * .2,
		56, 1, 0.5, .95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

*/

/*
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_thick_outline,
		(civ.map.subtile_size_x2 + civ.map.subtile_size_x * this.subtile_x),
		(civ.map.subtile_size_y2 + civ.map.subtile_size_y * this.subtile_y),
		civ.map.subtile_size_x,
		civ.map.subtile_size_y,
		1, 1,
		90,
		(civ.now % 3000) / 3000 * 360, 1.0, 2.0, .5,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

*/

/*
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_thick_outline,
		(civ.map.subtile_size_x2 + civ.map.subtile_size_x * this.goal_subtile_x),
		(civ.map.subtile_size_y2 + civ.map.subtile_size_y * this.goal_subtile_y),
		civ.map.subtile_size_x * (1 + .1*Math.sin((50 * this.index + civ.now / 300))),
		civ.map.subtile_size_y * (1 + .1*Math.sin((50 * this.index + civ.now / 300))),
		1, 1,
		90,
		(civ.now % 3000) / 3000 * 360, 1.0, 0.0, .25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle_thick_outline,
		this.goal_pos_x,
		this.goal_pos_y,
		civ.map.subtile_size_x * (1 + .1*Math.sin((150 * this.index + civ.now / 300))),
		civ.map.subtile_size_y * (1 + .1*Math.sin((150 * this.index + civ.now / 300))),
		1, 1,
		90,
		(civ.now % 3000) / 3000 * 360, 1.0, 2.0, .25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
*/
};

civ.Person.prototype.think = function(time_delta)
{
	if (this.location == civ.PERSON_LOCATION__IN_MOTHERSHIP)
	{
		this.bore(civ.PERSON__BASE_BOREDOM_RATE * time_delta);
		var mothership = civ.units.u[this.location_mothership_index];
		this.pos_x = mothership.pos_x;
		this.pos_y = mothership.pos_y;
		this.subtile_x = Math.floor(this.pos_x / civ.WORLD_SIZE_X * civ.map.subtiles_total_x);
		this.subtile_y = Math.floor(this.pos_y / civ.WORLD_SIZE_Y * civ.map.subtiles_total_y);
	}
	else
	{
		this.bore(- civ.PERSON__BASE_UNBOREDOM_RATE * time_delta );
		this.pos_x += this.speed_x * time_delta;
		this.pos_y += this.speed_y * time_delta;
		this.subtile_x = Math.floor(this.pos_x / civ.WORLD_SIZE_X * civ.map.subtiles_total_x);
		this.subtile_y = Math.floor(this.pos_y / civ.WORLD_SIZE_Y * civ.map.subtiles_total_y);
	}
	if (this.goal == civ.PERSON_GOAL__NONE)
	{
		if (this.boredom > 0.5)
		{
			this.pick_new_goal();
		}
	}
	////////////////////////
	if (this.goal == civ.PERSON_GOAL__WALK_HOME)
	{
		if (this.action == civ.PERSON_ACTION__WALKING_HOME)
		{

			//console.log('going home');
			var mothership = civ.units.u[this.location_mothership_index];
			this.goal_pos_x = mothership.pos_x;
			this.goal_pos_y = mothership.pos_y;
			var dist = µ.distance2D(mothership.pos_x, mothership.pos_y, this.pos_x, this.pos_y);
			if (dist > civ.map.subtile_size_x2 / 32)
			{
				var angle_to_goal = µ.vector2D_to_angle(mothership.pos_x - this.pos_x, mothership.pos_y - this.pos_y);
				this.speed_x = µ.angle_to_x(angle_to_goal) * civ.PERSON__BASE_SPEED;
				this.speed_y = µ.angle_to_y(angle_to_goal) * civ.PERSON__BASE_SPEED;
				// check if something better is possible
				this.pick_new_goal();
			}
			else
			{
				this.speed_x = 0;
				this.speed_y = 0;
				this.location = civ.PERSON_LOCATION__IN_MOTHERSHIP;
				this.action = civ.PERSON_ACTION__NONE;
				this.goal = civ.PERSON_GOAL__NONE;

				mothership.type.food_stored += this.load_carried;
				this.load_carried = 0;
				if (mothership.type.food_stored > mothership.type.food_max)
				{
					mothership.type.food_stored = mothership.type.food_max;
				}
			}
		}
	}
	/////////////////////////////////
	else if (this.goal == civ.PERSON_GOAL__CONSTRUCT_BUILDING)
	{
		if (this.action == civ.PERSON_ACTION__WALKING_TOWARDS_GOAL)
		{
			// is the goal still valid?
			if (civ.map.subtiles__improvement_build_progress[this.goal_subtile_index] >= 1)
			{
				this.pick_new_goal();
			}
			else
			{
				var dist = µ.distance2D(this.goal_pos_x, this.goal_pos_y, this.pos_x, this.pos_y);
				if (dist > civ.map.subtile_size_x2)
				{
					var angle_to_goal = µ.vector2D_to_angle(this.goal_pos_x - this.pos_x, this.goal_pos_y - this.pos_y);
					this.speed_x = µ.angle_to_x(angle_to_goal) * civ.PERSON__BASE_SPEED;
					this.speed_y = µ.angle_to_y(angle_to_goal) * civ.PERSON__BASE_SPEED;
				}
				else
				{
					this.speed_x = 0;
					this.speed_y = 0;
					this.action = civ.PERSON_ACTION__CONSTRUCTIING;
				}
			}
		}
		else if (this.action == civ.PERSON_ACTION__CONSTRUCTIING)
		{
			var subtile_index = this.subtile_y * civ.map.subtiles_total_x + this.subtile_x;
			//console.log('harvesting', civ.map.subtiles__harvestable1[subtile_index]);
			//console.log('constructing', civ.map.subtiles__improvement_build_progress[subtile_index])
			var amount_worked = Math.min(1 - civ.map.subtiles__improvement_build_progress[subtile_index], civ.PERSON__BASE_BUILD_RATE * time_delta);
			civ.map.subtiles__improvement_build_progress[subtile_index] += amount_worked;
			if (civ.map.subtiles__improvement_build_type[subtile_index] == civ.BUILDING_TYPE__NONE)
			{
				this.pick_new_goal();
			}
			else if (civ.map.subtiles__improvement_build_progress[subtile_index] >= 1)
			{
				civ.map.subtiles__improvement_type[subtile_index] = civ.map.subtiles__improvement_build_type[subtile_index];
				civ.map.subtiles__improvement_build_type[subtile_index] = civ.BUILDING_TYPE__NONE
				this.pick_new_goal();
			}
			civ.map.update_subtile(this.subtile_x, this.subtile_y, true);
		}
	}
	///////////////////////////////////
	else if (this.goal == civ.PERSON_GOAL__HARVEST_SUBTILE)
	{
		//console.log('towards');
		if (this.action == civ.PERSON_ACTION__WALKING_TOWARDS_GOAL)
		{
			// is the goal still valid?
			if (civ.map.subtiles__harvestable1[this.goal_subtile_index] <= 0)
			{
				this.pick_new_goal();
			}
			else
			{
				var dist = µ.distance2D(this.goal_pos_x, this.goal_pos_y, this.pos_x, this.pos_y);
				if (dist > civ.map.subtile_size_x2)
				{
					var angle_to_goal = µ.vector2D_to_angle(this.goal_pos_x - this.pos_x, this.goal_pos_y - this.pos_y);
					this.speed_x = µ.angle_to_x(angle_to_goal) * civ.PERSON__BASE_SPEED;
					this.speed_y = µ.angle_to_y(angle_to_goal) * civ.PERSON__BASE_SPEED;
				}
				else
				{
					this.speed_x = 0;
					this.speed_y = 0;
					this.action = civ.PERSON_ACTION__HARVESTING;
				}
			}
		}
		else if (this.action == civ.PERSON_ACTION__HARVESTING)
		{
			var subtile_index = this.subtile_y * civ.map.subtiles_total_x + this.subtile_x;
			//console.log('harvesting', civ.map.subtiles__harvestable1[subtile_index]);
			var amount_harvested = Math.min(civ.map.subtiles__harvestable1[subtile_index], civ.PERSON__BASE_HARVEST_RATE * time_delta, (this.max_load - this.load_carried));
			civ.map.subtiles__harvestable1[subtile_index] -= amount_harvested;
			this.load_carried += amount_harvested;
			if (civ.map.subtiles__harvestable1[subtile_index] <= 0 || this.load_carried >= this.max_load)
			{
				this.pick_new_goal();
			}
			civ.map.update_subtile(this.subtile_x, this.subtile_y, true);
		}
	}
};

civ.Person.prototype.bore = function(boredom)
{
	this.boredom = Math.max(0, Math.min(1, this.boredom + boredom));
}

civ.Person.prototype.weigh_subtile = function(item, index, data)
{
	//console.log(data, item);
	var self = data;
	if (item[0] == civ.PERSON_GOAL__WALK_HOME)
	{
		return 0.0000000001;
	}
	if (item[0] == civ.PERSON_GOAL__HARVEST_SUBTILE)
	{
		var goal_pos_x = item[1];
		var goal_pos_y = item[2];
		var subtile_index = item[3];
		var subtile_x = item[4];
		var subtile_y = item[5];
		var dist = 1 + 10 * µ.distance2D(self.pos_x, self.pos_y, goal_pos_x, goal_pos_y);
		var weight = (civ.map.subtiles__harvestable1[subtile_index] * 0.9 + 0.1) / (dist * dist);
		//console.log(weight, goal_pos_x, goal_pos_y, subtile_index, subtile_x, subtile_y);
		return weight;
	}
	else if (item[0] == civ.PERSON_GOAL__CONSTRUCT_BUILDING)
	{
		var goal_pos_x = item[1];
		var goal_pos_y = item[2];
		var subtile_index = item[3];
		var subtile_x = item[4];
		var subtile_y = item[5];
		//var dist = 1 + 10 * µ.distance2D(self.pos_x, self.pos_y, goal_pos_x, goal_pos_y);
		var weight = 1000 * (1.0 - civ.map.subtiles__improvement_build_progress[subtile_index]);
		//console.log(weight, goal_pos_x, goal_pos_y, subtile_index, subtile_x, subtile_y);
		return weight;
	}
	return 1;
};

civ.Person.prototype.pick_new_goal = function()
{
	µ._eligible_array = [];
	µ._eligible_array[0]
	var radius = 5;
	// check out some random nearby tiles
	var mothership = civ.units.u[this.location_mothership_index];
	for (var i = 0; i < 10; i++)
	{
		var offset_x = -radius + µ.rand_int(radius * 2);
		var offset_y = -radius + µ.rand_int(radius * 2);
		var subtile_x = this.subtile_x + offset_x;
		var subtile_y = this.subtile_y + offset_y;
		if (subtile_x >= 0 && subtile_x < civ.map.subtiles_total_x && subtile_y >= 0 && subtile_y < civ.map.subtiles_total_y)
		{
			var subtile_index = subtile_y * civ.map.subtiles_total_x + subtile_x;
			if (mothership.type.food_stored < mothership.type.food_max)
			{
				if (civ.map.subtiles__harvestable1[subtile_index] >= 0.025 &&
					this.load_carried < this.max_load)
				{
					var goal_pos_x = subtile_x * civ.map.subtile_size_x + civ.map.subtile_size_x2;
					var goal_pos_y = (subtile_y) * civ.map.subtile_size_y + civ.map.subtile_size_y2;
					µ._eligible_array.push([
						civ.PERSON_GOAL__HARVEST_SUBTILE,
						goal_pos_x,
						goal_pos_y,
						subtile_index,
						subtile_x,
						subtile_y
						]);
				}
			}
			else
			{
				console.log('c');
			}
			if (
						civ.map.subtiles__improvement_build_type[subtile_index] != civ.BUILDING_TYPE__NONE
					&&	civ.map.subtiles__improvement_build_progress[subtile_index] <= 1.00
				)
			{
				var goal_pos_x = subtile_x * civ.map.subtile_size_x + civ.map.subtile_size_x2;
				var goal_pos_y = (subtile_y) * civ.map.subtile_size_y + civ.map.subtile_size_y2;
				µ._eligible_array.push([
					civ.PERSON_GOAL__CONSTRUCT_BUILDING,
					goal_pos_x,
					goal_pos_y,
					subtile_index,
					subtile_x,
					subtile_y
					]);
			}
		}
	}
	µ._eligible_array.push([
		civ.PERSON_GOAL__WALK_HOME,
		goal_pos_x,
		goal_pos_y,
		subtile_index,
		subtile_x,
		subtile_y
		]);
//this.action = civ.PERSON_ACTION__WALKING_HOME;

	//console.log(µ._eligible_array);

	//var picked_index = µ._eligible_array.length > 0 ? µ.pick_randomly_from_weighted_list(µ._eligible_array, this.weigh_subtile, this) : null;
	var picked_index = µ._eligible_array.length > 0 ? µ.pick_best_from_weighted_list(µ._eligible_array, this.weigh_subtile, this) : null;
	if (picked_index !== null)
	{
		var picked = µ._eligible_array[picked_index];
		if (picked[0] == civ.PERSON_GOAL__WALK_HOME)
		{
			var goal_pos_x = picked[1];
			var goal_pos_y = picked[2];
			var subtile_index = picked[3];
			var subtile_x = picked[4];
			var subtile_y = picked[5];

			this.goal = civ.PERSON_GOAL__WALK_HOME;
			this.action = civ.PERSON_ACTION__WALKING_HOME;
			this.goal_subtile_x = subtile_x;
			this.goal_subtile_y = subtile_y;
			this.goal_subtile_index = subtile_index;
			this.goal_pos_x = subtile_x * civ.map.subtile_size_x + civ.map.subtile_size_x2;
			this.goal_pos_y = (subtile_y) * civ.map.subtile_size_y + civ.map.subtile_size_y2;
		}
		else if (picked[0] == civ.PERSON_GOAL__HARVEST_SUBTILE)
		{
			if (this.location == civ.PERSON_LOCATION__IN_MOTHERSHIP)
			{
				this.location = civ.PERSON_LOCATION__OUTSIDE;
			}
			var goal_pos_x = picked[1];
			var goal_pos_y = picked[2];
			var subtile_index = picked[3];
			var subtile_x = picked[4];
			var subtile_y = picked[5];

			this.goal = civ.PERSON_GOAL__HARVEST_SUBTILE;
			this.action = civ.PERSON_ACTION__WALKING_TOWARDS_GOAL;
			this.goal_subtile_x = subtile_x;
			this.goal_subtile_y = subtile_y;
			this.goal_subtile_index = subtile_index;
			this.goal_pos_x = subtile_x * civ.map.subtile_size_x + civ.map.subtile_size_x2;
			this.goal_pos_y = (subtile_y) * civ.map.subtile_size_y + civ.map.subtile_size_y2;

		}
		else if (picked[0] == civ.PERSON_GOAL__CONSTRUCT_BUILDING)
		{
			if (this.location == civ.PERSON_LOCATION__IN_MOTHERSHIP)
			{
				this.location = civ.PERSON_LOCATION__OUTSIDE;
			}
			var goal_pos_x = picked[1];
			var goal_pos_y = picked[2];
			var subtile_index = picked[3];
			var subtile_x = picked[4];
			var subtile_y = picked[5];
			this.goal = civ.PERSON_GOAL__CONSTRUCT_BUILDING;
			this.action = civ.PERSON_ACTION__WALKING_TOWARDS_GOAL;
			this.goal_subtile_x = subtile_x;
			this.goal_subtile_y = subtile_y;
			this.goal_subtile_index = subtile_index;
			this.goal_pos_x = subtile_x * civ.map.subtile_size_x + civ.map.subtile_size_x2;
			this.goal_pos_y = (subtile_y) * civ.map.subtile_size_y + civ.map.subtile_size_y2;

		}
	}
	else
	{
		if (µ._eligible_array.length > 0)
		{
			//console.log('wat', µ._eligible_array[0]);
		}

	}

};

civ.Person.prototype._ = function()
{
};
