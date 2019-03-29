"use strict";

lgg.projectile_types = [];

var inc = 0;

lgg.projectile_types[lgg.PROJECTILE_TYPE__PLASMA = inc++] =
{
	spawn:			function(p)
	{
	},
	draw:			function(p)
	{
	},
	think:			function(p, time_delta)
	{
	},
	impact:			function(p, player_index, enemy_index)
	{
		//console.log('impact', player_index, enemy_index);
	},
	time_out:			function(p)
	{
		console.log('timeout');
	},
	// happens both when impacting or timing out
	explode:			function(p)
	{
		console.log('explode');
	},
};


lgg.projectile_types[lgg.PROJECTILE_TYPE__BALL_LIGHTNING = inc++] =
{
	spawn:			function(p)
	{
	},

	draw:			function(p)
	{
		var frac = 0.1 + 0.9 * Math.min(7500, p.age) / 7500;
		var range = p.radius * 40 * frac;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_circle_soft, p.pos_x, p.pos_y, p.radius * 3, p.radius * 3, p.heading,
			220, 1, 1.5, 2,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_circle_softer_inverse, p.pos_x, p.pos_y, range * 2, range * 2, p.heading,
			220, 1, 1, 0.1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		for (var i = 0; i < lgg.MAX_ENEMIES; i++)
		{
			if (lgg.enemies.e[i].active)
			{
				var e = lgg.enemies.e[i];
				var range2 = range + e.radius;
				if (Math.abs(e.pos_x - p.pos_x) > range2 || Math.abs(e.pos_y - p.pos_y) > range2)
				{
					continue;
				}
				var dist = µ.distance2D(p.pos_x, p.pos_y, e.pos_x, e.pos_y);
				if (dist <= range2)
				{
					var frac2 = dist / range2;
					var points = 2 + Math.round(range2 * 40);
					for (var k = 0; k < 1; k++)
					{
						var brightness = µ.rand(0.5);
						var last_point_x = p.pos_x;
						var last_point_y = p.pos_y;
						for (var j = 0; j < points; j++)
						{
							var frac3 = (j + 1) / points;
							if (j == points - 1)
							{
								var this_point_x = e.pos_x;
								var this_point_y = e.pos_y;
							}
							else
							{
								var this_point_x = p.pos_x - (p.pos_x - e.pos_x) * frac3 - range2 * 0.075 + µ.rand(range2 * 0.15);
								var this_point_y = p.pos_y - (p.pos_y - e.pos_y) * frac3 - range2 * 0.075 + µ.rand(range2 * 0.15);
							}
							lgg.c.rectangle.draw_line(lgg.CAM_PLAYER,
									//p.pos_x, p.pos_y, e.pos_x, e.pos_y,
									last_point_x, last_point_y, this_point_x, this_point_y,
									0.005,
									220, 1, 0.65, (0.3 + brightness * 0.5) * frac2,
									220, 1, 0.95, (0.5 + brightness) * frac2,
									220, 1, 0.95, (0.5 + brightness) * frac2,
									220, 1, 0.65, (0.3 + brightness * 0.5) * frac2
									);
							var last_point_x = this_point_x;
							var last_point_y = this_point_y;
						}
					}
				}
			}
		}
	},

	think:			function(p, time_delta)
	{
		var frac = 0.1 + 0.9 * Math.min(7500, p.age) / 7500;
		var range = p.radius * 40 * frac;
		for (var i = 0; i < lgg.MAX_ENEMIES; i++)
		{
			if (lgg.enemies.e[i].active)
			{
				if (µ.rand_int(10) == 0)
				{
					var e = lgg.enemies.e[i];
					var range2 = range + e.radius;
					if (Math.abs(e.pos_x - p.pos_x) > range2 || Math.abs(e.pos_y - p.pos_y) > range2)
					{
						continue;
					}
					var dist = µ.distance2D(p.pos_x, p.pos_y, e.pos_x, e.pos_y);
					if (dist <= range2)
					{
						lgg.projectile_types[p.projectile_type].impact(p, 0, -1);
						e.take_damage(p.damage * 0.5 * time_delta, lgg.DAMAGE_TYPE__ELECTRICITY, p.index, e.pos_x, e.pos_y);
					}
				}
			}
		}

	},

	impact:			function(p, player_index, enemy_index)
	{
		//console.log('impact', player_index, enemy_index);
	},

	time_out:			function(p)
	{
		console.log('timeout');
	},

	// happens both when impacting or timing out
	explode:			function(p)
	{
		console.log('explode');
	},

};