lgg.etypes[lgg.ENEMY_TYPE__MINE] =
{
	armour:					.2,
	avoid_player_dist_max:	0,
	avoid_player_dist_min:	0,
	batch_max:				5,
	batch_min:				1,
	brake_deceleration:		0.00000090,
	brake_friction:			0.995,
	byebybe_height:			.1,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.0000085,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					1,
	depart_speed_x_max:		.5,
	depart_speed_x_min:		.05,
	depart_speed_y_max:		.03,
	depart_speed_y_min:		.01,
	description:			'', 
	desired_f_dist:			0.1,
	desired_t_dist:			0.05,
	engage_distance:		0,
	engage_distance_max:	0,
	engage_height_max:		0.95,
	engage_height_min:		0.3,
	engage_range:			0,
	follow_chance:			0,
	follow_targets: 		[],
	friction:				0.99,
	height:					.75,
	height_tol:				.5,
	id: 					lgg.ENEMY_TYPE__MINE,
	joinup_chance:			0,
	linger_max:				0,
	linger_min:				0,
	player_collision:		false,
	probability:			1,
	radius:					0.015,
	radius_max:				0.015,
	recharge_amount:		0,
	recharge_freq:			1000000,
	shield:					0,
	shield_recharge:		0,
	spawn_max:				90000,
	spawn_min:				30000,
	speed:					0.0000005,
	speed_max:				0.0005,
	speed_max_friction:		0.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				5,
	title:					'Mine',
	turn_speed:				0,
	unfollow_chance:		0,
	weight:					0.1,

	attacks:
	[
	],

	damage:			function(e, amount, damage_type) {
		// small one take full damage, big ones 1/2
		return amount / (1 + (e.radius - .02) / 0.01);
	},

	draw:			function(e)
	{
		var fade = lgg.now - e.last_hit < 500 ? (1 - (lgg.now - e.last_hit) / 500) : 0;
		var r2 = e.radius*2.6;
		var afade = (e.ext.armed % 333) / 333;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_mine,
			e.pos_x, e.pos_y, r2, r2, e.ext.angle,
			0 + afade*40, .5 + afade*.25, 1.25 + (fade/1.5), 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},

	explode:			function(e)
	{
		for (var i = 0; i < 30; i++)
		{
			var angle = µ.rand(360);
			lgg.projectiles.spawn(
				e.pos_x + µ.angle_to_x(angle) * e.radius,
				e.pos_y + µ.angle_to_y(angle) * e.radius,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.75,
				200 + µ.rand_int(3000), 0.00025 + µ.rand(0.000125), 1,
				0, 0,-1, 0,
				0, 0, 0, 0);
		}
	},

	spawn:			function(e)
	{
		e.ext = {
			armed:		0,
			angle:		µ.rand(360),
			angle_vel:	- 0.12 + µ.rand(0.24)
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

	think_post:			function(e, time_delta)
	{
		if (!e.ext.armed && e.dist_from_player < .15)
		{
			e.ext.armed = 1000;
		}
		if (e.ext.armed)
		{
			e.ext.armed -= time_delta;
			if (e.ext.armed <= 0)
			{
				e.explode();
			}
		}
	},
};