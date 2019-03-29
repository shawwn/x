µ.WebGL_Rectangle_Depthmap = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 12;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = {};
	this.buffer_counter = {};
	this.buffer_max = {};

	for (var i in cameras)
	{
		this.vbuffer[i] = {};
		this.buffer_counter[i] = {};
		this.buffer_max[i] = {};
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = ["",
	"attribute	vec2	aVertexPosition;",
	"attribute	vec2	aTexPosition;",
	"attribute	vec2	aTexScale;",
	"attribute	vec2	aPosition;",
	"attribute	vec4	aColor;",
	"uniform	vec2	uCamPosition;",
	"uniform	vec2	uCamZoom;",
	"uniform	int		uCamXOrigin;",
	"uniform	int		uCamYOrigin;",
	"varying	vec4	vColor;",
	"varying	vec2	vPosition;",
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
	"	vColor = aColor;",
	"}",
	""].join('\n');

	this.fragment_shader = ["",
//	"precision highp		float;",
"	precision mediump	float;",

	"varying	vec4		vColor;",
	"varying	vec2		vPosition;",
	"varying	highp 	vec2	vTexPosition;",
	"varying	vec2		vTexScale;",

	"uniform 	sampler2D 	uSampler;",
	"uniform	float		uMinZ;",
	"uniform	float		uMinZ2;",
	"uniform	float		uMaxZ;",
	"uniform	float		uMaxZ2;",

	bxx_shader_includes.colors + "\n",


(function () {/*

void main()
{
	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;
	vec4 texColor = texture2D(uSampler, vec2(vTexPosition[0] * vTexScale[0],vTexPosition[1] * vTexScale[0]));
	float one_minus = 1.0 - texColor[0];

	//float alpha = 0.75 * min(ceil(texColor[0]), 1.0);
	//float hue = log(texColor[0]) * 50.0;

	// min(ceil(texColor[0]), 1.0)


	float alpha = min(0.001, texColor[0]) * 1000.0 * 0.6 + (1.0 - ((1.0 - texColor[0]) * (1.0 - texColor[0]) * (1.0 - texColor[0]))) * 0.4;
	float hue = 190.0 + 30.0 * texColor[0];

	if (texColor[0] < uMinZ2)
	{
		if (mod(gl_FragCoord[0] + gl_FragCoord[1], 2.0) < 1.0)
			gl_FragColor = vec4(1, 0, 0, 0.75);
		else
			gl_FragColor = vec4(0, 0, 0, 0);
	}
	else if (texColor[0] < uMinZ)
	{
		float frac = 1.0 - (texColor[0] - uMinZ) / (uMinZ2 - uMinZ);
		//if (mod(gl_FragCoord[0] + gl_FragCoord[1] * 2.0, 4.0) < 1.0)
		if (mod(gl_FragCoord[0] + gl_FragCoord[1] * (1.0 + 1.0 * frac), 2.0 + 2.0 * frac) < 1.0)
			gl_FragColor = vec4(1, 0, 0, 0.75);
		else
			gl_FragColor = vec4(0, 0, 0, 0);
	}
	else if (texColor[0] > uMaxZ2)
	{
		if (mod(gl_FragCoord[0] + gl_FragCoord[1], 2.0) < 1.0)
			gl_FragColor = vec4(255, 255, 0, 0.85);
		else
			gl_FragColor = vec4(0, 0, 0, 0.25);
	}
	else if (texColor[0] > uMaxZ)
	{
		float frac = 1.0 - (texColor[0] - uMaxZ) / (uMaxZ2 - uMaxZ);

		// if (mod(gl_FragCoord[0] * 2.0 + gl_FragCoord[1], 4.0) < 1.0)

		if (mod(gl_FragCoord[0] * (1.0 + 1.0 * frac)+ gl_FragCoord[1], 2.0 + 2.0 * frac) < 1.0)
			gl_FragColor = vec4(0, 255, 0, 0.65);
		else
			gl_FragColor = vec4(0, 0, 0, 0.05);
	}
	else
	{
		gl_FragColor = vec4(0, 0, 0, 0);
	}

	//gl_FragColor = HSLA_to_RGBA(mod(hue, 360.0), 0.9, 0.5 - vColor[3] * 0.2, alpha * vColor[3]);
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
	this.program.aTexScale			= gl.getAttribLocation(this.program, "aTexScale");
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");
	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");
	this.program.uMaxZ				= gl.getUniformLocation(this.program, "uMaxZ");
	this.program.uMaxZ2				= gl.getUniformLocation(this.program, "uMaxZ2");
	this.program.uMinZ				= gl.getUniformLocation(this.program, "uMinZ");
	this.program.uMinZ2				= gl.getUniformLocation(this.program, "uMinZ2");

	gl.errorCheck('setup rectangle_depthmap');

	this.draw = function(cam_id, texture_id, pos_x, pos_y, width, height, scale_x, scale_y, angle,
		tint_h_1, tint_s_1, tint_l_1, tint_a_1,
		tint_h_2, tint_s_2, tint_l_2, tint_a_2,
		tint_h_3, tint_s_3, tint_l_3, tint_a_3,
		tint_h_4, tint_s_4, tint_l_4, tint_a_4
		)
	{
		if (scale_x === undefined) scale_x = 1;
		if (scale_y === undefined) scale_y = 1;

		var
			width2 = width / 1,
			height2 = height / 1;
		
		if (!this.vbuffer[cam_id])
		{
			console.log('rectangle_depthmap.draw: unknown cam: ' + cam_id);
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

		// - + top left

		this.vbuffer[cam_id][texture_id][offset +  0] = a_cos * (-width2) - a_sin * (+height2),
		this.vbuffer[cam_id][texture_id][offset +  1] = a_sin * (-width2) + a_cos * (+height2),
		this.vbuffer[cam_id][texture_id][offset +  2] = pos_x;
		this.vbuffer[cam_id][texture_id][offset +  3] = pos_y;
		this.vbuffer[cam_id][texture_id][offset +  4] = 1;
		this.vbuffer[cam_id][texture_id][offset +  5] = 1;
		this.vbuffer[cam_id][texture_id][offset +  6] = scale_x;
		this.vbuffer[cam_id][texture_id][offset +  7] = scale_y;
		this.vbuffer[cam_id][texture_id][offset +  8] = tint_h_1;
		this.vbuffer[cam_id][texture_id][offset +  9] = tint_s_1;
		this.vbuffer[cam_id][texture_id][offset + 10] = tint_l_1;
		this.vbuffer[cam_id][texture_id][offset + 11] = tint_a_1;

		// + + top right

		this.vbuffer[cam_id][texture_id][offset + 12] = a_cos * (+width2) - a_sin * (+height2),
		this.vbuffer[cam_id][texture_id][offset + 13] = a_sin * (+width2) + a_cos * (+height2);
		this.vbuffer[cam_id][texture_id][offset + 14] = pos_x;
		this.vbuffer[cam_id][texture_id][offset + 15] = pos_y;
		this.vbuffer[cam_id][texture_id][offset + 16] = 0;
		this.vbuffer[cam_id][texture_id][offset + 17] = 1;
		this.vbuffer[cam_id][texture_id][offset + 18] = scale_x;
		this.vbuffer[cam_id][texture_id][offset + 19] = scale_y;
		this.vbuffer[cam_id][texture_id][offset + 20] = tint_h_2;
		this.vbuffer[cam_id][texture_id][offset + 21] = tint_s_2;
		this.vbuffer[cam_id][texture_id][offset + 22] = tint_l_2;
		this.vbuffer[cam_id][texture_id][offset + 23] = tint_a_2;

		// + - bottom right

		this.vbuffer[cam_id][texture_id][offset + 24] = a_cos * (+width2) - a_sin * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 25] = a_sin * (+width2) + a_cos * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 26] = pos_x;
		this.vbuffer[cam_id][texture_id][offset + 27] = pos_y;
		this.vbuffer[cam_id][texture_id][offset + 28] = 0;
		this.vbuffer[cam_id][texture_id][offset + 29] = 0;
		this.vbuffer[cam_id][texture_id][offset + 30] = scale_x;
		this.vbuffer[cam_id][texture_id][offset + 31] = scale_y;
		this.vbuffer[cam_id][texture_id][offset + 32] = tint_h_3;
		this.vbuffer[cam_id][texture_id][offset + 33] = tint_s_3;
		this.vbuffer[cam_id][texture_id][offset + 34] = tint_l_3;
		this.vbuffer[cam_id][texture_id][offset + 35] = tint_a_3;
			
		// - + top left

		this.vbuffer[cam_id][texture_id][offset + 36] = a_cos * (-width2) - a_sin * (+height2);
		this.vbuffer[cam_id][texture_id][offset + 37] = a_sin * (-width2) + a_cos * (+height2);
		this.vbuffer[cam_id][texture_id][offset + 38] = pos_x;
		this.vbuffer[cam_id][texture_id][offset + 39] = pos_y;
		this.vbuffer[cam_id][texture_id][offset + 40] = 1;
		this.vbuffer[cam_id][texture_id][offset + 41] = 1;
		this.vbuffer[cam_id][texture_id][offset + 42] = scale_x;
		this.vbuffer[cam_id][texture_id][offset + 43] = scale_y;
		this.vbuffer[cam_id][texture_id][offset + 44] = tint_h_1;
		this.vbuffer[cam_id][texture_id][offset + 45] = tint_s_1;
		this.vbuffer[cam_id][texture_id][offset + 46] = tint_l_1;
		this.vbuffer[cam_id][texture_id][offset + 47] = tint_a_1;

		// + - bottom right
		
		this.vbuffer[cam_id][texture_id][offset + 48] = a_cos * (+width2) - a_sin * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 49] = a_sin * (+width2) + a_cos * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 50] = pos_x;
		this.vbuffer[cam_id][texture_id][offset + 51] = pos_y;
		this.vbuffer[cam_id][texture_id][offset + 52] = 0;
		this.vbuffer[cam_id][texture_id][offset + 53] = 0;
		this.vbuffer[cam_id][texture_id][offset + 54] = scale_x;
		this.vbuffer[cam_id][texture_id][offset + 55] = scale_y;
		this.vbuffer[cam_id][texture_id][offset + 56] = tint_h_3;
		this.vbuffer[cam_id][texture_id][offset + 57] = tint_s_3;
		this.vbuffer[cam_id][texture_id][offset + 58] = tint_l_3;
		this.vbuffer[cam_id][texture_id][offset + 59] = tint_a_3;

		// - - bottom left

		this.vbuffer[cam_id][texture_id][offset + 60] = a_cos * (-width2) - a_sin * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 61] = a_sin * (-width2) + a_cos * (-height2);
		this.vbuffer[cam_id][texture_id][offset + 62] = pos_x;
		this.vbuffer[cam_id][texture_id][offset + 63] = pos_y;
		this.vbuffer[cam_id][texture_id][offset + 64] = 1;
		this.vbuffer[cam_id][texture_id][offset + 65] = 0;
		this.vbuffer[cam_id][texture_id][offset + 66] = scale_x;
		this.vbuffer[cam_id][texture_id][offset + 67] = scale_y;
		this.vbuffer[cam_id][texture_id][offset + 68] = tint_h_4;
		this.vbuffer[cam_id][texture_id][offset + 69] = tint_s_4;
		this.vbuffer[cam_id][texture_id][offset + 70] = tint_l_4;
		this.vbuffer[cam_id][texture_id][offset + 71] = tint_a_4;

		this.buffer_counter[cam_id][texture_id]++;

	};
	this.flush_all = function(min_z, min_z2, max_z, max_z2)
	{
		if (!this.something_to_draw)
		{
			return;
		}
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aTexScale);
		gl.enableVertexAttribArray(this.program.aPosition);
		gl.enableVertexAttribArray(this.program.aColor);
		for (var camera_id in cameras)
		{
			for (var texture_id in this.vbuffer[camera_id])
			{
				this.flush(camera_id, texture_id, min_z, min_z2, max_z, max_z2);
			}
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aTexScale);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aColor);
		this.something_to_draw = false;
	}

	this.flush = function(camera_id, texture_id, min_z, min_z2, max_z, max_z2)
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

		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	48, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	48, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	48, 16);
		gl.vertexAttribPointer(this.program.aTexScale,			2, gl.FLOAT,	false,	48, 24);
		gl.vertexAttribPointer(this.program.aColor, 			4, gl.FLOAT,	false,	48, 32);

		gl.uniform2fv(this.program.uCamPosition, camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 	 camera.zoom);

		gl.uniform1f(this.program.uMinZ, 	min_z);
		gl.uniform1f(this.program.uMinZ2, 	min_z2);
		gl.uniform1f(this.program.uMaxZ, 	max_z);
		gl.uniform1f(this.program.uMaxZ2, 	max_z2);

		gl.uniform1i(this.program.uYOrigin, 0);
		gl.uniform1i(this.program.uXOrigin, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);
		gl.uniform1i(this.program.uSampler, 0);

		var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;

		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		this.buffer_counter[camera_id][texture_id] = 0;
	};
}