"use strict";

lgg.Player = function()
{
	this.reset();
};
lgg.Player.prototype.reset = function()
{
	this.last_shot					= [];
	this.last_shot[0]				= [];
	this.last_shot[0][-1]			= 0;
	this.last_shot[0][0]			= 0;
	this.last_shot[0][1]			= 0;
	this.last_shot[1]				= [];
	this.last_shot[1][-1]			= 0;
	this.last_shot[1][0]			= 0;
	this.last_shot[1][1]			= 0;
	this.last_shot[2]				= [];
	this.last_shot[2][-1]			= 0;
	this.last_shot[2][0]			= 0;
	this.last_shot[2][1]			= 0;
	this.last_shot[3]				= [];
	this.last_shot[3][-1]			= 0;
	this.last_shot[3][0]			= 0;
	this.last_shot[3][1]			= 0;
	this.score						= 0;
	this.last_boost					= 0;
	this.last_hit					= 0;
	this.last_shield_hit			= 0;
	this.health						= 1;
	this.armour						= 1.0;
	this.shield						= 2;
	this.shield_max					= 2;
	this.game_over_time 			= 3000;
	this.energy						= 1;
	this.credits					= 0;
	
	this.gui_health					= 1;
	this.gui_energy					= 1;
	this.gui_shield					= 2;
	this.radius						= .01;
	this.radius2					= this.radius;
	this.pos_x						= lgg.level.size_x/2;
	this.pos_y						= .05;
	//this.shot_count					= 0;
	this.speed_x					= 0;
	this.speed_y					= 0;
	this.last_speed_x				= 0;
	this.last_speed_y				= 0;
	this.last_trail					= 0;
	this.last_trail_x				= 0;
	this.last_trail_y				= 0;
	this.acceleration				= .0000030;
	this.upgrades__energy_recharge	= 0;
	
	this.weapons					= [];

	for (var i = 0, len = lgg.weapons.length; i < len; i++)
	{
		this.weapons[i] = new lgg.Player_Weapon(i, lgg.weapons[i])
	}

/*
	for (var i = 0; i < lgg.PLAYER_WEAPON_DIRECTION_COUNT; i++)
	{
		this.weapons[lgg.PLAYER_WEAPON__SINGLE_SHOT].directions[i]		= 0.0;
		this.weapons[lgg.PLAYER_WEAPON__SWEEP_SPREAD].directions[i]		= 0.0;
		this.weapons[lgg.PLAYER_WEAPON__SHOTGUN].directions[i]			= 0.0;
		this.weapons[lgg.PLAYER_WEAPON__SWIRL].directions[i]			= 0.0;
	}
*/

	this.weapons[lgg.PLAYER_WEAPON__SINGLE_SHOT].has_weapon				= true;
	this.weapons[lgg.PLAYER_WEAPON__SINGLE_SHOT].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT]		= 0.1;
	this.weapons[lgg.PLAYER_WEAPON__SINGLE_SHOT].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR]		= 0.1;


	this.weapons[lgg.PLAYER_WEAPON__BALL_LIGHTNING].has_weapon				= true;
	this.weapons[lgg.PLAYER_WEAPON__BALL_LIGHTNING].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT]		= 0.8;
	this.weapons[lgg.PLAYER_WEAPON__BALL_LIGHTNING].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT]	= 0.8;

	
	this.weapons[lgg.PLAYER_WEAPON__SWEEP_SPREAD].has_weapon			= true;
	this.weapons[lgg.PLAYER_WEAPON__SWEEP_SPREAD].directions[lgg.PLAYER_WEAPON_DIRECTION__LEFT]		= 0.1;
	this.weapons[lgg.PLAYER_WEAPON__SWEEP_SPREAD].directions[lgg.PLAYER_WEAPON_DIRECTION__RIGHT]	= 0.1;

	this.weapons[lgg.PLAYER_WEAPON__SHOTGUN].has_weapon					= true;
	this.weapons[lgg.PLAYER_WEAPON__SHOTGUN].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT]		= 0.1;
	this.weapons[lgg.PLAYER_WEAPON__SHOTGUN].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT]	= 0.1;

	this.weapons[lgg.PLAYER_WEAPON__SWIRL].has_weapon					= true;
	this.weapons[lgg.PLAYER_WEAPON__SWIRL].directions[lgg.PLAYER_WEAPON_DIRECTION__FRONT]		= 0.8;
	this.weapons[lgg.PLAYER_WEAPON__SWIRL].directions[lgg.PLAYER_WEAPON_DIRECTION__REAR]		= 0.8;


	// testing
	this.projectile_dampening_radius	= 0.1;
	this.projectile_dampening_strength	= 0.00125;

	// unused
	this.crew_cabins				= lgg.STARTING__PLAYER_CREW_CABINS;

}

