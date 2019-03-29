plt.think_mines = function(time_delta)
{
	if (plt.mines_count > 0)
	for (var i = 0; i < plt.mines_count; i++)
	{
		if (plt.mines_age[i] > plt.mines_duration[i])
		{
			continue;
		}
		plt.mines_age[i] += time_delta;
		if (plt.mines_age[i] > plt.mines_duration[i])
		{
			if (plt.config__draw_particles)
			{
				plt.particlesGPU_top.spawn(
					plt.now,
					10,
					plt.mines_x[i],
					plt.mines_y[i],
					plt.mines_x[i],
					plt.mines_y[i],
					0.18,
					0,
					0,
					90, 0.0,
					plt.particles__fog2,
					460,		//	lifespan
					20, 0.9, 0.6, 1.0,
					700,		//	vary_angle
					0.075,	//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.03,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					100,			//	vary_lifespan
					5,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
			}
			continue;
		}
		var age_frac = plt.mines_age[i] / plt.mines_duration[i];
		var old_x = plt.mines_x[i];
		var old_y = plt.mines_y[i];
		plt.mines_x[i] += plt.mines_speed_x[i] * time_delta;
		plt.mines_y[i] += plt.mines_speed_y[i] * time_delta;
		if (plt.config__draw_particles)
		{
			plt.particlesGPU_top.spawn(
				plt.now,
				5,
				plt.mines_x[i],
				plt.mines_y[i],
				old_x,
				old_y,
				0.03,
				0,
				0,
				90, 0.0,
				plt.particles__fog2,
				500 - 400 * age_frac,		//	lifespan
				20, 0.9, 0.4, 1.0,
				700,		//	vary_angle
				0.025,	//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.01,		//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				00,			//	vary_lifespan
				5,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			plt.particlesGPU_top.spawn(
				plt.now,
				3,
				plt.mines_x[i],
				plt.mines_y[i],
				old_x,
				old_y,
				0.08 + 0.04 * age_frac,
				0,
				0,
				90, 0.0,
				plt.particles__fog2,
				460 - 200 * age_frac,		//	lifespan
				20, 0.9, 0.6, 0.15 * age_frac,
				700,		//	vary_angle
				0.075,	//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.03 * age_frac,		//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				300 - 200 * age_frac,			//	vary_lifespan
				5,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
		}
		if (plt.mines_x[i] > (1 - plt.mines_radius[i]))
		{
			plt.mines_x[i] = (1 - plt.mines_radius[i]);
			plt.mines_speed_x[i] *= -1;
		}
		if (plt.mines_y[i] > (1 - plt.mines_radius[i]))
		{
			plt.mines_y[i] = (1 - plt.mines_radius[i]);
			plt.mines_speed_y[i] *= -1;
		}
		if (plt.mines_x[i] < plt.mines_radius[i])
		{
			plt.mines_x[i] = plt.mines_radius[i];
			plt.mines_speed_x[i] *= -1;
		}
		if (plt.mines_y[i] < plt.mines_radius[i])
		{
			plt.mines_y[i] = plt.mines_radius[i];
			plt.mines_speed_y[i] *= -1;
		}
		var dist = µ.distance2D(
			plt.player_x,
			plt.player_y,
			plt.mines_x[i],
			plt.mines_y[i]
			);
		if (dist < (plt.mines_radius[i] + plt.cursor_radius))
		{
			if (plt.config__draw_particles)
			{
				var overlap = plt.mines_radius[i] + plt.cursor_radius - dist;
				var angle = µ.vector2D_to_angle(plt.mines_x[i] - plt.player_x, plt.mines_y[i] - plt.player_y)
				var angle_x = µ.angle_to_x(angle);
				var angle_y = µ.angle_to_y(angle);
	/*
				plt.mines_angle[i] = angle;
				plt.speed_x[i] = angle_x * plt.speed[i];
				plt.speed_y[i] = angle_y * plt.speed[i];
				plt.mines_x[i] += overlap * angle_x * 3;
				plt.mines_y[i] += overlap * angle_y * 3;
	*/
				plt.particlesGPU_top.spawn(
					plt.now,
					2,
					plt.mines_x[i],
					plt.mines_y[i],
					plt.mines_x[i],
					plt.mines_y[i],
					0.1,
					plt.mines_speed_x[i] * 1000,
					plt.mines_speed_y[i] * 1000,
					90, 0.0,
					plt.particles__fog2,
					1000,		//	lifespan
					20, 1, 0.4, 1.0,
					360,		//	vary_angle
					5.5 * plt.mines_radius[i],	//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.05,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					0,			//	vary_lifespan
					5,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
				plt.particlesGPU_top.spawn(
					plt.now,
					10,
					plt.mines_x[i] - plt.mines_radius[i] * angle_x,
					plt.mines_y[i] - plt.mines_radius[i] * angle_y,
					plt.mines_x[i] - plt.mines_radius[i] * angle_x,
					plt.mines_y[i] - plt.mines_radius[i] * angle_y,
					0.03,
					0,
					0,
					90, 0.0,
					plt.particles__fog2,
					460,		//	lifespan
					20, 0.9, 0.4, 1.0,
					700,		//	vary_angle
					0.025,	//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.01,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					300,			//	vary_lifespan
					5,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
			}
				plt.take_damage(time_delta / 777);
			// GAME OVER
			plt.energy -= time_delta / 777;
			if (plt.energy <= 0)
			{
				return;
			}
		}
	}
}

plt.think_pickups = function(time_delta)
{
	for (var i = 0; i < plt.MAX_PICKUP_COUNT; i++)
	{
		if (plt.pickup_active[i] == 1)
		{
			if (plt.pickup_x[i] > (1 - plt.pickup_radius[i]))
			{
				plt.pickup_x[i] = (1 - plt.pickup_radius[i]);
				plt.pickup_speed_x[i] *= -1;
			}
			if (plt.pickup_x[i] < plt.pickup_radius[i])
			{
				plt.pickup_x[i] = plt.pickup_radius[i];
				plt.pickup_speed_x[i] *= -1;
			}
/*
			if (plt.pickup_y[i] > (1 - plt.pickup_radius[i]))
			{
				plt.pickup_y[i] = (1 - plt.pickup_radius[i]);
				plt.pickup_speed_y[i] *= -1;
			}
*/
			//if (plt.pickup_y[i] < -plt.pickup_radius[i])

			if (plt.pickup_y[i] < - 1.0)
			{
				//plt.pickup_y[i] = plt.pickup_radius[i];
				//plt.pickup_speed_y[i] *= -1;
				plt.pickup_active[i] = 0;
				continue;
			}
			plt.pickup_x[i] += plt.pickup_speed_x[i] * time_delta * plt.options__speed;
			plt.pickup_y[i] += plt.pickup_speed_y[i] * time_delta * plt.options__speed;
			var dist = µ.distance2D(
				plt.player_x,
				plt.player_y,
				plt.pickup_x[i],
				plt.pickup_y[i]
				);
			if (dist < (plt.pickup_radius[i] + plt.cursor_radius))
			{
				plt.pickup_active[i] = 0;


				if (plt.pickup_type[i] == plt.PICKUPTYPE_STERNTALER)
				{
					plt.increase_score(20);
					if (plt.config__draw_particles)
					{
						plt.particlesGPU.spawn(
							plt.now,
							5,
							plt.pickup_x[i],
							plt.pickup_y[i],
							plt.pickup_x[i],
							plt.pickup_y[i],
							0.05,
							plt.pickup_speed_x[i] * 00,
							plt.pickup_speed_y[i] * 00,
							180, 0,
							plt.particles__fog,
							500,		//	lifespan
							116, 1.0, 0.4, .25,
							360,		//	vary_angle
							0.075,		//	vary_angle_vel
							0,			//	vary_pos_x
							0,			//	vary_pos_y
							0.0075,		//	vary_size
							0,			//	vary_vel_x
							0,			//	vary_vel_y
							450,			//	vary_lifespan
							0,			//	vary_color_hue
							0,			//	vary_color_sat
							0,			//	vary_color_lum
							0			//	vary_color_a
						);
						plt.particlesGPU.spawn(
							plt.now,
							5,
							plt.pickup_x[i],
							plt.pickup_y[i],
							plt.pickup_x[i],
							plt.pickup_y[i],
							0.05,
							plt.pickup_speed_x[i] * 00,
							plt.pickup_speed_y[i] * 00,
							180, 0,
							plt.particles__fog2,
							500,		//	lifespan
							116, 1.0, 0.4, .25,
							360,		//	vary_angle
							0.075,		//	vary_angle_vel
							0,			//	vary_pos_x
							0,			//	vary_pos_y
							0.0075,		//	vary_size
							0,			//	vary_vel_x
							0,			//	vary_vel_y
							450,			//	vary_lifespan
							0,			//	vary_color_hue
							0,			//	vary_color_sat
							0,			//	vary_color_lum
							0			//	vary_color_a
						);
					}
				}
				else if (plt.pickup_type[i] == plt.PICKUPTYPE_INSTABOMB)
				{
					plt.explode_instabomb(plt.pickup_x[i], plt.pickup_y[i]);
				}
			}
		}
	}
}

plt.think_balls = function(time_delta)
{
	if (plt.ball_count > 0)
	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}
		var speed = µ.vector2D_length(0, 0, plt.speed_x[i], plt.speed_y[i]);

		if (speed > plt.speed[i])
		{
			plt.speed_x[i] *= Math.pow(0.9995, time_delta);
			plt.speed_y[i] *= Math.pow(0.9995, time_delta);
			speed = µ.vector2D_length(0, 0, plt.speed_x[i], plt.speed_y[i]);
		}
		var old_x = plt.balls_x[i];
		var old_y = plt.balls_y[i];
		
		if (plt.balls_x[i] > (1 - plt.balls_radius[i]))
		{
			plt.balls_x[i] = (1 - plt.balls_radius[i]);
			plt.speed_x[i] *= -1;
		}
		else if (plt.balls_x[i] < plt.balls_radius[i])
		{
			plt.balls_x[i] = plt.balls_radius[i];
			plt.speed_x[i] *= -1;
		}
		if (plt.balls_y[i] > (1 - plt.balls_radius[i]))
		{
			plt.balls_y[i] = (1 - plt.balls_radius[i]);
			plt.speed_y[i] *= -1;
		}
		else if (plt.balls_y[i] < plt.balls_radius[i])
		{
			plt.balls_y[i] = plt.balls_radius[i];
			plt.speed_y[i] *= -1;
		}
		var speed_factor = plt.dynamic_slowdown_factor / (plt.dynamic_slowdown_base + plt.ball_count * plt.dynamic_slowdown_per_ball);
		plt.balls_angle[i] = µ.vector2D_to_angle(plt.speed_x[i], plt.speed_y[i]);
		if (plt.options__spin_balls)
		{
			plt.balls_angle[i] += Math.sin(plt.now / 3300) * plt.balls_angle_speed[i] * time_delta * plt.options__speed * 1;
			plt.balls_angle[i] = plt.balls_angle[i] % 360;
		}
		plt.speed_x[i] = µ.angle_to_x(plt.balls_angle[i]) * speed;
		plt.speed_y[i] = µ.angle_to_y(plt.balls_angle[i]) * speed;
		plt.balls_x[i] += plt.speed_x[i] * time_delta * plt.options__speed * speed_factor;
		plt.balls_y[i] += plt.speed_y[i] * time_delta * plt.options__speed * speed_factor;
		if (plt.config__draw_particles && plt.options__ball_trail && plt.game_over == 0)
		{
			plt.particlesGPU.spawn(
				plt.now,
				1,
				plt.balls_x[i],
				plt.balls_y[i],
				old_x,
				old_y,
				0.05,
				plt.speed_x[i] * 00,
				plt.speed_y[i] * 00,
				180, 0,
				plt.particles__fog2,
				2500 / plt.options__speed,		//	lifespan
				210, 0.99, 0.95, .0125 * plt.options__speed, 
				360,		//	vary_angle
				0.005,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.0075,		//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				50 / plt.options__speed,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
		}
		// COLLISION
		plt.collision_check(time_delta, 0.0018, plt.player_x, plt.player_y, plt.cursor_radius, plt.balls_x[i], plt.balls_y[i], plt.balls_radius[i]);
		if (plt.energy <= 0)
		{
			return;
		}
		for (var j = 0; j < plt.player_trail_length; j++)
		{
			var frac = 0.5 + 0.5 * (1 - j / (plt.player_trail_length - 1));
			plt.collision_check(time_delta,
				0.000036 * frac,
				plt.player_trail_x[j], plt.player_trail_y[j],
				plt.cursor_radius * 2 * (0.1 + 0.9 * frac),
				plt.balls_x[i], plt.balls_y[i], plt.balls_radius[i]);
			if (plt.energy <= 0)
			{
				return;
			}
		}
	}
}

plt.think = function(time_delta)
{
	if (plt.camera_player.mouse_pos_x < 0)
		plt.camera_player.mouse_pos_x = 0;
	if (plt.camera_player.mouse_pos_x > 1)
		plt.camera_player.mouse_pos_x = 1;
	if (plt.camera_player.mouse_pos_y < 0)
		plt.camera_player.mouse_pos_y = 0;
	if (plt.camera_player.mouse_pos_y > 1)
		plt.camera_player.mouse_pos_y = 1;
	//plt.player_x = plt.camera_player.mouse_pos_x * 0.95 + 0.05 * plt.player_x;
	//plt.player_y = plt.camera_player.mouse_pos_y * 0.95 + 0.05 * plt.player_y;
	plt.player_x = plt.camera_player.mouse_pos_x;
	plt.player_y = plt.camera_player.mouse_pos_y;
	for (var i = 0; i < plt.player_trail_length; i++)
	{
		var inertia = plt.player_trail_intertia;
		var inertia1 = 1 - inertia;
		if (i == 0)
		{
			plt.player_trail_x[i] = plt.player_x * inertia1 + inertia * plt.player_trail_x[i];
			plt.player_trail_y[i] = plt.player_y * inertia1 + inertia * plt.player_trail_y[i];
		}
		else
		{
			plt.player_trail_x[i] = plt.player_trail_x[i - 1] * inertia1 + inertia * plt.player_trail_x[i];
			plt.player_trail_y[i] = plt.player_trail_y[i - 1] * inertia1 + inertia * plt.player_trail_y[i];
		}
	}
	if (plt.input.KEY_F3.pressed)
	{
		time_delta = 1;
	}
	plt.now += time_delta;
	plt.time_since_goal += time_delta;
	plt.time_since_last_damage_taken += time_delta;
	if (!plt.is_intro)
	{
		plt.intro_fade += time_delta;
	}
	var old_goal_x = plt.goal_x;
	var old_goal_y = plt.goal_y;
	plt.goal_x += plt.goal_speed_x * time_delta;
	plt.goal_y += plt.goal_speed_y * time_delta;
	if (plt.goal_x > (1 - plt.goal_radius))
	{
		plt.goal_x = (1 - plt.goal_radius);
		plt.goal_speed_x *= -1;
	}
	if (plt.goal_y > (1 - plt.goal_radius))
	{
		plt.goal_y = (1 - plt.goal_radius);
		plt.goal_speed_y *= -1;
	}
	if (plt.goal_x < plt.goal_radius)
	{
		plt.goal_x = plt.goal_radius;
		plt.goal_speed_x *= -1;
	}
	if (plt.goal_y < plt.goal_radius)
	{
		plt.goal_y = plt.goal_radius;
		plt.goal_speed_y *= -1;
	}
	plt.goal_speed_x *= Math.pow(0.9975, time_delta);
	plt.goal_speed_y *= Math.pow(0.9975, time_delta);
	if (!plt.goal_has_spawned && Math.abs(plt.goal_speed_x) < 0.0005 && Math.abs(plt.goal_speed_y) < 0.0005)
	{
		plt.goal_slowed_down(time_delta);
	}
	if (Math.abs(plt.goal_speed_x) < 0.0005 && Math.abs(plt.goal_speed_y) < 0.0005)
	{
		plt.goal_is_moving = false;
	}
	if (plt.config__draw_particles && plt.options__goal_trail && plt.game_over == 0 && plt.goal_is_moving)
	{
		plt.particlesGPU.spawn(
			plt.now,
			2,
			plt.goal_x,
			plt.goal_y,
			old_goal_x,
			old_goal_y,
			0.05,
			0,
			0,
			90, 0,
			plt.particles__fog,
			400,		//	lifespan
			plt.goal_is_moving ? 220 : 110, 0.3, 0.8, .15,
			360,		//	vary_angle
			0.075,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.025,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			200,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		plt.particlesGPU.spawn(
			plt.now,
			6,
			plt.goal_x,
			plt.goal_y,
			old_goal_x,
			old_goal_y,
			0.03,
			0,
			0,
			90, 0,
			plt.particles__fog,
			400,		//	lifespan
			plt.goal_is_moving ? 220 : 110, 0.5, 0.6, .2,
			360,		//	vary_angle
			0.00055,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.03,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			100,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
	}
	if (plt.game_over > 0)
	{
		plt.game_over -= time_delta;
		if (plt.game_over <= 0)
		{
			plt.scores_accum.add(plt.score)
			plt.game_over = 0;
			plt.previous_score = plt.score;
			plt.score = 0;
			plt.goals_scored = 0;
			plt.last_goal_score = 0;
			plt.energy = 1;
			plt.ball_count = 0;
			plt.mines_count = 0;
			plt.goal_x = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
			plt.goal_y = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);


			for (var i = 0; i < plt.MAX_PICKUP_COUNT; i++)
			{
				plt.pickup_active[i] = 0;
			}
			for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
			{
				plt.balls_active[i] = 0;
			}

			plt.is_intro = true;
			plt.intro_fade = 0;
		}
		return;
	}
	plt.think_pickups(time_delta);
	plt.think_balls(time_delta);
	plt.think_mines(time_delta);
/*
	plt.particlesGPU.spawn(
		plt.now,
		10,
		plt.player_x,
		plt.player_y,
		plt.old_mouse_x,
		plt.old_mouse_y,
		0.07,
		0,
		0,
		90, 0,
		plt.particles__fog,
		300,		//	lifespan
		42, 1, 0.5, .0125,
		360,		//	vary_angle
		0.015,		//	vary_angle_vel
		0,			//	vary_pos_x
		0,			//	vary_pos_y
		0.025,		//	vary_size
		0,			//	vary_vel_x
		0,			//	vary_vel_y
		20,			//	vary_lifespan
		0,			//	vary_color_hue
		0,			//	vary_color_sat
		0,			//	vary_color_lum
		0			//	vary_color_a
	);
*/
	if (!plt.goal_is_moving && µ.distance2D(
		plt.player_x,
		plt.player_y,
		plt.goal_x,
		plt.goal_y
		) < (plt.goal_radius + plt.cursor_radius))
	{
		plt.goal_touched();
	}
	plt.old_mouse_x = plt.camera_player.mouse_pos_x;
	plt.old_mouse_y = plt.camera_player.mouse_pos_y;
	// :)
	if (plt.energy > 0.0 && plt.energy < 1.0)
	{
		plt.energy += 0.0000077 * time_delta;
		if (plt.energy > 1.0)
		{
			plt.energy = 1.0;
		}
	}
};