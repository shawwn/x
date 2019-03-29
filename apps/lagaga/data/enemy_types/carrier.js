lgg.etypes[lgg.ENEMY_TYPE__CARRIER] =
{
	armour:						.05,
	avoid_player_dist_min:		0,
	avoid_player_dist_max:		0,
	batch_max:					2,
	batch_min:					1,
	brake_deceleration:			0.00000090,
	brake_friction:				0.995,
	byebybe_height:				.15,
	byebybe_speed_x:			0,
	byebybe_speed_y:			-0.000005,
	collision_flags:			lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:						7,
	depart_speed_x_min:			1,
	depart_speed_y_min:			.1,
	depart_speed_x_max:			1,
	depart_speed_y_max:			.1,
	description:				'Spawns fighters',
	desired_f_dist:				0,
	desired_t_dist:				0.05,
	engage_distance:			0.25,
	engage_distance_max:		0.3,
	engage_height_min:			0.3,
	engage_height_max:			0.95,
	engage_range:				0.35,
	follow_chance:				0,
	follow_targets: 			[],
	friction:					0.99,
	height:						.75,
	height_tol:					.5,
	id: 						lgg.ENEMY_TYPE__CARRIER,
	joinup_chance:				0,
	linger_max:					90000,
	linger_min:					60000,
	player_collision:			true,
	probability:				1,
	radius:						0.05,
	radius_max:					0.05,
	recharge_amount:			0.5,
	recharge_freq:				4000,
	shield: 					20,
	shield_recharge:			0.0001,
	spawn_max:					45000,
	spawn_min:					30000,
	speed:						0.00000064,
	speed_max:					0.0005,
	speed_max_friction:			0.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:					-1,
	stage_min:					3,
	title:						'Carrier',
	turn_speed:					0,
	unfollow_chance:			0,
	weight:						1,

	attacks:
	[
		{
			angle:					360,
			angle_offset:			0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:					0.8,
			dist_max:				2.5,
			dist_min:				0.25,
			dumb_aim:				0,
			energy_cost:			0.35,
			freq:					4000,
			freq_var:				2000,
			friction:				1,
			homing_delay:			0,
			homing_time:			-1,
			homing_speed:			0,
			homing_turn:			0,
			lifespan:				15000,
			probability:			0.2,
			shot_count:				1,
			shot_spread:			0,
			speed:					0.0002,
			spread:					0,
			projectile_type:		lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:			lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:			0,
			angle_vel:				0,
			weight:					1,
			wobble_freq:			0,
			wobble_speed:			0,
		},
	],
	damage:			function(e, amount, damage_type)
	{
		return amount;
	},
	draw:			function(e)
	{
		var r2 = e.radius*2.2;
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_carrier, e.pos_x, e.pos_y, r2, r2, 90,
			0, 1, 1 + fade, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},

	explode:			function(e)
	{
		var radius = e.radius / 4;
		for (var i = 0; i < 18; i++)
		{
			var angle = i * 20;
			lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * radius, e.pos_y + µ.angle_to_y(angle) * radius,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
				700 + µ.rand_int(50), 0.000200, .9995,
				0, 0, -1, 0,
				0, 0, 0, 0);
			lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * radius, e.pos_y + µ.angle_to_y(angle) * radius,
				angle - 10, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5,
				600 + µ.rand_int(50), 0.000150, .9995,
				0, 0, -1, 0,
				0, 0, 0, 0);
			lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * radius, e.pos_y + µ.angle_to_y(angle) * radius,
				angle - 10, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.75,
				500 + µ.rand_int(50), 0.000075, .9995,
				0, 0, -1, 0,
				0, 0, 0, 0);
		}
	},

	spawn:			function(e) {
		e.ext =  {
			fighters_launched: 	0,
			last_launch: 		lgg.now - 25000 - µ.rand(20000) ,
		};
	},
	think_post:			function(e, time_delta) {
		if (e.ext.fighters_launched < 4)
		{
			if (lgg.now - e.ext.last_launch > (5000 + 30000 * e.health))
			{
				lgg.enemies.spawn_enemy(lgg.etypes[lgg.ENEMY_TYPE__FIGHTER], e.pos_x, e.pos_y, -1);
				e.ext.last_launch = lgg.now + µ.rand(5000 * e.health);
				e.ext.fighters_launched++;
			}
		}
		else
		{
			e.time_to_linger = 0;
		}
	},
};