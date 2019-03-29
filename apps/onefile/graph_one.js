var plt = {
	think_freq: 1,
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

		var avg_mode = 0;
		var carry_over_mode = 0;
		var bucket_count = 24;
		var bucket_size = 6;
		var bucket_sizes = [];

		plt.ac = new µ.Accumulating_Graph(bucket_count, bucket_size, bucket_sizes, avg_mode, carry_over_mode);
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
			+ Math.sin(plt.now / 1123.7)
			+ Math.sin(plt.now / 1133.11)
			+ Math.sin(plt.now / 1163.11)
			+ Math.sin(plt.now / 1182.09)
			+ Math.sin(plt.now / 11125.22)
			+ Math.sin(plt.now / 11153.58)
			+ Math.sin(plt.now / 11185.22)
			+ Math.sin(plt.now / 111000.17)
			+ Math.sin(plt.now / 112233.7)
			+ Math.sin(plt.now / 113433.11)
			+ Math.sin(plt.now / 116433.11)
			+ Math.sin(plt.now / 118632.09)
			+ Math.sin(plt.now / 1112345.22)
			+ Math.sin(plt.now / 1115633.58)
			+ Math.sin(plt.now / 1118325.22)
		) / 16  );
		plt.input_val = Math.min(10, Math.max(-10, plt.input_val), plt.input_val);
	}
	plt.ac.put(plt.input_val);
}

plt.think = function(time_delta)
{
	plt.step();
	plt.now += time_delta;
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
		}
	}
	var val_range = max_val - min_val;


	plt.displayed_min_val = plt.displayed_min_val * 0.9 + 0.1 * min_val;
	plt.displayed_max_val = plt.displayed_max_val * 0.9 + 0.1 * max_val;
	plt.displayed_val_range = plt.displayed_val_range * 0.9 + 0.1 * val_range;



	for (var j = 0; j < plt.ac.bucket_count; j++)
	{
		var hue = (j / plt.ac.bucket_count);
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


	var j = 0;
	for (var j = 0; j < plt.ac.bucket_count; j++)
	{
		var segment_count = 0;
		var segment_size = 1;
		var b_raw_val = plt.ac.accum_bucket(j);
		b_val = (b_raw_val - plt.displayed_min_val) / plt.displayed_val_range;

//*
		//svar hue = (j/plt.ac.bucket_count) * 1.73;
		var hue = j * 0.09;
		var k = 0;
		while ((k + segment_size - 1) < plt.ac.bucket_sizes[j])
		{
			for (var s = 0; s < segment_size; s++)
			{
				k++;
			}
			segment_size++;
			segment_count++;
		}
		//console.log(segment_count + ' segments. ' + segment_size);
//*/
		var segment_size = 1;
/*
		var bar2_width = bar_width / plt.ac.bucket_sizes[j];
		var bar2_width2 = bar_width2 / plt.ac.bucket_sizes[j];
		var bar2_width3 = bar_width3 / plt.ac.bucket_sizes[j];
*/
		var bar2_width = bar_width / segment_count;
		var bar2_width2 = bar_width2 / segment_count;
		var bar2_width3 = bar_width3 / segment_count;

		var k = 0;
		var segment_index = 0;
		while ((k + segment_size - 1) < plt.ac.bucket_sizes[j])
		{
			var raw_val = 0;
			for (var s = 0; s < segment_size; s++)
			{
				var x_pos = plt.ac.bucket_indices[j] + k;
				if (x_pos >= plt.ac.bucket_sizes[j])
				{
					x_pos -= plt.ac.bucket_sizes[j];
				}
				if (x_pos < 0)
				{
					x_pos += plt.ac.bucket_sizes[j];
				}

//				x_pos = k;
				raw_val += plt.ac.buckets[j][x_pos];
				k++;
			}

			val = (raw_val / segment_size - plt.displayed_min_val) / plt.displayed_val_range;

			var hue = val * 1;

			var lum = 0.85;
			var width = 0.75;

			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - segment_index * bar2_width - bar2_width2,
				val / 2,
				bar2_width * width,
				val,
				90,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99,
				(hue * 360) % 360, 0.99, 0.5 * lum, 0.99
			);
			plt.c.rectangle.draw(plt.CAM_STRETCH,
				j * bar_width + bar_width - segment_index * bar2_width - bar2_width2,
				b_val - (b_val - val) / 2,
				bar2_width * 0.5,
				Math.abs(b_val - val),
				90,
				(hue * 360) % 360, 0.99, 0.2 * lum, 0.75,
				(hue * 360) % 360, 0.99, 0.2 * lum, 0.75,
				(hue * 360) % 360, 0.99, 0.2 * lum, 0.75,
				(hue * 360) % 360, 0.99, 0.2 * lum, 0.75
			);
			segment_size++;
			segment_index++;
		}
	}


	plt.c.flush_all();

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