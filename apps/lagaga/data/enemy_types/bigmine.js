lgg.etypes[lgg.ENEMY_TYPE__BIGMINE] =
{
	armour:					.1,
	avoid_player_dist_max:	0,
	avoid_player_dist_min:	0,
	batch_max:				5,
	batch_min:				1,
	brake_deceleration:		.00000020,
	brake_friction:			.995,
	byebybe_height:			.05,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-.000005,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					1,
	depart_speed_x_max:		.25,
	depart_speed_x_min:		.1,
	depart_speed_y_max:		.02,
	depart_speed_y_min:		.01,
	description:			'', 
	desired_f_dist:			.1,
	desired_t_dist:			.075,
	engage_distance:		0,
	engage_distance_max:	0,
	engage_height_max:		.95,
	engage_height_min:		.3,
	engage_range:			0,
	follow_chance:			0,
	follow_targets: 		[], 
	friction:				.99850,
	height:					.5,
	height_tol:				.25,
	id: 					lgg.ENEMY_TYPE__BIGMINE,
	joinup_chance:			0,
	linger_max:				0,
	linger_min:				0,
	player_collision: 		false,
	probability:			1,
	radius:					.0125,
	radius_max:				.0125,
	recharge_amount:		0,
	recharge_freq:			1000000,
	shield:					10,
	shield_recharge:		.0005,
	spawn_max:				900,
	spawn_min:				50,
	speed:					.00000005,
	speed_max:				.0001,
	speed_max_friction:		.98,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				5,
	title:					'Big Mine',
	turn_speed:				0.1,
	unfollow_chance:		0,
	weight:					1,

	attacks:
	[
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 500 ? (1 - (lgg.now - e.last_hit) / 500) : 0;
		var r2 = e.radius * 2.75;
		var afade = 1;//e.ext.armed ? (0.75 + Math.sin(e.ext.armed/50) / 4) : 1;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_bigmine, e.pos_x, e.pos_y, r2, r2, e.ext.angle,
			0, 1, (1 + fade*1.5), afade,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		var offset = µ.rand(360);
		for (var i = 0; i < 3; i++)
		{
			var angle = (i * 120 + offset) % 360;

			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.4 + µ.rand(0.2), 820,	0.00015, 0.995,		0, 0, -1, 0, 0, 0, 0.30, 	-0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.4 + µ.rand(0.2), 950, 	0.00015, 0.995,		0, 0, -1, 0, 0, 0, 0.25, 	-0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.4 + µ.rand(0.2), 1140,	0.00015, 0.995,		0, 0, -1, 0, 0, 0, 0.20, 	-0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.4 + µ.rand(0.2), 1450, 	0.00015, 0.995,		0, 0, -1, 0, 0, 0, 0.15, 	-0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.6 + µ.rand(0.3), 820, 	0.00045, 0.995,		0, 0, -1, 0, 0, 0, -0.30,	0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.6 + µ.rand(0.3), 950, 	0.00045, 0.995,		0, 0, -1, 0, 0, 0, -0.25,	0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.6 + µ.rand(0.3), 1140, 	0.00045, 0.995,		0, 0, -1, 0, 0, 0, -0.20,	0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle, 		true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.6 + µ.rand(0.3), 1450, 	0.00045, 0.995,		0, 0, -1, 0, 0, 0, -0.15,	0.0000025);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle + 80, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.8 + µ.rand(0.4), 1450, 	0.00012, 0.9975,	0, 0, -1, 0, 0, 0, -0.25,	0.00000085);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle + 80, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.8 + µ.rand(0.4), 1450, 	0.00012, 0.9975,	0, 0, -1, 0, 0, 0, -0.20,	0.00000085);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle + 80, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.8 + µ.rand(0.4), 1450, 	0.00012, 0.9975,	0, 0, -1, 0, 0, 0, -0.15,	0.00000085);
			lgg.projectiles.spawn(e.pos_x, e.pos_y, angle + 80, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.8 + µ.rand(0.4), 1450, 	0.00012, 0.9975,	0, 0, -1, 0, 0, 0, -0.10,	0.00000085);

		}
	},
	spawn:			function(e) {
		e.ext = {
			armed:		0,
			angle:		µ.rand(360),
			angle_vel:	- 0.03 + µ.rand(0.06)
		};
		e.target_pos_x = µ.rand(lgg.level.size_x);
		var speed = 0.0000125 + µ.rand(0.0000125);
		e.target_pos_y = - e.radius * 1;
		var angle = µ.vector2D_to_angle(e.target_pos_x - e.pos_x, e.target_pos_y - e.pos_y);
		e.speed_x = µ.angle_to_x(angle) * speed;
		e.speed_y = µ.angle_to_y(angle) * speed;
	},
	think_pre:			function(e, time_delta)
	{
		e.ext.angle += e.ext.angle_vel * time_delta;
	},
	think_post:			function(e, time_delta) {
		if (!e.ext.armed && e.dist_from_player < .2)
		{
			e.ext.armed = 500;
		}
		if (e.ext.armed)
		{
			e.radius += 0.00001 * time_delta;
			e.ext.angle_vel *= Math.pow(1.01, time_delta);
			e.ext.armed -= time_delta;
			if (e.ext.armed <= 0)
			{
				e.explode();
			}
		}
	},
};