lgg.Player.prototype.think_respawn_select = function(time_delta)
{
	if (lgg.input.KEY_CURSOR_RIGHT.pressed && lgg.now - this.last_select > 300)
	{
		this.last_select = lgg.now;
	}
	if (lgg.input.KEY_CURSOR_LEFT.pressed && lgg.now - this.last_select > 300)
	{
		this.last_select = lgg.now;
	}
}

lgg.Player.prototype.think = function(time_delta)
{
	if (this.health <= 0)
	{
		return;
	}
	if (this.health > 1) this.health = 1;

//	var last_boost_frac = lgg.now - lgg.player.last_boost > 2000 ? 1 : (lgg.now - lgg.player.last_boost)/2000;

	if (this.energy < 1) this.energy += ((0.00020 * time_delta) + (0.00040 * this.energy * time_delta)) * Math.pow(1.1, 1.0 + this.upgrades__energy_recharge);
	if (this.energy > 1) this.energy = 1;
	this.gui_health	+= (this.health - this.gui_health) * .3;
	this.gui_energy	+= (this.energy - this.gui_energy) * .3;
	this.gui_shield += (this.shield - this.gui_shield) * .3;
	var moving = false;
	var move_x = 0;
	var move_y = 0;
	this.last_speed_x = this.speed_x;
	this.last_speed_y = this.speed_y;
	
	if (lgg.options_debug_values[lgg.DEBUG_OPTION__ATTRACT_MODE])
	{
		if (µ.rand_int(3) == 0)
		{
			moving = true;
			move_y = 1;
		}
		else if (µ.rand_int(3) == 0)
		{
			moving = true;
			move_y = -1;
		}
		if (µ.rand_int(3) == 0)
		{
			moving = true;
			move_x = 1;
		}
		else if (µ.rand_int(3) == 0)
		{
			moving = true;
			move_x = -1;
		}

	
	}
	else
	{
		if (lgg.input.KEY_W.pressed)
		{
			moving = true;
			move_y = 1;
		}
		else if (lgg.input.KEY_S.pressed)
		{
			moving = true;
			move_y = -1;
		}
		if (lgg.input.KEY_D.pressed)
		{
			moving = true;
			move_x = 1;
		}
		else if (lgg.input.KEY_A.pressed)
		{
			moving = true;
			move_x = -1;
		}
	}
	
	var movement_angle = -1;
	var boosting = false;
	if (moving == true)
	{
		var factor = 1;
		if (lgg.input.KEY_SHIFT.pressed && this.energy >= .005)
		{
			this.last_boost = lgg.now;
			boosting = true;
			factor = 3;
			this.energy -= .0025 * time_delta;
		}
		var movement_angle = µ.vector2D_to_angle(move_x, move_y);
		move_x = µ.angle_to_x(movement_angle) * this.acceleration * time_delta * factor;
		move_y = µ.angle_to_y(movement_angle) * this.acceleration * time_delta * factor;
		this.speed_x += move_x;
		this.speed_y += move_y;
	}
	if (lgg.input.KEY_KP_PLUS.pressed)
	{
		lgg.camera_player.set_zoom(lgg.camera_player.zoom_ - time_delta * .001);
	}
	if (lgg.input.KEY_KP_MINUS.pressed)
	{
		var desired_zoom = lgg.camera_player.zoom_ + time_delta * .001;
		if (desired_zoom < 4)
			lgg.camera_player.set_zoom(desired_zoom);
		else
			lgg.camera_player.set_zoom(4);
	}
	
	if (lgg.input.KEY_KP5.pressed)
	{
		lgg.camera_player.set_zoom(lgg.camera_player.zoom_ * 0.85 + 0.15 * lgg.level.size_y);
	}
	
	
	
	

	if (lgg.options_debug_values[lgg.DEBUG_OPTION__ATTRACT_MODE])
	{
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT, 	movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT, 		movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT, 	movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__LEFT, 		movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__RIGHT, 		movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT, 	movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR, 		movement_angle);
		if (µ.rand_int(100) == 0)	this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT, 	movement_angle);
	}
	else
	{
		if (lgg.input.KEY_KP8.pressed)
		{
			this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT, movement_angle);
		}
		if (lgg.input.KEY_KP2.pressed)
		{
			this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR, movement_angle);
		}
		if (µ.rand_int(1))
		{
			if (lgg.input.KEY_KP7.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT, movement_angle);
			}
			if (lgg.input.KEY_KP4.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__LEFT, movement_angle);
			}
			if (lgg.input.KEY_KP1.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT, movement_angle);
			}
			if (lgg.input.KEY_KP9.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT, movement_angle);
			}
			if (lgg.input.KEY_KP6.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__RIGHT, movement_angle);
			}
			if (lgg.input.KEY_KP3.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT, movement_angle);
			}
		}
		else
		{
			if (lgg.input.KEY_KP9.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_RIGHT, movement_angle);
			}
			if (lgg.input.KEY_KP6.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__RIGHT, movement_angle);
			}
			if (lgg.input.KEY_KP3.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_RIGHT, movement_angle);
			}
			if (lgg.input.KEY_KP7.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__FRONT_LEFT, movement_angle);
			}
			if (lgg.input.KEY_KP4.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__LEFT, movement_angle);
			}
			if (lgg.input.KEY_KP1.pressed)
			{
				this.trigger_pressed(lgg.PLAYER_WEAPON_DIRECTION__REAR_LEFT, movement_angle);
			}
		}
	}


	var friction = Math.pow(0.99, time_delta);
	this.speed_x *= friction;
	this.speed_y *= friction;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	if (this.pos_x < this.radius * .95)					this.pos_x = this.radius * .95;
	if (this.pos_x > lgg.level.size_x - this.radius * .95)	this.pos_x = lgg.level.size_x - this.radius * .95;
	if (this.pos_y < this.radius * .5)						this.pos_y = this.radius * .5;
	if (this.pos_y > lgg.level.size_y - this.radius * .5)	this.pos_y = lgg.level.size_y - this.radius * .5;
	lgg.camera_player.set_pos(this.pos_x, this.pos_y + .3 * lgg.camera_player.zoom_);
	var since_last_trail = lgg.now - this.last_trail;
}



