lgg.etypes[lgg.ENEMY_TYPE__SAUCER] =
{
	armour:					.25,
	avoid_player_dist_max:	0.15,
	avoid_player_dist_min:	0.1,
	batch_max:				1,
	batch_min:				3,
	brake_deceleration:		0.00000090,
	brake_friction:			0.995,
	byebybe_height:			.15,
	byebybe_speed_x:		0,
	byebybe_speed_y:		-0.00001,
	collision_flags:		lgg.COLLISION_FLAG__PLAYER,
	danger:					5,
	depart_speed_x_max:		1,
	depart_speed_x_min:		1,
	depart_speed_y_max:		.1,
	depart_speed_y_min:		.1,
	description:			'', 
	desired_f_dist: 		0.25,
	desired_t_dist:			0.05,
	engage_distance: 		0,
	engage_distance_max:	0,
	engage_height_max:		0.95,
	engage_height_min:		0.3,
	engage_range:			0,
	follow_chance:			1.0,
	follow_targets: 		[lgg.ENEMY_TYPE__SAUCER],
	friction:				0.995,
	height:					.75,
	height_tol:				.5,
	id: 					lgg.ENEMY_TYPE__SAUCER,
	joinup_chance:			0.25,
	linger_max:				90000,
	linger_min:				30000,
	player_collision: 		true,
	probability:			1,
	radius:					0.02,
	radius_max:				0.02,
	recharge_amount: 		0.025,
	recharge_freq:			2500,
	shield:					0.5,
	shield_recharge: 		0,
	spawn_max:				5000,
	spawn_min:				3000,
	speed:					0.00000120,
	speed_max:				0.00025,
	speed_max_friction:		0.95,
	speed_nimble_x:			0,
	speed_nimble_y:			0,
	stage_max:				-1,
	stage_min:				4,
	title:					'Saucer',
	turn_speed:				0,
	unfollow_chance: 		.001,
	weight:					1,

	attacks:
	[
		{
			angle:			360,
			angle_offset:	0,
			barrage_individual_aim:		false,
			barrage_shot_count_max:		1,
			barrage_shot_count_min:		1,
			barrage_shot_delay_max:		0,
			barrage_shot_delay_min:		0,
			damage:			0.33,
			dist_max:		2,
			dist_min:		0.05,
			dumb_aim:		0,
			energy_cost:	0.25,
			freq:			5000,
			freq_var:		2500,
			friction:		1,
			homing_delay:	0,
			homing_time:	-1,
			homing_speed:	0,
			homing_turn:	0,
			lifespan:		15000,
			probability:	0.01,
			shot_count:		1,
			shot_spread:	0,
			speed:			0.00040,
			spread:			6,projectile_type:		lgg.PROJECTILE_TYPE__PLASMA,
			damage_type:			lgg.DAMAGE_TYPE__PLASMA,
			angle_accel:			0,
			angle_vel:				0,
			weight:			1,
			wobble_freq:	0,
			wobble_speed:	0,
		},
	],
	damage:			function(e, amount, damage_type) {
		
		e.speed = e.etype.speed * (0.2 + 0.8 * e.health);
		return amount;
	},
	draw:			function(e) {
		var r2 = e.radius*3.5;
		var hfade = 1 - e.health;
		var fade = lgg.now - e.last_hit < 750 ? (1 - (lgg.now - e.last_hit) / 750) : 0;
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER, lgg.tex_saucer, e.pos_x, e.pos_y, r2, r2, 90,
			0-hfade*60, 1, 1 + fade/4, 1,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
	},
	explode:			function(e) {
	},
	think_post:			function(e, time_delta) {
		
		if (e.health < 0.75 && µ.rand(0.75) > e.health)
		{
			lgg.particlesGPU.spawn(
				lgg.now,
				2,
				e.pos_x,
				e.pos_y,
				e.pos_x,
				e.pos_y,
				0.03,
				0,
				0,
				0, 0.0,
				lgg.particles__smoke,
				400 + (0.75 - e.health) * 800,
				0,1,1,1,
				360,								//	vary_angle
				0.05,								//	vary_angle_vel
				this.radius*1.5,					//	vary_pos_x
				this.radius*1.5,					//	vary_pos_y
				0,									//	vary_size
				0,									//	vary_vel_x
				0,									//	vary_vel_y
				300 + (0.75 - e.health) * 600,		//	vary_lifespan
				0,									//	vary_color_hue
				0,									//	vary_color_sat
				0,									//	vary_color_lum
				0									//	vary_color_a
			);
		}
		
		// recharges faster when directly above player
		if (e.pos_y > lgg.player.pos_y &&  Math.abs(e.pos_x - lgg.player.pos_x) < 0.05)
		{
			e.energy += 0.001 * time_delta;
			if (e.energy > 1)
				e.energy = 1;
		}
	},
};