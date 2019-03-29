lgg.etypes[lgg.ENEMY_TYPE__HECKLER] =
{
	armour:					.3,
	avoid_player_dist_min:	0,
	avoid_player_dist_max:	0,
	batch_max:				5,
	batch_min:				2,
	brake_deceleration:		0.00000490,
	brake_friction:			0.95,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.00001,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					2.5,
	depart_speed_x_min:		1,
	depart_speed_y_min:		.2,
	depart_speed_x_max:		1,
	depart_speed_y_max:		.2,
	description:			'', 
	desired_f_dist:			0,
	desired_t_dist:			0.085,
	engage_distance:		0.25,
	engage_distance_max:	0.3,
	engage_height_min:		0.3,
	engage_height_max:		0.95,
	engage_range:			0.75,
	follow_chance:			0,
	follow_targets: 		[], 
	friction:				0.998,
	height:					.75,
	height_tol:				.5,
	id: 					lgg.ENEMY_TYPE__HECKLER,
	joinup_chance:			0,
	linger_max:				30000,
	linger_min:				10000,
	player_collision:		true,
	probability:			1,
	radius:					0.020,
	radius_max:				0.025,
	recharge_amount:		0.5,
	recharge_freq:			5000,
	shield: 				0,
	shield_recharge:		0,
	spawn_max:				5000,
	spawn_min:				3000,
	speed:					0.00000132,
	speed_max:				0.00005,
	speed_max_friction:		0.995,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				3,
	title:					'Heckler',
	turn_speed:				0.0125,
	unfollow_chance:		0,
	weight:					0.5,

	attacks:
	[
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;
		if (e.attacking)
			var hue = 40-120*hfade;
		else
			var hue = 200;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_eye2, e.pos_x, e.pos_y, r2, r2, e.heading,
			hue, (0.75+fade*.5), 0.5 + fade / 1.5, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		for (var i = 0; i < 5; i++)
		{
			var angle = i * 72;
			lgg.projectiles.spawn(e.pos_x, e.pos_y,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.15 + µ.rand(0.25),
				2000, 0.00005 + 0.0000015 * i, .999,
				0.03, 0.0000010, 500, 500,
				0, 0, 0, 0);
		}
		for (var i = 0; i < 5; i++)
		{
			var angle = i * 72;
			lgg.projectiles.spawn(e.pos_x, e.pos_y,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
				1000, 0.00004, 1,
				0, 0, -1, 0,
				0, 0, 0, 0.00000020);
		}
	},
};

