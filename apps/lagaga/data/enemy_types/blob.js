lgg.etypes[lgg.ENEMY_TYPE__BLOB] =
{
	armour:					.3,
	avoid_player_dist_min:	0.02,
	avoid_player_dist_max:	0.05,
	batch_max:				7,
	batch_min:				3,
	brake_deceleration:		0.00000020,
	brake_friction:			0.9995,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.000002,
	collision_flags:		lgg.COLLISION_FLAG__ENEMIES | lgg.COLLISION_FLAG__PLAYER,
	danger:					1.5,
	depart_speed_x_min:		.1,
	depart_speed_y_min:		.2,
	depart_speed_x_max:		.1,
	depart_speed_y_max:		.2,
	description:			'Popcorn', 
	desired_f_dist:			0.025,
	desired_t_dist:			0.1,
	engage_distance: 		0.05,
	engage_distance_max:	0.075,
	engage_height_min:		0.3,			// do not follow the player below this height
	engage_height_max:		0.95,			// do not follow the player above this height
	engage_range:			0.5,
	follow_chance:			1.0,
	follow_targets: 		[lgg.ENEMY_TYPE__BLOB, lgg.ENEMY_TYPE__BIGBLOB], 
	friction:				0.97,
	height:					.85,
	height_tol:				.3,
	id: 					lgg.ENEMY_TYPE__BLOB,
	joinup_chance:			10.3,
	linger_max:				120000,
	linger_min:				45000,
	player_collision: 		true,
	probability:			1,
	radius:					0.02,
	radius_max:				0.02,
	recharge_amount: 		0.1,
	recharge_freq:			4000,
	shield: 				4, 
	shield_recharge: 		0,
	spawn_max:				5000,
	spawn_min:				3000,
	speed:					0.0000028,
	speed_max:				0.0005,
	speed_max_friction:		0.995,
	speed_nimble_x:			0.0000020,
	speed_nimble_y:			0.0000020,
	stage_max:				-1,
	stage_min:				1,
	title:					'Blob',
	turn_speed:				0.003,
	unfollow_chance: 		0,
	weight:					0.1,
	
	// not implemented yet
	
	follow_health_min:			0,			// stop following when health falls below this

	linger_speed:					0.0000028,	// speed used while lingering
	linger_target_interval_min:		0,			// how long to wait after reaching a target position before picking a new one
	linger_target_interval_max:		0,

	depart_speed:					0.0000056,	// speed used while departing
	depart_target_interval_min:		0,			// how long to wait after reaching a target position before picking a new one
	depart_target_interval_max:		0,
	
	spawn_min_enemies_total:			0,
	spawn_min_enemies_same_type:		0,
	spawn_min_enemies_different_type:	0,

	spawn_max_enemies_total:			-1,
	spawn_max_enemies_same_type:		-1,
	spawn_max_enemies_different_type:	-1,

	attacks:
	[
/*
	for projectiles:	
	
		friction_final
		friction_duration
		

*/
		// basic shot
		{
			health_min:			0,
			health_max:			1,
			grace_period_min:	3000,		// delay before using this weapon after spawning
			grace_period_max:	5000,
			shot_offset:		0,			// if there is more than one shot, the first and the last will originate be this far apart (horizontally for front and rear weapons, vertically for side weapons)
			speed_max:				0,			// for variation in speed
			
		
			// ^ not implemented yet

			angle:						360,
			angle_offset:				0,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,		// how often to fire per barrage;  this puts the weapon in "firing barrage" mode, tracking shots fired and when to fire the next shot - the weapon cannot be chosen again while firing a barrage, but the energy cost is up front when firing the first shot (energy_cost * barrage_shot_count), so multiple weapons can be firing barrages at the same time
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			barrage_individual_aim:		0,			// whether to aim each shot, or aim the first shot and fire subsequent shots in the same direction
			damage:						0.5,
			dist_max:					1.5,
			dist_min:					0.05,
			dumb_aim:					0,
			energy_cost:				0.2,
			freq:						7500,
			freq_var:					5000,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					15000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						0.0003,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,

			weight:						1,
			wobble_freq:				0,
			wobble_speed:				0,
		},
		// rapid fire
		{
			angle:						360,
			angle_offset:				0,
			barrage_individual_aim:		true,
			barrage_shot_count_max:		5,
			barrage_shot_count_min:		3,
			barrage_shot_delay_max:		200,
			barrage_shot_delay_min:		200,
			damage:						0.15,
			dist_max:					2.5,
			dist_min:					0.0005,
			dumb_aim:					0,
			energy_cost:				0.005,
			freq:						10000,
			freq_var:					4000,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					45000,
			probability:				1,
			shot_count:					1,
			shot_spread:				0,
			speed:						0.00035,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
                                    	
			weight:						0.2,
			wobble_freq:				0,
			wobble_speed:				0,
		},
		// triple shot
		{
			angle:						360,
			angle_offset:				0,
			barrage_individual_aim:		true,
			barrage_shot_count_max:		3,
			barrage_shot_count_min:		3,
			barrage_shot_delay_max:		280,
			barrage_shot_delay_min:		280,
			damage:						0.25,
			dist_max:					2.5,
			dist_min:					0.0005,
			dumb_aim:					0,
			energy_cost:				0.005,
			freq:						2000,
			freq_var:					500,
			friction:					1,
			homing_delay:				0,
			homing_time:				-1,
			homing_speed:				0,
			homing_turn:				0,
			lifespan:					45000,
			probability:				1,
			shot_count:					3,
			shot_spread:				3,
			speed:						0.00045,
			spread:						0,
			projectile_type:			lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:				lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:				0,
			angle_vel:					0,
			weight:						0,
			wobble_freq:				0,
			wobble_speed:				0,
		}
	],
	damage:			function(e, amount, damage_type) {
		return amount;
	},
	draw:			function(e) {
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		var hfade = 1 - e.health;
		var r2 = e.radius*2;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, r2, r2, e.heading,
			0, 0, 1.5 + 1.5 * fade, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		if (e.attacking)
		{
			var hue = 350;
		}
		else if (e.departing)
		{
			var hue = 180;
		}
		else
		{
			var hue = 120;
		}
		
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_blob_inner, e.pos_x, e.pos_y, r2, r2, e.heading,
			hue, 1, 0.7 + fade * 0.7, 1.0,
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
	},
	think_post:			function(e, time_delta) {
	}
};