//"use strict"; //makes firefox shit the bed for some reason?

µ.canvas_webgl = function(parent_el_id, scale, size_x, size_y, cameras, options)
{
	var self = this;
	if (options.auto_resize)
	{
		size_x = Math.round((window.innerWidth - 0) / 1);
		size_y = Math.round((window.innerHeight - 0) / 1);
	}
	this.options = options;
	this.cameras = cameras;
	//var canvas = new µ.canvas(width, height);
	this.canvas = document.createElement('canvas');
	var canvas = this.canvas;
	this.textures = [];
	this.texture_data = []; 	// the canvas or the data array
	//this.texture_context = [];
	this.texture_width = [];
	this.texture_height = [];
	this.texture_count = 0;

	var gl = null;
	this.current_blending__source = 0;
	this.current_blending__destination = 0;
	this.current_blending__equation = 0;

	var	names	= ["webgl",	"experimental-webgl", "webkit-3d", "moz-webgl"];
	for	(var i = 0;	i <	names.length; ++i)
	{
		try
		{
			gl = this.canvas.getContext(names[i],
			//gl = WebGLDebugUtils.makeDebugContext(this.canvas.getContext(names[i],
				{
					antialias: (this.options.enable_antialias != undefined ? this.options.enable_antialias : true),
					alpha: (this.options.enable_alpha != undefined ? this.options.enable_alpha : false), // not that blending is always on, this is for compositing with the background
					depth: (this.options.enable_depth_test != undefined ? this.options.enable_depth_test : false), // !
					stencil: false,
					premultipliedAlpha: true,
					preserveDrawingBuffer: false
				}
			//));
			);
		}
		catch(e) {}
		if (gl)
		{
			break;
		}
	}
	if (!gl)
	{
		alert("Could not initialise	WebGL, sorry :-(");
		return undefined;
	}

	//gl.enable(gl.SAMPLE_COVERAGE);
	//gl.sampleCoverage(0.5, false);

	this.gl = gl;

 	this.supports_float_textures = gl.getExtension("OES_texture_float") && gl.getExtension("OES_float_linear");

	////////////////////////////////////////////////
	// get all error codes
	gl.glEnums = [];
	for (var propertyName in gl)
	{
		if (typeof gl[propertyName] == 'number')
		{
			gl.glEnums[gl[propertyName]] = propertyName;
		}
	}

	gl.errorCheck = function(string)
	{
		var error = this.getError();
		if (error)
		{
			console.error(string + ": error "+ gl.glEnums[error] + "");
		}
	}

	// the "modules" that do the actual drawing
	
	this.circles 						= new µ.WebGL_Circles							(this.gl, cameras.c);
	this.rectangle 						= new µ.WebGL_Rectangle							(this.gl, cameras.c);
	this.rectangle_textured 			= new µ.WebGL_Rectangle_Textured				(this.gl, cameras.c, this.textures);
	this.rectangle_textured_offset		= new µ.WebGL_Rectangle_Textured_Offset			(this.gl, cameras.c, this.textures);
	this.rectangle_textured_rgb 		= new µ.WebGL_Rectangle_Textured_RGB			(this.gl, cameras.c, this.textures);
	this.rectangle_textured_rgb_flipped	= new µ.WebGL_Rectangle_Textured_RGB_Flipped	(this.gl, cameras.c, this.textures);

// old
//	this.rect_tex2 						= new µ.WebGL_Rectangles_Tex2					(this.gl, cameras.c, this.textures);
//	this.rect_tex2b 					= new µ.WebGL_Rectangles_Tex2b					(this.gl, cameras.c, this.textures);

	this.tilemap_occlusion = new µ.WebGL_Tilemap_Occlusion(this.gl, cameras.c, this.textures);

	this.blend_equations = [
		gl.FUNC_MIN,
		gl.FUNC_MAX,
		gl.FUNC_ADD,
		gl.FUNC_SUBTRACT,
		gl.FUNC_REVERSE_SUBTRACT,
	];

	this.blend_functions = [
		gl.ZERO,
		gl.ONE,
		gl.SRC_COLOR,
		gl.ONE_MINUS_SRC_COLOR,
		gl.DST_COLOR,
		gl.ONE_MINUS_DST_COLOR,
		gl.SRC_ALPHA,
		gl.ONE_MINUS_SRC_ALPHA,
		gl.DST_ALPHA,
		gl.ONE_MINUS_DST_ALPHA,
		gl.SRC_ALPHA_SATURATE,
		gl.CONSTANT_COLOR,
		gl.ONE_MINUS_CONSTANT_COLOR,
		gl.CONSTANT_ALPHA,
		gl.ONE_MINUS_CONSTANT_ALPHA,
	];
	
	this.refresh_size = function()
	{
		this.resize(canvas.width * scale, canvas.height * scale);
	}

	this.resize = function(size_x, size_y)
	{
		canvas.width = size_x/scale;
		canvas.height = size_y/scale;
		if (gl)
		{
			gl.viewport(0, 0, Math.floor(size_x/scale), Math.floor(size_y/scale));
		}
		cameras.resize(size_x/scale, size_y/scale);
	};
	
	if (this.options.autoresize || size_x == -1 || size_y == -1)
	{
		function on_resize(e)
		{
			size_x = Math.round((window.innerWidth - 0));
			size_y = Math.round((window.innerHeight - 0)) - 4;
			self.resize(size_x, size_y);
		};
		window.onresize = on_resize;
		on_resize();
	}
	
	// it's kinda fucked up that this needs to be called twice for fonts to work properly on all browsers, but so it is
	on_resize();
	

	if (options.canvas_id)
	{
		canvas.setAttribute('id', options.canvas_id);
	}
	
	canvas.setAttribute('width', size_x/scale);
	canvas.setAttribute('height', size_y/scale);
	canvas.style.cursor = 'crosshair';
	canvas.style.width = '100%';
	canvas.style.height =	'100%';
	canvas.style.imageRendering = 'optimizeSpeed';
	canvas.style.imageRendering = '-o-crisp-edges';
	canvas.style.imageRendering = '-moz-crisp-edges';
	canvas.style.imageRendering = '-webkit-optimize-contrast';
	canvas.style.imageRendering = 'crisp-edges';
	canvas.style.imageRendering = 'pixelated';
	canvas.style['-ms-interpolation-mode'] = 'nearest-neighbor';
	document.getElementById(parent_el_id).appendChild(canvas);

	if (this.options.enable_depth_test)
	{
		gl.enable(gl.DEPTH_TEST);
	}

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);
	gl.errorCheck('WebGL Setup done');
};

