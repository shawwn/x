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
		plt.font = plt.fonts.add_font( 'Tahoma', 'normal', 700, 2048);

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
	*/ 

	
			function(input) {
				return (1.0 - Math.cos(Math.PI * input / 1)) / 2.0;
			},
/*
			function(input) {
				return 0;
			},

			function(input) {
				return input;
			},

			function(input) {
				return Math.log(input);
			},

			function(input) {
				return Math.log(1 / input);
			},
*/

			// revret light falloff
	
			function(input) {
				if (plt.camera_stretch.mouse_pos_x < 0.5)
				{
					return (Math.pow(1-input, plt.camera_stretch.mouse_pos_x * 2));
				}
				else
				{
					return 1-(Math.pow(input, 1.0 - ((plt.camera_stretch.mouse_pos_x - 0.5) * 2)));
				}
			},
	

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

	var resolution = 2850;
	var bar_width = 1 / resolution;

	var factor = 5;

	for (var j = 0; j < plt.funcs.length; j++) 
	{
		var hue = (j/plt.funcs.length);
		for (var i = 0; i < resolution; i++) 
		{
			var output = plt.funcs[j](i / resolution);
			plt.c.rectangle.draw(plt.CAM_STRETCH,
				i * bar_width,
				0.5 + output / factor,
				bar_width,
				0.005,
				90,
				hue * 360, 1.0, 0.6, 0.75,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
			);
		}
	}

	//plt.c.flush_all();

	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 100000) / 100000), 1, 
		plt.CAM_STRETCH, plt.font, 0.05, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	plt.fonts.draw_text(
		"" + (Math.round(- (- 0.5 * factor + plt.camera_stretch.mouse_pos_y * factor) * 100000) / 100000), 1,
		plt.CAM_STRETCH, plt.font, 0.05, 0.90, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	plt.fonts.flush_all();

	plt.c.flush_all();

};
var app = new µ.app(plt, plt.init, plt.think, plt.render);