//"use strict";

rvr.Agent = function()
{
	this.agent_memories = new Array(rvr.AGENT_MEMORY_TYPE_COUNT);
	for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
	{
		this.agent_memories[i] = new rvr.Agent_Memory(this, rvr.agent_memory_slots, i);
	}
}

rvr.Agent.prototype.spawn = function(index, preset_name, type)
{
	//console.log(index, preset_name, type);

	this.temp_vector = new Float32Array([0, 0]);

	//this.radius = 0.5;

	this.type = type;

	this.is_active = true;

	this.birthdate = rvr.now;

	rvr_agents__is_active[index] = 1;

	this.is_dying = false;
	this.is_on_ground = true;

	this.index = index;

	this.scent_pos_x = 0;
	this.scent_pos_y = 0;

	for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
	{
		this.agent_memories[i].reset();
	}

	// broken atm
	//this.dropped_scent_id = 2 + µ.rand_int(1);
	//this.sensed_scent_id = this.dropped_scent_id == 2 ? 3 : 2;

	this.dropped_scent_id = 2;
	this.sensed_scent_id = 2;

	this.old_scent_pos_x = 0;
	this.old_scent_pos_y = 0;

	this.is_burning = 0;
	this.burning = 0;

	this.last_scent_drop = µ.rand_int(rvr.enemy_scent_drop_frequency);
	this.last_scent_check = 0;

	this.last_chosen_scent_direction_x = 0;
	this.last_chosen_scent_direction_y = 0;

	this.is_walking_since = 0;
	this.is_sprinting_since = 0;
	this.is_dodging_since = 0;

	this.favourite_move_direction = -1;
	this.favourite_move_direction_weight = -1;
	this.favourite_aim_direction = -1;
	this.favourite_aim_direction_weight = -1;

	this.last_dodge = 0;
	this.last_damage = 0;

	this.distance_from_player = -1;
	this.can_see_prey = false;
	this.could_see_prey = false;

	this.agent_memories = new Array(rvr.AGENT_MEMORY_TYPE_COUNT);
	for (var i = 0; i < rvr.AGENT_MEMORY_TYPE_COUNT; i++)
	{
		this.agent_memories[i] = new rvr.Agent_Memory(this, rvr.agent_memory_slots, i);
	}

	this.last_seen_prey = -1000;
	this.last_seen_prey_pos_x = -1;
	this.last_seen_prey_pos_y = -1;
	this.last_seen_prey_pos_z = -1;

	this.move_target_pos_x = -1;
	this.move_target_pos_y = -1;

	this.ground_height = 0;

	this.aim_angle = 0;

	this.weapons = [];
	this.selected_weapon = -1;

	this.shield = 1.0;
	this.state = {
		health 		: 1.0,
		flags 		: 0,

/*		pos_x		: µ.rand(rvr.world_size_x),
		pos_y		: µ.rand(rvr.world_size_y),
		pos_z		: 0,
*/
		old_pos_x		: µ.rand(rvr.world_size_x),
		old_pos_y		: µ.rand(rvr.world_size_y),
		old_pos_z		: 0,
		facing		: 90,
		speed_x		: 0,
		speed_y		: 0,
		speed_z		: 0,
		alarm_level	: 0,
		last_shot	: 0,
		stamina		: 1,
		infection	: 0,
	}

	// [added/subtracted, increased/decreased, more/less]
	this.passives = {
		area_of_effect:		[0, 0, 1],
	};

	this.next_agent_to_check_out = 0;

	this.parameters = {

		hue_shift_min							: 0,
		hue_shift_max							: 0,

		faction_id								: rvr.FACTION__NONE,
		radius									: 0.5,
		radius2									: 1.0,
		weight									: 1.0,

		health_factor							: 1.0,
		armour									: 1.0,

		target_reach_distance					: 1.5,

		sound_factor_floor						: 1.0,

		attention_span_last_seen_enemy_position : 30000,

		aim_tolerance							: 3.5,

		flee_health_threshold					: 0.5,

		keep_distance_to_anyone_min				: 0.25,

		keep_distance_to_attacked_min			: 0.5,
		keep_distance_to_attacked_max			: 2.5,
		keep_distance_to_supported_min			: 1.5,
		keep_distance_to_supported_max			: 9999.0,
		keep_distance_to_feared_min				: 99.0,
		keep_distance_to_feared_max				: 99999,

		keep_distance_to_attacking_min			: 99.5,
		keep_distance_to_attacking_max			: 99999.5,

		burn_threshold_start					: 1.0,
		burn_threshold_stop						: 0.0,
		burn_damage								: 0.000015,		// receive this much fire damage for every point of burn per ms
		burn_receive							: 0.125,			// receive this much burn for every point of burn damage
		burn_wear_off							: 0.0004,		// lose this much burn every ms

		sight_height							: 0.05,
		sight_range								: 8.0,
		sight_range360							: 8.0,
		sight_cone								: 60.0,
		sight_falloff							: 0.25,

		light_range								: 0.0,
		light_range360							: 0.0,
		light_cone								: 0.0,
		light_falloff							: 0.25,

		light_color_r							: 1.0,
		light_color_g							: 1.0,
		light_color_b							: 1.0,
		light_color_a							: 1.0,

		hunger_rate__idle						: 0,
		thirst_rate__idle						: 0,

		oxygen_reservoir						: 5000,
		oxygen_gain_breathing					: 200,
		underwater_breathing_efficiency			: 0,

		stamina_recharge						: 0.00010,
		stamina_use_walk						: 0.000025,
		stamina_use_sprint						: 0.00035,
		stamina_use_dodge						: 0.0090,

		acceleration_factor_idle				: 0.1,
		acceleration_factor_calm				: 0.7,
		acceleration_factor_curious				: 1.0,
		acceleration_factor_furious				: 1.5,

		move_acceleration						: 0.000015,
		move_deceleration						: 0.0000075,
		friction								: 0.995,

		alarm_level_per_second_min_distance		: 3.0,
		alarm_level_per_second_max_distance		: 6.0,
		alarm_level_per_second_at_min_distance	: 2.5,
		alarm_level_per_second_at_max_distance	: 0.5,
		alarm_level_decay_per_second			: 0.02,
		alarm_level_threshold_begin				: 0.95,
		alarm_level_threshold_end				: 0.25,

		infection_resistance					: 0,

		can_infect								: false,

/*
		health
		hearing_range

		notice_enemy_delay_at_min_dist
		notice_enemy_delay_min_dist
		notice_enemy_delay_at_max_dist
		notice_enemy_delay_max_dist

		random_stop_min_interval
		random_stop_max_interval
		random_stop_min_duration
		random_stop_max_duration
*/

	};

	this.preset_name = preset_name;
	this.preset = rvr.presets.agents[preset_name];

	if (this.preset == undefined)
	{
		console.log('preset undefined!', preset_name);
		return
	}

	if (this.preset.inherits_from != undefined)
	{
		for (var i = 0; i < this.preset.inherits_from.length; i++)
		{
			var inherit_preset = rvr.presets.agents[this.preset.inherits_from[i]];
			for (var j in inherit_preset.parameters)
			{
				this.parameters[j] = inherit_preset.parameters[j];
				//console.log('inherit', j, inherit_preset.parameters[j]);
			}
		}
	}

	for (var i in this.preset.parameters)
	{
		this.parameters[i] = this.preset.parameters[i];
	}

	this.parameters.move_acceleration *= 1.5;
	this.parameters.move_deceleration *= 1.5;

	if (this.preset.weapons)
	{
		for (i = 0; i < this.preset.weapons.length; i++)
		{
			this.gain_weapon(rvr.presets.weapons[this.preset.weapons[i][0]]);
		}
	}
	else
	{
		console.log('no weapons defined:', preset_name);
	}

	if (this.preset.parameter_ranges_related)
	{
		var random = µ.rand(1);
		for (var i in this.preset.parameter_ranges_related)
		{
			this.parameters[i] = (1 - random) * this.preset.parameter_ranges_related[i][0] + random * this.preset.parameter_ranges_related[i][1];
		}
	}

	// make "shortcuts" for sanity purposes
	this.faction = rvr.factions.factions[this.parameters.faction_id];
	this.faction_id = this.parameters.faction_id;

	var spread = 0.805;
	rvr_agents__pos_x[index] = rvr.world_size_x * (0.5 - spread / 2) + µ.rand(rvr.world_size_x * spread);
	rvr_agents__pos_y[index] = rvr.world_size_y * (0.5 - spread / 2) + µ.rand(rvr.world_size_y * spread);
	rvr_agents__pos_z[index] = 0;

	var rand_factor = rvr.tile_size_x * 10.2;

	var rand_factor = rvr.world_size_x / 2.2;
	if (this.faction_id == rvr.FACTION__PLAYER)
	{
		//console.log('player');
		rvr_agents__pos_x[index] = rvr.world_size_x / 2;
		rvr_agents__pos_y[index] = rvr.world_size_y / 2;
	}
	if (this.faction_id == rvr.FACTION__SURVIVORS)
	{
		//console.log('survivors');
		rvr_agents__pos_x[index] = rvr.tile_size_x							+ µ.rand(rand_factor);
		rvr_agents__pos_y[index] = rvr.tile_size_y							+ µ.rand(rand_factor);
	}
	if (this.faction_id == rvr.FACTION__REBELS)
	{
		//console.log('rebels');
		rvr_agents__pos_x[index] = rvr.world_size_x - rvr.tile_size_x * 4	- µ.rand(rand_factor);
		rvr_agents__pos_y[index] = rvr.tile_size_y							+ µ.rand(rand_factor);
	}
	if (this.faction_id == rvr.FACTION__BANDITS)
	{
		//console.log('bandits');
		rvr_agents__pos_x[index] = rvr.tile_size_x							+ µ.rand(rand_factor);
		rvr_agents__pos_y[index] = rvr.world_size_y - rvr.tile_size_y * 4	- µ.rand(rand_factor);
	}
	if (this.faction_id == rvr.FACTION__DRONES)
	{
		//console.log('drones');
		rvr_agents__pos_x[index] = rvr.world_size_x - rvr.tile_size_x * 4	- µ.rand(rand_factor);
		rvr_agents__pos_y[index] = rvr.world_size_y - rvr.tile_size_y * 4	- µ.rand(rand_factor);
	}

	//console.log(this.faction_id, rvr_agents__pos_x[index], rvr_agents__pos_y[index]);

	rvr_agents__speed_x[index] = 0;
	rvr_agents__speed_y[index] = 0;
	rvr_agents__speed_z[index] = 0;


	this.hue_shift = this.parameters.hue_shift_min + µ.rand(this.parameters.hue_shift_max - this.parameters.hue_shift_min);

	if (this.preset.draw2)
	{
		this.draw_function2 = this.preset.draw2;
	}
	else
	{
		this.draw_function2 = null;
	}
	if (this.preset.draw3)
	{
		this.draw_function3 = this.preset.draw3;
	}
	else
	{
		this.draw_function3 = null;
	}

	if (this.preset.draw_function)
	{
		this.draw_function = this.preset.draw_function;
	}
	else
	{
		this.draw_function = function(here)
		{
			rvr.c.rectangle_textured.draw(
				rvr.CAM_PLAYER, rvr.tex_eye,
				rvr_agents__pos_x[here.index],
				rvr_agents__pos_y[here.index],
				here.parameters.radius2,
				here.parameters.radius2,
				here.state.facing,
				here.hue_shift, 0.5, 1, 1,
				-1,-1,-1,-1,
				-1,-1,-1,-1,
				-1,-1,-1,-1);
		};
	}
}

