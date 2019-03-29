rvr.Map = function(size_x, size_y)
{
	this.size_x = size_x;
	this.size_y = size_y;
	this.size_x_over_one = 1 / size_x;
	this.size_y_over_one = 1 / size_y;
	this.one_over_size_x = 1 / size_x;
	this.one_over_size_y = 1 / size_y;

	this.polygon_count = 0;
	this.sectors_x = 10;
	this.sectors_y = 10;
	this.hue = µ.rand(360);
	this.time_elapsed = 0;
	this.sector_size_x = this.size_x / this.sectors_x;
	this.sector_size_y = this.size_y / this.sectors_y;
	this.map_texture_size = rvr.map_texture_size;
	this.map_depthmap_size = rvr.depth_map_size;
	this.fluid_map_size = rvr.fluid_map_size;

	this.modifiers = {
		pack_size_factor: 1,
	};

	this.pix_colors = null;
	this.pix_depthmap = null;
	this.float_depthmap = new Float32Array(rvr.depth_map_size * rvr.depth_map_size);
	this.pix_heightmap = null;
	this.map_pixels = null;
}

rvr.Map.prototype.finalize = function()
{
	for (var i = 0; i < rvr.depth_map_size * rvr.depth_map_size; i++)
	{
		this.float_depthmap[i] = this.pix_depthmap[i * 4] / 255;
	}
}

rvr.Map.prototype.generate = function(stage, parent_seed, seed)
{
	var generator_name = 'test';
	this.generator = new rvr.Map_Generator(this, rvr.presets.map_generators[generator_name]);

	this.polygons = new Array(this.polygon_count);
	for (var i = 0; i < this.polygon_count; i++)
	{
		this.polygons[i] = new rvr.Map_Polygon(i, this.polygon_count);
	}

	//this.generator.load('west_norway_big.png');

	//this.generator.load('heightmap_small.png');
	//this.generator.load('west_norway.png');
	//this.generator.load('heightmap.png');
	//this.generator.load('maze64_cauldron.png');
	//this.generator.load('map3.png');

	this.generator.generate(seed);

	this.finalize();

}


rvr.Map.prototype.drop_smoke = function(pos_x, pos_y, strength)
{
	var scent_pos_x = µ.between(0, Math.floor((			pos_x * rvr.map.size_x_over_one) * rvr.smoke.texture_size), rvr.smoke.texture_size - 1);
	var scent_pos_y = µ.between(0, Math.floor((1.0 - 	pos_y * rvr.map.size_y_over_one) * rvr.smoke.texture_size), rvr.smoke.texture_size - 1);

	var tile_index = scent_pos_y * rvr.smoke_map_size + scent_pos_x;

	rvr.temp_array[0] = strength;
	rvr.temp_array[1] = strength;
	rvr.temp_array[2] = strength;
	rvr.temp_array[3] = 0;

	rvr.smoke.set_data_subimage(rvr.temp_array, scent_pos_x, scent_pos_y, 1, 1);
}



// returns true on collision
rvr.Map.prototype.collision_check = function(pos_x, pos_y, max_z)
{
	var pixel_x = Math.floor(this.map_texture_size * (		pos_x * this.one_over_size_x));
	var pixel_y = Math.floor(this.map_texture_size * (1.0 - pos_y * this.one_over_size_y));
	if (pixel_x < 0)						pixel_x = 0;
	if (pixel_x >= this.map_texture_size)	pixel_x = this.map_texture_size -1;
	if (pixel_y < 0)						pixel_y = 0;
	if (pixel_y >= this.map_texture_size)	pixel_y = this.map_texture_size -1;
	var idx = (pixel_y * this.map_texture_size + pixel_x) * 4;
	// walls are clear
	if (this.map_pixels[idx + 3] == 0.0)
	{
		return (this.get_depthmap_at_tile(pixel_x, pixel_y) > max_z);
	}
	else
	{
		return true;
	}
}

