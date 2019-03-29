'use strict';

civ.Map = function(tiles_x, tiles_y, subtiles_x, subtiles_y)
{
	this.last_subtiles_count = -10000;
	this.last_subtiles_ratio = 0;

	this.tiles_x = tiles_x;
	this.tiles_y = tiles_y;
	this.tiles_total = tiles_x * tiles_y;
	this.tile_size_x = civ.WORLD_SIZE_X / this.tiles_x;
	this.tile_size_y = civ.WORLD_SIZE_Y / this.tiles_y;
	this.tile_size_x2 = this.tile_size_x / 2;
	this.tile_size_y2 = this.tile_size_y / 2;

	this.tiles__terrain_temp 				= new Float32Array(this.tiles_total);

	this.terrain_type_counts 				= new Float32Array(civ.TERRAIN_TYPE__COUNT);

	this.tiles__terrain_type 				= new Uint8Array(this.tiles_total);

	this.tiles__terrain_height 				= new Float32Array(this.tiles_total);
	this.tiles__temperature					= new Float32Array(this.tiles_total);
	this.tiles__terrain_biome 				= new Float32Array(this.tiles_total);
	this.tiles__vegetation 				= new Float32Array(this.tiles_total);
	this.tiles__humidity					= new Float32Array(this.tiles_total);

	this.subtiles_x = subtiles_x;
	this.subtiles_y = subtiles_y;

	this.subtiles_total = tiles_x * tiles_y * subtiles_x * subtiles_y;
	this.subtiles_total_x = tiles_x * subtiles_x;
	this.subtiles_total_y = tiles_y * subtiles_y;
	this.subtile_size_x = civ.WORLD_SIZE_X / this.subtiles_total_x;
	this.subtile_size_y = civ.WORLD_SIZE_Y / this.subtiles_total_y;
	this.subtile_size_x2 = this.subtile_size_x / 2;
	this.subtile_size_y2 = this.subtile_size_y / 2;

	this.subtiles__terrain_feature 				= new Uint8Array(this.subtiles_total);		// the already existing one
	this.subtiles__improvement_type 			= new Uint8Array(this.subtiles_total);		// the already existing one
	this.subtiles__improvement_build_type 		= new Uint8Array(this.subtiles_total);		// what is planned or even in progress
	this.subtiles__improvement_build_progress 	= new Float32Array(this.subtiles_total);

	this.subtiles__last_think 				= new Uint8Array(this.subtiles_total);

	this.subtiles__road_status	 			= new Float32Array(this.subtiles_total);

	this.subtiles__harvestable1 			= new Float32Array(this.subtiles_total);		// e.g. wood, wheat
	this.subtiles__harvestable2 			= new Float32Array(this.subtiles_total);		// e.g. deer

	this.tex_tiles_data1					= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_terrain_tiles					= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_terrain_tiles_interp_linear	= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, true);
	this.tex_biome_tiles					= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_temperature_tiles				= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_humidity_tiles					= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_vegetation_tiles				= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);
	this.tex_terrain_height					= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data) {}, this), -1, false);

	this.tex_subtiles						= civ.c.texture_from_canvas(µ.generate_canvas_texture(this.subtiles_total_x, this.subtiles_total_y, function(ctx, size_x, size_y, data) {}, this), -1, false);

}

civ.Map.prototype.count_neighbours = function(start_x, start_y, dist, terrain_type)
{
	var count = 0;
	for (var x = -dist; x < (dist+1); x++)
	{
		var tile_x = start_x + x;
		if (tile_x > 0 && tile_x < this.tiles_x)
		{
			for (var y = -dist; y < (dist+1); y++)
			{
				var tile_y = start_y + y;
				if (tile_y > 0 && tile_y < this.tiles_y)
				{
					if (this.tiles__terrain_type[tile_y * this.tiles_x + tile_x] == terrain_type)
					{
						count++;
					}
				}
			}
		}
	}
	return count;
}


civ.Map.prototype.rain_drop = function(direction)
{

	var directions = [
		[1,0],
		[1,1],
		[0,1],
		[-1,1],
		[-1,0],
		[-1,-1],
		[0,-1],
		[1,-1],
	];

	var tile_x = µ.rand_int(this.tiles_x - 1);
	var tile_y = µ.rand_int(this.tiles_y - 1);
	var tile_index = tile_y * this.tiles_x + tile_x;

	var carried_sediment = 0;

	var bail = 500;
	var done = false;
	while (!done && bail > 0)
	{

		bail--;
		var height = this.tiles__terrain_height[tile_index];

		//if (height <= 0.45)
		{
			//return; done = true;
		}

		var best_height = height;
		var best_tile_index = -1;
		var best_tile_x = -1;
		var best_tile_y = -1;

		for (var d = 0; d < 8; d++)
		{
			var this_tile_x = tile_x + directions[d][0];
			var this_tile_y = tile_y + directions[d][1];
			if (this_tile_x >= 0 && this_tile_y >= 0 && this_tile_x < this.tiles_x && this_tile_y < this.tiles_y)
			{
				var this_tile_index = this_tile_y * this.tiles_x + this_tile_x;
				var this_height = this.tiles__terrain_height[this_tile_index];
				if 
					(
							(direction == 0 && this_height < height && this_height < best_height)
						||	(direction == 1 && this_height > height && this_height > best_height)
					)
				{
					best_tile_index = this_tile_y * this.tiles_x + this_tile_x;
					best_height = this_height;
					best_tile_x = this_tile_x;
					best_tile_y = this_tile_y;
				}
			}
		}
		if (best_tile_index == -1)
		{
			done = true;
			this.tiles__terrain_height[tile_index] += carried_sediment;
		}
		else
		{


			var deposited = µ.rand(carried_sediment) / 2;
			carried_sediment -= deposited;

			var carried = µ.rand(height - best_height) / 16;
			carried_sediment += carried;


			this.tiles__terrain_height[tile_index] = this.tiles__terrain_height[tile_index] - carried + deposited;

			//this.tiles__terrain_height[best_tile_index] += deposited - carried;
			tile_x = best_tile_x;
			tile_y = best_tile_y;
			tile_index = best_tile_index;

		}
	}
}

