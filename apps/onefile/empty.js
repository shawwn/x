var plt = {};

plt.init = [
	function(bootloader_status)
	{
		plt.now = 0;		
		plt.cameras = new µ.Cameras2D(plt, window.innerWidth, window.innerHeight);
		plt.camera_landscape = plt.cameras.c[plt.CAM_LANDSCAPE];
		plt.camera_portrait = plt.cameras.c[plt.CAM_PORTRAIT];
		plt.camera_stretch = plt.cameras.c[plt.CAM_STRETCH];
		plt.c = new µ.canvas_webgl('bxx', 1, -1, -1, plt.cameras, {
				autoresize: true,
			});
		plt.input = new µ.input(plt.c.canvas, 1, plt.cameras);
		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		plt.fonts.add_font('font', 'Tahoma', 'normal', 700, 2048);
		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta) {
	plt.now += time_delta;
};

plt.render = function()
{
	plt.fonts.flush_all();
	plt.c.flush_all();
};
var app = new µ.app(plt, plt.init, plt.think, plt.render);