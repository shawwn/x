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
		plt.rectangle_experiment = new µ.WebGL_Rectangle__Experiment(plt.c.gl, plt.cameras.c);
		plt.perlin = new µ.PerlinNoise();

		plt.parameter_index = 0;
		plt.parameters = [
			'HoleInner',
			'Stipple',
			'StippleSoftness',
			'StippleCount',
			'StippleOffset',
			'Boxiness',
			'Softness',
			'Hole',
			'NotYetUsed',
			'NotYetUsedSoftness',
			'CenterOffsetX',
			'CenterOffsetY',
		];
		plt.parameter_count = plt.parameters.length;
		plt.desired_values = [];
		for (var i = 0; i < plt.parameter_count; i++)
		{
			plt.desired_values[i] = 0.5;
		}
		// stipple
		plt.desired_values[1] = 0;
		// stipple softness
		plt.desired_values[2] = 0;
		// stipple count
		plt.desired_values[3] = 0;

		plt.input.KEY_CURSOR_UP.callback_press = function()
		{
			plt.parameter_index--;
			if (plt.parameter_index < 0)
			{
				plt.parameter_index = plt.parameter_count - 1;
			}
		};
		plt.input.KEY_CURSOR_DOWN.callback_press = function()
		{
			plt.parameter_index++;
			if (plt.parameter_index >= plt.parameter_count)
			{
				plt.parameter_index = 0;
			}
		};

		plt.input.KEY_SPACE.callback_press = function()
		{
			plt.desired_values[plt.parameter_index] = 0.5;
		}

		plt.input.KEY_CURSOR_RIGHT.callback_press = function()
		{

			plt.desired_values[plt.parameter_index] += 0.015;
			if (plt.desired_values[plt.parameter_index] > 1.0)
				plt.desired_values[plt.parameter_index] = 1.0;

		};
		plt.input.KEY_CURSOR_LEFT.callback_press = function()
		{
			plt.desired_values[plt.parameter_index] -= 0.015;
			if (plt.desired_values[plt.parameter_index] < 0)
				plt.desired_values[plt.parameter_index] = 0;
		};
		bootloader_status.info = 'done!';
	},
];

plt.think = function(time_delta)
{
	for (var i = 0; i < plt.parameter_count; i++)
	{
		var parameter = plt.parameters[i];

		if (parameter == 'StippleCount')
		{
			var val = 1 + Math.round(35 * plt.desired_values[i]);
		}
		else if (parameter == 'Hole')
		{
			var val = (0 + 1 * plt.desired_values[i])
		}
		else if (parameter == 'HoleInner')
		{
			var val = (-100 + 101 * plt.desired_values[i])
		}
		else if (parameter == 'Softness')
		{
			var val = (0 + 1.0 * plt.desired_values[i])
		}
		else if (parameter == 'NotYetUsedSoftness')
		{
			var val = (0 + 1.0 * plt.desired_values[i])
		}
		else if (parameter == 'Stipple')
		{
			var val = (0 + 1 * plt.desired_values[i])
		}
		else if (parameter == 'StippleSoftness')
		{
			var val = (0 + 1 * plt.desired_values[i])
		}
		else if (parameter == 'CenterOffsetX')
		{
			var val = (-1 + 2 * plt.desired_values[i])
		}
		else if (parameter == 'CenterOffsetY')
		{
			var val = (-1 + 2 * plt.desired_values[i])
		}
		else
		{
			var val = (-1 + 2 * plt.desired_values[i])
		}
		plt.rectangle_experiment['value_u' + parameter] = val;

	}

	//console.log(plt.rectangle_experiment.value_uOffsetY);

	plt.now += time_delta;
};

plt.render = function()
{

// when softness is 0, shape needs to be 1 for hole to have the full effect

// when softness is 0, hole needs to be > 0.5 to show up

	if (plt.input.KEY_LMB.pressed)
	{
		var parameter = plt.parameters[plt.parameter_index];
		//plt.rectangle_experiment['value_u' + parameter] = plt.camera_stretch.mouse_pos_x;
		plt.desired_values[plt.parameter_index] = plt.camera_stretch.mouse_pos_x;

	}

	if (plt.input.KEY_SPACE.pressed)
	{
		plt.rectangle_experiment.draw(plt.CAM_STRETCH,
			0.5, 0.5,
			plt.camera_stretch.mouse_pos_x, plt.camera_stretch.mouse_pos_y,
			90,
			45, 1.0, 0.5, 1,
			30, 1.0, 0.5, -1,
			15, 1.0, 0.5, -1,
			0, 1.0, 0.5, -1
		);
	}
	else
	{
		plt.rectangle_experiment.draw(plt.CAM_STRETCH,
			0.5, 0.5,
			1.0, 1.0,
			90,
			45, 1.0, 0.5, 1.0,
			30, 1.0, 0.5, 1.0,
			15, 1.0, 0.5, 1.0,
			0, 1.0, 0.5, 1.0
		);
	}

	plt.rectangle_experiment.flush_all();

	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_x * 10000) / 10000), 1,
		plt.CAM_STRETCH, plt.FONT_DEFAULT, 0.85, 0.95, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	plt.fonts.draw_text(
		"" + (Math.round(plt.camera_stretch.mouse_pos_y * 10000) / 10000), 1,
		plt.CAM_STRETCH, plt.FONT_DEFAULT, 0.85, 0.9, 0.035, 0.055, 0.01,
		0, 0, .3, .9,
		0, 0, .5, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	for (var i = 0; i < plt.parameter_count; i++)
	{
		var parameter = plt.parameters[i];

		plt.fonts.draw_text(
			plt.parameters[i], 1,
			plt.CAM_STRETCH, plt.FONT_DEFAULT,
			0.80,
			0.75 -  0.05 * i,
			0.025, 0.04, 0.0065,
			0, 1, i == plt.parameter_index ? 0.7 : 0.4, .9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
			);

		//var val = plt.rectangle_experiment['value_u' + parameter];

		var val = plt.desired_values[i];

		plt.c.rectangle.draw(plt.CAM_STRETCH,
				0.80 + 0.05,
				0.725 -  0.05 * i,
			0.1,
			0.0075,
			90,
			0, 1, 0.3, 0.5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
		);
		plt.c.rectangle.draw(plt.CAM_STRETCH,
				0.80 + 0.05 * val,
				0.725 -  0.05 * i,
			0.1 * val,
			0.0075,
			90,
			140 + 40 * val, 1.0, 0.5, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
		);

		plt.c.rectangle.draw(plt.CAM_STRETCH,
			0.5,
			0.25 - 0.02 * i,
			1,
			0.0125,
			90,
			120, 1, i == plt.parameter_index ? 0.15 : 0, 0.8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
		);

		plt.c.rectangle.draw(plt.CAM_STRETCH,
			0.5 * val,
			0.25 - 0.02 * i,
			val,
			0.0125,
			90,
			220, 1.0, i == plt.parameter_index ? 0.5 : 0.3, 0.85, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
		);
	}
	plt.c.flush_all();
	plt.fonts.flush_all();
};

var app = new µ.app(plt, plt.init, plt.think, plt.render);