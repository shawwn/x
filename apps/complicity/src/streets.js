btx.Streets = function()
{
	this.street_count = 0;
	this.streets = new Array(0);
	this.street_crossings = new Array(0);
	this.street_lamps = new Array(0);
}

btx.Streets.prototype.add_street = function(is_border_street, start_x, start_y, end_x, end_y)
{
	this.streets.push(new btx.Street(is_border_street, start_x, start_y, end_x, end_y));
}

btx.Streets.prototype.add_street_lamp = function(pos_x, pos_y)
{
	if (	pos_x <= 0 || pos_x >= btx.world_size_x
		||	pos_y <= 0 || pos_y >= btx.world_size_y)
	{
		return;
	}
	for (var i = 0, len = this.street_lamps.length; i < len; i++)
	{
		var street_lamp = this.street_lamps[i];
		if (µ.distance2D(pos_x, pos_y, street_lamp.pos_x, street_lamp.pos_y) < 3.0)
		{
			return;
		}
	}
	var tolerance = 0.001;
	for (var i = 0, len = btx.cityblocks.cityblocks.length; i < len; i++)
	{
		var block = btx.cityblocks.cityblocks[i];
		if (
				pos_x > block.pos_x - block.size_x * 0.5
			&&	pos_x < block.pos_x + block.size_x * 0.5
			&&	pos_y > block.pos_y - block.size_y * 0.5
			&&	pos_y < block.pos_y + block.size_y * 0.5
			)
		{
			if (pos_x < block.pos_x - block.size_x * 0.5 + btx.street_width * 0.5 - tolerance)
			{
				return;
			}
			else if (pos_x > block.pos_x + block.size_x * 0.5 - btx.street_width * 0.5 + tolerance)
			{
				return;
			}
			else if (pos_y > block.pos_y + block.size_y * 0.5 - btx.street_width * 0.5 + tolerance)
			{
				return;
			}
			else if (pos_y < block.pos_y - block.size_y * 0.5 + btx.street_width * 0.5 - tolerance)
			{
				return;
			}
			break;
		}
	}
	this.street_lamps.push(new btx.Street_Lamp(pos_x, pos_y));
}

btx.Streets.prototype.place_street_lamps = function()
{
	for (var i = 0, len = this.streets.length; i < len; i++)
	{
		var street = this.streets[i];
		for (var j = 0; j < 10; j++)
		{
			if (street.is_horizontal)
			{
				var pos_x = street.start_x + µ.rand(street.end_x - street.start_x);
				if (µ.rand_int(1))
				{
					var pos_y = street.start_y + btx.street_width * 0.5 + btx.sidewalk_width * 0.25;
				}
				else
				{
					var pos_y = street.start_y - btx.street_width * 0.5 - btx.sidewalk_width * 0.25;
				}
			}
			else
			{
				var pos_y = street.start_y + µ.rand(street.end_y - street.start_y);
				if (µ.rand_int(1))
				{
					var pos_x = street.start_x + btx.street_width * 0.5 + btx.sidewalk_width * 0.25;
				}
				else
				{
					var pos_x = street.start_x - btx.street_width * 0.5 - btx.sidewalk_width * 0.25;
				}
			}
			this.add_street_lamp(pos_x, pos_y);
		}
	}
}

btx.Streets.prototype.add_street_crossing = function(hue, start_x, start_y, end_x, end_y)
{
	is_horizontal = start_y == end_y;
	for (var i = 0, len = this.street_crossings.length; i < len; i++)
	{
		var street_crossing = this.street_crossings[i];
		if (street_crossing.is_horizontal == is_horizontal)
		{
			if (is_horizontal && (start_x == street_crossing.start_x && end_x == street_crossing.end_x))
			{
				if (Math.abs(start_y - street_crossing.start_y) < 10)
				{
					return;
				}
			}
			else if (!is_horizontal && (start_y == street_crossing.start_y && end_y == street_crossing.end_y))
			{
				if (Math.abs(start_x - street_crossing.start_x) < 10)
				{
					return;
				}
			}
		}
	}
	var avg_pos_x = 0.5 * (start_x + end_x);
	var avg_pos_y = 0.5 * (start_y + end_y);
	// check for clashing streets
	for (var i = 0, len = this.streets.length; i < len; i++)
	{
		var street = this.streets[i];

		if (µ.distance2D(avg_pos_x, avg_pos_y, street.start_x, street.start_y) < btx.street_width * 1.0)
		{
			return;
		}
		if (µ.distance2D(avg_pos_x, avg_pos_y, street.end_x, street.end_y) < btx.street_width * 1.0)
		{
			return;
		}
	}
	this.street_crossings.push(new btx.Street_Crossing(hue, start_x, start_y, end_x, end_y));
}