lgg.Player.prototype.trigger_pressed = function(direction, movement_angle)
{
	var selected_weapon_index = -1;
	var max_time_since_last_shot = 0;



	for (var i = 0, len = this.weapons.length; i < len; i++)
	{
		var weapon = this.weapons[i];
		if (weapon.trigger_pressed(direction, movement_angle))
		{

			var time_since_last_shot = (lgg.now - weapon.last_shot[direction]); // * (weapon.directions[direction]);
			if (max_time_since_last_shot < time_since_last_shot)
			{
				max_time_since_last_shot = time_since_last_shot;
				selected_weapon_index = i;
			}
		}
	}
	if (selected_weapon_index > -1)
	{
		var weapon = this.weapons[selected_weapon_index];
		this.energy -= weapon.weapon_type.energy_cost;
		weapon.last_shot[direction] = lgg.now;
		weapon.shot_count++;
		weapon.weapon_type.fire(direction, movement_angle);
	}
				//if (lgg.now - this.last_shot[direction] >= this.weapon_type.shot_delay)

}



lgg.Player.prototype.explode = function(caused_by_enemy)
{
	lgg.particlesGPU.spawn(
		lgg.now,
		50,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		0.1,
		0,
		0,
		0, .05,
		lgg.particles__damage,
		3000,
		0,1,1,1,
		360,		//	vary_angle
		0.1,		//	vary_angle_vel
		this.radius*1.4,		//	vary_pos_x
		this.radius*1.4,		//	vary_pos_y
		0,		//	vary_size
		0,		//	vary_vel_x
		0,		//	vary_vel_y
		1000,		//	vary_lifespan
		0,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);
}

lgg.Player.prototype.gain_health = function(amount)
{
	this.health += amount;
	if (this.health > 1)
	{
		this.health = 1;
	}
}

lgg.Player.prototype.gain_credits = function(amount)
{
	this.credits += amount;
}

lgg.Player.prototype.gain_energy = function(amount)
{
	this.energy += amount;
	if (this.energy > 1)
	{
		this.energy = 1;
	}
}

lgg.Player.prototype.take_damage = function(amount, damage_type, projectile_index, dmg_pos_x, dmg_pos_y)
{
	if (this.health <= 0)
	{
		return;
	}
	lgg.damage_types[damage_type].impact(amount, 0, -1, projectile_index, dmg_pos_x, dmg_pos_y);
}

lgg.Player.prototype.shields_hit = function()
{
}

lgg.Player.prototype.draw_respawn_select = function()
{
	for (var i = 0; i < 3; i++)
	{
		if (this.select_primary == i)
			lgg.c.rectangle.draw(lgg.CAM_PLAYER, .4 + .1 * i, .2, .05, .05, 90,
				.35, .35, .9, .99,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
				);
		else
			lgg.c.rectangle.draw(lgg.CAM_PLAYER, .4 + .1 * i, .2, .05, .05, 90,
				.95, .95, .35, .99,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
				);
	}
}

