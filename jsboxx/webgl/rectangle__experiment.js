"use strict";
µ.WebGL_Rectangle__Experiment = function(gl, cameras)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 8;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = [];
	this.buffer_counter = [];
	this.buffer_max = [];

	this.value_uCenterOffsetX = 0;
	this.value_uCenterOffsetY = 0;
	this.value_uHoleInner = 0;
	this.value_uNotYetUsed = 0;
	this.value_uNotYetUsedSoftness = 0;
	this.value_uBoxiness = 0;
	this.value_uSoftness = 0;
	this.value_uHole = 0;
	this.value_uStipple = 0;
	this.value_uStippleCount = 0;
	this.value_uStippleOffset = 0;
	this.value_uStippleSoftness = 0;

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

	precision mediump	float;

	attribute	vec2	aVertexPosition;
	attribute	vec2	aPosition;
	attribute	vec4	aColor;

	uniform		vec2	uCamPosition;
	uniform		vec2	uCamZoom;
	uniform		int		uCamXOrigin;
	uniform		int		uCamYOrigin;

	uniform		float	uHoleInner;
	uniform		float	uSoftness;
	uniform		float	uHole;

	varying		vec4	vColor;
	varying	vec2	vPosition;
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
		vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);
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
	varying	vec2	vPosition;
	//varying	vec2	vScreenPosition;

	uniform		float	uHoleInner;
	uniform		float	uNotYetUsed;
	uniform		float	uNotYetUsedSoftness;
	uniform		float	uBoxiness;
	uniform		float	uSoftness;
	uniform		float	uHole;
	uniform		float	uStipple;
	uniform		float	uStippleSoftness;
	uniform		float	uStippleCount;
	uniform		float	uStippleOffset;

	uniform		float	uCenterOffsetX;
	uniform		float	uCenterOffsetY;

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

bxx_shader_includes.colors + "\n",


bxx_shader_includes.angles + "\n",


