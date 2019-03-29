lgg.etypes[lgg.ENEMY_TYPE__PATROL] =
{
	armour:					.23,
	avoid_player_dist_max:	0.15,
	avoid_player_dist_min:	0.1,
	batch_max:				4,
	batch_min:				1,
	brake_deceleration:		0.00000090,
	brake_friction:			0.995,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.00001,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					5,
	depart_speed_x_max:		.95,
	depart_speed_x_min:		.35,
	depart_speed_y_max:		.017,
	depart_speed_y_min:		.032,
	description:			'Mostly harmless.', 
	desired_f_dist:			0.035,
	desired_t_dist:			0.05,
	engage_distance: 		0.15,
	engage_distance_max:	0.25,
	engage_height_max:		0.95,
	engage_height_min:		0.3,
	engage_range:			0.5,
	follow_chance:			0,
	follow_targets: 		['patrol'], 
	friction:				0.97,
	height:					.85,
	height_tol:				.1,
	id: 					lgg.ENEMY_TYPE__PATROL,
	joinup_chance:			0,
	linger_max:				60000,
	linger_min:				30000,
	player_collision: 		true,
	probability:			1,
	radius:					0.02,
	radius_max:				0.02,
	recharge_amount: 		0.5,
	recharge_freq:			3000,
	shield: 				3, 
	shield_recharge: 		0.005,
	spawn_max:				30000,
	spawn_min:				60000,
	speed:					0.00000150,
	speed_max:				0.0005,
	speed_max_friction:		0.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				3,
	title:					'Patrol',
	turn_speed:				0.0035,
	unfollow_chance: 		0,
	weight:					1,

	attacks:
	[
		// close range
		{
			angle:					360,
			angle_offset:			0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:					0.25,
			dist_max:				0.85,
			dist_min:				0.1,
			dumb_aim:				0,
			energy_cost:			0.1,
			freq:					3000,
			freq_var:				1500,
			friction:				1,
			homing_delay:			0,
			homing_time:			-1,
			homing_speed:			0,
			homing_turn:			0,
			lifespan:				15000,
			probability:			1,
			shot_count:				1,
			shot_spread:			0,
			speed:					0.0002,
			spread:					0,
			projectile_type:		lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:			lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:			0,
			angle_vel:				0,
			weight:					2,
			wobble_freq:			0,
			wobble_speed:			0,
		},
		// long range
		{
			angle:					360,
			angle_offset:			0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:					0.25,
			dist_max:				3.5,
			dist_min:				0.5,
			dumb_aim:				0,
			energy_cost:			0.3,
			freq:					10000,
			freq_var:				5000,
			friction:				1,
			homing_delay:			0,
			homing_time:			-1,
			homing_speed:			0,
			homing_turn:			0,
			lifespan:				15000,
			probability:			0.05,
			shot_count:				5,
			shot_spread:			20,
			speed:					0.0003,
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
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;
		lgg.c.rectangle_textured.draw(
			lgg.CAM_PLAYER, lgg.tex__enemies__patrol,
			e.pos_x,
			e.pos_y,
			e.radius*2,
			e.radius*2,
			e.heading,
			0, 1, 1, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		lgg.c.rectangle_textured.draw(
			lgg.CAM_PLAYER, lgg.tex__enemies__patrol_light,
			e.pos_x,
			e.pos_y,
			e.radius*2,
			e.radius*2,
			e.heading,
			(e.attacking ? 130 : 60), 2, 1.5, 0.5 + Math.sin(e.age / (30 + 250 * e.health * e.health)) * 0.5,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
		for (var i = 0; i < 5; i++)
		{
			var angle = e.heading + i * 72;
			lgg.projectiles.spawn(
				e.pos_x + µ.angle_to_x(angle) * e.radius,
				e.pos_y + µ.angle_to_y(angle) * e.radius,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
				1500, -0.000125, .9995,
				0, 0, -1, 0,
				0, 0, -.25, 0.0000005);
			lgg.projectiles.spawn(
				e.pos_x + µ.angle_to_x(angle) * e.radius,
				e.pos_y + µ.angle_to_y(angle) * e.radius,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.5,
				1500, -0.000125, .9995,
				0,0,-1,0,
				0, 0, .25,0.0000005);
			lgg.projectiles.spawn(
				e.pos_x + µ.angle_to_x(angle) * e.radius,
				e.pos_y + µ.angle_to_y(angle) * e.radius,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.75,
				1500, -0.000125, .9995,
				0, 0, -1, 0,
				0, 0, 0.2, 0.00000025);
		}
	},
	spawn:			function(e) {
		e.ext = {
			last_rage_shot:	0,
		};
	},
	think_post:			function(e, time_delta) {
		if (e.health < 0.8)
		{
			var hfade = e.health / 0.8;
			var hfade2 = 1-hfade;
			if (lgg.now - e.ext.last_rage_shot > (50 + 450 * hfade))
			{
				var angle = e.heading - 180 - 135 + µ.rand(270);
				//lgg.projectiles.spawn(e.pos_x + µ.angle_to_x(angle) * e.radius, e.pos_y + µ.angle_to_y(angle) * e.radius, angle, true, 0, 150, 0.000125, 0.25 + 0.25 * hfade2, 1, -40 + 160 * hfade2, 0,0,-1,0,1,0,0);
				e.ext.last_rage_shot = lgg.now;
			}
		}
	},
};