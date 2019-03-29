"use strict";

µ.WebGL_Tilemap_Occlusion = function(gl, cameras)
{
	this.vbuffer = [];
	for (var i in cameras)
	{
		this.vbuffer[i] = [];
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();
	this.vertex_shader = ["",
"attribute	vec2	aVertexPosition;",
"attribute	vec2	aPosition;",
"attribute	float	aColor;",

"uniform	vec2	uCamPosition;",
"uniform	vec2	uCamZoom;",
"uniform	int		uCamXOrigin;",
"uniform	int		uCamYOrigin;",
"uniform	float	uTilesizeX;",
"uniform	float	uTilesizeY;",

"varying	float	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",

"void main()",
"{",

"	vec2 pos = vec2(",
"					(aPosition[0] * 2.0 * uTilesizeX + uTilesizeX/1.0 - 1.0 - (uCamPosition[0] * 2.0 - 1.0)) / uCamZoom[0],",
"					(aPosition[1] * 2.0 * uTilesizeY + uTilesizeY/1.0 - 1.0 - (uCamPosition[1] * 2.0 - 1.0)) / uCamZoom[1]",
"					);",
"",
"	gl_Position = vec4(	(pos[0] + aVertexPosition[0] * uTilesizeX / uCamZoom[0]),",
"						(pos[1] + aVertexPosition[1] * uTilesizeY / uCamZoom[1]),",
"						0.0, 1.0);",

// from -1 to 1 (top left origin)
"	vPosition = vec2(aVertexPosition[0], - aVertexPosition[1]);",
// from 0 to 1 (top left origin)
//"	vScreenPosition = vec2((1.0 + gl_Position[0]) / 2.0, (1.0 - gl_Position[1]) / 2.0);",

"	vColor = aColor;",
"}",
	""].join('\n');
	this.fragment_shader = ["",

//"	precision highp	float;",
"	precision mediump	float;",

"varying	float	vColor;",
"varying	vec2	vPosition;",
//"varying	vec2	vScreenPosition;",

"void main()",
"{",
//"	gl_FragColor = vec4(0.0,0.0,0.0,(0.5 + cos(vColor*3.14159265358979323846264338327950288419716939937510)/2.0));",
"	gl_FragColor = vec4(0.0,0.0,0.0,1.0 - vColor * vColor);",
"}",
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
		console.log(gl.getShaderInfoLog(tmp_fragment_shader));
	gl.attachShader(this.program, tmp_vertex_shader);
	gl.attachShader(this.program, tmp_fragment_shader);
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
		console.log(gl.getProgramInfoLog(this.program));
	gl.useProgram(this.program);
	this.program.aVertexPosition	= gl.getAttribLocation(this.program, "aVertexPosition");
	this.program.aPosition		= gl.getAttribLocation(this.program, "aPosition");
	this.program.aColor			= gl.getAttribLocation(this.program, "aColor");
	this.program.uCamPosition	= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom		= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin		= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin		= gl.getUniformLocation(this.program, "uCamYOrigin");
	this.program.uTilesizeX		= gl.getUniformLocation(this.program, "uTilesizeX");
	this.program.uTilesizeY		= gl.getUniformLocation(this.program, "uTilesizeY");
	gl.errorCheck('setup tilemap_occlusion');

	this.draw = function(camera_id, array, size_x, size_y, start_x, start_y, end_x, end_y)
	{
		this.vbuffer[camera_id] = [];
		//console.log(array.length, size_x, size_y);

		var directions = [+size_x, -size_x, +1, -1];

		for (var pos_x = start_x; pos_x < end_x; pos_x++)
		{
			for (var pos_y = start_y; pos_y < end_y; pos_y++)
			{
				var i = pos_y * size_x + pos_x;

				//var pos_x = Math.floor(i % size_x);
				//var pos_y = Math.floor((i - pos_x) / size_y);
	
				var lum = array[i];
				
				/*
				var lum_top_left = (pos_x >= 1 && pos_y >= 1) ? (array[(pos_y + 1) * size_x + pos_x - 1]) : lum;
				var lum_top_right = (pos_x <= (size_x - 2) && pos_y >= 1) ? (array[(pos_y + 1) * size_x + pos_x + 1]) : lum;
				var lum_bottom_left = (pos_x >= 1 && pos_y <= (size_y -2)) ? (array[(pos_y - 1) * size_x + pos_x - 1]) : lum;
				var lum_bottom_right = (pos_x <= (size_x - 2) && pos_y <= (size_y -2)) ? (array[(pos_y - 1) * size_x + pos_x + 1]) : lum;
				*/
				var lum_corners = []
	
				for (k = 4; k--;)
				{
					if (i + directions[k] >= 1 &&	i + directions[k] < size_x * size_y - 1)
					{
						lum_corners.push(array[i + directions[k]]);
					}
					else
					{
						lum_corners.push(lum);
					}
				}
	                                                                              
				var lum_top_left		= Math.max(lum, lum_corners[0]/3, lum_corners[3]/3, Math.min(lum_corners[0], lum_corners[3]));
				var lum_top_right		= Math.max(lum, lum_corners[1]/3, lum_corners[3]/3, Math.min(lum_corners[1], lum_corners[3]));
				var lum_bottom_left		= Math.max(lum, lum_corners[0]/3, lum_corners[2]/3, Math.min(lum_corners[0], lum_corners[2]));
				var lum_bottom_right	= Math.max(lum, lum_corners[1]/3, lum_corners[2]/3, Math.min(lum_corners[1], lum_corners[2]));
				
				// 2 triangles
				if (1==2 || Math.max(lum_top_left, lum_top_right, lum_bottom_left, lum_bottom_right, lum) == 0)
				{
					this.vbuffer[camera_id].push(
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left,
						// + + top right
						1,
						1,
						pos_x, pos_y,
						lum_top_right,
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// - - bottom left
						-1,
						-1,
						pos_x, pos_y,
						lum_bottom_left,
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left
						);
				}
				// 4 triangles
/*
				else if (1 == 1)
				{
					this.vbuffer[camera_id].push(
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left,
						// + + top right
						1,
						1,
						pos_x, pos_y,
						lum_top_right,
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// - - bottom left
						-1,
						-1,
						pos_x, pos_y,
						lum_bottom_left,
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left
						);
				}
*/
				// 4 triangles
				else
				{
					this.vbuffer[camera_id].push(
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left,
						// + + top right
						1,
						1,
						pos_x, pos_y,
						lum_top_right,
						// + - middle
						0,
						0,
						pos_x, pos_y,
						lum,
			
						// + + top right
						1,
						1,
						pos_x, pos_y,
						lum_top_right,
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// + - middle
						0,
						0,
						pos_x, pos_y,
						lum,
			
						// + - bottom right
						1,
						-1,
						pos_x, pos_y,
						lum_bottom_right,
						// - - bottom left
						-1,
						-1,
						pos_x, pos_y,
						lum_bottom_left,
						// + - middle
						0,
						0,
						pos_x, pos_y,
						lum,
			
						// - - bottom left
						-1,
						-1,
						pos_x, pos_y,
						lum_bottom_left,
						// - + top left
						-1,
						1,
						pos_x, pos_y,
						lum_top_left,
						// + - middle
						0,
						0,
						pos_x, pos_y,
						lum
						);
				}
			}
		}


//		for (var i = 0; i < array.length; i++)
		{

		}

		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		gl.enableVertexAttribArray(this.program.aColor);

		var camera = cameras[camera_id];
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vbuffer[camera_id]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	20, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	20, 8);
		gl.vertexAttribPointer(this.program.aColor, 			1, gl.FLOAT,	false,	20, 16);
		
		gl.uniform1i(this.program.uYOrigin, 0);

		gl.uniform2fv(this.program.uCamPosition,	[camera.pos_x,	camera.pos_y]);
		gl.uniform2fv(this.program.uCamZoom, 		[camera.zoom_x,	camera.zoom_y]);
		gl.uniform1i(this.program.uYOrigin, 0);
		gl.uniform1i(this.program.uXOrigin, 0);
		
		gl.uniform1f(this.program.uTilesizeX, 1/(size_x));
		gl.uniform1f(this.program.uTilesizeY, 1/(size_y));
		
		var	numItems = this.vbuffer[camera_id].length / 5;
		// INVALID_OPERATION? orly?
		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aColor);

		this.vbuffer[camera_id] = [];
	};
	

}
