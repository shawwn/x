"use strict";

µ.WebGL_Framebuffer_Pingpong_Fluids2 = function(c, gl, cameras, textures, texture_size, fragment_shader_fragment)
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

const int channel = 0;
const int ch_water_capacity = 0;
const int ch_water_speed = 1;

float uTextureStep2 = uTextureStep / 2.0;

float flow(vec4 texWater, vec4 texMap, float pixel_x, float pixel_y, float direction_x, float direction_y, float slow, float slow2)
{
	vec2 tex_pos = vec2(0, 0);
	vec4 texWater_neighbour = vec4(0, 0, 0, 0);
	vec4 texMap_neighbour = vec4(0, 0, 0, 0);
	float neighbour1_pixel_x = pixel_x + direction_x;
	float neighbour1_pixel_y = pixel_y + direction_y;
	float neighbour2_pixel_x = pixel_x - direction_x;
	float neighbour2_pixel_y = pixel_y - direction_y;
	float diff = 0.0;
	float flow = 0.0;
	if (
			neighbour1_pixel_x >= 0.0
		&& 	neighbour1_pixel_x < uTextureSize
		&&	neighbour1_pixel_y >= 0.0
		&& 	neighbour1_pixel_y < uTextureSize
		)
	{
		tex_pos = vec2(uTextureStep2 + neighbour1_pixel_x * uTextureStep, uTextureStep2 + neighbour1_pixel_y * uTextureStep);
		texWater_neighbour = texture2D(uSamplerWater, tex_pos);
		texMap_neighbour = texture2D(uSamplerMap, tex_pos);

		if (texMap_neighbour[ch_water_capacity] == 0.0)
		{
			diff = (0.00000000000000000 + texWater_neighbour[channel]) - (0.00000000000000000 + texWater[channel]);
			// if neighbour is higher
			//if (diff > 0.0)
			{
				//flow += min(diff * slow, texWater_neighbour[channel]);
				flow += min(ceil(max(diff, 0.0)), 1.0) * min(diff * slow, texWater_neighbour[channel]);
			}
		}
	}
	if (
			neighbour2_pixel_x >= 0.0
		&& 	neighbour2_pixel_x < uTextureSize
		&&	neighbour2_pixel_y >= 0.0
		&& 	neighbour2_pixel_y < uTextureSize
		)
	{
		tex_pos = vec2(uTextureStep2 + neighbour2_pixel_x * uTextureStep, uTextureStep2 + neighbour2_pixel_y * uTextureStep);
		texWater_neighbour = texture2D(uSamplerWater, tex_pos);
		texMap_neighbour = texture2D(uSamplerMap, tex_pos);

		if (texMap_neighbour[ch_water_capacity] == 0.0)
		{
			diff = (0.00000000000000000 + texWater_neighbour[channel]) - (0.00000000000000000 + texWater[channel]);
			// if neighbour lower
			//if (diff < 0.0)
			{
				//flow -= min(- diff * slow2, texWater[channel]);
				flow -= -1.0 * max(floor(min(diff, 0.0)), -1.0) * min(- diff * slow2, texWater[channel]);
			}
		}
	}
	return texWater[channel] + flow;

}

void main()
{
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

(function () {/*
	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;
	vec2 tex_pos = vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0);
	vec4 texWater = texture2D(uSamplerWater, tex_pos);
	vec4 texMap = texture2D(uSamplerMap, tex_pos);
	float direction_x = 0.0;
	float direction_y = 0.0;
	float slow = 2.0;
	float slow2 = 2.0;

	if (texMap[ch_water_capacity] == 0.0)
	{
		if (uFlowDirection == 0)
		{
			direction_y = -1.0;
			slow = 0.5;
			slow2 = 0.5;
		}
		if (uFlowDirection == 1)
		{
			direction_x = 1.0;
			slow = 0.5;
			slow2 = 0.5;
		}
		if (uFlowDirection == 2)
		{
			direction_x = -1.0;
			slow = 0.5;
			slow2 = 0.5;
		}
		if (uFlowDirection == 3)
		{
			direction_y = 1.0;
			slow = 0.5;
			slow2 = 0.5;
		}
		texWater[channel] = flow(texWater, texMap, pixel_x, pixel_y, direction_x, direction_y, slow, slow2);
	}
	
	texWater[0] -= 0.0000000000000001;


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
			for (var flow_direction = 0; flow_direction < 4; flow_direction++)
			{
				gl.uniform1i(this.program.uFlowDirection, 	flow_direction);
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