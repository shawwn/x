"use strict";

lgg.SingularityInside_Drone = function(id)
{
	this.id = id;
	this.reset();
};

lgg.SingularityInside_Drone.prototype.reset = function()
{
	var tilesize = lgg.singularity.inside.tilesize;
	this.type = -1;
	this.pos_x = 0;
	this.pos_y = 0;
	this.tile_x = 0;
	this.tile_y = 0;
	this.dying = 0;
	this.age = 0;
	this.lifespan = 0;
	this.last_sight_update = lgg.now;
	this.sight_range = tilesize * 8;
	this.sight_cone = 360;
	this.sight_vicinity = tilesize * .3;
	this.target_pos_x = 0;
	this.target_pos_y = 0;
	this.target_tile_x = 0;
	this.target_tile_y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.heading = 0;
	this.radius = lgg.singularity.inside.tilesize/7;
	this.acceleration = 0.00000475;
	this.active = false;
	this.health = 1;
}

lgg.SingularityInside_Drone.prototype.think = function(time_delta)
{
	this.age += time_delta;
	if (this.age > this.lifespan)
	{
		this.explode();
		return;
	}
	var tilesize = lgg.singularity.inside.tilesize;
	var player = lgg.singularity.inside.player;
	// player collision
	this.dist_from_player = µ.distance2D(player.pos_x, player.pos_y, this.pos_x, this.pos_y);
	var overlap = (this.radius + player.radius) - this.dist_from_player;
	if (overlap > 0)
	{
		var angle = µ.vector2D_to_angle(player.pos_x - this.pos_x, player.pos_y - this.pos_y);
		this.speed_x -= µ.angle_to_x(angle) * overlap / 250;
		this.speed_y -= µ.angle_to_y(angle) * overlap / 250;
	}
	// drone/enemy collision
	 var enemies = lgg.singularity.inside.enemies.e;
	for (var i = 0; i < lgg.MAX_SINGULARITY_ENEMIES; i++)
	{
		var e = enemies[i];
		if (i == this.id || !e.active) continue;
		var dist = µ.distance2D(e.pos_x, e.pos_y, this.pos_x, this.pos_y);
		var overlap = (this.radius + e.radius) - dist;
		if (overlap > 0)
		{
			var angle = µ.vector2D_to_angle(e.pos_x - this.pos_x, e.pos_y - this.pos_y);
			this.speed_x -= µ.angle_to_x(angle) * overlap / 250;
			this.speed_y -= µ.angle_to_y(angle) * overlap / 250;
		}
	}
	// drone/drone collision
	var drones = lgg.singularity.inside.drones.d;
	for (var i = 0; i < lgg.MAX_SINGULARITY_DRONES; i++)
	{
		var d = drones[i];
		if (i == this.id || !d.active) continue;
		var dist = µ.distance2D(d.pos_x, d.pos_y, this.pos_x, this.pos_y);
		var overlap = (this.radius + d.radius) - dist;
		if (overlap > 0)
		{
			var angle = µ.vector2D_to_angle(d.pos_x - this.pos_x, d.pos_y - this.pos_y);
			d.speed_x += µ.angle_to_x(angle) * overlap / 250;
			d.speed_y += µ.angle_to_y(angle) * overlap / 250;
		}
	}
	this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
	this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
	this.tile = this.tile_y * lgg.singularity.inside.map_size_x + this.tile_x;
	lgg.singularity.inside.scent_drones[this.tile] += 0.001 * time_delta;
	if (lgg.singularity.inside.scent_drones[this.tile] > 1)
		lgg.singularity.inside.scent_drones[this.tile] = 1;
	//if (lgg.singularity.inside.scent_vis[this.tile] > 0.001)
	{
		
		//if (lgg.singularity.inside.scent_player[this.tile] < 0.001)
		{
/*
			var dir = lgg.singularity.inside.sniff([
					[lgg.singularity.inside.scent_vis,-.1],
					[lgg.singularity.inside.scent_player,1],
					//[lgg.singularity.inside.scent_vis_enemies,2],
					[lgg.singularity.inside.scent_drones,-.001],
				],this.tile);
*/
		}
		//else
		{
			var dir = lgg.singularity.inside.sniff([
					//[lgg.singularity.inside.scent_exit,1],
					[lgg.singularity.inside.scent_vis,-1],
					[lgg.singularity.inside.scent_player,.1],
					//[lgg.singularity.inside.scent_vis_enemies,2],
					[lgg.singularity.inside.scent_drones,-1.5],
				],this.tile);
		}
	}
	//else
	{
		//var dir = µ.random_direction();
	}
	if (lgg.singularity.inside.tiles[(this.tile_y + dir.y) * lgg.singularity.inside.map_size_x + this.tile_x + dir.x] == 0)
	{
		this.target_tile_x = this.tile_x + dir.x;
		this.target_tile_y = this.tile_y + dir.y;
		this.target_pos_x = this.target_tile_x * tilesize + tilesize/2 - tilesize + µ.rand(tilesize*2);
		this.target_pos_y = this.target_tile_y * tilesize + tilesize/2 - tilesize + µ.rand(tilesize*2);
	}
	if (this.target_tile_x != -1)
	{
		var dist_to_target = µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y);
		if (dist_to_target > tilesize/1.55)
		{
			var dest_angle = µ.vector2D_to_angle(this.target_pos_x - this.pos_x, this.target_pos_y - this.pos_y);
			dest_angle = µ.turn(this.heading, dest_angle);
			this.heading = µ.angle_norm(this.heading + dest_angle * 0.75);
			if ((µ.angle_norm(dest_angle - this.heading + 90)) <= 180)
			{
				var actual_acceleration = this.acceleration * time_delta;
			}
			else
			{
				var actual_acceleration = this.acceleration * time_delta * 1;
			}
			this.speed_x += µ.angle_to_x(this.heading) * actual_acceleration;
			this.speed_y += µ.angle_to_y(this.heading) * this.acceleration * time_delta;
		}
	}
	lgg.singularity_map_collision(this, time_delta, this.radius, this.radius, 0.75);
	var old_x = this.pos_x;
	var old_y = this.pos_y;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	var friction = Math.pow(0.95, time_delta)
	this.speed_x *= friction;
	this.speed_y *= friction;
	lgg.particlesGPU.spawn(
		lgg.now,
		3,
		this.pos_x,
		this.pos_y,
		old_x,
		old_y,
		this.radius*2,
		-this.speed_x*200,
		-this.speed_y*200,
		0, this.radius/16,
		'trail2',
		1000,
		0,1,1,1,
		360,		//	vary_angle
		this.radius/8,		//	vary_angle_vel
		.01*this.radius,		//	vary_pos_x
		.01*this.radius,		//	vary_pos_y
		0,		//	vary_size
		.05*this.radius,		//	vary_vel_x
		.05*this.radius,		//	vary_vel_y
		200,		//	vary_lifespan
		0,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);
};

