lgg.etypes[lgg.ENEMY_TYPE__EYE] =
{
	armour:						.125,
	avoid_player_dist_min:		0,
	avoid_player_dist_max:		0,
	batch_max:					2,
	batch_min:					1,
	brake_deceleration:			0.00000090,
	brake_friction:				0.995,
	byebybe_height:				.15,
	byebybe_speed_x:			0,
	byebybe_speed_y:			-0.00001,
	collision_flags:			lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:						4,
	depart_speed_x_min:			1,
	depart_speed_y_min:			.2,
	depart_speed_x_max:			1,
	depart_speed_y_max:			.2,
	description:				'',
	desired_f_dist:				0,
	desired_t_dist:				0.05,
	engage_distance:			0.20,
	engage_distance_max:		0.25,
	engage_height_min:			0.3,
	engage_height_max:			0.95,
	engage_range:				0.75,
	follow_chance:				0,
	follow_targets: 			[],
	friction:					0.99,
	height:						.75,
	height_tol:					.5,
	id: 						lgg.ENEMY_TYPE__EYE,
	joinup_chance:				0,
	linger_max:					45000,
	linger_min:					15000,
	player_collision:			true,
	probability:				1,
	radius:						0.025,
	radius_max:					0.025,
	recharge_amount:			0.3,
	recharge_freq:				4000,
	shield: 					2.0,
	shield_recharge:			0,
	spawn_max:					5000,
	spawn_min:					3000,
	speed:						0.00000064,
	speed_max:					0.0005,
	speed_max_friction:			0.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:					-1,
	stage_min:					2,
	title:						'Eye',
	turn_speed:					0.0025,
	unfollow_chance:			0,
	weight:						1,

	attacks:
	[
		{
			angle:						360,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			angle_offset:				0,
			damage:						0.3,
			dist_max:					1.5,
			dist_min:					0.30,
			dumb_aim:					0,
			energy_cost:				0.15,
			freq:						1500,
			freq_var:					1000,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					15000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						0.00040,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						1,
			wobble_freq:				0,
			wobble_speed:				0,
		},
		{
			angle:						360,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			angle_offset:				0,
			damage:						0.15,
			dist_max:					0.40,
			dist_min:					0.025,
			dumb_aim:					0,
			energy_cost:				0.2,
			freq:						1500,
			freq_var:					500,
			friction:					0.99,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0.0000025,
			homing_turn:				0.0035,
			lifespan:					3000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						0.00025,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						1,
			wobble_freq:				4.5,
			wobble_speed:				0.000005,
		},
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;
		if (!e.attacking)
			var hue = -60-120*hfade;
		else
			var hue = 100 + 20 * hfade;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_eye2, e.pos_x, e.pos_y, r2, r2, e.heading,
			hue, (0.75+fade*.5), 1 + fade / 2, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		var angle_step = 123 + µ.rand(3333);
		for (var i = 0; i < 20; i++)
		{
			var angle = angle_step * i + (angle_step * i * i) / 10000;
			lgg.projectiles.spawn(e.pos_x, e.pos_y,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5 + µ.rand(0.25),
				1500 + i * 10 + µ.rand_int(500), 0.00005 + 0.0000015 * i, .998,
				0.05, 0.0000020 + µ.rand(0.0000010), 300, 500 + µ.rand_int(500),
				0, 0, 0, 0);
		}
		for (var i = 0; i < 15; i++)
		{
			var angle = i * 24;
			lgg.projectiles.spawn(e.pos_x, e.pos_y,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.75,
				1000 + µ.rand_int(200), 0.00007 + µ.rand(0.000005), 1,
				0, 0, -1, 0,
				0, 0, 0, 0);
		}
	},
};