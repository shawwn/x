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

		bootloader_status.info = 'stuff';

		plt.count_tiles = 200;

		plt.tile_depth = new Array(plt.count_tiles);

		
		// pretend these are two "textures"
		plt.tile_fluid_current = new Array(plt.count_tiles);
		plt.tile_fluid_other = new Array(plt.count_tiles);

		plt.tile_flow_current = new Array(plt.count_tiles);
		plt.tile_flow_other = new Array(plt.count_tiles);

		for (var i = 0; i < plt.count_tiles; i++)
		{
			plt.tile_depth[i] = 0.25 + 0.25 * Math.sin(i / 13.75) + 0.5 + 0.5 * Math.sin(i / (327 / (i * 0.0025)));

			plt.tile_fluid_current[i] = 0.125 + 0.125 * Math.sin(i * .0215);
			plt.tile_fluid_other[i] = plt.tile_fluid_current[i];

			plt.tile_flow_current[i] = 0;
			plt.tile_flow_other[i] = 0;

		}

		plt.current_tile = 0;
		plt.current_direction = +1;

		plt.space_pressed = false;


		plt.input = new µ.input(plt.c.canvas, 1, plt.cameras);
		plt.fonts = new µ.WebGL_Font(plt.c, plt.c.canvas.ctx, plt.cameras.c, plt.c.textures);
		
		plt.FONT_DEFAULT = plt.fonts.add_font('Tahoma', 'normal', 700, 2048);
		bootloader_status.info = 'done!';
	},
];

plt.sim_step = function()
{
	var flow = 0;

	//console.log('tile ' + plt.current_tile);

	var neighbour_tile = plt.current_tile + plt.current_direction;
	if (neighbour_tile >= 0 && neighbour_tile < plt.count_tiles)
	{
		var diff = (plt.tile_depth[neighbour_tile] + plt.tile_fluid_current[neighbour_tile]) - (plt.tile_depth[plt.current_tile] + plt.tile_fluid_current[plt.current_tile]);
		if (diff > 0) // neighbour higher
		{
			flow += Math.min(diff / 2, plt.tile_fluid_current[neighbour_tile]);
		}
	}
	var neighbour_tile = plt.current_tile - plt.current_direction;
	if (neighbour_tile >= 0 && neighbour_tile < plt.count_tiles)
	{
		var diff = (plt.tile_depth[neighbour_tile] + plt.tile_fluid_current[neighbour_tile]) - (plt.tile_depth[plt.current_tile] + plt.tile_fluid_current[plt.current_tile]);
		if (diff < 0) // neighbour lower
		{
			flow -= Math.min(- diff / 2, plt.tile_fluid_current[plt.current_tile]);
		}
	}


	//console.log(flow);

	plt.tile_fluid_other[plt.current_tile] = plt.tile_fluid_current[plt.current_tile] + plt.tile_flow_current[plt.current_tile] * 0.5;
	plt.tile_flow_other[plt.current_tile] = plt.tile_flow_current[plt.current_tile] * 0.5 + flow * 0.5;

/*
plt.tile_depth[plt.current_tile]
plt.tile_fluid[plt.current_tile]
plt.tile_depth[neighbour_tile]
plt.tile_fluid[neighbour_tile]
*/



	plt.current_tile++;
	if (plt.current_tile == plt.count_tiles)
	{
		plt.current_tile = 0;
		plt.current_direction *= -1;

			var temp = plt.tile_fluid_other;
			plt.tile_fluid_other = plt.tile_fluid_current;
			plt.tile_fluid_current = temp;

			var temp = plt.tile_flow_other;
			plt.tile_flow_other = plt.tile_flow_current;
			plt.tile_flow_current = temp;


		if (plt.current_direction == 1)
		{
		}


	}

}

plt.think = function(time_delta)
{

/*
	if (plt.space_pressed && !plt.input.KEY_SPACE.pressed)
	{
		plt.space_pressed = false;
	}
	else if (
		 //!plt.space_pressed && 
		plt.input.KEY_SPACE.pressed)
	{
		plt.space_pressed = true;
		plt.sim_step();
	}
*/

	for (var i = 0; i < plt.count_tiles; i++)
	{
		plt.tile_depth[i] =
			0.25 + 0.25 * Math.sin(i / 13.75 * (- 8.0 + plt.camera_stretch.mouse_pos_x * 16.0)) * plt.camera_stretch.mouse_pos_y
		+	0.5 + 0.5 * Math.sin(i / ((1 + 27 * (- 8.0 + plt.camera_stretch.mouse_pos_x * 16.0)))) * plt.camera_stretch.mouse_pos_y;
	}


	for (var i = 0; i < (plt.count_tiles * 16); i++)
	{
		plt.sim_step();
		plt.sim_step();
		plt.sim_step();
		plt.sim_step();
	}


	plt.now += time_delta;
};
plt.render = function()
{
	plt.c.flush_all();

	var bar_width = 1 / plt.count_tiles;
	var bar_width2 = 0.5 / plt.count_tiles;
	var bar_width4 = 0.25 / plt.count_tiles;

	for (var i = 0; i < plt.count_tiles; i++) 
	{
		if (i == plt.current_tile)
		{
			var lum = 0.8;
		}
		else
		{
			var lum = 0.3;
		}

		plt.c.rectangle.draw(plt.CAM_STRETCH,
			i * bar_width + bar_width / 2,
			plt.tile_depth[i] / 4,
			bar_width,
			plt.tile_depth[i] / 2,
			90,
			0, 0.0, lum, 0.6,
			0, 0.0, lum, 0.3,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);

		plt.c.rectangle.draw(plt.CAM_STRETCH,
			i * bar_width + bar_width2,
			plt.tile_depth[i] / 2 + plt.tile_fluid_current[i] / 4 ,
			bar_width,
			plt.tile_fluid_current[i] / 2,
			90,
			100 + plt.tile_flow_current[i] * 150, 1.0, lum, 0.6,
			100 + plt.tile_flow_current[i] * 150, 1.0, lum, 0.3,
			100 + plt.tile_flow_current[i] * 150, 1.0, lum, 0.9,
			-1, -1, -1, -1
		);
/*
		plt.c.rectangle.draw(plt.CAM_STRETCH,
			i * bar_width + bar_width2,
			plt.tile_depth[i] / 2 + plt.tile_flow_current[i] / 4 ,
			bar_width * 0.5,
			plt.tile_flow_current[i] / 2,
			90,
			110, 1.0, lum, 0.6,
			110, 1.0, lum, 0.3,
			-1, -1, -1, -1,
			-1, -1, -1, -1
		);
*/
	}

	plt.c.flush_all();
};
var app = new µ.app(plt, plt.init, plt.think, plt.render);