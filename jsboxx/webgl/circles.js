"use strict";

µ.WebGL_Circles = function(gl, cameras)
{
//	return;
	this.vbuffer = {};

	for (var i = 0; i < cameras.length; i++)
	{
		this.vbuffer[i] = [];
	}
	
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = ["",
"attribute	vec2	aVertexPosition;",
"attribute	vec2	aPosition;",
"attribute	float	aRadius;",
"attribute	float	aSoftness;",
"attribute	float	aHole;",
"attribute	float	aFill1;",
"attribute	float	aFill2;",
"attribute	vec4	aColor;",
"attribute	float	aLightStrength;",
"attribute	float	aLightDirection;",

"uniform	vec2	uCamPosition;",
"uniform	vec2	uCamZoom;",

"varying	float	vSoftness;",
"varying	float	vHole;",
"varying	float	vFill1;",
"varying	float	vFill2;",
"varying	vec4	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",
"varying	float	vLightStrength;",
"varying	float	vLightPosX;",
"varying	float	vLightPosY;",

"void main()",
"{",

"	vec2 pos = vec2((aPosition[0] * 2.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0], (aPosition[1] * 2.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]);",
"",
"	gl_Position = vec4(	(pos[0] + aVertexPosition[0] * aRadius * 2.0 / uCamZoom[0]),",
"						(pos[1] + aVertexPosition[1] * aRadius * 2.0 / uCamZoom[1]),",
"						0.0, 1.0);",

"	vSoftness = aSoftness;",
"	vHole = aHole;",
"	vFill1 = aFill1;",
"	vFill2 = aFill2;",
"	vLightPosX = cos(aLightDirection * 3.14159265358979323846264338327950288419716939937510 / 180.0);",
"	vLightPosY = -sin(aLightDirection * 3.14159265358979323846264338327950288419716939937510 / 180.0);",

// from -1 to 1 (top left origin)
"	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);",
// from 0 to 1 (top left origin)
//"	vScreenPosition = vec2((1.0 + gl_Position[0]) / 2.0, (1.0 - gl_Position[1]) / 2.0);",

"	vLightStrength = aLightStrength;",

"	vColor = aColor;",
"}",
	""].join('\n');
	
	this.fragment_shader = ["",

"	precision highp	float;",


"varying	float	vSoftness;",
"varying	float	vHole;",
"varying	float	vFill1;",
"varying	float	vFill2;",
"varying	vec4	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",
"varying	float	vLightStrength;",
"varying	float	vLightPosX;",
"varying	float	vLightPosY;",

"void main()",
"{",
"	if (vPosition[1] < - (vFill2 - 0.5) * 2.0 || vPosition[1] > - (vFill1 - 0.5) * 2.0)",
"		discard;",
"	float dist_from_center = distance(vec2(vPosition[0], vPosition[1]) , vec2(0.0, 0.0));",
"	float dist_from_center2 = 1.0 - dist_from_center;",
"	if (dist_from_center > 1.0)",
"		discard;",
"	float dist_from_hole = abs(vHole - dist_from_center);",
"	float bevel = 1.0 - vLightStrength + ((2.0 - distance(vPosition, vec2(vLightPosX, vLightPosY))) / 2.0) * vLightStrength;",
"	float shade;",
"	if (dist_from_center < vHole)",
"	{",
"		shade = dist_from_center / vHole * vSoftness;",
"	}",
"	else",
"	{",
"		shade = 1.0 - (dist_from_hole / (1.0 - vHole)) * vSoftness;",
"	}",
"	gl_FragColor = vColor * vec4(bevel, bevel, bevel, shade);",
"}",
	""].join('\n');
	
	var	tmp_vertex_shader =	gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(tmp_vertex_shader, this.vertex_shader);
	gl.compileShader(tmp_vertex_shader);
	if (!gl.getShaderParameter(tmp_vertex_shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_vertex_shader));
	var	tmp_fragment_shader	= gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(tmp_fragment_shader, this.fragment_shader);
	gl.compileShader(tmp_fragment_shader);
	if (!gl.getShaderParameter(tmp_fragment_shader,	gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(tmp_fragment_shader));
	gl.attachShader(this.program, tmp_vertex_shader);
	gl.attachShader(this.program, tmp_fragment_shader);
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
		console.log(gl.getProgramInfoLog(this.program));
	gl.useProgram(this.program);
	this.program.aVertexPosition	= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aPosition		= gl.getAttribLocation(this.program, "aPosition");
	this.program.aRadius			= gl.getAttribLocation(this.program, "aRadius");
	this.program.aSoftness		= gl.getAttribLocation(this.program, "aSoftness");
	this.program.aHole			= gl.getAttribLocation(this.program, "aHole");
	this.program.aFill1			= gl.getAttribLocation(this.program, "aFill1");
	this.program.aFill2			= gl.getAttribLocation(this.program, "aFill2");
	this.program.aColor			= gl.getAttribLocation(this.program, "aColor");
	this.program.aLightStrength	= gl.getAttribLocation(this.program, "aLightStrength");
	this.program.aLightDirection	= gl.getAttribLocation(this.program, "aLightDirection");
	this.program.uCamPosition	= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom		= gl.getUniformLocation(this.program, "uCamZoom");

	gl.errorCheck('setup circles');
};

µ.WebGL_Circles.prototype.draw = function(cam_id, pos_x, pos_y, radius, softness, hole, fill1, fill2, color, light_strength, light_direction)
{
//	return;
	if (!this.vbuffer[cam_id])
		alert('draw_rectangle2: unknown cam: ' + cam_id);
	if (light_strength === undefined) light_strength = 0;
	if (light_direction === undefined) light_direction = 0;
	// four colors?
	var color1 = {};
	var color2 = {};
	var color3 = {};
	var color4 = {};
	if (color[0] && color[1] && color[2] && color[3])
	{
		color1.r = color[0].r;
		color1.g = color[0].g;
		color1.b = color[0].b;
		color1.a = color[0].a;
		color2.r = color[1].r;
		color2.g = color[1].g;
		color2.b = color[1].b;
		color2.a = color[1].a;
		color3.r = color[2].r;
		color3.g = color[2].g;
		color3.b = color[2].b;
		color3.a = color[2].a;
		color4.r = color[3].r;
		color4.g = color[3].g;
		color4.b = color[3].b;
		color4.a = color[3].a;
	}
	else
	{
		color1.r = color2.r = color3.r = color4.r = color.r;
		color1.g = color2.g = color3.g = color4.g = color.g;
		color1.b = color2.b = color3.b = color4.b = color.b;
		color1.a = color2.a = color3.a = color4.a = color.a;
	}
/*
console.log(
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color1.r, color1.g, color1.b, color1.a,
		color2.r, color2.g, color2.b, color2.a,
		color3.r, color3.g, color3.b, color3.a,
		color4.r, color4.g, color4.b, color4.a,
		light_strength, light_direction
		);
*/

	this.vbuffer[cam_id].push(
		-1, +1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color1.r, color1.g, color1.b, color1.a,
		light_strength, light_direction,
		+1, +1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color2.r, color2.g, color2.b, color2.a,
		light_strength, light_direction,
		+1, -1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color3.r, color3.g, color3.b, color3.a,
		light_strength, light_direction,
		-1, +1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color1.r, color1.g, color1.b, color1.a,
		light_strength, light_direction,
		+1, -1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color3.r, color3.g, color3.b, color3.a,
		light_strength, light_direction,
		-1, -1,
		pos_x, pos_y,
		radius,
		softness,
		hole,
		fill1, fill2,
		color4.r, color4.g, color4.b, color4.a,
		light_strength, light_direction
	);
}

µ.WebGL_Circles.prototype.flush_all = function()
{
	return;
	gl.useProgram(this.program);

	gl.enableVertexAttribArray(this.program.aVertexPosition);
	gl.enableVertexAttribArray(this.program.aPosition);
	gl.enableVertexAttribArray(this.program.aRadius);
	gl.enableVertexAttribArray(this.program.aSoftness);
	gl.enableVertexAttribArray(this.program.aHole);
	gl.enableVertexAttribArray(this.program.aFill1);
	gl.enableVertexAttribArray(this.program.aFill2);
	gl.enableVertexAttribArray(this.program.aColor);
	gl.enableVertexAttribArray(this.program.aLightStrength);
	gl.enableVertexAttribArray(this.program.aLightDirection);

	for (var camera_id = 0; camera_id < cameras.length; camera_id++)
	{
		this.flush(camera_id);
		this.vbuffer[camera_id] = [];
	}
	gl.disableVertexAttribArray(this.program.aVertexPosition);
	gl.disableVertexAttribArray(this.program.aPosition);
	gl.disableVertexAttribArray(this.program.aRadius);
	gl.disableVertexAttribArray(this.program.aSoftness);
	gl.disableVertexAttribArray(this.program.aHole);
	gl.disableVertexAttribArray(this.program.aFill1);
	gl.disableVertexAttribArray(this.program.aFill2);
	gl.disableVertexAttribArray(this.program.aColor);
	gl.disableVertexAttribArray(this.program.aLightStrength);
	gl.disableVertexAttribArray(this.program.aLightDirection);
}

µ.WebGL_Circles.prototype.flush = function(camera_id)
{
//	return;
//		console.log('flush', camera_id);

	if (this.vbuffer[camera_id].length == 0)
		return;

	//console.log('flush!', camera_id, this.vbuffer[camera_id].length);

	var camera = cameras[camera_id];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vbuffer[camera_id]), gl.STATIC_DRAW);

	gl.vertexAttribPointer(this.program.aVertexPosition,2, gl.FLOAT,	false,	60, 0);
	gl.vertexAttribPointer(this.program.aPosition,		2, gl.FLOAT,	false,	60, 8);
	gl.vertexAttribPointer(this.program.aRadius,		1, gl.FLOAT,	false,	60, 16);
	gl.vertexAttribPointer(this.program.aSoftness,		1, gl.FLOAT,	false,	60, 20);
	gl.vertexAttribPointer(this.program.aHole,			1, gl.FLOAT,	false,	60, 24);
	gl.vertexAttribPointer(this.program.aFill1,			1, gl.FLOAT,	false,	60, 28);
	gl.vertexAttribPointer(this.program.aFill2,			1, gl.FLOAT,	false,	60, 32);
	gl.vertexAttribPointer(this.program.aColor, 		4, gl.FLOAT,	false,	60, 36);
	gl.vertexAttribPointer(this.program.aLightStrength, 1, gl.FLOAT,	false,	60, 52);
	gl.vertexAttribPointer(this.program.aLightDirection,1, gl.FLOAT,	false,	60, 56);
/*
"varying	float	aLightStrength;",
"varying	float	aLightDirection;",
*/
	gl.uniform2fv(this.program.uCamPosition,	camera.pos);
	gl.uniform2fv(this.program.uCamZoom, 	camera.zoom);

	var	numItems = this.vbuffer[camera_id].length / 15;
	//console.log('flush!', camera_id, numItems, camera.pos_x,	camera.pos_y);
	gl.drawArrays(gl.TRIANGLES,	0, numItems);

};

