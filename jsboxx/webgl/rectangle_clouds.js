µ.WebGL_Rectangle_Clouds = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1;
	this.vertices_per_object = 6;
	this.attributes_per_object = 7;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = [];
	this.buffer_counter = [];
	this.buffer_max = [];

	for (var cam_id in cameras)
	{
		this.vbuffer[cam_id] = new Float32Array(this.magic_number * this.allocation_chunk_size);
		this.buffer_counter[cam_id] = 0;
		this.buffer_max[cam_id] = this.allocation_chunk_size;
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = ["",

"	precision mediump	float;",

	"attribute	vec2	aVertexPosition;",
	"attribute	vec2	aTexPosition;",
	"attribute	vec2	aTexScale;",
	"attribute	vec2	aPosition;",
	"attribute	float	aNow;",

	"uniform	vec2	uCamPosition;",
	"uniform	vec2	uCamZoom;",
	"uniform	int		uCamXOrigin;",
	"uniform	int		uCamYOrigin;",

	"varying	vec2	vPosition;",
	"varying	float	vNow;",
	"varying	highp vec2	vTexPosition;",
	"varying	vec2	vTexScale;",

	"void main()",
	"{",
	"	vec2 pos = vec2(",
	"		(aPosition[0] * 2.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0],",
	"		(aPosition[1] * 2.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]",
	"	);",
	"	gl_Position = vec4(	(pos[0] + aVertexPosition[0] / uCamZoom[0]),",
	"						(pos[1] + aVertexPosition[1] / uCamZoom[1]),",
	"						0.0, 1.0);",
	"	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);",
	"	vTexPosition = aTexPosition;",
	"	vTexScale = aTexScale;",
	"	vNow = aNow;",
	"}",
	""].join('\n');

	this.fragment_shader = ["",

"	precision mediump		float;",
	"varying	vec2		vPosition;",
	"varying	highp vec2	vTexPosition;",
	"varying	vec2		vTexScale;",
	"varying	float		vNow;",

	"uniform	float		uFogginess;",
	"uniform	float		uCloudiness;",
	"uniform	float		uCloudpattern;",

	"uniform	float		uOffsetX;",
	"uniform	float		uOffsetY;",

	"uniform	float		uNow;",
	"uniform	float		uFade;",
	"uniform	vec2		uCamZoom;",

	bxx_shader_includes.colors + "\n",
	bxx_shader_includes.noise3D + "\n",

(function () {/*

void main()
{
	float now = uNow * 0.010 + vNow * 0.0;

	float pos_x = vTexPosition[0];
	float pos_y = vTexPosition[1];

	float layerA = snoise_clamp(vec3(
				uOffsetX + 512.0 + pos_x * 3.003,
				uOffsetY + 547.0 + pos_y * 4.004,
				0.000016 * now
				));
	float layerB = snoise_clamp(vec3(
				uOffsetX + 1523.0 + pos_x * 4.534234,
				uOffsetY + 1576.0 + pos_y * 5.945345,
				0.000016 * now
				));
	float layer1 = snoise_clamp(vec3(
				uOffsetX + pos_x * (5.4 + layerA * 0.523 * (-1.0 + 2.0 * uCloudpattern)),
				uOffsetY + pos_y * (6.5 + layerB * 0.555 * (-1.0 + 2.0 * uCloudpattern)),
				0.004 * now
				));
	float layer2 = snoise_clamp(vec3(
				uOffsetX + pos_x * (14.654 + 0.5 * uCloudpattern) + layerB * 0.753 * (-1.0 + 2.0 * uCloudpattern),
				uOffsetY + pos_y * (15.548 + 0.5 * uCloudpattern) + layerA * 0.7623 * (-1.0 + 2.0 * uCloudpattern),
				0.003 * now
				));

	layer2 = 1.0 - pow(1.0 - layer2, 2.0);


	float layer3 = snoise_clamp(vec3(
				uOffsetX + pos_x * 23.2 + layerA * 1.07 * (-1.0 + 2.0 * uCloudpattern),
				uOffsetY + pos_y * 27.6 + layerB * 1.03 * (-1.0 + 2.0 * uCloudpattern),
				0.003 * now
				));
	float color = snoise_clamp(vec3(
				uOffsetX + pos_x * 10.2 + 0.018123 * (-1.0 + 2.0 * uCloudpattern),
				uOffsetY + pos_y * 10.3 + 0.020123  * (-1.0 + 2.0 * uCloudpattern),
				0.003 * now
				));
	float intensity = layer1 * 0.7 + layer2 * 0.25 + layer3 * 0.05;
	intensity = pow(intensity, 6.5 - 5.5 * uCloudiness);
	gl_FragColor[0] = 0.5 - 0.25 * intensity + 0.5 * color;
	gl_FragColor[1] = 0.5 - 0.25 * intensity + 0.5 * color;
	gl_FragColor[2] = 0.5 - 0.25 * intensity + 0.5 * color;
	gl_FragColor[3] = min(intensity * 0.8 + 0.2 * uFogginess, 0.65);

	if (intensity <= 0.25)
	{
		gl_FragColor[3] *= intensity * 4.0;
	}
	gl_FragColor[3] *= 0.5 + uCloudiness * 0.5;
	gl_FragColor[0] = max(0.0, min(1.0, gl_FragColor[0]));
	gl_FragColor[1] = max(0.0, min(1.0, gl_FragColor[1]));
	gl_FragColor[2] = max(0.0, min(1.0, gl_FragColor[2]));
	gl_FragColor[3] = max(0.0, min(1.0, gl_FragColor[3]));
}

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],


].join('\n');

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
	this.program.aNow				= gl.getAttribLocation(this.program, "aNow");

	this.program.uNow				= gl.getUniformLocation(this.program, "uNow");
	this.program.uFade				= gl.getUniformLocation(this.program, "uFade");

	this.program.uFogginess			= gl.getUniformLocation(this.program, "uFogginess");
	this.program.uCloudiness		= gl.getUniformLocation(this.program, "uCloudiness");
	this.program.uCloudpattern		= gl.getUniformLocation(this.program, "uCloudpattern");

	this.program.uOffsetX			= gl.getUniformLocation(this.program, "uOffsetX");
	this.program.uOffsetY			= gl.getUniformLocation(this.program, "uOffsetY");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");

	gl.errorCheck('setup rectangle_clouds');

	this.draw = function(cam_id, pos_x, pos_y, width, height, now)
	{
		var
			width2 = width,
			height2 = height;
		this.something_to_draw = true;
		var a_cos = -1;
		var a_sin = 0;
		if (this.buffer_counter[cam_id] == this.buffer_max[cam_id])
		{
			this.vbuffer[cam_id] = Float32Concat(this.vbuffer[cam_id], new Float32Array(this.magic_number * this.allocation_chunk_size));
			this.buffer_max[cam_id] += this.allocation_chunk_size;
		}
		var offset = this.buffer_counter[cam_id] * this.magic_number;
		var index = 0;

		// - + top left
		this.vbuffer[cam_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		// + + top right
		this.vbuffer[cam_id][offset + index] = a_cos * (+width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (+width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		// + - bottom right
		this.vbuffer[cam_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		// - + top left
		this.vbuffer[cam_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		// + - bottom right
		this.vbuffer[cam_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		// - - bottom left
		this.vbuffer[cam_id][offset + index] = a_cos * (-width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = a_sin * (-width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][offset + index] = now;											index++;

		this.buffer_counter[cam_id]++;

	};



	this.flush_all = function(now, cloudiness, cloudpattern, fogginess, offset_x, offset_y)
	{
		if (!this.something_to_draw)
		{
			return;
		}
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		gl.enableVertexAttribArray(this.program.aNow);

		for (var camera_id = 0, len = cameras.length; camera_id < len; camera_id++)
		{
			this.flush(camera_id, now, cloudiness, cloudpattern, fogginess, offset_x, offset_y);
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aNow);

		this.something_to_draw = false;
	}

	this.flush = function(camera_id, now, cloudiness, cloudpattern, fogginess, offset_x, offset_y)
	{
		if (!this.buffer_counter[camera_id])
		{
			return;
		}
		var camera = cameras[camera_id];

		//offset_x = 0; offset_y = 0;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			this.vbuffer[camera_id].subarray(0, this.buffer_counter[camera_id] * this.magic_number),
			gl.STATIC_DRAW);

		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	28, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	28, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	28, 16);
		gl.vertexAttribPointer(this.program.aNow,				1, gl.FLOAT,	false,	28, 24);

		gl.uniform2fv(this.program.uCamPosition,camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 	camera.zoom);

		gl.uniform1f(this.program.uNow, now);


		if (µ.rand_int(50) == 0)
		{
			//console.log(now, cloudiness, cloudpattern, fogginess, offset_x, offset_y);
		}

		gl.uniform1f(this.program.uOffsetX, offset_x);
		gl.uniform1f(this.program.uOffsetY, offset_y);

		gl.uniform1f(this.program.uCloudiness, cloudiness);
		gl.uniform1f(this.program.uCloudpattern, cloudpattern);
		gl.uniform1f(this.program.uFogginess, fogginess);

		gl.uniform1f(this.program.uFade, Math.min(Math.min(camera.zoom[0], camera.zoom[1]) / 2000.0 * 1.5, 0.5));

		gl.uniform1i(this.program.uYOrigin, 0);
		gl.uniform1i(this.program.uXOrigin, 0);

		var	numItems = this.buffer_counter[camera_id] * this.vertices_per_object;

		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		this.buffer_counter[camera_id] = 0;
	};
}