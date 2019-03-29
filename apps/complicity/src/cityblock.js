btx.Cityblock = function(index, type, pos_x, pos_y, size_x, size_y)
{
	this.index = index;
	this.type = type;
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.size_x = size_x;
	this.size_y = size_y;
	this.houses = new Array();
}

btx.Cityblock.prototype.add_houses = function()
{
	if (this.type == btx.CITYBLOCK_TYPE__POLICE_STATION)
	{
		this.add_house(btx.HOUSE_TYPE__POLICE_STATION, this.pos_x, this.pos_y, this.size_x - btx.sidewalk_width * 2 - btx.street_width, this.size_y - btx.sidewalk_width * 2 - btx.street_width);
	}
	if (this.type == btx.CITYBLOCK_TYPE__HOSPITAL)
	{
		this.add_house(btx.HOUSE_TYPE__HOSPITAL, this.pos_x, this.pos_y, this.size_x - btx.sidewalk_width * 2 - btx.street_width, this.size_y - btx.sidewalk_width * 2 - btx.street_width);
	}
	if (this.type == btx.CITYBLOCK_TYPE__VILLA)
	{
		this.add_house(btx.HOUSE_TYPE__VILLA, this.pos_x, this.pos_y, this.size_x - btx.sidewalk_width * 2 - btx.street_width, this.size_y - btx.sidewalk_width * 2 - btx.street_width);
	}
	if (this.type == btx.CITYBLOCK_TYPE__SHOPS)
	{
		this.add_house(btx.HOUSE_TYPE__SHOP, this.pos_x, this.pos_y, this.size_x - btx.sidewalk_width * 2 - btx.street_width, this.size_y - btx.sidewalk_width * 2 - btx.street_width);
		var subdivisions = 2 + µ.rand_int(1);
		for (var i = 0; i < subdivisions; i++)
		{
			for (var j = 0, len = this.houses.length; j < len; j++)
			{
				var direction = µ.rand_int(1) == 0;
				var house = this.houses[j];
				var area = house.size_x * house.size_y;
				if (area > 40 && ((direction && house.size_x > 10) || (!direction && house.size_y > 10)))
				{
					this.split_house(j, direction);
				}
			}
		}
		for (var j = 0, len = this.houses.length; j < len; j++)
		{
			var house = this.houses[j];
			house.type = btx.HOUSE_TYPE__CAR_MECHANIC + µ.rand_int(8);
			if (µ.rand_int(5) == 0)
			{
				house.type = btx.HOUSE_TYPE__PARKING_LOT;
			}

		}
	}
	if (this.type == btx.CITYBLOCK_TYPE__OFFICES)
	{
		this.add_house(btx.HOUSE_TYPE__OFFICE, this.pos_x, this.pos_y, this.size_x - btx.sidewalk_width * 2 - btx.street_width, this.size_y - btx.sidewalk_width * 2 - btx.street_width);
		var subdivisions = 2 + µ.rand_int(1);
		for (var i = 0; i < subdivisions; i++)
		{
			for (var j = 0, len = this.houses.length; j < len; j++)
			{
				var direction = µ.rand_int(1) == 0;
				var house = this.houses[j];
				var area = house.size_x * house.size_y;
				if (area > 40 && ((direction && house.size_x > 10) || (!direction && house.size_y > 10)))
				{
					this.split_house(j, direction);
				}
			}
		}
		for (var j = 0, len = this.houses.length; j < len; j++)
		{
			var house = this.houses[j];
			house.type = btx.HOUSE_TYPE__OFFICE + µ.rand_int(2);
		}
	}
	if (this.type == btx.CITYBLOCK_TYPE__HEAVY_INDUSTRY)
	{
		this.add_house(
							btx.HOUSE_TYPE__WAREHOUSE + µ.rand_int(2),
							this.pos_x,
							this.pos_y,
							this.size_x - btx.sidewalk_width * 2 - btx.street_width,
							this.size_y - btx.sidewalk_width * 2 - btx.street_width);
	}
	if (this.type == btx.CITYBLOCK_TYPE__APARTMENTS)
	{
		this.add_house(
							btx.HOUSE_TYPE__APARTMENT,
							this.pos_x,
							this.pos_y,
							this.size_x - btx.sidewalk_width * 2 - btx.street_width,
							this.size_y - btx.sidewalk_width * 2 - btx.street_width);

		var subdivisions = 2 + µ.rand_int(1);
		for (var i = 0; i < subdivisions; i++)
		{
			for (var j = 0, len = this.houses.length; j < len; j++)
			{
				var direction = µ.rand_int(1) == 0;
				var house = this.houses[j];
				var area = house.size_x * house.size_y;
				if (area > 50 && ((direction && house.size_x > 15) || (!direction && house.size_y > 15)))
				{
					this.split_house(j, direction);
				}
			}
		}
		for (var j = 0, len = this.houses.length; j < len; j++)
		{
			var house = this.houses[j];
			if (µ.rand_int(50) == 0)
			{
				house.type = btx.HOUSE_TYPE__DOCUMENT_FORGER;
			}
			else if (µ.rand_int(10) == 0)
			{
				house.type = btx.HOUSE_TYPE__GANG_HIDEOUT;
			}
			else if (µ.rand_int(10) == 0)
			{
				house.type = btx.HOUSE_TYPE__PARKING_LOT;
			}
		}
	}


	for (var j = 0, len = this.houses.length; j < len; j++)
	{
		var house = this.houses[j];
		house.place_doors();
	}
}


