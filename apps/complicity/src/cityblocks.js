
btx.Cityblocks = function()
{
	this.cityblock_count = 1;
	this.cityblocks = new Array(0);
	this.cityblocks[0] = new btx.Cityblock(	this.cityblocks.length,
											0,
											btx.world_size_x * 0.5,
											btx.world_size_y * 0.5,
											btx.world_size_x - btx.street_width,
											btx.world_size_y - btx.street_width);
	this.subdivision_steps = 15;
	this.subdivision_steps_done = 0;
	this.allocation_steps = 40;
	this.allocation_steps_done = 0;
	this.house_steps = 0;
	this.house_steps_done = 0;

	btx.streets.add_street(	true,
							btx.street_width * 0.5, btx.street_width * 0.5,
							btx.street_width * 0.5, btx.world_size_y - btx.street_width * 0.5);

	btx.streets.add_street(	true,
							btx.street_width * 0.5, btx.street_width * 0.5,
							btx.world_size_x - btx.street_width * 0.5, btx.street_width * 0.5);

	btx.streets.add_street(	true,
							btx.world_size_x - btx.street_width * 0.5, btx.world_size_y - btx.street_width * 0.5,
							btx.world_size_x - btx.street_width * 0.5, btx.street_width * 0.5);

	btx.streets.add_street(	true,
							btx.world_size_x - btx.street_width * 0.5, btx.world_size_y - btx.street_width * 0.5,
							btx.street_width * 0.5, btx.world_size_y - btx.street_width * 0.5);

}


btx.Cityblocks.prototype.subdivide_cityblocks = function()
{
	for (var j = 0, len = this.cityblocks.length; j < len; j++)
	{
		var block = this.cityblocks[j];
		var size_x = block.size_x - btx.street_width * 1.0 - btx.sidewalk_width * 2.0;
		var size_y = block.size_y - btx.street_width * 1.0 - btx.sidewalk_width * 2.0;
		var area = size_x * size_y;

		if (
					(size_x > 15 && size_y > 15 && area > 250 && µ.rand_int(1) > 0.95)
				//||	(size_x > 20 && size_y > 20 && area > 600)
			)
		{
			var split_orientation = µ.rand_int(1) == 0;
			if (block.size_x > block.size_y)
			{
				split_orientation = true;
			}
			else
			{
				split_orientation = false;
			}
			this.split_block(j, split_orientation);
		}
		else
		{
			if (size_x > 60 && µ.rand_int(1) > 0.87)
			{
				this.split_block(j, true);
			}
			else if (size_y > 60 && µ.rand_int(1) > 0.87)
			{
				this.split_block(j, false);
			}
		}
	}
	this.subdivision_steps_done++;
	if (this.subdivision_steps_done >= this.subdivision_steps - 1)
	{
		this.house_steps = this.cityblocks.length;
	}
	return (this.subdivision_steps_done / (this.subdivision_steps - 1));
}

btx.Cityblocks.prototype.allocate_cityblock_types = function()
{
	for (var i = 0, len = this.cityblocks.length; i < len; i++)
	{
		var block = this.cityblocks[i];

		if (block.type == btx.CITYBLOCK_TYPE__EMPTY_LOT)
		{
			var size_x = block.size_x - btx.street_width * 1.0 - btx.sidewalk_width * 2.0;
			var size_y = block.size_y - btx.street_width * 1.0 - btx.sidewalk_width * 2.0;
			var area = size_x * size_y;
			for (var j = 1, len2 = btx.cityblock_types.length; j < len2; j++)
			{
				var type = btx.cityblock_types[j];

				if (		µ.rand(1) <= type.probability
						&&	(type.count < type.max_num_total 	|| type.max_num_total == -1)
						&&	(size_x >= type.min_size_x 			|| type.min_size_x == -1)
						&&	(size_y >= type.min_size_y 			|| type.min_size_y == -1)
						&&	(area >= type.min_area 				|| type.min_area == -1)
						&&	(size_x <= type.max_size_x 			|| type.max_size_x == -1)
						&&	(size_y <= type.max_size_y 			|| type.max_size_y == -1)
						&&	(area <= type.max_area 				|| type.max_area == -1)
					)
				{

					var clash_found = false;
					if (type.min_dist_to_same != -1)
					{
						for (var k = 0, len3 = this.cityblocks.length; k < len3; k++)
						{
							if (i != k && this.cityblocks[k].type == j)
							{
								var dist = µ.distance2D(block.pos_x, block.pos_y, this.cityblocks[k].pos_x, this.cityblocks[k].pos_y);
								if (dist < type.min_dist_to_same)
								{
									clash_found = true;
									break;
								}
							}
						}
					}
					if (!clash_found)
					{
						block.type = j;
						type.count++;
						break;
					}
				}
			}
		}
	}
	this.allocation_steps_done++;
	return (this.allocation_steps_done / (this.allocation_steps - 1));
}

btx.Cityblocks.prototype.add_houses = function()
{
	var i = this.house_steps_done;
	var block = this.cityblocks[i];
	block.add_houses();
	this.house_steps_done++;
	return (this.house_steps_done / (this.house_steps - 0));
}

btx.Cityblocks.prototype.do_rest = function()
{
	btx.streets.place_street_crossings();
	btx.streets.place_street_lamps();
	console.log(this.cityblocks.length + ' blocks');
	console.log(btx.streets.streets.length + ' streets');
	console.log(btx.streets.street_crossings.length + ' street crossings');
	return 1.0;
}

btx.Cityblocks.prototype.closests_block_of_type = function(pos_x, pos_y, cityblock_type)
{
	for (var i = 0, len = this.cityblocks.length; i < len; i++)
	{
		var block = this.cityblocks[i];
	}
}