rvr.Agent.prototype.gain_weapon = function(weapon_preset)
{
	this.weapons.push(new rvr.Weapon(weapon_preset, this));
	if (this.selected_weapon == -1)
	{
		this.selected_weapon = 0;
	}
}

rvr.Agent.prototype.switch_to_next_weapon = function()
{
	this.selected_weapon++;
	if (this.selected_weapon >= this.weapons.length)
	{
		this.selected_weapon = 0;
	}
}


rvr.Agent.prototype.trigger_weapon = function()
{
	if (this.selected_weapon > -1)
	{
		this.weapons[this.selected_weapon].trigger();
	}
}

µ.do_the_lizzle = function(input, lower_threshold, upper_threshold, lower_output, upper_output)
{
	if (input <= lower_threshold)
	{
		return lower_output;
	}
	else if (input >= upper_threshold)
	{
		return upper_output;
	}
	else
	{
		return lower_output + (upper_output - lower_output) * ((input - lower_threshold) / (upper_threshold - lower_threshold));
	}
}

rvr.Agent.prototype.receive_damage = function(damage_physical, damage_burn, damage_fire)
{
	//if (this.type == rvr.AGENT_TYPE__PLAYER)
	{
		//return;
	}

	// add to burn
	if (damage_burn > 0)
	{
		this.burning += this.parameters.burn_receive * damage_burn;
	}

	var amount = damage_physical + damage_fire;

	if (this.shield > 0)
	{
		this.shield -= amount * 0.75;
		amount *= 0.25;
		if (this.shield < 0)
		{
			//this.state.health += this.shield;

			amount += -this.shield * 4.0;
			this.shield = 0;
		}
	}

	this.state.health -= amount;

	//console.log(this.shield, this.state.health);

	this.last_damage = rvr.now;
	if (this.state.health < 0.0)
	{
		this.state.health = 0.0;
		this.die();
	}
}

