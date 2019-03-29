µ.WebGL_Font = function(c2d, ctx, cameras, textures)
{
	this.string__uSampler = "uSampler";
	this.ctx = ctx;
	this.c2d = c2d;
	this.cameras = cameras;
	this.gl = c2d.gl;
	this.gl_textures = textures;

	this.textures = [];
	this.textures_df = [];

	this.font_count = 0;
	this.character_widths = [];
	this.setup_shaders(c2d.gl, cameras, textures);
}
	
µ.WebGL_Font.prototype.is_shitlisted_character = function(character)
{
	if (character < 32)
		return true;
	if (character >= 127 && character < 160)
		return true;
	if (character == 173)
		return true;
	return false;
}

µ.WebGL_Font.prototype.add_font = function(font_fam, font_style, font_weight, tex_dim)
{
	var determineFontHeight = function(fontStyle)
	{
		var body = document.getElementsByTagName("body")[0];
		var result = 0;
/*	
		for (var x = 0; x < 256; x++)
			{
			var dummyText = document.createTextNode(String.fromCharCode(x));
*/
			var dummyText = document.createTextNode("M");
			var dummy = document.createElement("div");
			dummy.appendChild(dummyText);
			dummy.setAttribute("style", fontStyle);
			body.appendChild(dummy);
			result = dummy.offsetHeight > result ? dummy.offsetHeight : result;
			body.removeChild(dummy);
/*
		}
*/
		return result;
	};
	var self = this;
	var font_index = this.font_count;
	this.character_widths[font_index] = [];
	this.textures[font_index] = this.c2d.texture_from_canvas(µ.generate_canvas_texture(tex_dim, tex_dim, function(ctx)
	{
		//todo ...
		var safety_margin = tex_dim / 64;
		var char_dim = tex_dim / 16;
		ctx.font = font_style + " " + font_weight + " " + char_dim + "px " + font_fam;
		ctx.textBaseline = 'middle';
		var actual_height = determineFontHeight("font-family: " + font_fam + "; font-size: " + char_dim + "px; font-weight: " + font_weight + "; font-style: " + font_style + ";");
		var scale_factor = char_dim / actual_height;
		ctx.font = (char_dim * scale_factor)  + "px " + font_fam;
		for (var x = 0; x < 16; x++)
		{
			for (var y = 0; y < 16; y++)
			{
				var char_value = y * 16 + x;
				if (self.is_shitlisted_character(char_value))
				{
					continue;
				}
				var character = String.fromCharCode(char_value);
/*
				var lum = 100 + µ.rand_int(100);
				ctx.fillStyle = "rgba("+lum+","+lum+","+lum+","+(lum/256)+")";
				ctx.fillRect (x*char_dim, y*char_dim, char_dim, char_dim);
//*/
				var metrics = ctx.measureText(character);
				self.character_widths[font_index][char_value] = metrics.width / char_dim / 2.0;
				var x_pos = x * char_dim + char_dim / 2 - metrics.width / 4.0;  // ! actually was 2.0..
				var y_pos = char_dim + y * char_dim - char_dim / 2;
				ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
				ctx.fillText(character, x_pos, y_pos);
/*
				var lum = 0 + µ.rand_int(255);
				ctx.fillStyle = "rgba("+lum+","+lum+","+lum+","+(lum/1024)+")";
				ctx.fillRect (x, y, 1, 1);
//*/
			}
		}
	}));
	for (var cam_id = 0; cam_id < this.cameras.length; cam_id++)
	{
		this.vbuffer[cam_id][font_index] = new Float32Array(this.magic_number * this.allocation_chunk_size);
		this.buffer_counter[cam_id][font_index] = 0;
		this.buffer_max[cam_id][font_index] = this.allocation_chunk_size;
	}
	this.font_count++;
	return font_index;
};

µ.WebGL_Font.prototype.string_width = function(font_index, text)
{
	width = 0;
	for ( var i = 0; i < text.length; i++ )
	{
		var character_value = text.charCodeAt(i);
		width += this.character_widths[font_index][character_value];
	}
	return width;
}

