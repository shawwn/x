"use strict";

µ.WebGL_Framebuffer_Pingpong = function(c, gl, cameras, textures, texture_size)
{
	this.grab_buffer_plz = null;

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

	if (rvr.debug__scent_benchmark)
	{
		console.log('corner_penalty', 0.0, 'decay', 0.985, 'self_factor', 10.0);
	}

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

//	"	precision highp	float;",
"	precision mediump	float;",

	"uniform	float		uMaxStepHeightDown;",
	"uniform	float		uMaxStepHeightUp;",

	"uniform	float		uTextureStep;",
	"uniform	float		uTextureSize;",

	"uniform	vec3		uSelfFactor;",
	"uniform	vec3		uCornerPenalty;",
	"uniform	vec3		uFalloffAboveOne;",
	"uniform	vec3		uFalloffBelowOne;",
	"uniform	vec3		uDecayAboveOne;",
	"uniform	vec3		uDecayBelowOne;",

	"uniform 	sampler2D 	uSampler;",
	"uniform 	sampler2D 	uSamplerDepthmap;",
	"uniform 	sampler2D 	uSamplerWallmap;",
	"varying	highp vec2	vTexPosition;",

(function () {/*

void main()
{
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

(function () {/*
	float uTextureStep2 = uTextureStep / 2.0;
	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;

	vec2 tex_pos = vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0);

	vec4 texColor = texture2D(uSampler, tex_pos);
	vec4 texDepth = texture2D(uSamplerDepthmap, tex_pos);
	vec4 texWall = texture2D(uSamplerWallmap, tex_pos);

	vec4 texColor_neighbours = vec4(0, 0, 0, 0);

	vec4 texColor_neighbour = vec4(0, 0, 0, 0);
	vec4 texDepth_neighbour = vec4(0, 0, 0, 0);
	vec4 texWall_neighbour = vec4(0, 0, 0, 0);
	
	float neighbours1 = 0.0 + 4.0 * uSelfFactor[0];
	float neighbours2 = 0.0 + 4.0 * uSelfFactor[1];
	float neighbours3 = 0.0 + 4.0 * uSelfFactor[2];

	//float max_step_height_down = 0.05;
	//float max_step_height_up = 1.1;

	if (texWall[3] <= 0.0)
	{
		if (pixel_x > 0.0)
		{
			tex_pos = vec2(uTextureStep2 + (pixel_x - 1.0) * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0);
			texDepth_neighbour = texture2D(uSamplerDepthmap, tex_pos);
			texWall_neighbour = texture2D(uSamplerWallmap, tex_pos);
			if (
					texWall_neighbour[3] == 0.0
				&&	texDepth_neighbour[0] >= (texDepth[0] - uMaxStepHeightUp)
				&& 	texDepth_neighbour[0] <= (texDepth[0] + uMaxStepHeightDown)
				)
			{
				texColor_neighbour = texture2D(uSampler, vec2(uTextureStep2 + (pixel_x - 1.0) * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0));
				texColor_neighbours[0] += max(texColor_neighbour[0], texColor[0]) * uSelfFactor[0];
				texColor_neighbours[1] += max(texColor_neighbour[1], texColor[1]) * uSelfFactor[1];
				texColor_neighbours[2] += max(texColor_neighbour[2], texColor[2]) * uSelfFactor[2];
				texColor_neighbours[0] += texColor_neighbour[0];
				texColor_neighbours[1] += texColor_neighbour[1];
				texColor_neighbours[2] += texColor_neighbour[2];
				neighbours1 += 1.0;
				neighbours2 += 1.0;
				neighbours3 += 1.0;
			}
			else
			{
				neighbours1 += uCornerPenalty[0];
				neighbours2 += uCornerPenalty[1];
				neighbours3 += uCornerPenalty[2];
			}
		}
		if (pixel_x < (uTextureSize - 1.0))
		{
			tex_pos = vec2(uTextureStep2 + (pixel_x + 1.0) * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0);
			texDepth_neighbour = texture2D(uSamplerDepthmap, tex_pos);
			texWall_neighbour = texture2D(uSamplerWallmap, tex_pos);
			if (
					texWall_neighbour[3] == 0.0
				&&	texDepth_neighbour[0] >= (texDepth[0] - uMaxStepHeightUp)
				&& 	texDepth_neighbour[0] <= (texDepth[0] + uMaxStepHeightDown)
				)
			{
				texColor_neighbour = texture2D(uSampler, vec2(uTextureStep2 + (pixel_x + 1.0) * uTextureStep * 1.0, uTextureStep2 + pixel_y * uTextureStep * 1.0));
				texColor_neighbours[0] += max(texColor_neighbour[0], texColor[0]) * uSelfFactor[0];
				texColor_neighbours[1] += max(texColor_neighbour[1], texColor[1]) * uSelfFactor[1];
				texColor_neighbours[2] += max(texColor_neighbour[2], texColor[2]) * uSelfFactor[2];
				texColor_neighbours[0] += texColor_neighbour[0];
				texColor_neighbours[1] += texColor_neighbour[1];
				texColor_neighbours[2] += texColor_neighbour[2];
				neighbours1 += 1.0;
				neighbours2 += 1.0;
				neighbours3 += 1.0;
			}
			else
			{
				neighbours1 += uCornerPenalty[0];
				neighbours2 += uCornerPenalty[1];
				neighbours3 += uCornerPenalty[2];
			}
		}

		if (pixel_y > 0.0)
		{
			tex_pos = vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0);
			texDepth_neighbour = texture2D(uSamplerDepthmap, tex_pos);
			texWall_neighbour = texture2D(uSamplerWallmap, tex_pos);
			if (
					texWall_neighbour[3] == 0.0
				&&	texDepth_neighbour[0] >= (texDepth[0] - uMaxStepHeightUp)
				&& 	texDepth_neighbour[0] <= (texDepth[0] + uMaxStepHeightDown)
				)
			{
				texColor_neighbour = texture2D(uSampler, vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + (pixel_y - 1.0) * uTextureStep * 1.0));
				texColor_neighbours[0] += max(texColor_neighbour[0], texColor[0]) * uSelfFactor[0];
				texColor_neighbours[1] += max(texColor_neighbour[1], texColor[1]) * uSelfFactor[1];
				texColor_neighbours[2] += max(texColor_neighbour[2], texColor[2]) * uSelfFactor[2];
				texColor_neighbours[0] += texColor_neighbour[0];
				texColor_neighbours[1] += texColor_neighbour[1];
				texColor_neighbours[2] += texColor_neighbour[2];
				neighbours1 += 1.0;
				neighbours2 += 1.0;
				neighbours3 += 1.0;
			}
			else
			{
				neighbours1 += uCornerPenalty[0];
				neighbours2 += uCornerPenalty[1];
				neighbours3 += uCornerPenalty[2];
			}
		}
		if (pixel_y < (uTextureSize - 1.0))
		{
			tex_pos = vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0);
			texDepth_neighbour = texture2D(uSamplerDepthmap, tex_pos);
			texWall_neighbour = texture2D(uSamplerWallmap, tex_pos);
			if (
					texWall_neighbour[3] == 0.0
				&&	texDepth_neighbour[0] >= (texDepth[0] - uMaxStepHeightUp)
				&& 	texDepth_neighbour[0] <= (texDepth[0] + uMaxStepHeightDown)
				)
			{
				texColor_neighbour = texture2D(uSampler, vec2(uTextureStep2 + pixel_x * uTextureStep * 1.0, uTextureStep2 + (pixel_y + 1.0) * uTextureStep * 1.0));
				texColor_neighbours[0] += max(texColor_neighbour[0], texColor[0]) * uSelfFactor[0];
				texColor_neighbours[1] += max(texColor_neighbour[1], texColor[1]) * uSelfFactor[1];
				texColor_neighbours[2] += max(texColor_neighbour[2], texColor[2]) * uSelfFactor[2];
				texColor_neighbours[0] += texColor_neighbour[0];
				texColor_neighbours[1] += texColor_neighbour[1];
				texColor_neighbours[2] += texColor_neighbour[2];
				neighbours1 += 1.0;
				neighbours2 += 1.0;
				neighbours3 += 1.0;
			}
			else
			{
				neighbours1 += uCornerPenalty[0];
				neighbours2 += uCornerPenalty[1];
				neighbours3 += uCornerPenalty[2];
			}
		}

		float weight_center = 1.0;
		float weight_neighbour = 1.0;

		texColor[0] = (texColor[0] * weight_center + (texColor_neighbours[0] * weight_neighbour)) / (weight_center + neighbours1 * weight_neighbour);
		texColor[1] = (texColor[1] * weight_center + (texColor_neighbours[1] * weight_neighbour)) / (weight_center + neighbours2 * weight_neighbour);
		texColor[2] = (texColor[2] * weight_center + (texColor_neighbours[2] * weight_neighbour)) / (weight_center + neighbours3 * weight_neighbour);

// 0 player
// 1 sound
// 2 enemy

		texColor[0] *= texColor[0] > 1.0 ? uFalloffAboveOne[0] : uFalloffBelowOne[0];
		texColor[1] *= texColor[1] > 1.0 ? uFalloffAboveOne[1] : uFalloffBelowOne[1];
		texColor[2] *= texColor[2] > 1.0 ? uFalloffAboveOne[2] : uFalloffBelowOne[2];

		texColor[0] -= texColor[0] > 1.0 ? uDecayAboveOne[0] : uDecayBelowOne[0];
		texColor[1] -= texColor[1] > 1.0 ? uDecayAboveOne[1] : uDecayBelowOne[1];
		texColor[2] -= texColor[2] > 1.0 ? uDecayAboveOne[2] : uDecayBelowOne[2];

		gl_FragColor = texColor;
		if (gl_FragColor[0] < 0.0) gl_FragColor[0] = 0.0;
		if (gl_FragColor[1] < 0.0) gl_FragColor[1] = 0.0;
		if (gl_FragColor[2] < 0.0) gl_FragColor[2] = 0.0;

		gl_FragColor[3] = 1.0;
	}
	else
	{
		gl_FragColor[0] = 0.0;
		gl_FragColor[1] = 0.0;
		gl_FragColor[2] = 0.0;
		gl_FragColor[3] = 0.0;
	}
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

	this.program.uMaxStepHeightUp	= gl.getUniformLocation(this.program, "uMaxStepHeightUp");
	this.program.uMaxStepHeightDown	= gl.getUniformLocation(this.program, "uMaxStepHeightDown");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");
	this.program.uSamplerDepthmap	= gl.getUniformLocation(this.program, "uSamplerDepthmap");
	this.program.uSamplerWallmap	= gl.getUniformLocation(this.program, "uSamplerWallmap");
	this.program.uTextureStep		= gl.getUniformLocation(this.program, "uTextureStep");
	this.program.uTextureSize		= gl.getUniformLocation(this.program, "uTextureSize");

	this.program.uSelfFactor		= gl.getUniformLocation(this.program, "uSelfFactor");
	this.program.uCornerPenalty		= gl.getUniformLocation(this.program, "uCornerPenalty");
	this.program.uFalloffAboveOne	= gl.getUniformLocation(this.program, "uFalloffAboveOne");
	this.program.uFalloffBelowOne	= gl.getUniformLocation(this.program, "uFalloffBelowOne");
	this.program.uDecayAboveOne		= gl.getUniformLocation(this.program, "uDecayAboveOne");
	this.program.uDecayBelowOne		= gl.getUniformLocation(this.program, "uDecayBelowOne");

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

	this.process_steps = function(step_count, depthmap_texture_id, wallmap_texture_id, target_buffer)
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

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[depthmap_texture_id]);
		gl.uniform1i(this.program.uSamplerDepthmap, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, textures[wallmap_texture_id]);
		gl.uniform1i(this.program.uSamplerWallmap, 2);

		for (var i = 0; i < step_count; i++)
		{

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[this.other_texture], 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textures[this.current_texture]);
			gl.uniform1i(this.program.uSampler, 0);

			gl.drawArrays(gl.TRIANGLES,	0, this.vertices_per_object);

			var temp = this.other_texture;
			this.other_texture = this.current_texture;
			this.current_texture = temp;
		}

		// let's do this at the start of the NEXT callback
		this.grab_buffer_plz = target_buffer;

		//if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE && target_buffer)
		{
//		  gl.readPixels(0, 0, this.texture_size, this.texture_size, gl.RGBA, gl.FLOAT, target_buffer);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, this.c.canvas.width, this.c.canvas.height);

		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);

	};

	this.setup_vbuffer();

	this.set_parameters = function(
		MaxStepHeightUp, MaxStepHeightDown,
		SelfFactor1, CornerPenalty1, FalloffAboveOne1, FalloffBelowOne1, DecayAboveOne1, DecayBelowOne1,
		SelfFactor2, CornerPenalty2, FalloffAboveOne2, FalloffBelowOne2, DecayAboveOne2, DecayBelowOne2,
		SelfFactor3, CornerPenalty3, FalloffAboveOne3, FalloffBelowOne3, DecayAboveOne3, DecayBelowOne3
		)
	{
		gl.useProgram(this.program);
		
		gl.uniform1f(this.program.uMaxStepHeightUp, MaxStepHeightUp);
		gl.uniform1f(this.program.uMaxStepHeightDown, MaxStepHeightDown);

		gl.uniform3f(this.program.uSelfFactor, 		SelfFactor1, SelfFactor2, SelfFactor3);
		gl.uniform3f(this.program.uCornerPenalty, 	CornerPenalty1, CornerPenalty2, CornerPenalty3);
		gl.uniform3f(this.program.uFalloffAboveOne, FalloffAboveOne1, FalloffAboveOne2, FalloffAboveOne3);
		gl.uniform3f(this.program.uFalloffBelowOne, FalloffBelowOne1, FalloffBelowOne2, FalloffBelowOne3);
		gl.uniform3f(this.program.uDecayAboveOne, 	DecayAboveOne1, DecayAboveOne2, DecayAboveOne3);
		gl.uniform3f(this.program.uDecayBelowOne, 	DecayBelowOne1, DecayBelowOne2, DecayBelowOne3);
	}

	this.grab_buffer_maybe = function()
	{
		if (this.grab_buffer_plz != null)
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
			//if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE)
			{
				gl.readPixels(0, 0, this.texture_size, this.texture_size, gl.RGBA, gl.FLOAT, this.grab_buffer_plz);
			}
			//else
			{
				//console.log('schockschwerenot');
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.grab_buffer_plz = null;
		}
	}

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
	//this.get_data();
}