lgg.SingularityInside_Drone.prototype.draw = function()
{
	//var alpha = (lgg.input.key('KEY_B').pressed ? 1 : lgg.singularity.inside.tile_vis[this.tile]) * (this.dying > 0 ? this.dying / 1000 : 1);
	var alpha = this.dying ? this.dying / 1000 : 1;
	/*
	lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, this.pos_x, this.pos_y, this.radius*2, this.radius*2, 90, (52 - (1 - this.health)*52), 1, -.75, alpha);
	lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, this.pos_x, this.pos_y, this.radius*1.6, this.radius*1.6, 90, 40, 1, -.75, 1 * alpha);
	*/
};

lgg.SingularityInside_Drone.prototype.explode = function()
{
	this.dying = 1000;
	this.active = false;
	lgg.singularity.inside.drones.drones_active--;
	if (this.type == 0)
	{
		lgg.singularity.inside.drones.eyes_active--;
	}
	lgg.particlesGPU2.spawn(
		lgg.now,
		500 * this.radius / lgg.singularity.inside.tilesize,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		this.radius * 1.5,
		0,
		0,
		0, this.radius * 0.85,
		'damage',
		1000,
		0,1,1,1,
		360,		//	vary_angle
		this.radius * 3,		//	vary_angle_vel
		this.radius/4,		//	vary_pos_x
		this.radius/4,		//	vary_pos_y
		0,		//	vary_size
		0,		//	vary_vel_x
		0,		//	vary_vel_y
		500,		//	vary_lifespan
		0,		//	vary_color_hue
		0,		//	vary_color_sat
		0,		//	vary_color_lum
		0		//	vary_color_a
	);

}

lgg.SingularityInside_Drone.prototype.take_damage = function(amount)
{
	this.health -= lgg.singularityinside_enemy_types[this.type].take_damage(this, amount);
	if (this.health <= 0)
		this.explode();
};
