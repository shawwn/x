plt.spawn_pickup = function(type, pos_x, pos_y)
{
	for (var i = 0; i < plt.MAX_PICKUP_COUNT; i++)
	{
		if (plt.pickup_active[i] == 0)
		{
			plt.pickup_active[i] = 1;
			plt.pickup_x[i] = pos_x;
			plt.pickup_y[i] = pos_y;
			plt.pickup_speed_x[i] = 0;
			plt.pickup_speed_y[i] = -0.00001 - µ.rand(0.0003);
			plt.pickup_type[i] = type;
			plt.pickup_radius[i] = plt.base_pickup_radius;
			return;
		}
	}
}


plt.spawn_ball = function(pos_x, pos_y)
{

	//console.log(pos_x, pos_y);


	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 1)
		{
			continue;
		}

		plt.balls_active[i] = 1;

		var angle = µ.vector2D_to_angle(plt.goal_speed_x, plt.goal_speed_y);
		angle += -10 + µ.rand(20);

		plt.balls_angle[i] = angle;
		plt.balls_angle_speed[i] = 0.04 + µ.rand(0.02 * i);
		plt.balls_x[i] = pos_x;
		plt.balls_y[i] = pos_y;
		plt.balls_radius[i] = plt.ball_radius;

		//console.log(plt.ball_radius, plt.balls_radius[i]);

		plt.speed[i] = (0.000125 + µ.rand(0.0000100));

		plt.speed_x[i] = plt.goal_speed_x * 1.25 / plt.options__speed + µ.angle_to_x(plt.balls_angle[i]) * plt.speed[i];
		plt.speed_y[i] = plt.goal_speed_y * 1.25 / plt.options__speed + µ.angle_to_y(plt.balls_angle[i]) * plt.speed[i];

		if (plt.config__draw_particles)
		{
			plt.particlesGPU_top.spawn(
				plt.now,
				20,
				plt.balls_x[i],
				plt.balls_y[i],
				plt.balls_x[i],
				plt.balls_y[i],
				0.075,
				plt.speed_x[i] * 40,
				plt.speed_y[i] * 40,
				angle - 180, 0.075,
				plt.particles__fog,
				300,		//	lifespan
				210, 0.7, 0.8, .3,
				180,		//	vary_angle
				0.045,		//	vary_angle_vel
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
		}
		plt.ball_count++;
		return;
	}
}

plt.spawn_mines = function(count, pos_x, pos_y)
{
	if (!plt.options__spawn_mines)
		return;
	for (var k = 0; k < count; k++)
	{
		for (var i = 0; i < plt.mines_count; i++)
		{
			if (plt.mines_age[i] > plt.mines_duration[i])
			{
				break;
			}
		}
		plt.mines_age[i] = 0;
		plt.mines_x[i] = pos_x;
		plt.mines_y[i] = pos_y;
		var angle = µ.rand(360);
		plt.mines_facing[i] = µ.rand(360);
		plt.mines_hue[i] = µ.rand(360);
		var speed = (0.000075 + µ.rand(0.000125));
		plt.mines_speed_x[i] = plt.goal_speed_x + µ.angle_to_x(angle) * speed;
		plt.mines_speed_y[i] = plt.goal_speed_y + µ.angle_to_y(angle) * speed;
		plt.mines_radius[i] = plt.mine_radius_min + µ.rand(plt.mine_radius_max - plt.mine_radius_min);
		plt.mines_duration[i] = plt.mine_duration_min + µ.rand(plt.mine_duration_max - plt.mine_duration_min);
		plt.mines_count = Math.max(plt.mines_count, i + 1);
	}
}

plt.increase_score = function(amount)
{
	plt.score += amount;
	if (plt.score > plt.high_score)
	{
		plt.high_score = Math.floor(plt.score);
		localStorage.setItem("dodgygame_highscore", plt.high_score);
	}
}

plt.goal_touched = function()
{
	plt.is_intro = false;
	//plt.intro_fade = 0;
	
	plt.energy += 0.003;
	if (plt.energy > 1)
		plt.energy = 1;
	plt.goal_is_moving = true;
	plt.goal_has_spawned = false;
	var angle = µ.vector2D_to_angle(plt.goal_x - plt.player_x, plt.goal_y - plt.player_y)
	plt.goal_speed_x = µ.angle_to_x(angle) * 0.0025;
	plt.goal_speed_y = µ.angle_to_y(angle) * 0.0025;
	plt.last_goal_score = plt.goals_scored == 0 ? 50 : Math.ceil(Math.max(0.5, 50 - plt.time_since_goal / 500));
	
	plt.increase_score(plt.last_goal_score);

	plt.goals_scored++;

/*
	var old_goal_x = plt.goal_x;
	var old_goal_y = plt.goal_y;

	plt.goal_x = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
	plt.goal_y = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
	while (µ.distance2D(plt.player_x, plt.player_y, plt.goal_x, plt.goal_y) < 0.6)
	{
		plt.goal_x = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
		plt.goal_y = plt.goal_radius + µ.rand(1 - plt.goal_radius * 2);
	}
*/

	plt.time_since_goal = 0;
	//plt.shazam();
}

