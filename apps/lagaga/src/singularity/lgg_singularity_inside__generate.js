"use strict";

lgg.SingularityInside_Room = function()
{
	this.floor_tiles = [];
	this.wall_tiles = [];
}
lgg.SingularityInside_Room.prototype.__ = function()
{
}
lgg.SingularityInside.prototype.dig_tile = function(tile)
{
	if (this.tiles[tile] != 0)
	{
		this.empty_tiles.push(tile);
	}
	this.tiles[tile] = 0;
}
lgg.SingularityInside.prototype.generate_map = function()
{
	var map_dim = this.map_size_x * this.map_size_y;
	this.tiles = new Array(map_dim);			// 0 free, 1 wall
	this.tiles2 = new Array(map_dim);		// "feautures" like exits or terminals
			/*
				0:	nothing
				1:	exit
				2:	terminal
				3:	water
				automatic door
				door
			*/
	this.tiles_rooms = new Array(map_dim);
	this.rooms = [];
	this.tile_vis = new Array(map_dim);		// visible for player
	this.tile_exp = new Array(map_dim);		// "explored" (seen) by player
	this.tightness = new Array(map_dim);			// only for free tiles, how "cramped" they are
	this.scent_exit = new Array(map_dim);
	this.scent_vis = new Array(map_dim);
	this.scent_drones = new Array(map_dim);
	this.scent_enemies = new Array(map_dim);
	this.scent_vis_enemies = new Array(map_dim);
	this.scent_player = new Array(map_dim);
	this.scent_vis_player = new Array(map_dim);
	for (var i = map_dim; i--;)
	{
		this.tiles[i] = 1;
		this.tiles_rooms[i] = -1;
		this.tile_vis[i] = 0;
		this.tile_exp[i] = 0;
		this.tiles2[i] = 0;
		this.tightness[i] = 0;
		this.scent_exit[i] = 0;
		this.scent_vis[i] = 0;
		this.scent_player[i] = 0;
		this.scent_vis_player[i] = 0;
		this.scent_enemies[i] = 0;
		this.scent_vis_enemies[i] = 0;
		this.scent_drones[i] = 0;
	}
	this.empty_tiles = [];
	//this.generate_map__bogus();
	var gen = new lgg.SingularityInside_MapGen_Better(this);
	gen.generate();
	/* "calculate tightness"..
		for free tiles this roughly means:
		< 0 - 0.1		huge room
		< 0.1 - 0.2		big room
		< 0.2 - 0.4		room
		< 0.4 - 0.6		near wall
		< 0.6 - 0.8		corridor
		< 0.8 - 1		dead end
	*/
	for (var x = 0; x < this.map_size_x; x++)
	{
		for (var y = 0; y < this.map_size_y; y++)
		{
			var i = y * this.map_size_x + x;
			var free_and_max = this.count_neighbours(x,y, this.tiles[i] == 1 ? 3 : 8)
			var free = free_and_max.free;
			var max = free_and_max.max;
			var free_max1 = 1 - free/max;
			var free_and_max = this.count_neighbours(x,y, this.tiles[i] == 1 ? 2 : 3)
			var free = free_and_max.free;
			var max = free_and_max.max;
			free_max1 = (free_max1 + (1 - free/max)) / 2;
			var free_and_max = this.count_neighbours(x,y, this.tiles[i] == 1 ? 1 : 1)
			var free = free_and_max.free;
			var max = free_and_max.max;
			free_max1 = (free_max1 + (1 - free/max)) / 2;
			this.tightness[i] = free_max1;
		}
	}
	this.note_noteworthy_tiles();
	// place exits
	for (var passes = 2 + lgg.rand.int(2); passes--;)
	{
		if (this.empty_dead_end_tiles.length > 0)
		{
			this.tiles2[this.use_empty_dead_end_tile()] = 1;
		}
		else if (this.empty_tiles_near_wall.length > 0)
		{
			this.tiles2[this.use_empty_tile_near_wall()] = 1;
		}
		else
		{
			console.log('could not place exit.. oops?!');
		}
	}
/*
	// place terminals
	for (var passes = 2 + lgg.rand.int(2); passes--;)
	{
		if (this.walls_near_empty_tile.length > 0)
		{
			this.tiles2[this.use_wall_near_empty_tile()] = 2;
		}
	}
	// place puddles?
	if (lgg.rand.int(0) == 0)
	{
		var puddle_threshold = 0.05 + lgg.rand.float(0.175) * lgg.rand.float(1);
		for (var i = this.tiles.length; i--;)
		{
			if (this.tiles[i] == 0 && this.tightness[i] < puddle_threshold)
			{
				this.tiles2[i] = 3;
			}
		}
		this.denoise_puddles(7);
		this.denoise_puddles(4);
		this.denoise_puddles(3);
		this.denoise_puddles(2);
	}
*/	
	for (var passes = 250; passes--;)
	{
		this.scent_exit = this.think_scent(this.scent_exit, 1, 0.98, 0.0000000000001, 1);
	}
	this.generate_map_textures();
	i = this.find_empty_tile();
	while (this.scent_exit[i] > 0.01) // risky..?
	{
		i = this.find_empty_tile();
	}
	var x = i % this.map_size_x;
	var y = ((i - x) / this.map_size_y);
	this.player.pos_x = 0.5;
	this.player.pos_y = 0.5;
	this.player.pos_x = x * this.tilesize + this.tilesize2;
	this.player.pos_y = y * this.tilesize + this.tilesize2;
}
lgg.SingularityInside.prototype.note_noteworthy_tiles = function()
{
	this.border_tiles = [];
	this.empty_tiles = [];
	this.empty_dead_end_tiles = [];
	this.empty_tiles_near_wall = [];
	this.empty_tiles_between_walls = [];
	this.walls_near_empty_tile = [];
	for (var i = this.map_size_x * this.map_size_y; i--;)
	{
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
		if (x >= 1 && x < (this.map_size_x - 1) && y >= 1 && (y < this.map_size_y - 1))
		{
			if (this.tiles[i] == 1)
			{
				if (
							this.tiles[i + 1] == 0
						||	this.tiles[i - 1] == 0
						||	this.tiles[i + this.map_size_x] == 0
						||	this.tiles[i - this.map_size_x] == 0
					)
				{
					this.walls_near_empty_tile.push(i);
				}
			}
			else if (this.tiles[i] != 1)
			{
				this.empty_tiles.push(i);
				if (
							this.tiles[i + 1] == 1
						||	this.tiles[i - 1] == 1
						||	this.tiles[i + this.map_size_x] == 1
						||	this.tiles[i - this.map_size_x] == 1
					)
				{
					this.empty_tiles_near_wall.push(i);
				}
				if (
						(
							this.tiles[i + 1] == 1
						&&	this.tiles[i - 1] == 1
						&&	this.tiles[i + this.map_size_x] == 0
						&&	this.tiles[i - this.map_size_x] == 0
						)
					||
						(
							this.tiles[i + 1] == 0
						&&	this.tiles[i - 1] == 0
						&&	this.tiles[i + this.map_size_x] == 1
						&&	this.tiles[i - this.map_size_x] == 1
						)
					)
				{
					this.empty_tiles_between_walls.push(i);
				}
				if (
						(
							this.tiles[i + 1] == 1
						&&	this.tiles[i - 1] == 1
						&&	this.tiles[i + this.map_size_x] == 1
						&&	this.tiles[i - this.map_size_x] == 0
						)
					||
						(
							this.tiles[i + 1] == 1
						&&	this.tiles[i - 1] == 1
						&&	this.tiles[i + this.map_size_x] == 0
						&&	this.tiles[i - this.map_size_x] == 1
						)
					||
						(
							this.tiles[i + 1] == 1
						&&	this.tiles[i - 1] == 0
						&&	this.tiles[i + this.map_size_x] == 1
						&&	this.tiles[i - this.map_size_x] == 1
						)
					||
						(
							this.tiles[i + 1] == 0
						&&	this.tiles[i - 1] == 1
						&&	this.tiles[i + this.map_size_x] == 1
						&&	this.tiles[i - this.map_size_x] == 1
						)
					)
				{
					this.empty_dead_end_tiles.push(i);
				}
			}
		}
		else
		{
			this.border_tiles.push(i);
		}
	}
	console.log('-----------------');
	console.log('tiles', this.tiles.length);
	console.log('border_tiles', this.border_tiles.length);
	console.log('empty_tiles', this.empty_tiles.length);
	console.log('empty_dead_end_tiles', this.empty_dead_end_tiles.length);
	console.log('empty_tiles_near_wall', this.empty_tiles_near_wall.length);
	console.log('empty_tiles_between_walls', this.empty_tiles_between_walls.length);
}
lgg.SingularityInside.prototype.map_emptyness = function()
{
	var non_empty_tiles = 0;
	for (var i = this.map_size_x * this.map_size_y; i--;)
	{
		if (this.tiles[i] != 0)
		{
			non_empty_tiles++;
		}
	}
	return 1 - (non_empty_tiles / (this.map_size_x * this.map_size_y));
}
lgg.SingularityInside.prototype.count_neighbours = function(x,y,radius)
{
	var max = 0;
	var free = 0;
	for (var x2 = -radius; x2 <= radius; x2++)
	{
		for (var y2 = -radius; y2 <= radius; y2++)
		{
			if (x2 == 0 && y2 == 0)
				continue;
			if (	x + x2 > 0 && x + x2 < this.map_size_x
				&&	y + y2 > 0 && y + y2 < this.map_size_y)
			{
				max++;
				if (this.tiles[(y + y2) * this.map_size_x + x + x2] == 0)
					free++;
			}
		}
	}
	return {
		free: free,
		max: max,
	}
}
lgg.SingularityInside.prototype.denoise_map = function(threshold, threshold2)
{
	var t = new Array(this.map_size_x * this.map_size_y);
	var directions =
		[
			[0,1], // up
			[1,1], // up right
			[1,0], // right
			[1,-1], // right down
			[0,-1], // down
			[-1,-1], // down left
			[-1,0], // left
			[-1,1], // left up
		];
	for (var i = this.map_size_x * this.map_size_y; i--;)
	{
		var x = i % this.map_size_x;
		var y = Math.floor((i - x) / this.map_size_x);
		if (x <= 0 ||	x >= this.map_size_x - 1 ||	y <= 0 ||	y >= this.map_size_y - 1)
		{
			t[i] = this.tiles[i];
			continue;
		}
		var neighbours = 0;
		for (d = 8; d--;)
		{
			var x2 = x + directions[d][0];
			var y2 = y + directions[d][1];
			if (
						x2 <= 0
					||	x2 >= this.map_size_x - 1
					||	y2 <= 0
					||	y2 >= this.map_size_y - 1
					||  this.tiles[y2 * this.map_size_x + x2] != 0
				)
			{
				neighbours++;
			}
		}
		if (neighbours <= threshold)
		{
			t[i] = 0;
		}
		else if (neighbours >= threshold2)
		{
			t[i] = 1;
		}
		else
		{
			t[i] = this.tiles[i];
		}
	}
	this.tiles = t;
}
lgg.SingularityInside.prototype.denoise_puddles = function(threshold)
{
	var t = new Array(this.map_size_x * this.map_size_y);
	var directions =
		[
			[0,1], // up
			[1,1], // up right
			[1,0], // right
			[1,-1], // right down
			[0,-1], // down
			[-1,-1], // down left
			[-1,0], // left
			[-1,1], // left up
		];
	for (var i = this.map_size_x * this.map_size_y; i--;)
	{
		var x = i % this.map_size_x;
		var y = Math.floor((i - x) / this.map_size_x);
		if (x <= 0 ||	x >= this.map_size_x - 1 ||	y <= 0 ||	y >= this.map_size_y - 1 || this.tiles2[i] != 3)
		{
			t[i] = this.tiles2[i];
			continue;
		}
		var neighbours = 0;
		for (d = 8; d--;)
		{
			var x2 = x + directions[d][0];
			var y2 = y + directions[d][1];
			if (
						x2 <= 0
					||	x2 >= this.map_size_x - 1
					||	y2 <= 0
					||	y2 >= this.map_size_y - 1
					||  this.tiles2[y2 * this.map_size_x + x2] == 3
				)
			{
				neighbours++;
			}
		}
		if (neighbours <= threshold)
		{
			t[i] = 0;
		}
		else
		{
			t[i] = this.tiles2[i];
		}
	}
	this.tiles2 = t;
}
lgg.SingularityInside.prototype.find_tunnel_start = function()
{
	//console.log('tunnel start', this.empty_tiles.length);
	for (var i = 5000; i--;)
	{
		var tile = this.empty_tiles[lgg.rand.int(this.empty_tiles.length - 1)];
		x = tile % this.map_size_x;
		y = Math.floor((tile - x) / this.map_size_x);
/*
		if (this.tiles[y * this.map_size_x + x] == 0 &&
		(
				this.tiles[(y) * this.map_size_x + x + 1] == 1
			||	this.tiles[(y) * this.map_size_x + x - 1] == 1
			||	this.tiles[(y + 1) * this.map_size_x + x] == 1
			||	this.tiles[(y - 1) * this.map_size_x + x] == 1
		))
*/
		{
			return tile;
		}
	}
	console.log('tunnel start finder FAIL!?');
}
lgg.SingularityInside.prototype.use_empty_tile_near_wall = function()
{
	var index = lgg.rand.int(this.empty_tiles_near_wall.length-1);
	var tile = this.empty_tiles_near_wall[index];
	this.empty_tiles_near_wall.splice(index,1);
	return tile;
}
lgg.SingularityInside.prototype.use_empty_dead_end_tile = function()
{
	var index = lgg.rand.int(this.empty_dead_end_tiles.length-1);
	var tile = this.empty_dead_end_tiles[index];
	this.empty_dead_end_tiles.splice(index,1);
	return tile;
}
lgg.SingularityInside.prototype.use_empty_tile_between_walls = function()
{
	var index = lgg.rand.int(this.empty_tiles_between_walls.length-1);
	var tile = this.empty_tiles_between_walls[index];
	this.empty_tiles_between_walls.splice(index,1);
	return tile;
}
lgg.SingularityInside.prototype.use_empty_tile = function()
{
	var index = lgg.rand.int(this.empty_tiles.length-1);
	var tile = this.empty_tiles[index];
	this.empty_tiles.splice(index,1);
	return tile;
}
lgg.SingularityInside.prototype.use_wall_near_empty_tile = function()
{
	var index = lgg.rand.int(this.walls_near_empty_tile.length-1);
	var tile = this.walls_near_empty_tile[index];
	this.walls_near_empty_tile.splice(index,1);
	return tile;
}
lgg.SingularityInside.prototype.find_empty_tile_near_wall = function()
{
	return this.empty_tiles_near_wall[lgg.rand.int(this.empty_tiles_near_wall.length-1)];
}
lgg.SingularityInside.prototype.find_empty_dead_end_tile = function()
{
	return this.empty_dead_end_tiles[lgg.rand.int(this.empty_dead_end_tiles.length-1)];
}
lgg.SingularityInside.prototype.find_empty_tile_between_walls = function()
{
	return this.empty_tiles_between_walls[lgg.rand.int(this.empty_tiles_between_walls.length-1)];
}
lgg.SingularityInside.prototype.find_empty_tile = function()
{
	return this.empty_tiles[lgg.rand.int(this.empty_tiles.length-1)];
}
lgg.SingularityInside.prototype.find_wall_near_empty_tile = function()
{
	return this.walls_near_empty_tile[lgg.rand.int(this.walls_near_empty_tile.length-1)];
}
lgg.SingularityInside.prototype.make_room = function(pos_x, pos_y, size_x, size_y, force)
{
	if (pos_x - 2 <= 0 || pos_x + size_x + 2 >= this.map_size_x)	return -1;
	if (pos_y - 2 <= 0 || pos_y + size_y + 2 >= this.map_size_y)	return -1;
	if (force == false)
	{
		/*
		for (var x = pos_x-1; x <= pos_x + size_x + 1; x++)
		{
			if (this.tiles[(pos_y - 1) * this.map_size_x + x] == 0) return -1;
			if (this.tiles[(pos_y + size_y + 1) * this.map_size_x + x] == 0) return -1;
		}
		for (var y = pos_y-1; y <= pos_y + size_y + 1; y++)
		{
			if (this.tiles[y * this.map_size_x + (pos_x - 1)] == 0) return -1;
			if (this.tiles[y * this.map_size_x + (pos_x + size_x + 1)] == 0) return -1;
		}
		*/
		for (var x = pos_x-1; x <= (pos_x  + size_x+1); x++)
		{
			for (var y = pos_y-1; y <= (pos_y  + size_y+1); y++)
			{
				if (this.tiles_rooms[y * this.map_size_x + x] > 0) return -1;
			}
		}
	}
	var room_id = this.rooms.length;
	this.rooms.push(new lgg.SingularityInside_Room(room_id));
	for (var x = pos_x; x <= (pos_x + size_x); x++)
	{
		for (var y = pos_y; y <= (pos_y  + size_y); y++)
		{
			//if ((x >= pos_x) && (x <= (pos_x + size_x)) && (x >= pos_y) && (y <= (pos_y + size_y)))
			{
				this.rooms[room_id].floor_tiles.push(y * this.map_size_x + x);
				this.dig_tile(y * this.map_size_x + x);
			}
			//else
			{
				//this.tiles[y * this.map_size_x + x] = 1;
				//this.rooms[room_id].wall_tiles.push(y * this.map_size_x + x);
			}
			this.tiles_rooms[y * this.map_size_x + x] = room_id;
		}
	}
	//console.log('made room #' + room_id + ' at', pos_x, pos_y, size_x, size_y, force);
	return room_id;
}