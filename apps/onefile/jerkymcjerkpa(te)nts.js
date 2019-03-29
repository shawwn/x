var plt = {};
plt.init = [

	function(bootloader_status)
	{
		plt.now = 0;		
		plt.last_play = 0;
		plt.cameras = new µ.Cameras2D(plt, window.innerWidth, window.innerHeight);

		plt.camera_landscape = plt.cameras.c[plt.CAM_LANDSCAPE];
		plt.camera_portrait = plt.cameras.c[plt.CAM_PORTRAIT];
		plt.camera_stretch = plt.cameras.c[plt.CAM_STRETCH];

		plt.scale = 1;

		plt.c = new µ.canvas_webgl('bxx', plt.scale, -1, -1, plt.cameras, {
				autoresize: true,
			});
		plt.input = new µ.input(plt.c.canvas, plt.scale, plt.cameras);

		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		plt.fonts.add_font('font', 'Tahoma', 'normal', 700, 2048);


		plt.pDefsGPU =
		{
			fire:
			{
				'_Color_r':
				[
					[0		,	1.0],
					[0.25	,	0.95],
					[0.5	,	0.9],
					[0.75	,	0.85],
					[1.0	,	0.8]
				],
				'_Color_g':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Color_b':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Color_a':
				[
					[0		,	0.0],
					[0.025	,	0.95],
					[0.5	,	0.25],
					[0.75	,	0.25],
					[1.0	,	0.0]
				],
				'_Shape':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Size':
				[
					[0		,	0.0],
					[0.1	,	1.0],
					[0.5	,	0.75],
					[0.75	,	0.5],
					[1.0	,	0.0]
				],
				'_Softness':
				[
					[0		,	0.5],
					[0.25	,	0.5],
					[0.5	,	0.5],
					[0.75	,	0.5],
					[1.0	,	0.5]
				],
				'_Speed':
				[
					[0		,	0.0],
					[0.25	,	0.25],
					[0.5	,	0.5],
					[0.75	,	0.75],
					[1.0	,	1.0]
				],
				'_Hole':
				[
					[0		,	0.0],
					[0.15	,	0.3],
					[0.5	,	0.1],
					[0.85	,	0.3],
					[1.0	,	0.0]
				],
			},
			fire2:
			{
				'_Color_r':
				[
					[0		,	1.0],
					[0.25	,	0.95],
					[0.5	,	0.9],
					[0.75	,	0.85],
					[1.0	,	0.8]
				],
				'_Color_g':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Color_b':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Color_a':
				[
					[0		,	0.0],
					[0.025	,	1.0],
					[0.5	,	0.5],
					[0.75	,	0.25],
					[1.0	,	0.0]
				],
				'_Shape':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
				'_Size':
				[
					[0		,	0.0],
					[0.1	,	1.0],
					[0.5	,	0.75],
					[0.75	,	0.5],
					[1.0	,	0.0]
				],
				'_Softness':
				[
					[0		,	0.5],
					[0.25	,	0.5],
					[0.5	,	0.5],
					[0.75	,	0.5],
					[1.0	,	0.5]
				],
				'_Speed':
				[
					[0		,	0.0],
					[0.25	,	0.25],
					[0.5	,	0.5],
					[0.75	,	0.75],
					[1.0	,	1.0]
				],
				'_Hole':
				[
					[0		,	0.0],
					[0.15	,	0.0],
					[0.5	,	0.0],
					[0.85	,	0.0],
					[1.0	,	0.0]
				],
			},
		};
		plt.particles__fire = 0;
		plt.particles__fire2 = 0;
		plt.particlesGPU = new µ.Particles2D_uniform_arrays(plt.c.gl, plt.pDefsGPU, 30000, 5);
		plt.thingies_count = 10;
		plt.thingy_hue = new Array(plt.thingies_count);
		plt.thingy_pos_x = new Array(plt.thingies_count);
		plt.thingy_factor = new Array(plt.thingies_count);
		for (var i = 0; i < plt.thingies_count; i++)
		{
			plt.thingy_pos_x[i] = 0.05 + µ.rand(0.9);
			plt.thingy_factor[i] = 28 + µ.rand(340);
			plt.thingy_hue[i] = µ.rand(360);
		}
		plt.remaining_smoothed1 = 1;
		plt.remaining_smoothed2 = 1;
		plt.remaining_smoothed3 = 1;
		plt.remaining_smoothed4 = 1;
		plt.remaining = 1;
		plt.remaining_this_segment = 1;
		plt.hue = µ.rand(360);
		plt.new_speed();
		bootloader_status.info = 'done!';
	},
];

