btx.Person = function(index, pos_x, pos_y)
{
	this.index = index;

	this.on_a_street_crossing = false;
	this.on_a_street = false;
	this.inside_block = -1;
	this.inside_house = -1;
	this.inside_a_house = false;
	this.in_a_house_since = 0;
	this.not_in_a_house_since = 0;

	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.speed_x = 0;
	this.speed_y = 0;
	this.controlled_by_player = false;

	this.current_goal = 0;


	this.current_goal__time_left = 0;
	this.current_goal__target_pos_x = -1;
	this.current_goal__target_pos_y = -1;
	this.current_goal__target_node_id = -1;
	this.current_goal__target_block_id = -1;
	this.current_goal__target_house_id = -1;


	this.previous_goal = 0;

	//this.current_action = 0;
	this.current_activity = 0;
	this.current_activity__time_left = 0;
	this.next_movement_target_pos_x = -1;
	this.next_movement_target_pos_y = -1;

	this.next_person_collision_check = 0;
	this.next_distance_check = 0;5
	this.next_goal_distance_check = 0;
	this.next_location_check = µ.rand_int(500);


	this.turning_off_at = 7 + µ.rand(1);
	this.turned_off_at = this.turning_off_at + .1 + µ.rand(1);
	this.turning_on_at = 14 + µ.rand(1);
	this.turned_on_at = this.turning_on_at + .1 + µ.rand(1);

	this.exhaustion_recovery 	= 0.00012;
	this.exhaustion_walk 		= 0.00013;
	this.exhaustion_sprint 		= 0.00014;

	this.facing = µ.rand(360);

/////////////////// planned ////////////////

	this.agility		= µ.rand(1);			// running speed
	this.charisma		= µ.rand(1);			// affects relations and bartering
	this.constitution	= µ.rand(1);			// maximum health
	this.dexterity		= µ.rand(1);			// accuracy, operning car door, starting car,
	this.endurance		= µ.rand(1);			// exhaustion and recovery
	this.eyesight		= µ.rand(1);			// sight range
	this.hearing		= µ.rand(1);			// hearing range
	this.stamina		= µ.rand(1);			// resistance to trauma
	this.strength		= µ.rand(1);			// melee damage
	this.cooking		= µ.rand(1);
	this.driving		= µ.rand(1);
	this.dancing		= µ.rand(1);
	this.electronics	= µ.rand(1);
	this.explosives		= µ.rand(1);
	this.heavy_weapons	= µ.rand(1);
	this.lock_picking	= µ.rand(1);
	this.marksmanship	= µ.rand(1);
	this.melee			= µ.rand(1);
	this.pistols		= µ.rand(1);
	this.rifles			= µ.rand(1);
	this.unarmed		= µ.rand(1);

/*
	this.		= µ.rand(1);
*/

	this.cruelty		= -1 + µ.rand(2);
	this.greed			= -1 + µ.rand(2);

	this.money_bank		= µ.rand_int(10000000);
	this.money_cash		= µ.rand_int(50) + Math.floor(this.money_bank / 10000);

	this.criminal_affinity		= -1 + µ.rand(2);	// the higher the affinity, the more likely to ignore a certain wanted level, very seedy shop keepers might even give a discount
	this.criminal_inclination 	= -1 + µ.rand(2);	// inclination to commit crimes (also notice the possibibity of the person being a hypocrite. or someone who doesn't commit crimes but tolerates them)

	this.hunger			= µ.rand(.1);
	this.thirst			= µ.rand(.1);
	this.tiredness		= µ.rand(.1);
	this.exhaustion		= µ.rand(.1);

	this.home_house		= -1;

	this.workplace_block = -1;		// in which block the house where the person works is located
	this.workplace_house = -1;		// in which house the person works
	this.workplace_role = -1;
}

