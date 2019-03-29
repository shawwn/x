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


		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta) {
	plt.now += time_delta;
};

plt.render = function()
{
	//plt.c.flush_all();

	var resolution = Math.round(2 + (300 * plt.camera_stretch.mouse_pos_x));
	var bar_width = 1 / resolution;
	var bar_width2 = 0.5 / resolution;

	var repetitions = 100;
	for (var i = 0; i < resolution; i++) 
	{
		var i_frac = i / (resolution - 1);
		//for (var k = 0; k < repetitions; k++) 
		for (var k = repetitions - 1; k >= 0; k--) 
		{
			var k_frac = k / (repetitions - 1);

			var k_frac2 = (k_frac * k_frac);


			var frac = (i_frac - 0.5) * 2;

			var output = plt.perlin.noise(

				frac * (7.5 + k_frac * 0.005),
				k_frac * .5 + frac * 0.5 + plt.now * (0.0001 + 0.001 * i_frac),
				(plt.now + (3 + 12000 * plt.camera_stretch.mouse_pos_y) * k_frac) * 0.0015);

			output = 1 - output;
			output = output * output * output * output * output;
			output = 1 - output;

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				i * bar_width + bar_width2,
				output * (0.0 + 1 * k_frac),
				bar_width,
				0.075 + k_frac2 * 0.05,
				90,
				150 + 50 * k_frac, 1, 0.25 + 0.25 * output,
				0.5 - 0.3 * k_frac2 * output,
				160 + 60 * k_frac, -1, -1, -1,
				170 + 70 * k_frac, -1, -1, -1,
				180 + 80 * k_frac, -1, -1, -1
			);
		}
	}


	plt.c.flush_all();

};
var app = new µ.app(plt, plt.init, plt.think, plt.render);