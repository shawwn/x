rvr.Map_Generator = function(map, preset)
{
	this.map = map;
	this.preset = preset;
	this.rand = new MersenneTwister();
}

rvr.Map_Generator.prototype.put_sector = function(sector, start_x, start_y, size_y, size_x)
{
	sector.generate(this.map, start_x, start_y, size_y, size_x)
}

rvr.Map_Generator.prototype.load = function(map_name)
{
	var self = this.map;

	this.map.tex_depthmap = rvr.c.load_texture('apps/_revret/img/map/' + map_name, false, function(image) {
		var cv = document.createElement('canvas');
		cv.width = image.width;
		cv.height = image.height;
		var ctx = cv.getContext('2d');
		ctx.drawImage(image, 0, 0);
		var imgd = ctx.getImageData(0, 0, image.width, image.height);
		self.pix_depthmap = imgd.data;
		self.map_depthmap_size = image.width;
		
		µ.log('depthmap loaded (' + self.map_depthmap_size + 'x' + self.map_depthmap_size + ')', µ.LOGLEVEL_VERBOSE);
	});
	this.map.tex_depthmap_interp_nearest = rvr.c.load_texture('apps/_revret/img/map/' + map_name, true, null);
	this.map.tex_heightmap	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_texture_size, this.map.map_texture_size, function(ctx, size_x, size_y, data) {
		for (var i = 0; i < data.polygon_count; i++)
		{
			data.polygons[i].draw_to_canvas(ctx, size_x, size_y, 1.0, 1.0, true, false);
		}
		var imgd = ctx.getImageData(0, 0, size_x, size_y);
		self.map_pixels = imgd.data;
	}, this), -1, true);
	this.map.tex_overlay	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_texture_size, this.map.map_texture_size, function(ctx, size_x, size_y, data) {
		for (var i = 0; i < data.polygon_count; i++)
		{
			data.polygons[i].draw_to_canvas(ctx, size_x, size_y, 1.0, 1.0, true, true);
		}
	}, this.map), -1, true);
}

rvr.Map_Generator.prototype.make_wall = function(pix_array, pix_colors, pix_walls, array_size_x, array_size_y, pos_x, pos_y, size_x, size_y, padding, min_height, max_height)
{
	var array_dim = array_size_x * array_size_y;
	//console.log('wall', array_size_x, array_size_y, pos_x, pos_y, size_x, size_y, padding);

	tile_index = ((pos_y - padding) * array_size_x + (pos_x - padding)) * 4;
	if (tile_index < 0 || tile_index >= array_dim * 4) { return; }

	var expected = pix_array[tile_index + 0];
	
	var expected_r = pix_colors[tile_index + 0];
	var expected_g = pix_colors[tile_index + 1];
	var expected_b = pix_colors[tile_index + 2];
	var expected_a = pix_colors[tile_index + 3];
/*
	var expected_r = 0;
	var expected_g = 0;
	var expected_b = 0;
	var expected_a = 0;
*/
	for (var x = pos_x - padding; x < (pos_x + size_x + padding); x++)
	{
		for (var y = pos_y - padding; y < (pos_y + size_y + padding); y++)
		{
			tile_index = (y * array_size_x + x) * 4;
			if (x < 0 || x >= array_size_x) { return; }
			if (y < 0 || y >= array_size_y) { return; }
//			if (tile_index < 0 || tile_index >= array_dim * 4) return;
			if (pix_array[tile_index + 0] != expected) { return; }
			if (pix_colors[tile_index + 0] != expected_r) { return; }
			if (pix_colors[tile_index + 1] != expected_g) { return; }
			if (pix_colors[tile_index + 2] != expected_b) { return; }
			if (pix_colors[tile_index + 3] != expected_a) { return; }
		}
	}
	var wall_height = expected + min_height + this.rand.int(max_height - min_height);
	if (wall_height > 255) wall_height = 255;
	for (var x = pos_x; x < (pos_x + size_x); x++)
	{
		for (var y = pos_y; y < (pos_y + size_y); y++)
		{
			if (max_height < 12)
			{
				var wall_color_r = 50;
				var wall_color_g = 50;
				var wall_color_b = 50;
			}
			else
			{
				var wall_color_r = 90;
				var wall_color_g = 90;
				var wall_color_b = 90;
			}
			tile_index = (y * array_size_x + x) * 4;
			pix_array[tile_index + 0] = wall_height;
			pix_array[tile_index + 1] = wall_height;
			pix_array[tile_index + 2] = wall_height;
			pix_array[tile_index + 3] = 255;

			pix_colors[tile_index + 0] = wall_color_r;
			pix_colors[tile_index + 1] = wall_color_g;
			pix_colors[tile_index + 2] = wall_color_b;
			pix_colors[tile_index + 3] = 110 + wall_height * 2;
		}
	}
}

