var plt = {
	think_freq: 5,
};

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
		plt.fonts.add_font('font', 'Tahoma', 'normal', 700, 2048);

		plt.displayed_min_val = 0;
		plt.displayed_max_val = 1;
		plt.displayed_val_range = 1;

		var avg_mode = 2;
		var carry_over_mode = 1;
		var bucket_count = 16;
		var bucket_size = 16;
		var bucket_sizes = [];

		var avg_mode = 0;
		var carry_over_mode = 0;
		var bucket_count = 8;
		var bucket_size = 10;
		var bucket_sizes = [
			10,
			60,
			60,
			24,
			7,
			4,
			12,
			20,
		];

		var avg_mode = 0;
		var carry_over_mode = 0;
		var bucket_count = 4;
		var bucket_size = 4;
		var bucket_sizes = [];
		var bucket_sizes = [
			128,
			64,
			32,
			16,
		];




		var avg_mode = 0;
		var carry_over_mode = 0;
		var bucket_count = 7;
		var bucket_size = 10;
		var bucket_sizes = [
			20,
			60,
			60,
			24,
			7,
			52,
			20,
		];

		var avg_mode = 0;
		var carry_over_mode = 0;
		var bucket_count = 24;
		var bucket_size = 3;
		var bucket_sizes = [];

		plt.ac = new µ.Accumulating_Graph(bucket_count, bucket_size, bucket_sizes, avg_mode, carry_over_mode);

		plt.ac_min = new µ.Accumulating_Graph(bucket_count, bucket_size, bucket_sizes, avg_mode, 3);
		plt.ac_max = new µ.Accumulating_Graph(bucket_count, bucket_size, bucket_sizes, avg_mode, 4);
		plt.ac_med = new µ.Accumulating_Graph(bucket_count, bucket_size, bucket_sizes, avg_mode, 2);

/*
		function print_time_blah(bucket_index, factor, string)
		{
			var bsize = plt.ac.bucket_sizes[bucket_index] != undefined ? plt.ac.bucket_sizes[bucket_index] : bucket_size;
			for (var b = 0; b <= bucket_index; b++)
			{
			}
			return (Math.pow(bucket_size, b) / (1000 / plt.think_freq) / factor) + ' ' + string;
		}
		for (var b = 0; b < bucket_count; b++)
		{
			let bsize = plt.ac.bucket_sizes[b];
			console.log('------------- --- -- -  -   -   -   ' + b);
			console.log(Math.pow(bsize, b));
			console.log(print_time_blah(bsize, 1, " seconds"));
			console.log(print_time_blah(bsize, 60, " minutes"));
			console.log(print_time_blah(bsize, 60 * 60, "hours"));
			console.log(print_time_blah(bsize, 60 * 60 * 24, "days"));
			console.log(print_time_blah(bsize, 60 * 60 * 24 * 7, "weeks"));
			console.log(print_time_blah(bsize, 60 * 60 * 24 * 365, "years"));
			console.log(print_time_blah(bsize, 60 * 60 * 24 * 36500, "centuries"));
		}
*/
		plt.input_val = 0.995;
		plt.data_precalc_steps =  0;
		plt.data_precalc_progress = 0;
		plt.data_precalc_done = false;
		bootloader_status.info = 'Blah';
		plt.do_auto_input = false;
		plt.input.KEY_SPACE.callback_press = function()
		{
			plt.do_auto_input = !plt.do_auto_input;
		};
	},
	function(bootloader_status)
	{

		plt.data_precalc_progress += 1 / plt.data_precalc_steps;
/*
		for (var i = 0; i < (75000); i++)
		{
			plt.now += plt.think_freq;
			plt.step();
		}
*/
		bootloader_status.info = 'precalculating data<br>' + Math.round(plt.data_precalc_progress * 100) + '%';
		//console.log(plt.data_precalc_progress);
		bootloader_status.progress = plt.data_precalc_progress;
	},
	function(bootloader_status)
	{
		plt.data_precalc_done = true;
		bootloader_status.info = 'done!';
	},
];