plt.new_speed = function()
{
	plt.speed = µ.rand(1);
	plt.segment_duration = 500 + µ.rand(100.35 / plt.speed);
}

plt.shuffle = function()
{
	var i = µ.rand_int(plt.thingies_count - 1);
	plt.thingy_pos_x[i] = 0.05 + µ.rand(0.9);
	plt.thingy_factor[i] = 23 + µ.rand(120);
	plt.thingy_hue[i] = µ.rand(360);
}

plt.think = function(time_delta)
{
	plt.now += time_delta;
	plt.remaining -= time_delta * (0.00000007 + 0.0000075 * plt.speed);
	plt.segment_duration -= time_delta;
	if (plt.segment_duration <= 0)
	{
		plt.new_speed();
		plt.remaining_this_segment = 1;
		plt.hue = µ.rand(360);
		plt.shuffle();
	}
	if (plt.remaining <= 0)
	{
		plt.remaining = 1;
		plt.remaining_smoothed1 = 1;
		plt.remaining_smoothed2 = 1;
		plt.remaining_smoothed3 = 1;
		plt.remaining_smoothed4 = 1;
	}
	plt.remaining_smoothed1 = 0.975 * plt.remaining_smoothed1 + 0.025 * plt.remaining;
	plt.remaining_smoothed2 = 0.975 * plt.remaining_smoothed2 + 0.025 * plt.remaining_smoothed1;
	plt.remaining_smoothed3 = 0.975 * plt.remaining_smoothed3 + 0.025 * plt.remaining_smoothed2;
	plt.remaining_smoothed4 = 0.975 * plt.remaining_smoothed4 + 0.025 * plt.remaining_smoothed3;
	for (var i = 0; i < plt.thingies_count; i++)
	{
		plt.particlesGPU.spawn(
			plt.now,
			3,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed2 * plt.thingy_factor[i] % 2.0,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed2 * plt.thingy_factor[i] % 2.0 + .125 / plt.thingy_factor[i],
			0.025 + 0.0016 * plt.thingy_factor[i],
			0,
			0,
			90, 0.0,
			plt.particles__fire,
			2400,		//	lifespan
			360 - plt.thingy_hue[i], 0.0, 1.0, 0.01,
			360,			//	vary_angle
			0.025 * (1 - plt.speed),		//	vary_angle_vel
			0.002,			//	vary_pos_x
			0,			//	vary_pos_y
			0.05,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			0,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		plt.particlesGPU.spawn(
			plt.now,
			3,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed4 * plt.thingy_factor[i] % 2.0,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed4 * plt.thingy_factor[i] % 2.0 + .125 / plt.thingy_factor[i],
			0.0125 + 0.0008 * plt.thingy_factor[i],
			0,
			0,
			90, 0.0,
			plt.particles__fire,
			2400,		//	lifespan
			plt.thingy_hue[i], 0.0, 1.0, 0.01,
			360,			//	vary_angle
			0.025 * (1 - plt.speed),		//	vary_angle_vel
			0.002,			//	vary_pos_x
			0,			//	vary_pos_y
			0.05,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			0,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

		plt.particlesGPU.spawn(
			plt.now,
			3,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed1 * plt.thingy_factor[i] % 2.0,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed1 * plt.thingy_factor[i] % 2.0 + .125 / plt.thingy_factor[i],
			0.0125 + 0.0004 * plt.thingy_factor[i],
			0,
			0,
			90, 0.0,
			plt.particles__fire2,
			2400,		//	lifespan
			plt.thingy_hue[i], 0.0, 1.0, 0.01,
			360,			//	vary_angle
			0.025 * (1 - plt.speed),		//	vary_angle_vel
			0.002,			//	vary_pos_x
			0,			//	vary_pos_y
			0.05,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			0,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
	}
};

plt.render = function()
{


		plt.c.rectangle.draw(plt.CAM_STRETCH,
			0.5,
			0.5,
			1.0,
			1.0,
			90,
			220, 0.8, 0.1, 1.0,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.flush_all();


	plt.c.rectangle.draw(plt.CAM_STRETCH,
		plt.remaining / 2,
		0.05,
		plt.remaining,
		0.1,
		90,
		plt.hue, 0.0, 0.4, 0.35,
		plt.hue, 0.0, 0.5, 0.95,
		plt.hue, 0.0, 0.1, 0.35,
		plt.hue, 0.0, 0.2, 0.75
	);
	plt.c.rectangle.draw(plt.CAM_STRETCH,
		plt.remaining_smoothed1 / 2,
		0.05,
		plt.remaining_smoothed1,
		0.09,
		90,
		plt.hue + 20, 0.0, 0.4, 0.35,
		plt.hue + 20, 0.0, 0.5, 0.95,
		plt.hue + 20, 0.0, 0.1, 0.35,
		plt.hue + 20, 0.0, 0.2, 0.75
	);
	plt.c.rectangle.draw(plt.CAM_STRETCH,
		plt.remaining_smoothed2 / 2,
		0.05,
		plt.remaining_smoothed2,
		0.08,
		90,
		plt.hue + 40, 0.0, 0.4, 0.35,
		plt.hue + 40, 0.0, 0.5, 0.95,
		plt.hue + 40, 0.0, 0.1, 0.35,
		plt.hue + 40, 0.0, 0.2, 0.75
	);
	plt.c.rectangle.draw(plt.CAM_STRETCH,
		plt.remaining_smoothed3 / 2,
		0.05,
		plt.remaining_smoothed3,
		0.07,
		90,
		plt.hue + 60, 0.0, 0.4, 0.35,
		plt.hue + 60, 0.0, 0.5, 0.95,
		plt.hue + 60, 0.0, 0.1, 0.35,
		plt.hue + 60, 0.0, 0.2, 0.75
	);
	plt.c.rectangle.draw(plt.CAM_STRETCH,
		plt.remaining_smoothed4 / 2,
		0.05,
		plt.remaining_smoothed4,
		0.06,
		90,
		plt.hue + 80, 0.0, 0.4, 0.35,
		plt.hue + 80, 0.0, 0.5, 0.95,
		plt.hue + 80, 0.0, 0.1, 0.35,
		plt.hue + 80, 0.0, 0.2, 0.75
	);


	if (2==1) for (var i = 0; i < plt.thingies_count; i++)
	{
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed4 * plt.thingy_factor[i] % 2.0,
			0.005 + 0.0005 * plt.thingy_factor[i],
			0.025 + 0.0015 * plt.thingy_factor[i],
			90,
			0, 0.0, 0.5, 0.7,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed3 * plt.thingy_factor[i] % 2.0,
			0.005 + 0.0005 * plt.thingy_factor[i],
			0.025 + 0.0015 * plt.thingy_factor[i],
			90,
			0, 0.0, 0.5, 0.7,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed2 * plt.thingy_factor[i] % 2.0,
			0.005 + 0.0005 * plt.thingy_factor[i],
			0.025 + 0.0015 * plt.thingy_factor[i],
			90,
			0, 0.0, 0.5, 0.7,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining_smoothed1 * plt.thingy_factor[i] % 2.0,
			0.005 + 0.0005 * plt.thingy_factor[i],
			0.025 + 0.0015 * plt.thingy_factor[i],
			90,
			0, 0.0, 0.5, 0.7,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			plt.thingy_pos_x[i],
			- 0.5 + plt.remaining * plt.thingy_factor[i] % 2.0,
			0.005 + 0.0005 * plt.thingy_factor[i],
			0.025 + 0.0015 * plt.thingy_factor[i],
			90,
			0, 0.0, 0.5, 0.7,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
	}
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
	plt.fonts.flush_all();
	plt.c.flush_all();
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
	plt.particlesGPU.draw(plt.now, plt.c.gl, plt.camera_stretch);

};
var app = new µ.app(plt, plt.init, plt.think, plt.render);