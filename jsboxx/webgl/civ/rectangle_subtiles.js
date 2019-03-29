"use strict";

µ.WebGL_Rectangle_Subtiles = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 12;
	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = {};
	this.buffer_counter = {};
	this.buffer_max = {};

	this.tile_count = [0, 0];
	this.subtile_count = [0, 0];

	this.cameras = cameras;

	for (var i in cameras)
	{
		this.vbuffer[i] = [];
		this.buffer_counter[i] = [];
		this.buffer_max[i] = [];
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = ["",
	"attribute	vec2		aVertexPosition;",
	"attribute	vec2		aTexPosition;",
	"attribute	vec2		aPosition;",
	"attribute	vec4		aColor;",

	"uniform	vec2		uCamPosition;",
	"uniform	vec2		uCamZoom;",
	"uniform	int			uCamXOrigin;",
	"uniform	int			uCamYOrigin;",

	"varying	vec4		vColor;",
	"varying	highp vec2		vPosition;",
	"varying	highp vec2	vTexPosition;",

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
	"	vColor = aColor;",
	"}",
	""].join('\n');

	this.fragment_shader = ["",

//	"	precision highp	float;",
"	precision mediump	float;",

	"varying	vec4		vColor;",
	"varying	highp vec2		vPosition;",
	"varying	highp vec2	vTexPosition;",

	"uniform 	sampler2D 	uSampler;",
	"uniform 	vec2 		uTileCount;",
	"uniform 	vec2 		uSubtileCount;",

"int BUILDING_TYPE_NONE 			= " + civ.BUILDING_TYPE__NONE 				+ ";",
"int BUILDING_TYPE_COLONY 			= " + civ.BUILDING_TYPE__COLONY 			+ ";",
"int BUILDING_TYPE_FARM 			= " + civ.BUILDING_TYPE__FARM 				+ ";",
"int BUILDING_TYPE_NATURAL_RESERVE = " + civ.BUILDING_TYPE__NATURAL_RESERVE 	+ ";",
"int BUILDING_TYPE_STONE_WALL 		= " + civ.BUILDING_TYPE__STONE_WALL 		+ ";",


	bxx_shader_includes.colors + "\n",
	bxx_shader_includes.noise3D + "\n",

(function () {/*

void main()
{

	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;

	float subtiles_x = uSubtileCount[0];
	float subtiles_y = uSubtileCount[1];
	float subtile_size_x = 1.0 / subtiles_x;
	float subtile_size_y = 1.0 / subtiles_y;

	float in_subtile_pos_x = mod(vTexPosition[0], subtile_size_x) * subtiles_x;
	float in_subtile_pos_y = mod(vTexPosition[1], subtile_size_y) * subtiles_y;

	float distance_from_subtile_border = 1.0 - 2.0 * max(abs(in_subtile_pos_x - 0.5), abs(in_subtile_pos_y - 0.5));

	float distance_from_subtile_border_x = 1.0 - 2.0 * abs(in_subtile_pos_x - 0.5);
	float distance_from_subtile_border_y = 1.0 - 2.0 * abs(in_subtile_pos_y - 0.5);

	vec4 texColor = texture2D(uSampler, vec2(vTexPosition[0], vTexPosition[1]));

	float harvestable1 = texColor[0];
	float building_type = texColor[1];
	float building_build_type = texColor[2];
	float building_build_progress = texColor[3];

	float layer1 = 0.0;
	layer1 += snoise_clamp(vec3(
				vTexPosition[0] * 13.25 * subtiles_x,
				vTexPosition[1] * 13.25 * subtiles_y,
				0.5 * harvestable1
				)) * 0.67;
	layer1 += snoise_clamp(vec3(
				vTexPosition[0] * 35.0 * subtiles_x,
				vTexPosition[1] * 35.0 * subtiles_y,
				2.5 * harvestable1
				)) * 0.33;

	float layer2 = 0.0;
	layer2 += snoise_clamp(vec3(
				(vTexPosition[0] + 1.75) * 7.715 * subtiles_x,
				(vTexPosition[1] + 1.75) * 7.715 * subtiles_y,
				2.5 + 0.25 * harvestable1
				)) * 1.0;


	float b_layer1 = 0.0;
	b_layer1 += snoise_clamp(vec3(
				vTexPosition[0] * 13.25 * subtiles_x,
				vTexPosition[1] * 13.25 * subtiles_y,
				0.5 * building_build_progress
				)) * 0.67;
	b_layer1 += snoise_clamp(vec3(
				vTexPosition[0] * 35.0 * subtiles_x,
				vTexPosition[1] * 35.0 * subtiles_y,
				2.5 * building_build_progress
				)) * 0.33;

	float b_layer2 = 0.0;
	b_layer2 += snoise_clamp(vec3(
				(vTexPosition[0] + 1.75) * 7.715 * subtiles_x,
				(vTexPosition[1] + 1.75) * 7.715 * subtiles_y,
				2.5 + 0.25 * building_build_progress
				)) * 1.0;

	texColor[0] = 0.0;
	texColor[1] = 0.0;
	texColor[2] = 0.0;
	texColor[3] = 0.0;

	//texColor[0] = blend_B * 2.0;
	//texColor[1] = blend_L * 2.0;
	//texColor[2] = 0.0;

	float harvestable = (layer1 + (0.00 - 0.25 * distance_from_subtile_border)) < (harvestable1 * 1.3) && layer2 < 0.5 ? (1.0) : 0.0;


	texColor[3] = 0.0 + 0.15 * harvestable;

	int building_type_int = int(building_type * 255.0);
	int building_build_type_int = int(building_build_type * 255.0);

	if (building_build_type_int == BUILDING_TYPE_COLONY)
	{
		float build_progress = (b_layer2 + (0.00 - 0.05 * distance_from_subtile_border)) < (building_build_progress * 1.3) && b_layer1 < 0.5 ? (1.0) : 0.0;
		texColor[0] = 1.0 - 0.75 * build_progress;
		texColor[1] = 1.0;
		texColor[2] = 0.0 + 0.25 * build_progress;
		texColor[3] = 1.0;
	}
	else if (building_build_type_int == BUILDING_TYPE_FARM)
	{
		float build_progress = (b_layer2 + (0.00 - 0.05 * distance_from_subtile_border)) < (building_build_progress * 1.3) && b_layer1 < 0.5 ? (1.0) : 0.0;
		texColor[0] = 1.0;
		texColor[1] = 0.0;
		texColor[2] = 0.0 + 0.75 * build_progress;
		texColor[3] = 1.0;
	}
	else if (building_build_type_int == BUILDING_TYPE_NATURAL_RESERVE)
	{
		float build_progress = (b_layer2 + (0.00 - 0.05 * distance_from_subtile_border)) < (building_build_progress * 1.3) && b_layer1 < 0.5 ? (1.0) : 0.0;
		texColor[0] = 0.0;
		texColor[1] = 1.0;
		texColor[2] = 0.0 + 0.75 * build_progress;
		texColor[3] = 1.0;
	}
	else if (building_type_int == BUILDING_TYPE_COLONY)
	{
		float pattern = snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 27.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 27.715 * subtiles_y,
					2.5
					)) * 1.0;

		float pattern2 = snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 14.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 13.715 * subtiles_y,
					2.5
					)) * 1.0;

		texColor[0] = 0.0;
		texColor[1] = 0.0 + pattern;
		texColor[2] = 1.0;
		texColor[3] = floor(pattern2 * 2.0);
	}
	else if (building_type_int == BUILDING_TYPE_FARM)
	{
		float pattern = 0.0;
		pattern += snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 1.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 3.715 * subtiles_y,
					2.5
					)) * 1.0;
		texColor[0] = 0.0;
		texColor[1] = 0.5 + 0.5 * pattern;
		texColor[2] = 0.0;
	
		float pattern_alpha = (0.4 + sin(4.0 * vTexPosition[1]) * 0.4)
			+ 0.5 * snoise_clamp(
							vec3(
									(vTexPosition[0] + 1.75) * 0.715 * subtiles_x,
									(vTexPosition[1] + 1.75) * 27.715 * subtiles_y,
									2.5
								)
					);

		texColor[3] = pattern_alpha;
	}
	else if (building_type_int == BUILDING_TYPE_NATURAL_RESERVE)
	{
		float pattern = snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 1.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 2.715 * subtiles_y,
					2.5
					)) * 1.0;

		float pattern2 = snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 1.312315 * subtiles_x,
					(vTexPosition[1] + 1.75) * 2.123715 * subtiles_y,
					2.5
					)) * 1.0;

		texColor[0] = 0.0;
		texColor[1] = 1.0 - pattern;
		texColor[2] = 0.5 + 0.5 * pattern;
	
		float pattern_alpha = (0.5 + sin(13.0 * vTexPosition[1]) * 0.5)
			* snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 3.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 5.715 * subtiles_y,
					2.5
					));

		texColor[3] = 0.2 + 0.8 * pattern_alpha * floor(pattern2 * 2.0);
		if (pattern2 > 0.5 && pattern2 < 0.55)
		{
			texColor[0] = 1.0;
			texColor[1] = 1.0;
			texColor[3] = 1.0 - 0.2 * pattern_alpha * floor(pattern2 * 2.0);
		}

	}

	else if (building_type_int == BUILDING_TYPE_STONE_WALL)
	{
		float pattern = 0.0;
		pattern += snoise_clamp(vec3(
					(vTexPosition[0] + 1.75) * 1.715 * subtiles_x,
					(vTexPosition[1] + 1.75) * 3.715 * subtiles_y,
					2.5
					)) * 1.0;

		pattern =  min(1.0, (0.5 + 0.5 * sin(in_subtile_pos_y * 100.0)) * 8.0);

		float pattern2 =  min(1.0, (0.5 + 0.5 * sin(in_subtile_pos_x * 30.0 * mod(in_subtile_pos_y, 0.2) * 5.0) * 0.9));

		pattern = min(pattern, pattern2);

		texColor[0] = pattern * 0.4;
		texColor[1] = pattern2 * 0.9;
		texColor[2] = pattern * 0.4;
	
		float pattern_alpha = 1.0;

		texColor[3] = 0.5 + 0.5 * pattern_alpha;
	}


	


	if (vColor[2] < 0.0)
	{
		float lum = (texColor[0] + texColor[1] + texColor[2]) / 3.0;
		gl_FragColor = HSLA_to_RGBA(vColor[0], vColor[1], lum * (- vColor[2]), texColor[3] * vColor[3]);
		
	}
	else
	{
		vec4 texColor_HSLA = RGBA_to_HSLA(texColor[0], texColor[1], texColor[2], texColor[3]);
		gl_FragColor = HSLA_to_RGBA(texColor_HSLA[0] + vColor[0], texColor_HSLA[1] * vColor[1], texColor_HSLA[2] * vColor[2], texColor_HSLA[3] * vColor[3]);
	}
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
	this.program.aColor				= gl.getAttribLocation(this.program, "aColor");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");

	this.program.uSubtileCount		= gl.getUniformLocation(this.program, "uSubtileCount");
	this.program.uTileCount			= gl.getUniformLocation(this.program, "uTileCount");

	// set the vars that never change
	gl.uniform1i(this.program.uSampler, 0);
	gl.uniform1i(this.program.uYOrigin, 0);
	gl.uniform1i(this.program.uXOrigin, 0);

	gl.errorCheck('setup rectangles_tex');

	this.draw = function(cam_id, texture_id, pos_x, pos_y, width, height, angle,
		tint_h_1, tint_s_1, tint_l_1, tint_a_1,
		tint_h_2, tint_s_2, tint_l_2, tint_a_2,
		tint_h_3, tint_s_3, tint_l_3, tint_a_3,
		tint_h_4, tint_s_4, tint_l_4, tint_a_4
		)
	{

/*
		var camera = cameras[cam_id];
		if (
					(pos_x + width * 2 < camera.left_edge_x)
				||	(pos_x - width * 2 > camera.right_edge_x)
				||	(pos_y + height * 2 < camera.bottom_edge_y)
				||	(pos_y - height * 2 > camera.top_edge_y)
			)
		{
			return;
		}
//*/

		var
			width2 = width,
			height2 = height;
		
		if (!this.vbuffer[cam_id])
		{
			console.log('draw_rectangle_tex: unknown cam: ' + cam_id);
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

		var index = 0;

		// - + top left
		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_1;									index++;

		// + + top right

		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_2;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_2;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_2;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_2;									index++;

		// + - bottom right

		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_3;									index++;
			
		// - + top left

		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (+height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_1;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_1;									index++;

		// + - bottom right
		
		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (+width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (+width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_3;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_3;									index++;

		// - - bottom left

		this.vbuffer[cam_id][texture_id][offset + index] = a_cos * (-width2) - a_sin * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = a_sin * (-width2) + a_cos * (-height2);		index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_x;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = pos_y;										index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 1;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = 0;											index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_h_4;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_s_4;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_l_4;									index++;
		this.vbuffer[cam_id][texture_id][offset + index] = tint_a_4;									index++;

		this.buffer_counter[cam_id][texture_id]++;

	};

	this.set_tile_counts = function(tiles_x, tiles_y, subtiles_x, subtiles_y)
	{
		this.tile_count = [tiles_x, tiles_y];
		this.subtile_count = [tiles_x * subtiles_x, tiles_y * subtiles_y];
	}

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

		for (var camera_id = 0, len1 = this.cameras.length; camera_id < len1; camera_id++)
		//for (var camera_id in cameras)
		{
			for (var texture_id = 0, len2 = this.vbuffer[camera_id].length; texture_id < len2; texture_id++)
			//for (var texture_id in this.vbuffer[camera_id])
			{
				this.flush(camera_id, texture_id);
			}
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aColor);
		this.something_to_draw = false;
	}

	this.flush = function(camera_id, texture_id)
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

		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	40, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	40, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	40, 16);
		gl.vertexAttribPointer(this.program.aColor, 			4, gl.FLOAT,	false,	40, 24);

		gl.uniform2fv(this.program.uCamPosition,camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 	camera.zoom);

		gl.uniform2fv(this.program.uTileCount, 		this.tile_count);
		gl.uniform2fv(this.program.uSubtileCount, 	this.subtile_count);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);

		var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;

		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		this.buffer_counter[camera_id][texture_id] = 0;
	};
}