'use strict';

civ.Unit = function(unit_index)
{
	this.unit_index = unit_index;
	this.is_active = false;
	this.reset();
}

civ.Unit.prototype.reset = function()
{
	this.type = null;
	this.type_id = -1;
	this.faction_id = -1;
	this.pos_x = -1;
	this.pos_y = -1;
	this.old_pos_x = -1;
	this.old_pos_y = -1;
	this.target_x = -1;
	this.target_y = -1;

	this.speed_x = 0;
	this.speed_y = 0;
}

civ.Unit.prototype.spawn = function(unit_type, faction_id, pos_x, pos_y)
{
	this.reset();

	this.is_active = true;

	this.type = new civ.unit_types[unit_type](this);
	this.type_id = unit_type;
	this.faction_id = faction_id;
	this.pos_x = pos_x;
	this.pos_y = pos_y;

	this.radius = civ.UNIT__BASE_RADIUS;
	this.radius2 = civ.UNIT__BASE_RADIUS * 2;

	this.type.spawn();
}

civ.Unit.prototype.set_move_target = function(target_x, target_y)
{
	this.target_x = target_x;
	this.target_y = target_y;
}

civ.Unit.prototype.think = function(time_delta)
{
	this.old_pos_x = this.pos_x;
	this.old_pos_y = this.pos_y;

	this.speed_x *= Math.pow(0.995, time_delta);
	this.speed_y *= Math.pow(0.995, time_delta);
	var dist_to_target = µ.distance2D(this.pos_x, this.pos_y, this.target_x, this.target_y);

	if (dist_to_target > civ.UNIT__BASE_RADIUS * 2.0)
	{
		var angle_to_target = µ.vector2D_to_angle(this.target_x - this.pos_x, this.target_y - this.pos_y);
		this.speed_x += µ.angle_to_x(angle_to_target) * civ.UNIT__BASE_ACCELERATION * 4 * time_delta;
		this.speed_y += µ.angle_to_y(angle_to_target) * civ.UNIT__BASE_ACCELERATION * 4 * time_delta;
	}
	if (dist_to_target > civ.UNIT__BASE_RADIUS * 1.0)
	{
		var angle_to_target = µ.vector2D_to_angle(this.target_x - this.pos_x, this.target_y - this.pos_y);
		this.speed_x += µ.angle_to_x(angle_to_target) * civ.UNIT__BASE_ACCELERATION * 2 * time_delta;
		this.speed_y += µ.angle_to_y(angle_to_target) * civ.UNIT__BASE_ACCELERATION * 2 * time_delta;
	}
	if (dist_to_target > civ.UNIT__BASE_RADIUS * 0.1)
	{
		var angle_to_target = µ.vector2D_to_angle(this.target_x - this.pos_x, this.target_y - this.pos_y);
		this.speed_x += µ.angle_to_x(angle_to_target) * civ.UNIT__BASE_ACCELERATION * time_delta;
		this.speed_y += µ.angle_to_y(angle_to_target) * civ.UNIT__BASE_ACCELERATION * time_delta;
	}
	else
	{
		this.speed_x *= Math.pow(0.9, time_delta);
		this.speed_y *= Math.pow(0.9, time_delta);
	}

	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;

	this.type.think(time_delta);

	this.pos_x = µ.between(0, this.pos_x, civ.WORLD_SIZE_X);
	this.pos_y = µ.between(0, this.pos_y, civ.WORLD_SIZE_Y);

	//console.log(angle_to_target, this.pos_x, this.target_x);
}

civ.Unit.prototype._ = function()
{
}

civ.Unit.prototype.draw = function()
{
	this.type.draw();
}

civ.Unit.prototype._ = function()
{
	
}