btx.Person.prototype.think = function(time_delta)
{
	//console.log(this.current_goal, this.current_activity);
	this.exhaustion -= this.exhaustion_recovery * time_delta;
	if (this.exhaustion < 0.0)
	{
		this.exhaustion = 0.0;
	}
	if (this.current_activity__time_left > 0)
	{
		this.current_activity__time_left -= time_delta;
	}
	if (this.next_distance_check > 0)
	{
		this.next_distance_check -= time_delta;
	}
	if (this.next_goal_distance_check > 0)
	{
		this.next_goal_distance_check -= time_delta;
	}
	if (this.next_person_collision_check > 0)
	{
		this.next_person_collision_check -= time_delta;
	}

	if (this.inside_a_house)
	{
		this.in_a_house_since += time_delta;
		this.not_in_a_house_since = 0;
	}
	else
	{
		this.in_a_house_since = 0;
		this.not_in_a_house_since += time_delta;
	}

	//console.log(this.in_a_house_since);

	this.next_location_check -= time_delta;
	if (this.next_location_check <= 0)
	{
		this.next_location_check = 200;
		this.determine_location();
	}

	if (this.controlled_by_player)
	{
		this.get_player_input(time_delta);
	}
	else
	{
		if (this.current_goal == btx.PERSON_GOAL__NONE)
		{
			this.decide_goal();
			this.current_activity = btx.PERSON_ACTION__NONE;
		}
		var goal_reached = this.check_goal_status();
		if (goal_reached)
		{
			this.goal_done();
			this.current_goal = btx.PERSON_GOAL__NONE;
		}
		else
		{
			this.decide_emergency_activity();
			if (this.current_activity == btx.PERSON_ACTION__NONE)
			{
				this.decide_activity(time_delta);
			}
			var activity_completed = this.check_activity_status();
			if (activity_completed)
			{
				this.activity_done();
				this.current_activity = btx.PERSON_ACTION__NONE;
			}
			else
			{
				this.decide_input(time_delta);
			}
		}
/*
		this.decide_emergency_activity();
		this.decide_action(time_delta);
		this.decide_input(time_delta);
*/
	}
	this.collision_check();
	this.do_physics(time_delta);
}

btx.Person.prototype.get_player_input = function(time_delta)
{
	var direction_x = 0;
	var direction_y = 0;
	if (btx.input.KEY_W.pressed)
	{
		direction_y += 1;
	}
	if (btx.input.KEY_S.pressed)
	{
		direction_y -= 1;
	}
	if (btx.input.KEY_A.pressed)
	{
		direction_x -= 1;
	}
	if (btx.input.KEY_D.pressed)
	{
		direction_x += 1;
	}
	var angle = µ.vector2D_to_angle(direction_x, direction_y);
	if (direction_x || direction_y)
	{
		this.move_direction(time_delta, angle, btx.input.KEY_SHIFT.pressed);
	}
}

btx.Person.prototype.move_direction = function(time_delta, angle, is_sprinting)
{
	this.exhaustion += (is_sprinting ? this.exhaustion_sprint : this.exhaustion_walk) * time_delta;
	if (this.exhaustion > 1.0)
	{
		this.exhaustion = 1.0;
	}
	var turn = µ.turn(this.facing, angle);
	this.facing += turn * 0.003 * time_delta;
	if (Math.abs(turn) <= 180)
	{
		var slowing = Math.abs(turn) / 180;
		var direction_x = µ.angle_to_x(angle);
		var direction_y = µ.angle_to_y(angle);
		var impatience = 1.0;
		if (is_sprinting)
		{
			this.speed_x += direction_x * ( - 0.0000075 * slowing + 0.0000085 + 0.0000030 * this.agility) * time_delta * impatience;
			this.speed_y += direction_y * ( - 0.0000075 * slowing + 0.0000085 + 0.0000030 * this.agility) * time_delta * impatience;
		}
		else
		{
			this.speed_x += direction_x * ( - 0.0000045 * slowing + 0.0000050 + 0.0000015 * this.agility) * time_delta * impatience;
			this.speed_y += direction_y * ( - 0.0000045 * slowing + 0.0000050 + 0.0000015 * this.agility) * time_delta * impatience;
		}
	}
}