civ.Map.prototype.set_building = function(building_type, subtile_x, subtile_y)
{

	var subtile_index = subtile_y * this.subtiles_total_x + subtile_x;
	if (this.subtiles__improvement_type[subtile_index] == civ.BUILDING_TYPE__NONE)
	{
		this.subtiles__improvement_build_type[subtile_index] 		= building_type;
		this.subtiles__improvement_build_progress[subtile_index] 	= 0;
	}

	this.update_subtile(subtile_x, subtile_y);

}

civ.Map.prototype.moar_rain = function()
{
	for (var j = 0; j < 5; j++)
	{
		var iterations = Math.round(this.tiles_total * 0.5);
		for (var i = 0; i < iterations; i++)
		{
			this.rain_drop(0);
		}
		//µ.blur_array(this.tiles__terrain_height, this.tiles__terrain_temp, this.tiles_x, this.tiles_y, 1, 0.1);
		µ.normalize_array(this.tiles__terrain_height, this.tiles__terrain_temp, 0, 0.2);
	}


	var self = this;

	this.select_terrain_tiles();

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_terrain_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_tiles, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_terrain_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_tiles_interp_linear, false);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_height_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_height, true);

}

civ.Map.prototype.get_average_height = function()
{
	var total = 0;
	for(var i = 0; i < this.tiles_total; i++)
	{
		total += this.tiles__terrain_height[i];
	}
	return total / this.tiles_total;
}

civ.Map.prototype.generate = function()
{

	civ.perlin.random_seed();
	civ.perlin1.random_seed();
	civ.perlin2.random_seed();
	civ.perlin3.random_seed();


/*
	for (var terrain_type_id = 1, len = civ.terrain_types.length; terrain_type_id < len; terrain_type_id++)
	{
		civ.terrain_types[terrain_type_id].weight = 0.1 + µ.rand(1.8);
	}
//*/


	for(var i = 0; i < this.tiles_total; i++)
	{
		this.tiles__terrain_type[i] 		= civ.TERRAIN_TYPE__OCEAN;
		this.tiles__temperature[i] 			= 0;
		this.tiles__terrain_height[i] 		= 0;
		this.tiles__terrain_biome[i] 		= 0;
		this.tiles__vegetation[i] 			= 0;
		this.tiles__humidity[i] 			= 0;
	}
	for(var i = 0; i < this.subtiles_total; i++)
	{
		this.subtiles__terrain_feature[i] 				= civ.TERRAIN_FEATURE__NONE;
		this.subtiles__harvestable1[i] 					= 0;
		this.subtiles__terrain_feature[i] 				= 0;
		this.subtiles__improvement_type[i] 				= 0;
		this.subtiles__improvement_build_type[i] 		= 0;
		this.subtiles__improvement_build_progress[i] 	= 0;


	}

//	µ.blur_array(this.tiles__terrain_height, this.tiles__terrain_temp, this.tiles_x, this.tiles_y, 1);

	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		var frac_x = 2.0 * Math.abs(tile_x / this.tiles_x - 0.5);
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var frac_y = 2.0 * Math.abs(tile_y / this.tiles_y - 0.5);
			var tile_index = tile_y * this.tiles_x + tile_x;

			var height1 = civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (17.7 + frac_x * 10),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (17.7 + frac_y * 10),
						0.5 + µ.rand(0.00001)) * 0.4
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (50),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (50),
						0.5 + µ.rand(0.00002)) * 0.3
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (187),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (170),
						0.5 + µ.rand(0.00003)) * 0.2
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (260),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (270),
						0.5 + µ.rand(0.00004)) * 0.1
			;

			var height2 = civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (15.123721 + frac_x * 10),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (16.423417 + frac_y * 10),
						0.5 + µ.rand(0.00001)) * 0.4
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (52.41243),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (49.12351),
						0.5 + µ.rand(0.00002)) * 0.3
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (183.41231),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (173.123123),
						0.5 + µ.rand(0.00003)) * 0.2
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (254.1231235),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (263.3515123),
						0.5 + µ.rand(0.00004)) * 0.1
			;

			var height3 = civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (3.123721 + frac_x * 10),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (3.423417 + frac_y * 10),
						0.5 + µ.rand(0.00001)) * 0.4
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (4.41243),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (4.12351),
						0.5 + µ.rand(0.00002)) * 0.3
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (5.41231),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (5.123123),
						0.5 + µ.rand(0.00003)) * 0.2
					+
					civ.perlin.noise(
						tile_x * civ.ONE_OVER_WORLD_SIZE_X * (6.1231235),
						tile_y * civ.ONE_OVER_WORLD_SIZE_Y * (6.3515123),
						0.5 + µ.rand(0.00004)) * 0.1
			;


			this.tiles__terrain_height[tile_index] = height3 * height1 + (1 - height3) * height2;


		}
	}

	µ.normalize_array(this.tiles__terrain_height, this.tiles__terrain_temp, 0, 1);

	this.moar_rain();


	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		var frac_x = 2.0 * Math.abs(tile_x / this.tiles_x - 0.5);
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var frac_y = 2.0 * Math.abs(tile_y / this.tiles_y - 0.5);
			var frac_x = 2.0 * Math.abs(tile_x / this.tiles_x - 0.5);
			var tile_index = tile_y * this.tiles_x + tile_x;

			//this.tiles__terrain_height[tile_index] = 1 - (1 - this.tiles__terrain_height[tile_index]) * (1 - this.tiles__terrain_height[tile_index]);

			this.tiles__terrain_biome[tile_index] =
					0.8 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 43, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 56, 0.5)
				+	0.2 * civ.perlin2.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 144, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 144, 0.5);

			this.tiles__temperature[tile_index] = (1 - (frac_y * frac_y)) * 0.85 + 0.15 * civ.perlin1.noise(
				tile_x * civ.ONE_OVER_WORLD_SIZE_X * 53.123123,
				tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 67.123184,
				0.5 + µ.rand(0.01));

