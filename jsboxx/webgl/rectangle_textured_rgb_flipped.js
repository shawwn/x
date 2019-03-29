"use strict";

µ.WebGL_Rectangle_Textured_RGB_Flipped = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.gl = gl;
	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 12;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = [];
	this.buffer_counter = [];
	this.buffer_max = [];

	this.cameras = cameras;
	this.textures = textures;

	for (var i = 0; i < cameras.length; i++)
	{
		this.vbuffer[i] = [];
		this.buffer_counter[i] = [];
		this.buffer_max[i] = [];
	}

	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = ["",

(function () {/*
	attribute	vec2		aVertexPosition;
	attribute	vec2		aTexPosition;
	attribute	vec2		aTexScale;
	attribute	vec2		aPosition;
	attribute	vec4		aColor;
	uniform		vec2		uCamPosition;
	uniform		vec2		uCamZoom;
	varying		vec4		vColor;
	varying		vec2		vPosition;
	varying		highp vec2	vTexPosition;
	varying		vec2		vTexScale;
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
		vTexPosition = vec2(aTexPosition[0], 1.0 - aTexPosition[1]);
		vTexScale = aTexScale;
		vColor = aColor;
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	""].join('\n');

	this.fragment_shader = ["",

(function () {/*
//	precision highp	float;
	precision mediump	float;
	varying	vec4		vColor;
	varying	vec2		vPosition;
	uniform 	sampler2D 	uSampler;
	varying	highp vec2	vTexPosition;
	varying	vec2		vTexScale;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	bxx_shader_includes.colors + "\n",

(function () {/*
	void main()
	{
		vec4 texColor = texture2D(uSampler, vec2(vTexPosition[0] * vTexScale[0], vTexPosition[1] * vTexScale[0]));
		gl_FragColor = vec4(texColor[0] * vColor[0], texColor[1] * vColor[1], texColor[2] * vColor[2], texColor[3] * vColor[3]);
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	""].join('\n');

	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, this.vertex_shader);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));

	var	tmp_fragment_shader	= gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(tmp_fragment_shader, this.fragment_shader);
	gl.compileShader(tmp_fragment_shader);
	if (!gl.getShaderParameter(tmp_fragment_shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_fragment_shader));

	gl.attachShader(this.program, tmp_vertex_shader);
	gl.attachShader(this.program, tmp_fragment_shader);
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
		console.log(gl.getProgramInfoLog(this.program));
/*
	gl.ValidateProgram(this.program);
	if (!gl.GetProgramParameter(this.program, gl.VALIDATE_STATUS))
		console.log(gl.getProgramInfoLog(this.program));
*/
	gl.useProgram(this.program);

	this.program.aVertexPosition	= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aTexPosition		= gl.getAttribLocation(this.program, "aTexPosition");
	this.program.aTexScale			= gl.getAttribLocation(this.program, "aTexScale");
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");

	// set the vars that never change
	gl.uniform1i(this.program.uSampler, 0);

	gl.errorCheck('setup rectangles_tex');
};


µ.WebGL_Rectangle_Textured_RGB_Flipped.prototype.draw = function(cam_id, texture_id, pos_x, pos_y, width, height, scale_x, scale_y, angle,
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

	var
		width2 = width,
		height2 = height;
	
	if (!this.vbuffer[cam_id])
	{
		console.log('draw_rectangle_tex: unknown cam: ' + cam_id);
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

	if (this.vbuffer[cam_id][texture_id] == undefined)
	{
		this.vbuffer[cam_id][texture_id] = new Float32Array(this.magic_number * this.allocation_chunk_size);
		this.buffer_counter[cam_id][texture_id] = 0;
		this.buffer_max[cam_id][texture_id] = this.allocation_chunk_size;
	}

	if (this.buffer_counter[cam_id][texture_id] == this.buffer_max[cam_id][texture_id])
	{
		this.vbuffer[cam_id][texture_id] = Float32Concat(this.vbuffer[cam_id][texture_id], new Float32Array(this.magic_number * this.allocation_chunk_size));
		this.buffer_max[cam_id][texture_id] += this.allocation_chunk_size;
	}

	var offset = this.buffer_counter[cam_id][texture_id] * this.magic_number;

	var index = 0;

	// - + top left
	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_1;									index++;

	// + + top right

	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_2;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_2;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_2;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_2;									index++;

	// + - bottom right

	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_3;									index++;
		
	// - + top left

	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_1;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_1;									index++;

	// + - bottom right
	
	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_3;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_3;									index++;

	// - - bottom left

	this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (-height2);		index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_x;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = scale_y;										index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_h_4;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_s_4;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_l_4;									index++;
	this.vbuffer[cam_id][texture_id][offset + index] = tint_a_4;									index++;

	this.buffer_counter[cam_id][texture_id]++;

};


µ.WebGL_Rectangle_Textured_RGB_Flipped.prototype.flush_all = function()
{
	if (!this.something_to_draw)
	{
		return;
	}
	var gl = this.gl;
	gl.useProgram(this.program);
	gl.enableVertexAttribArray(this.program.aVertexPosition);
	gl.enableVertexAttribArray(this.program.aTexPosition);
	gl.enableVertexAttribArray(this.program.aTexScale);
	gl.enableVertexAttribArray(this.program.aPosition);
	gl.enableVertexAttribArray(this.program.aColor);

	for (var camera_id = 0, len1 = this.cameras.length; camera_id < len1; camera_id++)
	//for (var camera_id in cameras)
	{
		for (var texture_id = 0, len2 = this.vbuffer[camera_id].length; texture_id < len2; texture_id++)
		//for (var texture_id in this.vbuffer[camera_id])
		{
			this.flush(camera_id, texture_id);
		}
	}
	gl.disableVertexAttribArray(this.program.aVertexPosition);
	gl.disableVertexAttribArray(this.program.aTexPosition);
	gl.disableVertexAttribArray(this.program.aTexScale);
	gl.disableVertexAttribArray(this.program.aPosition);
	gl.disableVertexAttribArray(this.program.aColor);
	this.something_to_draw = false;
};

µ.WebGL_Rectangle_Textured_RGB_Flipped.prototype.flush = function(camera_id, texture_id)
{
	if (!this.buffer_counter[camera_id][texture_id])
	{
		return;
	}
	var gl = this.gl;
	var camera = this.cameras[camera_id];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,
		this.vbuffer[camera_id][texture_id].subarray(0, this.buffer_counter[camera_id][texture_id] * this.magic_number),
		gl.STATIC_DRAW);

	gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	48, 0);
	gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	48, 8);
	gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	48, 16);
	gl.vertexAttribPointer(this.program.aTexScale,			2, gl.FLOAT,	false,	48, 24);
	gl.vertexAttribPointer(this.program.aColor, 			4, gl.FLOAT,	false,	48, 32);

	gl.uniform2fv(this.program.uCamPosition,camera.pos);
	gl.uniform2fv(this.program.uCamZoom, 	camera.zoom);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.textures[texture_id]);

	var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;

	gl.drawArrays(gl.TRIANGLES,	0, numItems);

	this.buffer_counter[camera_id][texture_id] = 0;
};
