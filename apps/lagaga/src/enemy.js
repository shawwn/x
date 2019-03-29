"use strict";

lgg.Enemy = function(id)
{
	this.id = id;
	this.reset();
};

lgg.Enemy.prototype.reset = function()
{
	this.active					= false;
	this.avoiding_player		= false;
	this.age					= 0;
	this.dist_from_player		= 100000;
	this.etype					= undefined;
	this.heading				= 270;
	this.pos_x					= 0;
	this.pos_y					= 0;
	this.old_pos_x				= 0;
	this.old_pos_y				= 0;
	this.collision_flags		= 0;
	this.speed_x				= 0;
	this.speed_y				= 0;

	this.last_shots				= new Float32Array(0);
	this.last_shot_attempts 	= new Float32Array(0);
	this.barrage_shots_to_fire	= new Float32Array(0);
	this.barrage_next_shot		= new Float32Array(0);
	this.barrage_angle			= new Float32Array(0);
	this.barrage_eta			= new Float32Array(0);
	
	this.damage_bost_duration	= 0;

	this.last_hit				= 0;
	this.last_shield_hit		= 0;
	this.last_recharge			= 0;
	this.time_to_linger			= 0;
	this.target_pos_x			= -1;
	this.target_pos_y			= -1;
	this.radius					= 0.010;
	this.health					= 1.0;
	this.armour					= 1.0;

	this.shield					= 0;
	this.shield_shown			= 0;
	this.shield_max				= 0;
	this.shields_are_gone		= false;

	this.energy					= 1.0;
	this.next_target_update		= -999;
	this.speed					= 0.00000064;
	this.effective_speed		= 0.00000064;

	this.will_join_up			= false;
	this.following				= -1;	// which enemy is this one following?
	this.follower				= -1;	// which enemy is following this one?
	this.follow_group			= -1;	// who is the leader of the chain?

	this.attacking				= false;
	this.departing				= false;
	this.byebye					= false;
}
lgg.Enemy.prototype.follow = function(target_id)
{
}
lgg.Enemy.prototype.unfollow = function()
{
	if (this.following > -1)
	{
		lgg.enemies.e[this.following].follower = -1;
		this.following = -1;
	}
}
lgg.Enemy.prototype.take_damage = function(damage_amount, damage_type, projectile_index, damage_pos_x, damage_pos_y)
{
	damage_amount = this.etype.damage(this, damage_amount, damage_type);
	if (damage_amount > 0)
	{
		lgg.damage_types[damage_type].impact(damage_amount, -1, this.id, projectile_index, damage_pos_x, damage_pos_y);
	}
}

lgg.Enemy.prototype.disappears = function()
{
	lgg.level.danger_to_bring += this.etype.danger * lgg.ENEMY_DANGER_FACTOR__MOVING_ON;
	lgg.level.danger_passed_by += this.etype.danger;
	// 100 danger = 1 second
	lgg.level.spawn_freq -= this.etype.danger * 10;
	this.die();
}

lgg.Enemy.prototype.die = function(caused_by_player)
{
	// link follower and followed to save time
	if (this.follower > -1 && this.following > -1)
	{
		lgg.enemies.e[this.following].follower = this.follower;
		lgg.enemies.e[this.follower].following = this.following;
	}
	else  if (this.follower > -1)
	{
		lgg.enemies.e[this.follower].following = -1;
		lgg.enemies.e[this.follower].target_pos_x = -1;
		lgg.enemies.e[this.follower].target_pos_y = -1;
	}
	else if (this.following > -1)
	{
		lgg.enemies.e[this.following].follower = -1;
	}
	lgg.enemies.enemies_alive--;
	lgg.enemies.enemies_alive_of_type[this.etype.id]--;
	for (var i = 0, len = lgg.etypes.length; i < len; i++)
	{
		if (i != this.etype.id)
		{
			lgg.enemies.enemies_alive_of_type_other_than[i]--;
		}
	}

	lgg.level.danger_in_play -= this.etype.danger;
	this.reset();
}

lgg.Enemy.prototype.attack_weight_func = function(attack, attack_id, self)
{
	//console.log(lgg.now - self.last_shots[attack_id] > attack.freq, lgg.now - self.last_shots[attack_id], attack.freq);

	return (
				lgg.now - self.last_shots[attack_id] < attack.freq
			||	self.last_shot_attempts[attack_id] == lgg.now
			||	self.dist_from_player > attack.dist_max
			||	self.dist_from_player < attack.dist_min
			||	self.energy < attack.energy_cost
			||	attack.probability < µ.rand(1)
			) ? 0 : attack.weight;
}


