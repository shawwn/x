btx.Map = function(size)
{
	this.size = size;
	this.one_over_size = 1 / size;

	this.tile_count = size * size;

	this.tile__density_cops 				= new Float32Array(this.tile_count);
	this.tile__density_gangs 				= new Float32Array(this.tile_count);

	this.tile__material 			= new Float32Array(this.tile_count);
	this.tile__blastability		 	= new Float32Array(this.tile_count);
	this.tile__damage 				= new Float32Array(this.tile_count);

	this.seed = 13224654;

	this.noise_frequency = 0.92 / size;
	this.noise_frequency2 = 1.52 / size;

	this.min_number_of_mines = 3;
	this.max_number_of_mines = 20;

	var float_tex_render = new Float32Array(this.tile_count * 4);

	this.tex_render = btx.c.texture_from_array(float_tex_render, this.size);

	this.generate();
}

btx.Map.prototype.generate = function()
{
	//console.log('generating map');
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

		var freq = this.noise_frequency;
		var freq2 = this.noise_frequency2;

		var noise = 0.9 * btx.perlin.noise(234555 + x * freq * 4, 243 + y * freq * 4, freq * 40 * (frac_x + frac_y));
		noise += 0.1 * btx.perlin.noise(234555 + x * freq2 * 4, 243 + y * freq2 * 4, freq2 * 40 * (frac_x + frac_y));
		
		var noise2 = 0.9 * btx.perlin.noise(123345 + x * freq * 4, 123 + y * freq * 4, freq * 40 * (frac_x + frac_y));
		noise2 += 0.1 * btx.perlin.noise(123345 + x * freq2 * 4, 123 + y * freq2 * 4, freq2 * 40 * (frac_x + frac_y));

	
		
		this.tile__density_cops = (noise * 8.0) * noise * noise * noise * noise - 0.1;
		this.tile__density_cops = Math.max(0.0, Math.min(this.tile__density_cops, 1.0));
		
		this.tile__density_gangs = (noise2 * 8.0) * noise2 * noise2 * noise2 * noise2 - 0.1;
		this.tile__density_gangs = Math.max(0.0, Math.min(1.0, this.tile__density_gangs));

		float_tex_render[i * 4 + 0] = this.tile__density_cops;
		float_tex_render[i * 4 + 1] = this.tile__density_gangs;
		float_tex_render[i * 4 + 2] = (Math.pow(this.tile__density_gangs, 2) + Math.pow(this.tile__density_cops, 2)) * 0.5;
		float_tex_render[i * 4 + 3] = 1;

	}

	btx.c.update_texture_from_array(float_tex_render, this.size, this.tex_render);

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

