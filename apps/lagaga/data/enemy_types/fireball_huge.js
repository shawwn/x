lgg.etypes[lgg.ENEMY_TYPE__FIREBALL_HUGE] =
{
	armour:						.01,
	avoid_player_dist_min:		0,
	avoid_player_dist_max:		0,
	batch_max:					3,
	batch_min:					1,
	brake_deceleration:			0.00000090,
	brake_friction:				0.995,
	byebybe_height:				.15,
	byebybe_speed_x:			0,
	byebybe_speed_y:			-0.000005,
	collision_flags:			lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:						50,
	depart_speed_x_min:			.01,
	depart_speed_y_min:			.01,
	depart_speed_x_max:			.3,
	depart_speed_y_max:			.1,
	description:				'', 
	desired_f_dist:				0.03,
	desired_t_dist:				0.05,
	engage_distance:			-1,
	engage_distance_max:		-1,
	engage_height_min:			0.3,
	engage_height_max:			0.95,
	engage_range:				-1,
	follow_chance:				0,
	follow_targets: 			[], 
	friction:					0.95,
	height:						.75,
	height_tol:					.5,
	id: 						lgg.ENEMY_TYPE__FIREBALL_HUGE,
	joinup_chance:				0,
	linger_max:					0,
	linger_min:					0,
	player_collision:			true,
	probability:				1,
	radius:						.09,
	radius_max:					.12,
	recharge_amount:			.333,
	recharge_freq:				1000,
	shield: 					0,
	shield_recharge:			0,
	spawn_max:					120000,
	spawn_min:					60000,
	speed:						.00000120,
	speed_max:					.0005,
	speed_max_friction:			.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:					-1,
	stage_min:					7,
	title:						'Huge Fireball',
	turn_speed:					0,
	unfollow_chance:			0,
	weight:						.5,

	attacks:
	[
		{
			angle:						360,
			angle_offset:				0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:						.6,
			dist_max:					1.2,
			dist_min:					.35,
			dumb_aim:					0.3,
			energy_cost:				.3,
			freq:						5000,
			freq_var:					1500,
			friction:					.9999,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					12000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						.00030,
			spread:						10,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						2,
			wobble_freq:				0,
			wobble_speed:				0,
		},
		// close range
		{
			angle:						360,
			angle_offset:				0,
			barrage_individual_aim:		true,
			barrage_shot_count_max:		5,
			barrage_shot_count_min:		5,
			barrage_shot_delay_max:		250,
			barrage_shot_delay_min:		250,
			damage:						.5,
			dist_max:					.5,
			dist_min:					.025,
			dumb_aim:					0,
			energy_cost:				.1,
			freq:						3000,
			freq_var:					1000,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					24000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						0.00020,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						1,
			wobble_freq:				0,
			wobble_speed:				0,
		},
		// long distance
		{
			angle:						360,
			angle_offset:				0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		2,
			barrage_shot_count_min:		2,
			barrage_shot_delay_max:		500,
			barrage_shot_delay_min:		500,
			damage:						.75,
			dist_max:					2.75,
			dist_min:					.65,
			dumb_aim:					0.7,
			energy_cost:				.2,
			freq:						9000,
			freq_var:					2000,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			hue:						140,
			lifespan:					16000,
			probability:				1,
			shot_count:					5,
			shot_spread:				5,
			speed:						.00035,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						1,
			wobble_freq:				0,
			wobble_speed:				0,
		}
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius * 2;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_sunflare1, e.pos_x, e.pos_y, r2, r2, e.heading,
			0, 1.0, 0.75 + (fade * .25), 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e)
	{
		var radius_8 = e.radius / 8;
		for (var i = 0; i < 10; i++)
		{
			var angle = i * 36;
			var angle_x = µ.angle_to_x(angle) * radius_8;
			var angle_y = µ.angle_to_y(angle) * radius_8;
			for (var j = 1; j < 4; j++)
			{
				lgg.projectiles.spawn(e.pos_x + angle_x, e.pos_y + angle_y,
					angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5,
					700 + 70 * j + µ.rand_int(10) * j, .00025 * j + µ.rand(.000005) * j, 0.99,
					0, 0, -1, 0, 200, .0000025, 0.001, .0000005);
			}
		}

		for (var j = 0; j < 30; j++)
		{
			var angle = µ.rand(360);
			lgg.projectiles.spawn(e.pos_x, e.pos_y,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25 + µ.rand(0.75),
				500 + µ.rand_int(1000), .00005 + µ.rand(.00005), .9999,
				0, 0, -1, 0,
				0, 0, 0, 0);
		}


		lgg.particlesGPU.spawn(
			lgg.now,
			10,
			e.pos_x,
			e.pos_y,
			e.old_pos_x,
			e.old_pos_y,
			e.radius * 4,
			e.speed_x,
			e.speed_y,
			0, e.radius * 1.0,
			lgg.particles__fireball,
			5000,
			0, 1, 1, 0,
			360,					//	vary_angle
			e.radius * 1.5,			//	vary_angle_vel
			e.radius * .25,		//	vary_pos_x
			e.radius * .25,		//	vary_pos_y
			e.radius * 2,			//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			1750,					//	vary_lifespan
			10,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);


	},
	get_hit:	function(e, damage_amount, damage_type, damage_pos_x, damage_pos_y)
	{
		var radius_8 = e.radius / 8;
		for (var i = 0; i < (5 + 5 * (.25 + damage_amount)); i++)
		{
			var angle = µ.rand(360);
			var angle_x = µ.angle_to_x(angle) * radius_8;
			var angle_y = µ.angle_to_y(angle) * radius_8;
			lgg.particlesGPU.spawn(
				lgg.now,
				3,
				damage_pos_x,
				damage_pos_y,
				damage_pos_x,
				damage_pos_y,
				e.radius * .75 * (.75 + damage_amount),
				e.speed_x,
				e.speed_y,
				0, -e.radius * (.5 + damage_amount),
				lgg.particles__damage,
				500,
				0, 1, 1, 1,
				360,									//	vary_angle
				e.radius * (.25 + damage_amount),		//	vary_angle_vel
				0,										//	vary_pos_x
				0,										//	vary_pos_y
				0,										//	vary_size
				0,										//	vary_vel_x
				0,										//	vary_vel_y
				50,										//	vary_lifespan
				10,										//	vary_color_hue
				0,										//	vary_color_sat
				0,										//	vary_color_lum
				0										//	vary_color_a
			);
		}
	},
	spawn:				function(e)
	{
		e.ext = {
			last_fire_particles:	lgg.now,
			angle_vel:	- .03 + µ.rand(.06),
		};
		e.heading = µ.rand(360);
	},

	think_pre:			function(e, time_delta)
	{
		e.heading += e.ext.angle_vel * time_delta;
	},

	think_post:			function(e, time_delta)
	{
		var since_last = lgg.now - e.ext.last_fire_particles;
		if (since_last >= 50)
		{
			var flare = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;

			var p_count = 7 + Math.round((2 + .5 * flare + 2.0 * (1 - e.health)));

			e.ext.last_fire_particles = lgg.now + (since_last % 20);

			lgg.particlesGPU.spawn(
				lgg.now,
				p_count,
				e.pos_x,
				e.pos_y,
				e.old_pos_x,
				e.old_pos_y,
				e.radius * (.7 + .3 * flare),
				0,
				0,
				0, e.radius * .8,
				lgg.particles__fireball,
				1000 + 500 * flare - 250 * e.health,
				0, 1, 1, 1,
				360,					//	vary_angle
				e.radius * .1,			//	vary_angle_vel
				0,						//	vary_pos_x
				0,						//	vary_pos_y
				e.radius / 2,			//	vary_size
				0,						//	vary_vel_x
				0,						//	vary_vel_y
				750 + 250 * flare,		//	vary_lifespan
				10,						//	vary_color_hue
				0,						//	vary_color_sat
				0,						//	vary_color_lum
				0						//	vary_color_a
			);
		}
	},
};