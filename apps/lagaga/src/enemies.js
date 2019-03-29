"use strict";

lgg.Enemies = function()
{
	// always copy the stuff below to reset(), too
	this.e = [];
	this._eligible_follow_targets = [];
	// *TODO* keep track of last spawns per enemy type
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		this.e.push(new lgg.Enemy(i));
	}
	this.reset();
};

lgg.Enemies.prototype.reset = function()
{
	this.enemies_alive = 0;
	this.last_spawn = -50000;
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		this.e[i].active = false;
	}
	this.enemies_alive = 0;
	this.enemies_alive_of_type = [];
	this.enemies_alive_of_type_other_than = [];
	for (var i = 0, len = lgg.etypes.length; i < len; i++)
	{
		this.enemies_alive_of_type[i] = 0;
		this.enemies_alive_of_type_other_than[i] = 0;
	}
	
	this.angle_and_eta = [];

}

lgg.Enemies.prototype.think = function(time_delta)
{
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (this.e[i].active)
		{
			this.e[i].think(time_delta);
		}
	}
}

lgg.Enemies.prototype.find_follow_target = function(asker_id, etype)
{
	this._eligible_follow_targets.length = 0;
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (i != asker_id)
		{
			var e = this.e[i];
			if (	e.active
				&&	e.time_to_linger
				&&	!e.departing
				&&	!e.byebye
				//&&	e.etype == etype
				&&	e.follower == -1
				&&	e.following != asker_id
				&&	e.follow_group != asker_id
				&&	etype.follow_targets.indexOf(e.etype.id) != -1
				)
			{
				this._eligible_follow_targets.push(i);
			}
		}
	}
	var elect = -1;
	if (this._eligible_follow_targets.length > 1)
	{
		elect = this._eligible_follow_targets[µ.rand_int(this._eligible_follow_targets.length - 1)];
	}
	else if (this._eligible_follow_targets.length > 0)
	{
		elect = this._eligible_follow_targets[0];
	}
	return elect;
}

lgg.Enemies.prototype.spawn_enemy = function(etype, pos_x, pos_y, follow_target)
{
	if (etype === undefined)
	{
		console.log('could not spawn', etype, follow_target);
		return;
	}
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (!this.e[i].active)
		{
			var enemy = this.e[i];
			enemy.reset();
			enemy.etype = etype;
			var to_follow = -1;
			// decides whether enemy will look for a follow target whenever there isn't one
			this.will_join_up = etype.joinup_chance > 0 && µ.rand(1) <= etype.joinup_chance;
			// follow
			if (etype.follow_chance && µ.rand(1) <= etype.follow_chance)
			{
				// only the previously spawned one is eligible as follow target
				// FIXME: all enemies in the "batch" should be eligible...!
				// to_follow = this.find_follow_target(i, type);
				to_follow = follow_target;
			}
			if (to_follow == -1 && this.will_join_up)
			{
				to_follow = this.find_follow_target(i, enemy.etype);
			}
			if (to_follow > -1)
			{
				this.e[to_follow].follower = i;
				enemy.following = to_follow;
			}
			enemy.active = true;
			enemy.armour = etype.armour;
			
			if (lgg.options_debug_values[lgg.DEBUG_OPTION__DETERMINISTIC_MODE])
			{
				enemy.time_to_linger = (etype.linger_max + etype.linger_min) / 2;
				enemy.radius = etype.radius + (etype.radius_max - etype.radius) / 2;
			}
			else
			{
				enemy.time_to_linger = etype.linger_min + µ.rand_int(etype.linger_max - etype.linger_min);
				enemy.radius = etype.radius + µ.rand(etype.radius_max - etype.radius);
			}
			if (pos_x == -1 && pos_y == -1)
			{
				enemy.pos_x = lgg.level.size_x * µ.rand(1);
				enemy.pos_y = lgg.level.size_y + enemy.radius;
			}
			else
			{
				enemy.pos_x = pos_x;
				enemy.pos_y = pos_y;
			}
			
			enemy.last_recharge = lgg.now + µ.rand(etype.recharge_freq);

			enemy.last_shots			= new Float32Array(etype.attacks.length);
			enemy.last_shot_attempts	= new Float32Array(etype.attacks.length);
			enemy.barrage_shots_to_fire	= new Float32Array(etype.attacks.length);
			enemy.barrage_next_shot		= new Float32Array(etype.attacks.length);
			enemy.barrage_angle			= new Float32Array(etype.attacks.length);
			enemy.barrage_eta			= new Float32Array(etype.attacks.length);

			enemy.speed = etype.speed;
			enemy.shield = etype.shield || 0;
			enemy.shield_shown = enemy.shield;
			enemy.shield_max = enemy.shield;
			
			this.enemies_alive++;
			this.enemies_alive_of_type[etype.id]++;
			for (var j = 0, len = lgg.etypes.length; j < len; j++)
			{
				if (j != etype.id)
				{
					this.enemies_alive_of_type_other_than[j]++;
				}
			}
			lgg.level.danger_in_play += etype.danger;
			if (etype.spawn)
			{
				etype.spawn(enemy);
			}
			return i;
		}
	}
}

