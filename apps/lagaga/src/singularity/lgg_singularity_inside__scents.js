"use strict";

lgg.SingularityInside.prototype.sniff = function(scents, tile)
{
	var size_x = this.map_size_x;
	var size_y = this.map_size_y;
	var best_scent = 0;
	for (var j = scents.length; j--;)
	{
		best_scent += scents[j][0][tile] * scents[j][1];
	}
	var dir = {x:0,y:0};
	var directions = [
		{tile_i:	tile + size_x,	dir:	{x:0,y:+1},},
		{tile_i:	tile - size_x,	dir:	{x:0,y:-1},},
		{tile_i:	tile + 1,		dir:	{x:+1,y:0},},
		{tile_i:	tile -1,		dir:	{x:-1,y:0},},
	];
	for (var i = 4; i--;)
	{
		if (directions[i].tile_i >= 0 &&	directions[i].tile_i < size_x * size_y && this.tiles[directions[i].tile_i] != 1)
		{
			var scent = 0;
			for (var j = scents.length; j--;)
			{
				scent += scents[j][0][directions[i].tile_i] * scents[j][1];
			}
			if (scent > best_scent || (scent == best_scent && µ.rand_int(1) == 0))
			{
				best_scent = scent;
				dir = directions[i].dir;
			}
		}
	}
	return dir;
}

lgg.SingularityInside.prototype.think_scent = function(scent, probability, fade_factor, fade_constant, scent_tile_type /* 0: none, 1: exit */)
{
	var size_x = this.map_size_x;
	var size_y = this.map_size_y;
	var return_array = new Array(size_x * size_y);
	var directions = [+size_x, -size_x, +1, -1];
	var i = 0;
	for (var j = this.empty_tiles.length; j--;)
	{
		i = this.empty_tiles[j];
		if (µ.rand(1) < probability)
		{
			return_array[i] = scent[i];
		}
		else
		{
			if (scent_tile_type > 0 && this.tiles2[i] == scent_tile_type)
			{
				return_array[i] = 1;
			}
			else if (this.tiles[i] != 1)
			{
				var count = 1;
				var sum = scent[i];
				for (k = 4; k--;)
				{
					if (
							i + directions[k] >= 1
						&&	i + directions[k] < size_x * size_y - 1
						&&	(this.tiles[i + directions[k]] != 1 || scent[i + directions[k]] > 0) // special wall tiles might *emit* scent, after all
							)
					{
						sum += scent[i + directions[k]];
						count++;
					}
				}
				return_array[i] = sum/count * fade_factor - fade_constant;
				if (return_array[i] < 0)
					return_array[i] = 0;
			}			
		}
	}
	return return_array;
}