/*
µ.update_canvas_texture = function(canvas, ctx, size_x, size_y, gen_func, data)
{
	gen_func(ctx, size_x, size_y, data);
	return canvas;
}
*/

µ.canvas_webgl.prototype.handle_texture_load = function(image, texture, texture_id, filter_nearest, callback, clamp_to_edge)
{
	//console.log('texture loaded', texture_id, filter_nearest, image);
	var gl = this.gl;
	this.texture_data[texture_id] = image;
	if (callback)
	{
		callback(image);
	}
	//this.texture_context[texture_id] = image.getContext ? image.getContext('2d') : null;
	this.texture_width[texture_id] = image.width;
	this.texture_height[texture_id] = image.height;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	if (filter_nearest)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	}
	if (clamp_to_edge === undefined)
	{
		clamp_to_edge = false;
	}
	if (clamp_to_edge)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	image = null;
}

µ.canvas_webgl.prototype.set_blending = function(source, destination, equation)
{
	if (source !== this.current_blending__source || destination !== this.current_blending__destination)
	{
		this.gl.blendFunc(source, destination);
		this.current_blending__source = source;
		this.current_blending__destination = destination;
	}
	if (equation !== this.current_blending__equation)
	{
		this.gl.blendEquation(equation);
		this.current_blending__equation = equation;
	}
};

