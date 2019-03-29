"use strict";

var index = 0;
lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT		= index++;
lgg.PLAYER_WEAPON_DIRECTION__FRONT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT	= index++;
lgg.PLAYER_WEAPON_DIRECTION__LEFT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__RIGHT			= index++;
lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT		= index++;
lgg.PLAYER_WEAPON_DIRECTION__REAR			= index++;
lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT		= index++;
lgg.PLAYER_WEAPON_DIRECTION_COUNT			= index++;


lgg.weapon_directions_x = [];
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]	= -1;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 0;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 1;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= -1;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 1;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 0;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 0;
lgg.weapon_directions_x[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]	= 0;

lgg.weapon_directions_y = [];
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]	= 1;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 1;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 1;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= 0;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 0;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 0;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 0;
lgg.weapon_directions_y[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]	= 0;

lgg.weapon_directions_angle = [];
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]	= 135;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 90;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 45;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= 180;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 0;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 225;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 270;
lgg.weapon_directions_angle[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]	= 315;

lgg.weapon_directions_side = [];
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]		= -1;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 0;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 1;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= -1;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 1;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= -1;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 0;
lgg.weapon_directions_side[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]		= 1;

lgg.Player_Weapon = function(weapon_type_id, weapon_type)
{
	this.weapon_type_id = weapon_type_id;
	this.weapon_type = weapon_type;
	this.reset();
};

lgg.Player_Weapon.prototype.reset = function()
{
	this.has_weapon	= false;

	this.shot_count = 0;

	this.directions												= [];
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]	= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 0;
	this.directions[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]	= 0;

	this.last_shot = [];

	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]		= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__FRONT]			= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__LEFT]			= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]			= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__REAR]			= 0;
	this.last_shot[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]		= 0;
}


lgg.Player_Weapon.prototype.trigger_pressed = function(direction, movement_angle)
{
	if (this.has_weapon == true)
	{
		if (this.directions[direction] > 0 && lgg.player.energy >= this.directions[direction])
		{
			if (lgg.now - this.last_shot[direction] >= this.weapon_type.shot_delay)
			{
				if (lgg.player.energy >= this.weapon_type.energy_cost)
				{
					return true;
				}
			}
		}
	}
}
