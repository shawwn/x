"use strict";

lgg.SingularityInside_Ability__ExitFinder = function()
{
	this.reset();
}
lgg.SingularityInside_Ability__ExitFinder.prototype.reset = function()
{
	this.last_trail = 0;
}
lgg.SingularityInside_Ability__ExitFinder.prototype.pressed = function(player, time_delta)
{
	if (lgg.now - this.last_trail >= 5)
	{
		var dir = lgg.singularity.inside.sniff([[lgg.singularity.inside.scent_exit, 1]], player.tile);
		var tilesize = lgg.singularity.inside.tilesize;
		lgg.particlesGPU.spawn(
			lgg.now,
			Math.round((lgg.now - this.last_trail) / 5),
			player.pos_x,
			player.pos_y,
			player.pos_x,
			player.pos_y,
			tilesize /2,
			dir.x * tilesize * 5,
			dir.y * tilesize * 5,
			0, 0,
			'trail2',
			500,
			120,.5,.5,1,
			0,		//	vary_angle
			0,		//	vary_angle_vel
			0,		//	vary_pos_x
			0,		//	vary_pos_y
			0,		//	vary_size
			0,		//	vary_vel_x
			0,		//	vary_vel_y
			0,		//	vary_lifespan
			0,		//	vary_color_hue
			0,		//	vary_color_sat
			0,		//	vary_color_lum
			0		//	vary_color_a
			);
		this.last_trail = lgg.now;
	}
}
lgg.SingularityInside_Ability__ExitFinder.prototype.released = function(player, time_delta)
{
	this.last_trail = lgg.now;
}