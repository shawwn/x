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

	plt.c.rectangle.draw(plt.CAM_STRETCH,
		0.5,
		0.5,
		1.0,
		1.0,
		90,
		120, 1.0, 0.6, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);

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