/*
			this.tiles__humidity[tile_index] = (1 - (frac_y * frac_y)) * 0.7 + 0.3 * civ.perlin1.noise(
				tile_x * civ.ONE_OVER_WORLD_SIZE_X * 126.456,
				tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 151.435,
				0.5 + µ.rand(0.05));
*/
			this.tiles__humidity[tile_index] = Math.pow(0.5 + 0.5 * Math.sin(3.0 * frac_y), 2) * 0.55
				+ 0.2 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 22.34, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 33.5, 0.4 + µ.rand(0.01))
				+ 0.15 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 50, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 63, 0.4 + µ.rand(0.01))
				+ 0.1 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 250, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 363, 0.4 + µ.rand(0.01))
				;

			this.tiles__humidity[tile_index] = 0.5 * (this.tiles__humidity[tile_index] * this.tiles__humidity[tile_index] + this.tiles__humidity[tile_index] * this.tiles__temperature[tile_index]);
			this.tiles__humidity[tile_index] *= this.tiles__humidity[tile_index] * this.tiles__humidity[tile_index];

			//this.tiles__temperature[tile_index] *= this.tiles__temperature[tile_index];

			this.tiles__vegetation[tile_index] = (Math.pow((0.5 + 0.5 * Math.sin((2 + µ.rand(.01)) * (frac_y + frac_x))), 2)) * 0.55 * (0.5 + 0.5 * frac_y)
				+	0.05 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 323, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 486, 0.5)
				+	0.1 * civ.perlin1.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 273, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 186, 0.5)
				+	0.2 * civ.perlin2.noise(tile_x * civ.ONE_OVER_WORLD_SIZE_X * 31, tile_y * civ.ONE_OVER_WORLD_SIZE_Y * 29.7, 0.5)

				;

			this.tiles__vegetation[tile_index] = 0.5 * (this.tiles__vegetation[tile_index] + Math.min(this.tiles__temperature[tile_index], this.tiles__vegetation[tile_index]));
			this.tiles__vegetation[tile_index] *= this.tiles__vegetation[tile_index] * this.tiles__vegetation[tile_index];

			//this.tiles__vegetation[tile_index] = 1 - (1 - this.tiles__vegetation[tile_index]) * (1 - this.tiles__vegetation[tile_index]) * (1 - this.tiles__vegetation[tile_index]);

/*
this.tiles__vegetation[tile_index]		= µ.rand(1);
this.tiles__terrain_height[tile_index]	= µ.rand(1);
this.tiles__temperature[tile_index]		= µ.rand(1);
this.tiles__terrain_biome[tile_index]	= µ.rand(1);
this.tiles__humidity[tile_index]		= µ.rand(1);
//*/
		}
	}
//*
	µ.normalize_array(this.tiles__temperature, this.tiles__terrain_temp, 0, 1);
	µ.normalize_array(this.tiles__terrain_biome, this.tiles__terrain_temp, 0, 1);
	µ.normalize_array(this.tiles__humidity, this.tiles__terrain_temp, 0, 1);
	µ.normalize_array(this.tiles__vegetation, this.tiles__terrain_temp, 0, 1);
//*/
	this.select_terrain_tiles();
	this.update_textures();
}

