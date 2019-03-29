"use strict";

lgg.SingularityInside_Ability__Fireball = function()
{
	this.reset();
}

lgg.SingularityInside_Ability__Fireball.prototype.reset = function()
{
	this.last_shot = -99999;
	this.charge = 1;
}

lgg.SingularityInside_Ability__Fireball.prototype.pressed = function(player, time_delta)
{
	this.charge += time_delta * 0.0003;
	if (this.charge > 1)
		this.charge = 1;
	if (lgg.now - this.last_shot > 100 && this.charge >= 0.2)
	{
			{
				var frac = 1;//µ.rand(1);

				lgg.singularity.inside.projectiles.spawn(
					player.pos_x + µ.angle_to_x(player.heading) * player.radius,
					player.pos_y + µ.angle_to_y(player.heading) * player.radius,
					player.heading /*- spread/2 + i/(shots > 0 ? shots : 1)*spread - spread2/2 + µ.rand(spread2) */,
					false, 0, 0,
					3000 + µ.rand_int(500),
					0.00004 + 0.00003 * µ.rand(1),
					0.5 + .5 * frac,
					0,
					0, 0, 1);
			}
			this.charge -= 0.2;
			this.last_shot = lgg.now;
	}
}

lgg.SingularityInside_Ability__Fireball.prototype.released = function(player, time_delta)
{
	this.charge += time_delta * 0.0003;
	if (this.charge > 1)
		this.charge = 1;
}