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
			['µ.randerp(0.5, input_x * 0.5, .01)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, .01);
			}],
			['µ.randerp(0.5, input_x * 0.5, .1)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, .1);
			}],
			['µ.randerp(0.5, input_x * 0.5, 1)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, 1);
			}],
			['µ.randerp(0.5, input_x * 0.5, 10)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, 10);
			}],
			['µ.randerp(0.5, input_x * 0.5, 100)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, 100);
			}],
			['µ.randerp(0.5, input_x * 0.5, 1000)', 1, function(input_x, input_y) {
				return µ.randerp(0.5, input_x * 0.5, 1000);
			}],

			
			['perlin(input_x * 256, input_y * 256, 0)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, 0);
			}],

			['perlin(input_x * 256, input_y * 256, mouse_x)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, plt.camera_stretch.mouse_pos_x);
			}],

			['perlin(input_x * 256, input_y * 256, time * 0.001)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, plt.now * 0.001);
			}],
			['perlin(input_x * 256, input_y * 256, time * 0.005)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, plt.now * 0.005);
			}],
			['perlin(input_x * 256, input_y * 256, time * 0.01)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, plt.now * 0.01);
			}],

			['perlin(input_x * 256, input_y * 256, time * 0.1)', 1, function(input_x, input_y) {
				return plt.perlin.noise(input_x * 256, input_y * 256, plt.now * 0.1);
			}],



			['rand + rand + rand + rand + rand + rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1)) / 7;
			}],
			['rand + rand + rand + rand + rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1)) / 6;
			}],
			['rand + rand + rand + rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1)) / 5;
			}],
			['rand + rand + rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1) + µ.rand(1) + µ.rand(1)) / 4;
			}],
			['rand + rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1) + µ.rand(1)) / 3;
			}],
			['rand + rand', 1, function(input_x, input_y) {
				return (µ.rand(1) + µ.rand(1)) / 2;
			}],
			['rand', 1, function(input_x, input_y) {
				return µ.rand(1);
			}],


		];

		plt.func_count = plt.funcs.length;

		plt.func_index = 0;
		
		plt.display_mode = true;

		plt.input.KEY_SPACE.callback_press = function()
		{
			plt.display_mode = !plt.display_mode;
		};
		
		plt.input.KEY_CURSOR_LEFT.callback_press = function()
		{
			plt.func_index--;
			if (plt.func_index < 0)
			{
				plt.func_index = plt.func_count - 1;
			}
		};

		plt.input.KEY_CURSOR_RIGHT.callback_press = function()
		{
			plt.func_index++;
			if (plt.func_index >= plt.func_count)
			{
				plt.func_index = 0;
			}
		};


		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta) {
	plt.now += time_delta;
};

plt.render = function()
{
	//plt.c.flush_all();
	
	var resolution_x = 100;
	var resolution_y = 100;
	var block_width = 1 / resolution_x;
	var block_width2 = 0.5 / resolution_x;
	var block_height = 1 / resolution_y;
	var block_height2 = 0.5 / resolution_y;

	var func = plt.funcs[plt.func_index];


	if (!plt.display_mode)
	{
		for (var x = 0; x < resolution_x; x++) 
		{
			var frac_x = x / (resolution_x - 1);
			var val = 0;
			for (var y = 0; y < resolution_y; y++) 
			{
				var frac_y = y / (resolution_y - 1);
				val += func[2](frac_x, frac_y);
			}
			
			val /= resolution_y;

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				x * block_width + block_width2,
				val,
				block_width,
				block_height,
				90,
				0, 0, 1, 1.0,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
			);
		}
	}
	else
	{
		for (var x = 0; x < resolution_x; x++) 
		{
			var frac_x = x / (resolution_x - 1);
			for (var y = 0; y < resolution_y; y++) 
			{
				var frac_y = y / (resolution_y - 1);
				var val = func[2](frac_x, frac_y);
				plt.c.rectangle.draw(plt.CAM_STRETCH,
					x * block_width + block_width2,
					y * block_height + block_height2,
					block_width,
					block_height,
					90,
					0, 0, val, 1.0,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
				);
			}
		}	}


	plt.c.flush_all();


	plt.fonts.draw_text(
		func[0], 1,
		plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
		0.016,
		0.039,
		0.0215, 0.025, 0.0035,
		60, 0, 0, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	plt.fonts.draw_text(
		func[0], 1,
		plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
		0.016,
		0.041,
		0.0215, 0.025, 0.0035,
		60, 0, 0, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	plt.fonts.draw_text(
		func[0], 1,
		plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
		0.014,
		0.039,
		0.0215, 0.025, 0.0035,
		60, 0, 0, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	plt.fonts.draw_text(
		func[0], 1,
		plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
		0.014,
		0.041,
		0.0215, 0.025, 0.0035,
		60, 0, 0, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);

	plt.fonts.draw_text(
		func[0], 1,
		plt.CAM_LANDSCAPE, plt.FONT_DEFAULT,
		0.015,
		0.04,
		0.0215, 0.025, 0.0035,
		60, 1, 0.5, .9,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);


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