civ.Map.prototype.select_terrain_tiles = function()
{
	var _height = this.tiles__terrain_height;
	var _temp = this.tiles__temperature;
	var _biome = this.tiles__terrain_biome;
	var _humidity = this.tiles__humidity;
	var _vegetation = this.tiles__vegetation;
	for (var terrain_type_id = 0, len = civ.terrain_types.length; terrain_type_id < len; terrain_type_id++)
	{
		this.terrain_type_counts[terrain_type_id] = 0;
	}
	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var i = tile_y * this.tiles_x + tile_x;
			var frac = 2.0 * Math.abs(tile_y / this.tiles_y - 0.5);
			var best_terrain_score = -99999999999999999;
			var best_terrain_id = null;
			var best_terrain_type = null;
			var eligible = [];
			for (var terrain_type_id = 1, len = civ.terrain_types.length; terrain_type_id < len; terrain_type_id++)
			{
				var terrain_type = civ.terrain_types[terrain_type_id];
				if (
						_height[i] >= terrain_type.min_elevation
					&& 	_height[i] <= terrain_type.max_elevation
					&&	_humidity[i] >= terrain_type.min_humidity
					&& 	_humidity[i] <= terrain_type.max_humidity
					&&	_temp[i] >= terrain_type.min_temperature
					&& 	_temp[i] <= terrain_type.max_temperature
					&&	_vegetation[i] >= terrain_type.min_vegetation
					&& 	_vegetation[i] <= terrain_type.max_vegetation
					)
				{
					var terrain_score = 0;
					terrain_score += 0.25 * this.calc_terrain_fitness(_height[i], terrain_type.min_elevation, terrain_type.max_elevation);
					terrain_score += 0.25 * this.calc_terrain_fitness(_humidity[i], terrain_type.min_humidity, terrain_type.max_humidity);
					terrain_score += 0.25 * this.calc_terrain_fitness(_temp[i], terrain_type.min_temperature, terrain_type.max_temperature);
					terrain_score += 0.25 * this.calc_terrain_fitness(_vegetation[i], terrain_type.min_vegetation, terrain_type.max_vegetation);
					terrain_score *= terrain_score * terrain_type.weight;

					if (best_terrain_score < terrain_score)
					{
						best_terrain_score = terrain_score;
						best_terrain_type = terrain_type;
						best_terrain_id = terrain_type_id;
					}

					eligible.push([terrain_type_id, terrain_score]);
				}
			}
/*
			var picked = µ.pick_randomly_from_weighted_list(eligible, function(item, index, data){ 
				return item[1];
				var blah = 1.0 + item[1] * 1000;
				return blah * blah * blah * blah * blah * blah * blah;
			}, null);

			if (picked != null)
			{
				this.tiles__terrain_type[i] = eligible[picked][0];
			}
*/

			if (best_terrain_id === civ.TERRAIN_TYPE__ICE



			 && _temp[i] > 0.25

			 )
			//if (this.tiles__terrain_type[i] == civ.TERRAIN_TYPE__ICE && _temp[i] > 0.25)
			{
				console.log('wtf', _height[i], best_terrain_id, 

					(
							_height[i] >= best_terrain_type.min_elevation
						&& 	_height[i] <= best_terrain_type.max_elevation
						&&	_humidity[i] >= best_terrain_type.min_humidity
						&& 	_humidity[i] <= best_terrain_type.max_humidity
						&&	_temp[i] >= best_terrain_type.min_temperature
						&& 	_temp[i] <= best_terrain_type.max_temperature
						&&	_vegetation[i] >= best_terrain_type.min_vegetation
						&& 	_vegetation[i] <= best_terrain_type.max_vegetation
					)

					);
			}


			if (best_terrain_id !== null)
			{
				this.tiles__terrain_type[i] = best_terrain_id;
			}


			this.terrain_type_counts[this.tiles__terrain_type[i]]++;
		}
	}
	var total = 0;
	for (var terrain_type_id = 0, len = civ.terrain_types.length; terrain_type_id < len; terrain_type_id++)
	{
		var terrain_type = civ.terrain_types[terrain_type_id];
		var count = this.terrain_type_counts[terrain_type_id];
		var frac = count / this.tiles_total;
		total += count;
		if (frac < 0.0001)
		{
			//console.log('->', terrain_type.name, count, (Math.round(frac * 100000) / 1000) + '%');
		}
	}
	//console.log('-----------------------------------');
}

civ.Map.prototype.calc_terrain_fitness = function(value, min, max)
{
	var range = max - min;
	var val = (value - min) / range;
	var dist = (Math.max(val, 1 - val)) * 1.0;
	//return dist;
	//return 1 / (1 - dist * dist * dist * dist);
	return (1 / (dist)) / range;
}

civ.Map.prototype.set = function(ctx, size_x, size_y)
{
}

civ.Map.prototype.update_textures = function(ctx, size_x, size_y)
{
	var self = this;

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_tiles_data1_texture(ctx, size_x, size_y);
	}, this), this.tex_tiles_data1, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_biome_texture(ctx, size_x, size_y);
	}, this), this.tex_biome_tiles, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_temperature_texture(ctx, size_x, size_y);
	}, this), this.tex_temperature_tiles, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_humidity_texture(ctx, size_x, size_y);
	}, this), this.tex_humidity_tiles, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_vegetation_texture(ctx, size_x, size_y);
	}, this), this.tex_vegetation_tiles, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_terrain_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_tiles, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_terrain_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_tiles_interp_linear, false, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.tiles_x, this.tiles_y, function(ctx, size_x, size_y, data)
	{
		self.update_height_textures(ctx, size_x, size_y);
	}, this), this.tex_terrain_height, true, true);

	civ.c.update_texture_from_canvas(µ.generate_canvas_texture(this.subtiles_total_x, this.subtiles_total_y, function(ctx, size_x, size_y, data)
	{
		self.update_subtiles_textures(ctx, size_x, size_y);
	}, this), this.tex_subtiles, true, true);
}