rvr.Map_Generator.prototype.make_pit = function(pix_array, pix_colors, pix_walls, array_size_x, array_size_y, pos_x, pos_y, size_x, size_y, padding)
{
	var array_dim = array_size_x * array_size_y;

	tile_index = ((pos_y - padding) * array_size_x + (pos_x - padding)) * 4;
	if (tile_index < 0 || tile_index >= array_dim * 4) { return; }

	var expected = pix_array[tile_index + 0];
	var expected_r = pix_colors[tile_index + 0];
	var expected_g = pix_colors[tile_index + 1];
	var expected_b = pix_colors[tile_index + 2];

	for (var x = pos_x - padding; x < (pos_x + size_x + padding); x++)
	{
		for (var y = pos_y - padding; y < (pos_y + size_y + padding); y++)
		{
			tile_index = (y * array_size_x + x) * 4;
			if (x < 0 || x >= array_size_x) { return; }
			if (y < 0 || y >= array_size_y) { return; }
//			if (tile_index < 0 || tile_index >= array_dim * 4) return;
			if (pix_array[tile_index + 0] != expected) { return; }
			if (pix_colors[tile_index + 0] != expected_r) { return; }
			if (pix_colors[tile_index + 1] != expected_g) { return; }
			if (pix_colors[tile_index + 2] != expected_b) { return; }
		}
	}

	var wall_height = expected - 10 + this.rand.int(9);
	if (wall_height < 0) wall_height = 0;

	for (var x = pos_x; x < (pos_x + size_x); x++)
	{
		for (var y = pos_y; y < (pos_y + size_y); y++)
		{
			tile_index = (y * array_size_x + x) * 4;
				pix_array[tile_index + 0] = wall_height;
				pix_array[tile_index + 1] = wall_height;
				pix_array[tile_index + 2] = wall_height;
				pix_array[tile_index + 3] = 255;

				pix_colors[tile_index + 0] -= 20;
				pix_colors[tile_index + 1] -= 20;
				pix_colors[tile_index + 2] -= 20;
		}
	}

}