rvr.Map.prototype.get_wallmap_at = function(pos_x, pos_y)
{
	var pixel_x = Math.floor(this.map_texture_size * (		pos_x * this.one_over_size_x));
	var pixel_y = Math.floor(this.map_texture_size * (1.0 - pos_y * this.one_over_size_y));
	if (pixel_x < 0)						pixel_x = 0;
	if (pixel_x >= this.map_texture_size)	pixel_x = this.map_texture_size -1;
	if (pixel_y < 0)						pixel_y = 0;
	if (pixel_y >= this.map_texture_size)	pixel_y = this.map_texture_size -1;
	return this.map_pixels[(pixel_y * this.map_texture_size + pixel_x) * 4 + 3];
}

rvr.Map.prototype.get_depthmap = function(pos_x, pos_y)
{
	var pixel_x = Math.floor(this.map_depthmap_size * (		 pos_x * this.one_over_size_x));
	var pixel_y = Math.floor(this.map_depthmap_size * (1.0 - pos_y * this.one_over_size_y));
	if (pixel_x < 0)						pixel_x = 0;
	if (pixel_x >= this.map_depthmap_size)	pixel_x = this.map_depthmap_size -1;
	if (pixel_y < 0)						pixel_y = 0;
	if (pixel_y >= this.map_depthmap_size)	pixel_y = this.map_depthmap_size -1;

	return this.float_depthmap[pixel_y * this.map_depthmap_size + pixel_x];
	
	//return this.pix_depthmap[(pixel_y * this.map_depthmap_size + pixel_x) * 4 + 0] / 255; // only uses R channel at the moment
}

rvr.Map.prototype.get_depthmap_at_tile = function(pixel_x, pixel_y)
{
	//var idx = (pixel_y * this.map_depthmap_size + pixel_x) * 4;
	return this.float_depthmap[pixel_y * this.map_depthmap_size + pixel_x];
	//return this.pix_depthmap[idx + 0] / 255; // only uses R channel at the moment
}

rvr.Map.prototype.get_fluid_at = function(pos_x, pos_y)
{
	var pixel_x = Math.floor(this.fluid_map_size * (	  pos_x * this.one_over_size_x));
	var pixel_y = Math.floor(this.fluid_map_size * (1.0 - pos_y * this.one_over_size_y));
	if (pixel_x < 0)						pixel_x = 0;
	if (pixel_x >= this.fluid_map_size)	pixel_x = this.fluid_map_size -1;
	if (pixel_y < 0)						pixel_y = 0;
	if (pixel_y >= this.fluid_map_size)	pixel_y = this.fluid_map_size -1;
	rvr.fluids.get_data(rvr.temp_array, pixel_x, pixel_y, 1, 1);
	return rvr.temp_array[0];
}

rvr.Map.prototype.set_fluid_at = function(pos_x, pos_y, value)
{
	var pixel_x = Math.floor(this.fluid_map_size * (	  pos_x * this.one_over_size_x));
	var pixel_y = Math.floor(this.fluid_map_size * (1.0 - pos_y * this.one_over_size_y));
	if (pixel_x < 0)						pixel_x = 0;
	if (pixel_x >= this.fluid_map_size)	pixel_x = this.fluid_map_size -1;
	if (pixel_y < 0)						pixel_y = 0;
	if (pixel_y >= this.fluid_map_size)	pixel_y = this.fluid_map_size -1;
	rvr.temp_array[0] = value;
	rvr.temp_array[1] = 0;
	rvr.temp_array[2] = 0;
	rvr.temp_array[3] = 0;
	rvr.fluids.set_data_subimage(rvr.temp_array, pixel_x, pixel_y, 1, 1);
}

rvr.Map.prototype.draw = function(camera)
{
	for (var i = 0; i < this.polygon_count; i++)
	{
		//this.polygons[i].draw();
	}
}

