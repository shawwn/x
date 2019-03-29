"use strict";

lgg.SingularityInside_MapGen_Room = function()
{
	this.wall_tiles = [];
	this.potential_floor_tiles = [];
	this.actual_floor_tiles = [];
	this.door_tiles = [];
}
lgg.SingularityInside_MapGen_Room.prototype.__ = function()
{
}
lgg.SingularityInside_MapGen_Better = function(context)
{
	this.context = context;
	this.available_options = {
		initial_peaks: {
			min:	5000,
			max:	5000,
		},
		blur_passes: {
			min:	5,
			max:	5,
		},
		blur_pass_peaks: {
			min:	250,
			max:	500,
		},
		blur_pass_valleys: {
			min:	50,
			max:	50,
		},
		blur_strength: {
			min:	0,
			max:	0,
		},
		room_attempts: {
			min:	1000,
			max:	1000,
		},
		turn_prob_min: {
			min:	0.001,
			max:	0.001,
		},
		turn_prob_max: {
			min:	0.01,
			max:	0.01,
		},
		tele_prob_min: {
			min:	0.001,
			max:	0.01,
		},
		tele_prob_max: {
			min:	0.002,
			max:	0.02,
		},
		free_to_rock_ratio: {
			min:	5,
			max:	5,
		},
		rock_hardness: {
			min:	3,
			max:	3,
		},
		rock_health: {
			min:	2,
			max:	2,
		},
		allow_: {
			min:	0,
			max:	1,
		},
	};
}
lgg.SingularityInside_MapGen_Better.prototype.generate = function(options)
{
	if (!options)
	{
		options = {};
		for (var option in this.available_options)
		{
			var opt = this.available_options[option];
			options[option] = opt.min + lgg.rand.float(opt.max - opt.min)
		}
	}
	this.options = options;
	console.log(this.options);
	this.density_map = [];
	this.rock_health = [];
	this.diggable_walls = [];
	this.marked_as_wall = [];
	this.room_map = [];
	this.rooms = [];
	/****/
	this.tiles = [];
	/****/
	this.go();
}
/*
generate random noise map, blur and normalize it -> "rock density"
put some "room shaped" hard depressions into it - with walls which have "infinite" density, with some "doors"  (keep track of those rooms)
pick start position and clear it, put walls on list, and mark them as being on the list
loop:
	pick random wall tile from list
	"use pick" one, decrease wall health according to rock density (this should take quite a while..!)
	if wall health reaches zero, clear it, and put neighbouring walls on list (if they aren't already)
*/
lgg.SingularityInside_MapGen_Better.prototype.go = function()
{
	var context = this.context;
	var map_dim = context.map_size_x * context.map_size_y;
	for (var i = context.map_size_x * context.map_size_y; i--;)
	{
		this.density_map.push(0);
		this.marked_as_wall.push(0);
		this.tiles.push(1);
		this.rock_health.push(this.options.rock_health);
		this.room_map.push(-1);
	}
	// prepare "rock density" map
//	for (var i = Math.ceil(this.options.initial_peaks); i--;)
//this.density_map[lgg.rand.int(this.density_map.length-1)] = lgg.rand.float(1);
	var max_dist = µ.distance2D(context.map_size_x/2, context.map_size_y/2, 0, 0);
	for (var i = this.density_map.length-1; i--;)
	{
		var x = i % context.map_size_x;
		var y = Math.floor((i - x) / context.map_size_x);
		var dist = µ.distance2D(context.map_size_x/2, context.map_size_y/2, x, y);
		this.density_map[i] = (dist/max_dist * 0.75 + lgg.rand.float(.25));
	}
	/*
	for (var i = Math.ceil(this.options.blur_passes); i--;)
	{
		//this.density_map = µ.pow_array(this.density_map, 20);
		for (var j = lgg.rand.int(this.options.blur_pass_peaks); j--;)
		{
			this.density_map[lgg.rand.int(this.density_map.length-1)] = 1;
		}
		for (var j = lgg.rand.int(this.options.blur_pass_valleys); j--;)
		{
			this.density_map[lgg.rand.int(this.density_map.length-1)] /= 2.5;
		}
		var blur_strength = Math.round(this.available_options.blur_strength.min + lgg.rand.int(this.available_options.blur_strength.max - this.available_options.blur_strength.min));
		if (blur_strength > 0) this.density_map = µ.blur_array(this.density_map, this.context.map_size_x, this.context.map_size_y, blur_strength);
		this.density_map = µ.normalize_array(this.density_map, 0, 1);
	}
	*/
	this.density_map = µ.blur_array(this.density_map, this.context.map_size_x, this.context.map_size_y, 1);
	this.density_map = µ.normalize_array(this.density_map, 0, 1);
	this.density_map = µ.pow_array(this.density_map, 2);
	for (var i = Math.ceil(this.options.room_attempts); i--;)
	{
		this.random_room();
	}
	this.random_start();
	this.tiles_dug = 0;
	var bail = 15000000;
	var dig_parameters = {
		tile: -1,
		direction: µ.directions[lgg.rand.int(3)],
		streak_counter: 5 + lgg.rand.int(10),
		turn_probability: this.options.turn_prob_min + lgg.rand.float(this.options.turn_prob_max - this.options.turn_prob_min),
		tele_probability: this.options.tele_prob_min + lgg.rand.float(this.options.tele_prob_max - this.options.tele_prob_min)
	}
	while (bail > 0 && this.tiles_dug < (this.context.map_size_x * this.context.map_size_y / this.options.free_to_rock_ratio))
	{
		this.dig_random_tile(dig_parameters);
		bail--;
	}
	console.log(this.tiles_dug + ' tiles dug in ' + (10000000 - bail) + ' attempts, ' + this.rooms.length + ' rooms');
	this.clean_up_rooms();
	console.log(this.rooms.length + ' rooms remaining');
	// for debugging
	context.density_map = this.density_map;
	for (var i = context.map_size_x * context.map_size_y; i--;)
	{
		context.tiles[i] = this.tiles[i];
		context.tiles_rooms[i] = this.room_map[i];
	}
}
lgg.SingularityInside_MapGen_Better.prototype.is_tile_within_bounds = function(tile)
// and by that I mean array bounds plus a margin of 1
{
	var map_x = this.context.map_size_x;
	var map_y = this.context.map_size_y;
	var x = tile % map_x;
	var y = Math.floor((tile - x) / map_x);
	if (x <= 0 || x >= map_x - 1 || y <= 0 || y >= map_y - 1)
	{
		return false;
	}
	return true;
}
lgg.SingularityInside_MapGen_Better.prototype.dig_random_tile = function(parameters)
{
	var context = this.context;
	if (parameters.tile == -1)
	{
		parameters.tile = this.diggable_walls[lgg.rand.int(this.diggable_walls.length-1)];
	}
	var tile = parameters.tile;
	parameters.streak_counter--;
	if (parameters.streak_counter <= 0)
	{
		parameters.streak_counter = 10 + lgg.rand.int(50);
		parameters.turn_probability = this.options.turn_prob_min + lgg.rand.float(this.options.turn_prob_max);
		parameters.tele_probability = this.options.tele_prob_min + lgg.rand.float(this.options.tele_prob_max);
	}
	this.rock_health[tile] -= this.density_map[tile] == 2 ? 0 : Math.pow(2-this.density_map[tile]*2, this.options.rock_hardness);
	if (this.rock_health[tile] <= 0)
	{
		this.rock_health[tile] = 0;
		this.dig_tile(tile);
	}
	if (this.density_map[tile] == 2 || this.rock_health[tile] <= 0)
	{
		if (lgg.rand.float(1) <= parameters.turn_probability)
		{
			var dir = µ.directions[lgg.rand.int(3)];
			while ((dir[0] == parameters.direction[0] && dir[1] == parameters.direction[1])||(dir[0] == -parameters.direction[0] && dir[1] == -parameters.direction[1]))
			{
				dir = µ.directions[lgg.rand.int(3)];
			}
			parameters.direction = dir;
		}
		if (lgg.rand.float(1) <= parameters.tele_probability)
		{
			parameters.tile = this.diggable_walls[lgg.rand.int(this.diggable_walls.length-1)];
		}
		else
		{
			var x = tile % context.map_size_x;
			var y = Math.floor((tile - x) / context.map_size_x);
			var next_tile = (y + parameters.direction[1]) * context.map_size_x + x + parameters.direction[0];
			var next_x = next_tile % context.map_size_x;
			var next_y = Math.floor((next_tile - next_x) / context.map_size_x);
			if (!this.is_tile_within_bounds(next_tile) || this.density_map[tile] == 2)
			{
				next_tile = this.diggable_walls[lgg.rand.int(this.diggable_walls.length-1)];
			}
			parameters.tile = next_tile;
		}
	}
	return parameters;
}
lgg.SingularityInside_MapGen_Better.prototype.dig_tile = function(tile)
{
	var context = this.context;
	this.tiles_dug++;
	this.tiles[tile] = 0;
	for (var w = 0; w < this.diggable_walls.length; w++)
	{
		if (this.diggable_walls[w] == tile)
		{
			this.diggable_walls.splice(w,1);
			this.marked_as_wall[tile] = 0;
			break;
		}
	}
	var x = tile % context.map_size_x;
	var y = Math.floor((tile - x) / context.map_size_x);
	for (var d = 4; d--;)
	{
		if (
				x + µ.directions[d][0] > 1
			&&	x + µ.directions[d][0] < context.map_size_x - 2
			&&	y + µ.directions[d][1] > 1
			&&	y + µ.directions[d][1] < context.map_size_y - 2
			)
		{
			var ttile = (y + µ.directions[d][1]) * context.map_size_x + (x + µ.directions[d][0]);
			if (this.tiles[ttile] == 1 && this.density_map[ttile] != 2 && this.marked_as_wall[ttile] == 0)
			{
				this.diggable_walls.push(ttile);
				this.marked_as_wall[ttile] = 1;
			}
		}
	}
}
lgg.SingularityInside_MapGen_Better.prototype.random_start = function()
{
	var context = this.context;
	var pos_x = Math.round(context.map_size_x/2 - 5 + lgg.rand.float(10));
	var pos_y = Math.round(context.map_size_y/2 - 5 + lgg.rand.float(10));
	var tile = pos_y * context.map_size_x + pos_x;
	while (this.density_map[tile] == 2)
	{
		var pos_x = Math.round(context.map_size_x/2 - 5 + lgg.rand.float(10));
		var pos_y = Math.round(context.map_size_y/2 - 5 + lgg.rand.float(10));
		var tile = pos_y * context.map_size_x + pos_x;
	}
	this.rock_health[tile] = 0;
	this.dig_tile(tile);
}
lgg.SingularityInside_MapGen_Better.prototype.random_room = function()
{
	var context = this.context;
	var map_dim = context.map_size_x * context.map_size_y;
	var size_x = 2 + Math.round(lgg.rand.float(1)*lgg.rand.float(1)*8);
	var area = 5 + (lgg.rand.float(1) * lgg.rand.float(1)) * 120;
	var size_y = Math.min(Math.max(Math.floor(area / size_x), 1),8);
	var pos_x = Math.floor(context.map_size_x/2 - context.map_size_x/2.7 + lgg.rand.float(context.map_size_x/1.35));
	var pos_y = Math.floor(context.map_size_y/2 - context.map_size_y/2.7 + lgg.rand.float(context.map_size_y/1.35));
	var start_x = Math.floor(pos_x - size_x/2);
	var end_x = Math.floor(pos_x + size_x/2);
	var start_y = Math.floor(pos_y - size_y/2);
	var end_y = Math.floor(pos_y + size_y/2);
	for (var x = start_x-2; x <= end_x+2; x++)
	{
		for (var y = start_y-2; y <= end_y+2; y++)
		{
			if (	x <= 1
				||	x >= context.map_size_x - 2
				||	y <= 1
				||	y >= context.map_size_y - 2
				||	this.room_map[y * context.map_size_x + x] != -1
				)
				return -1;
		}
	}
	var last_door = 0;
	var door_count = 0;
	var doors = [];
	var room_id = this.rooms.length;
	this.rooms.push(new lgg.SingularityInside_MapGen_Room(room_id));
	for (var x = start_x-1; x <= end_x+1; x++)
	{
		for (var y = start_y-1; y <= end_y+1; y++)
		{
			var tile = y * context.map_size_x + x;
			if (x >= start_x && x <= end_x && y >= start_y && y <= end_y)
			{
				this.rooms[room_id].potential_floor_tiles.push(tile);
				this.density_map[tile] /= 16;
				last_door+=2;
			}
			// outer walls
			else
			{
				if (door_count < 4
					&&	((x > start_x && x < end_x) || (y > start_y && y < end_y))
					&&	(((last_door >= 16 || door_count == 0) && lgg.rand.float(door_count > 0 ? Math.pow(door_count+1,2) : 2) <= 1+last_door/32)))
				{
					door_count++;
					last_door = 0;
					// handle actual door later..
					this.rooms[room_id].door_tiles.push(tile);
				}
				else
				{
					this.rooms[room_id].wall_tiles.push(tile);
					last_door+=1;
					this.density_map[tile] = 2;
				}
			}
			this.room_map[tile] = 0;
		}
	}
	return room_id;
}
/*
	completely dig out rooms that were reached, remove the rest
*/
lgg.SingularityInside_MapGen_Better.prototype.clean_up_rooms = function()
{
	for (var i = this.rooms.length - 1; i--;)
	{
		var tiles = this.rooms[i].door_tiles;
		var room_was_reached = false;
		for (var j = 0; j < tiles.length; j++)
		{
			if (this.tiles[tiles[j]] == 0)
			{
				room_was_reached = true;
				break;
			}
		}
		if (room_was_reached)
		{
			var tiles = this.rooms[i].potential_floor_tiles;
			for (var j = 0; j < tiles.length; j++)
			{
				this.tiles[tiles[j]] = 0;
			}
		}
		else
		{
			this.rooms.splice(i,1);
		}
	}
}