rvr.Map_Generator.prototype.make_room = function(pix_array, pix_colors, pix_walls, array_size_x, array_size_y, pos_x, pos_y, size_x, size_y, padding)
{
	var array_dim = array_size_x * array_size_y;

	// check for pre-existing rooms

	tile_index = ((pos_y - padding) * array_size_x + (pos_x - padding)) * 4;
	if (tile_index < 0 || tile_index >= array_dim * 4) return;

	var expected = pix_array[tile_index + 0];
	var expected_r = pix_colors[tile_index + 0];
	var expected_g = pix_colors[tile_index + 1];
	var expected_b = pix_colors[tile_index + 2];

	for (var x = pos_x - padding; x < (pos_x + size_x + padding); x++)
	{
		for (var y = pos_y - padding; y < (pos_y + size_y + padding); y++)
		{
			tile_index = (y * array_size_x + x) * 4;

			if (x < 0 || x >= array_size_x) return;
			if (y < 0 || y >= array_size_y) return;

//			if (tile_index < 0 || tile_index >= array_dim * 4) return;

			if (pix_array[tile_index + 0] != expected) return;

			if (pix_colors[tile_index + 0] != expected_r) return;
			if (pix_colors[tile_index + 1] != expected_g) return;
			if (pix_colors[tile_index + 2] != expected_b) return;
		}
	}

	var room_dim = size_x * size_y;


	var floor_height = expected; // - 12 + this.rand.int(24);
	if (floor_height < 0) floor_height = 0;
	var wall_height = floor_height + 50 + this.rand.int(100);
	if (wall_height > 255) wall_height = 255;

	if (room_dim < 20)
	{
		var floor_color_r = 80;
		var floor_color_g = 80;
		var floor_color_b = 80;
	}
	else if (room_dim < 40)
	{
		var floor_color_r = 60;
		var floor_color_g = 60;
		var floor_color_b = 60;
	}
	else
	{
		var floor_color_r = 40;
		var floor_color_g = 40;
		var floor_color_b = 40;
	}

	var floor_color = [0, 0, 0];
	//µ.HSL_to_RGB((floor_height / 255 * 360 * 10) % 360, 0.85, 0.4, floor_color);
	µ.HSL_to_RGB(160 + (room_dim * 1.4 % 360) % 360, 0.35, 0.3, floor_color);

	
	var floor_color_r = Math.round(floor_color[0] * 255);
	var floor_color_g = Math.round(floor_color[1] * 255);
	var floor_color_b = Math.round(floor_color[2] * 255);

	for (var x = pos_x; x < (pos_x + size_x); x++)
	{
		for (var y = pos_y; y < (pos_y + size_y); y++)
		{
			tile_index = (y * array_size_x + x) * 4;
			if 
				(
					(x == pos_x || x == (pos_x + size_x - 1) || y == pos_y || y == (pos_y + size_y - 1))
				)
			{
				pix_array[tile_index + 0] = wall_height;
				pix_array[tile_index + 1] = wall_height;
				pix_array[tile_index + 2] = wall_height;
				pix_array[tile_index + 3] = 255;

				pix_colors[tile_index + 0] = 150;
				pix_colors[tile_index + 1] = 150;
				pix_colors[tile_index + 2] = 150;
				pix_colors[tile_index + 3] = 255;
			}
			else
			{
				pix_array[tile_index + 0] = floor_height;
				pix_array[tile_index + 1] = floor_height;
				pix_array[tile_index + 2] = floor_height;
				pix_array[tile_index + 3] = 255;

				pix_colors[tile_index + 0] = floor_color_r;
				pix_colors[tile_index + 1] = floor_color_g;
				pix_colors[tile_index + 2] = floor_color_b;
				pix_colors[tile_index + 3] = 255;
			}
		}
	}
	
	var door_attempts = 1 + this.rand.int(2) + this.rand.int(Math.floor(size_x * size_y / 500)) + Math.ceil(size_x * size_y / 1500);

	for (var i = 0; i < door_attempts; i++)
	{
		var side = this.rand.int(3);
		if (side == 0)
		{
			var x = pos_x + 2 + this.rand.int(size_x - 5);
			var y = pos_y;
			var x2 = x + 1;
			var y2 = y;
			var x3 = x - 1;
			var y3 = y;
		}
		else if (side == 1)
		{
			var x = pos_x + 2 + this.rand.int(size_x - 5);
			var y = pos_y + size_y - 1;
			var x2 = x + 1;
			var y2 = y;
			var x3 = x - 1;
			var y3 = y;

		}
		else if (side == 2)
		{
			var x = pos_x;
			var y = pos_y + 2 + this.rand.int(size_y - 5);
			var x2 = x;
			var y2 = y + 1;
			var x3 = x;
			var y3 = y - 1;
		}
		else if (side == 3)
		{
			var x = pos_x + size_x - 1;
			var y = pos_y + 2 + this.rand.int(size_y - 5);
			var x2 = x;
			var y2 = y + 1;
			var x3 = x;
			var y3 = y - 1;
		}

		tile_index = (y * array_size_x + x) * 4;
		pix_array[tile_index + 0] = floor_height;
		pix_array[tile_index + 1] = floor_height;
		pix_array[tile_index + 2] = floor_height;
		pix_array[tile_index + 3] = 255;


		pix_colors[tile_index + 0] = floor_color_r;
		pix_colors[tile_index + 1] = floor_color_g;
		pix_colors[tile_index + 2] = floor_color_b;
		pix_colors[tile_index + 3] = 255;

		//if (this.rand.int(1))
		{
			tile_index = (y2 * array_size_x + x2) * 4;
			pix_array[tile_index + 0] = floor_height;
			pix_array[tile_index + 1] = floor_height;
			pix_array[tile_index + 2] = floor_height;
			pix_array[tile_index + 3] = 255;

			pix_colors[tile_index + 0] = floor_color_r;
			pix_colors[tile_index + 1] = floor_color_g;
			pix_colors[tile_index + 2] = floor_color_b;
			pix_colors[tile_index + 3] = 255;
		}
		//else
/*
		{
			tile_index = (y3 * array_size_x + x3) * 4;
			pix_array[tile_index + 0] = floor_height;
			pix_array[tile_index + 1] = floor_height;
			pix_array[tile_index + 2] = floor_height;
			pix_array[tile_index + 3] = 255;

			pix_colors[tile_index + 0] = floor_color_r;
			pix_colors[tile_index + 1] = floor_color_g;
			pix_colors[tile_index + 2] = floor_color_b;
			pix_colors[tile_index + 3] = 255;
		}
*/
	}
}

