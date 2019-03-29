"use strict";

µ.Particles2D.prototype.init_shaders = function (gl, pDefs)
{
	this.pDef_indices = {};
	var pdef_index = 0; // also doubles as total count after the loop
	var vs_pdefs_source = [];
	var vs_pdefs_source_main = [];
	var vs_pdefs_sources = [];
	vs_pdefs_sources[2] = [];
	vs_pdefs_sources[3] = [];
	vs_pdefs_sources[4] = [];
	vs_pdefs_sources['pdef2'] = [];
	vs_pdefs_sources['pdef3'] = [];
	vs_pdefs_sources['pdef4'] = [];

	for (var i in pDefs)
	{
		// convert everything into the same format
		this.pDef_indices[i] = pdef_index;
		var stop_count = 0;
		// see how many stops this particle definition has
		// surely there is a better way to do this.. ? (not that it matters, since it only happens once during setup)
		for (var stop in pDefs[i].c)
		{
			++stop_count;
		}
		// FIXME: turn if's into switch! (and maybe do a benchmark to compare? nah.. :P)
		vs_pdefs_source_main.push('	if (pdef_index == ' + pdef_index + ') pdef_type = ' + stop_count + ';');
		vs_pdefs_sources[stop_count].push(
			'		if (pdef_index == ' + pdef_index + ')',
			'		{',
			'			current_pdef = pdef' + pdef_index + ';',
			'		}');
		vs_pdefs_source.push('pDef' + stop_count + ' pdef' + pdef_index + ' = pDef' + stop_count + '(');
		var current_stop_index = 0;
		for (var stop in pDefs[i].c)
		{
			++current_stop_index;
			if (current_stop_index > 1 && current_stop_index < stop_count)
			{
				vs_pdefs_source.push(	'	float(' +  stop + '),');
			}
			vs_pdefs_source.push(	'	Color (',
									'		float(' +  pDefs[i].c[stop].r + '),',
									'		float(' +  pDefs[i].c[stop].g + '),',
									'		float(' +  pDefs[i].c[stop].b + '),',
									'		float(' +  pDefs[i].c[stop].a + ')',
									'	),');
		}
		var current_stop_index = 0;
		for (var stop in pDefs[i].size)
		{
			++current_stop_index;
			if (current_stop_index > 1 && current_stop_index < stop_count)
			{
				vs_pdefs_source.push(	'	float(' +  stop + '),');
			}
			vs_pdefs_source.push(	'	float(' +  pDefs[i].size[stop] + '),');
		}
		var current_stop_index = 0;
		for (var stop in pDefs[i].softness)
		{
			++current_stop_index;
			if (current_stop_index > 1 && current_stop_index < stop_count)
			{
				vs_pdefs_source.push(	'	float(' +  stop + '),');
			}
			vs_pdefs_source.push(	'	float(' +  pDefs[i].softness[stop] + '),');
		}
		var current_stop_index = 0;
		for (var stop in pDefs[i].speed)
		{
			++current_stop_index;
			if (current_stop_index > 1 && current_stop_index < stop_count)
			{
				vs_pdefs_source.push(	'	float(' +  stop + '),');
			}
			vs_pdefs_source.push(	'	float(' +  pDefs[i].speed[stop] + '),');
		}
		var current_stop_index = 0;
		for (var stop in pDefs[i].shape)
		{
			++current_stop_index;
			if (current_stop_index > 1 && current_stop_index < stop_count)
			{
				vs_pdefs_source.push(	'	float(' +  stop + '),');
			}
			vs_pdefs_source.push(	'	float(' +  pDefs[i].shape[stop] + ')' + (current_stop_index != stop_count ? ',' : ''));
		}

		vs_pdefs_source.push(	');', '');
		++pdef_index;
	}
	var attributes = [
		'c',
		'size',
		'softness',
		'speed',
		'shape',
	];
	for (var i = attributes.length; i--;)
	{
		var attribute = attributes[i];
		vs_pdefs_sources[2].push(
"		"+attribute+"_lower = current_pdef."+attribute+"1;",
"		"+attribute+"_upper = current_pdef."+attribute+"2;",
"		"+attribute+"_stop_frac = vFrac;"
		);
		vs_pdefs_sources[3].push(
"		if (vFrac < current_pdef."+attribute+"_stop1)",
"		{",
"			"+attribute+"_lower = current_pdef."+attribute+"1;",
"			"+attribute+"_upper = current_pdef."+attribute+"2;",
"			"+attribute+"_stop_frac = vFrac / current_pdef."+attribute+"_stop1;",
"		}",
"		else",
"		{",
"			"+attribute+"_lower = current_pdef."+attribute+"2;",
"			"+attribute+"_upper = current_pdef."+attribute+"3;",
"			"+attribute+"_stop_frac = (vFrac - current_pdef."+attribute+"_stop1) / (1.0 - current_pdef."+attribute+"_stop1);",
"		}"
		);
		vs_pdefs_sources[4].push(
"		if (vFrac < current_pdef."+attribute+"_stop1)",
"		{",
"			"+attribute+"_lower = current_pdef."+attribute+"1;",
"			"+attribute+"_upper = current_pdef."+attribute+"2;",
"			"+attribute+"_stop_frac = vFrac / current_pdef."+attribute+"_stop1;",
"		}",
"		else if (vFrac < current_pdef."+attribute+"_stop2)",
"		{",
"			"+attribute+"_lower = current_pdef."+attribute+"2;",
"			"+attribute+"_upper = current_pdef."+attribute+"3;",
"			"+attribute+"_stop_frac = (vFrac - current_pdef."+attribute+"_stop1) / (current_pdef."+attribute+"_stop2 - current_pdef."+attribute+"_stop1);",
"		}",
"		else",
"		{",
"			"+attribute+"_lower = current_pdef."+attribute+"3;",
"			"+attribute+"_upper = current_pdef."+attribute+"4;",
"			"+attribute+"_stop_frac = (vFrac - current_pdef."+attribute+"_stop2) / (1.0 - current_pdef."+attribute+"_stop2);",
"		}"
		);
	}
	//alert(vs_pdefs_source.join("\n"));
	var vs_source = ["",
// gah: 'attribute' : cannot be bool or int
"attribute	float	aPDefIndex;",
"attribute	vec2	aVertexPosition;",
"attribute	vec2	aPosition;",
"attribute	vec2	aVelocity;",
"attribute	vec2	aStartEnd;",
"attribute	vec4	aColor;",
"attribute	float	aSize;",
"uniform	vec2	uCamPosition;",
"uniform	vec2	uCamZoom;",
"uniform	float	uTime;",
"varying	vec4	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",
"varying	float	vFrac;",
"varying	float	vShape;",
"varying	float	vSoftness;",
"struct Color {",
"	float R;",
"	float G;",
"	float B;",
"	float A;",
"};",
"struct pDef2 {",
//vs_pdefs_sources['pdef2'].join("\n") + "\n",
"	Color		c1;",
"	Color		c2;",
"	float		size1;",
"	float		size2;",
"	float		softness1;",
"	float		softness2;",
"	float		speed1;",
"	float		speed2;",
"	float		shape1;",
"	float		shape2;",
"};",
"struct pDef3 {",
"	Color		c1;",
"	float		c_stop1;",
"	Color		c2;",
"	Color		c3;",
"	float		size1;",
"	float		size_stop1;",
"	float		size2;",
"	float		size3;",
"	float		softness1;",
"	float		softness_stop1;",
"	float		softness2;",
"	float		softness3;",
"	float		speed1;",
"	float		speed_stop1;",
"	float		speed2;",
"	float		speed3;",
"	float		shape1;",
"	float		shape_stop1;",
"	float		shape2;",
"	float		shape3;",
"};",
"struct pDef4 {",
"	Color		c1;",
"	float		c_stop1;",
"	Color		c2;",
"	float		c_stop2;",
"	Color		c3;",
"	Color		c4;",
"	float		size1;",
"	float		size_stop1;",
"	float		size2;",
"	float		size_stop2;",
"	float		size3;",
"	float		size4;",
"	float		softness1;",
"	float		softness_stop1;",
"	float		softness2;",
"	float		softness_stop2;",
"	float		softness3;",
"	float		softness4;",
"	float		speed1;",
"	float		speed_stop1;",
"	float		speed2;",
"	float		speed_stop2;",
"	float		speed3;",
"	float		speed4;",
"	float		shape1;",
"	float		shape_stop1;",
"	float		shape2;",
"	float		shape_stop2;",
"	float		shape3;",
"	float		shape4;",
"};",
bxx_shader_includes.colors + "\n",
vs_pdefs_source.join("\n") + "\n",
"void main()",
"{",
"	int pdef_index = int(aPDefIndex);",
"	vFrac = (float(uTime) - aStartEnd[0]) / (aStartEnd[1] - aStartEnd[0]);",
"	if (float(uTime) > aStartEnd[1] || float(uTime) < aStartEnd[0])",
"	{",
// surely this is the correct way to do it, haha.
"		gl_Position = vec4(	-2.0, -2.0, 0.0, 1.0);",
"		return;",
"	}",
"	float frac2 = 1.0 - vFrac;",
"	float c_stop_frac;",
"	float c_stop_frac2;",
"	float size_stop_frac;",
"	float size_stop_frac2;",
"	float softness_stop_frac;",
"	float softness_stop_frac2;",
"	float speed_stop_frac;",
"	float speed_stop_frac2;",
"	float shape_stop_frac;",
"	float shape_stop_frac2;",
"	float size;",
"	float speed;",
"	Color c_lower;",
"	Color c_upper;",
"	float size_lower;",
"	float size_upper;",
"	float softness_lower;",
"	float softness_upper;",
"	float speed_lower;",
"	float speed_upper;",
"	float shape_lower;",
"	float shape_upper;",
"	int pdef_type;",
	vs_pdefs_source_main.join("\n") + "\n",
"	if (pdef_type == 2)",
"	{",
"		pDef2 current_pdef;",
		vs_pdefs_sources[2].join("\n") + "\n",
"	}",
"	else if (pdef_type == 3)",
"	{",
"		pDef3 current_pdef;",
		vs_pdefs_sources[3].join("\n") + "\n",
"	}",
"	else if (pdef_type == 4)",
"	{",
"		pDef4 current_pdef;",
		vs_pdefs_sources[4].join("\n") + "\n",
"	}",
"	c_stop_frac2 = 1.0 - c_stop_frac;",
"	size_stop_frac2 = 1.0 - size_stop_frac;",
"	softness_stop_frac2 = 1.0 - softness_stop_frac;",
"	speed_stop_frac2 = 1.0 - speed_stop_frac;",
"	shape_stop_frac2 = 1.0 - shape_stop_frac;",
"	vColor = vec4(	(c_lower.R * c_stop_frac2 + c_upper.R * c_stop_frac),",
"					(c_lower.G * c_stop_frac2 + c_upper.G * c_stop_frac),",
"					(c_lower.B * c_stop_frac2 + c_upper.B * c_stop_frac),",
"					(c_lower.A * c_stop_frac2 + c_upper.A * c_stop_frac));",
"	vec4 color = RGBA_to_HSLA(vColor[0], vColor[1], vColor[2], vColor[3]);",
"	vColor = HSLA_to_RGBA(color[0] + aColor[0], color[1] * aColor[1], color[2] * aColor[2], color[3] * aColor[3]);",
"	size = (size_lower * size_stop_frac2 + size_upper * size_stop_frac) * aSize;",
"	vSoftness = softness_lower * softness_stop_frac2 + softness_upper * softness_stop_frac;",
"	vShape = shape_lower * shape_stop_frac2 + shape_upper * shape_stop_frac;",
"	speed = speed_lower * speed_stop_frac2 + speed_upper * speed_stop_frac;",
// apply velocity
"	vec2 posPlusVel = vec2(aPosition[0] + aVelocity[0] * speed, aPosition[1] + aVelocity[1] * speed);",
// see where on the screen we are
"	vec2 pos = vec2((posPlusVel[0] * 2.0 - (uCamPosition[0] * 2.0)) / uCamZoom[0], (posPlusVel[1] * 2.0 - (uCamPosition[1] * 2.0)) / uCamZoom[1]);",
"",
"	gl_Position = vec4(	(pos[0] + aVertexPosition[0] * size / uCamZoom[0]),",
"						(pos[1] + aVertexPosition[1] * size / uCamZoom[1]),",
"						0.0, 1.0);",
// rotation will go here (or would - it's not that it's terribly important for itty bitty particles)
//"	gl_Position[0] /= uCamZoom[0];",
//"	gl_Position[1] /= uCamZoom[1];",
// from -1 to 1 (top left origin)
"	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);",
// from 0 to 1 (top left origin)
//"	vScreenPosition = vec2((1.0 + gl_Position[0]) / 2.0, (1.0 - gl_Position[1]) / 2.0);",
"}",
""].join('\n');
	//console.log(vs_source);
	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, vs_source);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));
	var fs_source = ["",

//"	precision highp	float;",

"	precision mediump	float;",

"varying	vec4	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",
"varying	float	vFrac;",
"varying	float	vShape;",
"varying	float	vSoftness;",
"",
"void main()",
"{",
"	if (vColor[3] == 0.0)",
"		discard;",
"	float dist_from_center = distance(vec2(vPosition[0], vPosition[1]) , vec2(0.0, 0.0));",
"	float dist_from_center_x = abs(vPosition[0]);",
"	float dist_from_center_y = abs(vPosition[1]);",
"	float max_dist_from_center = max(dist_from_center_x, dist_from_center_y);",
"	float frac = vShape;",

"	frac = pow(2.0, frac);",

"	float used_dist_from_center = (frac * dist_from_center) + (1.0 - frac) * max_dist_from_center;",

/*
"	float dist_frac = dist_from_center / max_dist_from_center;",
"	float falloff = 1.0;",
"	if (vSoftness < 0.5)",
"	{",
"		falloff = pow(1.0 - dist_frac, vSoftness * 2.0);",
"	}",
"	else",
"	{",
"		falloff = 1.0 - pow(dist_frac, 1.0 - (vSoftness - 0.5) * 2.0);",
"	}",
*/

//"	if (used_dist_from_center > 0.9)",
"	if (dist_from_center > 1.0)",
"		discard;",
//"	gl_FragColor = vColor * vec4(1, 1, 1, 1.0 - falloff);",
"	gl_FragColor = vColor * vec4(1, 1, 1, (1.0 - used_dist_from_center * vSoftness));",

//"	gl_FragColor = vColor * vec4(bevel, bevel, bevel, shade);",
"}",
""].join('\n');
	//console.log(fs_source);
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
}