// this will be phased out
rvr.Map.prototype.trace = function(start_x, start_y, end_x, end_y)
{
	for (var i = 0; i < this.polygon_count; i++)
	{
		if (this.polygons[i].trace(start_x, start_y, end_x, end_y))
		{
			return true;
		}
	}
	return false;
}


rvr.Map.prototype.trace_pixels__hopeful = function(start_x, start_y, start_z, end_x, end_y, end_z, step, dist)
{
	var curr_x = start_x;
	var curr_y = start_y;

	var distance_max = dist >= 0 ? dist : µ.distance2D(start_x, start_y, end_x, end_y);
	var steps = Math.ceil(distance_max / step);
	var s_x = (end_x - start_x) / steps;
	var s_y = (end_y - start_y) / steps;
	var remaining = 1.0;
	var distance_curr = 0;
	for (var i = 0; i < steps; i++)
	{
		rvr.map_pixels_looked_at++;
		var distance_frac = (distance_curr / distance_max);
		var height = (1.0 - distance_frac) * start_z + distance_frac * end_z;
		var depth = this.get_depthmap(curr_x, curr_y);
		if (depth > height)
		{
			return 0;
		}
/*
		var wall = this.get_wallmap_at(curr_x, curr_y);
		if (wall > 0.0)
		{
			return 0;
		}
*/
		curr_x += s_x;
		curr_y += s_y;
		var distance_curr = µ.distance2D(start_x, start_y, curr_x, curr_y);
	}
	return 1.0;
}



rvr.Map.prototype.trace_pixels__old = function(start_x, start_y, start_z, end_x, end_y, end_z, step, dist)
{
	var curr_x = start_x;
	var curr_y = start_y;
	var d_x = Math.abs(start_x - end_x);
	var d_y = Math.abs(start_y - end_y);
	var d_z = end_z - start_z;

	var s_x = start_x < end_x ? step : -step;
	var s_y = start_y < end_y ? step : -step;
	var err = d_x - d_y;
	var e2 = 0.0;
	var remaining = 1.0;

	var distance_max = dist >= 0 ? dist : µ.distance2D(start_x, start_y, end_x, end_y);
	var distance_curr = 0;

	for (var i = 0; i < 10000; i++)
	{
		rvr.map_pixels_looked_at++;
		var distance_frac = (distance_curr / distance_max);
		var height = (1.0 - distance_frac) * start_z + distance_frac * end_z;
		var depth = this.get_depthmap(curr_x, curr_y);
		//remaining -= (depth - height);
		//if (remaining <= 0.0)
		if (depth > height)
		{
			return 0;
		}
		var wall = this.get_wallmap_at(curr_x, curr_y);
		if (wall > 0.0)
		{
			return 0.0;
		}
		if (Math.abs(curr_x - end_x) <= step  && Math.abs(curr_y - end_y) <= step)
		{
			return remaining;
		}
		e2 = 2.0 * err;
		if (e2 > -d_y)
		{
			err -= d_y;
			curr_x += s_x;
		}
		if (e2 < d_x)
		{
			err += d_x;
			curr_y += s_y;
		}
		var distance_curr = µ.distance2D(start_x, start_y, curr_x, curr_y);
	}
	return 0.0;
}