rvr.Map_Generator.prototype.gen = function(ctx, size_x, size_y)
{

	var imgd = ctx.getImageData(0, 0, size_x, size_y);
	var pix_array = imgd.data;
	var imgd2 = ctx.getImageData(0, 0, size_x, size_y);
	var pix_colors = imgd2.data;
	var imgd2 = ctx.getImageData(0, 0, size_x, size_y);
	var pix_walls = imgd2.data;
/*
	for (var i = 0; i < size_x * size_y; i++)
	{
		var x = i % size_x;
		var y = Math.floor(i / size_x);

		var val = Math.round((x / size_x + y / size_y) * 127);


		pix_array[i * 4] = val;
		pix_array[i * 4 + 1] = val;
		pix_array[i * 4 + 2] = val;
		pix_array[i * 4 + 3] = 255;
	}
*/
	var levels = 3; //+ this.rand.int(7);
	var level_colors = new Array(levels);
	var last_color = this.rand.int(360);
	for (var i = 0; i < levels; i++)
	{
		level_colors[i] = this.rand.int(360);
		//console.log(last_color, level_colors[i], µ.hue_distance(last_color, level_colors[i]), µ.hue_distance(level_colors[i], last_color));
		while (µ.hue_distance(last_color, level_colors[i]) < 90)
		{
			level_colors[i] = this.rand.int(360);
			//console.log('---', last_color, level_colors[i], µ.hue_distance(last_color, level_colors[i]), µ.hue_distance(level_colors[i], last_color));
		}
		last_color = level_colors[i];
	}
	var floor_color = [0, 0, 0];
	var floor_color2 = [0, 0, 0];
	var height_per_level = 255 / levels;
	var stair_width = 8;
	var last_height = -1;
	var stairs_side = 0;
	for (var y = 0; y < size_y; y++)
	{
		var y_frac = 1 - y / size_y;
		var level = (Math.floor(y_frac * levels));

		µ.HSL_to_RGB(level_colors[level], 0.00, 0.1, floor_color);

		var height_here = Math.floor(height_per_level * level);
		for (var x = 0; x < size_x; x++)
		{
				tile_index = (y * size_x + x) * 4;
				pix_array[tile_index + 0] = height_here;
				pix_array[tile_index + 1] = height_here;
				pix_array[tile_index + 2] = height_here;
				pix_array[tile_index + 3] = 255;

				pix_colors[tile_index + 0] = Math.round(floor_color[0] * 255);
				pix_colors[tile_index + 1] = Math.round(floor_color[1] * 255);
				pix_colors[tile_index + 2] = Math.round(floor_color[2] * 255);
				pix_colors[tile_index + 3] = 255;
		}
		if (last_height != height_here && y < (size_y -1))
		{
			var stairs_side = stairs_side ? 0 : 1;
			var lip_height = last_height + 30 + this.rand.int(20);
			if (lip_height > 255)
				lip_height = 255;
			µ.HSL_to_RGB(level_colors[level + 1], 0.00, 0.15, floor_color);
			for (var x = 0; x < size_x; x++)
			{
				tile_index = ((y - 1) * size_x + x) * 4;
				pix_array[tile_index + 0] = lip_height;
				pix_array[tile_index + 1] = lip_height;
				pix_array[tile_index + 2] = lip_height;
				pix_array[tile_index + 3] = 255;
				pix_colors[tile_index + 0] = Math.round(floor_color[0] * 255);
				pix_colors[tile_index + 1] = Math.round(floor_color[1] * 255);
				pix_colors[tile_index + 2] = Math.round(floor_color[2] * 255);
				pix_colors[tile_index + 3] = 255;
			}

			//for (var i = 1 + this.rand.int(3); i >= 0 ; i--)
			{
				var stair_width2 = 5 + this.rand.int(5);
				var stair_length2 = Math.ceil((32 + this.rand.int(48)) / levels);
				if (stairs_side)
				{
					var stair_start = Math.round(size_x * 0.75 + stair_width2 + this.rand.int(size_x * 0.25 - stair_width2 * 2));
				}
				else
				{
					var stair_start = Math.round(stair_width2 + this.rand.int(size_x * 0.25 - stair_width2 * 2));
				}

				for (var x = 0; x < stair_width2; x++)
				{
					var x_frac = x / stair_width2;
					for (var y2 = 0; y2 < stair_length2; y2++)
					{
						µ.HSL_to_RGB(level_colors[level], 0.00, 0.1, floor_color);
						µ.HSL_to_RGB(level_colors[level + 1], 0.00, 0.1, floor_color2);
						var y_frac = y2 / stair_length2;
						var step_height = Math.round(last_height - height_per_level + height_per_level * y_frac)
						tile_index = ((y - y2 - 1) * size_x + (stair_start + x)) * 4;
						pix_array[tile_index + 0] = step_height;
						pix_array[tile_index + 1] = step_height;
						pix_array[tile_index + 2] = step_height;
						pix_colors[tile_index + 0] = 220;
						pix_colors[tile_index + 1] = Math.round(20 * y_frac);
						pix_colors[tile_index + 2] = Math.round(220 - 200 * y_frac);
						pix_colors[tile_index + 3] = 50 + 85 * y_frac;
						pix_colors[tile_index + 0] = Math.round((floor_color2[0] * y_frac + floor_color[0] * (1 - y_frac)) * 255);
						pix_colors[tile_index + 1] = Math.round((floor_color2[1] * y_frac + floor_color[1] * (1 - y_frac)) * 255);
						pix_colors[tile_index + 2] = Math.round((floor_color2[2] * y_frac + floor_color[2] * (1 - y_frac)) * 255);
						pix_colors[tile_index + 3] = 255;
					}
				}
			}
		}
		last_height = height_here;
	}
	var padding = 2;
	var pit_attempts = 20;
	for (var i = 0; i < pit_attempts; i++)
	{
		this.make_pit(
			pix_array,
			pix_colors,
			pix_walls,
			size_x,
			size_y,
			this.rand.int(size_x - padding * 2),
			this.rand.int(size_x - padding * 2),
			4 + this.rand.int(5),
			2 + this.rand.int(20),
			1 + this.rand.int(2));
		this.make_pit(
			pix_array,
			pix_colors,
			pix_walls,
			size_x,
			size_y,
			this.rand.int(size_x - padding * 2),
			this.rand.int(size_x - padding * 2),
			2 + this.rand.int(20),
			4 + this.rand.int(5),
			1 + this.rand.int(2));
	}

	var wall_attempts = 10;
	for (var i = 0; i < wall_attempts; i++)
	{
		if (this.rand.int(1))
		{
			this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
				1,
				4 + this.rand.int(12),
				3 + this.rand.int(2),
				50,
				70
			);
		}
		else
		{
			this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
				4 + this.rand.int(12),
				1,
				3 + this.rand.int(2),
				50,
				70
			);
		}
	}

	var room_attempts = 75000;
	for (var i = 0; i < room_attempts; i++)
	{
		var size_factor = 1 - i / room_attempts;
		this.make_room(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			Math.round(20 - 15 * size_factor) + this.rand.int(15 * size_factor),
			Math.round(20 - 15 * size_factor) + this.rand.int(15 * size_factor),
			1
			);
	}

	for (var i = 0; i < room_attempts; i++)
	{
		var size_factor = 1 - i / room_attempts;
		size_factor *= size_factor;
		this.make_room(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			5 + this.rand.int(20 * size_factor),
			5 + this.rand.int(20 * size_factor),
			1
			);
	}

	var wall_attempts = 50;
	for (var i = 0; i < wall_attempts; i++)
	{
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			1,
			1 + this.rand.int(4),
			1,
			50,
			70
		);
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			1 + this.rand.int(4),
			1,
			12,
			50,
			70
			);
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			2,
			2,
			12,
			50,
			70
		);
	}

	var wall_attempts = 100;
	for (var i = 0; i < wall_attempts; i++)
	{
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			1,
			1 + this.rand.int(10),
			2,
			20,
			40
		);
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			1 + this.rand.int(10),
			1,
			2,
			20,
			40
		);
		this.make_wall(pix_array, pix_colors, pix_walls, size_x, size_y, this.rand.int(size_x - padding * 2), this.rand.int(size_x - padding * 2),
			2,
			2,
			2,
			20,
			40
		);
	}

	this.map.pix_depthmap = pix_array;
	this.map.pix_colors = pix_colors;
	ctx.putImageData(imgd, 0, 0);