btx.Person.prototype.collision_check = function()
{
	if (this.next_person_collision_check <= 0)
	{
		var closest_dist = 999999999;
		var combined_radius = btx.person_radius + btx.person_radius;
		for (var i = 0; i < btx.persons.persons.length; i++)
		{
			if (i == this.index)
			{
				continue;
			}
			var other_person = btx.persons.persons[i];
			if (this.inside_a_house != other_person.inside_a_house || this.inside_house != other_person.inside_house)
			{
				continue;
			}
			var dist = µ.distance2D(this.pos_x, this.pos_y, other_person.pos_x, other_person.pos_y);
			if (closest_dist > dist)
			{
				closest_dist = dist;
			}
			var dist_hulls = dist - combined_radius;
			var overlap = combined_radius - dist;
			if (overlap > 0)
			{
				µ.vector2D_normalize(other_person.pos_x - this.pos_x, other_person.pos_y - this.pos_y, btx.temp_vector)
				var move_x = btx.temp_vector[0] * overlap * 0.0025;
				var move_y = btx.temp_vector[1] * overlap * 0.0025;
				var weight_ratio = 0.5;
				this.speed_x -= move_x * weight_ratio;
				this.speed_y -= move_y * weight_ratio;
				other_person.speed_x += move_x * (1 - weight_ratio);
				other_person.speed_y += move_y * (1 - weight_ratio);
			}
		}
		this.next_person_collision_check = Math.max(50, closest_dist * 20);
	}

	if (1 == 1 && this.inside_block != -1)
	{
		var block = btx.cityblocks.cityblocks[this.inside_block];
		if (this.inside_house != -1)
		{
			var house = block.houses[this.inside_house];
			if (this.pos_x < house.pos_x - house.size_x * 0.5 + btx.person_radius)
			{
				this.pos_x = house.pos_x - house.size_x * 0.5 + btx.person_radius;
			}
			else if (this.pos_x > house.pos_x + house.size_x * 0.5 - btx.person_radius)
			{
				this.pos_x = house.pos_x + house.size_x * 0.5 - btx.person_radius;
			}
			else if (this.pos_y < house.pos_y - house.size_y * 0.5 + btx.person_radius)
			{
				this.pos_y = house.pos_y - house.size_y * 0.5 + btx.person_radius;
			}
			else if (this.pos_y > house.pos_y + house.size_y * 0.5 - btx.person_radius)
			{
				this.pos_y = house.pos_y + house.size_y * 0.5 - btx.person_radius;
			}
		}
		else
		{
			for (var i = 0; i < block.houses.length; i++)
			{
				var house = block.houses[i];

				if (
						this.pos_x > house.pos_x - house.size_x * 0.5
					&&	this.pos_x < house.pos_x + house.size_x * 0.5
					&&	this.pos_y > house.pos_y - house.size_y * 0.5
					&&	this.pos_y < house.pos_y + house.size_y * 0.5
					)
				{
					//var angle = µ.vector2D_to_angle(house.pos_x - this.pos_x, house.pos_y - this.pos_y, btx.temp_vector);
					//var direction_x = µ.angle_to_x(angle);
					//var direction_y = µ.angle_to_y(angle);
					µ.vector2D_normalize(house.pos_x - this.pos_x, house.pos_y - this.pos_y, btx.temp_vector);

					this.speed_x += (house.pos_x > this.pos_x ? -1 : +1) * 0.00001;
					this.speed_y += (house.pos_y > this.pos_y ? -1 : +1) * 0.00001;

					break;
				}
			}
		}
	}
}

btx.Person.prototype.do_physics = function(time_delta)
{
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.speed_x *= Math.pow(0.995, time_delta);
	this.speed_y *= Math.pow(0.995, time_delta);
}

btx.Person.prototype.draw_light = function()
{

	var frac = 0;
	if (btx.game.current_time < this.turning_off_at * 3600)
	{
		var frac = 1;
	}
	else if (btx.game.current_time < this.turned_off_at * 3600)
	{
		var frac = 1 - (btx.game.current_time - this.turning_off_at * 3600) / ((this.turned_off_at - this.turning_off_at) * 3600);
	}
	else if (btx.game.current_time > this.turned_on_at * 3600)
	{
		var frac = 1;
	}
	else if (btx.game.current_time > this.turning_on_at * 3600)
	{
		var frac = (btx.game.current_time - this.turning_on_at * 3600) / ((this.turned_on_at - this.turning_on_at) * 3600);
	}


	if (frac > 0)
	{
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			0.75,
			0.75,
			1, 1, 90,
			0, 0.7, 0.9, 0.5 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			2.0,
			2.0,
			1, 1, 90,
			0, 0.7, 0.9, 0.2 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	}
}

btx.Person.prototype.enter_house = function(block_id, house_id)
{
	if (this.inside_a_house)
	{
		return false;
	}
	if (block_id == -1)
	{
		console.log('###', block_id, house_id);
		return;
	}
	var house = btx.cityblocks.cityblocks[block_id].houses[house_id];
	var dist = µ.distance2D(this.pos_x, this.pos_y, house.door_x, house.door_y);
	if (dist < 0.5)
	{
		this.inside_a_house = true;
		this.inside_house = house_id;
		return true;
	}
	else
	{
		return false
	}
}

btx.Person.prototype.leave_house = function(block_id, house_id)
{
	// just trust check_activity
	this.inside_a_house = false;
	this.inside_house = -1;

/*
	if (this.inside_a_house)
	{
		return false;
	}
	if (block_id == -1)
	{
		console.log('###', block_id, house_id);
		return;
	}
	var house = btx.cityblocks.cityblocks[block_id].houses[house_id];
	var dist = µ.distance2D(this.pos_x, this.pos_y, house.door_x, house.door_y);
	if (dist < 0.25)
	{
		this.inside_a_house = false;
		this.inside_house = -1;
		return true;
	}
	else
	{
		return false
	}
*/
}

btx.Person.prototype._ = function()
{
}

