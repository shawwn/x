btx.House = function(index, block_index, type, pos_x, pos_y, size_x, size_y)
{
	this.index = index;
	this.block_index = block_index;
	this.type = type;
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.size_x = size_x;
	this.size_y = size_y;
	this.door_x = -1;
	this.door_y = -1;
	this.door_location = -1; // top, right, bottom, left
	this.door_navmesh_node_id = -1;

	this.price_multiplier_buy = 1;
	this.price_multiplier_sell = 1;

	this.roof_horizontal = µ.rand_int(1) == 0;

	this.owner		= -1;		// which person owns the house

	this.workers	= new Array(0);		// anyone besides the owner working here

}

btx.House.prototype.draw = function()
{
	if (btx.selected_cityblock == this.block_index && btx.selected_house == this.index)
	{
		btx.c.rectangle_textured.draw_rectangle(btx.CAM_PLAYER,
			btx.tex_noise,
			this.pos_x,
			this.pos_y,
			this.size_x - btx.wall_thickness,
			this.size_y - btx.wall_thickness,
			btx.wall_thickness,
			0, 0, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

	}
	else
	{
		var hue = i * 0;
		var sat = 1;
		var lum = 0.5;
		if (this.type == btx.HOUSE_TYPE__PARKING_LOT)
		{
			sat = 0;
			hue += 0;
			lum = 0.8;
		}
		if (this.type == btx.HOUSE_TYPE__APARTMENT)
		{
			sat = 0.1;
			hue += 160;
		}
		if (this.type == btx.HOUSE_TYPE__DOCUMENT_FORGER)
		{
			sat = 0.6;
			hue += 160;
			lum = 0.2;
		}
		if (this.type == btx.HOUSE_TYPE__GANG_HIDEOUT)
		{
			sat = 0.6;
			hue += 160;
			lum = 0.8;
		}
		if (this.type == btx.HOUSE_TYPE__VILLA)
		{
			hue += 60;
		}
		if (	this.type == btx.HOUSE_TYPE__SHOP
			||	this.type == btx.HOUSE_TYPE__CAR_MECHANIC
			||	this.type == btx.HOUSE_TYPE__GROCERY_STORE
			||	this.type == btx.HOUSE_TYPE__CLOTHING_STORE
			||	this.type == btx.HOUSE_TYPE__HAIR_SALON
			||	this.type == btx.HOUSE_TYPE__COSMETIC_SURGEON
			||	this.type == btx.HOUSE_TYPE__WEAPON_SHOP
			||	this.type == btx.HOUSE_TYPE__NIGHT_CLUB
			||	this.type == btx.HOUSE_TYPE__GAS_STATION
			||	this.type == btx.HOUSE_TYPE__RESTAURANT
		)
		{
			sat = 0.3;
			hue += 300;
		}
		if (	this.type == btx.HOUSE_TYPE__OFFICE
			||	this.type == btx.HOUSE_TYPE__INSURANCE_OFFICE
			||	this.type == btx.HOUSE_TYPE__APP_SWEATSHOP)
		{
			sat = 0.4;
			hue += 270;
		}
		if (	this.type == btx.HOUSE_TYPE__WAREHOUSE
			||	this.type == btx.HOUSE_TYPE__POWER_PLANT
			||	this.type == btx.HOUSE_TYPE__WASTE_DISPOSAL)
		{
			hue += 60;
			sat = 0.1;
			lum = 0.2;
		}
		if (this.type == btx.HOUSE_TYPE__POLICE_STATION)
		{
			hue += 220;
		}
		if (this.type == btx.HOUSE_TYPE__HOSPITAL)
		{
			hue += 5;
		}
		if (this.roof_horizontal)
		{
			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_noise,
				this.pos_x,
				this.pos_y - this.size_y * 0.25,
				this.size_x,
				this.size_y * 0.5,
				90,
				hue, sat, lum * 0.9, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_noise,
				this.pos_x,
				this.pos_y + this.size_y * 0.25,
				this.size_x,
				this.size_y * 0.5,
				90,
				hue, sat, lum * 1.1, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		}
		else
		{
			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_noise,
				this.pos_x - this.size_x * 0.25,
				this.pos_y,
				this.size_x * 0.5,
				this.size_y,
				90,
				hue, sat, lum * 1.2, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_noise,
				this.pos_x + this.size_x * 0.25,
				this.pos_y,
				this.size_x * 0.5,
				this.size_y,
				90,
				hue, sat, lum * 0.8, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		}
	}

	if (this.door_x != -1)
	{
		btx.c.rectangle_textured.draw_rectangle(btx.CAM_PLAYER,
			btx.tex_noise,
			this.door_x,
			this.door_y,
			0.1,
			0.1,
			0.3,
			220, 1, 0.5, .6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

/*
		btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
			btx.tex_noise,
			this.pos_x,
			this.pos_y,
			this.door_x,
			this.door_y,
			0.2,
			160, 1.0, 0.5, 0.8,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
*/	
	}



}


btx.House.prototype.place_doors = function()
{
	var block = btx.cityblocks.cityblocks[this.block_index];
	var blocked_top = false;
	var blocked_left = false;
	var blocked_right = false;
	var blocked_bottom = false;

	var left_x 		= this.pos_x - this.size_x * 0.5;
	var right_x 	= this.pos_x + this.size_x * 0.5;
	var top_y 		= this.pos_y + this.size_y * 0.5;
	var bottom_y 	= this.pos_y - this.size_y * 0.5;

	for (var j = 0, len = block.houses.length; j < len; j++)
	{
		if (j != this.index)
		{
			var house = block.houses[j];
			if (house.pos_x + house.size_x * 0.5 > right_x)
			{
				blocked_right = true;
			}
			if (house.pos_x - house.size_x * 0.5 < left_x)
			{
				blocked_left = true;
			}
			if (house.pos_y + house.size_y * 0.5 > top_y)
			{
				blocked_top = true;
			}
			if (house.pos_y - house.size_y * 0.5 < bottom_y)
			{
				blocked_bottom = true;
			}
		}
	}

	if (!blocked_top)
	{
		this.door_location = 0;
		this.door_x = this.pos_x;
		this.door_y = this.pos_y + this.size_y * 0.5;
	}
	if (!blocked_right)
	{
		this.door_location = 1;
		this.door_y = this.pos_y;
		this.door_x = this.pos_x + this.size_x * 0.5;
	}
	if (!blocked_bottom)
	{
		this.door_location = 2;
		this.door_x = this.pos_x;
		this.door_y = this.pos_y - this.size_y * 0.5;
	}
	if (!blocked_left)
	{
		this.door_location = 3;
		this.door_y = this.pos_y;
		this.door_x = this.pos_x - this.size_x * 0.5;
	}
	
	
	if (this.door_location == 0)
	{
		var navmesh_node_offset_x = 0;
		var navmesh_node_offset_y = 0.2;
	}
	else if (this.door_location == 1)
	{
		var navmesh_node_offset_x = 0.2;
		var navmesh_node_offset_y = 0;
	}
	else if (this.door_location == 2)
	{
		var navmesh_node_offset_x = 0;
		var navmesh_node_offset_y = -0.2;
	}
	else if (this.door_location == 3)
	{
		var navmesh_node_offset_x = -0.2;
		var navmesh_node_offset_y = 0;
	}

	this.door_navmesh_node_id = btx.navmesh.add_node(btx.NAVMESH_NODE_TYPE__HOUSE_DOOR, this.door_x + navmesh_node_offset_x, this.door_y + navmesh_node_offset_y, -1);

/*
*/
}

btx.House.prototype.place_garage_door = function()
{
}

btx.House.prototype.place_window = function()
{
}

btx.House.prototype._ = function()
{
}

