µ.WebGL_Rectangles_Tex2 = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.vbuffer = [];
	for (var i in cameras)
	{
		this.vbuffer[i] = [];
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();
	this.vertex_shader = ["",
	"attribute	vec2		aVertexPosition;",
	"attribute	vec2		aTexPosition;",
	"attribute	vec2		aPosition;",
	"attribute	vec4		aColor;",
	"attribute	vec4		aColor2;",
	"attribute	float		aFade;",

	"uniform	vec2		uCamPosition;",
	"uniform	vec2		uCamZoom;",

	"varying	vec4		vColor;",
	"varying	vec4		vColor2;",
	"varying	vec2		vPosition;",
	"varying	float		vFade;",
	"varying	highp vec2	vTexPosition;",

	"void main()",
	"{",
	"	vec2 pos = vec2((aPosition[0] * 2.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0], (aPosition[1] * 2.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]);",
	"	gl_Position = vec4(	(pos[0] + aVertexPosition[0] / uCamZoom[0]),",
	"						(pos[1] + aVertexPosition[1] / uCamZoom[1]),",
	"						0.0, 1.0);",
	"	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);",
	"	vTexPosition = aTexPosition;",
	"	vColor = aColor;",
	"	vColor2 = aColor2;",
	"	vFade = aFade;",
	"}",
	""].join('\n');
	this.fragment_shader = ["",

//	"	precision highp	float;",
"	precision mediump	float;",

	"varying	vec4		vColor;",
	"varying	vec4		vColor2;",
	"varying	vec2		vPosition;",
	"varying	float		vFade;",
	"varying	highp vec2	vTexPosition;",
	"uniform 	sampler2D 	uSampler;",
	"uniform 	sampler2D 	uSampler2;",
	bxx_shader_includes.colors + "\n",
	"void main()",
	"{",
	"	vec4 texColor = texture2D(uSampler, vTexPosition);",
	"	vec4 texColor1;",
	"	vec4 texColor2 = texture2D(uSampler2, vTexPosition);",
	"	float vFade2 = 1.0 - vFade;",
	"	texColor1 = RGBA_to_HSLA(texColor[0], texColor[1], texColor[2], texColor[3]);",
	"	texColor2 = RGBA_to_HSLA(texColor2[0], texColor2[1], texColor2[2], texColor2[3]);",
	"	vec4 maxColor = vec4(",
	"		texColor1[0] * (1.0 - vColor[0]) + texColor2[0] * vColor[0],",
	"		texColor1[1] * (1.0 - vColor[1]) + texColor2[1] * vColor[1],",
	"		texColor1[2] * (1.0 - vColor[2]) + texColor2[2] * vColor[2],",
	"		texColor1[3] * (1.0 - vColor[3]) + texColor2[3] * vColor[3]",
	"	);",
	"	vec4 durr = HSLA_to_RGBA(maxColor[0], maxColor[1], maxColor[2], maxColor[3]);",
	"	texColor[0] = texColor[0] * vFade2 + durr[0] * vFade;",
	"	texColor[1] = texColor[1] * vFade2 + durr[1] * vFade;",
	"	texColor[2] = texColor[2] * vFade2 + durr[2] * vFade;",
	"	texColor[3] = texColor[3] * vFade2 + durr[3] * vFade;",
	"	texColor = RGBA_to_HSLA(texColor[0], texColor[1], texColor[2], texColor[3]);",
	"	texColor = HSLA_to_RGBA(texColor[0] + vColor2[0], texColor[1] * vColor2[1], texColor[2] * vColor2[2], texColor[3] * vColor2[3]);",
	"	gl_FragColor = texColor;",
	"}",
	""].join('\n');
	
//	console.log(this.fragment_shader);

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
	gl.useProgram(this.program);
	this.program.aVertexPosition	= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aTexPosition		= gl.getAttribLocation(this.program, "aTexPosition");
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");
	this.program.aColor2			= gl.getAttribLocation(this.program, "aColor2");
	this.program.aFade				= gl.getAttribLocation(this.program, "aFade");
	this.program.uCamPosition	= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom		= gl.getUniformLocation(this.program, "uCamZoom");

	gl.errorCheck('setup rectangles_tex2');

	this.draw = function(
		cam_id,
		texture_id,
		texture2_id,
		fade,
		pos_x,
		pos_y,
		width,
		height,
		angle,
		mix_h, mix_s, mix_l, mix_a,
		tint_h, tint_s, tint_l, tint_a
		)
	{
		var width2 = width / 1, height2 = height / 1;
		if (!this.vbuffer[cam_id])
		{
			console.log('draw_rectangle_tex: unknown cam: ' + cam_id);
		}
		this.something_to_draw = true;
		
		/*if (	this.last_texture_id[cam_id] != texture_id
			||	this.last_texture2_id[cam_id] != texture2_id)
		{
			if (this.vbuffer[cam_id].length > 0)
			{
				this.flush(cam_id, this.last_texture_id[cam_id], this.last_texture2_id[cam_id]);
			}
			this.last_texture_id[cam_id] = texture_id;
			this.last_texture2_id[cam_id] = texture2_id;
		}*/

		var	mix_h_1, mix_s_1, mix_l_1, mix_a_1,
			mix_h_2, mix_s_2, mix_l_2, mix_a_2,
			mix_h_3, mix_s_3, mix_l_3, mix_a_3,
			mix_h_4, mix_s_4, mix_l_4, mix_a_4;
		var	tint_h_1, tint_s_1, tint_l_1, tint_a_1,
			tint_h_2, tint_s_2, tint_l_2, tint_a_2,
			tint_h_3, tint_s_3, tint_l_3, tint_a_3,
			tint_h_4, tint_s_4, tint_l_4, tint_a_4;

		if (mix_h[0] !== undefined && mix_h[1] !== undefined && mix_h[2] !== undefined && mix_h[3] !== undefined) { mix_h_1 = mix_h[0]; mix_h_2 = mix_h[1]; mix_h_3 = mix_h[2]; mix_h_4 = mix_h[3]; } else { mix_h_1 = mix_h_2 = mix_h_3 = mix_h_4 = mix_h; }
		if (mix_s[0] !== undefined && mix_s[1] !== undefined && mix_s[2] !== undefined && mix_s[3] !== undefined) { mix_s_1 = mix_s[0]; mix_s_2 = mix_s[1]; mix_s_3 = mix_s[2]; mix_s_4 = mix_s[3]; } else { mix_s_1 = mix_s_2 = mix_s_3 = mix_s_4 = mix_s; }
		if (mix_l[0] !== undefined && mix_l[1] !== undefined && mix_l[2] !== undefined && mix_l[3] !== undefined) { mix_l_1 = mix_l[0]; mix_l_2 = mix_l[1]; mix_l_3 = mix_l[2]; mix_l_4 = mix_l[3]; } else { mix_l_1 = mix_l_2 = mix_l_3 = mix_l_4 = mix_l; }
		if (mix_a[0] !== undefined && mix_a[1] !== undefined && mix_a[2] !== undefined && mix_a[3] !== undefined) { mix_a_1 = mix_a[0]; mix_a_2 = mix_a[1]; mix_a_3 = mix_a[2]; mix_a_4 = mix_a[3]; } else { mix_a_1 = mix_a_2 = mix_a_3 = mix_a_4 = mix_a; }

		if (tint_h[0] !== undefined && tint_h[1] !== undefined && tint_h[2] !== undefined && tint_h[3] !== undefined) { tint_h_1 = tint_h[0]; tint_h_2 = tint_h[1]; tint_h_3 = tint_h[2]; tint_h_4 = tint_h[3]; } else { tint_h_1 = tint_h_2 = tint_h_3 = tint_h_4 = tint_h; }
		if (tint_s[0] !== undefined && tint_s[1] !== undefined && tint_s[2] !== undefined && tint_s[3] !== undefined) { tint_s_1 = tint_s[0]; tint_s_2 = tint_s[1]; tint_s_3 = tint_s[2]; tint_s_4 = tint_s[3]; } else { tint_s_1 = tint_s_2 = tint_s_3 = tint_s_4 = tint_s; }
		if (tint_l[0] !== undefined && tint_l[1] !== undefined && tint_l[2] !== undefined && tint_l[3] !== undefined) { tint_l_1 = tint_l[0]; tint_l_2 = tint_l[1]; tint_l_3 = tint_l[2]; tint_l_4 = tint_l[3]; } else { tint_l_1 = tint_l_2 = tint_l_3 = tint_l_4 = tint_l; }
		if (tint_a[0] !== undefined && tint_a[1] !== undefined && tint_a[2] !== undefined && tint_a[3] !== undefined) { tint_a_1 = tint_a[0]; tint_a_2 = tint_a[1]; tint_a_3 = tint_a[2]; tint_a_4 = tint_a[3]; } else { tint_a_1 = tint_a_2 = tint_a_3 = tint_a_4 = tint_a; }

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
		
		if (!this.vbuffer[cam_id][texture_id])
			this.vbuffer[cam_id][texture_id] = []
		if (!this.vbuffer[cam_id][texture_id][texture2_id])
			this.vbuffer[cam_id][texture_id][texture2_id] = []
		this.vbuffer[cam_id][texture_id][texture2_id].push(
			// - + top left
			a_cos * (-width2) - a_sin * (+height2),
			a_sin * (-width2) + a_cos * (+height2),
			pos_x, pos_y,1,1,
			mix_h_1, mix_s_1, mix_l_1, mix_a_1,
			tint_h_1, tint_s_1, tint_l_1, tint_a_1,
			fade,
			// + + top right
			a_cos * (+width2) - a_sin * (+height2),
			a_sin * (+width2) + a_cos * (+height2),
			pos_x, pos_y,0,1,
			mix_h_2, mix_s_2, mix_l_2, mix_a_2,
			tint_h_2, tint_s_2, tint_l_2, tint_a_2,
			fade,
			// + - bottom right
			a_cos * (+width2) - a_sin * (-height2),
			a_sin * (+width2) + a_cos * (-height2),
			pos_x, pos_y,0,0,
			mix_h_3, mix_s_3, mix_l_3, mix_a_3,
			tint_h_3, tint_s_3, tint_l_3, tint_a_3,
			fade,
			// - + top left
			a_cos * (-width2) - a_sin * (+height2),
			a_sin * (-width2) + a_cos * (+height2),
			pos_x, pos_y,1,1,
			mix_h_1, mix_s_1, mix_l_1, mix_a_1,
			tint_h_1, tint_s_1, tint_l_1, tint_a_1,
			fade,
			// + - bottom right
			a_cos * (+width2) - a_sin * (-height2),
			a_sin * (+width2) + a_cos * (-height2),
			pos_x, pos_y,0,0,
			mix_h_3, mix_s_3, mix_l_3, mix_a_3,
			tint_h_3, tint_s_3, tint_l_3, tint_a_3,
			fade,
			// - - bottom left
			a_cos * (-width2) - a_sin * (-height2),
			a_sin * (-width2) + a_cos * (-height2),
			pos_x, pos_y,1,0,
			mix_h_4, mix_s_4, mix_l_4, mix_a_4,
			tint_h_4, tint_s_4, tint_l_4, tint_a_4,
			fade
			);
	};
	this.flush_all = function()
	{
		if (!this.something_to_draw)
		{
			return;
		}

		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		gl.enableVertexAttribArray(this.program.aColor);
		gl.enableVertexAttribArray(this.program.aColor2);
		gl.enableVertexAttribArray(this.program.aFade);
		for (var camera_id in cameras)
		{
			for (var texture_id in this.vbuffer[camera_id])
			{
				for (var texture2_id in this.vbuffer[camera_id][texture_id])
				{
					this.flush(camera_id, texture_id, texture2_id);
				}
			}
			this.vbuffer[camera_id] = [];
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aColor);
		gl.disableVertexAttribArray(this.program.aColor2);
		gl.disableVertexAttribArray(this.program.aFade);

		this.something_to_draw = false;
	}
	this.flush = function(camera_id, texture_id, texture2_id)
	{
		var camera = cameras[camera_id];
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vbuffer[camera_id][texture_id][texture2_id]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	60, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	60, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	60, 16);
		gl.vertexAttribPointer(this.program.aColor, 			4, gl.FLOAT,	false,	60, 24);
		gl.vertexAttribPointer(this.program.aColor2, 			4, gl.FLOAT,	false,	60, 40);
		gl.vertexAttribPointer(this.program.aFade, 				1, gl.FLOAT,	false,	60, 56);
		gl.uniform2fv(this.program.uCamPosition,	camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 		camera.zoom);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);
		gl.uniform1i(gl.getUniformLocation(this.program, "uSampler"), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture2_id]);
		gl.uniform1i(gl.getUniformLocation(this.program, "uSampler2"), 1);
		var	numItems = this.vbuffer[camera_id][texture_id][texture2_id].length / 	15;
		// INVALID_OPERATION? orly?
		gl.drawArrays(gl.TRIANGLES,	0, numItems);
	};
}