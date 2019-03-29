"use strict";

/*
	0	fireball
	1	plasma
	2	[sound]
	3 	fireball fragment
*/
lgg.SingularityInside_Projectile = function() {
	this.enemy = false;
	this.active = false;
	this.age = 0;
	this.type = 0;
	this.radius = 0;
	this.damage = 0;
	this.last_trail = 0;
	this.last_trail_x = 0;
	this.last_trail_y = 0;
	this.lifespan = 0;
	this.hue = 0;
	this.pos_x = 0;
	this.pos_y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.heading = 0;
	this.bounces = 0;
	this.owner_id = 0;
	this.homing_turn = 0;
	this.homing_speed = 0;
	this.current_visibility = 0;
};
lgg.SingularityInside_Projectile.prototype.explode = function(by_collision)
{
	this.active = false;
	// ironically, sound projectiles appear silently ^_^
	if (!this.enemy && this.type == 2)
	{
		return;
	}
	// fireball clusters
	if (/*by_collision && */this.type == 0)
	{
		var fragments = Math.floor(7 + 0 * this.damage);
		//var angle_offset = µ.rand(360/fragments);
		var angle_offset = µ.vector2D_to_angle(this.speed_x, this.speed_y) - 45;
		for (var i = fragments; i--;)
		{
			var angle = angle_offset + 90/fragments * i - 60 + µ.rand(120);

			if (angle < 0) angle += 360;
			if (angle <= 360) angle -= 360;
			lgg.singularity.inside.projectiles.spawn(
				this.pos_x,
				this.pos_y,
				angle,
				this.enemy, this.owner_id, 3,
				250 + 125 * this.damage + µ.rand_int(125),
				0.00002 + µ.rand(0.00003),
				this.damage / fragments,
				0,
				0, 0, .9999);
		}
	}
	if (this.current_visibility > 0.01)
	{
		if (!this.enemy)
		{
			var pdef = 'plasma_explode';
		}
		else
		{
			if (this.type == 0)
			{
				var pdef = 'enemy_blue_plasma_explode';
			}
			else
			{
				var pdef = 'plasma_explode';
			}
		}
		lgg.particlesGPU2.spawn(
			lgg.now,
			1,
			this.pos_x,
			this.pos_y,
			this.pos_x,
			this.pos_y,
			this.radius * 3,
			this.speed_x * 50,
			this.speed_y * 50,
			0, 0,
			pdef,
			500 + 25000 * this.radius,
			this.hue, 1,1,this.current_visibility,
			{});
		lgg.particlesGPU2.spawn(
			lgg.now,
			20,
			this.pos_x,
			this.pos_y,
			this.pos_x,
			this.pos_y,
			this.radius * 1.5,
			this.speed_x * 50,
			this.speed_y * 50,
			0, 0,
			pdef,
			750 + 15000 * this.radius,
			this.hue, 1,1,this.current_visibility,
			{
				angle: 360,
				angle_vel: this.radius * 15,
				lifespan: (750 + 15000 * this.radius) / 2,
			}
			);
	}
}
lgg.SingularityInside_Projectile.prototype.think = function(time_delta)
{
	var tilesize = lgg.singularity.inside.tilesize;
	var player = lgg.singularity.inside.player;
	if (this.homing_turn > 0)
	{
		var dest_angle = µ.vector2D_to_angle(player.pos_x - this.pos_x, player.pos_y - this.pos_y);
		dest_angle = µ.turn(this.heading, dest_angle);
		this.heading += dest_angle * this.homing_turn;
		this.speed_x += µ.angle_to_x(this.heading) * this.homing_speed * time_delta;
		this.speed_y += µ.angle_to_y(this.heading) * this.homing_speed * time_delta;
	}
	var bounce = this.type == 3 ? 0.9 : 0;
	if (
			lgg.singularity_map_collision(this, time_delta, this.radius, this.radius, bounce)
		)
	{
		this.bounces++;
		if (this.type != 3 || this.bounces > 50)
		{
			this.explode(true);
			return;
		}
	}
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.age += time_delta;
	var frac = this.age/this.lifespan;
	this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
	this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
	this.tile = this.tile_y * lgg.singularity.inside.map_size_x + this.tile_x;
	this.desired_visibility = lgg.singularity.inside.tile_vis[this.tile];
	this.current_visibility += (this.desired_visibility - this.current_visibility) / 10;
	if (
			this.current_visibility > 0.01
		&&	!(!this.enemy && this.type == 2) // "sound projectiles"
		&&	lgg.now - this.last_trail >= 5 
		// && this.pos_x < lgg.level.size_x && this.pos_x > 0 && this.pos_y < lgg.level.size_y && this.pos_y > 0
		)
	{
		this.last_trail = lgg.now;
		var lifespan = 200 + (1-frac) * 50;
		if (!this.enemy)
		{
			var pdef = 'fireball';
		}
		else
		{
			if (this.type == 0)
			{
				var pdef = 'enemy_blue_plasma';
			}
			else
			{
				var pdef = 'enemy_plasma';
			}
		}
		
		lgg.particlesGPU2.spawn(
			lgg.now,
			3,
			this.pos_x,
			this.pos_y,
			this.last_trail_x,
			this.last_trail_y,
			this.radius*3,
			0, 0,
			0, this.radius*1,
			pdef,
			lifespan * 1.25 - lifespan * frac,
			this.hue,1-frac/2,1,this.current_visibility,
			{
				angle: 360,
				angle_vel: this.radius*2,
				vel_x: .2*this.radius,
				vel_y: .2*this.radius,
				pos_x: .1*this.radius,
				pos_y: .1*this.radius,
				lifespan: lifespan / 8,
			}
			);
		this.last_trail_x = this.pos_x;
		this.last_trail_y = this.pos_y;
	}
	this.speed_x *= this.friction;
	this.speed_y *= this.friction;
};