lgg.Enemy.prototype.explode = function(caused_by_player)
{
	var etype = this.etype;

	lgg.level.overcome_danger(etype.danger, this.pos_x, this.pos_y, caused_by_player)

	lgg.particlesGPU.spawn(
		lgg.now,
		1,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 4,
		0,
		0,
		0, 0,
		lgg.particles__damage,
		500,
		0,1,1,1,
		0,					//	vary_angle
		0,					//	vary_angle_vel
		0,					//	vary_pos_x
		0,					//	vary_pos_y
		0,					//	vary_size
		0,					//	vary_vel_x
		0,					//	vary_vel_y
		0,					//	vary_lifespan
		0,					//	vary_color_hue
		0,					//	vary_color_sat
		0,					//	vary_color_lum
		0					//	vary_color_a
	);
	lgg.particlesGPU.spawn(
		lgg.now,
		1,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 5,
		0,
		0,
		0, 0,
		lgg.particles__damage,
		1000,
		0,1,1,1,
		0,					//	vary_angle
		0,					//	vary_angle_vel
		0,					//	vary_pos_x
		0,					//	vary_pos_y
		0,					//	vary_size
		0,					//	vary_vel_x
		0,					//	vary_vel_y
		0,					//	vary_lifespan
		0,					//	vary_color_hue
		0,					//	vary_color_sat
		0,					//	vary_color_lum
		0					//	vary_color_a
	);
	lgg.particlesGPU.spawn(
		lgg.now,
		1,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 6,
		0,
		0,
		0, 0,
		lgg.particles__damage,
		1500,
		0,1,1,1,
		0,					//	vary_angle
		0,					//	vary_angle_vel
		0,					//	vary_pos_x
		0,					//	vary_pos_y
		0,					//	vary_size
		0,					//	vary_vel_x
		0,					//	vary_vel_y
		0,					//	vary_lifespan
		0,					//	vary_color_hue
		0,					//	vary_color_sat
		0,					//	vary_color_lum
		0					//	vary_color_a
	);
	lgg.particlesGPU.spawn(
		lgg.now,
		µ.between(50, 15000 * this.radius, 200),
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 0.75,
		0,
		0,
		0, this.radius * 1.5,
		lgg.particles__damage,
		1000,
		0,1,1,1,
		360,				//	vary_angle
		this.radius * 3,	//	vary_angle_vel
		this.radius/4,		//	vary_pos_x
		this.radius/4,		//	vary_pos_y
		0,					//	vary_size
		0,					//	vary_vel_x
		0,					//	vary_vel_y
		500,				//	vary_lifespan
		0,					//	vary_color_hue
		0,					//	vary_color_sat
		0,					//	vary_color_lum
		0					//	vary_color_a
	);
	lgg.particlesGPU.spawn(
		lgg.now,
		µ.between(5, 1500 * this.radius, 20),
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 1.5,
		0,
		0,
		0, this.radius * 2,
		lgg.particles__damage,
		2000,
		0,1,1,1,
		360,	//	vary_angle
		this.radius * 2,		//	vary_angle_vel
		this.radius/2,		//	vary_pos_x
		this.radius/2,		//	vary_pos_y
		0,		//	vary_size
		0,		//	vary_vel_x
		0,		//	vary_vel_y
		500,		//	vary_lifespan
		0,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);
	// trigger enemy-specific explosion stuff
	if (etype.explode)
	{
		etype.explode(this, caused_by_player);
	}
	this.die(caused_by_player);
}

lgg.Enemy.prototype.shields_gone = function()
{
	lgg.particlesGPU.spawn(
		lgg.now,
		µ.between(15, 120 * this.radius, 120),
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 3,
		this.speed_x,
		this.speed_y,
		0, this.radius * lgg.SHIELD_RADIUS,
		lgg.particles__damage_shield,
		200,
		0,1,1,1,
		360,	//	vary_angle
		0,		//	vary_angle_vel
		0,		//	vary_pos_x
		0,		//	vary_pos_y
		0,		//	vary_size
		0,		//	vary_vel_x
		0,		//	vary_vel_y
		150,	//	vary_lifespan
		30,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);
}

lgg.Enemy.prototype.shields_hit = function(damage_amount)
{
	var hue = 150 + 210 * (1 - this.shield / this.shield_max);
	lgg.particlesGPU.spawn(
		lgg.now,
		µ.between(15, 2500 * this.radius * damage_amount, 100),
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 1.5,
		this.speed_x,
		this.speed_y,
		0, this.radius * lgg.SHIELD_RADIUS,
		lgg.particles__damage_shield,
		150,
		hue,1,1,1,
		360,	//	vary_angle
		0,		//	vary_angle_vel
		0,		//	vary_pos_x
		0,		//	vary_pos_y
		0,		//	vary_size
		0,		//	vary_vel_x
		0,		//	vary_vel_y
		20,		//	vary_lifespan
		20,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);

}
