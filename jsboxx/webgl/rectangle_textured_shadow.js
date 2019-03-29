"use strict";

µ.WebGL_Rectangle_Textured_Shadow = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1;
	this.vertices_per_object = 6;
	this.attributes_per_object = 6;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;
	

	this.vbuffer = {};
	this.buffer_counter = {};
	this.buffer_max = {};

	this.light_pos_x = 0.5;
	this.light_pos_y = 0.5;
	this.light_pos_z = 0.0;
	this.light_range = 0.3;
	this.light_range360 = 0.01;
	this.light_direction = 0;
	this.light_cone = 0;

	this.light2_pos_x = 0.5;
	this.light2_pos_y = 0.5;
	this.light2_pos_z = 0.0;
	this.light2_range = 0.3;
	this.light2_range360 = 0.01;
	this.light2_direction = 0;
	this.light2_cone = 0;

	this.texture_step = 0.5;
	this.height_tolerance = 0.005;

	for (var i in cameras)
	{
		this.vbuffer[i] = {};
		this.buffer_counter[i] = {};
		this.buffer_max[i] = {};
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

// (function () {/*
// */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	this.vertex_shader = [
(function () {/*
attribute	vec2		aVertexPosition;
attribute	vec2		aTexPosition;
attribute	vec2		aPosition;

uniform		vec2		uCamPosition;
uniform		vec2		uCamZoom;

varying		vec2		vPosition;
varying		highp vec2	vTexPosition;


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
	vTexPosition = aTexPosition;
}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]

	].join('\n');

	this.fragment_shader = ["",

(function () {/*

//	precision highp	float;
	precision mediump	float;

uniform		vec3		uLightPosition;
uniform		float		uLightRange;
uniform		float		uLightRange360;
uniform		float		uLightDirection;
uniform		float		uLightCone;

uniform		vec3		uLight2Position;
uniform		float		uLight2Range;
uniform		float		uLight2Range360;
uniform		float		uLight2Direction;
uniform		float		uLight2Cone;

uniform		float		uTextureStep;
uniform 	sampler2D 	uSampler;
uniform 	sampler2D 	uSamplerDepthmap;

uniform		float		uHeightTolerance;

varying		vec2		vPosition;
varying		highp vec2	vTexPosition;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

bxx_shader_includes.colors + "\n",
bxx_shader_includes.angles + "\n",

(function () {/*

float distance2D_manhattan(float a_x, float a_y, float b_x, float b_y)
{
	return max(abs(a_x - b_x), abs(a_y - b_y));
}

float do_the_bresenham_step(vec3 pos_start, vec3 pos1, float step, float range)
{
	float height = 0.0;
	vec3 pos0 = vec3(pos_start[0], pos_start[1], pos_start[2]);
	float distance_max = distance(vec2(pos0.x, pos0.y), vec2(pos1.x, pos1.y));
	float distance_frac = 0.0;
	vec2 d = vec2(abs(pos1[0] - pos0[0]), abs(pos1[1] - pos0[1]));
	vec2 s = vec2(pos0[0] < pos1[0] ? step : -step, pos0[1] < pos1[1] ? step : -step);
	float err = d[0] - d[1];
	float e2 = 0.0;
	vec4 tx = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 tx_depth = vec4(0.0, 0.0, 0.0, 0.0);
	float remaining = 1.0;
	for (int i = 0; i < 1500; i++)
	{
		float distance_curr = distance(vec2(pos0.x, pos0.y), vec2(pos_start.x, pos_start.y));
		distance_frac = (distance_curr / distance_max);
		height = (1.0 - distance_frac) * pos_start[2] + distance_frac * pos1[2];
		tx = texture2D(uSampler, vec2(pos0.x, pos0.y));
		tx_depth = texture2D(uSamplerDepthmap, vec2(pos0.x, pos0.y));
		if (tx_depth[0] > (height + uHeightTolerance))
		{
			remaining -= (tx_depth[0] - (height + uHeightTolerance)) * 0.02;
		}
		remaining -= tx[3] * tx[3] * tx[3] * tx[3] * tx[3] / (2.0);
		if (remaining <= 0.0)
		{
			return 0.0;
		}
		if (abs(pos0[0] - pos1[0]) <= step  && abs(pos0[1] - pos1[1]) <= step)
		{
			return remaining;
		}
		e2 = 2.0 * err;
		if (e2 > -d[1])
		{
			err -= d[1];
			pos0[0] += s[0];
		}
		if (e2 < d[0])
		{
			err += d[0];
			pos0[1] += s[1];
		}
	}
	return 1.0;
}

vec4 do_shadow(
		vec4 light_color,
		vec3 light_position,
		vec3 pixel_position,
		float dist1,
		float light_range,
		float light_range360,
		float light_direction,
		float light_cone
	)
{
	vec2 light_position2D = vec2(light_position.x, light_position.y);
	vec2 pixel_position2D = vec2(pixel_position.x, pixel_position.y);
	if (dist1 >= light_range)
	{
		return vec4(0, 0, 0, 1);
	}
	else
	{
		float light_directionB = (360.0 - light_direction);
		float light_coneB = (360.0 - light_cone - 180.0) / 180.0;
		vec2 direction = normalize(vec2(pixel_position2D - light_position2D));
		bool is_outside_cone = dot(direction, angle_to_vec2(light_directionB)) < light_coneB;
		if (dist1 >= light_range360 && is_outside_cone)
		{
			return vec4(0, 0, 0, 1);
		}
		else
		{
			float dist_frac = dist1 / (is_outside_cone ? light_range360 : light_range);
			float falloff = 0.0;
			float light_falloff = 0.1;
			if (light_falloff < 0.5)
			{
				falloff = pow(1.0 - dist_frac, light_falloff * 2.0);
			}
			else
			{
				falloff = 1.0 - pow(dist_frac, 1.0 - (light_falloff - 0.5) * 2.0);
			}
			float bresenham = do_the_bresenham_step(
				light_position,
				pixel_position,
				uTextureStep * 1.0,
				is_outside_cone ? light_range360 : light_range
			);

			float shdw = 1.0 - bresenham * falloff;
			float shdw1 = 1.0 - shdw;
			return vec4(light_color[0] * shdw1, light_color[1] * shdw1, light_color[2] * shdw1, shdw);
		}
	}
}

void main()
{
	vec4 texColor = texture2D(uSampler, vTexPosition);
	vec2 light1_position = vec2(uLightPosition.x, uLightPosition.y);
	vec2 light2_position = vec2(uLight2Position.x, uLight2Position.y);
	float dist1 = distance(vTexPosition, light1_position);
	float dist2 = distance(vTexPosition, light2_position);
	vec4 texDepthmap = texture2D(uSamplerDepthmap, vTexPosition);
	vec4 color1 = vec4(0, 0, 0, 0);
	vec4 color2 = vec4(0, 0, 0, 0);
	color1 = do_shadow(
		texColor,
		uLightPosition,
		vec3(
			vTexPosition[0],
			vTexPosition[1],
			texDepthmap[0]
		),
		dist1,
		uLightRange,
		uLightRange360,
		uLightDirection,
		uLightCone
	);
	color2 = do_shadow(
		texColor,
		uLight2Position,
		vec3(
			vTexPosition[0],
			vTexPosition[1],
			texDepthmap[0]
		),
		dist2,
		uLight2Range,
		uLight2Range360,
		uLight2Direction,
		uLight2Cone
	);
	gl_FragColor = vec4(
		max(color1[0], color2[0]),
		max(color1[1], color2[1]),
		max(color1[2], color2[2]),
		min(color1[3], color2[3])
	);
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");
	this.program.uSamplerDepthmap	= gl.getUniformLocation(this.program, "uSamplerDepthmap");
	this.program.uTextureStep		= gl.getUniformLocation(this.program, "uTextureStep");

	this.program.uLightPosition		= gl.getUniformLocation(this.program, "uLightPosition");
	this.program.uLightRange		= gl.getUniformLocation(this.program, "uLightRange");
	this.program.uLightRange360		= gl.getUniformLocation(this.program, "uLightRange360");
	this.program.uLightDirection	= gl.getUniformLocation(this.program, "uLightDirection");
	this.program.uLightCone			= gl.getUniformLocation(this.program, "uLightCone");

	this.program.uLight2Position	= gl.getUniformLocation(this.program, "uLight2Position");
	this.program.uLight2Range		= gl.getUniformLocation(this.program, "uLight2Range");
	this.program.uLight2Range360	= gl.getUniformLocation(this.program, "uLight2Range360");
	this.program.uLight2Direction	= gl.getUniformLocation(this.program, "uLight2Direction");
	this.program.uLight2Cone		= gl.getUniformLocation(this.program, "uLight2Cone");

	this.program.uHeightTolerance	= gl.getUniformLocation(this.program, "uHeightTolerance");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");

	gl.errorCheck('setup rectangle_textured_shadow');

	this.set_light_position = function(pos_x, pos_y, pos_z)
	{
		this.light_pos_x = pos_x;
		this.light_pos_y = pos_y;
		this.light_pos_z = pos_z;
	}
	this.set_light_range = function(range)
	{
		this.light_range = range;
	}
	this.set_light_range360 = function(range)
	{
		this.light_range360 = range;
	}
	this.set_light_direction = function(direction)
	{
		this.light_direction = direction;
	}
	this.set_light_cone = function(cone)
	{
		this.light_cone = cone;
	}

	this.set_light2_position = function(pos_x, pos_y, pos_z)
	{
		this.light2_pos_x = pos_x;
		this.light2_pos_y = pos_y;
		this.light2_pos_z = pos_z;
	}
	this.set_light2_range = function(range)
	{
		this.light2_range = range;
	}
	this.set_light2_range360 = function(range)
	{
		this.light2_range360 = range;
	}
	this.set_light2_direction = function(direction)
	{
		this.light2_direction = direction;
	}
	this.set_light2_cone = function(cone)
	{
		this.light2_cone = cone;
	}

	this.set_texture_step = function(texture_size)
	{
		this.texture_step = 1 / texture_size;
	}

	this.set_height_tolerance = function(height_tolerance)
	{
		this.height_tolerance = height_tolerance;
	}

	this.draw = function(cam_id, texture_id, pos_x, pos_y, width, height)
	{
		var
			width2 = width / 1,
			height2 = height / 1;
		if (!this.vbuffer[cam_id])
		{
			console.log('rectangle_textured_shadow.draw(): unknown cam: ' + cam_id);
			return;
		}
		this.something_to_draw = true;
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
		var inc = 0;

		// - + top left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;			inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;			inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;

		// + + top right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;																								

		// + - bottom right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																								

		// - + top left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;																								

		// + - bottom right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																								

		// - - bottom left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;			inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;				inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;					inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;					inc++;																								

		this.buffer_counter[cam_id][texture_id]++;
	};

	this.flush_all = function(texture_depthmap_id)
	{
		if (!this.something_to_draw)
		{
			return;
		}
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		for (var camera_id in cameras)
		{
			for (var texture_id in this.vbuffer[camera_id])
			{
				this.flush(camera_id, texture_id, texture_depthmap_id);
			}
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		this.something_to_draw = false;
	}

	this.flush = function(camera_id, texture_id, texture_depthmap_id)
	{
		if (!this.buffer_counter[camera_id][texture_id])
		{
			return;
		}
		var camera = cameras[camera_id];

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			this.vbuffer[camera_id][texture_id].subarray(0, this.buffer_counter[camera_id][texture_id] * this.magic_number),
			gl.STATIC_DRAW);

		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	24, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	24, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	24, 16);

		gl.uniform1f(this.program.uTextureStep, 	this.texture_step);

		gl.uniform3fv(this.program.uLightPosition, 	[this.light_pos_x, 1 - this.light_pos_y, this.light_pos_z]);
		gl.uniform1f(this.program.uLightRange, 		this.light_range);
		gl.uniform1f(this.program.uLightRange360, 	this.light_range360);
		gl.uniform1f(this.program.uLightDirection,	this.light_direction);
		gl.uniform1f(this.program.uLightCone, 		this.light_cone);

		gl.uniform3fv(this.program.uLight2Position, [this.light2_pos_x, 1 - this.light2_pos_y, this.light2_pos_z]);
		gl.uniform1f(this.program.uLight2Range, 	this.light2_range);
		gl.uniform1f(this.program.uLight2Range360, 	this.light2_range360);
		gl.uniform1f(this.program.uLight2Direction,	this.light2_direction);
		gl.uniform1f(this.program.uLight2Cone, 		this.light2_cone);

		gl.uniform1f(this.program.uHeightTolerance, this.height_tolerance);
	
		gl.uniform2fv(this.program.uCamPosition,	camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 		camera.zoom);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);
		gl.uniform1i(this.program.uSampler, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_depthmap_id]);
		gl.uniform1i(this.program.uSamplerDepthmap, 1);

		var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;
		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		this.buffer_counter[camera_id][texture_id] = 0;
	};
}