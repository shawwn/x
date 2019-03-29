lgg.Enemy.prototype.think = function(time_delta)
{
	var etype = this.etype;
	this.age += time_delta;
	if (etype.think_pre)
	{
		etype.think_pre(this, time_delta);
	}

	if (!this.shields_are_gone)
	{
		this.shield += etype.shield_recharge * time_delta * etype.shield / 1000; // e.g. a recharge rate of 0.5 means recharge half of the full shield per second
		if (this.shield > this.shield_max)
		{
			this.shield = this.shield_max;
		}
	}

	//console.log(this.damage_bost_duration);

	this.damage_bost_duration = Math.max(0, this.damage_bost_duration - time_delta);

	// testing
	if (this.damage_bost_duration == 0 && µ.rand(1) < 0.0001)
	{
		this.damage_bost_duration = 3000;
	}


	this.shield_shown = (this.shield + (this.shield_shown * 29)) / 30;
	if (this.shield == 0 && this.shield_shown > 0)
	{
		this.shield_shown -= 0.001 * time_delta;
		if (this.shield_shown < 0)
			this.shield_shown = 0;
	}

	this.time_to_linger -= time_delta;
	if (lgg.now - this.last_recharge > etype.recharge_freq)
	{
		this.energy += etype.recharge_amount;
		if (this.energy > 1.0)
		{
			this.energy = 1.0;
		}
		this.last_recharge = lgg.now;
	}

	if (this.time_to_linger <= 0)
	{
		this.time_to_linger = 0;
		this.departing = true;
	}

	if (this.will_join_up && this.time_to_linger && (this.following == -1 || lgg.enemies.e[this.following].health <= 0))
	{

		this.following = lgg.enemies.find_follow_target(this.id, this.etype)
		if (this.following > -1)
		{
			//console.log('join up', this.id, this.following);
			lgg.enemies.e[this.following].follower = this.id;
		}
	}
/*
	else
	{
		if (this.following > -1 && etype.unfollow_chance > 0 && µ.rand(1) <= etype.unfollow_chance)
		{
			this.unfollow();
		}
	}
*/

	if (this.following > -1)
	{
		if (	lgg.enemies.e[this.following].health <= 0
			||	lgg.enemies.e[this.following].byebye
			||	lgg.enemies.e[this.following].departing
			)
		{
			lgg.enemies.e[this.following].follower = -1;
			this.following == -1;
			this.target_pos_x = -1;
			this.target_pos_y = -1;
		}
	}
	if (this.follower > -1)
	{
		if (	this.health <= 0
			||	this.byebye
			||	this.departing
			)
		{
			lgg.enemies.e[this.follower].following = -1;
			lgg.enemies.e[this.follower].target_pos_x = -1;
			lgg.enemies.e[this.follower].target_pos_y = -1;
			this.follower = -1;
		}
	}
	if (this.following == -1)
	{
		this.follow_group = this.id;
	}

	// player collision
	
	// take radii into account by default
	this.dist_from_player = µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, this.pos_x, this.pos_y) - this.radius - lgg.player.radius;
	if (etype.collision_flags & lgg.COLLISION_FLAG__PLAYER)
	{
		var combined_radius = this.radius + lgg.player.radius;
		var overlap = - this.dist_from_player;
		if (overlap > 0)
		{
			lgg.player.take_damage(0.001, lgg.DAMAGE_TYPE__COLLISION, this.pos_x + (lgg.player.pos_x - this.pos_x) / 2, this.pos_y + (lgg.player.pos_y - this.pos_y) / 2);

			var angle = µ.vector2D_to_angle(lgg.player.pos_x - this.pos_x, lgg.player.pos_y - this.pos_y);

			overlap = Math.min(overlap, combined_radius / 4);
			var move_x = µ.angle_to_x(angle) * overlap * time_delta;
			var move_y = µ.angle_to_y(angle) * overlap * time_delta;
			lgg.player.speed_x += move_x / 500;
			lgg.player.speed_y += move_y / 500;
			this.speed_x -= move_x / 1000;
			this.speed_y -= move_y / 1000;
		}
	}

	// enemy/enemy collision
	if (etype.collision_flags & lgg.COLLISION_FLAG__ENEMIES)
	{
		for (var i = 0; i < lgg.MAX_ENEMIES; i++)
		{
			var other_e = lgg.enemies.e[i];
			if (!other_e.active || !(other_e.etype.collision_flags & lgg.COLLISION_FLAG__ENEMIES) || i == this.id)
			{
				continue;
			}
			var combined_radius = this.radius + other_e.radius;
			if (Math.abs(other_e.pos_x - this.pos_x) > combined_radius || Math.abs(other_e.pos_y - this.pos_y) > combined_radius)
			{
				continue;
			}

			var dist = µ.distance2D(other_e.pos_x, other_e.pos_y, this.pos_x, this.pos_y);
			var overlap = (this.radius + other_e.radius) - dist;

			if (overlap > 0)
			{
				var angle = µ.vector2D_to_angle(other_e.pos_x - this.pos_x, other_e.pos_y - this.pos_y);

				overlap = Math.min(overlap, combined_radius / 8);
				var move_x = µ.angle_to_x(angle) * overlap / 16000 * time_delta;
				var move_y = µ.angle_to_y(angle) * overlap / 16000 * time_delta;
				other_e.speed_x += move_x;
				other_e.speed_y += move_y;
				this.speed_x -= move_x;
				this.speed_y -= move_y;
			}
		}
	}

	// movement
	if (this.departing && this.pos_y < etype.byebybe_height)
	{
		this.byebye = true;
	}
	if ((this.dist_from_player) <= etype.avoid_player_dist_min)
	{
		this.avoiding_player = true;
		this.target_pos_y = -1;
		this.target_pos_x = -1;
	}
	else if (
				(this.dist_from_player) >= etype.avoid_player_dist_max
			||	this.pos_y < this.radius + 0.05
			||	this.pos_y > (lgg.level.size_y - this.radius)
			||	this.pos_x < this.radius
			||	this.pos_x > (lgg.level.size_x - this.radius)
				)
	{
		this.avoiding_player = false;
	}

	// shove them into the level because them lingering out of sight is awkward
	if (this.pos_y > (lgg.level.size_y - this.radius))
	{
		this.pos_y -= 0.0002 * time_delta;
	}

	if (etype.speed > 0)
	{
		if (this.next_target_update <= lgg.now && !this.byebye && !this.avoiding_player)
		{
			target_desired_dist = 0;
			if (this.following > -1)
			{
				target_desired_dist = etype.desired_f_dist;
				this.target_pos_x = lgg.enemies.e[this.following].pos_x;
				this.target_pos_y = lgg.enemies.e[this.following].pos_y;

				if (this.target_pos_y < this.radius)
					this.target_pos_y = this.radius;
				if (this.target_pos_y > (lgg.level.size_y - this.radius))
					this.target_pos_y = lgg.level.size_y - this.radius;
				if (this.target_pos_x < this.radius)
					this.target_pos_x = this.radius;
				if (this.target_pos_x > (lgg.level.size_x - this.radius))
					this.target_pos_x = lgg.level.size_x - this.radius;

				var dist = µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y) - this.radius - lgg.enemies.e[this.following].radius;

				if (dist > target_desired_dist * 8)
				{
					this.effective_speed = this.speed * 1.075;
				}
				else if (dist > target_desired_dist * 4)
				{
					this.effective_speed = this.speed * 1.05;
				}
				else if (dist > target_desired_dist * 2)
				{
					this.effective_speed = this.speed * 1.030;
				}
				else if (dist > target_desired_dist)
				{
					this.effective_speed = this.speed * 1.015;
				}
				else if (dist < target_desired_dist * 0.25)
				{
					this.effective_speed = this.speed * 0.125;
				}
				else if (dist < target_desired_dist * 0.5)
				{
					this.effective_speed = this.speed * 0.25;
				}
				else if (dist < target_desired_dist * 0.75)
				{
					this.effective_speed = this.speed * 0.5;
				}
				else
				{
					this.effective_speed = this.speed * 0.95;
				}

				// behaviour of the chain leader filters down
				this.attacking = lgg.enemies.e[this.following].attacking;
				this.follow_group = lgg.enemies.e[this.following].follow_group;
			}
			else
			{
				if (this.attacking && this.dist_from_player > etype.engage_range)
				{
					this.attacking = false;
					// target gets picked below
					this.target_pos_x = -1;
					this.target_pos_y = -1;
				}
				else if (this.time_to_linger && this.dist_from_player < etype.engage_range)
				{
					if (!this.attacking)
					{
						// target gets picked below
						this.target_pos_x = -1;
						this.target_pos_y = -1;
					}
					this.attacking = true;
				}

				if (this.target_pos_y > (lgg.level.size_y - this.radius))
					this.target_pos_y = lgg.level.size_y - this.radius;


			}
			// don't have a target yet, so lets just pretend we reached it
			if (this.target_pos_x == -1)
			{
				var dist = 0;
			}
			else
			{
				var dist = µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y);
			}

			if (this.attacking && this.following == -1)
			{
				target_desired_dist = etype.desired_t_dist;
				if (dist <= target_desired_dist)
				{
					var engage_distance = etype.engage_distance + µ.rand(etype.engage_distance_max - etype.engage_distance);
					var attempts = 0;
					this.target_pos_x = -1;
					// what could go wrong, right?
					while (		attempts < 5
							&&
							(
								this.target_pos_y < this.radius + 0.05
							||	this.target_pos_y > (lgg.level.size_y - this.radius)
							||	this.target_pos_x < this.radius
							||	this.target_pos_x > (lgg.level.size_x - this.radius))
							)
					{
						attempts++;
						var random_angle = µ.rand(360);
						this.target_pos_x = lgg.player.pos_x + µ.angle_to_x(random_angle) * engage_distance;
						this.target_pos_y = lgg.player.pos_y + µ.angle_to_y(random_angle) * engage_distance;
					}
					this.target_pos_y = µ.between(etype.engage_height_min * lgg.level.size_y, this.target_pos_y, etype.engage_height_max * lgg.level.size_y);
					var dist = µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y);
				}
				//this.effective_speed = this.speed * 1.0;
			}
			else if (this.following == -1)
			{
				target_desired_dist = etype.desired_t_dist;
				this.effective_speed = this.speed;
				if (dist <= target_desired_dist)
				{
					if (!this.attacking || !this.time_to_linger)
					{
						this.target_pos_x = this.pos_x;
						this.target_pos_y = this.pos_y;
/*
						while ((this.target_pos_x == this.pos_x && this.target_pos_y == this.pos_y)
							|| (0.1 > µ.distance2D(this.target_pos_x, this.target_pos_y, this.pos_x, this.pos_y)))
						{
*/
							if (!this.departing)
							{
								this.target_pos_x = lgg.level.size_x * 0.025 + µ.rand(lgg.level.size_x * 0.95);
								this.target_pos_y = lgg.level.size_y * (etype.height - etype.height_tol / 2 + µ.rand(etype.height_tol));
							}
							else
							{
								var depart_speed_x = etype.depart_speed_x_min + µ.rand(etype.depart_speed_x_max - etype.depart_speed_x_min);
								var depart_speed_y = etype.depart_speed_y_min + µ.rand(etype.depart_speed_y_max - etype.depart_speed_y_min);
								this.target_pos_x = this.pos_x - lgg.level.size_x * depart_speed_x / 2 + µ.rand(lgg.level.size_x * depart_speed_x);
								this.target_pos_x = µ.between(0, this.target_pos_x, lgg.level.size_x);
								this.target_pos_y = this.pos_y - µ.rand(lgg.level.size_y * depart_speed_y);
							}
//						}
					}
				}
			}
			if (dist > target_desired_dist * 8)
			{
				this.next_target_update = lgg.now + 50;
			}
			else if (dist > target_desired_dist * 4)
			{
				this.next_target_update = lgg.now + 30;
			}
			else if (dist > target_desired_dist * 2)
			{
				this.next_target_update = lgg.now + 20;
			}
			else
			{
				this.next_target_update = lgg.now + 10;
			}
		}
		if (this.byebye)
		{
			this.avoiding_player = false;
			this.speed_y += etype.byebybe_speed_y * time_delta;
		}
		else
		{
			if (this.avoiding_player)
			{
				var dest_angle = µ.vector2D_to_angle(this.pos_x - lgg.player.pos_x, this.pos_y - lgg.player.pos_y);
			}
			else
			{
				var dest_angle = µ.vector2D_to_angle(this.target_pos_x - this.pos_x, this.target_pos_y - this.pos_y);
			}

			var move_angle = dest_angle;

			if (etype.turn_speed > 0)
			{
				this.heading += µ.turn(this.heading, dest_angle) * etype.turn_speed * time_delta;
				move_angle = this.heading;
			}
			else
			{
				// maybe there could be an extra flag for never changing heading?
				//this.heading = dest_angle;
			}

			var desired_acceleration_x = µ.angle_to_x(move_angle) * this.effective_speed + µ.angle_to_x(dest_angle) * etype.speed_nimble_x;
			var desired_acceleration_y = µ.angle_to_y(move_angle) * this.effective_speed + µ.angle_to_y(dest_angle) * etype.speed_nimble_y;

			if (	(this.speed_x <= 0 && desired_acceleration_x > 0)
				||	(this.speed_x >= 0 && desired_acceleration_x < 0))
			{
				if (etype.brake_friction != 1)
				{
					this.speed_x *= Math.pow(etype.brake_friction, time_delta);
				}
				if (desired_acceleration_x > 0)
				{
					this.speed_x += etype.brake_deceleration * time_delta;
				}
				else
				{
					this.speed_x -= etype.brake_deceleration * time_delta;
				}
			}

			if (	(this.speed_y <= 0 && desired_acceleration_y > 0)
				||	(this.speed_y >= 0 && desired_acceleration_y < 0))
			{
				if (etype.brake_friction != 1)
				{
					this.speed_y *= Math.pow(etype.brake_friction, time_delta);
				}
				if (desired_acceleration_y > 0)
				{
					this.speed_y += etype.brake_deceleration * time_delta;
				}
				else
				{
					this.speed_y -= etype.brake_deceleration * time_delta;
				}
			}
			this.speed_x += desired_acceleration_x * time_delta;
			this.speed_y += desired_acceleration_y * time_delta;
			



		}

		if (	this.speed_x > etype.speed_max
			||	this.speed_x < -etype.speed_max)
		{
			this.speed_x *= Math.pow(etype.speed_max_friction, time_delta);
		}
		if (	this.speed_y > etype.speed_max
			||	this.speed_y < -etype.speed_max)
		{
			this.speed_y *= Math.pow(etype.speed_max_friction, time_delta);
		}
	}

	this.old_pos_x = this.pos_x;
	this.old_pos_y = this.pos_y;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	if (this.pos_y < - this.radius * 3 - 0.03 && this.following == -1)
	{
		this.disappears();
		return;
	}
	if (this.pos_x < - lgg.level.size_x + 0.5 && this.pos_x > lgg.level.size_x * 1.5)
	{
		this.disappears();
		return;
	}

	var friction = Math.pow(etype.friction, time_delta);
	this.speed_x *= friction;
	this.speed_y *= friction;

	// are any attacks currently firing a barrage?

	for (var attack_id = 0; attack_id < this.etype.attacks.length; attack_id++)
	{
		if (this.barrage_shots_to_fire[attack_id] > 0)
		{
			// abort barrage when off screen
			if (	this.pos_y > (lgg.level.size_y + this.radius)
				||	this.pos_y < - this.radius)
			{
				this.barrage_shots_to_fire[attack_id] = 0;
				continue;
			}
			// make sure this attack can't get picked further below while the barrage is still in progress
			this.last_shot_attempts[attack_id] = lgg.now;
			if (lgg.now >= this.barrage_next_shot[attack_id])
			{
				//console.log(attack_id, this.barrage_shots_to_fire[attack_id]);

				var attack = etype.attacks[attack_id];

				// doesn't really work well
				//*
				if (attack.barrage_individual_aim)
				{
					if (attack.dumb_aim == 1 || (attack.dumb_aim > 0 && µ.rand(1) <= attack.dumb_aim))
					{
						var angle = µ.vector2D_to_angle(lgg.player.pos_x - this.pos_x, lgg.player.pos_y - this.pos_y);
						var eta = attack.lifespan;
					}
					else
					{
						//console.log('leading');
						µ.lead_target(	lgg.enemies.angle_and_eta,
										this.pos_x, this.pos_y,
										lgg.player.pos_x, lgg.player.pos_y,
										lgg.player.speed_x, lgg.player.speed_y,
										attack.speed,
										30,
										0.1,
										attack.lifespan,
										0, lgg.level.size_x,
										0, lgg.level.size_y);
						var angle = lgg.enemies.angle_and_eta[0];
						var eta = lgg.enemies.angle_and_eta[1];

						if (angle >= 0)
						{
							// save it for the next shot
							this.barrage_angle[attack_id] = angle;
							this.barrage_eta[attack_id] = eta;
						}
					}
				}
				else
				//*/
				{
					var angle = this.barrage_angle[attack_id];
					var eta = this.barrage_eta[attack_id];
				}

				// couldn't find valid aim, so just use the last one
				if (angle == -1)
				{
					var angle = this.barrage_angle[attack_id];
					var eta = this.barrage_eta[attack_id];
				}

				if (		(		attack.angle == 360
								||	Math.abs(µ.turn(angle, attack.angle_offset == -1 ? this.heading : this.heading + attack.angle_offset )) <= attack.angle
							)
					)
				{
					for (var j = attack.shot_count; j--;)
					{
						var angle2 = angle - attack.shot_spread/2 + j/(attack.shot_count > 1 ? attack.shot_count - 1 : 1) * attack.shot_spread;
						lgg.projectiles.spawn(
							this.pos_x + µ.angle_to_x(angle2) * this.radius,
							this.pos_y + µ.angle_to_y(angle2) * this.radius,
							angle2 - attack.spread/2 + µ.rand(attack.spread),
							true,
							attack.projectile_type,
							attack.damage_type,
							this.damage_bost_duration > 0 ? attack.damage * 1.5 : attack.damage,
							Math.min(attack.lifespan, Math.max(attack.lifespan * 0.5, eta * 1.5)),
							attack.speed,
							attack.friction,
							attack.homing_turn,
							attack.homing_speed,
							attack.homing_time,
							attack.homing_delay,
							attack.wobble_freq,
							attack.wobble_speed,
							attack.angle_vel,
							attack.angle_accel);
					}
					// energy cost was paid up front when barrage started

					this.barrage_shots_to_fire[attack_id]--;
					if (this.barrage_shots_to_fire[attack_id] > 0)
					{
						this.barrage_next_shot[attack_id] = lgg.now + attack.barrage_shot_delay_min + µ.rand(attack.barrage_shot_delay_max - attack.barrage_shot_delay_min);
					}
					//console.log('fired', this.barrage_shots_to_fire[attack_id]);
				}
				else
				{
					// cannot fire, but get the barrage over with anyway
					this.barrage_shots_to_fire[attack_id]--;
					if (this.barrage_shots_to_fire[attack_id] > 0)
					{
						this.barrage_next_shot[attack_id] = lgg.now + attack.barrage_shot_delay_min + µ.rand(attack.barrage_shot_delay_max - attack.barrage_shot_delay_min);
					}
				}
			}
		}
	}

	// maybe fire at player (not from outside the level though)
	if (this.pos_y < (lgg.level.size_y + this.radius))
	{
		var attack_id = µ.pick_randomly_from_weighted_list(etype.attacks, this.attack_weight_func, this);
		// keep trying all attacks until none apply
		while (attack_id !== null)
		{
			var attack = etype.attacks[attack_id];

			// make sure this attack doesn't get picked again in the same frame
			this.last_shot_attempts[attack_id] = lgg.now;

			var angle = -1;
			var dumb_aim = false;
			if (attack.dumb_aim == 1 || (attack.dumb_aim > 0 && µ.rand(1) <= attack.dumb_aim))
			{
				angle = µ.vector2D_to_angle(lgg.player.pos_x - this.pos_x, lgg.player.pos_y - this.pos_y);
				if (attack.angle < 360)
				{
					var weapon_angle = attack.angle_offset == -1 ? this.heading : this.heading + attack.angle_offset;
					var to_turn = µ.turn(angle, weapon_angle);
					angle = weapon_angle + µ.between(- attack.angle, to_turn, attack.angle);
				}
				var eta = attack.lifespan;
			}
			//don't shoot while playerchanges directions
			else if (
					Math.abs(lgg.player.last_speed_x - lgg.player.speed_x) < 0.000150
				&&
					Math.abs(lgg.player.last_speed_y - lgg.player.speed_y) < 0.000150
			)
			{
				µ.lead_target(	lgg.enemies.angle_and_eta,
								this.pos_x, this.pos_y,
								lgg.player.pos_x, lgg.player.pos_y,
								lgg.player.speed_x, lgg.player.speed_y,
								attack.speed,
								30,
								0.1,
								attack.lifespan,
								0, lgg.level.size_x,
								0, lgg.level.size_y);

				angle = lgg.enemies.angle_and_eta[0];
				var eta = lgg.enemies.angle_and_eta[1];
			}

			if (		angle >= 0
					&&	(		attack.angle == 360
							||	Math.abs(µ.turn(angle, attack.angle_offset == -1 ? this.heading : this.heading + attack.angle_offset )) <= attack.angle
						)
				)
			{

				var barrage_shot_count = attack.barrage_shot_count_min + µ.rand_int(attack.barrage_shot_count_max - attack.barrage_shot_count_min);

				if (barrage_shot_count > 1)
				{
					this.barrage_angle[attack_id] = angle;
					this.barrage_eta[attack_id] = angle;
					this.barrage_next_shot[attack_id] = lgg.now + attack.barrage_shot_delay_min + µ.rand(attack.barrage_shot_delay_max - attack.barrage_shot_delay_min);
					this.barrage_shots_to_fire[attack_id] = barrage_shot_count - 1;
				}
				//console.log(this.barrage_shots_to_fire);



//			barrage_individual_aim:	0,			// whether to aim each shot, or aim the first shot and fire subsequent shots in the same direction


				for (var j = attack.shot_count; j--;)
				{
					var angle2 = angle - attack.shot_spread/2 + j/(attack.shot_count > 1 ? attack.shot_count - 1 : 1)*attack.shot_spread;
					lgg.projectiles.spawn(
						this.pos_x + µ.angle_to_x(angle2) * this.radius,
						this.pos_y + µ.angle_to_y(angle2) * this.radius,
						angle2 - attack.spread/2 + µ.rand(attack.spread),
						true,
						attack.projectile_type,
						attack.damage_type,
						this.damage_bost_duration > 0 ? attack.damage * 3 : attack.damage,
						Math.min(attack.lifespan, Math.max(attack.lifespan * 0.5, eta * 1.5)),
						attack.speed,
						attack.friction,
						attack.homing_turn,
						attack.homing_speed,
						attack.homing_time,
						attack.homing_delay,
						attack.wobble_freq,
						attack.wobble_speed,
						attack.angle_vel,
						attack.angle_accel);
				}
				this.last_shots[attack_id] = lgg.now - µ.rand_int(attack.freq_var);
				this.energy -= attack.energy_cost;
			}
			var attack_id = µ.pick_randomly_from_weighted_list(etype.attacks, this.attack_weight_func, this);
		}
	}

	if (etype.think_post)
	{
		etype.think_post(this, time_delta);
	}
}