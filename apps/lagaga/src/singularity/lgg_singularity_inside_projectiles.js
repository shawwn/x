"use strict";

lgg.SingularityInside_Projectiles = function()
{
	this.reset();
};
lgg.SingularityInside_Projectiles.prototype.reset = function()
{
	this.p = [];
	for (var i = 0; i < lgg.MAX_SINGULARITY_PROJECTILES; i++)
	{
		this.p.push(new lgg.SingularityInside_Projectile());
	}
}
lgg.SingularityInside_Projectiles.prototype.think = function(time_delta)
{
	var tilesize = lgg.singularity.inside.tilesize;
	var player = lgg.singularity.inside.player;
	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		if (this.p[i].active)
		{
			var projectile = this.p[i];
			if (!projectile.enemy)
			{
				for (var j = 0; j < lgg.MAX_SINGULARITY_ENEMIES; j++)
				{
					if (!lgg.singularity.inside.enemies.e[j].active) continue;
					var enemy = lgg.singularity.inside.enemies.e[j];
					var dist = µ.distance2D(enemy.pos_x, enemy.pos_y, projectile.pos_x, projectile.pos_y);
					var overlap = (projectile.radius + enemy.radius) - dist;
					if (overlap > 0)
					{
						// alert
						if (projectile.type == 2 && projectile.owner_id != j)
						{
							enemy.receive_alert();
							projectile.age = projectile.lifespan + 1;
						}
						// actual projectile
						else if (projectile.type != 2)
						{
							enemy.take_damage(projectile.type != 0 ? projectile.damage : projectile.damage / 2);
							projectile.age = projectile.lifespan + 1;
							var angle = µ.vector2D_to_angle(projectile.pos_x - enemy.pos_x, projectile.pos_y - enemy.pos_y);
							enemy.speed_x -= µ.angle_to_x(angle) * projectile.damage * 0.00005;
							enemy.speed_y -= µ.angle_to_y(angle) * projectile.damage * 0.00005;
						}
						break;
					}
				}
			}
			else
			{
				var dist = µ.distance2D(player.pos_x, player.pos_y, projectile.pos_x, projectile.pos_y);
				if (dist < player.radius + projectile.radius)
				{
					player.take_damage(projectile.damage);
					projectile.age = projectile.lifespan + 1;
				}
			}
			this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
			this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
			if (projectile.age > projectile.lifespan)
			{
				projectile.explode(false);
				continue;
			}
			projectile.think(time_delta);
		}
	}
};
lgg.SingularityInside_Projectiles.prototype.spawn = function(
	pos_x,
	pos_y,
	facing,
	enemy,
	owner_id,
	type,
	lifespan,
	speed,
	damage,
	hue,
	homing_turn,
	homing_speed,
	friction)
// hue is actually hue *shift*, final color depends on used pdefs
{
	var tilesize = lgg.singularity.inside.tilesize;
	for (var i = 0; i < lgg.MAX_PROJECTILES; i++)
	{
		if (!this.p[i].active)
		{
			var projectile = this.p[i];
			var x = µ.angle_to_x(facing);
			var y = µ.angle_to_y(facing);
			projectile.active = true;
			projectile.age = 0;
			projectile.lifespan = lifespan;
			projectile.damage = damage;
			projectile.radius = (0.05 + damage / 20) * tilesize; // this will prolly need lots of tweaking
			projectile.hue = hue;
			
			projectile.owner_id = owner_id;
			
			projectile.friction = friction;
			projectile.heading = facing;
			projectile.homing_turn = homing_turn;
			projectile.homing_speed = homing_speed;
			projectile.enemy = enemy;
			projectile.type = type;
			projectile.speed_x = x * speed;
			projectile.speed_y = y * speed;
			projectile.pos_x = pos_x;
			projectile.pos_y = pos_y;
			projectile.last_trail_x = pos_x;
			projectile.last_trail_y = pos_y;
			if (!enemy)
			{
				//var pdef = 'plasma';
			}
			else
			{
				if (type == 1)
				{
					var pdef = 'enemy_blue_plasma';
				}
				else if (type == 0)
				{
					var pdef = 'enemy_plasma';
				}
				lgg.particlesGPU2.spawn(lgg.now, 1,
					pos_x, pos_y, pos_x, pos_y,
					projectile.radius*2,
					0, 0,
					0, projectile.radius*1,
					pdef,
					800,
					hue,1,1,1,
					{
						angle:360,
						angle_vel: projectile.radius*2,
						vel_x: projectile.radius/16,
						vel_y: projectile.radius/16,
						pos_x: projectile.radius/8,
						pos_y: projectile.radius/8,
						lifespan: 200,
					}
					);
			}
			return;
		}
	}
};
lgg.SingularityInside_Projectiles.prototype.draw = function()
{
	// nothing here, it's all done via particles (for now)
};