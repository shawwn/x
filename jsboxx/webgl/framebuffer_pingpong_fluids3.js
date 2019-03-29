"use strict";

µ.WebGL_Framebuffer_Pingpong_Fluids3 = function(c, gl, cameras, textures, texture_size, fragment_shader_fragment)
{

	this.c = c;
	this.texture_size = texture_size;

	this.framebuffer = gl.createFramebuffer();
	this.current_texture = c.empty_float_texture(texture_size);
	this.other_texture = c.empty_float_texture(texture_size);

	this.vertices_per_object = 6;
	this.attributes_per_object = 4;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.texture_step = 1 / texture_size;

	this.vbuffer = new Float32Array(this.magic_number);

	this.program = gl.createProgram();

	this.buffer = gl.createBuffer();

	this.vertex_shader = [
	"attribute	vec2		aVertexPosition;",
	"attribute	vec2		aTexPosition;",
	"attribute	vec2		aPosition;",
	"varying	highp vec2	vTexPosition;",
	"const vec2 madd = vec2(0.5,0.5);",

	"void main()",
	"{",
	"	gl_Position = vec4(	(aVertexPosition[0]),",
	"						(aVertexPosition[1]),",
	"						0.0, 1.0);",
	"	vTexPosition = aTexPosition;",
	"	vTexPosition = (aVertexPosition * madd) + madd;",
	"	vTexPosition[1] = 1.0 - vTexPosition[1];",
	"}",
	""].join('\n');

	this.fragment_shader = ["",
//	"precision	highp	float;",
"	precision mediump	float;",

	"uniform	float		uTextureStep;",
	"uniform	float		uTextureSize;",
	"uniform 	int 		uFlowDirection;",
	"uniform 	sampler2D 	uSamplerWater;",
	"uniform 	sampler2D 	uSamplerMap;",
	"varying	highp vec2	vTexPosition;",

(function () {/*

float uTextureStep2 = uTextureStep / 2.0;

void main()
{
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

(function () {/*
	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;

	vec2 tex_pos 			= vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, 				uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec2 tex_pos_left 		= vec2(uTextureStep2 + (pixel_x - 1.0) * uTextureStep * 1.0, 		uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec2 tex_pos_right 		= vec2(uTextureStep2 + (pixel_x + 1.0) * uTextureStep * 1.0, 		uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec2 tex_pos_up 		= vec2(uTextureStep2 + (pixel_x) * uTextureStep * 1.0, 				uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_down 		= vec2(uTextureStep2 + (pixel_x) * uTextureStep * 1.0, 				uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_left_up 	= vec2(uTextureStep2 + (pixel_x + 1.0) * uTextureStep * 1.0, 		uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_left_down 	= vec2(uTextureStep2 + (pixel_x + 1.0) * uTextureStep * 1.0, 		uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_right_up 	= vec2(uTextureStep2 + (pixel_x - 1.0) * uTextureStep * 1.0, 		uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_right_down = vec2(uTextureStep2 + (pixel_x - 1.0) * uTextureStep * 1.0, 		uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);

	vec2 tex_pos_side 		= vec2(uTextureStep2 + (pixel_x + float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec2 tex_pos_side_up 	= vec2(uTextureStep2 + (pixel_x + float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_side_down 	= vec2(uTextureStep2 + (pixel_x + float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);

	vec2 tex_pos_side2 		= vec2(uTextureStep2 + (pixel_x - float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec2 tex_pos_side2_up 	= vec2(uTextureStep2 + (pixel_x - float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
	vec2 tex_pos_side2_down = vec2(uTextureStep2 + (pixel_x - float(uFlowDirection)) * uTextureStep * 1.0, 	uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);

	vec4 texMap = texture2D(uSamplerMap, tex_pos);
	vec4 texMap_down = texture2D(uSamplerMap, tex_pos_down);
	vec4 texMap_side = texture2D(uSamplerMap, tex_pos_side);
	vec4 texMap_side_down = texture2D(uSamplerMap, tex_pos_side_down);
	vec4 texMap_side2_down = texture2D(uSamplerMap, tex_pos_side2_down);

	vec4 texWater = texture2D(uSamplerWater, tex_pos);
	vec4 texWater_up = texture2D(uSamplerWater, tex_pos_up);
	vec4 texWater_down = texture2D(uSamplerWater, tex_pos_down);
	vec4 texWater_side = texture2D(uSamplerWater, tex_pos_side);
	vec4 texWater_side2 = texture2D(uSamplerWater, tex_pos_side2);
	vec4 texWater_side_down = texture2D(uSamplerWater, tex_pos_side_down);
	vec4 texWater_side2_down = texture2D(uSamplerWater, tex_pos_side2_down);
	

	if (texMap[0] == 0.0)
	{
		// water here, free below? -> delete water here
		if (texWater[0] == 1.0 && texMap_down[0] == 0.0 && texWater_down[0] == 0.0)
		{
			texWater[0] = 0.0;
		}
		// water above, no water here? -> put water here
		else if (texWater[0] == 0.0 && texWater_up[0] == 1.0)
		{
			texWater[0] = 1.0;
		}
		// water here, not free below, free to the side ? -> remove water
		else if (
					texWater[0] == 1.0 && (texWater_down[0] == 1.0 || texMap_down[0] == 1.0)
				&&
					texWater_side[0] == 0.0 && texMap_side[0] == 0.0
//				&&
//					texWater_side_down[0] == 0.0 && texMap_side_down[0] == 0.0
			)
		{
			texWater[0] = 0.0;
		}
		// no water here, free below, water to the side ? -> put water here
		else if (
				texWater[0] == 0.0 && texWater_down[0] == 0.0 && texMap_down[0] == 0.0
				&&
					texWater_side2[0] == 1.0
//				&&
//					(texWater_side2_down[0] == 1.0 || texMap_side2_down[0] == 1.0)
			)
		{
			texWater[0] = 1.0;
		}
		
		// water here

	}
	else
	{
		texWater[0] = 0.0;
	}


	texWater[0] = max(0.0, texWater[0]);
	texWater[1] = max(0.0, texWater[1]);
	texWater[2] = max(0.0, texWater[2]);
	texWater[3] = max(0.0, texWater[3]);


	gl_FragColor = texWater;

	gl_FragColor[3] = 1.0;
}


*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

(function () {/*

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



	this.program.uFlowDirection		= gl.getUniformLocation(this.program, "uFlowDirection");
	this.program.uSamplerWater		= gl.getUniformLocation(this.program, "uSamplerWater");
	this.program.uSamplerMap 		= gl.getUniformLocation(this.program, "uSamplerMap");

	this.program.uTextureStep		= gl.getUniformLocation(this.program, "uTextureStep");
	this.program.uTextureSize		= gl.getUniformLocation(this.program, "uTextureSize");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");

	gl.errorCheck('setup framebuffer_pingpong');

	this.setup_vbuffer = function()
	{

		var
			pos_x = 0.5,
			pos_y = 0.5,
			width = 1.0,
			height = 1.0,
			inc = 0;

		// - + top left
		this.vbuffer[inc] = -width;		inc++;
		this.vbuffer[inc] = +height;	inc++;
		this.vbuffer[inc] = 1;			inc++;
		this.vbuffer[inc] = 1;			inc++;

		// + + top right
		this.vbuffer[inc] = +width;		inc++;
		this.vbuffer[inc] = +height;	inc++;
		this.vbuffer[inc] = 0;			inc++;
		this.vbuffer[inc] = 1;			inc++;

		// + - bottom right
		this.vbuffer[inc] = +width;		inc++;
		this.vbuffer[inc] = -height;	inc++;
		this.vbuffer[inc] = 0;			inc++;
		this.vbuffer[inc] = 0;			inc++;

		// - + top left
		this.vbuffer[inc] = -width;		inc++;
		this.vbuffer[inc] = +height;	inc++;
		this.vbuffer[inc] = 1;			inc++;
		this.vbuffer[inc] = 1;			inc++;

		// + - bottom right
		this.vbuffer[inc] = +width;		inc++;
		this.vbuffer[inc] = -height;	inc++;
		this.vbuffer[inc] = 0;			inc++;
		this.vbuffer[inc] = 0;			inc++;

		// - - bottom left
		this.vbuffer[inc] = -width;		inc++;
		this.vbuffer[inc] = -height;	inc++;
		this.vbuffer[inc] = 1;			inc++;
		this.vbuffer[inc] = 0;			inc++;

	};

	this.process_steps = function(step_count, map_texture_id)
	{
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vbuffer, gl.STATIC_DRAW);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.viewport(0, 0, this.texture_size, this.texture_size);
		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	16, 0);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	16, 8);
		gl.uniform1f(this.program.uTextureStep, 	this.texture_step);
		gl.uniform1f(this.program.uTextureSize, 	this.texture_size);
		for (var i = 0; i < step_count; i++)
		{
			for (var flow_direction = 0; flow_direction < 2; flow_direction++)
			{
				gl.uniform1i(this.program.uFlowDirection, 	flow_direction ? -1 : +1);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[this.other_texture], 0);

				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textures[this.current_texture]);
				gl.uniform1i(this.program.uSamplerWater, 0);

				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, textures[map_texture_id]);
				gl.uniform1i(this.program.uSamplerMap, 1);

				gl.drawArrays(gl.TRIANGLES,	0, this.vertices_per_object);

				var temp = this.other_texture;
				this.other_texture = this.current_texture;
				this.current_texture = temp;
			}
		}
		gl.viewport(0, 0, this.c.canvas.width, this.c.canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
	};

	this.setup_vbuffer();

	this.set_data = function(array)
	{
		this.c.update_texture_from_array(array, this.texture_size, this.current_texture);
		//this.c.update_texture_from_array(array, this.texture_size, this.other_texture);
	}

	this.set_data_subimage = function(array, start_x, start_y, size_x, size_y)
	{
		//console.log(array, start_x, start_y, size_x, size_y)	;
		this.c.update_texture_subimage_from_array(array, this.texture_size, this.current_texture, start_x, start_y, size_x, size_y);
		//this.c.update_texture_subimage_from_array(array, this.texture_size, this.other_texture, start_x, start_y, size_x, size_y);
	}
	this.get_data = function(array, start_x, start_y, size_x, size_y)
	{
		var start_x = start_x || 0;
		var start_y = start_y || 0;
		var size_x = size_x || this.texture_size;
		var size_y = size_y || this.texture_size;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[this.current_texture], 0);
		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE)
		{
		  gl.readPixels(start_x, start_y, size_x, size_y, gl.RGBA, gl.FLOAT, array);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
}