rvr.Map.prototype.trace_pixels_end_point__hopeful = function(start_x, start_y, start_z, end_x, end_y, end_z, step, result, dist)
{
	var curr_x = start_x;
	var curr_y = start_y;
	var distance_max = dist >= 0 ? dist : µ.distance2D(start_x, start_y, end_x, end_y);
	var steps = Math.ceil(distance_max / step);
	var s_x = (end_x - start_x) / steps;
	var s_y = (end_y - start_y) / steps;
	var distance_curr = 0;
	for (var i = 0; i < steps; i++)
	{
		rvr.map_pixels_looked_at++;
		var distance_frac = (distance_curr / distance_max);
		var height = (1.0 - distance_frac) * start_z + distance_frac * end_z;
		var depth = this.get_depthmap(curr_x, curr_y);
		if (depth > height)
		{
			result[0] = curr_x;
			result[1] = curr_y;
			return true;
		}
/*
		var wall = this.get_wallmap_at(curr_x, curr_y);
		if (wall > 0.0)
		{
			result[0] = curr_x;
			result[1] = curr_y;
			return true;
		}
*/
		curr_x += s_x;
		curr_y += s_y;
		var distance_curr = µ.distance2D(start_x, start_y, curr_x, curr_y);
	}
	result[0] = curr_x;
	result[1] = curr_y;
	return false;
}




rvr.Map.prototype.trace_pixels_end_point__old = function(start_x, start_y, start_z, end_x, end_y, end_z, step, result, dist)
{
	var curr_x = start_x;
	var curr_y = start_y;
	var d_x = Math.abs(start_x - end_x);
	var d_y = Math.abs(start_y - end_y);
	var d_z = end_z - start_z;

	//var max_delta = Math.max(d_x, d_y);
	//step = step / max_delta;

	var s_x = start_x < end_x ? step : -step;
	var s_y = start_y < end_y ? step : -step;
	var err = d_x - d_y;
	var e2 = 0.0;
	var remaining = 1.0;

	var distance_max = dist >= 0 ? dist : µ.distance2D(start_x, start_y, end_x, end_y);
	var distance_curr = 0;

	for (var i = 0; i < 10000; i++)
	{
		rvr.map_pixels_looked_at++;
		var distance_frac = (distance_curr / distance_max);
		var height = (1.0 - distance_frac) * start_z + distance_frac * end_z;

		var depth = this.get_depthmap(curr_x, curr_y);
		//remaining -= (depth - height) * 1.0;
		//if (remaining <= 0.0)
		if (depth > height)
		{
			result[0] = curr_x;
			result[1] = curr_y;
			return true;
		}

		var wall = this.get_wallmap_at(curr_x, curr_y);
		if (wall > 0.0)
		{
			result[0] = curr_x;
			result[1] = curr_y;
			return true;
		}
		if (Math.abs(curr_x - end_x) <= step  && Math.abs(curr_y - end_y) <= step)
		{
			result[0] = curr_x;
			result[1] = curr_y;
			return true;
		}
		e2 = 2.0 * err;
		if (e2 > -d_y)
		{
			err -= d_y;
			curr_x += s_x;
		}
		if (e2 < d_x)
		{
			err += d_x;
			curr_y += s_y;
		}
		var distance_curr = µ.distance2D(start_x, start_y, curr_x, curr_y);
	}
	result[0] = curr_x;
	result[1] = curr_y;
	return false;
}


rvr.Map.prototype.trace_pixels = rvr.Map.prototype.trace_pixels__old;
rvr.Map.prototype.trace_pixels_end_point = rvr.Map.prototype.trace_pixels_end_point__old;

rvr.Map.prototype.trace_pixels = rvr.Map.prototype.trace_pixels__hopeful;
rvr.Map.prototype.trace_pixels_end_point = rvr.Map.prototype.trace_pixels_end_point__hopeful;


rvr.Map.prototype.draw_floor = function(camera)
{

	rvr.c.rectangle_textured.draw(
		rvr.CAM_PLAYER,
		//rvr.map.tex_depthmap_interp_nearest,
		//rvr.map.tex_depthmap_interp_linear,
		//rvr.map.tex_colors_interp_nearest,
		rvr.map.tex_colors_interp_linear,
		rvr.world_size_x_div_2,
		rvr.world_size_y_div_2,
		rvr.world_size_x,
		rvr.world_size_y,
		90,
		0, 1, 1, 1,
		-1,-1,-1,-1,
		-1,-1,-1,-1,
		-1,-1,-1,-1);
	rvr.c.flush_all();

}