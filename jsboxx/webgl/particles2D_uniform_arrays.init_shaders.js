µ.Particles2D_uniform_arrays.prototype.init_shaders = function (gl, pDefs)
{
	this.pDef_indices = {};

	var vs_decide_on_stop = [];
	var vs_tralalu = [];
	for (var i = 0; i < this.pdef_parameters.length; i++)
	{
		var parameter = this.pdef_parameters[i];
		vs_tralalu.push('	float ' + parameter+'_lower;');
		vs_tralalu.push('	float ' + parameter+'_upper;');
		vs_tralalu.push('	float ' + parameter+'_stop_frac;');
		if (this.stop_count == 2)
		{
			vs_decide_on_stop.push(
"		"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"		"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"		"+parameter+"_stop_frac = vFrac;"
			);
		}
		else if (this.stop_count == 3)
		{
			vs_decide_on_stop.push(
"		if (vFrac < u"+parameter+"_stop_0[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_stop_frac = vFrac / u"+parameter+"_stop_0[pdef_index];",
"		}",
"		else",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_0[pdef_index]) / (1.0 - u"+parameter+"_stop_0[pdef_index]);",
"		}"
			);

		}
		else if (this.stop_count == 4)
		{
			vs_decide_on_stop.push(
"		if (vFrac < u"+parameter+"_stop_0[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_stop_frac = vFrac / u"+parameter+"_stop_0[pdef_index];",
"		}",
"		else if (vFrac < u"+parameter+"_stop_1[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_0[pdef_index]) / (u"+parameter+"_stop_1[pdef_index] - u"+parameter+"_stop_0[pdef_index]);",
"		}",
"		else",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_1[pdef_index]) / (1.0 - u"+parameter+"_stop_1[pdef_index]);",
"		}"
			);
		}
		else if (this.stop_count == 5)
		{
			vs_decide_on_stop.push(
"		if (vFrac < u"+parameter+"_stop_0[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_stop_frac = vFrac / u"+parameter+"_stop_0[pdef_index];",
"		}",
"		else if (vFrac < u"+parameter+"_stop_1[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_0[pdef_index]) / (u"+parameter+"_stop_1[pdef_index] - u"+parameter+"_stop_0[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_2[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_1[pdef_index]) / (u"+parameter+"_stop_2[pdef_index] - u"+parameter+"_stop_1[pdef_index]);",
"		}",
"		else",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_4[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_2[pdef_index]) / (1.0 - u"+parameter+"_stop_2[pdef_index]);",
"		}"
			);
		}
		else if (this.stop_count == 6)
		{
			vs_decide_on_stop.push(
"		if (vFrac < u"+parameter+"_stop_0[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_stop_frac = vFrac / u"+parameter+"_stop_0[pdef_index];",
"		}",
"		else if (vFrac < u"+parameter+"_stop_1[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_0[pdef_index]) / (u"+parameter+"_stop_1[pdef_index] - u"+parameter+"_stop_0[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_2[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_1[pdef_index]) / (u"+parameter+"_stop_2[pdef_index] - u"+parameter+"_stop_1[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_3[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_4[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_2[pdef_index]) / (u"+parameter+"_stop_3[pdef_index] - u"+parameter+"_stop_2[pdef_index]);",
"		}",
"		else",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_4[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_5[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_3[pdef_index]) / (1.0 - u"+parameter+"_stop_3[pdef_index]);",
"		}"
			);
		}
		else if (this.stop_count == 7)
		{
			vs_decide_on_stop.push(
"		if (vFrac < u"+parameter+"_stop_0[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_0[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_stop_frac = vFrac / u"+parameter+"_stop_0[pdef_index];",
"		}",
"		else if (vFrac < u"+parameter+"_stop_1[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_1[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_0[pdef_index]) / (u"+parameter+"_stop_1[pdef_index] - u"+parameter+"_stop_0[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_2[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_2[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_1[pdef_index]) / (u"+parameter+"_stop_2[pdef_index] - u"+parameter+"_stop_1[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_3[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_3[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_4[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_2[pdef_index]) / (u"+parameter+"_stop_3[pdef_index] - u"+parameter+"_stop_2[pdef_index]);",
"		}",
"		else if (vFrac < u"+parameter+"_stop_4[pdef_index])",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_4[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_5[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_3[pdef_index]) / (u"+parameter+"_stop_4[pdef_index] - u"+parameter+"_stop_3[pdef_index]);",
"		}",
"		else",
"		{",
"			"+parameter+"_lower = u"+parameter+"_value_5[pdef_index];",
"			"+parameter+"_upper = u"+parameter+"_value_6[pdef_index];",
"			"+parameter+"_stop_frac = (vFrac - u"+parameter+"_stop_4[pdef_index]) / (1.0 - u"+parameter+"_stop_4[pdef_index]);",
"		}"
			);
		}
		vs_decide_on_stop.push("	v"+parameter+" = "+parameter+"_lower * (1.0 - "+parameter+"_stop_frac) + "+parameter+"_upper * "+parameter+"_stop_frac;");
	}

	var src_uniform_parameters = [];
	var src_varying_parameters = [];

	for (var i = 0; i < this.pdef_parameters.length; i++)
	{
		var parameter_name = this.pdef_parameters[i];
		for (var j = 0; j < this.pdef_stops_n_values.length; j++)
		{
			src_uniform_parameters.push('uniform float u' + parameter_name + '_' + this.pdef_stops_n_values[j] + '[' + this.pdef_count + '];');
		}
		src_varying_parameters.push('varying float v' + parameter_name + ';');
	}



	var vs_source = ["",

(function () {/*
	attribute	float	aPDefIndex;
	attribute	vec2	aVertexPosition;
	attribute	vec2	aPosition;
	attribute	vec2	aVelocity;
	attribute	vec2	aStartEnd;
	attribute	vec4	aColor;
	attribute	float	aSize;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

src_uniform_parameters.join('\n'),

(function () {/*
	uniform	vec2	uCamPosition;
	uniform	vec2	uCamZoom;
	uniform	float	uTime;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

src_varying_parameters.join('\n'),


(function () {/*
	varying	vec4	vColor;
	varying	vec2	vPosition;
	//varying	vec2	vScreenPosition;
	varying	float	vFrac;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

bxx_shader_includes.colors + "\n",

(function () {/*
	void main()
	{
		int pdef_index = int(aPDefIndex);
		vFrac = (float(uTime) - aStartEnd[0]) / (aStartEnd[1] - aStartEnd[0]);
		if (float(uTime) > aStartEnd[1] || float(uTime) < aStartEnd[0])
		{
			// surely this is the correct way to do it, haha.
			gl_Position = vec4(	-2.0, -2.0, 0.0, 1.0);
			return;
		}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	vs_tralalu.join('\n'),
	vs_decide_on_stop.join('\n'),

(function () {/*
		vec4 color = RGBA_to_HSLA(v_Color_r, v_Color_g, v_Color_b, v_Color_a);
		vColor = HSLA_to_RGBA(color[0] + aColor[0], color[1] * aColor[1], color[2] * aColor[2], color[3] * aColor[3]);
		v_Size *= aSize;
		vec2 posPlusVel = vec2(aPosition[0] + aVelocity[0] * v_Speed, aPosition[1] + aVelocity[1] * v_Speed);

		// see where on the screen we are
		vec2 pos = vec2((posPlusVel[0] * 2.0 - (uCamPosition[0] * 2.0)) / uCamZoom[0], (posPlusVel[1] * 2.0 - (uCamPosition[1] * 2.0)) / uCamZoom[1]);
		gl_Position = vec4(	(pos[0] + aVertexPosition[0] * v_Size / uCamZoom[0]),
							(pos[1] + aVertexPosition[1] * v_Size / uCamZoom[1]),
							0.0, 1.0);
		// rotation will go here (or would - it's not that it's terribly important for itty bitty particles)
		// from -1 to 1 (top left origin)
		vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);
		// from 0 to 1 (top left origin)
		//	vScreenPosition = vec2((1.0 + gl_Position[0]) / 2.0, (1.0 - gl_Position[1]) / 2.0);
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

""].join('\n');
	//console.log(vs_source);
	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, vs_source);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));
	var fs_source = ["",

(function () {/*
	//	precision highp	float;
	precision mediump	float;

	varying	vec4	vColor;
	varying	vec2	vPosition;
	//varying	vec2	vScreenPosition;
	varying	float	vFrac;
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

src_varying_parameters.join('\n'),

(function () {/*

void main()
{
	if (vColor[3] == 0.0)
		discard;
	gl_FragColor = vec4(vColor[0], vColor[1], vColor[2], vColor[3]);
	float dist_from_center = distance(vec2(vPosition[0], vPosition[1]) , vec2(0.0, 0.0));

	float max_dist_from_center = max(abs(vPosition[0]), abs(vPosition[1]));
	float frac_y = mod(gl_FragCoord[1], 2.0);
	float line_alpha = 1.0;
	if (frac_y < 1.0 && v_Shape < 0.0)
	{
		line_alpha = line_alpha * (1.0 + v_Shape);
	}
	else if (frac_y >= 1.0 && v_Shape > 0.0)
	{
		line_alpha = line_alpha * (1.0 - v_Shape);
	}

	float v_Shape2 = 0.0;  // not implemented yet

	if (dist_from_center > 1.0)
	{
		discard;
	}
	if (v_Hole > dist_from_center)
	{
		float used_dist_from_center1 = (v_Hole - dist_from_center) / (1.0 - v_Hole);
		float used_dist_from_center2 = 0.0;
		dist_from_center = used_dist_from_center2 * v_Shape2 + (1.0 - v_Shape2) * used_dist_from_center1;
	}
	else
	{
		dist_from_center = (dist_from_center - v_Hole) / (1.0 - v_Hole);
	}
	float softness;
	if (v_Softness < 0.5)
	{
		softness =  pow(1.0 - dist_from_center, v_Softness * 2.0);
	}
	else
	{
		softness = 1.0 - pow(dist_from_center, 1.0 - ((v_Softness - 0.5) * 2.0));
	}
	gl_FragColor = vColor * vec4(1, 1, 1, softness * line_alpha);
}

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

""].join('\n');

	var	tmp_fragment_shader	= gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(tmp_fragment_shader, fs_source);
	gl.compileShader(tmp_fragment_shader);
	if (!gl.getShaderParameter(tmp_fragment_shader,	gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_fragment_shader));
	this.program = gl.createProgram();
	gl.attachShader(this.program, tmp_vertex_shader);
	gl.attachShader(this.program, tmp_fragment_shader);
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
		console.log(gl.getProgramInfoLog(this.program));

	gl.useProgram(this.program);

	this.program.aVertexPosition= gl.getAttribLocation(this.program,	"aVertexPosition");
	this.program.aPosition		= gl.getAttribLocation(this.program,	"aPosition");
	this.program.aVelocity		= gl.getAttribLocation(this.program,	"aVelocity");
	this.program.aStartEnd		= gl.getAttribLocation(this.program,	"aStartEnd");
	this.program.aPDefIndex		= gl.getAttribLocation(this.program,	"aPDefIndex");
	this.program.aColor			= gl.getAttribLocation(this.program,	"aColor");
	this.program.aSize			= gl.getAttribLocation(this.program,	"aSize");

	this.program.uCamPosition	= gl.getUniformLocation(this.program,	"uCamPosition");
	this.program.uCamZoom		= gl.getUniformLocation(this.program,	"uCamZoom");
	this.program.uTime			= gl.getUniformLocation(this.program,	"uTime");
	for (var i = 0; i < this.pdef_parameters.length; i++)
	{
		var parameter_name = this.pdef_parameters[i];
		for (var j = 0; j < this.pdef_stops_n_values.length; j++)
		{
			var uniform_name = 'u' + parameter_name + '_' + this.pdef_stops_n_values[j];
			this.program[uniform_name] = gl.getUniformLocation(this.program, uniform_name);
		}
	}

	var _STOP = 0; var _VALUE = 1;

	for (var i = 0; i < this.pdef_parameters.length; i++)
	{

		var parameter_name = this.pdef_parameters[i];
		var uniform_name = 'u' + parameter_name + '_' + 'value_0';
		var value_array = [];
		for (var pdef_name in pDefs)
		{
			value_array.push(pDefs[pdef_name][parameter_name][0][_VALUE]);
		}
		gl.uniform1fv(this.program[uniform_name], value_array);
		for (var j = 0; j < this.stop_count - 1; j++)
		{
			if (j > 0)
			{
				var uniform_name = 'u' + parameter_name + '_' + 'stop_' + (j - 1);
				var value_array = [];
				for (var pdef_name in pDefs)
				{
					value_array.push(pDefs[pdef_name][parameter_name][j + 0][_STOP]);
				}
				gl.uniform1fv(this.program[uniform_name], value_array);
			}
			var uniform_name = 'u' + parameter_name + '_' + 'value_' + (j + 1);
			var value_array = [];
			for (var pdef_name in pDefs)
			{
				value_array.push(pDefs[pdef_name][parameter_name][j + 1	][_VALUE]);
			}
			gl.uniform1fv(this.program[uniform_name], value_array);
		}
	}
}