plt.step = function()
{
	
	if (plt.data_precalc_done && plt.input.KEY_LMB.pressed)
	{
		plt.input_val = 1.0 - 1.0 * plt.camera_stretch.mouse_pos_y;
	}
	else if (!plt.data_precalc_done || plt.do_auto_input)
	{
		plt.input_val = 0.5 + (
		(
			0
			+ Math.sin(plt.now / 110.17)
			+ Math.sin(plt.now / 423.7)
			+ Math.sin(plt.now / 533.11)
			+ Math.sin(plt.now / 663.11)
			+ Math.sin(plt.now / 782.09)
			+ Math.sin(plt.now / 1125.22)
			+ Math.sin(plt.now / 2153.58)
			+ Math.sin(plt.now / 3185.22)
			+ Math.sin(plt.now / 41000.17)
			+ Math.sin(plt.now / 12233.7)
			+ Math.sin(plt.now / 23433.11)
			+ Math.sin(plt.now / 36433.11)
			+ Math.sin(plt.now / 48632.09)
			+ Math.sin(plt.now / 112345.22)
			+ Math.sin(plt.now / 215633.58)
			+ Math.sin(plt.now / 318325.22)
		) / 16  );
		plt.input_val = Math.min(10, Math.max(-10, plt.input_val), plt.input_val);
	}
	plt.ac.put(plt.input_val);
	plt.ac_min.put(plt.input_val);
	plt.ac_max.put(plt.input_val);
	plt.ac_med.put(plt.input_val);
	//plt.ac_min.put(plt.input_val * (0.5 + 0.4 * Math.sin(plt.now / 210.17)));
	//plt.ac_max.put(plt.input_val * (1.5 + 0.4 * Math.sin(plt.now / 210.17)));
}

plt.think = function(time_delta)
{
	for (var i = 0; i < (1 + 2000 * plt.camera_stretch.mouse_pos_x); i++)
	{
		plt.step();
		plt.now += time_delta;
	}
};

plt.render = function()
{
	var bar_width = 1 / plt.ac.bucket_count;
	var bar_width2 = 0.5 / plt.ac.bucket_count;
	var bar_width3 = 0.333 / plt.ac.bucket_count;
	
	var max_val = -9999999999999;
	var min_val = 9999999999999;

	var max_val = plt.displayed_max_val;
	var min_val = plt.displayed_min_val;
	for (var j = 0; j < plt.ac.bucket_count; j++) 
	{
		for (var k = plt.ac.bucket_sizes[j] - 1; k >= 0; k--) 
		{
			max_val = Math.max(max_val, plt.ac.buckets[j][k]);
			min_val = Math.min(min_val, plt.ac.buckets[j][k]);
			max_val = Math.max(max_val, plt.ac_min.buckets[j][k]);
			min_val = Math.min(min_val, plt.ac_min.buckets[j][k]);
			max_val = Math.max(max_val, plt.ac_max.buckets[j][k]);
			min_val = Math.min(min_val, plt.ac_max.buckets[j][k]);
		}
	}
	var val_range = max_val - min_val;


	plt.displayed_min_val = plt.displayed_min_val * 0.9 + 0.1 * min_val;
	plt.displayed_max_val = plt.displayed_max_val * 0.9 + 0.1 * max_val;
	plt.displayed_val_range = plt.displayed_val_range * 0.9 + 0.1 * val_range;



	for (var j = 0; j < plt.ac.bucket_count; j++) 
	{
		var hue = (j + 0) * 0.09;
		var bar2_width = bar_width / plt.ac.bucket_sizes[j];
		var bar2_width2 = bar_width2 / plt.ac.bucket_sizes[j];
		var bar2_width3 = bar_width3 / plt.ac.bucket_sizes[j];
		for (var k = plt.ac.bucket_sizes[j] - 1; k >= 0; k--) 
		{
			var k_frac = k / (plt.ac.bucket_sizes[j] - 1);
			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - k * bar2_width - bar2_width2,
				0.5,
				bar2_width * 0.4,
				1.0,
				90,
				(hue * 360) % 360, 1, 0.5, 0.045,
				(hue * 360) % 360, 1, 0.5, 0.045,
				(hue * 360) % 360, 1, 0.5, 0.045,
				(hue * 360) % 360, 1, 0.5, 0.045
			);
		}
	}

	plt.c.flush_all();

