"use strict";

µ.WebGL_Rectangle_Tiles = function(gl, cameras, textures)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 1000;
	this.vertices_per_object = 6;
	this.attributes_per_object = 10;
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
	"varying	vec2		vPosition;",
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
	"varying	vec2		vPosition;",
	"varying	highp vec2	vTexPosition;",

	"uniform 	sampler2D 	uSampler;",
	"uniform 	sampler2D 	uSampler_Tiledata1;",
	"uniform 	vec2 		uTileCount;",
	"uniform 	vec2 		uSubtileCount;",
	"uniform 	float 		uNow;",


	bxx_shader_includes.colors + "\n",
	bxx_shader_includes.noise3D + "\n",


(function () {/*

void main()
{

	float pixel_x = gl_FragCoord[0] - 0.5;
	float pixel_y = gl_FragCoord[1] - 0.5;

	float subtiles_x = uTileCount[0];
	float subtiles_y = uTileCount[1];
	float subtile_size_x = 1.0 / subtiles_x;
	float subtile_size_y = 1.0 / subtiles_y;

	float subtile_size_half_x = 0.5 / subtiles_x;
	float subtile_size_half_y = 0.5 / subtiles_y;

	float in_subtile_pos_x = mod(vTexPosition[0], subtile_size_x) * subtiles_x;
	float in_subtile_pos_y = 1.0 - mod(vTexPosition[1], subtile_size_y) * subtiles_y;

	float distance_from_subtile_border = 1.0 - 2.0 * max(abs(in_subtile_pos_x - 0.5), abs(in_subtile_pos_y - 0.5));

	float distance_from_subtile_border_x = 1.0 - 2.0 * abs(in_subtile_pos_x - 0.5);
	float distance_from_subtile_border_y = 1.0 - 2.0 * abs(in_subtile_pos_y - 0.5);

	float distance_from_subtile_center = 2.0 * max(abs(in_subtile_pos_x - 0.5), abs(in_subtile_pos_y - 0.5));

	float distance_from_subtile_center_x = 2.0 * abs(in_subtile_pos_x - 0.5);
	float distance_from_subtile_center_y = 2.0 * abs(in_subtile_pos_y - 0.5);

	float distance_from_subtile_center_right 	= max(0.0, in_subtile_pos_x - 0.5) * 2.0;
	float distance_from_subtile_center_left 	= max(0.0, 0.5 - in_subtile_pos_x) * 2.0;
	float distance_from_subtile_center_top 		= max(0.0, in_subtile_pos_y - 0.5) * 2.0;
	float distance_from_subtile_center_bottom 	= max(0.0, 0.5 - in_subtile_pos_y) * 2.0;

	float distance_from_subtile_center_top_right 		= distance_from_subtile_center_right 	* distance_from_subtile_center_top;
	float distance_from_subtile_center_top_left 		= distance_from_subtile_center_left 	* distance_from_subtile_center_top;
	float distance_from_subtile_center_bottom_right 	= distance_from_subtile_center_right 	* distance_from_subtile_center_bottom;
	float distance_from_subtile_center_bottom_left 		= distance_from_subtile_center_left 	* distance_from_subtile_center_bottom;

	float blah1 = 0.0;
	float blah2 = uNow * (0.00005 + 0.00001 * distance_from_subtile_center);

	float	wobble_x = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.12312455 * subtiles_x + blah1,
						vTexPosition[1] * 3.121354145 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.25 * 0.5;

	float	wobble_y = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.1234541475 * subtiles_x + blah1,
						vTexPosition[1] * 3.1234543123435 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.25 * 0.5;

	float	wobbleB_x = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.2435345234538 * subtiles_x + blah1,
						vTexPosition[1] * 3.234346235423238 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.5 * 0.5;

	float	wobbleB_y = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.2343465243743 * subtiles_x + blah1,
						vTexPosition[1] * 3.2655675672923 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.5 * 0.5;

	float	wobbleC_x = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.33454674564355 * subtiles_x + blah1,
						vTexPosition[1] * 3.34364367343785 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.75 * 0.5;

	float	wobbleC_y = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.3435678456345135 * subtiles_x + blah1,
						vTexPosition[1] * 3.3234554624323145 * subtiles_y + blah1,
						0.04123 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 0.75 * 0.5;

	float	wobbleD_x = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.4345345645355 * subtiles_x + blah1,
						vTexPosition[1] * 3.4345346634785 * subtiles_y + blah1,
						0.032453 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 1.0 * 0.5;

	float	wobbleD_y = (0.5 - snoise_clamp(vec3(
						vTexPosition[0] * 3.423465234135 * subtiles_x + blah1,
						vTexPosition[1] * 3.4234546223145 * subtiles_y + blah1,
						0.04123 * (vTexPosition[0] * vTexPosition[1]) + blah2
						))) * subtile_size_x * 1.0 * 0.5;

	vec4 texColor = texture2D(uSampler, vec2(vTexPosition[0] , vTexPosition[1] ));
	
	vec4 texColorA = texture2D(uSampler, vec2(vTexPosition[0]  + wobble_x, vTexPosition[1]  + wobble_y));
	vec4 texColorB = texture2D(uSampler, vec2(vTexPosition[0]  + wobbleB_x, vTexPosition[1]  + wobbleB_y));
	vec4 texColorC = texture2D(uSampler, vec2(vTexPosition[0]  + wobbleC_x, vTexPosition[1]  + wobbleC_y));
	vec4 texColorD = texture2D(uSampler, vec2(vTexPosition[0]  + wobbleD_x, vTexPosition[1]  + wobbleD_y));


	//vec4 texTiledata1 = texture2D(uSampler_Tiledata1, vec2(vTexPosition[0], vTexPosition[1]));

	vec4 texColor_wobbled = (texColorA + texColorB + texColorC + texColorD) / 4.0;

	texColor = texColor_wobbled;

	float	layer1 = snoise_clamp(vec3(
						vTexPosition[0] * 7.75 * subtiles_x,
						vTexPosition[1] * 19.75 * subtiles_y,
						120.5 * distance_from_subtile_border
						)) * 0.99;

vec4 texColor2;

//texColor2 +=  (distance_from_subtile_border_x * 0.5 + 0.5) 	* texColor + 0.5 * distance_from_subtile_center_right 	*	texture2D(uSampler, vec2(vTexPosition[0] + subtile_size_x, 	vTexPosition[1]					)) + 0.5 * distance_from_subtile_center_left 	*	texture2D(uSampler, vec2(vTexPosition[0] - subtile_size_x, 	vTexPosition[1]					));
//texColor2 +=  (distance_from_subtile_border_y * 0.5 + 0.5) 	* texColor + 0.5 * distance_from_subtile_center_top 	*	texture2D(uSampler, vec2(vTexPosition[0], 					vTexPosition[1] - subtile_size_y)) + 0.5 * distance_from_subtile_center_bottom	*	texture2D(uSampler, vec2(vTexPosition[0], 					vTexPosition[1] + subtile_size_y));
//texColor2 += (1.0 - distance_from_subtile_center * distance_from_subtile_center * 0.5 - 0.5)	* texColor / 2.0;
//texColor2 += 0.5 * (1.0 - distance_from_subtile_center_top_left 	) * texColor	+ 0.5 * distance_from_subtile_center_top_left 		*	texture2D(uSampler, vec2(vTexPosition[0] - subtile_size_x, 	vTexPosition[1] - subtile_size_y));
//texColor2 += 0.5 * (1.0 - distance_from_subtile_center_bottom_right ) * texColor	+ 0.5 * distance_from_subtile_center_bottom_right 	*	texture2D(uSampler, vec2(vTexPosition[0] + subtile_size_x, 	vTexPosition[1] + subtile_size_y));
//texColor2 += 0.5 * (1.0 - distance_from_subtile_center_bottom_left 	) * texColor	+ 0.5 * distance_from_subtile_center_bottom_left 	*	texture2D(uSampler, vec2(vTexPosition[0] - subtile_size_x, 	vTexPosition[1] + subtile_size_y));
//texColor2 += 0.5 * (1.0 - distance_from_subtile_center_top_right 	) * texColor	+ 0.5 * distance_from_subtile_center_top_right 		*	texture2D(uSampler, vec2(vTexPosition[0] + subtile_size_x, 	vTexPosition[1] - subtile_size_y));
//texColor2 /= 4.0;

	texColor2 = texColor;

//vec4 texTiledata1_mix =  (distance_from_subtile_border_x  * 0.5 + 0.5) 			* texTiledata1 + 0.5 * distance_from_subtile_center_right 		*	texture2D(uSampler_Tiledata1, vec2(vTexPosition[0] + subtile_size_x, 	vTexPosition[1]					)) + 0.5 * distance_from_subtile_center_left 			*	texture2D(uSampler_Tiledata1, vec2(vTexPosition[0] - subtile_size_x, 	vTexPosition[1]					));
//	 texTiledata1_mix +=  (distance_from_subtile_border_y * 0.5 + 0.5) 			* texTiledata1 + 0.5 * distance_from_subtile_center_top 		*	texture2D(uSampler_Tiledata1, vec2(vTexPosition[0], 					vTexPosition[1] + subtile_size_y)) + 0.5 * distance_from_subtile_center_bottom			*	texture2D(uSampler_Tiledata1, vec2(vTexPosition[0], 					vTexPosition[1] - subtile_size_y));

//	texTiledata1_mix /= 2.0;

	layer1 = floor(layer1 + 0.5);
	
	//texColor = texColor * layer1 + texColor2 * (1.0 - layer1);

	float bands = 2.0;
	
	float	noise_pattern = snoise_clamp(vec3(
						(vTexPosition[0] + texColor[0] + texColor[2]) * (0.24753452345  + 0.4234245 * pow(texColor[0] + texColor[1] + texColor[2], 2.0)) * subtiles_x,
						(vTexPosition[1] + texColor[1] + texColor[2]) * (0.246235623475 + 0.5243235 * pow(texColor[0] + texColor[1] + texColor[2], 2.0)) * subtiles_y,
						15.5 * vTexPosition[0]
							+ texColor[0] * 123.56612
							+ texColor[1] * 132.412312
							+ texColor[2] * 127.11232
							+ uNow * 0.00003345235
						)) * bands;
	noise_pattern = floor(noise_pattern);
	noise_pattern /= bands;

	noise_pattern -= 1.0;
	noise_pattern *= -0.075;

		//texColor = texColor2;

	texColor[0] = texColor2[0] - noise_pattern;
	texColor[1] = texColor2[1] - noise_pattern;
	texColor[2] = texColor2[2] - noise_pattern;

	texColor[3] = 1.0;
	
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
	this.program.uSampler_Tiledata1	= gl.getUniformLocation(this.program, "uSampler_Tiledata1");

	this.program.uNow				= gl.getUniformLocation(this.program, "uNow");
	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");

	this.program.uSubtileCount		= gl.getUniformLocation(this.program, "uSubtileCount");
	this.program.uTileCount			= gl.getUniformLocation(this.program, "uTileCount");

	// set the vars that never change
	gl.uniform1i(this.program.uSampler, 0);
	gl.uniform1i(this.program.uSampler_Tiledata1, 1);

	gl.uniform1i(this.program.uYOrigin, 0);
	gl.uniform1i(this.program.uXOrigin, 0);

	gl.errorCheck('setup rectangles_tiles');

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

	this.flush_all = function(now, tiledata1_texture_id)
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
				this.flush(camera_id, texture_id, now, tiledata1_texture_id);
			}
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		gl.disableVertexAttribArray(this.program.aColor);
		this.something_to_draw = false;
	}

	this.flush = function(camera_id, texture_id, now, tiledata1_texture_id)
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

		gl.uniform1f(this.program.uNow, 		now);

		gl.uniform2fv(this.program.uTileCount, 		this.tile_count);
		gl.uniform2fv(this.program.uSubtileCount, 	this.subtile_count);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[tiledata1_texture_id]);

		var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;

		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		this.buffer_counter[camera_id][texture_id] = 0;
	};
}