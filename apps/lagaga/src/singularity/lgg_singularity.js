"use strict";

lgg.singularity_map_collision = function(self, time_delta, width, height, bounce)
{
	var tilesize = lgg.singularity.inside.tilesize;
	var tile_x = Math.floor(self.pos_x / tilesize - tilesize/2);
	var tile_y = Math.floor(self.pos_y / tilesize - tilesize/2);
	var directions =
		[
			[1,1], // up right
			[1,-1], // right down
			[-1,-1], // down left
			[-1,1], // left up
		];
		
	var collision = false;
	for (var i = 4; i--;)
	{
		var target_x = (self.pos_x + width * directions[i][0] + self.speed_x * time_delta) / tilesize - tilesize/2;
		var target_y = (self.pos_y + height * directions[i][1] + self.speed_y * time_delta) / tilesize - tilesize/2;
		var target_tile_x = Math.floor(target_x);
		var target_tile_y = Math.floor(target_y);
		var target_tile2_x = Math.round(target_x);
		var target_tile2_y = Math.round(target_y);
		
		if (lgg.singularity.inside.tiles[tile_y * lgg.singularity.inside.map_size_x + target_tile_x] == 1)
		{
			collision = true;
			self.speed_x *= -bounce;
			self.pos_x -= directions[i][0] * Math.abs(target_x - target_tile2_x) * tilesize;
		}
		if (lgg.singularity.inside.tiles[target_tile_y * lgg.singularity.inside.map_size_x + tile_x] == 1)
		{
			collision = true;
			self.speed_y *= -bounce;
			self.pos_y -= directions[i][1] * Math.abs(target_y - target_tile2_y) * tilesize;
		}
	}
	return collision;
}
// this is very scientific, in a star trek sort of way.
lgg.Singularity = function()
{
	this.reset();
};
lgg.Singularity.prototype.reset = function()
{
	this.next_singularity_event = µ.rand_int(9);
	this.active = false;
	this.inside = null;
	this.pos_x = 0;
	this.pos_y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.radius = 0.075;
}
lgg.Singularity.prototype.enter = function()
{
	lgg.now += 5000; // to make particles fade away
	lgg.level.state = lgg.LEVELSTATE__SINGULARITY_ENTER;
	lgg.level.state_time = 0;
	lgg.cameras.player.set_size(1, 1);
	lgg.cameras.player.set_zoom(0.125);
	this.inside = new lgg.SingularityInside();
	this.inside.player = new lgg.SingularityInside_Player();
	this.inside.generate_map();
	this.inside.enemies = new lgg.SingularityInside_Enemies();
	this.inside.drones = new lgg.SingularityInside_Drones();
	this.inside.projectiles = new lgg.SingularityInside_Projectiles();
}
lgg.Singularity.prototype.exit = function()
{
	lgg.cameras.player.set_zoom(1);
	lgg.cameras.player.set_size(lgg.level.size_x, lgg.level.size_y);
	lgg.level.state = lgg.LEVELSTATE__SINGULARITY_EXIT;
	lgg.level.state_time = 0;
}
lgg.Singularity.prototype.think_inside = function(time_delta)
{
	this.inside.think(time_delta);
}
lgg.Singularity.prototype.draw_inside = function()
{
	this.inside.draw(this);
};
lgg.Singularity.prototype.think = function(time_delta)
{
	if (!this.active)
	{
		if (!lgg.DEBUG__SINGULARITY_DISABLED)
		{
			this.next_singularity_event -= time_delta;
			if (this.next_singularity_event > 0) return;
			this.spawn();
		}
	}
	else
	{
		// player collision
		var dist_from_player = µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, this.pos_x, this.pos_y);
		var overlap = (this.radius + lgg.player.radius) - dist_from_player;
		if (overlap > 0 || lgg.input.key('KEY_B').pressed)
		{
			this.enter();
		}
		this.pos_y += this.speed_y * time_delta;
	}
};
lgg.Singularity.prototype.spawn = function()
{
	this.active = true;
	this.pos_x = µ.rand(lgg.level.size_x);
	this.pos_y = lgg.level.size_y + this.radius;
	this.speed_y = -0.00002 - µ.rand(0.00008);
	this.hue = µ.rand(360);
};
lgg.Singularity.prototype.draw = function()
{
	if (this.active)
	{
		lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_singularity, this.pos_x, this.pos_y, this.radius*2, this.radius*2, 90, this.hue, .8, 1, 1);
	}
};