//*/
}


rvr.Map_Generator.prototype.generate = function(seed)
{
	

	for (var x = 0; x < this.map.sectors_x; x++)
	{
		for (var y = 0; y < this.map.sectors_y; y++)
		{
			var pick = µ.pick_randomly_from_weighted_list(this.preset.sectors, function(item, index, dummy) {return item.weight}, null);
			var picked_sector = rvr.presets.map_sectors[this.preset.sectors[pick].name];
			this.put_sector(picked_sector, x, y, 1, 1);
		}
	}

	var self = this;

	this.rand.seed(seed);

	this.map.tex_depthmap	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_depthmap_size, this.map.map_depthmap_size, function(ctx, size_x, size_y, data) {
		self.gen(ctx, size_x, size_y, true);
	}, this), -1, false);

	var depthmap_size = this.map.map_depthmap_size * this.map.map_depthmap_size;
	var depthmap_side = this.map.map_depthmap_size;
	var drawn_depthmap_size = this.map.map_depthmap_size * this.map.map_depthmap_size * rvr.drawn_depth_map_scale * rvr.drawn_depth_map_scale;
	var drawn_depthmap_side = this.map.map_depthmap_size * rvr.drawn_depth_map_scale;

	this.map.tex_depthmap_interp_linear	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(drawn_depthmap_side, drawn_depthmap_side, function(ctx, size_x, size_y, data) {
		var imgd = ctx.getImageData(0, 0, size_x, size_y);
		var pix_array = imgd.data;
/*
		for (var i = 0; i < drawn_depthmap_size; i++)
		{
			var x = i % drawn_depthmap_side;
			var y = Math.floor(i / drawn_depthmap_side);
			var x2 = Math.floor(x / rvr.drawn_depth_map_scale);
			var y2 = Math.floor(y / rvr.drawn_depth_map_scale);
			pix_array[i * 4 + 0] = self.map.pix_depthmap[(y2 * self.map.map_depthmap_size + x2) * 4 + 0];
			pix_array[i * 4 + 1] = self.map.pix_depthmap[(y2 * self.map.map_depthmap_size + x2) * 4 + 1];
			pix_array[i * 4 + 2] = self.map.pix_depthmap[(y2 * self.map.map_depthmap_size + x2) * 4 + 2];
			pix_array[i * 4 + 3] = self.map.pix_depthmap[(y2 * self.map.map_depthmap_size + x2) * 4 + 3];
		}
		ctx.putImageData(imgd, 0, 0);
*/
		for (var i = 0; i < depthmap_size; i++)
		{
			var x = i % depthmap_side;
			var y = Math.floor(i / depthmap_side);
			var x2 = Math.floor(x * rvr.drawn_depth_map_scale);
			var y2 = Math.floor(y * rvr.drawn_depth_map_scale);

			ctx.fillStyle = "rgba("+
				self.map.pix_depthmap[(y * self.map.map_depthmap_size + x) * 4 + 0]+","+
				self.map.pix_depthmap[(y * self.map.map_depthmap_size + x) * 4 + 1]+","+
				self.map.pix_depthmap[(y * self.map.map_depthmap_size + x) * 4 + 2]+",1)";
			ctx.fillRect(x2, y2, rvr.drawn_depth_map_scale, rvr.drawn_depth_map_scale);
		}

	}, this), -1, false);



	this.map.tex_colors_interp_linear	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_depthmap_size * rvr.drawn_depth_map_scale, this.map.map_depthmap_size * rvr.drawn_depth_map_scale, function(ctx, size_x, size_y, data) {
		var imgd = ctx.getImageData(0, 0, size_x, size_y);
		var pix_array = imgd.data;

		for (var i = 0; i < drawn_depthmap_size; i++)
		{
			var x = i % drawn_depthmap_side;
			var y = Math.floor(i / drawn_depthmap_side);
			var x2 = Math.floor(x / rvr.drawn_depth_map_scale);
			var y2 = Math.floor(y / rvr.drawn_depth_map_scale);
			pix_array[i * 4 + 0] = self.map.pix_colors[(y2 * self.map.map_depthmap_size + x2) * 4 + 0];
			pix_array[i * 4 + 1] = self.map.pix_colors[(y2 * self.map.map_depthmap_size + x2) * 4 + 1];
			pix_array[i * 4 + 2] = self.map.pix_colors[(y2 * self.map.map_depthmap_size + x2) * 4 + 2];
			pix_array[i * 4 + 3] = self.map.pix_colors[(y2 * self.map.map_depthmap_size + x2) * 4 + 3];
		}
		ctx.putImageData(imgd, 0, 0);
	}, this), -1, false);




	var float_array = new Float32Array(this.map.map_depthmap_size * this.map.map_depthmap_size * 4 * rvr.drawn_depth_map_scale * rvr.drawn_depth_map_scale);
	for (var i = 0; i < this.map.map_depthmap_size * this.map.map_depthmap_size * 4; i++)
	{
		float_array[i] = this.map.pix_depthmap[i] / 255;
	}
	this.map.tex_depthmap_interp_nearest = rvr.c.texture_from_array(float_array, this.map.map_depthmap_size);



	var float_array = new Float32Array(this.map.map_depthmap_size * this.map.map_depthmap_size * 4);
	for (var i = 0; i < this.map.map_depthmap_size * this.map.map_depthmap_size * 4; i++)
	{

		float_array[i] = this.map.pix_colors[i] / 255;
	}
	this.map.tex_colors_interp_nearest = rvr.c.texture_from_array(float_array, this.map.map_depthmap_size);

/*
	this.rand.seed(seed);
	this.map.tex_depthmap_interp_nearest_old	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_depthmap_size, this.map.map_depthmap_size, function(ctx, size_x, size_y, data) {
		self.gen(ctx, size_x, size_y, false);
	}, this), -1, true);
*/

	this.map.tex_heightmap	= rvr.c.texture_from_canvas(µ.generate_canvas_texture(this.map.map_texture_size, this.map.map_texture_size, function(ctx, size_x, size_y, data) {
		var imgd = ctx.getImageData(0, 0, size_x, size_y);
		self.map.map_pixels = imgd.data;
	}, this), -1, true);
}


rvr.Map_Generator.prototype._ = function()
{
}