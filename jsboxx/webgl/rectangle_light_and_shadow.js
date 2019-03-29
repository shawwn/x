"use strict";

µ.WebGL_Rectangle_Light_and_Shadow = function(gl, cameras, textures, pixelstore_lights)
{
	this.something_to_draw = false;

	this.allocation_chunk_size = 10;
	this.vertices_per_object = 6;
	this.attributes_per_object = 6;

	this.pixelstore_lights = pixelstore_lights;

	this.magic_number = this.vertices_per_object * this.attributes_per_object;

	this.vbuffer = {};
	this.buffer_counter = {};
	this.buffer_max = {};

	this.camera_pos_x = 0.5;
	this.camera_pos_y = 0.5;
	this.camera_pos_z = 0.0;
	this.camera_range = 0.3;
	this.camera_range360 = 0.05;
	this.camera_direction = 0;
	this.camera_cone = 0;
	this.camera_falloff = 0;

	this.camera2_pos_x = 0.0;
	this.camera2_pos_y = 0.0;
	this.camera2_pos_z = 0.0;
	this.camera2_range = 0.0;
	this.camera2_range360 = 0.0;
	this.camera2_direction = 0;
	this.camera2_cone = 0;
	this.camera2_falloff = 0;

	this.texture_step = 0.5;
	this.height_tolerance = 0.0;

	this.light_count = 0;

	for (var i in cameras)
	{
		this.vbuffer[i] = {};
		this.buffer_counter[i] = {};
		this.buffer_max[i] = {};
	}
	this.program = gl.createProgram();
	this.buffer = gl.createBuffer();

	this.vertex_shader = [

	"attribute	vec2		aVertexPosition;",
	"attribute	vec2		aTexPosition;",
	"attribute	vec2		aPosition;",

	"uniform	vec2		uCamPosition;",
	"uniform	vec2		uCamZoom;",
	"uniform	int			uCamXOrigin;",
	"uniform	int			uCamYOrigin;",

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
	"	vTexPosition = aTexPosition;",
	"}",
	""].join('\n');

	this.fragment_shader = [


(function () {/*

precision highp	float;
//precision mediump	float;

uniform	vec2			uCamZoom;

uniform	float			uTextureStep;

uniform sampler2D 		uSampler;
uniform sampler2D 		uSamplerDepthmap;
uniform sampler2D 		uSamplerFluidmap;
uniform sampler2D 		uSamplerPixelstore;

uniform	int				uLightCount;

varying	highp vec2		vTexPosition;

uniform 	int 		uDoThatThing;

uniform		vec3		uCameraPosition;
uniform		float		uCameraRange;
uniform		float		uCameraRange360;
uniform		float		uCameraDirection;
uniform		float		uCameraCone;
uniform		float		uCameraFalloff;

uniform		vec3		uCamera2Position;
uniform		float		uCamera2Range;
uniform		float		uCamera2Range360;
uniform		float		uCamera2Direction;
uniform		float		uCamera2Cone;
uniform		float		uCamera2Falloff;

uniform		float		uHeightTolerance;

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

	bxx_shader_includes.colors + "\n",
	bxx_shader_includes.angles + "\n",

	this.pixelstore_lights.include_variables(),
	this.pixelstore_lights.include_functions(),

(function () {/*

vec4 do_the_bresenham_step(vec3 pos_start, vec4 light_color, vec3 pos_end, float step, float range)
{
	vec3 pos0 = vec3(pos_start[0], pos_start[1], pos_start[2]);
	float distance_max = distance(vec2(pos0.x, pos0.y), vec2(pos_end.x, pos_end.y));
	float distance_frac = 0.0;
	float distance_curr = 0.0;
	float distance_per_step = distance_max / 260.0;

	vec2 d = vec2(abs(pos_end[0] - pos0[0]), abs(pos_end[1] - pos0[1]));
	vec2 s = vec2(pos0[0] < pos_end[0] ? step : -step, pos0[1] < pos_end[1] ? step : -step);
	float err = d[0] - d[1];
	float e2 = 0.0;
	vec4 tx = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 tx_depth = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 tx_fluid = vec4(0.0, 0.0, 0.0, 0.0);

	float used_zoom = min(uCamZoom[0], uCamZoom[1]);

	tx_fluid = texture2D(uSamplerFluidmap, vec2(pos_end.x, pos_end.y));

	float height = 0.0;
	float fluid_height = 0.0;
	float fluid_height_end = pos_end[2] + tx_fluid[0];

	for (int i = 0; i < 320; i++)
	{
		distance_curr = distance(vec2(pos0.x, pos0.y), vec2(pos_start.x, pos_start.y));
		distance_frac = (distance_curr / distance_max);

		//distance_curr += distance_per_step;
		//distance_frac = float(i) / 520.0;

		height = (1.0 - distance_frac) * pos_start[2] + distance_frac * pos_end[2];
		fluid_height = (1.0 - distance_frac) * pos_start[2] + distance_frac * fluid_height_end;

		tx = texture2D(uSampler, vec2(pos0.x, pos0.y));
		tx_depth = texture2D(uSamplerDepthmap, vec2(pos0.x, pos0.y));
		tx_fluid = texture2D(uSamplerFluidmap, vec2(pos0.x, pos0.y));

		if ((tx_depth[0] + tx_fluid[0]) > (fluid_height + uHeightTolerance))
		{
			float diff = ((tx_depth[0] + tx_fluid[0]) - (fluid_height + uHeightTolerance));

			//float diff1 = 1.0 - diff;
			//diff = 1.0 - (diff1 * diff1 * diff1 * diff1);

			light_color[0] -= (1.0 - (1.0 - diff) * (1.0 - diff)) * 2.5;
			light_color[1] -= (1.0 - (1.0 - diff) * (1.0 - diff)) * 2.5;
			light_color[2] -= (1.0 - (1.0 - diff) * (1.0 - diff)) * 2.5;
			light_color[3] -= (1.0 - (1.0 - diff) * (1.0 - diff)) * 2.5;
		}
		//if ((tx_depth[0]) > (height + uHeightTolerance))
		{
			//light_color[3] -= ((tx_depth[0]) - (height + uHeightTolerance));
		}


		//if (tx[3] > 0.0)
		{
			//light_color[0] -= (1.0 - tx[0]) * tx[3] * 2.0;
			//light_color[1] -= (1.0 - tx[1]) * tx[3] * 2.0;
			//light_color[2] -= (1.0 - tx[2]) * tx[3] * 2.0;

			//light_color[3] -= tx[3] / 250.0;
		}
		if (light_color[0] <= 0.0 && light_color[1] <= 0.0 && light_color[2] <= 0.0 && light_color[3] <= 0.0)
		{
			return vec4 (0.0, 0.0, 0.0, 0.0);
		}
		if (abs(pos0[0] - pos_end[0]) <= step  && abs(pos0[1] - pos_end[1]) <= step)
		{
			light_color[0] = max(0.0, light_color[0]);
			light_color[1] = max(0.0, light_color[1]);
			light_color[2] = max(0.0, light_color[2]);
			light_color[3] = max(0.0, light_color[3]);
			return light_color;
		}
		e2 = 2.0 * err;
		if (e2 > -d[1])
		{
			err -= d[1];
			pos0[0] += s[0];
		}
		if (e2 < d[0])
		{
			err += d[0];
			pos0[1] += s[1];
		}
	}
	return vec4 (1.0, 0.0, 1.0, 1.0);
}

vec4 do_shadow(
		vec3 light_position,
		vec4 light_color,
		vec3 pixel_position,
		float distance_between_pixel_and_light,
		float light_range,
		float light_range360,
		float light_direction,
		float light_cone,
		float light_falloff
	)
{
	//return vec4(1.0, 1.0, 1.0, 1.0);

	vec2 light_position2D = vec2(light_position.x, light_position.y);
	vec2 pixel_position2D = vec2(pixel_position.x, pixel_position.y);

	float used_zoom = max(uCamZoom[0], uCamZoom[1]);

	float light_directionB = (360.0 - light_direction);
	float light_coneB = (360.0 - light_cone - 180.0) / 180.0;
	vec2 direction = normalize(vec2(pixel_position2D - light_position2D));
	bool is_outside_cone = dot(direction, angle_to_vec2(light_directionB)) < light_coneB;

	if (distance_between_pixel_and_light >= light_range || distance_between_pixel_and_light >= light_range360 && is_outside_cone)
	{
		return vec4(0, 0, 0, 0);
	}
	else
	{
		float dist_frac = distance_between_pixel_and_light / (is_outside_cone ? light_range360 : light_range);
		float falloff = 0.0;
		if (light_falloff < 0.5)
		{
			falloff = pow(1.0 - dist_frac, light_falloff * 2.0);
		}
		else
		{
			falloff = 1.0 - pow(dist_frac, 1.0 - (light_falloff - 0.5) * 2.0);
		}

		if (uDoThatThing == 1)
		{
			pixel_position[2] = light_position[2];
		}

		vec4 bresenham = do_the_bresenham_step(
			light_position,
			light_color,
			pixel_position,
			uTextureStep * 0.007324, // * used_zoom,
			is_outside_cone ? light_range360 : light_range
		);
		return 1.0 - (1.0 - (bresenham * falloff));
	}
}

vec4 do_lights(vec2 screen_pos, float height)
{
	//return vec4(1.0, 1.0, 1.0, 1.0);

	vec4 pixel1, pixel2, pixel3;
	vec2 light_pos = vec2(0.0, 0.0);
	vec3 light_pos3D = vec3(0.0, 0.0, 0.0);
	vec3 screen_pos3D = vec3(screen_pos[0], screen_pos[1], height);
	float light_pos_x = 0.0;
	float light_pos_y = 0.0;
	float light_pos_z = 0.0;
	float light_range = 0.0;
	float light_range360 = 0.0;
	float light_falloff = 0.0;
	vec4 light_factor = vec4(0, 0, 0, 0);
	float dist = 0.0;
	vec4 light_color = vec4(0.0, 0.0, 0.0, 0.0);

	float used_zoom = max(uCamZoom[0], uCamZoom[1]);

// "sunlight"

//	light_factor = do_the_bresenham_step(
//		vec3(screen_pos3D[0] - 0.02, screen_pos3D[1] - 0.02, screen_pos3D[2] + 2.0),
//		vec4(0.5, 0.5, 0.5, 1.0),
//		screen_pos3D,
//		uTextureStep * 0.007324, // * used_zoom,
//		2.0
//	);
//
//	light_color[0] += light_factor[0];
//	light_color[1] += light_factor[1];
//	light_color[2] += light_factor[2];
//	light_color[3] += light_factor[3];


	for (int i = 0; i < 200; i++)
	{
		if (i < uLightCount)
		{
			pixel1 = pixelstore_lights_get_pixel(i * 3, uSamplerPixelstore);
			pixel2 = pixelstore_lights_get_pixel(i * 3 + 1, uSamplerPixelstore);
			pixel3 = pixelstore_lights_get_pixel(i * 3 + 2, uSamplerPixelstore);

			light_pos_x = pixel1[0];
			light_pos_y = pixel1[1];
			light_range = pixel1[2];
			light_falloff = pixel1[3];
			float light_direction = 360.0 - pixel3[0];
			float light_cone = (360.0 - pixel3[1] - 180.0) / 180.0;
			light_range360 = pixel3[2];
			light_pos_z = pixel3[3];

			light_pos = vec2(light_pos_x, 1.0 - light_pos_y);
			light_pos3D = vec3(light_pos_x, 1.0 - light_pos_y, light_pos_z);

			dist = distance(light_pos, screen_pos);
			if (dist <= light_range)
			{
				vec2 direction = normalize(vec2(screen_pos - light_pos));
				bool is_outside_cone = dot(direction, angle_to_vec2(light_direction)) < light_cone;
				if (!(dist > light_range360 && is_outside_cone))
				{
					float dist_frac = dist / (is_outside_cone ? light_range360 : light_range);
					float falloff = 0.0;
					if (light_falloff < 0.5)
					{
						falloff = pow(1.0 - dist_frac, light_falloff * 2.0);
					}
					else
					{
						falloff = 1.0 - pow(dist_frac, 1.0 - (light_falloff - 0.5) * 2.0);
					}
					vec4 remaining = vec4(pixel2[0], pixel2[1], pixel2[2], 1.0);

					//light_factor = do_the_bresenham_step_old(light_pos, screen_pos, uTextureStep * 1.0, remaining) * falloff;

					if (uDoThatThing == 1)
					{
						screen_pos3D[2] = light_pos3D[2];
					}
	
					light_factor = falloff * vec4(1.0, 1.0, 1.0, 1.0); // do_the_bresenham_step(light_pos3D, pixel2, screen_pos3D, uTextureStep * 0.01, // * used_zoom, (is_outside_cone ? light_range360 : light_range) );

					light_color[0] += light_factor[0] * pixel2[0] * pixel2[3];
					light_color[1] += light_factor[1] * pixel2[1] * pixel2[3];
					light_color[2] += light_factor[2] * pixel2[2] * pixel2[3];
					light_color[3] += light_factor[3] * pixel2[3];
				}
			}
		}
		else
		{
			return light_color;
		}
	}
	return light_color;
}

void main()
{
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

/*

	vec4 shadow1 = vec4(0, 0, 0, 0);
	vec4 shadow2 = vec4(0, 0, 0, 0);

	shadow1 = do_shadow(
		uCameraPosition,
		vec4(1.0, 1.0, 1.0, 1.0), //texColor,
		vec3(
			vTexPosition[0],
			vTexPosition[1],
			texDepthmap[0]
		),
		dist1,
		uCameraRange,
		uCameraRange360,
		uCameraDirection,
		uCameraCone,
		uCameraFalloff
	);

	shadow2 = do_shadow(
		uCamera2Position,
		vec4(1.0, 1.0, 1.0, 1.0), //texColor,
		vec3(
			vTexPosition[0],
			vTexPosition[1],
			texDepthmap[0]
		),
		dist2,
		uCamera2Range,
		uCamera2Range360,
		uCamera2Direction,
		uCamera2Cone,
		uCamera2Falloff
	);
	shadow1 = vec4(
		shadow1[0] * shadow1[3],
		shadow1[1] * shadow1[3],
		shadow1[2] * shadow1[3],
		1.0);
	shadow2 = vec4(
		shadow2[0] * shadow2[3],
		shadow2[1] * shadow2[3],
		shadow2[2] * shadow2[3],
		1.0);

	vec4 shadows = vec4(
		max(shadow1[0], shadow2[0]),
		max(shadow1[1], shadow2[1]),
		max(shadow1[2], shadow2[2]),
		min(shadow1[3], shadow2[3])
	);

*/

	this.pixelstore_lights.include_constants2(),
(function () {/*

	//vec2 pos = vec2(vTexPosition[0], vTexPosition[1]);
	//if (pos[0] < 0.0 || pos[0] > 1.0 || pos[1] < 0.0 || pos[1] > 1.0)
	{
		//discard;
	}

	//vec4 texColor = texture2D(uSampler, vTexPosition);
	vec2 light1_position = vec2(uCameraPosition.x, uCameraPosition.y);
	vec2 light2_position = vec2(uCamera2Position.x, uCamera2Position.y);
	float dist1 = distance(vTexPosition, light1_position);
	float dist2 = distance(vTexPosition, light2_position);
	vec4 texDepthmap = texture2D(uSamplerDepthmap, vTexPosition);

	vec4 shadows = vec4(1.0, 1.0, 1.0, 1.0);


	//if (shadows[0] > 0.0 || shadows[1] > 0.0 || shadows[2] > 0.0)
	{
		vec4 light_color = do_lights(vTexPosition, texDepthmap[0]);
		//gl_FragColor = light_color * shadows;
		gl_FragColor =  vec4(
				light_color[0] * shadows[0],
				light_color[1] * shadows[1],
				light_color[2] * shadows[2],
				shadows[3]
			);
	}
	//else
	{
		//gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	

}

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1],

/*
	if (shadows[3] < 0.0)
	{
		//vec4 light_color = do_lights(pos);
		//gl_FragColor = light_color * shadows;
		//gl_FragColor = vec4(light_color[0], light_color[1], light_color[2], light_color[3]);

		gl_FragColor = vec4(
			max(shadow1[0], shadow2[0]),
			max(shadow1[1], shadow2[1]),
			max(shadow1[2], shadow2[2]),
			min(shadow1[3], shadow2[3])
		);
	}
	else
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	gl_FragColor = shadows;
	//vec4 light_color = do_lights(pos);
	//gl_FragColor = vec4(light_color[0], light_color[1], light_color[2], light_color[3]);
*/


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
	this.program.aPosition			= gl.getAttribLocation(this.program, "aPosition");

	this.program.uSampler			= gl.getUniformLocation(this.program, "uSampler");
	this.program.uSamplerDepthmap	= gl.getUniformLocation(this.program, "uSamplerDepthmap");
	this.program.uSamplerFluidmap	= gl.getUniformLocation(this.program, "uSamplerFluidmap");
	this.program.uSamplerPixelstore	= gl.getUniformLocation(this.program, "uSamplerPixelstore");

	this.program.uTextureStep		= gl.getUniformLocation(this.program, "uTextureStep");

	this.program.uDoThatThing		= gl.getUniformLocation(this.program, "uDoThatThing");

	this.program.uCameraPosition	= gl.getUniformLocation(this.program, "uCameraPosition");
	this.program.uCameraRange		= gl.getUniformLocation(this.program, "uCameraRange");
	this.program.uCameraRange360	= gl.getUniformLocation(this.program, "uCameraRange360");
	this.program.uCameraDirection	= gl.getUniformLocation(this.program, "uCameraDirection");
	this.program.uCameraCone		= gl.getUniformLocation(this.program, "uCameraCone");
	this.program.uCameraFalloff		= gl.getUniformLocation(this.program, "uCameraFalloff");

	this.program.uCamera2Position	= gl.getUniformLocation(this.program, "uCamera2Position");
	this.program.uCamera2Range		= gl.getUniformLocation(this.program, "uCamera2Range");
	this.program.uCamera2Range360	= gl.getUniformLocation(this.program, "uCamera2Range360");
	this.program.uCamera2Direction	= gl.getUniformLocation(this.program, "uCamera2Direction");
	this.program.uCamera2Cone		= gl.getUniformLocation(this.program, "uCamera2Cone");
	this.program.uCamera2Falloff	= gl.getUniformLocation(this.program, "uCamera2Falloff");

	this.program.uHeightTolerance	= gl.getUniformLocation(this.program, "uHeightTolerance");

	this.program.uLightCount		= gl.getUniformLocation(this.program, "uLightCount");

	this.program.uCamPosition		= gl.getUniformLocation(this.program, "uCamPosition");
	this.program.uCamZoom			= gl.getUniformLocation(this.program, "uCamZoom");
	this.program.uXOrigin			= gl.getUniformLocation(this.program, "uCamXOrigin");
	this.program.uYOrigin			= gl.getUniformLocation(this.program, "uCamYOrigin");

	gl.errorCheck('setup rectangle_light_and_shadow');


	this.set_camera_position = function(pos_x, pos_y, pos_z)
	{
		this.camera_pos_x = pos_x;
		this.camera_pos_y = pos_y;
		this.camera_pos_z = pos_z;
	}
	this.set_camera_range = function(range)
	{
		this.camera_range = range;
	}
	this.set_camera_range360 = function(range)
	{
		this.camera_range360 = range;
	}
	this.set_camera_direction = function(direction)
	{
		this.camera_direction = direction;
	}
	this.set_camera_cone = function(cone)
	{
		this.camera_cone = cone;
	}
	this.set_camera_falloff = function(falloff)
	{
		this.camera_falloff = falloff;
	}

	this.set_camera2_position = function(pos_x, pos_y, pos_z)
	{
		this.camera2_pos_x = pos_x;
		this.camera2_pos_y = pos_y;
		this.camera2_pos_z = pos_z;
	}
	this.set_camera2_range = function(range)
	{
		this.camera2_range = range;
	}
	this.set_camera2_range360 = function(range)
	{
		this.camera2_range360 = range;
	}
	this.set_camera2_direction = function(direction)
	{
		this.camera2_direction = direction;
	}
	this.set_camera2_cone = function(cone)
	{
		this.camera2_cone = cone;
	}
	this.set_camera2_falloff = function(falloff)
	{
		this.camera2_falloff = falloff;
	}

	this.set_height_tolerance = function(height_tolerance)
	{
		this.height_tolerance = height_tolerance;
	}
	this.set_light_count = function(count)
	{
		this.light_count = count;
	}

	this.set_texture_step = function(texture_size)
	{
		this.texture_step = 1 / texture_size;
	}

	this.draw = function(cam_id, texture_id, pos_x, pos_y, width, height)
	{
		var
			width2 = width / 1,
			height2 = height / 1;
		if (!this.vbuffer[cam_id])
		{
			console.log('rectangle_textured_light_and_shadow.draw(): unknown cam: ' + cam_id);
			return;
		}
		this.something_to_draw = true;
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
		var inc = 0;

		// - + top left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;	inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;	inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;
		// + + top right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;																								
		// + - bottom right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																								
		// - + top left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = +height2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;																								
		// + - bottom right
		this.vbuffer[cam_id][texture_id][offset + inc] = +width2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																								
		// - - bottom left
		this.vbuffer[cam_id][texture_id][offset + inc] = -width2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = -height2;	inc++;																																
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_x;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = pos_y;										inc++;																								
		this.vbuffer[cam_id][texture_id][offset + inc] = 0;											inc++;																							
		this.vbuffer[cam_id][texture_id][offset + inc] = 1;											inc++;																								

		this.buffer_counter[cam_id][texture_id]++;
	};
	this.flush_all = function(texture_depthmap_id, texture_fluid_map_id, do_that_thing)
	{
		if (!this.something_to_draw)
		{
			return;
		}
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.program.aVertexPosition);
		gl.enableVertexAttribArray(this.program.aTexPosition);
		gl.enableVertexAttribArray(this.program.aPosition);
		for (var camera_id in cameras)
		{
			for (var texture_id in this.vbuffer[camera_id])
			{
				this.flush(camera_id, texture_id, texture_depthmap_id, texture_fluid_map_id, do_that_thing);
			}
		}
		gl.disableVertexAttribArray(this.program.aVertexPosition);
		gl.disableVertexAttribArray(this.program.aTexPosition);
		gl.disableVertexAttribArray(this.program.aPosition);
		this.something_to_draw = false;
	}

	this.flush = function(camera_id, texture_id, texture_depthmap_id, texture_fluid_map_id, do_that_thing)
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

		gl.vertexAttribPointer(this.program.aVertexPosition,	2, gl.FLOAT,	false,	24, 0);
		gl.vertexAttribPointer(this.program.aPosition,			2, gl.FLOAT,	false,	24, 8);
		gl.vertexAttribPointer(this.program.aTexPosition,		2, gl.FLOAT,	false,	24, 16);

		gl.uniform1f(this.program.uTextureStep, 	this.texture_step);
		gl.uniform1i(this.program.uLightCount, 		this.light_count);

		gl.uniform1i(this.program.uDoThatThing, do_that_thing ? 1 : 0);

		gl.uniform3fv(this.program.uCameraPosition, 	[this.camera_pos_x, 1 - this.camera_pos_y, this.camera_pos_z]);
		gl.uniform1f(this.program.uCameraRange, 		this.camera_range);
		gl.uniform1f(this.program.uCameraRange360, 		this.camera_range360);
		gl.uniform1f(this.program.uCameraDirection,		this.camera_direction);
		gl.uniform1f(this.program.uCameraCone, 			this.camera_cone);
		gl.uniform1f(this.program.uCameraFalloff, 		this.camera_falloff);

		gl.uniform3fv(this.program.uCamera2Position, 	[this.camera2_pos_x, 1 - this.camera2_pos_y, this.camera2_pos_z]);
		gl.uniform1f(this.program.uCamera2Range, 		this.camera2_range);
		gl.uniform1f(this.program.uCamera2Range360, 	this.camera2_range360);
		gl.uniform1f(this.program.uCamera2Direction,	this.camera2_direction);
		gl.uniform1f(this.program.uCamera2Cone, 		this.camera2_cone);
		gl.uniform1f(this.program.uCamera2Falloff, 		this.camera2_falloff);

		gl.uniform1f(this.program.uHeightTolerance, this.height_tolerance);
	
		gl.uniform2fv(this.program.uCamPosition,	camera.pos);
		gl.uniform2fv(this.program.uCamZoom, 		camera.zoom);

		gl.uniform1i(this.program.uXOrigin, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_id]);
		gl.uniform1i(this.program.uSampler, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_depthmap_id]);
		gl.uniform1i(this.program.uSamplerDepthmap, 1);

		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, textures[this.pixelstore_lights.data_texture]);
		gl.uniform1i(this.program.uSamplerPixelstore, 2);


		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, textures[texture_fluid_map_id]);
		gl.uniform1i(this.program.uSamplerFluidmap, 3);


		var	numItems = this.buffer_counter[camera_id][texture_id] * this.vertices_per_object;
		gl.drawArrays(gl.TRIANGLES,	0, numItems);

		//gl.bindTexture(gl.TEXTURE_2D, null);
		//gl.activeTexture(gl.TEXTURE0);
		//gl.bindTexture(gl.TEXTURE_2D, null);
		//gl.activeTexture(gl.TEXTURE1);
		//gl.bindTexture(gl.TEXTURE_2D, null);

		this.buffer_counter[camera_id][texture_id] = 0;
	};
}