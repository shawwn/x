µ.WebGL_PixelStore = function(c, name, data_parameters, texture_size)
{
	this.name = name;
	this.c = c;
	this.var_prefix = '_'+this.name+'_';
	this.texture_data = new Float32Array(texture_size * texture_size * 4);
	this.texture_size = texture_size;
	this.texture_pixels = this.texture_size * this.texture_size;
	this.parameters = new Array(data_parameters.length)
	this.parameter_count = data_parameters.length;
	this.parameter_names = {};
	this.bytes_per_item = 0;
	for (var i = 0; i < data_parameters.length; i++)
	{
		this.parameters[i] = {};
		var p = this.parameters[i];
		p.name = data_parameters[i];
		this.parameter_names[p.name] = i;
		p.offset = this.bytes_per_item;
		this.bytes_per_item += 1;
	}
	this.max_item = -1;		// how many items are currently in use
	this.max_items = Math.floor((this.texture_pixels * 4) / this.bytes_per_item);
	this.item_data = [];
	this.data_texture = rvr.c.texture_from_array(this.texture_data, this.texture_size, -1);
	µ.log('[pixelstore ' + this.name + '] max_items: ' + this.max_items + ', texture_pixels: ' + this.texture_pixels + ", bytes_per_item: " + this.bytes_per_item, µ.LOGLEVEL_VERBOSE);
}

µ.WebGL_PixelStore.prototype.set = function(index, parameter_index, value, do_log)
{
	if (this.item_data[index] == undefined)
	{
		this.item_data[index] = new Array(this.parameter_count);
		for (var i = 0; i < this.parameter_count; i++)
		{
			this.item_data[index][i] = 0;
		}
	}
	this.max_item = index > this.max_item ? index : this.max_item;
	this.item_data[index][parameter_index] = value;
	if (do_log) console.log(index, parameter_index, this.item_data[index][parameter_index]);
}

µ.WebGL_PixelStore.prototype.reset = function()
{
	this.max_item = 0;
}

µ.WebGL_PixelStore.prototype.get_next_item = function()
{
	this.max_item++;
	return this.max_item;
}

µ.WebGL_PixelStore.prototype.include_variables = function()
{
	var shader_text = '';
	for (var i = 0; i < this.parameter_count; i++)
	{
		shader_text += 'const int ' + this.var_prefix + this.parameters[i].name + ' = ' + i + ';' + "\n";
	}
	shader_text += 'int last_pixel_index = 1;';
	shader_text += 'vec4 last_pixel = vec4(0.0, 0.0, 0.0, 0.0);';
	return shader_text;
}

µ.WebGL_PixelStore.prototype.include_constants2 = function()
{
	var shader_text = '';
	shader_text += '	int pixelstore_'+this.name+'_parameter_offsets['+this.parameter_count+'];' + "\n";
	for (var i = 0; i < this.parameter_count; i++)
	{
		shader_text += '	pixelstore_'+this.name+'_parameter_offsets['+i+'] = '+this.parameters[i].offset+';' + "\n";
	}
	return shader_text;
}

µ.WebGL_PixelStore.prototype.render_data_texture = function()
{
	var
		item_data = this.item_data,
		max_item = this.max_item,
		parameters = this.parameters,
		parameter_count = this.parameter_count,
		pix_offset = 0;
	if (max_item < 0)
	{
		return;
	}
	for (var i = 0; i < (max_item + 1); i++)
	{
		var item = item_data[i];
		for (var j = 0; j < parameter_count; j++)
		{
			this.texture_data[pix_offset] = item[j];
			//parameter = parameters[j];
			pix_offset++;
		}
	}
	this.data_texture = rvr.c.update_texture_from_array(this.texture_data, this.texture_size, this.data_texture);
}

µ.WebGL_PixelStore.prototype.include_functions = function()
{
	var shader_functions = [
(function () {/*
float two_floats_to_one(float float1, float float2)
{
	return ((float1 * 256.0 + float2) / 256.0);
}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

"vec4 pixelstore_"+this.name+"_get_pixel(int pixel_index, sampler2D sampler)",
"{",
"	float texel_size = float(" + (1 / this.texture_size) + ");",
"	float texel_size2 = float(" + (0.5 / this.texture_size) + ");",
"	float pixel_x =  mod(float(pixel_index), float(" + this.texture_size + "));",
"	float pixel_y =  floor(float(pixel_index) / float(" + this.texture_size + "));",
"	vec2 pixel_pos = vec2(texel_size2 + pixel_x * texel_size, (texel_size2 + pixel_y * texel_size));",
"	return texture2D(sampler, pixel_pos);",
"}"
].join('\n');
	return shader_functions;
}