plt.explode_instabomb = function(bomb_x, bomb_y)
{

	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}
		var dist = µ.distance2D(bomb_x, bomb_y, plt.balls_x[i], plt.balls_y[i]);
		if (dist < plt.instabomb_range)
		{
			plt.balls_active[i] = 0;

			plt.ball_count--;

			plt.particlesGPU.spawn(
				plt.now,
				25,
				plt.balls_x[i],
				plt.balls_y[i],
				plt.balls_x[i],
				plt.balls_y[i],
				0.15,
				0,
				0,
				180, 0,
				plt.particles__fog,
				500,		//	lifespan
				52, 1.0, 0.4, .25,
				360,		//	vary_angle
				plt.instabomb_range,		//	vary_angle_vel
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


	if (plt.config__draw_particles)
	{
		plt.particlesGPU.spawn(
			plt.now,
			5,
			bomb_x,
			bomb_y,
			bomb_x,
			bomb_y,
			plt.instabomb_range * 2,
			0,
			0,
			180, 0,
			plt.particles__fog,
			750,		//	lifespan
			7, 1.0, 0.4, .25,
			360,		//	vary_angle
			plt.instabomb_range * 2,		//	vary_angle_vel
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
			bomb_x,
			bomb_y,
			bomb_x,
			bomb_y,
			plt.instabomb_range * 2,
			0,
			0,
			180, 0,
			plt.particles__fog2,
			750,		//	lifespan
			16, 1.0, 0.4, .25,
			360,		//	vary_angle
			plt.instabomb_range * 2,		//	vary_angle_vel
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

plt.goal_slowed_down = function(time_delta)
{
	plt.goal_has_spawned = true;
	//plt.spawn_mines(10, plt.goal_x, plt.goal_y);

	//plt.spawn_pickup(plt.PICKUPTYPE_STERNTALER, plt.goal_x, plt.goal_y);

	if (µ.rand(1) > 0.333)
		if (µ.rand(1) > 0.8)
		{
			plt.spawn_pickup(plt.PICKUPTYPE_INSTABOMB, µ.rand(1), 1.1);
		}
		else
		{
			plt.spawn_pickup(plt.PICKUPTYPE_STERNTALER, µ.rand(1), 1.1);
			if (µ.rand(1) > 0.75751)
			{
				plt.spawn_pickup(plt.PICKUPTYPE_STERNTALER, µ.rand(1), 1.1);
			}
		}

	if (plt.ball_count < 10)
	{
		plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
	}
	else if (plt.ball_count < 20)
	{
		if (plt.goals_scored % 6 > 0)
		{
			plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
		else
		{
			plt.spawn_mines(1, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
	}
	else if (plt.ball_count < 30)
	{
		if (plt.goals_scored % 5 > 0)
		{
			plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
		else
		{
			plt.spawn_mines(2, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
	}
	else if (plt.ball_count < 40)
	{
		if (plt.goals_scored % 4 > 0)
		{
			plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
		else
		{
			plt.spawn_mines(3, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
	}
	else if (plt.ball_count < 50)
	{
		if (plt.goals_scored % 3 > 0)
		{
			plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
		else
		{
			plt.spawn_mines(4, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
	}
	else if (plt.ball_count < 60)
	{
		if (plt.goals_scored % 2 > 0)
		{
			plt.spawn_ball(plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
		else
		{
			plt.spawn_mines(5, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
		}
	}
	else
	{
		plt.spawn_mines(10, plt.goal_x + plt.goal_speed_x * 50, plt.goal_y + plt.goal_speed_y * 50);
	}
}


plt.take_damage = function(amount)
{
	if (plt.config__draw_particles)
	{
		var particle_count = Math.round(µ.rand(amount * 5000));
		if (particle_count > 0)
		{
			plt.particlesGPU.spawn(
				plt.now,
				particle_count,
				0.25 + 0.5 * plt.energy,
				1.05,
				0.25 + 0.5 * plt.energy,
				1.05,
				0.025,
				0.005,
				0,
				90, 0.0,
				plt.particles__fog2,
				1500,		//	lifespan
				0 + 120 * plt.energy, 1, 0.6, 0.09,
				360,		//	vary_angle
				0.00,		//	vary_angle_vel
				0.01,			//	vary_pos_x
				0.03,		//	vary_pos_y
				0.01,		//	vary_size
				0.0025,		//	vary_vel_x
				0.025,			//	vary_vel_y
				450,			//	vary_lifespan
				5,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			plt.particlesGPU.spawn(
				plt.now,
				particle_count,
				0.25 + 0.5 * plt.energy,
				1.05,
				0.25 + 0.5 * plt.energy,
				1.05,
				0.075,
				0.005,
				0,
				90, 0.0,
				plt.particles__fog2,
				5000,		//	lifespan
				0 + 120 * plt.energy, 1, 0.6, 0.09,
				360,		//	vary_angle
				0.00,		//	vary_angle_vel
				0.01,			//	vary_pos_x
				0.03,		//	vary_pos_y
				0.01,		//	vary_size
				0.0025,		//	vary_vel_x
				0.025,			//	vary_vel_y
				450,			//	vary_lifespan
				5,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
		}
	}

	// GAME OVER
	plt.energy -= amount;
	plt.time_since_last_damage_taken = 0;

	if (plt.energy <= 0)
	{
		plt.energy = 0;
		plt.game_over = plt.game_over_duration;

		if (plt.config__draw_particles)
		{
			plt.particlesGPU.spawn(
				plt.now,
				200,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.115,
				0,
				0,
				90, 0.0,
				plt.particles__fire,
				1000,		//	lifespan
				0, 1, 1.0, 0.8,
				360,			//	vary_angle
				0.5,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.05,			//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				500,		//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			plt.particlesGPU.spawn(
				plt.now,
				100,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.05,
				0,
				0,
				90, 0.0,
				plt.particles__fire,
				1200,		//	lifespan
				10, 0.75, 1.0, 0.2,
				360,			//	vary_angle
				0.35,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.03,			//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				400,		//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			plt.particlesGPU.spawn(
				plt.now,
				50,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.050,
				0,
				0,
				90, 0.0,
				plt.particles__fire,
				1000,		//	lifespan
				5, 0.65, 1.0, 0.75,
				360,			//	vary_angle
				0.5,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.04	,			//	vary_size
				0,			//	vary_vel_x
				0,			//	vary_vel_y
				100,		//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			plt.particlesGPU.spawn(
				plt.now,
				70,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.0250,
				0,
				0,
				90, 0.0,
				plt.particles__fire,
				700,		//	lifespan
				0, 0.5, 1.0, 0.75,
				360,			//	vary_angle
				0.4,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.02,			//	vary_size
				0.1,			//	vary_vel_x
				0.1,			//	vary_vel_y
				500,		//	vary_lifespan
				0,			//	vary_color_hue
				0.5,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			// ring
			plt.particlesGPU.spawn(
				plt.now + 50,
				20,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.090,
				0,
				0,
				90, 0.25,
				plt.particles__fire,
				600,		//	lifespan
				0, 0.85, 1.0, 0.75,
				360,			//	vary_angle
				0.0,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.04,			//	vary_size
				0.0,			//	vary_vel_x
				0.0,			//	vary_vel_y
				500,		//	vary_lifespan
				0,			//	vary_color_hue
				0.15,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			// ring
			plt.particlesGPU.spawn(
				plt.now + 100,
				20,
				plt.player_x,
				plt.player_y,
				plt.player_x,
				plt.player_y,
				0.050,
				0,
				0,
				90, 0.15,
				plt.particles__fire,
				800,		//	lifespan
				0, 0.85, 1.0, 0.75,
				360,			//	vary_angle
				0.0,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.04,			//	vary_size
				0.0,			//	vary_vel_x
				0.0,			//	vary_vel_y
				750,		//	vary_lifespan
				0,			//	vary_color_hue
				0.15,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
		}
		return;
	}
}

plt.shazam = function()
{
	for (var i = 0; i < plt.MAX_BALL_COUNT; i++)
	{
		if (plt.balls_active[i] == 0)
		{
			continue;
		}
		if (µ.rand_int(1))
		{
			if (plt.config__draw_particles)
			{
				plt.particlesGPU.spawn(
					plt.now,
					20,
					plt.balls_x[i],
					plt.balls_y[i],
					plt.balls_x[i],
					plt.balls_y[i],
					0.15,
					plt.speed_x[i] * 800,
					plt.speed_y[i] * 800,
					plt.balls_angle[i], 0,
					plt.particles__fog,
					400,		//	lifespan
					110, 0.3, 0.8, .4,
					360,		//	vary_angle
					0.075,		//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.075,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					300,			//	vary_lifespan
					0,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
			}
			plt.balls_x[i] = plt.goal_x;
			plt.balls_y[i] = plt.goal_y;
		}
	}
}

