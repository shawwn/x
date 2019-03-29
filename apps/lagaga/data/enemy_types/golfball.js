lgg.etypes[lgg.ENEMY_TYPE__GOLFBALL] =
{
	armour:					1.5,
	avoid_player_dist_min:	0,
	avoid_player_dist_max:	0,
	batch_max:				3,
	batch_min:				1,
	brake_deceleration:		.00000020,
	brake_friction:			.9995,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-.000001,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					2,
	depart_speed_x_min:		1,
	depart_speed_y_min:		.2,
	depart_speed_x_max:		.01,
	depart_speed_y_max:		1.0,
	description:			'', 
	desired_f_dist:			.1,
	desired_t_dist:			.05,
	engage_distance:		0,
	engage_distance_max:	0,
	engage_height_min:		0.3,
	engage_height_max:		0.95,
	engage_range:			0,
	follow_chance:			0,
	follow_targets: 		[], 
	friction:				.995,
	height:					.75,
	height_tol:				.5,
	id: 					lgg.ENEMY_TYPE__GOLFBALL,
	joinup_chance:			0,
	linger_max:				0,
	linger_min:				0,
	player_collision:		true,
	probability:			.1,
	radius:					.04,
	radius_max:				.05,
	recharge_amount:		.333,
	recharge_freq:			1000,
	shield:					0,
	shield_recharge:		0,
	spawn_max:				30000,
	spawn_min:				60000,
	speed:					.00000032,
	speed_max:				.00000064,
	speed_max_friction:		.995,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				1,
	title:					'Golf Ball',
	turn_speed:				0,
	unfollow_chance:		0,
	weight:					.125,

	attacks:
	[
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 500 ? (1 - (lgg.now - e.last_hit) / 500) : 0;
		var r2 = e.radius*2;
		var hfade = 1 - e.health;

		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_golfball, e.pos_x, e.pos_y, r2, r2, e.heading,
			0, 1, .85 + (fade/1.5), 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);

		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_golfball2, e.pos_x, e.pos_y, r2, r2, e.heading,
			0, 0, .85 + (fade/1.5), hfade,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},

	explode:			function(e)
	{
		if (e.radius >= .015)
		{
			var count = 1 + µ.rand_int(1) + Math.round(µ.rand(100 * e.radius));
			for (var i = 0; i < count; i++)
			{
				var spawned_id = lgg.enemies.spawn_enemy(lgg.etypes[lgg.ENEMY_TYPE__GOLFBALL], e.pos_x, e.pos_y, -1);
				if (spawned_id > -1)
				{
					lgg.enemies.e[spawned_id].radius = e.radius / (1.5 + µ.rand(1.5));

					var angle = µ.rand(360);
					var speed = .00025 + µ.rand(.0005);
					lgg.enemies.e[spawned_id].speed_x = µ.angle_to_x(angle) * speed;
					lgg.enemies.e[spawned_id].speed_y = µ.angle_to_y(angle) * speed;

				}
			}
		}
	},

	spawn:			function(e)
	{
		e.target_pos_x = µ.rand(lgg.level.size_x);
		var speed = .0000125 + µ.rand(.0000375);
		e.target_pos_y = - e.radius;
		var angle = µ.vector2D_to_angle(e.target_pos_x - e.pos_x, e.target_pos_y - e.pos_y);
		e.speed_x = µ.angle_to_x(angle) * speed;
		e.speed_y = µ.angle_to_y(angle) * speed;
	},
};