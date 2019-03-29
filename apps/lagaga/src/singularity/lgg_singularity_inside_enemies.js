"use strict";

lgg.SingularityInside_Enemies = function()
{
	this.reset();
};
lgg.SingularityInside_Enemies.prototype.reset = function()
{
	this.e = [];
	this.last_spawn = -50000;
	for (var i = 0; i < lgg.MAX_SINGULARITY_ENEMIES; i++)
	{
		var type = lgg.rand.int(lgg.singularityinside_enemy_types.length-1);
		this.e.push(new lgg.SingularityInside_Enemy(type, i));
		lgg.singularityinside_enemy_types[type].spawn(this.e[i]);
	}
	this.enemies_alive = 0;
}
lgg.SingularityInside_Enemies.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_ENEMIES; i++)
	{
		if (this.e[i].active)
		{
			this.e[i].think(time_delta);
		}
		else if (this.e[i].dying > 0)
		{
			this.e[i].dying -= time_delta;
			if (this.e[i].dying < 0)
				this.e[i].dying = 0;
		}
	}
};
lgg.SingularityInside_Enemies.prototype.draw = function()
{
	for (var i = 0; i < lgg.MAX_SINGULARITY_ENEMIES; i++)
	{
		if (this.e[i].active || this.e[i].dying > 0)
		{
			lgg.singularityinside_enemy_types[this.e[i].type].draw(this.e[i]);
			//this.e[i].draw();
		}
	}
};
