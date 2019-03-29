"use strict";

lgg.Projectile = function(index)
{
	this.index = index;
	this.reset();
};

lgg.Projectile.prototype.reset = function()
{
	this.enemy				= false;
	this.active				= false;
	this.target_id			= -1;
	this.age				= 0;
	this.projectile_type	= 0;
	this.damage_type		= 0;
	this.radius				= 0;
	this.damage				= 0;
	this.last_trail			= lgg.now;
	this.last_trail_x		= 0;
	this.last_trail_y		= 0;
	this.lifespan			= 0;
	this.angle_vel			= 0;
	this.angle_accel		= 0;
	this.hue				= 0;
	this.hue2				= 0;
	this.pos_x				= 0;
	this.pos_y				= 0;
	this.speed_x			= 0;
	this.speed_y			= 0;
	this.heading			= 0;
	this.homing_turn		= 0;
	this.homing_speed		= 0;
	this.wobble_offset		= 0;
}

lgg.Projectile.prototype.explode = function()
{
	this.active = false;
	lgg.particlesGPU.spawn(
		lgg.now,
		1,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * lgg.PROJECTILE_RADIUS_DAMAGE_FACTOR_EXPLOSION,
		this.speed_x * 125,
		this.speed_y * 125,
		0, 0,
		lgg.particles__plasma_explode,
		450,
		this.hue2, 1, 1, 1.0,
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
		this.radius * lgg.PROJECTILE_RADIUS_DAMAGE_FACTOR_EXPLOSION * 1.5,
		this.speed_x * 250,
		this.speed_y * 250,
		0, 0,
		lgg.particles__plasma_explode2,
		750,
		this.hue, 1, 1, 1.0,
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
}

lgg.Projectile.prototype.think = function(time_delta)
{
	lgg.projectile_types[this.projectile_type].think(this, time_delta);
	if (this.homing_turn > 0 && (this.homing_time == -1 || this.homing_time > 0))
	{
		if (this.homing_delay <= 0)
		{
			var target_x = -1;
			if (this.enemy)
			{
				var target_x = lgg.player.pos_x;
				var target_y = lgg.player.pos_y;
			}
			else
			{
				if (this.target_id > -1)
				{
					var e = lgg.enemies.e[this.target_id];
					if (e.active && e.health > 0)
					{
						var target_x = e.pos_x;
						var target_y = e.pos_y;
					}
					else
					{
						var closest_dist = 9999999999999;
						var closest_id = -1;
						for (var j = 0; j < lgg.MAX_ENEMIES; j++)
						{
							var e = lgg.enemies.e[j];
							if (e.active == true && e.health > 0 && closest_dist > e.dist_from_player)
							{
								closest_dist = e.dist_from_player;
								closest_id = j;
							}
						}
						this.target_id = closest_id;
						if (closest_id != -1)
						{
							var target_x = lgg.enemies.e[closest_id].pos_x;
							var target_y = lgg.enemies.e[closest_id].pos_y;
						}
					}
				}
				else
				{
					var closest_dist = 9999999999999;
					var closest_id = -1;
					for (var j = 0; j < lgg.MAX_ENEMIES; j++)
					{
						var e = lgg.enemies.e[j];
						if (e.active == true && e.health > 0 && closest_dist > e.dist_from_player)
						{
							closest_dist = e.dist_from_player;
							closest_id = j;
						}
					}
					this.target_id = closest_id;
					if (closest_id != -1)
					{
						var target_x = lgg.enemies.e[closest_id].pos_x;
						var target_y = lgg.enemies.e[closest_id].pos_y;
					}
				}
			}

			if (target_x != -1)
			{
				var dest_angle = µ.vector2D_to_angle(target_x - this.pos_x, target_y - this.pos_y);
				dest_angle = µ.turn(this.heading, dest_angle);
				this.heading += dest_angle * this.homing_turn * time_delta;
				this.speed_x += µ.angle_to_x(this.heading) * this.homing_speed * time_delta;
				this.speed_y += µ.angle_to_y(this.heading) * this.homing_speed * time_delta;
				if (this.homing_time !== -1)
				{
					this.homing_time -= time_delta;
				}
			}

		}
		else
		{
			this.homing_delay -= time_delta;
		}
	}
	if (this.wobble_freq != 0)
	{
		var wobble = Math.cos(+Math.PI*this.wobble_offset - this.age/this.wobble_freq) * time_delta * this.wobble_speed
		this.speed_x += µ.angle_to_x(this.heading + 90) * wobble;
		this.speed_y += µ.angle_to_y(this.heading + 90) * wobble;
	}
	//if (Math.abs(this.angle_vel) > 0)
	{
		this.heading += this.angle_vel * time_delta;
	}
	if (Math.abs(this.angle_accel) > 0)
	{
		this.speed_x += µ.angle_to_x(this.heading) * this.angle_accel * time_delta;
		this.speed_y += µ.angle_to_y(this.heading) * this.angle_accel * time_delta;
	}
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.age += time_delta;
	if (this.age > 500 &&
			(	((this.pos_y > lgg.level.size_y * 1.2) && (this.speed_y > 0))
			||	((this.pos_y < -lgg.level.size_y * 0.2) && (this.speed_y < 0))
			||	((this.pos_x > lgg.level.size_x * 1.2) && (this.speed_x > 0))
			||	((this.pos_x < -lgg.level.size_x * 0.2) && (this.speed_x < 0))
			))
	{
		this.active = false;
		return;
	}
	var frac = this.age/this.lifespan;
	while(lgg.now - this.last_trail >= 5)
	{
		this.last_trail = lgg.now;
		var lifespan = 50 + this.radius * 500 + (1-frac) * 200;
		lgg.particlesGPU.spawn(
			lgg.now,
			2,
			this.pos_x,
			this.pos_y,
			this.last_trail_x,
			this.last_trail_y,
			this.radius * lgg.PROJECTILE_PARTICLES_SIZE_FACTOR * 1.0,
			-this.speed_x * 64,
			-this.speed_y * 64,
			0, 0,
			lgg.particles__plasma,
			lifespan,
			this.hue, 1-frac/2, 1, 0.5 + this.damage / 4,
			0,						//	vary_angle
			0,						//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			0,						//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0,						//	vary_color_a
			2						//	vary_birthdate
		);
		lgg.particlesGPU.spawn(
			lgg.now - 5,
			2,
			this.pos_x,
			this.pos_y,
			this.last_trail_x,
			this.last_trail_y,
			this.radius * lgg.PROJECTILE_PARTICLES_SIZE_FACTOR * 0.75,
			-this.speed_x * 64,
			-this.speed_y * 64,
			0, 0,
			lgg.particles__plasma2,
			lifespan,
			this.hue2, 1-frac/2, 1, 0.5 + this.damage / 4,
			0,						//	vary_angle
			0,						//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			0,						//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0,						//	vary_color_a
			4						//	vary_birthdate
		);
		this.last_trail_x = this.pos_x;
		this.last_trail_y = this.pos_y;
	}
	if (this.friction != 1)
	{
		var friction = Math.pow(this.friction, time_delta);
		this.speed_x *= friction;
		this.speed_y *= friction;
	}
};