// clear()
µ.canvas_webgl.prototype.clear = function()
{
	if (this.options.enable_depth_test)
	{
		this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	}
	this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

µ.canvas_webgl.prototype.load_texture = function(image_url, filter_nearest, callback, clamp_to_edge)
{
	var texture = this.gl.createTexture();
	var image = new Image();
	var self = this;
	var texture_count = this.texture_count;
	filter_nearest = filter_nearest || false;
	image.onload = function() {
		self.handle_texture_load(image, texture, texture_count, filter_nearest, callback, clamp_to_edge);
	};
	image.src = image_url;
	this.textures[this.texture_count] = texture;
	this.texture_count++;
	return this.texture_count - 1;
};

µ.canvas_webgl.prototype.texture_from_canvas = function(canvas, texture_id, filter_nearest, clamp_to_edge)
{
	if (texture_id === undefined || texture_id === -1)
	{
		var texture = this.gl.createTexture();
	}
	else
	{
		alert('this should not happen');
		var texture = this.textures[texture_id];
	}
	filter_nearest = filter_nearest || false;
	this.handle_texture_load(canvas, texture, this.texture_count, filter_nearest, null, clamp_to_edge);
	this.textures[this.texture_count] = texture;
	this.texture_count++;
	return this.texture_count - 1;
},

µ.canvas_webgl.prototype.update_texture_from_canvas = function(canvas, texture_id, filter_nearest, clamp_to_edge)
{
	filter_nearest = filter_nearest || false;
	this.handle_texture_load(canvas, this.textures[texture_id], texture_id, filter_nearest, null, clamp_to_edge);
	return texture_id;
}

µ.canvas_webgl.prototype.texture_from_array = function(data, size)
{
	var texture = this.gl.createTexture();
	this.upload_array_as_texture(texture, this.texture_count, data, size);
	this.textures[this.texture_count] = texture;
	this.texture_count++;
	return this.texture_count - 1;
};

µ.canvas_webgl.prototype.update_texture_from_array = function(data, size, texture_id)
{
	this.upload_array_as_texture(this.textures[texture_id], texture_id, data, size);
	return texture_id;
};

µ.canvas_webgl.prototype.update_texture_subimage_from_array = function(data, size, texture_id, start_x, start_y, size_x, size_y)
{
	this.upload_array_as_texture_subimage(this.textures[texture_id], data, start_x, start_y, size_x, size_y, 0);
	return texture_id;
};

µ.canvas_webgl.prototype.update_rgba_texture_subimage_from_array = function(data, size, texture_id, start_x, start_y, size_x, size_y)
{
	this.upload_array_as_texture_subimage(this.textures[texture_id], data, start_x, start_y, size_x, size_y, 1);
	return texture_id;
};

µ.canvas_webgl.prototype.empty_texture = function(size, filter_nearest, clamp_to_edge)
{
	var texture = this.gl.createTexture();
	this.upload_empty_texture(texture, this.texture_count, size, filter_nearest, clamp_to_edge);
	this.textures[this.texture_count] = texture;
	this.texture_count++;
	return this.texture_count - 1;
}

µ.canvas_webgl.prototype.empty_float_texture = function(size)
{
	var texture = this.gl.createTexture();
	this.upload_empty_float_texture(texture, this.texture_count, size);
	this.textures[this.texture_count] = texture;
	this.texture_count++;
	return this.texture_count - 1;
};

µ.canvas_webgl.prototype.flush_all	= function()
{
	this.rectangle.flush_all();
	this.rectangle_textured.flush_all();
	this.rectangle_textured_offset.flush_all();
	this.rectangle_textured_rgb.flush_all();
	this.rectangle_textured_rgb_flipped.flush_all();
	this.circles.flush_all();
	//this.rect_tex2.flush_all();
	//this.rect_tex2b.flush_all();
};

µ.canvas_webgl.prototype.draw_circle	= function(cam_id, pos_x, pos_y, radius, softness, hole, fill1, fill2, color, light_strength, light_direction) {
	this.circles.draw(cam_id, pos_x, pos_y, radius, softness, hole, fill1, fill2, color, light_strength, light_direction);
	return;
}

µ.canvas_webgl.prototype.upload_empty_float_texture = function(texture, texture_id, size)
{
	var gl = this.gl;
	this.texture_data[texture_id] = null;
	//this.texture_context[texture_id] = null;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, null);
}


µ.canvas_webgl.prototype.upload_empty_texture = function(texture, texture_id, size, filter_nearest, clamp_to_edge)
{
	var gl = this.gl;
	var data = new Float32Array(size * size * 4);

	this.texture_data[texture_id] = data;
	//this.texture_context[texture_id] = null;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	if (filter_nearest)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);		// probably want to make this independent
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	}
	if (clamp_to_edge === undefined)
	{
		clamp_to_edge = true;
	}
	if (clamp_to_edge)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, data);
}

µ.canvas_webgl.prototype.upload_array_as_texture_subimage = function(texture, data, start_x, start_y, size_x, size_y, format)
{
	var gl = this.gl;

	gl.bindTexture(gl.TEXTURE_2D, texture);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, start_x, start_y, size_x, size_y, gl.RGBA, format == 0 ? gl.FLOAT : gl.UNSIGNED_BYTE, data);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

µ.canvas_webgl.prototype.upload_array_as_texture = function(texture, texture_id, data, size)
{
	var gl = this.gl;
	this.texture_data[texture_id] = data;
	//this.texture_context[texture_id] = null;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}
