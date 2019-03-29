btx.Map = function(size)
{
	this.size = size;
	this.one_over_size = 1 / size;

	this.tile_count = size * size;

	this.tile__material 			= new Float32Array(this.tile_count);
	this.tile__blastability		 	= new Float32Array(this.tile_count);
	this.tile__damage 				= new Float32Array(this.tile_count);

	this.seed = 13224654;

	this.noise_frequency = 2.0;
	this.noise_freq_top = 7 / size;
	this.noise_freq_bottom = 3 / size;

	this.min_number_of_mines = 3;
	this.max_number_of_mines = 20;

	var float_tex_render = new Float32Array(this.tile_count * 4);
	var float_tex_material = new Float32Array(this.tile_count * 4);
	this.tex_render = btx.c.texture_from_array(float_tex_render, this.size);
	this.tex_material = btx.c.texture_from_array(float_tex_material, this.size);

	this.generate();
}

btx.Map.prototype.explosion = function(pos_x, pos_y, radius, power)
{
	start_x = Math.max(0, pos_x - radius);
	end_x = Math.min(this.size - 1, pos_x + radius);
	start_y = Math.max(0, pos_y - radius);
	end_y = Math.min(this.size - 1, pos_y + radius);

	var sub_array_size_x = (end_x - start_x)
	var sub_array_size_y = (end_y - start_y)
	
	var subarray_tex_render = new Float32Array(sub_array_size_x * sub_array_size_y * 4);

	for (var x = 0; x < sub_array_size_x; x++)
	{
		for (var y = 0; y < sub_array_size_y; y++)
		{
			var map_x = start_x + x;
			var map_y = start_y + y;
			var map_index = map_y * this.size + map_x;
			this.tile__damage[map_index] += 0.1;
			if (this.tile__damage >= 1.0)
			{
				this.tile__material[map_index] = 0;
			}
			
		}
	}
	
}

btx.Map.prototype.generate = function()
{
	console.log('generating map');
	this.tile__material 			= new Float32Array(this.tile_count);
	this.tile__blast_resistance 	= new Float32Array(this.tile_count);
	this.tile__damage 				= new Float32Array(this.tile_count);

	var float_tex_render = new Float32Array(this.tile_count * 4);
	var float_tex_material = new Float32Array(this.tile_count * 4);

	for (var i = 0; i < this.tile_count; i++)
	{
		var x = i % this.size;
		var y = Math.floor(i / this.size);
		var frac_y = y / (this.size - 1);
		var frac_x = x / (this.size - 1);
		var freq = frac_y * this.noise_freq_top + this.noise_freq_bottom * (1 - frac_y);

		var noise = 0.25 * btx.perlin.noise(345 + x * freq, 123 + y * freq, 20.01 * frac_x);
		noise += 0.25 * btx.perlin.noise(x * freq * 2.0 + 378452, y * freq * 2.0 + 789345, (x + y) * freq  + 634273);
		noise += 0.25 * btx.perlin.noise(x * freq * 4.0 + 378452, y * freq * 4.0 + 789345, (x + y) * freq  + 634273);
		noise += 0.25 * btx.perlin.noise(x * freq * 8.0 + 378452, y * freq * 8.0 + 789345, (x + y) * freq  + 634273);
		
		
		var noise2 = btx.perlin.noise(123345 + x * freq * 5, 123 + y * 0.02, 20.01 * frac_x);

		var val = (noise + 0.1 - frac_y * 0.25) < 0.45 ? 1 : 0;
		
		var edge_dist = 2 * (0.5 - Math.abs(0.5 - frac_x));

		if (((noise - 0.075 - frac_y * 0.0)) < (noise2 - edge_dist * 0.2 * (1 - frac_y)))
		{
			this.tile__material[i] = 1;
			this.tile__blastability[i] = Math.pow(edge_dist, 3); //btx.perlin.noise(345 + x * freq, 123 + y * freq, 20.01 * frac_x);
			this.tile__damage[i] = 0;
			float_tex_render[i * 4 + 0] = 1.0 * this.tile__damage[i];
			float_tex_render[i * 4 + 1] = 0.8 + 0.2 * this.tile__blastability[i];
			float_tex_render[i * 4 + 2] = 1.0;
			float_tex_render[i * 4 + 3] = 1;
		} else {
			this.tile__material[i] = 0;
			
			
		}
	}

	for (var i = 0; i < this.tile_count; i++)
	{
		var x = i % this.size;
		var y = Math.floor(i / this.size);
		var frac_y = y / (this.size - 1);
		var freq = frac_y * this.noise_freq_top + this.noise_freq_bottom * (1 - frac_y);

		//var noise2 = btx.perlin.noise(x * freq + 534522, y * freq + 234445, (x + y) * freq  + 234343);

		if (this.tile__material[i] == 1) // && noise2 > 0.5)
		{
/*
			var found_air = false;
			for (var y2 = y; y2 > (y - 3) && y2 >= 0 && found_air == false; y2--)
			{
				if (this.tile__material[y2 * this.size + x] == 0)
				{
					found_air = true;
				}
			}
			if (found_air)
			{
				float_tex_render[i * 4 + 0] = 0.0;
				float_tex_render[i * 4 + 1] = 0.5;
				float_tex_render[i * 4 + 2] = 0.0;
				float_tex_render[i * 4 + 3] = 1;
			}
*/
			float_tex_material[i * 4 + 0] = 1.0;
			float_tex_material[i * 4 + 1] = 1.0;
			float_tex_material[i * 4 + 2] = 1.0;
			float_tex_material[i * 4 + 3] = 1.0;
		} else {
			float_tex_material[i * 4 + 0] = 0.0;	// water capacity
			float_tex_material[i * 4 + 1] = 0.0;	// water speed
			float_tex_material[i * 4 + 2] = 0.0;
			float_tex_material[i * 4 + 3] = 0.0;

		}
	}

	btx.c.update_texture_from_array(float_tex_render, this.size, this.tex_render)
	btx.c.update_texture_from_array(float_tex_material, this.size, this.tex_material)

}

btx.Map.prototype.set_fluid_at = function(pos_x, pos_y, value)
{
	var pixel_x = Math.floor(this.size * (	  	pos_x * this.one_over_size));
	var pixel_y = Math.floor(this.size * (1.0 - pos_y * this.one_over_size));
	if (pixel_x < 0)				pixel_x = 0;
	if (pixel_x >= this.size)		pixel_x = this.size -1;
	if (pixel_y < 0)				pixel_y = 0;
	if (pixel_y >= this.size)		pixel_y = this.size -1;
	btx.temp_array[0] = value;
	btx.temp_array[1] = 0;
	btx.temp_array[2] = 0;
	btx.temp_array[3] = 0;
	btx.fluids.set_data_subimage(btx.temp_array, pixel_x, pixel_y, 1, 1);
}



btx.Map.prototype.__ = function()
{
}