civ.Map.prototype.update_height_textures = function(ctx, size_x, size_y)
{
	
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];
	var bands = 999;
	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var frac_y = tile_y / this.tiles_y;

			var tile_index = (tile_y * size_x + tile_x) * 4;
			//var val = 1 - Math.round(this.tiles__terrain_height[tile_y * this.tiles_x + tile_x]  * bands) / bands;
			var val = 1 - this.tiles__terrain_height[tile_y * this.tiles_x + tile_x];
			µ.HSL_to_RGB((240 * val), 1, 0.5, temp_rgb);

			pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
			pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
			pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
			pix_array[tile_index + 3] = 255;

		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.update_tiles_data1_texture = function(ctx, size_x, size_y)
{
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];
	for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
	{
		for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
		{
			var frac_y = tile_y / this.tiles_y;
			var tile_index = tile_y * size_x + tile_x;
			var tile_index4 = tile_index * 4;
			pix_array[tile_index4 + 0] = this.tiles__terrain_type[tile_index];			// can't have more than 255 terrain types
			pix_array[tile_index4 + 1] = Math.round(this.tiles__terrain_height[tile_index] 	* 255);
			pix_array[tile_index4 + 2] = Math.round(this.tiles__temperature[tile_index] 	* 255);
			pix_array[tile_index4 + 3] = Math.round(this.tiles__humidity[tile_index] 		* 255);

/*
			console.log(tile_x, tile_y,
				this.tiles__terrain_type[tile_index],
				this.tiles__terrain_height[tile_index], Math.round(this.tiles__terrain_height[tile_index] 	* 255),
				this.tiles__temperature[tile_index], Math.round(this.tiles__temperature[tile_index] 	* 255),
				this.tiles__humidity[tile_index], Math.round(this.tiles__humidity[tile_index] 		* 255)
			);
//*/
		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.update_temperature_texture = function(ctx, size_x, size_y)
{
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];

	var bands = 24;

	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var tile_index = (tile_y * size_x + tile_x) * 4;
			var val = 1 - Math.round(this.tiles__temperature[tile_y * this.tiles_x + tile_x]  * bands) / bands;
			µ.HSL_to_RGB((240 * val) % 360, 1, 0.5, temp_rgb);
			pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
			pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
			pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
			pix_array[tile_index + 3] = 255;
		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.update_humidity_texture = function(ctx, size_x, size_y)
{
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];

	var bands = 24;

	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var tile_index = (tile_y * size_x + tile_x) * 4;
			var val = 1 - Math.round(this.tiles__humidity[tile_y * this.tiles_x + tile_x]  * bands) / bands;
			µ.HSL_to_RGB((240 * val) % 360, 1, 0.5, temp_rgb);
			pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
			pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
			pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
			pix_array[tile_index + 3] = 255;
		}
	}
	ctx.putImageData(imgd, 0, 0);
}


civ.Map.prototype.update_vegetation_texture = function(ctx, size_x, size_y)
{
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];

	var bands = 24;

	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var tile_index = (tile_y * size_x + tile_x) * 4;
			var veg = this.tiles__vegetation[tile_y * this.tiles_x + tile_x];
			var val = 1 - Math.round(veg  * bands) / bands;
			µ.HSL_to_RGB((240 * val) % 360, 1, 0.5, temp_rgb);
			pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
			pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
			pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
			pix_array[tile_index + 3] = 255;
		}
	}
	ctx.putImageData(imgd, 0, 0);
}