//*/
	//var prev_bucket_average_val = plt.ac.accum_bucket(0);

	for (var j = 0; j < plt.ac.bucket_count; j++) 
	{
		var b_raw_val = plt.ac.accum_bucket(j);
		b_val = (b_raw_val - plt.displayed_min_val) / plt.displayed_val_range;

		var bar2_width = bar_width / plt.ac.bucket_sizes[j];
		var bar2_width2 = bar_width2 / plt.ac.bucket_sizes[j];
		var bar2_width3 = bar_width3 / plt.ac.bucket_sizes[j];
		//svar hue = (j/plt.ac.bucket_count) * 1.73;
		var hue = j * 0.09;
		for (var k = plt.ac.bucket_sizes[j] - 1; k >= 0; k--) 
		{
			var k_frac = k / (plt.ac.bucket_sizes[j] - 1);
			var x_pos = plt.ac.bucket_indices[j] + k;
			if (x_pos >= plt.ac.bucket_sizes[j])
			{
				x_pos -= plt.ac.bucket_sizes[j];
			}
			if (x_pos < 0)
			{
				x_pos += plt.ac.bucket_sizes[j];
			}


			var lum = 1.0;
			var width = 0.8;

			var alpha = 1.0;


			val = (plt.ac.buckets[j][x_pos] - plt.displayed_min_val) / plt.displayed_val_range;
			val_min = (plt.ac_min.buckets[j][x_pos] - plt.displayed_min_val) / plt.displayed_val_range;
			val_max = (plt.ac_max.buckets[j][x_pos] - plt.displayed_min_val) / plt.displayed_val_range;
			val_med = (plt.ac_med.buckets[j][x_pos] - plt.displayed_min_val) / plt.displayed_val_range;

			val_min_diff = val - val_min;
			
			val_max_diff = val_max - val;



			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - k * bar2_width - bar2_width2,
				val_min / 2,
				bar2_width * width * 0.125,
				val_min,
				90,
				(hue * 360) % 360, 0.99, 0.25 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.25 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.25 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.25 * lum, 0.99 * alpha
			);

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - k * bar2_width - bar2_width2,
				val_min + val_min_diff / 2,
				bar2_width * width * 0.8,
				val_min_diff,
				90,
				(hue * 360) % 360, 0.99, 0.35 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.35 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.35 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.35 * lum, 0.99 * alpha
			);

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - k * bar2_width - bar2_width2,
				val + val_max_diff / 2,
				bar2_width * width * 0.5,
				val_max_diff,
				90,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99 * alpha
			);

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - k * bar2_width - bar2_width2 * 2,
				val_med,
				bar2_width * width * 0.25,
				bar2_width * width * 0.25,
				90,
				(hue * 360 + 30) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360 + 30) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360 + 30) % 360, 0.99, 0.5 * lum, 0.99 * alpha,
				(hue * 360 + 30) % 360, 0.99, 0.5 * lum, 0.99 * alpha
			);

		}
	}
	plt.c.flush_all();

/*
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE, plt.c.gl.FUNC_ADD);
	for (var j = 0; j < plt.ac.bucket_count; j++) 
	{
		var hue = (j + 0) * 0.09;
		var raw_val = plt.ac.accum_bucket(j);
		val = (raw_val - plt.displayed_min_val) / plt.displayed_val_range;

		//var hue = raw_val * 0.098;

		plt.c.rectangle.draw(plt.CAM_STRETCH,
			j * bar_width + bar_width2 + bar_width2 * 0.001,
			val,
			bar_width * 0.999,
			0.005,
			90,
			(hue * 360) % 360, 0.95, 0.3, 0.8,
			(hue * 360) % 360, 0.95, 0.4, 0.8,
			(hue * 360) % 360, 0.95, 0.7, 0.8,
			(hue * 360) % 360, 0.95, 0.7, 0.8
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			j * bar_width + bar_width2 + bar_width2 * 0.001,
			val,
			bar_width * 0.999,
			0.01,
			90,
			(hue * 360) % 360, 0.95, 0.3, 0.4,
			(hue * 360) % 360, 0.95, 0.4, 0.4,
			(hue * 360) % 360, 0.95, 0.5, 0.4,
			(hue * 360) % 360, 0.95, 0.5, 0.4
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			j * bar_width + bar_width2 + bar_width2 * 0.001,
			val,
			bar_width * 0.999,
			0.02,
			90,
			(hue * 360) % 360, 0.95, 0.3, 0.2,
			(hue * 360) % 360, 0.95, 0.4, 0.2,
			(hue * 360) % 360, 0.95, 0.5, 0.2,
			(hue * 360) % 360, 0.95, 0.5, 0.2
		);
	}
	plt.c.flush_all();
	plt.c.set_blending(plt.c.gl.SRC_ALPHA, plt.c.gl.ONE_MINUS_SRC_ALPHA, plt.c.gl.FUNC_ADD);
//*/

	var val = 1.0 - plt.camera_stretch.mouse_pos_y;
	plt.c.rectangle.draw(plt.CAM_STRETCH,
		0.00075,
		val / 2,
		0.0015,
		val,
		90,
		hue * 360, 1.0, 1.0, 0.5,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);


/*
	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 100) / 100),
		plt.CAM_STRETCH, 'font', 0.05, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);
	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 200) / 100),
		plt.CAM_STRETCH, 'font', 0.05, 0.9, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);
	plt.fonts.flush_all();
*/
	plt.c.flush_all();
};
var app = new µ.app(plt, plt.init, plt.think, plt.render, plt.think_freq, 1000);