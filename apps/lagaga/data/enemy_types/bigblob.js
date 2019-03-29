lgg.etypes[lgg.ENEMY_TYPE__BIGBLOB] =
{
	armour:					.2,
	avoid_player_dist_max:	0.01,
	avoid_player_dist_min:	0.05,
	batch_max:				5,
	batch_min:				1,
	brake_deceleration:		0.00000050,
	brake_friction:			0.995,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.00001,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					4,
	depart_speed_x_max:		.6,
	depart_speed_x_min:		.3,
	depart_speed_y_max:		.2,
	depart_speed_y_min:		.1,
	description:			'', 
	desired_f_dist:			0.08,
	desired_t_dist:			0.1,
	engage_distance:		0.1,
	engage_distance_max:	0.2,
	engage_height_max:		0.95,
	engage_height_min:		0.25,
	engage_range:			0.4,
	follow_chance:			0.50,
	follow_targets: 		[lgg.ENEMY_TYPE__BIGBLOB], 
	friction:				0.997,
	height:					.7,
	height_tol:				.6,
	id: 					lgg.ENEMY_TYPE__BIGBLOB,
	joinup_chance:			0.01,
	linger_max:				90000,
	linger_min:				60000,
	player_collision: 		true,
	probability:			1,
	radius:					0.028,
	radius_max:				0.028,
	recharge_amount:		0.25,
	recharge_freq:			4000,
	shield: 				4,
	shield_recharge:		0,
	spawn_max:				250,
	spawn_min:				150,
	speed:					0.00000020,
	speed_max:				0.0005,
	speed_max_friction:		0.0005,
	speed_nimble_x:			0.00000030,
	speed_nimble_y:			0.00000030,
	stage_max:				-1,
	stage_min:				1,
	title:					'Big Blob',
	turn_speed:				0.0015,
	unfollow_chance:		0,
	weight:					1,

	attacks:
	[
		{
			angle:			360,
			angle_offset:	0,
			damage:			.45,
			dist_max:		2.50,
			dist_min:		0.25,
			dumb_aim:		0,
			energy_cost:	0.25,
			freq:			5000,
			freq_var:		1500,
			friction:		1,
			homing_delay:	0,
			homing_time:	-1,
			homing_speed:	0,
			homing_turn:	0,
			lifespan:		5000,
			probability:	1,
			shot_count:		2,
			shot_spread:	1,
			speed:			0.0003,
			spread:			0,
			projectile_type:lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:	lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:	0,
			angle_vel:		0,
			weight:			1,
			wobble_freq:	20,
			wobble_speed:	0.000001,
		},
		{
			angle:			360,
			angle_offset:	0,
			angle_vel:		0,
			angle_accel:	0,
			damage:			.35,
			dist_max:		1.50,
			dist_min:		0.05,
			dumb_aim:		0,
			energy_cost:	0.2,
			freq:			5000,
			freq_var:		1500,
			friction:		1,
			homing_delay:	0,
			homing_time:	-1,
			homing_speed:	0,
			homing_turn:	0,
			lifespan:		15000,
			probability:	0.5,
			shot_count:		2,
			shot_spread:	5,
			speed:			0.00015,
			spread:			0,
			projectile_type:		lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:			lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:			0,
			angle_vel:				0,
			weight:			2,
			wobble_freq:	0,
			wobble_speed:	0,
		}
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 250 ? (1 - (lgg.now - e.last_hit) / 250) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, r2, r2, e.heading,
			180 - hfade*30, 0.5+fade/2, 1.0 + 1.5 * fade, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		for (var i = 0; i < 3; i++)
		{
			for (var a = 0; a < 4; a++)
			{
				var angle = e.heading - 20 + µ.rand(40) + a * 90;
				lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * e.radius, e.pos_y + µ.angle_to_y(angle) * e.radius,
					angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5,
					300 + µ.rand_int(600), 0.000125 + µ.rand(0.000125), .9995,
					0, 0, -1, 0,
					0, 0, 0, 0);

			}
		}
	},
	spawn:			function(e) {
		e.ext = {
			last_rage_shot:	0,
		};
	},
	think_pre:			function(e, time_delta) {
	},
	think_post:			function(e, time_delta) {
		if (e.health < 0.8)
		{
			var hfade = e.health / 0.8;
			var hfade2 = 1-hfade;
			if (lgg.now - e.ext.last_rage_shot > (500 + 500 * hfade))
			{
				var angle = µ.rand(360);
				lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * e.radius, e.pos_y + µ.angle_to_y(angle) * e.radius,
					angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5 + 0.5 * hfade2,
					100, 0.00025, 1,
					0, 0, -1, 0,
					0, 0, 0, 0);
				e.ext.last_rage_shot = lgg.now;
			}
		}
	},
};