civ.Map.prototype.update_biome_texture = function(ctx, size_x, size_y)
{
	
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];

	var bands = 4;
	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var tile_index = (tile_y * size_x + tile_x) * 4;
			var val = 1 - Math.round(this.tiles__terrain_biome[tile_y * this.tiles_x + tile_x]  * bands) / bands;
			µ.HSL_to_RGB((240 * val) % 360, 1, 0.5, temp_rgb);
			pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
			pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
			pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
			pix_array[tile_index + 3] = 255;
		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.update_terrain_textures = function(ctx, size_x, size_y)
{
	
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];
	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var tile_index = (tile_y * size_x + tile_x) * 4;
			var tile_index2 = tile_y * size_x + tile_x;

			var ttype = this.tiles__terrain_type[tile_index2];

			civ.terrain_types[ttype].min_elevation

			var frac = (this.tiles__terrain_height[tile_index2] - civ.terrain_types[ttype].min_elevation) / (civ.terrain_types[ttype].max_elevation - civ.terrain_types[ttype].min_elevation);

			if (ttype == civ.TERRAIN_TYPE__NONE)
			{
				pix_array[tile_index + 0] = 255;
				pix_array[tile_index + 1] = 0;
				pix_array[tile_index + 2] = 255;
			}

			if (ttype == civ.TERRAIN_TYPE__PLAINS)
			{
				pix_array[tile_index + 0] = 50;
				pix_array[tile_index + 1] = 130;
				pix_array[tile_index + 2] = 50;
			}
			if (ttype == civ.TERRAIN_TYPE__TUNDRA)
			{
				pix_array[tile_index + 0] = 120;
				pix_array[tile_index + 1] = 150;
				pix_array[tile_index + 2] = 120;
			}
			else if (ttype == civ.TERRAIN_TYPE__TROPICAL_FOREST)
			{
				pix_array[tile_index + 0] = 0;
				pix_array[tile_index + 1] = 70;
				pix_array[tile_index + 2] = 0;
			}
			else if (ttype == civ.TERRAIN_TYPE__TROPICAL_RAINFOREST)
			{
				pix_array[tile_index + 0] = 0;
				pix_array[tile_index + 1] = 50;
				pix_array[tile_index + 2] = 0;
			}
			else if (ttype == civ.TERRAIN_TYPE__FOREST)
			{
				pix_array[tile_index + 0] = 5;
				pix_array[tile_index + 1] = 90;
				pix_array[tile_index + 2] = 5;
			}
			else if (ttype == civ.TERRAIN_TYPE__LIGHT_FOREST)
			{
				pix_array[tile_index + 0] = 45;
				pix_array[tile_index + 1] = 110;
				pix_array[tile_index + 2] = 25;
			}
			else if (ttype == civ.TERRAIN_TYPE__SHRUBLAND)
			{
				pix_array[tile_index + 0] = 50;
				pix_array[tile_index + 1] = 100;
				pix_array[tile_index + 2] = 35;
			}
			else if (ttype == civ.TERRAIN_TYPE__BOREAL_FOREST)
			{
				pix_array[tile_index + 0] = 10;
				pix_array[tile_index + 1] = 70;
				pix_array[tile_index + 2] = 50;
			}
			else if (ttype == civ.TERRAIN_TYPE__TAIGA)
			{
				pix_array[tile_index + 0] = 20;
				pix_array[tile_index + 1] = 50;
				pix_array[tile_index + 2] = 40;
			}
			else if (ttype == civ.TERRAIN_TYPE__SWAMP_FOREST)
			{
				pix_array[tile_index + 0] = 40;
				pix_array[tile_index + 1] = 100;
				pix_array[tile_index + 2] = 30;
			}
			else if (ttype == civ.TERRAIN_TYPE__SHRUB_SWAMP)
			{
				pix_array[tile_index + 0] = 40;
				pix_array[tile_index + 1] = 80;
				pix_array[tile_index + 2] = 30;
			}
			else if (ttype == civ.TERRAIN_TYPE__SWAMP)
			{
				pix_array[tile_index + 0] = 30;
				pix_array[tile_index + 1] = 60;
				pix_array[tile_index + 2] = 25;
			}
			else if (ttype == civ.TERRAIN_TYPE__SWAMP_FOREST_HILLS)
			{
				pix_array[tile_index + 0] = 60;
				pix_array[tile_index + 1] = 120;
				pix_array[tile_index + 2] = 70;
			}
			else if (ttype == civ.TERRAIN_TYPE__WETLANDS)
			{
				pix_array[tile_index + 0] = 55;
				pix_array[tile_index + 1] = 80;
				pix_array[tile_index + 2] = 60;
			}
			else if (ttype == civ.TERRAIN_TYPE__MARSH)
			{
				pix_array[tile_index + 0] = 45;
				pix_array[tile_index + 1] = 90;
				pix_array[tile_index + 2] = 60;
			}
			else if (ttype == civ.TERRAIN_TYPE__MARSH_MEADOW)
			{
				pix_array[tile_index + 0] = 45;
				pix_array[tile_index + 1] = 120;
				pix_array[tile_index + 2] = 60;
			}
			else if (ttype == civ.TERRAIN_TYPE__ICE)
			{
				pix_array[tile_index + 0] = 250;
				pix_array[tile_index + 1] = 250;
				pix_array[tile_index + 2] = 255;
			}
			else if (ttype == civ.TERRAIN_TYPE__HILLS)
			{
				pix_array[tile_index + 0] = 115;
				pix_array[tile_index + 1] = 175;
				pix_array[tile_index + 2] = 110;
			}
			else if (ttype == civ.TERRAIN_TYPE__LOW_HILLS)
			{
				pix_array[tile_index + 0] = 20;
				pix_array[tile_index + 1] = 115;
				pix_array[tile_index + 2] = 20;
			}
			else if (ttype == civ.TERRAIN_TYPE__STEPPE)
			{
				pix_array[tile_index + 0] = 90;
				pix_array[tile_index + 1] = 130;
				pix_array[tile_index + 2] = 20;
			}
			else if (ttype == civ.TERRAIN_TYPE__MUD)
			{
				pix_array[tile_index + 0] = 130;
				pix_array[tile_index + 1] = 90;
				pix_array[tile_index + 2] = 20;
			}
			else if (ttype == civ.TERRAIN_TYPE__MUD_PLAINS)
			{
				pix_array[tile_index + 0] = 190;
				pix_array[tile_index + 1] = 110;
				pix_array[tile_index + 2] = 30;
			}
			else if (ttype == civ.TERRAIN_TYPE__MUD_HILLS)
			{
				pix_array[tile_index + 0] = 230;
				pix_array[tile_index + 1] = 150;
				pix_array[tile_index + 2] = 30;
			}
			else if (ttype == civ.TERRAIN_TYPE__ARID_PLAINS)
			{
				pix_array[tile_index + 0] = 230;
				pix_array[tile_index + 1] = 200;
				pix_array[tile_index + 2] = 80;
			}
			else if (ttype == civ.TERRAIN_TYPE__ARID_SHRUBLAND)
			{
				pix_array[tile_index + 0] = 220;
				pix_array[tile_index + 1] = 220;
				pix_array[tile_index + 2] = 80;
			}
			else if (ttype == civ.TERRAIN_TYPE__ARID_FOREST)
			{
				pix_array[tile_index + 0] = 210;
				pix_array[tile_index + 1] = 240;
				pix_array[tile_index + 2] = 80;
			}
			else if (ttype == civ.TERRAIN_TYPE__ARID_JUNGLE)
			{
				pix_array[tile_index + 0] = 130;
				pix_array[tile_index + 1] = 190;
				pix_array[tile_index + 2] = 40;
			}
			else if (ttype == civ.TERRAIN_TYPE__GRASS_SAVANNAH)
			{
				pix_array[tile_index + 0] = 215;
				pix_array[tile_index + 1] = 215;
				pix_array[tile_index + 2] = 90;
			}
			else if (ttype == civ.TERRAIN_TYPE__SHRUB_SAVANNAH)
			{
				pix_array[tile_index + 0] = 205;
				pix_array[tile_index + 1] = 205;
				pix_array[tile_index + 2] = 70;
			}
			else if (ttype == civ.TERRAIN_TYPE__TREE_SAVANNAH)
			{
				pix_array[tile_index + 0] = 195;
				pix_array[tile_index + 1] = 195;
				pix_array[tile_index + 2] = 50;
			}
			else if (ttype == civ.TERRAIN_TYPE__GRASS_SAVANNAH_HILLS)
			{
				pix_array[tile_index + 0] = 215;
				pix_array[tile_index + 1] = 215;
				pix_array[tile_index + 2] = 90;
			}
			else if (ttype == civ.TERRAIN_TYPE__SHRUB_SAVANNAH_HILLS)
			{
				pix_array[tile_index + 0] = 205;
				pix_array[tile_index + 1] = 205;
				pix_array[tile_index + 2] = 70;
			}
			else if (ttype == civ.TERRAIN_TYPE__TREE_SAVANNAH_HILLS)
			{
				pix_array[tile_index + 0] = 195;
				pix_array[tile_index + 1] = 195;
				pix_array[tile_index + 2] = 50;
			}
			else if (ttype == civ.TERRAIN_TYPE__ARID_HILLS)
			{
				pix_array[tile_index + 0] = 200;
				pix_array[tile_index + 1] = 170;
				pix_array[tile_index + 2] = 60;
			}
			else if (ttype == civ.TERRAIN_TYPE__DESERT)
			{
				pix_array[tile_index + 0] = 250;
				pix_array[tile_index + 1] = 230;
				pix_array[tile_index + 2] = 120;
			}
			else if (ttype == civ.TERRAIN_TYPE__BEACH)
			{
				pix_array[tile_index + 0] = 250;
				pix_array[tile_index + 1] = 243;
				pix_array[tile_index + 2] = 200;
			}
			else if (ttype == civ.TERRAIN_TYPE__CORAL_REEF)
			{
				pix_array[tile_index + 0] = 30 + Math.round(frac * 55);
				pix_array[tile_index + 1] = 130 + Math.round(frac * 155);
				pix_array[tile_index + 2] = 155 + Math.round(frac * 100);;
			}

			else if (ttype == civ.TERRAIN_TYPE__SHALLOW_OCEAN)
			{
				pix_array[tile_index + 0] = 30 + Math.round(frac * 55);
				pix_array[tile_index + 1] = 30 + Math.round(frac * 55);
				pix_array[tile_index + 2] = 205 + Math.round(frac * 50);;
			}
			else if (ttype == civ.TERRAIN_TYPE__FROZEN_OCEAN)
			{
				pix_array[tile_index + 0] = 110 + Math.round(frac * 55);
				pix_array[tile_index + 1] = 110 + Math.round(frac * 55);
				pix_array[tile_index + 2] = 235 + Math.round(frac * 20);;
			}
			else if (ttype == civ.TERRAIN_TYPE__OCEAN)
			{
				pix_array[tile_index + 0] = 0 + Math.round(frac * frac * 25);
				pix_array[tile_index + 1] = 0 + Math.round(frac * frac * 25);
				pix_array[tile_index + 2] = 40 + Math.round(frac * frac * 175);
			}
			else if (ttype == civ.TERRAIN_TYPE__MOUNTAINS)
			{
				pix_array[tile_index + 0] = 170 + Math.round(frac * frac * 25);
				pix_array[tile_index + 1] = 170 + Math.round(frac * frac * 25);
				pix_array[tile_index + 2] = 170 + Math.round(frac * frac * 25);
			}
			else if (ttype == civ.TERRAIN_TYPE__SNOWY_MOUNTAINS)
			{
				pix_array[tile_index + 0] = 230 + Math.round(frac * frac * 25);
				pix_array[tile_index + 1] = 230 + Math.round(frac * frac * 25);
				pix_array[tile_index + 2] = 240 + Math.round(frac * frac * 15);
			}
			else if (ttype == civ.TERRAIN_TYPE__SNOWY_HILLS)
			{
				pix_array[tile_index + 0] = 190 + Math.round(frac * frac * 45);
				pix_array[tile_index + 1] = 190 + Math.round(frac * frac * 45);
				pix_array[tile_index + 2] = 210 + Math.round(frac * frac * 15);
			}
			pix_array[tile_index + 3] = 255;
		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.update_subtiles_textures = function(ctx, size_x, size_y)
{
	
	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var temp_rgb = [0, 0, 0];
	for(var tile_x = 0; tile_x < this.subtiles_total_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.subtiles_total_y; tile_y++)
		{
			var tile_index = ((this.subtiles_total_y - tile_y) * size_x + tile_x) * 4;
			if (this.subtiles__improvement_type[tile_y * this.tiles_x + tile_x] == civ.IMPROVEMENT_TYPE__NONE)
			{
				µ.HSL_to_RGB(360 * this.subtiles__harvestable1[tile_y * this.tiles_x + tile_x], 1, 0.5, temp_rgb);
				pix_array[tile_index + 0] = Math.round(temp_rgb[0] * 255);
				pix_array[tile_index + 1] = Math.round(temp_rgb[1] * 255);
				pix_array[tile_index + 2] = Math.round(temp_rgb[2] * 255);
				pix_array[tile_index + 3] = Math.round(this.subtiles__harvestable1[tile_y * this.tiles_x + tile_x] * 195);
				//pix_array[tile_index + 3] = 120;

				pix_array[tile_index + 0] = Math.round(tile_x / this.subtiles_total_x * 255);
				pix_array[tile_index + 1] = Math.round(tile_y / this.subtiles_total_y * 255);
				pix_array[tile_index + 2] = 0;

			}
		}
	}
	ctx.putImageData(imgd, 0, 0);
}