lgg.Enemies.prototype.spawn_weight_func = function(etype, etype_id, danger)
{
	if (lgg.DEBUG__ETYPES)
	{
		return (lgg.debugged_etypes[etype_id] ? etype.weight : 0);
	}
	return (	etype.danger == 0
			||	lgg.level.stage < etype.stage_min
			||	(etype.stage_max > -1 && lgg.level.stage > etype.stage_max)
			||	lgg.now < lgg.level.etypes[etype_id].next_spawn
			||	etype.danger * etype.batch_min > danger
			||	(etype.probability < 1 && etype.probability < µ.rand(1))
			) ? 0 : etype.weight * etype.danger;

}

// consider if and what to spawn, and spawn it
lgg.Enemies.prototype.spawn = function(danger)
{
	var etype_id = µ.pick_randomly_from_weighted_list(lgg.etypes, this.spawn_weight_func, danger);
	if (etype_id === null)
	{
		// console.log('nothing to spawn');
		return 0;
	}
	
	var etype = lgg.etypes[etype_id];
	var batch_size = Math.min(etype.batch_max, Math.floor(danger / etype.danger));
	batch_size = etype.batch_min + Math.round((batch_size - etype.batch_min) * µ.rand(1));
	var danger_spawned = 0;
	var last_spawned_id = -1;
	// when a too big batch size is chosen, the remaining simply don't get spawned
	for (var i = 0; i < batch_size && danger >= etype.danger; i++)
	{
		last_spawned_id = this.spawn_enemy(etype, -1, -1, last_spawned_id);
		if (last_spawned_id > -1)
		{
			lgg.level.etypes[etype_id].number_spawned++;
			danger_spawned += etype.danger;
			danger -= etype.danger;
		}
	}
	if (last_spawned_id > -1)
	{
		this.last_spawn = lgg.now;
		lgg.level.etypes[etype_id].next_spawn = lgg.now + etype.spawn_min + µ.rand(etype.spawn_max - etype.spawn_min);
	}
	return danger_spawned;
}

lgg.Enemies.prototype.draw_shields = function()
{
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (this.e[i].active)
		{
			var e = this.e[i];
			var shield_hit = lgg.now - e.last_shield_hit < 250 ? (1 - (lgg.now - e.last_shield_hit) / 250) : 0;
			if (e.shield_shown > 0 || shield_hit > 0)
			{
				var shield_frac = e.shield_shown / e.shield_max;

				lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
					lgg.tex_circle_softer_inverse,
					e.pos_x,
					e.pos_y,
					e.radius * lgg.SHIELD_RADIUS * 2,
					e.radius * lgg.SHIELD_RADIUS * 2,
					90,
					150 + 210 * (1 - shield_frac), 1, 1, 0.1 * shield_frac + 0.05 * shield_frac * Math.sin(lgg.now / 400) + 0.2 * shield_hit,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			}

			if (e.damage_bost_duration)
			{
				var radius = e.radius * (2.25 + 0.25 * Math.sin(lgg.now / 83));
				lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
					lgg.tex_circle_soft_inverse,
					//lgg.tex_circle_outline,
					e.pos_x,
					e.pos_y,
					radius,
					radius,
					90,
					52, 1, 1, 0.3 - 0.2 * Math.sin(lgg.now / 83),
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			}

		}
	}
}