rvr.Agent.prototype.die = function()
{
	if (this.index == 0)
	{
		rvr.agents.spawn_into_slot(0, 'player', rvr.AGENT_TYPE__PLAYER);
	}
	else
	{
		this.is_dying = true;
		rvr.agents.agents_alive--;
		rvr.agents.agent_presets_alive[this.preset_name] = - 1 + (rvr.agents.agent_presets_alive[this.preset_name] ? rvr.agents.agent_presets_alive[this.preset_name] : 0);
	}
}

rvr.Agent.prototype.movement_speed_factor = function(time_delta, wants_to_sprint, wants_to_dodge)
{
	var speed_factor = 1.0;
	if (((wants_to_dodge && rvr.now - this.last_dodge > rvr.min_time_between_dodges) || this.is_dodging_since > 0.0)
			&& this.state.stamina >= this.parameters.stamina_use_dodge * time_delta
			&& this.is_dodging_since < rvr.dodge_duration
			)
	{
		if (wants_to_dodge && this.is_dodging_since == 0)
		{
			this.last_dodge	= rvr.now;
		}
		var speed_factor = rvr.dodge_speed_factor;
		this.is_walking_since = 0;
		this.is_sprinting_since = 0;
		this.is_dodging_since += time_delta;
	}
	else
	{
		if (wants_to_sprint && ((this.is_sprinting_since > 0 && this.state.stamina >= this.parameters.stamina_use_sprint * time_delta) || this.state.stamina > rvr.min_stamina_to_start_sprint))
		{
			this.is_walking_since = 0;
			this.is_sprinting_since += time_delta;
			this.is_dodging_since = 0;
			speed_factor = rvr.sprint_speed_factor;
		}
		else
		{
			this.is_walking_since += time_delta;
			this.is_sprinting_since = 0;
			this.is_dodging_since = 0;
		}
	}
	if (this.is_walking_since)
		this.state.stamina -= this.parameters.stamina_use_walk * time_delta;
	if (this.is_sprinting_since)
		this.state.stamina -= this.parameters.stamina_use_sprint * time_delta;
	if (this.is_dodging_since)
		this.state.stamina -= this.parameters.stamina_use_dodge * time_delta;
	return speed_factor;
}

