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
		plt.DEFAULT_FONT = plt.fonts.add_font('Tahoma', 'normal', 700, 2048);

		var softness = 0.5;

//		console.log(µ.distance2D(0, 0, 1, 1));

		plt.pDefsGPU =
		{
			fog:
			{
				'_Color_r':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_g':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_b':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_a':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	0.0]
				],
				'_Size':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Softness':
				[
					[0		,	softness],
					[0.25	,	softness],
					[0.5	,	softness],
					[0.75	,	softness],
					[1.0	,	softness]
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
					[0.25	,	0.0],
					[0.5	,	0.5],
					[0.75	,	0.0],
					[1.0	,	0.5]
				],
				'_Shape':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
			},

			solid:
			{
				'_Color_r':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_g':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_b':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Color_a':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Size':
				[
					[0		,	1.0],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Softness':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
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
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
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
			},
		};

		plt.particles__fog = 0;
		plt.particles__solid = 1;

		plt.particlesGPU = new µ.Particles2D_uniform_arrays(plt.c.gl, plt.pDefsGPU, 20000, 5);

		plt.input.KEY_SPACE.callback_press = function()
		{
		};

		bootloader_status.info = 'done!';

	},
];

plt.think = function(time_delta) {
	plt.now += time_delta;


//*

	plt.particlesGPU.spawn(
		plt.now,
		1,
		0.5 + µ.rand(.5),
		µ.rand(1),
		0.5 + µ.rand(.5),
		µ.rand(1),
		0.025,
		0,
		0,
		0, 0,
		plt.particles__solid,
		1000,		//	lifespan
		0, 1, 1.0, 0.5,
		0,			//	vary_angle
		0.0,		//	vary_angle_vel
		0.0,			//	vary_pos_x
		0.0,			//	vary_pos_y
		0.0,			//	vary_size
		0,			//	vary_vel_x
		0,			//	vary_vel_y
		0,		//	vary_lifespan
		0,			//	vary_color_hue
		0,			//	vary_color_sat
		0.0,			//	vary_color_lum
		0.0			//	vary_color_a
	);


	plt.particlesGPU.spawn(
		plt.now,
		1,
		0.0 + µ.rand(.5),
		µ.rand(1),
		0.0 + µ.rand(.5),
		µ.rand(1),
		0.025,
		0,
		0,
		0, 0,
		plt.particles__fog,
		1000,		//	lifespan
		0, 1, 1.0, 0.5,
		0,			//	vary_angle
		0.0,		//	vary_angle_vel
		0.0,			//	vary_pos_x
		0.0,			//	vary_pos_y
		0.0,			//	vary_size
		0,			//	vary_vel_x
		0,			//	vary_vel_y
		0,		//	vary_lifespan
		0,			//	vary_color_hue
		0,			//	vary_color_sat
		0.0,			//	vary_color_lum
		0.0			//	vary_color_a
	);
//*/

/*
	plt.particlesGPU.spawn(
		plt.now,
		1,
		µ.rand(1),
		µ.rand(1),
		µ.rand(1),
		µ.rand(1),
		0.5,
		0,
		0,
		0, 0,
		plt.particles__fog,
		10,		//	lifespan
		0, 1, 1.0, 0.5,
		0,			//	vary_angle
		0.0,		//	vary_angle_vel
		0.1,			//	vary_pos_x
		0.1,			//	vary_pos_y
		0.0,			//	vary_size
		0,			//	vary_vel_x
		0,			//	vary_vel_y
		0,		//	vary_lifespan
		0,			//	vary_color_hue
		0,			//	vary_color_sat
		0.0,			//	vary_color_lum
		0.0			//	vary_color_a
	);
//*/

};

plt.render = function()
{

	plt.fonts.draw_text(
		"" + (Math.round(app.render_times.read() * 100) / 100), 1,
		plt.CAM_STRETCH, plt.DEFAULT_FONT, 0.05, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);


	//plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
	plt.particlesGPU.draw(plt.now, plt.c.gl, plt.camera_stretch);
	//plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);


	plt.fonts.flush_all();

	plt.c.flush_all();

};
var app = new µ.app(plt, plt.init, plt.think, plt.render);