btx.Cityblocks.prototype.split_block = function(block_index, split_vertically)
{
	var block_to_split = this.cityblocks[block_index];
	var split_ratio1 = 0.35 + µ.rand(0.3);
	var split_ratio2 = 1.0 - split_ratio1;
	if (split_vertically)
	{
		var start_pos_x = (block_to_split.pos_x - block_to_split.size_x * 0.5);
		var split_size_x = block_to_split.size_x * split_ratio2;
		var split_size1_x = block_to_split.size_x * split_ratio1;
		block_to_split.size_x = block_to_split.size_x * split_ratio1;
		block_to_split.pos_x = start_pos_x + block_to_split.size_x * 0.5;
		var split_pos_x = start_pos_x + block_to_split.size_x + split_size_x * 0.5;
		this.cityblocks.push(new btx.Cityblock(this.cityblocks.length, 0, split_pos_x, block_to_split.pos_y, split_size_x, block_to_split.size_y));
		btx.streets.add_street(	false,
								start_pos_x + split_size1_x , block_to_split.pos_y - block_to_split.size_y * 0.5,
								start_pos_x + split_size1_x , block_to_split.pos_y + block_to_split.size_y * 0.5);
	}
	else
	{
		var start_pos_y = (block_to_split.pos_y - block_to_split.size_y * 0.5);
		var split_size_y = block_to_split.size_y * split_ratio2;
		var split_size1_y = block_to_split.size_y * split_ratio1;
		block_to_split.size_y = block_to_split.size_y * split_ratio1;
		block_to_split.pos_y = start_pos_y + block_to_split.size_y * 0.5;
		var split_pos_y = start_pos_y + block_to_split.size_y + split_size_y * 0.5;
		this.cityblocks.push(new btx.Cityblock(this.cityblocks.length, 0, block_to_split.pos_x, split_pos_y, block_to_split.size_x, split_size_y));
		btx.streets.add_street(	false,
								block_to_split.pos_x - block_to_split.size_x * 0.5, start_pos_y + split_size1_y,
								block_to_split.pos_x + block_to_split.size_x * 0.5, start_pos_y + split_size1_y);
	}
}

btx.Cityblocks.prototype.draw = function()
{
	var color = 340.01;
	for (var i = 0, len = this.cityblocks.length; i < len; i++)
	{
		var block = this.cityblocks[i];
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			btx.tex_noise,
			block.pos_x,
			block.pos_y,
			block.size_x - btx.street_width * 1.0,
			block.size_y - btx.street_width * 1.0,
			90,
			0, 0, 0.4, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

		btx.c.rectangle_textured.draw_rectangle(
			btx.CAM_PLAYER,
			btx.tex_noise,
			block.pos_x,
			block.pos_y,
			block.size_x - btx.street_width * 1.0 - 0.2,
			block.size_y - btx.street_width * 1.0 - 0.2,
			0.2,
			0, 0, 0.35, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

		btx.c.rectangle_textured.draw_rectangle(
			btx.CAM_PLAYER,
			btx.tex_noise,
			block.pos_x,
			block.pos_y,
			block.size_x - btx.street_width * 1.0 - 0.05,
			block.size_y - btx.street_width * 1.0 - 0.05,
			0.05,
			0, 0, 0.2, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	}
	//btx.c.flush_all();
	for (var i = 0, len = this.cityblocks.length; i < len; i++)
	{
		var texture = btx.tex_noise;
		var block = this.cityblocks[i];
		var h = 0, s = 0, l = 0.25;

		
		//texture = btx.tex_grass;

		if (block.type == btx.CITYBLOCK_TYPE__RUINED_LOT)
		{
			h = 0;
			s = 0;
			l = 0.2;
		}
		if (block.type == btx.CITYBLOCK_TYPE__PUBLIC_PARK)
		{
			//texture = btx.tex_grass;
			h = 110;
			s = 0.85;
			l = 0.4;
		}
		if (block.type == btx.CITYBLOCK_TYPE__PLAYGROUND)
		{
			//texture = btx.tex_grass;
			h = 120;
			s = 0.2;
			l = 0.3;
		}
		if (block.type == btx.CITYBLOCK_TYPE__APARTMENTS)
		{
			h = 120;
			s = 0.8;
			l = 0.4;
		}
		if (block.type == btx.CITYBLOCK_TYPE__SHOPS)
		{
			h = 320;
			s = 0.4;
			l = 0.4;
		}
		if (block.type == btx.CITYBLOCK_TYPE__VILLA)
		{
			h = 120;
			s = 0.5;
			l = 0.35;
		}
		if (block.type == btx.CITYBLOCK_TYPE__HOSPITAL)
		{
			h = 0;
			s = 0;
			l = 0.35;
		}
		if (block.type == btx.CITYBLOCK_TYPE__POLICE_STATION)
		{
			h = 0;
			s = 0;
			l = 0.35;
		}
		if (block.type == btx.CITYBLOCK_TYPE__OFFICES)
		{
			h = 70;
			s = 0.3;
			l = 0.35;
		}
		if (block.type == btx.CITYBLOCK_TYPE__HEAVY_INDUSTRY)
		{
			h = 0;
			s = 0;
			l = 0.85;
		}
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			texture,
			block.pos_x,
			block.pos_y,
			block.size_x - btx.street_width * 1.0 - btx.sidewalk_width * 2.0,
			block.size_y - btx.street_width * 1.0 - btx.sidewalk_width * 2.0,
			90,
			h, s, l, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	}
	//btx.c.flush_all();

	for (var i = 0, len = this.cityblocks.length; i < len; i++)
	{
		var block = this.cityblocks[i];
		block.draw_houses();
	}
	btx.c.flush_all();
}

btx.Cityblocks.prototype._ = function()
{
}