µ.WebGL_Font.prototype.setup_shaders = function(gl, cameras, textures)
{
	this.something_to_draw = false;
	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 12;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;
	this.vbuffer = [];
	this.buffer_counter = [];
	this.buffer_max = [];
	for (var i = 0; i < cameras.length; i++)
	{
		this.vbuffer[i] = [];
		this.buffer_counter[i] = [];
		this.buffer_max[i] = [];
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();
	this.vertex_shader = ["",
(function () {
/*
	attribute	vec2	aVertexPosition;
	attribute	vec2	aTexPosition;
	attribute	vec2	aPosition;
	attribute	vec4	aColor;
	attribute	float	aChar;
	attribute	float	aFade;

	uniform	vec2	uCamPosition;
	uniform	vec2	uCamZoom;
	uniform	int		uCamXOrigin;
	uniform	int		uCamYOrigin;

	varying	vec4	vColor;
	varying	vec2	vPosition;
	varying	highp vec2	vTexPosition;
	varying	float	vChar;
	varying	float	vFade;
	varying	vec2	vPos;

	void main()
	{
		vec2 pos = vec2(
		(aPosition[0] * 2.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0],
		(aPosition[1] * 2.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]
		);
		gl_Position = vec4(	(pos[0] + aVertexPosition[0] / uCamZoom[0]),
							(pos[1] + aVertexPosition[1] / uCamZoom[1]),
							0.0, 1.0);
		vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);
		vColor = aColor;
		vTexPosition = aTexPosition;
		vChar = aChar;
		vFade = aFade;
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	""].join('\n');

	this.fragment_shader = ["",
(function () {
/*
	precision mediump	float;

	varying	vec4	vColor;
	varying	float	vChar;
	varying	float	vFade;
	varying	vec2	vPosition;
	varying	highp vec2	vTexPosition;

	uniform sampler2D uSampler;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	bxx_shader_includes.colors,
	bxx_shader_includes.noise3D,

(function () {
/*
	void main()
	{
		int character = int(vChar);
		float char_pos_x = mod(vChar, 16.0);
		float char_pos_y = ((vChar - char_pos_x) / 16.0);
		char_pos_x /= 16.0;
		char_pos_y /= 16.0;
		float fade = (-0.0 + vFade * 4.0 - vTexPosition[1] * 2.0);
		fade = min(1.0, max(0.0, fade));
		float fade_x2 = (-2.0 + vFade * 4.0 + vTexPosition[1] * 2.0);
		fade_x2 = min(1.0, max(0.0, fade_x2));
		vec4 texColor = texture2D(uSampler,	vec2(
			char_pos_x + vTexPosition[0] / 16.0,
			char_pos_y + vTexPosition[1] / 16.0
		));
		float aFactor = (fade * fade_x2);
		vec4 texColor_HSLA = RGBA_to_HSLA(texColor[0], texColor[1], texColor[2], texColor[3]);
		gl_FragColor = HSLA_to_RGBA(
			vColor[0],
			vColor[1],
			texColor_HSLA[2] * vColor[2],
			texColor_HSLA[3] * vColor[3] * aFactor
		);
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],


	""].join('\n');
	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, this.vertex_shader);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
	{
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));
	}
	var	tmp_fragment_shader	= gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(tmp_fragment_shader, this.fragment_shader);
	gl.compileShader(tmp_fragment_shader);
	if (!gl.getShaderParameter(tmp_fragment_shader, gl.COMPILE_STATUS))
	{
		console.log(gl.getShaderInfoLog(tmp_fragment_shader));
	}
	gl.attachShader(this.program, tmp_vertex_shader);
	gl.attachShader(this.program, tmp_fragment_shader);
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		console.log(gl.getProgramInfoLog(this.program));
	}
	gl.useProgram(this.program);
	this.program.aVertexPosition	= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aTexPosition		= gl.getAttribLocation(this.program, "aTexPosition");
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");
	this.program.aChar				= gl.getAttribLocation(this.program, "aChar");

	this.program.aFade				= gl.getAttribLocation(this.program, "aFade");

	this.program.uCamPosition	= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom		= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin		= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin		= gl.getUniformLocation(this.program, "uCamYOrigin");

	this.gl.uniform1i(this.gl.getUniformLocation(this.program, this.string__uSampler), 0);

	gl.errorCheck('setup WebGL font');
}

µ.WebGL_Font.prototype.draw_character = function(
	cam_id, font_index, pos_x, pos_y, width, height,
	character, // expects a number
	fade,
	tint_h_1, tint_s_1, tint_l_1, tint_a_1,
	tint_h_2, tint_s_2, tint_l_2, tint_a_2,
	tint_h_3, tint_s_3, tint_l_3, tint_a_3,
	tint_h_4, tint_s_4, tint_l_4, tint_a_4
	)
{
//*
	var camera = this.cameras[cam_id];
	if (
				(pos_x + width * 2 < camera.left_edge_x)
			||	(pos_x - width * 2 > camera.right_edge_x)
			||	(pos_y + height * 2 < camera.bottom_edge_y)
			||	(pos_y - height * 2 > camera.top_edge_y)
		)
	{
		return;
	}
//*/
	var angle = 90;

	var width2 = width / 1, height2 = height / 1;

	if (!this.vbuffer[cam_id])
	{
		console.log('draw_character: unknown cam: ' + cam_id);
		return;
	}
	this.something_to_draw = true;
	if (tint_h_2 < 0)	tint_h_2 = tint_h_1;
	if (tint_s_2 < 0)	tint_s_2 = tint_s_1;
	if (tint_l_2 < 0)	tint_l_2 = tint_l_1;
	if (tint_a_2 < 0)	tint_a_2 = tint_a_1;
	if (tint_h_3 < 0)	tint_h_3 = tint_h_1;
	if (tint_s_3 < 0)	tint_s_3 = tint_s_1;
	if (tint_l_3 < 0)	tint_l_3 = tint_l_1;
	if (tint_a_3 < 0)	tint_a_3 = tint_a_1;
	if (tint_h_4 < 0)	tint_h_4 = tint_h_1;
	if (tint_s_4 < 0)	tint_s_4 = tint_s_1;
	if (tint_l_4 < 0)	tint_l_4 = tint_l_1;
	if (tint_a_4 < 0)	tint_a_4 = tint_a_1;
	if (angle == 90)
	{
		var a_cos = -1;
		var a_sin = 0;
	}
	else
	{
		var a_cos = Math.cos((angle + 90) * 3.14159265358979323846264338327950288419716939937510 / 180.0);
		var a_sin = Math.sin((angle + 90) * 3.14159265358979323846264338327950288419716939937510 / 180.0);
	}

	if (this.buffer_counter[cam_id][font_index] == this.buffer_max[cam_id][font_index])
	{
		//console.log(font_index, cam_id, this.vbuffer[cam_id][font_index]);
		this.vbuffer[cam_id][font_index] = Float32Concat(this.vbuffer[cam_id][font_index], new Float32Array(this.magic_number * this.allocation_chunk_size));
		this.buffer_max[cam_id][font_index] += this.allocation_chunk_size;
	}
	var offset = this.buffer_counter[cam_id][font_index] * this.magic_number;

	var dummy = 0;

	// - + top left
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (-width2) - a_sin * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (-width2) + a_cos * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	// + + top right
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (+width2) - a_sin * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (+width2) + a_cos * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_2;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_2;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_2;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_2;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	// + - bottom right
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (+width2) - a_sin * (-height2);			dummy++;		
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (+width2) + a_cos * (-height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	// - + top left
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (-width2) - a_sin * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (-width2) + a_cos * (+height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_1;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	// + - bottom right
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (+width2) - a_sin * (-height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (+width2) + a_cos * (-height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_3;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	// - - bottom left
	this.vbuffer[cam_id][font_index][offset + dummy] = a_cos * (-width2) - a_sin * (-height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = a_sin * (-width2) + a_cos * (-height2);			dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_x;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = pos_y;											dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 1;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = 0;												dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_h_4;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_s_4;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_l_4;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = tint_a_4;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = character;										dummy++;
	this.vbuffer[cam_id][font_index][offset + dummy] = fade;											dummy++;

	this.buffer_counter[cam_id][font_index]++;
}

µ.WebGL_Font.prototype.draw_text = function(
	text, fade,
	cam_id, font_index, pos_x, pos_y, width, height, spacing,
	tint_h_1, tint_s_1, tint_l_1, tint_a_1,
	tint_h_2, tint_s_2, tint_l_2, tint_a_2,
	tint_h_3, tint_s_3, tint_l_3, tint_a_3,
	tint_h_4, tint_s_4, tint_l_4, tint_a_4
	)
{
	var offset_x = 0;
	for ( var i = 0; i < text.length; i++ )
	{
		//character = text.charAt(i);
		var character_value = text.charCodeAt(i);
		if (character_value != 20) // don't bother drawing space characters (make this a per-font setting when the need arises)
		{
			this.draw_character(
				cam_id, font_index, pos_x + offset_x, pos_y, width, height,
				character_value,
				fade,
				tint_h_1, tint_s_1, tint_l_1, tint_a_1,
				tint_h_2, tint_s_2, tint_l_2, tint_a_2,
				tint_h_3, tint_s_3, tint_l_3, tint_a_3,
				tint_h_4, tint_s_4, tint_l_4, tint_a_4
			);
		}
		offset_x += this.character_widths[font_index][character_value] * width + spacing;
	}
};

µ.WebGL_Font.prototype.flush_all = function()
{
	if (!this.something_to_draw)
	{
		return;
	}
	this.gl.useProgram(this.program);
	this.gl.enableVertexAttribArray(this.program.aVertexPosition);
	this.gl.enableVertexAttribArray(this.program.aTexPosition);
	this.gl.enableVertexAttribArray(this.program.aPosition);
	this.gl.enableVertexAttribArray(this.program.aColor);
	this.gl.enableVertexAttribArray(this.program.aChar);
	this.gl.enableVertexAttribArray(this.program.aFade);
	for (var camera_id = 0, len = this.cameras.length; camera_id < len; camera_id++)
	{
		for (var font_index = 0; font_index < this.font_count; font_index++)
		{
			if (this.buffer_counter[camera_id][font_index] > 0)
			{
				this.flush(camera_id, font_index);
			}
		}
		//this.vbuffer[camera_id] = [];
	}
	this.gl.disableVertexAttribArray(this.program.aVertexPosition);
	this.gl.disableVertexAttribArray(this.program.aTexPosition);
	this.gl.disableVertexAttribArray(this.program.aPosition);
	this.gl.disableVertexAttribArray(this.program.aColor);
	this.gl.disableVertexAttribArray(this.program.aChar);
	this.gl.disableVertexAttribArray(this.program.aFade);
	this.something_to_draw = false;
}

µ.WebGL_Font.prototype.flush = function(camera_id, font_index)
{
	if (this.buffer_counter[camera_id][font_index] == undefined)
	{
		console.log('nope', camera_id, font_index, this.buffer_counter[camera_id], this.buffer_counter[camera_id][font_index]);
		return;
	}
	var camera = this.cameras[camera_id];
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER,
		//this.vbuffer[camera_id][font_index].subarray(0, this.buffer_counter[camera_id][font_index] * this.magic_number),
		this.vbuffer[camera_id][font_index], //.subarray(0, this.buffer_counter[camera_id][font_index] * this.magic_number),
		this.gl.STATIC_DRAW);
	this.gl.vertexAttribPointer(this.program.aVertexPosition,	2, this.gl.FLOAT,		false,	48, 	0);
	this.gl.vertexAttribPointer(this.program.aPosition,			2, this.gl.FLOAT,		false,	48, 	8);
	this.gl.vertexAttribPointer(this.program.aTexPosition,		2, this.gl.FLOAT,		false,	48, 	16);
	this.gl.vertexAttribPointer(this.program.aColor, 			4, this.gl.FLOAT,		false,	48, 	24);
	this.gl.vertexAttribPointer(this.program.aChar,	 			1, this.gl.FLOAT,		false,	48,		40);
	this.gl.vertexAttribPointer(this.program.aFade,	 			1, this.gl.FLOAT,		false,	48,		44);
	this.gl.uniform2fv(this.program.uCamPosition,	camera.pos);
	this.gl.uniform2fv(this.program.uCamZoom, 		camera.zoom);
	this.gl.uniform1i(this.program.uYOrigin, 0);
	this.gl.uniform1i(this.program.uXOrigin, 0);
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.gl_textures[this.textures[font_index]]);

	var	numItems = this.buffer_counter[camera_id][font_index] * this.vertices_per_object;
	this.gl.drawArrays(this.gl.TRIANGLES,	0, numItems);
	this.buffer_counter[camera_id][font_index] = 0;
};