btx.Streets.prototype.place_street_crossings = function()
{
	
	var dist_from_street_end = btx.street_width * 1.0;
	for (var i = 0, len = this.streets.length; i < len; i++)
	{
		var street = this.streets[i];
		if (!street.is_border_street)
		{
			if (street.is_horizontal)
			{
				this.add_street_crossing(0, street.start_x + dist_from_street_end, 	street.start_y - btx.street_width * 0.5, street.start_x + dist_from_street_end, street.start_y + btx.street_width * 0.5);
				this.add_street_crossing(30, street.end_x - dist_from_street_end, 	street.end_y - btx.street_width * 0.5, street.end_x - dist_from_street_end, 	street.end_y + btx.street_width * 0.5);
				for (var j = 0, attempts = (3 + 0.15 * Math.abs(street.end_x - street.start_x)); j < attempts; j++)
				{
					var pos_x = street.start_x + µ.rand(street.end_x - street.start_x);
					this.add_street_crossing(120, pos_x, 	street.start_y - btx.street_width * 0.5, pos_x, street.start_y + btx.street_width * 0.5);
				}
			}
			else
			{
				this.add_street_crossing(0, street.start_x - btx.street_width * 0.5, street.start_y + dist_from_street_end,	street.start_x + btx.street_width * 0.5,	street.start_y + dist_from_street_end);
				this.add_street_crossing(30, street.end_x - btx.street_width * 0.5, 	street.end_y - dist_from_street_end,		street.end_x + btx.street_width * 0.5, 	street.end_y - dist_from_street_end);
				for (var j = 0, attempts = (3 + 0.15 * Math.abs(street.end_y - street.start_y)); j < attempts; j++)
				{
					var pos_y = street.start_y + µ.rand(street.end_y - street.start_y);
					this.add_street_crossing(120, street.start_x - btx.street_width * 0.5, pos_y,	street.start_x + btx.street_width * 0.5,	pos_y);
				}
			}
		}
	}
}

btx.Streets.prototype.draw = function()
{
	for (var i = 0, len = this.streets.length; i < len; i++)
	{
		var street = this.streets[i];
		
		if (street.is_horizontal)
		{
			btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
				btx.tex_noise,
				street.start_x - btx.street_width * 0.5,
				street.start_y,
				street.end_x + btx.street_width * 0.5,
				street.end_y,
				btx.street_width,
				0.0, 0.0, 0.1, 1.0,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);
		}
		else
		{
			btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
				btx.tex_noise,
				street.start_x,
				street.start_y - btx.street_width * 0.5,
				street.end_x,
				street.end_y + btx.street_width * 0.5,
				btx.street_width,
				0.0, 0.0, 0.1, 1.0,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);
		}
	}
	btx.c.flush_all();
	for (var i = 0, len = this.streets.length; i < len; i++)
	{
		var street = this.streets[i];
		// yellow line
		btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
			btx.tex_noise,
			street.start_x,
			street.start_y,
			street.end_x,
			street.end_y,
			0.25,
			60.0, 1.0, 0.25, 1.0,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	//btx.c.flush_all();
	for (var i = 0, len = this.street_crossings.length; i < len; i++)
	{
		var street_crossing = this.street_crossings[i];
		btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
			btx.tex_noise,
			street_crossing.start_x,
			street_crossing.start_y,
			street_crossing.end_x,
			street_crossing.end_y,
			btx.street_crossing_width,
			street_crossing.hue, 0, 0.5, 0.5,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}
	btx.c.flush_all();
}

btx.Streets.prototype.draw_lamps = function()
{
	for (var i = 0, len = this.street_lamps.length; i < len; i++)
	{
		var street_lamp = this.street_lamps[i];
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			btx.tex_circle,
			street_lamp.pos_x,
			street_lamp.pos_y,
			0.25, 0.25,
			1, 1, 90,
			0, 0, 1.3, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			btx.tex_circle,
			street_lamp.pos_x,
			street_lamp.pos_y,
			0.1, 0.1,
			1, 1, 90,
			0, 0, 1.5, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	}
	btx.c.flush_all();
}

btx.Streets.prototype._ = function()
{
}