lgg.Player.prototype.draw = function()
{
	if (this.health <= 0)
	{
		return;
	}
	lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob_top, this.pos_x, this.pos_y, this.radius*2, this.radius*2, 40,
		210, 1, 1.5 + 0.75 * Math.sin(lgg.now / 42), 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);
	var fade = lgg.now - this.last_hit < 1500 ? (1 - (lgg.now - this.last_hit) / 1500) : 0;
	if (fade)
	{
		if (fade > .75)
		{
			var size = 1.0 - (fade - .75) * 4;
		}
		else
		{
			var size = fade / .75
		}
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob_top2, this.pos_x, this.pos_y, this.radius * size * 2, this.radius * size * 2, 40,
			210, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);

		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob_top3, this.pos_x, this.pos_y, this.radius * size * 1, this.radius * size * 1, 40,
			210, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
	}





	var shield_frac = this.shield / this.shield_max;

	if (shield_frac > 0)
	{
		var shield_hit = lgg.now - this.last_shield_hit < 250 ? (1 - (lgg.now - this.last_shield_hit) / 250) : 0;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
			lgg.tex_circle_soft_inverse,
			this.pos_x,
			this.pos_y,
			this.radius * lgg.SHIELD_RADIUS * 2,
			this.radius * lgg.SHIELD_RADIUS * 2,
			90,
			200 + 10 * (1 - shield_frac), 1, 1, .25 + .15 * Math.sin(lgg.now / 130) + .15 * (shield_frac) + .2 * shield_hit,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);

		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
			lgg.tex_circle_outline,
			this.pos_x,
			this.pos_y,
			this.radius * lgg.SHIELD_RADIUS * 2,
			this.radius * lgg.SHIELD_RADIUS * 2,
			90,
			200 + 10 * (1 - shield_frac), 1, 1, .01 + .015 * (shield_frac) + .15 * shield_hit,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	}

	if (lgg.player.projectile_dampening_radius > 0)
	{
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
			lgg.tex_circle_soft_inverse,
			this.pos_x,
			this.pos_y,
			lgg.player.projectile_dampening_radius * 2,
			lgg.player.projectile_dampening_radius * 2,
			90,
			210, 0.5, 0.6, 0.15,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);


	}

	var cam = lgg.CAM_STRETCH;
	var pos_x = .5;
	var pos_y = .982; //1 / lgg.cameras[cam].aspect;
	var height = .0095;

	var bar_width = .2;

	lgg.c.rectangle.draw(cam, pos_x, pos_y - height * .5, bar_width, height * (.3 + .4 * this.gui_energy), 90,
		210, 1, .2 + this.gui_energy * .2, .5,
		-1, -1, -1, -1,
		-1, -1, -1, .5,
		-1, -1, -1, .5
		);
	lgg.c.rectangle.draw(cam, pos_x, pos_y - height * .5, this.gui_energy * bar_width, height * (.3 + .4 * this.gui_energy), 90,
		210, 1, .7 - this.gui_energy * .25, .95,
		-1, -1, -1, -1,
		-1, -1, -1, .5,
		-1, -1, -1, .5
		);
		
	var hue1 = this.gui_health * 110;
	var hue2 = this.gui_health * 80;

	lgg.c.rectangle.draw(cam,
		pos_x,
		pos_y - height * 1.5,
		bar_width,
		height * 1.1,
		90,
		hue1, 1, .1 + this.gui_health * .1, .5,
		hue2, -1, -1, -1,
		hue2, -1, -1, .35,
		hue1, -1, -1, .35
		);
	lgg.c.rectangle.draw(cam,
		pos_x + this.gui_health * bar_width / 2 - bar_width / 2,
		pos_y - height * 1.5,
		this.gui_health * bar_width,
		height * 1.1,
		90,
		hue1, 1,  .5 - this.gui_health * .15, .995,
		hue2, -1, -1, -1,
		hue2, -1, -1, .35,
		hue1, -1, -1, .35
		);

	lgg.c.rectangle.draw(cam,
		pos_x,
		pos_y - height * 2.5,
		bar_width,
		height * .7,
		90,
		180, .6, .1, .5,
		230, -1, -1, -1,
		230, -1, -1, .35,
		180, -1, -1, .35
		);
	lgg.c.rectangle.draw(cam,
		pos_x + (this.gui_shield * bar_width / this.shield_max) / 2 - bar_width / 2,
		pos_y - height * 2.5,
		this.gui_shield * bar_width / this.shield_max,
		height * .7,
		90,
		180, .6, .75, .995,
		230, -1, .55, -1,
		230, -1, .55, .35,
		180, -1, .75, .35
		);

	var spawn_frac = Math.max(0, lgg.now - lgg.enemies.last_spawn)/lgg.level.spawn_freq;
	lgg.c.rectangle.draw(cam, pos_x, .993, lgg.level.spawn_freq/320000, .0075, 90,
		52, 1, .5, .65,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
		);
	if (spawn_frac)
	{
		lgg.c.rectangle.draw(cam, pos_x, .993, lgg.level.spawn_freq/320000 * spawn_frac, .0045, 90,
			215, 1, (lgg.enemies.enemies_alive ? .35 : .65), .995,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
	}
}
