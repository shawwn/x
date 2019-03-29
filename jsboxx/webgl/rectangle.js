"use strict";

µ.WebGL_Rectangle = function(gl, cameras)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 8;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = [];
	this.buffer_counter = [];
	this.buffer_max = [];

	for (var i = 0; i < cameras.length; i++)
	{
		this.vbuffer[i] = new Float32Array(0);
		this.buffer_counter[i] = 0;
		this.buffer_max[i] = 0;
	}

	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();
	this.gl = gl;
	this.cameras = cameras;

	this.vertex_shader = ["",
(function () {/*
	attribute	vec2	aVertexPosition;
	attribute	vec2	aPosition;
	attribute	vec4	aColor;

	uniform		vec2	uCamPosition;
	uniform		vec2	uCamZoom;

	varying		vec4	vColor;
	//varying	vec2	vPosition;
	//varying	vec2	vScreenPosition;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

bxx_shader_includes.colors + "\n",

(function () {/*
	void main()
	{
		vec2 pos = vec2((aPosition[0] * 2.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0], (aPosition[1] * 2.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]);
		gl_Position = vec4(	(pos[0] + aVertexPosition[0] / uCamZoom[0]),
							(pos[1] + aVertexPosition[1] / uCamZoom[1]),
							0.0, 1.0);
	// rotation will go here (or would - it's not that it's terribly important for itty bitty particles)
	// from -1 to 1 (top left origin)
	//	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);
	// from 0 to 1 (top left origin)
	//	vScreenPosition = vec2((1.0 + gl_Position[0]) / 2.0, (1.0 - gl_Position[1]) / 2.0);
		vColor = HSLA_to_RGBA(aColor[0], aColor[1], aColor[2], aColor[3]);
//		vColor = aColor;
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],
	""].join('\n');

	this.fragment_shader = ["",

(function () {/*
//		precision highp	float;
		precision mediump	float;

	varying	vec4	vColor;
	//varying	vec2	vPosition;
	//varying	vec2	vScreenPosition;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

bxx_shader_includes.colors + "\n",

(function () {/*
	void main()
	{
	//	gl_FragColor = HSLA_to_RGBA(vColor[0], vColor[1], vColor[2], vColor[3]);
		gl_FragColor = vColor;
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],
	""].join('\n');

	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, this.vertex_shader);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
	{
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));
		console.log(this.vertex_shader);
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
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");
	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");

	gl.errorCheck('setup rectangles');

};

µ.WebGL_Rectangle.prototype.draw_line = function(cam_id, pos1_x, pos1_y, pos2_x, pos2_y, width,
		color1_r, color1_g, color1_b, color1_a,
		color2_r, color2_g, color2_b, color2_a,
		color3_r, color3_g, color3_b, color3_a,
		color4_r, color4_g, color4_b, color4_a)
{
	var pos_x = (pos1_x + pos2_x) / 2;
	var pos_y = (pos1_y + pos2_y) / 2;
	var angle = µ.vector2D_to_angle(pos2_x - pos1_x, pos2_y - pos1_y);
	var height = µ.distance2D(pos1_x, pos1_y, pos2_x, pos2_y);
	this.draw(cam_id, pos_x, pos_y, width, height, angle, 
		color1_r, color1_g, color1_b, color1_a,
		color2_r, color2_g, color2_b, color2_a,
		color3_r, color3_g, color3_b, color3_a,
		color4_r, color4_g, color4_b, color4_a);
};

µ.WebGL_Rectangle.prototype.draw = function(cam_id, pos_x, pos_y, width, height, angle,
		color1_r, color1_g, color1_b, color1_a,
		color2_r, color2_g, color2_b, color2_a,
		color3_r, color3_g, color3_b, color3_a,
		color4_r, color4_g, color4_b, color4_a
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
		width2 = width / 1,
		height2 = height / 1;
	if (!this.vbuffer[cam_id])
	{
		console.log('draw_rectangle: unknown cam: ' + cam_id);
		return;

	}
	this.something_to_draw = true;

	if (color2_r < 0)	color2_r = color1_r;
	if (color2_g < 0)	color2_g = color1_g;
	if (color2_b < 0)	color2_b = color1_b;
	if (color2_a < 0)	color2_a = color1_a;

	if (color3_r < 0)	color3_r = color1_r;
	if (color3_g < 0)	color3_g = color1_g;
	if (color3_b < 0)	color3_b = color1_b;
	if (color3_a < 0)	color3_a = color1_a;

	if (color4_r < 0)	color4_r = color1_r;
	if (color4_g < 0)	color4_g = color1_g;
	if (color4_b < 0)	color4_b = color1_b;
	if (color4_a < 0)	color4_a = color1_a;

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

	if (this.buffer_counter[cam_id] == this.buffer_max[cam_id])
	{
		this.vbuffer[cam_id] = Float32Concat(this.vbuffer[cam_id], new Float32Array(this.magic_number * this.allocation_chunk_size));
		this.buffer_max[cam_id] += this.allocation_chunk_size;
	}

	// 8 attributes * 6 vertices = 48 thingies
	var offset = this.buffer_counter[cam_id] * this.magic_number;

	// - + top left
	this.vbuffer[cam_id][offset +  0] = a_cos * (-width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset +  1] = a_sin * (-width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset +  2] = pos_x;
	this.vbuffer[cam_id][offset +  3] = pos_y;
	this.vbuffer[cam_id][offset +  4] = color1_r;
	this.vbuffer[cam_id][offset +  5] = color1_g;
	this.vbuffer[cam_id][offset +  6] = color1_b;
	this.vbuffer[cam_id][offset +  7] = color1_a;

	// + + top right
	this.vbuffer[cam_id][offset +  8] = a_cos * (+width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset +  9] = a_sin * (+width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset + 10] = pos_x;
	this.vbuffer[cam_id][offset + 11] = pos_y;
	this.vbuffer[cam_id][offset + 12] = color2_r;
	this.vbuffer[cam_id][offset + 13] = color2_g;
	this.vbuffer[cam_id][offset + 14] = color2_b;
	this.vbuffer[cam_id][offset + 15] = color2_a;

	// + - bottom right
	this.vbuffer[cam_id][offset + 16] = a_cos * (+width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset + 17] = a_sin * (+width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset + 18] = pos_x;
	this.vbuffer[cam_id][offset + 19] = pos_y;
	this.vbuffer[cam_id][offset + 20] = color3_r;
	this.vbuffer[cam_id][offset + 21] = color3_g;
	this.vbuffer[cam_id][offset + 22] = color3_b;
	this.vbuffer[cam_id][offset + 23] = color3_a;

	// - + top left
	this.vbuffer[cam_id][offset + 24] = a_cos * (-width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset + 25] = a_sin * (-width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset + 26] = pos_x;
	this.vbuffer[cam_id][offset + 27] = pos_y;
	this.vbuffer[cam_id][offset + 28] = color1_r;
	this.vbuffer[cam_id][offset + 29] = color1_g;
	this.vbuffer[cam_id][offset + 30] = color1_b;
	this.vbuffer[cam_id][offset + 31] = color1_a;

	// + - bottom right
	this.vbuffer[cam_id][offset + 32] = a_cos * (+width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset + 33] = a_sin * (+width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset + 34] = pos_x;
	this.vbuffer[cam_id][offset + 35] = pos_y;
	this.vbuffer[cam_id][offset + 36] = color3_r;
	this.vbuffer[cam_id][offset + 37] = color3_g;
	this.vbuffer[cam_id][offset + 38] = color3_b;
	this.vbuffer[cam_id][offset + 39] = color3_a;

	// - - bottom left
	this.vbuffer[cam_id][offset + 40] = a_cos * (-width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset + 41] = a_sin * (-width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset + 42] = pos_x;
	this.vbuffer[cam_id][offset + 43] = pos_y;
	this.vbuffer[cam_id][offset + 44] = color4_r;
	this.vbuffer[cam_id][offset + 45] = color4_g;
	this.vbuffer[cam_id][offset + 46] = color4_b;
	this.vbuffer[cam_id][offset + 47] = color4_a;

	this.buffer_counter[cam_id]++;
};
	
µ.WebGL_Rectangle.prototype.flush_all = function()
{
	if (!this.something_to_draw)
	{
		return;
	}
	this.gl.useProgram(this.program);
	this.gl.enableVertexAttribArray(this.program.aVertexPosition);
	this.gl.enableVertexAttribArray(this.program.aPosition);
	this.gl.enableVertexAttribArray(this.program.aColor);

	for (var i = 0, len = this.cameras.length; i < len; i++)
	{
		this.flush(i);
	}
	this.gl.disableVertexAttribArray(this.program.aVertexPosition);
	this.gl.disableVertexAttribArray(this.program.aPosition);
	this.gl.disableVertexAttribArray(this.program.aColor);
	this.something_to_draw = false;
};

µ.WebGL_Rectangle.prototype.flush = function(camera_id)
{
	if (this.buffer_counter[camera_id] == 0)
	{
		return;
	}
	var camera = this.cameras[camera_id];

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER,
		this.vbuffer[camera_id].subarray(0, this.buffer_counter[camera_id] * this.magic_number),
		this.gl.STATIC_DRAW);
	this.gl.vertexAttribPointer(this.program.aVertexPosition,	2, this.gl.FLOAT,	false,	32, 0);
	this.gl.vertexAttribPointer(this.program.aPosition,			2, this.gl.FLOAT,	false,	32, 8);
	this.gl.vertexAttribPointer(this.program.aColor, 			4, this.gl.FLOAT,	false,	32, 16);

	this.gl.uniform2fv(this.program.uCamPosition,	camera.pos);
	this.gl.uniform2fv(this.program.uCamZoom, 		camera.zoom);

	var	numItems = this.buffer_counter[camera_id] * this.vertices_per_object;

	this.gl.drawArrays(this.gl.TRIANGLES,	0, numItems);
	this.buffer_counter[camera_id] = 0;
};