(function () {/*
	
	
float smoothe(float input1, float smoothness)
{
	float softness = 0.0;
	if (smoothness < 0.5)
	{
		softness = pow(1.0 - input1, smoothness * 2.0);
	}
	else
	{
		softness = 1.0 - pow(input1, 1.0 - ((smoothness - 0.5) * 2.0));
	}
	
	float frac = pow(abs(0.5 - input1) * 2.0, 32.0);
	return input1 * frac + softness * (1.0 - frac);
}
	
	void main()
	{
		if (vColor[3] == 0.0)
			discard;
		gl_FragColor = vec4(vColor[0], vColor[1], vColor[2], vColor[3]);

//  / uCenterOffsetX
		float v_pos_x = vPosition[0];
		float v_pos_y = vPosition[1];

		float dist_from_center = distance(vec2(v_pos_x, v_pos_y) , vec2(0, 0));

		float max_dist_from_center = max(abs(vPosition[0]), abs(vPosition[1]));

		float used_dist_from_center = uBoxiness * max_dist_from_center + (1.0 - uBoxiness) * dist_from_center;



		if (used_dist_from_center > 1.0)
		{
			//discard;
		}
		if (uHole > used_dist_from_center)
		{
			//float fade = min(0.999999999999999999999999999, uHoleInner);

			float fade = uHoleInner;
			float used_dist_from_center1 = (uHole - used_dist_from_center) / (1.0 - uHole);
			float used_dist_from_center2 = 0.0;
			used_dist_from_center = used_dist_from_center2 * fade + (1.0 - fade ) * used_dist_from_center1;
		}
		else
		{
			used_dist_from_center = (used_dist_from_center - uHole) / (1.0 - uHole);
		}

		float dist_from_center_frac = 1.0 - used_dist_from_center / max_dist_from_center;

		//if (uHole > used_dist_from_center) { discard; }

		float softness;

		if (uSoftness < 0.5)
		{
			softness = (pow(1.0 - used_dist_from_center, uSoftness * 2.0));
		}
		else
		{
			softness = 1.0 - pow(used_dist_from_center, 1.0 - ((uSoftness - 0.5) * 2.0));
		}
		
		//softness = smoothe(used_dist_from_center, uSoftness);

		gl_FragColor = vColor * vec4(1, 1, 1, softness);

		float angle = xy_to_angle(vPosition[0], vPosition[1]);
		float stipple_segments = uStippleCount;
		float angle_per_segment = 360.0 / stipple_segments;
		float frac = mod((angle + angle_per_segment * uStippleOffset), angle_per_segment) / angle_per_segment;
		float colorfade;
		vec4 color2 = vec4(0.7, 0, 1, softness);
		if (uNotYetUsed < 0.0)
		{
			if (uNotYetUsed > -0.5)
			{
				colorfade = 1.0 - (pow(used_dist_from_center, -uNotYetUsed * 2.0));
			}
			else
			{
				colorfade = pow(1.0 - used_dist_from_center, 1.0 - ((-uNotYetUsed - 0.5) * 2.0));
			}

//			if (uNotYetUsedSoftness < 0.5)
//			{
//				colorfade = (pow(1.0 - used_dist_from_center, uNotYetUsedSoftness * 2.0));
//			}
//			else
//			{
//				colorfade = 1.0 - pow(used_dist_from_center, 1.0 - ((uNotYetUsedSoftness - 0.5) * 2.0));
//			}

			gl_FragColor = (1.0 - colorfade) * gl_FragColor + (colorfade) * color2;
		}
		else
		{
			if (uNotYetUsed < 0.5)
			{
				colorfade = (pow(1.0 - used_dist_from_center, uNotYetUsed * 2.0));
			}
			else
			{
				colorfade = 1.0 - pow(used_dist_from_center, 1.0 - ((uNotYetUsed - 0.5) * 2.0));
			}


//			if (uNotYetUsedSoftness < 0.5)
//			{
//				colorfade = (pow(1.0 - used_dist_from_center, uNotYetUsedSoftness * 2.0));
//			}
//			else
//			{
//				colorfade = 1.0 - pow(used_dist_from_center, 1.0 - ((uNotYetUsedSoftness - 0.5) * 2.0));
//			}

			gl_FragColor = colorfade * gl_FragColor + (1.0 - colorfade) * color2;
		}

		vec4 stipple_color = vec4(0, 0, 1, softness * 0.0);

		if (frac < uStipple)
		{
			float frac2 = frac / uStipple;

			float frac3;

			if (uStippleSoftness < 0.5)
			{
				//softness *= 1.0 - (pow(1.0 - frac2, uStippleSoftness * 2.0));
				frac3 = 1.0 - (pow(1.0 - frac2, uStippleSoftness * 2.0));
			}
			else
			{
				//softness *= pow(frac2, 1.0 - ((uStippleSoftness - 0.5) * 2.0));
				frac3 = pow(frac2, 1.0 - ((uStippleSoftness - 0.5) * 2.0));
			}

			gl_FragColor = gl_FragColor * frac3 + stipple_color * (1.0 - frac3);

		}
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

	this.program.aVertexPosition					= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aPosition							= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor								= gl.getAttribLocation(this.program, "aColor");
	this.program.uCamPosition						= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom							= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin							= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin							= gl.getUniformLocation(this.program, "uCamYOrigin");

	this.program.uHoleInner							= gl.getUniformLocation(this.program, "uHoleInner");
	this.program.uNotYetUsed						= gl.getUniformLocation(this.program, "uNotYetUsed");
	this.program.uNotYetUseduNotYetUsedSoftness		= gl.getUniformLocation(this.program, "uNotYetUsedSoftness");
	this.program.uStipple							= gl.getUniformLocation(this.program, "uStipple");
	this.program.uStippleSoftness					= gl.getUniformLocation(this.program, "uStippleSoftness");
	this.program.uStippleCount						= gl.getUniformLocation(this.program, "uStippleCount");
	this.program.uStippleOffset						= gl.getUniformLocation(this.program, "uStippleOffset");
	this.program.uBoxiness							= gl.getUniformLocation(this.program, "uBoxiness");
	this.program.uSoftness							= gl.getUniformLocation(this.program, "uSoftness");
	this.program.uHole								= gl.getUniformLocation(this.program, "uHole");

	this.program.uCenterOffsetX						= gl.getUniformLocation(this.program, "uCenterOffsetX");
	this.program.uCenterOffsetY						= gl.getUniformLocation(this.program, "uCenterOffsetY");

	gl.errorCheck('setup rectangles');

};

µ.WebGL_Rectangle__Experiment.prototype.draw_line = function(cam_id, pos1_x, pos1_y, pos2_x, pos2_y, width,
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

µ.WebGL_Rectangle__Experiment.prototype.draw = function(cam_id, pos_x, pos_y, width, height, angle,
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
	this.vbuffer[cam_id][offset++] = a_cos * (-width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset++] = a_sin * (-width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color1_r;
	this.vbuffer[cam_id][offset++] = color1_g;
	this.vbuffer[cam_id][offset++] = color1_b;
	this.vbuffer[cam_id][offset++] = color1_a;

	// + + top right
	this.vbuffer[cam_id][offset++] = a_cos * (+width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset++] = a_sin * (+width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color2_r;
	this.vbuffer[cam_id][offset++] = color2_g;
	this.vbuffer[cam_id][offset++] = color2_b;
	this.vbuffer[cam_id][offset++] = color2_a;

	// + - bottom right
	this.vbuffer[cam_id][offset++] = a_cos * (+width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset++] = a_sin * (+width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color3_r;
	this.vbuffer[cam_id][offset++] = color3_g;
	this.vbuffer[cam_id][offset++] = color3_b;
	this.vbuffer[cam_id][offset++] = color3_a;

	// - + top left
	this.vbuffer[cam_id][offset++] = a_cos * (-width2) - a_sin * (+height2);
	this.vbuffer[cam_id][offset++] = a_sin * (-width2) + a_cos * (+height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color1_r;
	this.vbuffer[cam_id][offset++] = color1_g;
	this.vbuffer[cam_id][offset++] = color1_b;
	this.vbuffer[cam_id][offset++] = color1_a;

	// + - bottom right
	this.vbuffer[cam_id][offset++] = a_cos * (+width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset++] = a_sin * (+width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color3_r;
	this.vbuffer[cam_id][offset++] = color3_g;
	this.vbuffer[cam_id][offset++] = color3_b;
	this.vbuffer[cam_id][offset++] = color3_a;

	// - - bottom left
	this.vbuffer[cam_id][offset++] = a_cos * (-width2) - a_sin * (-height2);
	this.vbuffer[cam_id][offset++] = a_sin * (-width2) + a_cos * (-height2);
	this.vbuffer[cam_id][offset++] = pos_x;
	this.vbuffer[cam_id][offset++] = pos_y;
	this.vbuffer[cam_id][offset++] = color4_r;
	this.vbuffer[cam_id][offset++] = color4_g;
	this.vbuffer[cam_id][offset++] = color4_b;
	this.vbuffer[cam_id][offset++] = color4_a;

	this.buffer_counter[cam_id]++;
};

µ.WebGL_Rectangle__Experiment.prototype.flush_all = function()
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

µ.WebGL_Rectangle__Experiment.prototype.flush = function(camera_id)
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
	this.gl.uniform1i(this.program.uYOrigin, 0);
	this.gl.uniform1i(this.program.uXOrigin, 0);

	this.gl.uniform1f(this.program.uHoleInner, 				this.value_uHoleInner);
	this.gl.uniform1f(this.program.uNotYetUsed, 			this.value_uNotYetUsed);
	this.gl.uniform1f(this.program.uNotYetUsedSoftness, 	this.value_uNotYetUsedSoftness);
	this.gl.uniform1f(this.program.uBoxiness, 				this.value_uBoxiness);
	this.gl.uniform1f(this.program.uSoftness, 				this.value_uSoftness);


	this.gl.uniform1f(this.program.uCenterOffsetX, 			this.value_uCenterOffsetX);
	this.gl.uniform1f(this.program.uCenterOffsetY, 			this.value_uCenterOffsetY);

//	console.log(this.value_uOffsetY);


	this.gl.uniform1f(this.program.uHole, 					this.value_uHole);
	this.gl.uniform1f(this.program.uStipple, 				this.value_uStipple);
	this.gl.uniform1f(this.program.uStippleSoftness, 		this.value_uStippleSoftness);
	this.gl.uniform1f(this.program.uStippleCount, 			this.value_uStippleCount);
	this.gl.uniform1f(this.program.uStippleOffset, 			this.value_uStippleOffset);

	var	numItems = this.buffer_counter[camera_id] * this.vertices_per_object;

	this.gl.drawArrays(this.gl.TRIANGLES,	0, numItems);
	this.buffer_counter[camera_id] = 0;
};