rvr.Agent.prototype.move_cardinal_directions = function(time_delta, horizontal, vertical, wants_to_sprint, wants_to_dodge)
{
	speed_factor = this.movement_speed_factor(time_delta, wants_to_sprint, wants_to_dodge);
	if (wants_to_dodge)
	{
		//console.log(horizontal, vertical);
	}

	rvr_agents__speed_x[this.index] += time_delta * this.parameters.move_acceleration * speed_factor * horizontal;
	rvr_agents__speed_y[this.index] += time_delta * this.parameters.move_acceleration * speed_factor * vertical;
}

rvr.Agent.prototype.move = function(time_delta, horizontal, vertical, wants_to_sprint, wants_to_dodge)
{
	speed_factor = this.movement_speed_factor(time_delta, wants_to_sprint, wants_to_dodge);
	var move_direction = this.state.facing - horizontal * 90;
	if (vertical < 0)
	{
		move_direction -= 180;
	}
	rvr_agents__speed_x[this.index] += time_delta * this.parameters.move_acceleration * speed_factor * µ.angle_to_x(move_direction);
	rvr_agents__speed_y[this.index] += time_delta * this.parameters.move_acceleration * speed_factor * µ.angle_to_y(move_direction);
}

rvr.Agent.prototype.turn_to = function(angle)
{
}

rvr.Agent.prototype.pick_random_move_target_position = function()
{
	this.move_target_pos_x = rvr_agents__pos_x[this.index] - rvr.map.size_x / 10 + µ.rand(rvr.map.size_x / 5);
	this.move_target_pos_y = rvr_agents__pos_y[this.index] - rvr.map.size_y / 10 + µ.rand(rvr.map.size_y / 5);
	if (this.move_target_pos_x < 0)
		this.move_target_pos_x = 0;
	if (this.move_target_pos_y < 0)
		this.move_target_pos_y = 0;
	if (this.move_target_pos_x > rvr.map.size_x)
		this.move_target_pos_x = rvr.map.size_x;
	if (this.move_target_pos_y > rvr.map.size_y)
		this.move_target_pos_y = rvr.map.size_y;
}

rvr.Agent.prototype._ = function()
{

}