btx.Cityblock.prototype.add_house = function(type, pos_x, pos_y, size_x, size_y)
{
	//console.log('#### ' + this.houses.length);
	
	this.houses.push(new btx.House(this.houses.length, this.index, type, pos_x, pos_y, size_x, size_y));
}

btx.Cityblock.prototype.split_house = function(house_index, split_horizontally)
{
	var house_to_split = this.houses[house_index];
	var split_ratio1 = 0.45 + µ.rand(0.1);
	var split_ratio2 = 1.0 - split_ratio1;
	if (split_horizontally)
	{
		var start_pos_x = (house_to_split.pos_x - house_to_split.size_x * 0.5);
		var split_size_x = house_to_split.size_x * split_ratio2;
		var split_size1_x = house_to_split.size_x * split_ratio1;
		house_to_split.size_x = house_to_split.size_x * split_ratio1;
		house_to_split.pos_x = start_pos_x + house_to_split.size_x * 0.5;
		var split_pos_x = start_pos_x + house_to_split.size_x + split_size_x * 0.5;
		this.add_house(house_to_split.type, split_pos_x, house_to_split.pos_y, split_size_x, house_to_split.size_y);

	}
	else
	{
		var start_pos_y = (house_to_split.pos_y - house_to_split.size_y * 0.5);
		var split_size_y = house_to_split.size_y * split_ratio2;
		var split_size1_y = house_to_split.size_y * split_ratio1;
		house_to_split.size_y = house_to_split.size_y * split_ratio1;
		house_to_split.pos_y = start_pos_y + house_to_split.size_y * 0.5;
		var split_pos_y = start_pos_y + house_to_split.size_y + split_size_y * 0.5;
		this.add_house(house_to_split.type, house_to_split.pos_x, split_pos_y, house_to_split.size_x, split_size_y);
	}
}


btx.Cityblock.prototype.draw_light_block = function()
{

	for (var i = 0, len = this.houses.length; i < len; i++)
	{
		var house = this.houses[i];
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			btx.tex_noise,
			house.pos_x,
			house.pos_y,
			house.size_x,
			house.size_y,
			90,
			0, 0, 1, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	}
}


btx.Cityblock.prototype.draw_houses = function()
{
	for (var i = 0, len = this.houses.length; i < len; i++)
	{
		var house = this.houses[i];
		
		house.draw();

	}
	
	btx.c.rectangle_textured.flush_all();
}



btx.Cityblock.prototype._ = function()
{
}

