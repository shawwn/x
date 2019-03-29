'use strict';

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP] = function(unit)
{
	this.unit = unit;
	this.people_indices = [];
	this.people_count = 0;

	this.food_stored = 0;
	this.food_max = 1000 * 1000;
/*
	this.storage_food = new civ.Storage(1000, 20, 1000 * 60 * 5);
	this.storage_wood = new civ.Storage(1000, 1, 0);
*/
	this.parameters =
	{
		can_walk: 			true,
		can_swim: 			true,
		can_fly: 			true,
	};


}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype.spawn = function()
{
	this.unit.pos_x = 50;
	this.unit.pos_y = 50;
	this.unit.target_x = 50;
	this.unit.target_y = 50;
	this.unit.radius *= 1.3;
	this.unit.radius2 *= 1.3;
}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype.think = function(time_delta)
{
	//this.storage_food.think(time_delta);
	//this.storage_wood.think(time_delta);
/*
	civ.particlesGPU.spawn(
		civ.now,
		3,
		this.unit.pos_x,
		this.unit.pos_y,
		this.unit.old_pos_x,
		this.unit.old_pos_y,
		this.unit.radius * 0.45,
		0,
		0,
		360, 0,
		civ.particles__explode,
		2500,		//	lifespan
		0, 1, 1.0, 0.9,
		360,			//	vary_angle
		this.unit.radius * 0.35,		//	vary_angle_vel
		0,			//	vary_pos_x
		0,			//	vary_pos_y
		this.unit.radius * 0.2,			//	vary_size
		0,			//	vary_vel_x
		0,			//	vary_vel_y
		500,			//	vary_lifespan
		0,			//	vary_color_hue
		0,			//	vary_color_sat
		0,			//	vary_color_lum
		0			//	vary_color_a
	);
*/
}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype.draw = function()
{
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_mothership,
		this.unit.pos_x,
		this.unit.pos_y,
		this.unit.radius2,
		this.unit.radius2,
		1, 1,
		90,
		0, 0, 2, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_mothership_light_front,
		this.unit.pos_x,
		this.unit.pos_y,
		this.unit.radius2 - this.unit.radius * 0.3 + this.unit.radius * Math.sin(civ.now / 1000) * 0.2,
		this.unit.radius2 - this.unit.radius * 0.3 + this.unit.radius * Math.sin(civ.now / 1000) * 0.2,
		1, 1,
		90,
		210, 1, 1, 1.0,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_mothership_light_back,
		this.unit.pos_x,
		this.unit.pos_y,
		this.unit.radius2,
		this.unit.radius2,
		1, 1,
		90,
		210, 1, 1, 0.5 + 0.5 * Math.sin(civ.now / 1000),
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype.pick_people_to_found_colony = function(result_array)
{
}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype._ = function()
{
}

civ.unit_types[civ.UNIT_TYPE__MOTHERSHIP].prototype._ = function()
{
	
}