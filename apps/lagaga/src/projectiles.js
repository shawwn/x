"use strict";

lgg.Projectiles = function()
{
	this.reset();
};

lgg.Projectiles.prototype.reset = function()
{
	this.p = [];
	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		this.p.push(new lgg.Projectile(i));
	}
}

lgg.Projectiles.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		if (this.p[i].active)
		{
			var projectile = this.p[i];
			if (!projectile.enemy)
			{
				if (projectile.pos_y > lgg.level.size_y * 1.1)
				{
					projectile.active = false;
					continue;
				}
				if (projectile.projectile_type != lgg.PROJECTILE_TYPE__BALL_LIGHTNING)
				{
					for (var j = 0; j < lgg.MAX_ENEMIES; j++)
					{
						if (!lgg.enemies.e[j].active) continue;
						var enemy = lgg.enemies.e[j];
						var enemy_radius = enemy.shield > 0 ? enemy.radius * lgg.SHIELD_RADIUS : enemy.radius;
						var combined_radius = projectile.radius + enemy_radius;
						if (Math.abs(enemy.pos_x - projectile.pos_x) > combined_radius && Math.abs(enemy.pos_y - projectile.pos_y) > combined_radius)
						{
							continue;
						}
						var dist = µ.distance2D(enemy.pos_x, enemy.pos_y, projectile.pos_x, projectile.pos_y);
						var overlap = combined_radius - dist;
						if (overlap > 0)
						{
							lgg.projectile_types[projectile.projectile_type].impact(projectile, -1, j);
							enemy.take_damage(projectile.damage, projectile.damage_type, projectile.index, projectile.pos_x, projectile.pos_y);
							projectile.age = projectile.lifespan + 1;
							break;
						}
					}
					if (lgg.trader.active)
					{
						var dist = µ.distance2D(lgg.trader.pos_x, lgg.trader.pos_y, projectile.pos_x, projectile.pos_y);
						if (dist < lgg.trader.radius + projectile.radius)
						{
							lgg.trader.take_damage(projectile.damage, projectile.damage_type);
							projectile.age = projectile.lifespan + 1;
						}
					}
				}
			}
			else if (lgg.player.health > 0)
			{
				var dist = -1;
				if (Math.abs(lgg.player.pos_x - projectile.pos_x) <= lgg.player.projectile_dampening_radius && Math.abs(lgg.player.pos_y - projectile.pos_y) <= lgg.player.projectile_dampening_radius)
				{
					var dist = µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, projectile.pos_x, projectile.pos_y);
					if (dist < lgg.player.projectile_dampening_radius)
					{
						projectile.damage -= lgg.player.projectile_dampening_strength * time_delta;
						if (projectile.damage <= 0)
						{
							projectile.explode();
							continue;
						}
						projectile.radius = lgg.projectile_radius(projectile.damage);
					}
				}

				var player_radius = lgg.player.shield > 0 ? lgg.player.radius * lgg.SHIELD_RADIUS : lgg.player.radius;
				var combined_radius = projectile.radius + player_radius;
			
				if (Math.abs(lgg.player.pos_x - projectile.pos_x) <= combined_radius && Math.abs(lgg.player.pos_y - projectile.pos_y) <= combined_radius)
				{
					var dist = dist != -1 ? dist : µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, projectile.pos_x, projectile.pos_y);
					if (dist < combined_radius)
					{
						lgg.projectile_types[projectile.projectile_type].impact(projectile, 0, -1);
						lgg.player.take_damage(projectile.damage, projectile.damage_type, projectile.index, projectile.pos_x, projectile.pos_y);
						projectile.age = projectile.lifespan + 1;
					}
				}
			}
			if (projectile.age > projectile.lifespan)
			{
				projectile.explode();
				continue;
			}
			projectile.think(time_delta);
		}
	}
};

lgg.Projectiles.prototype.spawn = function(
	pos_x,
	pos_y,
	facing, enemy, projectile_type, damage_type, damage,
	lifespan, speed, friction,
	homing_turn, homing_speed, homing_time, homing_delay,
	wobble_freq, wobble_speed,
	angle_vel, angle_accel
	)
{
	if (angle_vel == undefined) angle_vel = 0;
	if (angle_accel == undefined) angle_accel = 0;

	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		if (!this.p[i].active)
		{

			var projectile = this.p[i];
			projectile.reset();
			projectile.active			= true;
			projectile.age				= 0;
			projectile.lifespan			= lifespan;
			projectile.damage			= damage;

			// !
			projectile.radius			= lgg.projectile_radius(damage);
			
			
			
			if (enemy)
			{
				projectile.hue				= 320;
				projectile.hue2				= 360;
			}
			else
			{
				if (homing_speed > 0)
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
					projectile.target_id = closest_id;
				}
				projectile.hue				= 190;
				projectile.hue2				= 190;
			}
			projectile.angle_vel		= angle_vel;
			projectile.angle_accel		= angle_accel;

			projectile.friction			= friction;
			projectile.heading			= facing;
			projectile.wobble_offset	= 0; //µ.rand_int(1);	should be made part of actual projectile spawning
			projectile.wobble_freq		= wobble_freq;
			projectile.wobble_speed		= wobble_speed;
			projectile.homing_turn		= homing_turn;
			projectile.homing_speed		= homing_speed;
			projectile.homing_time		= homing_time;
			projectile.homing_delay		= homing_delay;
			projectile.enemy			= enemy;
			projectile.projectile_type	= projectile_type
			projectile.damage_type		= damage_type
			projectile.speed_x			= µ.angle_to_x(facing) * speed;
			projectile.speed_y			= µ.angle_to_y(facing) * speed;
			projectile.pos_x			= pos_x;
			projectile.pos_y 			= pos_y;
			projectile.last_trail_x		= pos_x;
			projectile.last_trail_y		= pos_y;
			if (!enemy)
			{
				//var pdef = 'plasma';
			}
			else
			{
				lgg.particlesGPU.spawn(lgg.now, 1,
					pos_x, pos_y, pos_x, pos_y,
					projectile.radius*3,
					0, 0,
					0, projectile.radius*1,
					lgg.particles__plasma,
					800,
					projectile.hue,1,1,1,
					360,						//	vary_angle
					projectile.radius*2,		//	vary_angle_vel
					projectile.radius/4,		//	vary_pos_x
					projectile.radius/4,		//	vary_pos_y
					0,							//	vary_size
					projectile.radius/8,		//	vary_vel_x
					projectile.radius/8,		//	vary_vel_y
					200,						//	vary_lifespan
					0,							//	vary_color_hue
					0,							//	vary_color_sat
					0,							//	vary_color_lum
					0							//	vary_color_a
				);
			}
			return true;
		}
	}
	return false;
};
lgg.Projectiles.prototype.draw = function()
{
	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		if (this.p[i].active)
		{
			var p = this.p[i];
			lgg.projectile_types[p.projectile_type].draw(p);
			if (lgg.DEBUG__DRAW_PROJECTILE_RADIUS)
			{
				lgg.c.draw_circle(
					lgg.CAM_PLAYER,
					p.pos_x, p.pos_y,
					p.radius,
					0, 0,
					0, 1,
					{r:1,g:0,b:1,a:0.3},
					0,
					0);
			}
		}
	}


	// nothing here, it's all done via particles (for now)
};