civ.Map.prototype.draw = function()
{
}

civ.Map.prototype.set_data_subimage = function(array, start_x, start_y, size_x, size_y)
{
	civ.c.update_rgba_texture_subimage_from_array(array, this.subtiles_total_x, this.tex_subtiles, start_x, start_y, size_x, size_y);
}

civ.Map.prototype.update_subtile = function(subtile_x, subtile_y)
{

	var tile_x = Math.floor(this.subtile_x / this.subtiles_x);
	var tile_y = Math.floor(this.subtile_x / this.subtiles_y);

	// flip vertical
	var subtile_y_flipped = this.subtiles_total_y - subtile_y - 1;
	var subtile_index = subtile_y * this.subtiles_total_x + subtile_x;
	var subtile_index_flipped = subtile_y_flipped * this.subtiles_total_x + subtile_x;

/*
	if (this.subtiles__improvement_type[subtile_index] == civ.BUILDING_TYPE__NONE)
	{
		this.subtiles__improvement_build_type[subtile_index] 		= civ.BUILDING_TYPE__COLONY;
		this.subtiles__improvement_build_progress[subtile_index] 	= 0;
	}
*/

	µ.HSL_to_RGB(360 * this.subtiles__harvestable1[subtile_index], 0, 0, civ.temp_array3);
	civ.temp_array4_uint8[0] = Math.round(this.subtiles__harvestable1[subtile_index] * 255);
	civ.temp_array4_uint8[1] = this.subtiles__improvement_type[subtile_index]; // Math.round(civ.temp_array3[1] * 255);
	civ.temp_array4_uint8[2] = this.subtiles__improvement_build_type[subtile_index]; // Math.round(civ.temp_array3[2] * 255);
	civ.temp_array4_uint8[3] = Math.round(this.subtiles__improvement_build_progress[subtile_index] * 255);
	this.set_data_subimage(civ.temp_array4_uint8, subtile_x, subtile_y_flipped, 1, 1);

	//console.log(this.subtiles__improvement_build_type[subtile_index]);
}

civ.Map.prototype.think = function()
{
	//var array = new Uint8Array(4);
	// update X random subtiles 
	for(var i = 0; i < civ.RANDOM_SUBTILE_UPDATES_PER_TICK; i++)
	{
		var tile_x = µ.rand_int(this.subtiles_total_x - 1);
		var tile_y = µ.rand_int(this.subtiles_total_y - 1);
		var tile_index = (tile_y * this.subtiles_total_x + tile_x);
		this.subtiles__harvestable1[tile_index] += civ.HARVESTABLE_REGROWTH_PER_TICK;
		if (this.subtiles__harvestable1[tile_index] > 1)
		{
			this.subtiles__harvestable1[tile_index] = 1;
		}
		this.update_subtile(tile_x, tile_y);
	}
	if (civ.now - this.last_subtiles_count > 30000)
	{
		this.last_subtiles_count = civ.now;
		var done = 0;
		for(var i = 0; i < this.subtiles_total; i++)
		{
			done += this.subtiles__harvestable1[i];
		}

		var ratio = done / this.subtiles_total;
		this.last_subtiles_ratio = ratio;
	}
}

civ.Map.prototype._ = function()
{
}
