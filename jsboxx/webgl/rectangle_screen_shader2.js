"use strict";

// for complicity

µ.WebGL_Rectangle_Screen_Shader2 = function(gl, cameras, textures)
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
	uniform 	sampler2D 	uSampler_Light;
	uniform 	sampler2D 	uSampler_Light_Block;
	uniform 	sampler2D 	uSampler_Displacement;
	uniform		float		uTextureStep;
	uniform		float		uTimeOfDay;
	uniform		float		uCloudiness;
	uniform		float		uBloom_Threshold;
	uniform		float		uLight_Amplification;
	uniform		float		uBloom_Strength;
	varying	highp vec2	vTexPosition;
	varying	vec2		vTexScale;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	bxx_shader_includes.colors + "\n",
	bxx_shader_includes.random + "\n",
	bxx_shader_includes.angles + "\n",

(function () {/*
vec3 Uncharted2Tonemap(vec3 x)
{
 	float A = 0.15;
	float B = 0.50;
	float C = 0.10;
	float D = 0.20;
	float E = 0.02;
	float F = 0.30;
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}
vec3 Tonemap(vec3 x)
{
 	return x / (x + 1.0);
}

	void main()
	{
		// float dist_from_center = max(0.0, distance(vec2(vPosition[0], vPosition[1]) , vec2(0.0, 0.0))) * 0.5;
//		float angle = xy_to_angle(vPosition[0], vPosition[1]);
		vec4 texColor_Light = texture2D(uSampler_Light, vec2(vTexPosition[0] * vTexScale[0], vTexPosition[1] * vTexScale[1]));
		vec4 texColor_Light_Block = texture2D(uSampler_Light_Block, vec2(vTexPosition[0] * vTexScale[0], vTexPosition[1] * vTexScale[1]));


		if (texColor_Light_Block[0] > 0.0)
		{
			texColor_Light[0] = 0.0;
			texColor_Light[1] = 0.0;
			texColor_Light[2] = 0.0;
		}

		vec4 texColor_Displacement = texture2D(uSampler_Displacement, vec2(vTexPosition[0] * vTexScale[0], vTexPosition[1] * vTexScale[1]));

		float displace_x = -(texColor_Displacement[0] - 0.5) * 2.0;
		float displace_y = -(texColor_Displacement[1] - 0.5) * 2.0;
		float displace_strength = texColor_Displacement[2] * 0.000001;

		//if (displace_x < 0.0 && displace_strength > 0.0) discard;

		vec4 texColor = texture2D(uSampler, vec2(vTexPosition[0] * vTexScale[0] + displace_x * displace_strength, vTexPosition[1] * vTexScale[1] + displace_y * displace_strength));
		// assume all light fully white for now
		float brightness = 0.0;
		float blueness = 0.0;
		float yellowness = 0.0;
		if (uTimeOfDay <= 0.5)
		{
			brightness = pow(uTimeOfDay * 2.0, 2.0);
		}
		else
		{
			brightness = pow((1.0 - uTimeOfDay) * 2.0, 2.0);
		}

		float cloud_darkening = - uCloudiness * 0.25;


		blueness	=  - cloud_darkening + pow(1.0 - brightness, 4.0) * 0.075 - cloud_darkening;
		yellowness	=  - cloud_darkening + pow(brightness, 1.5) * 0.125;
		brightness	+= - cloud_darkening + 0.15;

		brightness *= brightness * 2.0;
		texColor_Light[0] = pow(texColor_Light[0], uLight_Amplification) + (brightness + yellowness * 1.1 - blueness);
		texColor_Light[1] = pow(texColor_Light[1], uLight_Amplification) + (brightness + yellowness - blueness * 1.1);
		texColor_Light[2] = pow(texColor_Light[2], uLight_Amplification) + (brightness + blueness - yellowness);
		texColor_Light[3] = 1.0;
//		vec4 bloom;
//		for (int x = 0; x < 5; x++)
//		{
//			for (int y = 0; y < 5; y++)
//			{
//				float dist = (4.0 - abs(float(2 - x)) - abs(float(2 - y))) * 0.25;
//				vec4 tempColor = texture2D(uSampler, vec2((vTexPosition[0] + (-2.0 + float(x)) * uTextureStep) * vTexScale[0], (vTexPosition[1] + (-2.0 + float(y)) * uTextureStep) * vTexScale[1]));
//				bloom[0] += pow(max(0.0, tempColor[0] - uBloom_Threshold) / (1.0 - uBloom_Threshold), 2.0) * (1.0 - dist);
//				bloom[1] += pow(max(0.0, tempColor[1] - uBloom_Threshold) / (1.0 - uBloom_Threshold), 2.0) * (1.0 - dist);
//				bloom[2] += pow(max(0.0, tempColor[2] - uBloom_Threshold) / (1.0 - uBloom_Threshold), 2.0) * (1.0 - dist);
//			}
//		}

		texColor[0] *= 1.5;
		texColor[1] *= 1.5;
		texColor[2] *= 1.5;


//		texColor[0] += bloom[0] * uBloom_Strength;
//		texColor[1] += bloom[1] * uBloom_Strength;
//		texColor[2] += bloom[2] * uBloom_Strength;


		vec3 tonemapped = Tonemap(vec3(texColor[0], texColor[1], texColor[2]));
		vec3 tonemapped_light = Tonemap(vec3(texColor_Light[0], texColor_Light[1], texColor_Light[2]));

		texColor[0] = tonemapped[0];
		texColor[1] = tonemapped[1];
		texColor[2] = tonemapped[2];
		vec4 encoded_output = vec4(pow(texColor[0], 1.0 / 1.25), pow(texColor[1], 1.0 / 1.25), pow(texColor[2], 1.0 / 1.25), texColor[3]);

		vec3 encoded_light = vec3(pow(tonemapped_light[0], 1.0 / 1.25), pow(tonemapped_light[1], 1.0 / 1.25), pow(tonemapped_light[2], 1.0 / 1.25));

		gl_FragColor = encoded_output;
		gl_FragColor[0] = gl_FragColor[0] * encoded_light[0] * 1.5;
		gl_FragColor[1] = gl_FragColor[1] * encoded_light[1] * 1.5;
		gl_FragColor[2] = gl_FragColor[2] * encoded_light[2] * 1.5;

	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	""].join('\n');
/*
		if (vColor[2] < 0.0)
		{
			float lum = (texColor[0] + texColor[1] + texColor[2]) / 3.0;
			gl_FragColor = HSLA_to_RGBA(vColor[0], vColor[1], lum * (- vColor[2]), texColor[3] * vColor[3]);
		}
		else
		{
			vec4 texColor_HSLA = RGBA_to_HSLA(texColor[0], texColor[1], texColor[2], texColor[3]);
			gl_FragColor = HSLA_to_RGBA(texColor_HSLA[0] + vColor[0], texColor_HSLA[1] * vColor[1], texColor_HSLA[2] * vColor[2], texColor_HSLA[3] * vColor[3]);
		}
*/
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

	this.program.aVertexPosition		= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aTexPosition			= gl.getAttribLocation(this.program, "aTexPosition");
	this.program.aTexScale				= gl.getAttribLocation(this.program, "aTexScale");
	this.program.aPosition				= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor					= gl.getAttribLocation(this.program, "aColor");
	this.program.uSampler				= gl.getUniformLocation(this.program, "uSampler");
	this.program.uSampler_Light			= gl.getUniformLocation(this.program, "uSampler_Light");
	this.program.uSampler_Light_Block	= gl.getUniformLocation(this.program, "uSampler_Light_Block");
	this.program.uSampler_Displacement	= gl.getUniformLocation(this.program, "uSampler_Displacement");
	this.program.uTextureStep			= gl.getUniformLocation(this.program, "uTextureStep");
	this.program.uCamPosition			= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom				= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uTimeOfDay				= gl.getUniformLocation(this.program, "uTimeOfDay");
	this.program.uCloudiness			= gl.getUniformLocation(this.program, "uCloudiness");
	this.program.uBloom_Threshold		= gl.getUniformLocation(this.program, "uBloom_Threshold");
	this.program.uBloom_Strength		= gl.getUniformLocation(this.program, "uBloom_Strength");
	this.program.uLight_Amplification	= gl.getUniformLocation(this.program, "uLight_Amplification");
	

	// set the vars that never change
	gl.uniform1i(this.program.uSampler, 0);
	gl.uniform1i(this.program.uSampler_Light, 1);
	gl.uniform1i(this.program.uSampler_Light_Block, 2);
	gl.uniform1i(this.program.uSampler_Displacement, 3);
	gl.errorCheck('setup rectangle_screen_shader_2');
};

µ.WebGL_Rectangle_Screen_Shader2.prototype.draw = function(cam_id, texture_id, pos_x, pos_y, width, height, scale_x, scale_y, angle,
		tint_h_1, tint_s_1, tint_l_1, tint_a_1,
		tint_h_2, tint_s_2, tint_l_2, tint_a_2,
		tint_h_3, tint_s_3, tint_l_3, tint_a_3,
		tint_h_4, tint_s_4, tint_l_4, tint_a_4
		)
{

//*
	var camera = this.cameras[cam_id];
	if (		(pos_x + width * 2 < camera.left_edge_x)
			||	(pos_x - width * 2 > camera.right_edge_x)
			||	(pos_y + height * 2 < camera.bottom_edge_y)
			||	(pos_y - height * 2 > camera.top_edge_y))
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

µ.WebGL_Rectangle_Screen_Shader2.prototype.flush_all = function(	light_texture_id,
																	light_block_texture_id,
																	displacement_texture_id,
																	time_of_day,
																	cloudiness,
																	bloom_threshold,
																	bloom_strength,
																	light_amplification)
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
	{
		for (var texture_id = 0, len2 = this.vbuffer[camera_id].length; texture_id < len2; texture_id++)
		{
			this.flush(		camera_id,
							texture_id,
							light_texture_id,
						 	light_block_texture_id,
						 	displacement_texture_id,
						 	time_of_day,
						 	cloudiness,
						 	bloom_threshold,
						 	bloom_strength,
						 	light_amplification);
		}
	}
	gl.disableVertexAttribArray(this.program.aVertexPosition);
	gl.disableVertexAttribArray(this.program.aTexPosition);
	gl.disableVertexAttribArray(this.program.aTexScale);
	gl.disableVertexAttribArray(this.program.aPosition);
	gl.disableVertexAttribArray(this.program.aColor);
	this.something_to_draw = false;
};

µ.WebGL_Rectangle_Screen_Shader2.prototype.flush = function(	camera_id,
																texture_id,
																light_texture_id,
																light_block_texture_id,
																displacement_texture_id,
																time_of_day,
																cloudiness,
																bloom_threshold,
																bloom_strength,
																light_amplification)
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
	gl.uniform1f(this.program.uTextureStep, 	1 / 1024);

	gl.uniform1f(this.program.uTimeOfDay, 	time_of_day);
	gl.uniform1f(this.program.uCloudiness, 	cloudiness);

	gl.uniform1f(this.program.uBloom_Strength, 		bloom_strength);
	gl.uniform1f(this.program.uBloom_Threshold, 	bloom_threshold);
	gl.uniform1f(this.program.uLight_Amplification,	light_amplification);
	
	
	//console.log(bloom_threshold, bloom_strength);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.textures[texture_id]);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.textures[light_texture_id]);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, this.textures[light_block_texture_id]);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, this.textures[displacement_texture_id]);

	var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;
	gl.drawArrays(gl.TRIANGLES,	0, numItems);
	this.buffer_counter[camera_id][texture_id] = 0;
};
