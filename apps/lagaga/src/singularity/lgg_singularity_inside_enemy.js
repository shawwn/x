"use strict";

lgg.SingularityInside_Enemy = function(type, id)
{
	var etype = lgg.singularityinside_enemy_types[type];
	var i = lgg.singularity.inside.find_empty_tile();
	this.type = type;
	this.id = id;
	var x = i % lgg.singularity.inside.map_size_x;
	var y = ((i - x) / lgg.singularity.inside.map_size_y);
	var tilesize = lgg.singularity.inside.tilesize;
	this.pos_x = x * tilesize + tilesize/2;
	this.pos_y = y * tilesize + tilesize/2;
	this.desired_target_range = 0;
	this.target_pos_x = this.pos_x;
	this.target_pos_y = this.pos_y;
	this.tile_x = x;
	this.tile_y = y;
	this.dying = 0;
	this.current_visibility = 0;
	this.desired_visibility = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.heading = 0;
	this.radius = tilesize/etype.smallness;
	this.acceleration = etype.acceleration;	// this gets changed on the fly
	this.active = true;
	this.health = 1;
};
lgg.SingularityInside_Enemy.prototype.think = function(time_delta)
{
	var tilesize = lgg.singularity.inside.tilesize;
	var player = lgg.singularity.inside.player;
	var etype = lgg.singularityinside_enemy_types[this.type];
	// player collision
	this.dist_from_player = µ.distance2D(player.pos_x, player.pos_y, this.pos_x, this.pos_y);
	var overlap = (this.radius + player.radius) - this.dist_from_player;
	if (overlap > 0)
	{
		var angle = µ.vector2D_to_angle(player.pos_x - this.pos_x, player.pos_y - this.pos_y);
		player.speed_x += µ.angle_to_x(angle) * overlap / 1000;
		player.speed_y += µ.angle_to_y(angle) * overlap / 1000;
	}
	// enemy/enemy collision
	for (var i = 0; i < lgg.MAX_SINGULARITY_ENEMIES; i++)
	{
		var e = lgg.singularity.inside.enemies.e[i];
		if (i == this.id || !e.active) continue;
		var dist = µ.distance2D(e.pos_x, e.pos_y, this.pos_x, this.pos_y);
		var overlap = (this.radius + e.radius) - dist;
		if (overlap > 0)
		{
			var angle = µ.vector2D_to_angle(e.pos_x - this.pos_x, e.pos_y - this.pos_y);
			e.speed_x += µ.angle_to_x(angle) * overlap / 250;
			e.speed_y += µ.angle_to_y(angle) * overlap / 250;
		}
	}
	this.can_see_player = false;
	this.can_hit_player = false;
	var sight_range = tilesize*12;
	if (this.dist_from_player < player.sight_range || this.dist_from_player < sight_range)
	{
		// 2 checks should be enough here, actually..
		var success = false;
		for (var i = 4; i--;)
		{
			if (lgg.singularity.inside.line_of_sight(
					this.pos_x		+ µ.directions[i][0] * this.radius,
					this.pos_y		+ µ.directions[i][1] * this.radius,
					player.pos_x	+ µ.directions[i][0] * player.radius,
					player.pos_y	+ µ.directions[i][1] * player.radius))
			{
				success = true;
				break;
			}
		}
		if (success)
		{
			this.seen_by_player = this.dist_from_player < player.sight_range;
			if (this.seen_by_player)
			{
				lgg.singularity.inside.scent_vis_enemies[this.tile] += 0.01 * time_delta;
				if (lgg.singularity.inside.scent_vis_enemies[this.tile] > 1)
					lgg.singularity.inside.scent_vis_enemies[this.tile] = 1;
			}
			this.can_see_player = this.dist_from_player < sight_range;
			if (this.can_see_player)
			{
				// this is kinda useless but hey :P
				this.can_hit_player = lgg.singularity.inside.line_of_sight(this.pos_x, this.pos_y, player.pos_x, player.pos_y);

				lgg.singularity.inside.scent_vis_player[player.tile] += 0.02 * time_delta;
				if (lgg.singularity.inside.scent_vis_player[player.tile] > 1)
					lgg.singularity.inside.scent_vis_player[player.tile] = 1;

			}
		}
	}
	this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
	this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
	this.tile = this.tile_y * lgg.singularity.inside.map_size_x + this.tile_x;
		lgg.singularity.inside.scent_enemies[this.tile] += 0.01 * time_delta;
	if (lgg.singularity.inside.scent_enemies[this.tile] > 1)
		lgg.singularity.inside.scent_enemies[this.tile] = 1;
	this.desired_visibility = lgg.singularity.inside.tile_vis[this.tile];
	this.current_visibility += (this.desired_visibility - this.current_visibility) / 50;
	etype.think(this, time_delta);
	if (this.target_pos_x != this.pos_x && this.target_pos_y != this.pos_y)
	{
		var dist_to_target = µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y);
		if (dist_to_target > this.desired_target_range)
		{
			var speed_factor = lgg.singularity.inside.tiles2[this.tile] == 3 ? 0.4 : 1;
			var dest_angle = µ.vector2D_to_angle(this.target_pos_x - this.pos_x, this.target_pos_y - this.pos_y);
			dest_angle = µ.turn(this.heading, dest_angle);
			this.heading += dest_angle * etype.turn_speed;
			this.speed_x += µ.angle_to_x(this.heading) * this.acceleration * time_delta * speed_factor;
			this.speed_y += µ.angle_to_y(this.heading) * this.acceleration * time_delta * speed_factor;
		}
	}
	lgg.singularity_map_collision(this, time_delta, this.radius, this.radius, 0.75);
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.speed_x *= etype.friction;
	this.speed_y *= etype.friction;
};
lgg.SingularityInside_Enemy.prototype.explode = function()
{
	this.dying = 1000;
	this.active = false;
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
		{
			angle: 360,
			pos_x: this.radius/4,
			pos_y: this.radius/4,
			angle_vel: this.radius * 3,
			lifespan: 500,
		});
}
lgg.SingularityInside_Enemy.prototype.take_damage = function(amount)
{
	this.health -= lgg.singularityinside_enemy_types[this.type].take_damage(this, amount);
	if (this.health <= 0)
		this.explode();
};
lgg.SingularityInside_Enemy.prototype.receive_alert = function()
{
	lgg.singularityinside_enemy_types[this.type].receive_alert(this);
};