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

		plt.c = new µ.canvas_webgl('bxx', 2, -1, -1, plt.cameras, {
				autoresize: true,
			});
		plt.input = new µ.input(plt.c.canvas, 2, plt.cameras);

		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		plt.fonts.add_font('font', 'Tahoma', 'normal', 700, 2048);

		plt.dood_size = 256;

		plt.dood = new Uint8ClampedArray(plt.dood_size * plt.dood_size * 4);

		plt.tex_dood = plt.c.load_texture('apps/onefile/vanity/dood.png', false, function(image) {
			var cv = document.createElement('canvas');
			cv.width = image.width;
			cv.height = image.height;
			var ctx = cv.getContext('2d');
			ctx.drawImage(image, 0, 0);
			var imgd = ctx.getImageData(0, 0, image.width, image.height);
			plt.dood = imgd.data;
			µ.log('dood loaded', µ.LOGLEVEL_VERBOSE);
		});

		plt.pDefsGPU =
		{
			plasma :
			{
				'_Color_r':
				[
					[0		,	0.0],
					[0.25	,	0.3],
					[0.5	,	0.6],
					[0.75	,	0.8],
					[1.0	,	1.0]
				],
				'_Color_g':
				[
					[0		,	0.0],
					[0.25	,	0.3],
					[0.5	,	0.6],
					[0.75	,	0.8],
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
					[0		,	0.0],
					[0.25	,	0.5],
					[0.5	,	0.75],
					[0.75	,	0.999],
					[1.0	,	0.0]
				],
				'_Size':
				[
					[0		,	0.0],
					[0.45	,	0.75],
					[0.5	,	0.5],
					[0.55	,	0.995],
					[1.0	,	0.0]
				],
				'_Softness':
				[
					[0		, 	0.3],
					[0.25	,	1.0],
					[0.5	,	1.0],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Speed':
				[
					[0		,	1.0],
					[0.125	,	0.25],
					[0.25	,	0.0625],
					[0.75	,	0.001],
					[1.0	,	0.0]
				],
				'_Shape':
				[
					[0		,	0.0],
					[0.125	,	0.0],
					[0.125	,	0.0],
					[0.125	,	0.0],
					[1.0	,	0.0]
				],
				'_Hole':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
			},
			plasma_explode :
			{
				'_Color_r':
				[
					[0		,	0.0],
					[0.25	,	0.3],
					[0.5	,	0.6],
					[0.75	,	0.8],
					[1.0	,	1.0]
				],
				'_Color_g':
				[
					[0		,	0.0],
					[0.25	,	0.3],
					[0.5	,	0.6],
					[0.75	,	0.8],
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
					[0		,	0.125],
					[0.25	,	0.25],
					[0.5	,	0.5],
					[0.75	,	1.0],
					[1.0	,	0.0]
				],
				'_Size':
				[
					[0		,	0.2],
					[0.25	,	0.4],
					[0.5	,	0.6],
					[0.75	,	1.0],
					[1.0	,	1.0]
				],
				'_Softness':
				[
					[0		, 	0.0],
					[0.25	,	1.0],
					[0.5	,	2.0],
					[0.75	,	1.0],
					[1.0	,	0.0]
				],
				'_Speed':
				[
					[0		,	1.0],
					[0.125	,	0.2],
					[0.25	,	0.1],
					[0.75	,	0.05],
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
				'_Hole':
				[
					[0		,	0.0],
					[0.25	,	0.0],
					[0.5	,	0.0],
					[0.75	,	0.0],
					[1.0	,	0.0]
				],
			},
		};
		plt.particles__plasma = 0;
		plt.particles__plasma_explode = 1;
		plt.particlesGPU = new µ.Particles2D_uniform_arrays(plt.c.gl, plt.pDefsGPU, 60000, 5);
		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta)
{
	plt.now += time_delta;

	for (i = 0; i < 10;  i++)
//	for (x = 0; x < plt.dood_size;  x++)
	{
		var pixel = µ.rand_int(plt.dood_size * plt.dood_size - 1);
		var x = pixel % plt.dood_size;
		var y = Math.floor(pixel / plt.dood_size);

		var pixel_index = pixel * 4;

		//for (y = 0; y < plt.dood_size;  y++)
		{
			//pixel_index = (y * plt.dood_size + x) * 4;
			var brightness = ((plt.dood[pixel_index + 0] / 255 + plt.dood[pixel_index + 1] / 255 + plt.dood[pixel_index + 2] / 255) * (plt.dood[pixel_index + 3] / 255)) / 3;
			if (brightness == 0)
			{
				i--; // what could go wrong, right?
				continue;
			}

				plt.particlesGPU.spawn(
					plt.now,
					4,
					x / plt.dood_size,
					1 - y / plt.dood_size,
					x / plt.dood_size,
					1 - y / plt.dood_size,
					(8 + 4 * brightness) / plt.dood_size,
					0,
					0,
					0, 0.0,
					plt.particles__plasma_explode,
					3000,		//	lifespan
					((plt.now % 20000) / 20000) * 360, 1, 1.2, 0.025 + brightness * 0.5,
					360,		//	vary_angle
					0.2,		//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.1,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					0,			//	vary_lifespan
					0,			//	vary_color_hue
					0.0,		//	vary_color_sat
					0.5,		//	vary_color_lum
					0			//	vary_color_a
				);
				plt.particlesGPU.spawn(
					plt.now,
					4,
					x / plt.dood_size,
					1 - y / plt.dood_size,
					x / plt.dood_size,
					1 - y / plt.dood_size,
					(8 + 4 * brightness) / plt.dood_size,
					0,
					0.0,
					0, 0.0,
					plt.particles__plasma,
					3000,		//	lifespan
					((plt.now % 20000) / 20000) * 360, 1, 1.2, 0.025 + brightness * 0.5,
					360,		//	vary_angle
					0.1,		//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.2,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					0,			//	vary_lifespan
					0,			//	vary_color_hue
					0.0,		//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);

		}
	}
};

plt.render = function()
{
	plt.c.flush_all();
	plt.fonts.draw_text(
		"" + Math.round(1000 / app.render_callback_times.read()),
		plt.CAM_STRETCH, 'font', 0.05, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);


	plt.fonts.flush_all();
	//plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
	plt.particlesGPU.draw(plt.now, plt.c.gl, plt.camera_stretch);
	//plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
	plt.c.flush_all();
};

var app = new µ.app(plt, plt.init, plt.think, plt.render);