lgg.etypes[lgg.ENEMY_TYPE__BLOBCHAIN] =
{
	armour:						.8,
	avoid_player_dist_max:		0.02,
	avoid_player_dist_min:		0.01,
	batch_max:					20,
	batch_min:					5,
	brake_deceleration:			0.00000190,
	brake_friction:				0.95,
	byebybe_height:				.05,
	byebybe_speed_x:			0,
	byebybe_speed_y:			-0.000011,
	collision_flags:			lgg.COLLISION_FLAG__PLAYER,
	danger:						0.25,
	depart_speed_x_max:			.1,
	depart_speed_x_min:			.1,
	depart_speed_y_max:			.2,
	depart_speed_y_min:			.2,
	description:				'Popcorn',
	desired_f_dist:				0.0075,
	desired_t_dist:				0.05,
	engage_distance: 			-1,
	engage_distance_max:		-1,
	engage_height_max:			0.95,
	engage_height_min:			0.3,
	engage_range:				-1,
	follow_chance:				0.5,
	follow_targets: 			[lgg.ENEMY_TYPE__BLOBCHAIN],
	friction:					0.8,
	height:						.65,
	height_tol:					.7,
	id: 						lgg.ENEMY_TYPE__BLOBCHAIN,
	joinup_chance:				0.99,
	linger_max:					180000,
	linger_min:					60000,
	player_collision: 			true,
	probability:				1,
	radius:						0.015,
	radius_max:					0.015,
	recharge_amount: 			0.1,
	recharge_freq:				4000,
	shield: 					0,
	shield_recharge: 			0,
	spawn_max:					60000,
	spawn_min:					30000,
	speed:						0.0000110,
	speed_max:					0.0015,
	speed_max_friction:			0.995,
	speed_nimble_x:				0,
	speed_nimble_y:				0,
	stage_max:					-1,
	stage_min:					3,
	title:						'Blob Chain',
	turn_speed:					0.01,
	unfollow_chance: 			0,
	weight:						0.1,

	attacks:
	[
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = e.health;
		var r2 = e.radius*2;

		var hue = 126 + 80 * hfade;

		if (e.follower > -1 && e.following == -1)
		{
			hue = 33 - 80 * hfade;
		}
		if (e.follower == -1 && e.following == -1)
		{
			hue = 56 - 80 * hfade;
		}
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, r2, r2, e.heading,
			0, 0, 0.95 + 0.75 * fade, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob_inner, e.pos_x, e.pos_y, r2, r2, e.heading,
			hue, 0.75, 1 + fade * 0.5, 1.0,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		for (var i = 0; i < 3; i++)
		{
			for (var a = 0; a < 4; a++)
			{
				var angle = e.heading - 15 + µ.rand(30) + a * 90;
				lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * e.radius, e.pos_y + µ.angle_to_y(angle) * e.radius,
					angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
					200 + µ.rand_int(300), 0.000075 + µ.rand(0.000075), 1,
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
	think_post:			function(e, time_delta) {
	}
};