lgg.Enemies.prototype.draw_shields2 = function()
{
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (this.e[i].active)
		{
			var e = this.e[i];
			var shield_hit = lgg.now - e.last_shield_hit < 250 ? (1 - (lgg.now - e.last_shield_hit) / 250) : 0;
			if (e.shield_shown > 0 || shield_hit > 0)
			{
				var shield_frac = e.shield_shown / e.shield_max;
				lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
					lgg.tex_circle_soft,
					e.pos_x,
					e.pos_y,
					e.radius * lgg.SHIELD_RADIUS * 2,
					e.radius * lgg.SHIELD_RADIUS * 2,
					90,
					150 + 210 * (1 - shield_frac), 1, 1, 0.3 * shield_frac + 0.1 * Math.sin(lgg.now / 200) + 0.4 * shield_hit,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			}

			if (e.damage_bost_duration)
			{
				var radius = e.radius * (2.25 + 0.25 * Math.sin(lgg.now / 83));
				lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
					lgg.tex_circle_soft,
					e.pos_x,
					e.pos_y,
					radius,
					radius,
					90,
					52, 1, 1, 0.3 - 0.2 * Math.sin(lgg.now / 83),
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			}
		}
	}
}

lgg.Enemies.prototype.draw = function()
{
	for (var i = 0; i < lgg.MAX_ENEMIES; i++)
	{
		if (this.e[i].active)
		{
			var e = this.e[i];
			if (e.etype.draw)
			{
				e.etype.draw(e);
			}

			if (lgg.input.KEY_L.pressed)
			{
				if (e.target_pos_x != -1 && e.target_pos_y != -1)
				{
					lgg.c.rectangle.draw_line(lgg.CAM_PLAYER, e.pos_x, e.pos_y, e.target_pos_x, e.target_pos_y, 0.008,
							0, 1, 0.5, 0.25,
							-1, -1, -1, -1,
							-1, -1, -1, -1,
							-1, -1, -1, -1);
					lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
						lgg.tex_circle_soft_inverse,
						e.target_pos_x,
						e.target_pos_y,
						e.etype.desired_t_dist,
						e.etype.desired_t_dist,
						90,
						120, 1, 0.5, 0.25,
						-1, -1, -1, -1,
						-1, -1, -1, -1,
						-1, -1, -1, -1);
				}
				if (e.following > -1)
				{
					var e2 = this.e[e.following];
					lgg.c.rectangle.draw_line(lgg.CAM_PLAYER, e.pos_x, e.pos_y, e2.pos_x, e2.pos_y, 0.003,
						60, 1, 0.5, 0.75,
						-1, -1, -1, -1,
						-1, -1, -1, -1,
						-1, -1, -1, -1);
				}
				var pos_x = e.pos_x;
				var pos_y_plus_radius = e.pos_y + e.radius;
				var radius2 = e.radius * 2;
				var radius_2 = e.radius / 2;
				var radius_4 = e.radius / 4;
				var health = e.health;
				var energy = e.energy;
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_2, e.radius/4,	radius2,			0, health * 90, 1, 0.05, .25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_2, e.radius/4,	radius2 * health,	0, health * 90, 1, 0.5, .75, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_4, e.radius/4,	radius2,			0, 220, energy*0.6, 0.5, .25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_4, e.radius/4,	radius2 * energy,	0, 220,  energy,     0.5, .75, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
				if (e.shield_max)
				{
					var shield = e.shield / e.shield_max;
					var shield_s = e.shield_shown / e.shield_max;
					lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_4 + radius_2,	radius_4,	radius2,			0, 60,		1, 	0,	.1,		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
					lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_4 + radius_2,	radius_4,	radius2 * shield,	0, 60,		1, 	1,	.25,	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
					lgg.c.rectangle.draw(lgg.CAM_PLAYER, pos_x, pos_y_plus_radius + radius_4 + radius_2,	radius_4,	radius2 * shield_s,	0, 60,		1, 	1,	.125,	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
				}
			}

		}
	}
}
