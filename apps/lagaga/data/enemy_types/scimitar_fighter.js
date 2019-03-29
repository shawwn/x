lgg.etypes[lgg.ENEMY_TYPE__SCIMITAR_FIGHTER] =
{
	armour:					.233,
	avoid_player_dist_max:	0,
	avoid_player_dist_min:	0,
	batch_max:				5,
	batch_min:				3,
	brake_deceleration:		0.00000190,
	brake_friction:			0.95,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.000002,
	collision_flags:		lgg.COLLISION_FLAG__PLAYER,
	danger:					2,
	depart_speed_x_max:			.1,
	depart_speed_x_min:		.1,
	depart_speed_y_max:			.2,
	depart_speed_y_min:		.2,
	description:			'',
	desired_f_dist:			0.019,
	desired_t_dist:			0.05,
	engage_distance: 		-1,
	engage_distance_max:	-1,
	engage_height_max:		0.95,
	engage_height_min:		0.3,
	engage_range:			-1,
	follow_chance:			0.5,
	follow_targets: 		[],
	friction:				0.8,
	height:					.80,
	height_tol:				.4,
	id: 					lgg.ENEMY_TYPE__SCIMITAR_FIGHTER,
	joinup_chance:			0.9,
	linger_max:				180000,
	linger_min:				60000,
	player_collision: 		true,
	probability:			1,
	radius:					0.025,
	radius_max:				0.025,
	recharge_amount: 		0.3,
	recharge_freq:			4000,
	shield: 				0,
	shield_recharge: 		0,
	spawn_max:				5000,
	spawn_min:				3000,
	speed:					0.0000150,
	speed_max:				0.0015,
	speed_max_friction:		0.995,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				2,
	title:					'Scimitar Fighter',
	turn_speed:				0.002,
	unfollow_chance: 		0,
	weight:					0.1,

	attacks:
	[

		{
			angle:			9.5,
			angle_offset:	-1,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:			.25,
			dist_max:		2.5,
			dist_min:		0.025,
			dumb_aim:		0,
			energy_cost:	0.05,
			freq:			750,
			freq_var:		500,
			friction:		1,
			homing_delay:	0,
			homing_time:	-1,
			homing_speed:	0,
			homing_turn:	0,
			lifespan:		30000,
			probability:	1,
			shot_count:		1,
			shot_spread:	0,
			speed:			0.00045,
			spread:			0,
			projectile_type:		lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:			lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:			0,
			angle_vel:				0,
			weight:			1,
			wobble_freq:	0,
			wobble_speed:	0,
		},


	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;

		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_amber_scimitar, e.pos_x, e.pos_y, r2, r2, e.heading,
			e.ext.hue, 0.05 + 0.7 * hfade, .95 + 0.75 * fade, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
	},
	spawn:			function(e) {
		e.ext = {
			last_rage_shot:	0,
			hue:			180 + µ.rand(10),
		};
	},
	think_post:			function(e, time_delta) {
	}
};