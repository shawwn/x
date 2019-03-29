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

		plt.c = new µ.canvas_webgl('bxx', 1, -1, -1, plt.cameras, {
				autoresize: true,
			});
		plt.input = new µ.input(plt.c.canvas, 1, plt.cameras);

		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		plt.FONT_DEFAULT = plt.fonts.add_font('Tahoma', 'normal', 700, 2048);

		plt.perlin = new µ.PerlinNoise();


		plt.funcs = [

	/*
			function(input) {
				return input;
			},

			function(input) {
				var val = 1.0 - (0.5 + Math.cos(input*3.14159265358979323846264338327950288419716939937510)/2.0);
				return val;
			},

			function(input) {
				var val = 1.0 - (0.5 + Math.cos(input*3.14159265358979323846264338327950288419716939937510)/2.0);
				return Math.pow(val, 0.125 * Math.pow(1+plt.camera_stretch.mouse_pos_x, 8 * plt.camera_stretch.mouse_pos_x));
			},

			function(input) {
				input /= 2;
				return input * (1 - input) * 4;
			},

			function(input) {
				var val = Math.pow(0.0 + (0.5 + Math.cos(input*3.14159265358979323846264338327950288419716939937510)/2.0), plt.camera_stretch.mouse_pos_x);
				return val;
			},

			function(input) {
				return input * (1 - input) * 4;
			},

			function(input) {
				return µ.randerp(0.5,

					0.5 * plt.camera_stretch.mouse_pos_y, Math.pow(plt.camera_stretch.mouse_pos_x * 2, 8) );
			},





*/


/*

			['perlin(0,0,input)', 1, function(input) {
				return plt.perlin.noise(0, 0, input * 1);
			}],
			['perlin(x,0,input)', 1, function(input) {
				return plt.perlin.noise(plt.camera_stretch.mouse_pos_x, 0, input * 1);
			}],
			['perlin(x,y,input)', 1, function(input) {
				return plt.perlin.noise(plt.camera_stretch.mouse_pos_x, plt.camera_stretch.mouse_pos_y, input * 1);
			}],
			['perlin(x,y,input * 3)', 1, function(input) {
				return plt.perlin.noise(plt.camera_stretch.mouse_pos_x, plt.camera_stretch.mouse_pos_y, input * 3);
			}],
			['perlin(x,y,0)', 1, function(input) {
				return plt.perlin.noise(plt.camera_stretch.mouse_pos_x, plt.camera_stretch.mouse_pos_y, input);
			}],




			['rand', 11, function(input) {
				return µ.rand(1);
			}],

			['rand+', 51, function(input) {
				var factor = 5;
				var repeats = Math.ceil(factor * plt.camera_stretch.mouse_pos_x);
				var val = 0;
				for (var i = 0; i < repeats; i++)
				{
					val += µ.rand(1);
				}
				val /= repeats;
				return val;
			}],
//*/

/*
			function(input) {
				return 1-input;
			},

			//	vCurve_FadeOut_VeryLate		= 1.0 - pow(1.0 - cos1, 7.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return 1.0 - Math.pow(1.0 - cos1, 12.0);
			},
			//	vCurve_FadeOut_Late			= 1.0 - pow(1.0 - cos1, 2.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return 1.0 - Math.pow(1.0 - cos1, 3.0);
			},

			//	vCurve_FadeOut_Early		= pow(cos1, 2.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return Math.pow(cos1, 3.0);
			},
			//	vCurve_FadeOut_VeryEarly	= pow(cos1, 7.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return Math.pow(cos1, 12.0);
			},
			//	vCurve_Arch					= pow(1.0 - cos2, 0.675);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return Math.pow(1.0 - cos2, plt.camera_stretch.mouse_pos_x);
			},
			//
			//	vCurve_FadeIn_VeryEarly		= 1.0 - pow(cos1, 7.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return 1.0 - Math.pow(cos1, 12.0);
			},
			//	vCurve_FadeIn_Early			= 1.0 - pow(cos1, 2.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return 1.0 - Math.pow(cos1, 3.0);
			},
			//	vCurve_FadeIn_Late			= pow(1.0 - cos1, 2.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return Math.pow(1.0 - cos1, 3.0);
			},
			//	vCurve_FadeIn_VeryLate		= pow(1.0 - cos1, 7.0);
			function(input) {
				var cos1 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510) / 2.0);
				var cos2 = (0.5 + Math.cos(input * 3.14159265358979323846264338327950288419716939937510 * 2.0) / 2.0);
				return Math.pow(1.0 - cos1, 12.0);
			},
*/


			['linear', 1, function(input) {
				return input;
			}],


			['hmmm', 1, function(input) {
				return Math.pow(Math.sin(input * 0.5 * 3.14159265358979323846264338327950288419716939937510), 0.0 + 50 * (plt.camera_stretch.mouse_pos_x));
			}],

			['softness', 1, function(input) {
				if (plt.camera_stretch.mouse_pos_x < 0.5)
				{
					return 1 - (Math.pow(1-input, plt.camera_stretch.mouse_pos_x * 2));
				}
				else
				{
					return (Math.pow(input, 1.0 - ((plt.camera_stretch.mouse_pos_x - 0.5) * 2)));
				}
			}],

			['combo0', 1, function(input) {
				var val1 = input;
				if (plt.camera_stretch.mouse_pos_x < 0.5)
				{
					var val2 = 1 - (Math.pow(1-input, plt.camera_stretch.mouse_pos_x * 2));
				}
				else
				{
					var val2 = (Math.pow(input, 1.0 - ((plt.camera_stretch.mouse_pos_x - 0.5) * 2)));
				}

				var frac = Math.pow(Math.abs(0.5 - input) * 2.0, 32);
				return val1 * frac + val2 * (1 - frac);
			}],




			['?', 1, function(input) {
				return (1.0 - Math.cos(Math.PI * input / 1)) / 2.0;
			}],

			['smoothstep', 1, function(input) {
				return Math.pow(input, 2) * (3 - 2 * input);
			}],
			['smootherstep', 1, function(input) {
					return Math.pow(input, 3) * (input * (input * 6 - 15) + 10);
			}],

		];

		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta) {
	plt.now += time_delta;
};

plt.render = function()
{
	//plt.c.flush_all();

	var resolution = 3500;
	var bar_width = 1 / resolution;
	var bar_width2 = 0.5 / resolution;



	for (var j = 0; j < plt.funcs.length; j++)
	{
		var hue = (j/plt.funcs.length);

		plt.fonts.draw_text(
			plt.funcs[j][0], 1,
			plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
			0.015,
			0.02 + j * 0.0185,
			0.0215, 0.025, 0.0035,
			hue * 360, 1, 0.7, .9,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);

		var func = plt.funcs[j][2];
		var repetitions = plt.funcs[j][1];
		for (var i = 0; i < resolution; i++)
		{
			for (var k = 0; k < repetitions; k++)
			{
				var output = func(i / resolution);
				plt.c.rectangle.draw(plt.CAM_STRETCH,
					i * bar_width + bar_width2,
					output,
					bar_width * 8.0,
					0.0195,
					90,
					hue * 360, 1.0, 0.6, 0.25,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
		}
	}

	//plt.c.flush_all();

	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 100) / 100), 1,
		plt.CAM_STRETCH, plt.FONT_DEFAULT, 0.85, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 200) / 100), 1,
		plt.CAM_STRETCH, plt.FONT_DEFAULT, 0.85, 0.9, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	plt.fonts.flush_all();

	plt.c.flush_all();

};
var app = new µ.app(plt, plt.init, plt.think, plt.render);