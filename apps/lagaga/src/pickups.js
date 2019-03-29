"use strict";

lgg.Pickups = function()
{
	this.reset();
};

lgg.Pickups.prototype.reset = function()
{
	this.p = [];
	this.last_spawn = 0;
	this.danger_accum = 0;
	this.danger_current = 0;
	for (var i = 0; i < lgg.MAX_PICKUPS; i++)
	{
		this.p.push(new lgg.Pickup(i));
	}
	this.pickups_active = 0;
};

lgg.Pickups.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_PICKUPS; i++)
	{
		if (this.p[i].active)
		{
			var this_p = this.p[i];
			for (var j = 0; j < lgg.MAX_PICKUPS; j++)
			{
				var other_p = this.p[j];
				if (!other_p.active || j == i)
				{
					continue;
				}

				var combined_radius = this_p.radius + other_p.radius;
				if (Math.abs(other_p.pos_x - this_p.pos_x) > combined_radius || Math.abs(other_p.pos_y - this_p.pos_y) > combined_radius)
				{
					continue;
				}
				var dist = µ.distance2D(other_p.pos_x, other_p.pos_y, this_p.pos_x, this_p.pos_y);
				var overlap = (this_p.radius + other_p.radius) - dist;
				if (overlap > 0)
				{
					var angle = µ.vector2D_to_angle(other_p.pos_x - this_p.pos_x, other_p.pos_y - this_p.pos_y);
					overlap = Math.min(overlap, combined_radius / 2) / 75000 * time_delta;
					var move_x = µ.angle_to_x(angle) * overlap;
					var move_y = µ.angle_to_y(angle) * overlap;
					other_p.speed_x += move_x;
					other_p.speed_y += move_y;
					this_p.speed_x -= move_x;
					this_p.speed_y -= move_y;
				}
			}
			this.p[i].think(time_delta);
		}
	}
};

lgg.Pickups.prototype.spawn_weight_func = function(pickup_type, pickup_type_index, danger)
{
	return (	(pickup_type.probability < 1 && µ.rand(1) > pickup_type.probability)
			||	lgg.pickups.danger_current < pickup_type.danger_subtract
			||	(danger + lgg.pickups.danger_accum) < pickup_type.min_danger
			) ? 0 : pickup_type.weight();
};

lgg.Pickups.prototype.spawn_maybe = function(pos_x, pos_y, danger)
{
	this.danger_current = danger;
	var attempts = µ.rand_int(3) + Math.min(10, Math.round((this.danger_accumt + danger) * 0.25));
	for (var i = 0; i < attempts && this.danger_current > 0; i++)
	{
		var type_id = µ.pick_randomly_from_weighted_list(lgg.pickup_types, this.spawn_weight_func, danger);
		if (type_id != null)
		{
			this.danger_current -= lgg.pickup_types[type_id].danger_subtract * 0.5;
			this.danger_accum -= lgg.pickup_types[type_id].danger_subtract * 0.5;
			this.spawn(pos_x, pos_y, type_id);
		}
	}
	// save a little of the unused danger
	this.danger_accum += this.danger_current / 10;
	this.danger_current = 0;
};

lgg.Pickups.prototype.spawn = function(pos_x, pos_y, type_id)
{
	for (var i = 0; i < lgg.MAX_PICKUPS; i++)
	{
		if (!this.p[i].active)
		{
			this.p[i].reset();
			var ptype = lgg.pickup_types[type_id];
			this.p[i].type_id = type_id;
			this.p[i].type = ptype;


			this.p[i].active = true;
			this.p[i].radius = 0.015 * ptype.radius;
			this.p[i].pos_x = pos_x;
			this.p[i].pos_y = pos_y;
			this.p[i].last_trail_x = pos_x;
			this.p[i].last_trail_y = pos_y;

			var angle = 15 + µ.rand(120)
			var speed = ptype.spawn_speed_min + µ.rand(ptype.spawn_speed_max);
			this.p[i].speed_x = µ.angle_to_x(angle) * speed;
			this.p[i].speed_y = µ.angle_to_y(angle) * speed;
			this.p[i].rotation_speed = (-0.5 + µ.rand(1)) * 0.5;
			this.pickups_active++;
			this.last_spawn = lgg.now;
			return 1;
		}
	}
	return 0;
}

lgg.Pickups.prototype.draw = function()
{
	var pulse = 1.15 + 0.25 * Math.sin(lgg.now/222);
	for (var i = 0; i < lgg.MAX_PICKUPS; i++)
	{
		if (this.p[i].active)
		{
			var tp = this.p[i];
			var fade = (tp.picked_up > 0 ? (tp.picked_up / lgg.PICKUP_FADEOUT_TIME) : 1);
			var r1 = tp.radius * 2 * fade;
			var texture = tp.type.texture == 0 ? lgg.tex_pickup_ball : lgg.tex_pickup_credits;
			lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
				lgg.tex_pickup,
				tp.pos_x, tp.pos_y, r1, r1, tp.heading,
				0, 1, 1, fade,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);
			lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
				texture,
				tp.pos_x, tp.pos_y, r1, r1, tp.heading,
				tp.type.hue, 1, 1, fade,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);
		}
	}
}
