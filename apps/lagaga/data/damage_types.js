lgg.damage_types = [];

var inc = 0;

lgg.damage_types[lgg.DAMAGE_TYPE__COLLISION = inc++] =
{
	damage_factor_armor:		1,
	damage_factor_shield:		0,
	impact:			function(damage_amount, player_index, enemy_index, projectile_index, impact_pos_x, impact_pos_y)
	{
		if (player_index != -1)
		{
			var entity = lgg.player;
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__PLAYER_DAMAGE_FACTOR];
		}
		else
		{
			var entity = lgg.enemies.e[enemy_index];
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__ENEMY_DAMAGE_FACTOR];
		}
		if (damage_amount == 0)
		{
			return;
		}

		damage_amount *= entity.armour;
		entity.health -= damage_amount;
		entity.last_hit = lgg.now;
		if (enemy_index != -1)
		{
			if (entity.etype.get_hit)
			{
				entity.etype.get_hit(entity, damage_amount, damage_type, damage_pos_x, damage_pos_y);
			}
		}
		if (entity.health < 0)
		{
			entity.explode(true);
		}

		lgg.particlesGPU.spawn(
			lgg.now,
			3,
			impact_pos_x,
			impact_pos_y,
			impact_pos_x,
			impact_pos_y,
			0.05,
			0,
			0,
			0, 0.0,
			lgg.particles__repel,
			400,
			0,1,1,1,
			360,					//	vary_angle
			0.125,					//	vary_angle_vel
			entity.radius * 0.6,	//	vary_pos_x
			entity.radius * 0.6,	//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			200,					//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);
	},
};


lgg.damage_types[lgg.DAMAGE_TYPE__PLASMA = inc++] =
{
	damage_factor_armor:		0.75,
	damage_factor_shield:		1.5,
	impact:			function(damage_amount, player_index, enemy_index, projectile_index, impact_pos_x, impact_pos_y)
	{
		if (player_index != -1)
		{
			var entity = lgg.player;
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__PLAYER_DAMAGE_FACTOR];
		}
		else
		{
			var entity = lgg.enemies.e[enemy_index];
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__ENEMY_DAMAGE_FACTOR];
		}

		if (damage_amount == 0)
		{
			return;
		}


		var total_damage = damage_amount;
		
		var hull_damage = 0;

		if (damage_amount < entity.shield)
		{
			entity.shield -= damage_amount;
			entity.last_shield_hit = lgg.now;
			entity.shields_hit(damage_amount);
		}
		else
		{
			damage_amount -= entity.shield;
			
			if (entity.shield > 0)
			{
				entity.shields_hit(damage_amount);
				entity.shield = 0;
			}

			hull_damage = damage_amount;			// size of "collision puffs" doesn't take armour into account
			damage_amount *= entity.armour;
			entity.health -= damage_amount;
			entity.last_hit = lgg.now;
			if (enemy_index != -1)
			{
				if (!entity.shields_are_gone && entity.etype.shield)
				{
					entity.last_shield_hit = lgg.now;
					entity.shields_are_gone = true;
					entity.shields_gone();
				}
				if (entity.etype.get_hit)
				{
					entity.etype.get_hit(entity, damage_amount, lgg.DAMAGE_TYPE__PLASMA, impact_pos_x, impact_pos_y);
				}
			}
			if (entity.health < 0)
			{
				entity.explode(true);
			}
		}
		var projectile = lgg.projectiles.p[projectile_index];

		lgg.particlesGPU.spawn(
			lgg.now,
			10,
			impact_pos_x,
			impact_pos_y,
			impact_pos_x,
			impact_pos_y,
			total_damage * 0.045,
			0,
			0,
			0, 0.0,
			lgg.particles__plasma_explode,
			600,
			projectile.hue, 1, 1, 1,
			360,					//	vary_angle
			0.02 * total_damage,	//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			100,					//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);

		lgg.particlesGPU.spawn(
			lgg.now,
			10,
			impact_pos_x,
			impact_pos_y,
			impact_pos_x,
			impact_pos_y,
			total_damage * 0.045,
			0,
			0,
			0, 0.0,
			lgg.particles__plasma_explode2,
			600,
			projectile.hue2, 1, 1, 1,
			360,					//	vary_angle
			0.02 * total_damage,	//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			100,					//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);


		if (hull_damage > 0)
		{
			lgg.particlesGPU.spawn(
				lgg.now + 0,
				15,
				impact_pos_x,
				impact_pos_y,
				impact_pos_x,
				impact_pos_y,
				hull_damage * 0.01,
				0,
				0,
				0, 0.0,
				lgg.particles__smoke,
				800,
				0, 1, 1, 1,
				360,					//	vary_angle
				0.04 * hull_damage,		//	vary_angle_vel
				0,						//	vary_pos_x
				0,						//	vary_pos_y
				0,						//	vary_size
				0,						//	vary_vel_x
				0,						//	vary_vel_y
				500,					//	vary_lifespan
				0,						//	vary_color_hue
				0,						//	vary_color_sat
				0,						//	vary_color_lum
				0						//	vary_color_a
			);
		}
	},
};




lgg.damage_types[lgg.DAMAGE_TYPE__ELECTRICITY = inc++] =
{
	damage_factor_armor:		0.75,
	damage_factor_shield:		1.5,
	impact:			function(damage_amount, player_index, enemy_index, projectile_index, impact_pos_x, impact_pos_y)
	{
		if (player_index != -1)
		{
			var entity = lgg.player;
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__PLAYER_DAMAGE_FACTOR];
		}
		else
		{
			var entity = lgg.enemies.e[enemy_index];
			damage_amount *= lgg.options_debug_values[lgg.DEBUG_OPTION__ENEMY_DAMAGE_FACTOR];
		}
		
		if (damage_amount == 0)
		{
			return;
		}

		var total_damage = damage_amount;
		
		var hull_damage = 0;

		if (damage_amount < entity.shield)
		{
			entity.shield -= damage_amount;
			entity.last_shield_hit = lgg.now;
			entity.shields_hit(damage_amount);
		}
		else
		{
			damage_amount -= entity.shield;
			
			if (entity.shield > 0)
			{
				entity.shields_hit(damage_amount);
				entity.shield = 0;
			}

			hull_damage = damage_amount;			// size of "collision puffs" doesn't take armour into account
			damage_amount *= entity.armour;
			entity.health -= damage_amount;
			entity.last_hit = lgg.now;
			if (enemy_index != -1)
			{
				if (!entity.shields_are_gone && entity.etype.shield)
				{
					entity.last_shield_hit = lgg.now;
					entity.shields_are_gone = true;
					entity.shields_gone();
				}
				if (entity.etype.get_hit)
				{
					entity.etype.get_hit(entity, damage_amount, lgg.DAMAGE_TYPE__ELECTRICITY, impact_pos_x, impact_pos_y);
				}
			}
			if (entity.health < 0)
			{
				entity.explode(true);
			}
		}
		var projectile = lgg.projectiles.p[projectile_index];
			

		lgg.particlesGPU.spawn(
			lgg.now,
			1,
			impact_pos_x,
			impact_pos_y,
			impact_pos_x,
			impact_pos_y,
			entity.radius * 8,
			0,
			0,
			0, 0.0,
			lgg.particles__plasma_explode,
			180,
			projectile.hue, 1, 1, .1,
			360,					//	vary_angle
			0.02 * total_damage,	//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			30,					//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);

		lgg.particlesGPU.spawn(
			lgg.now,
			1,
			impact_pos_x,
			impact_pos_y,
			impact_pos_x,
			impact_pos_y,
			entity.radius * 8,
			0,
			0,
			0, 0.0,
			lgg.particles__plasma_explode2,
			180,
			projectile.hue2, 1, 1, .1,
			360,					//	vary_angle
			0.02 * total_damage,	//	vary_angle_vel
			0,						//	vary_pos_x
			0,						//	vary_pos_y
			0,						//	vary_size
			0,						//	vary_vel_x
			0,						//	vary_vel_y
			30,					//	vary_lifespan
			0,						//	vary_color_hue
			0,						//	vary_color_sat
			0,						//	vary_color_lum
			0						//	vary_color_a
		);

		if (hull_damage > 0)
		{
			lgg.particlesGPU.spawn(
				lgg.now + 0,
				1,
				impact_pos_x,
				impact_pos_y,
				impact_pos_x,
				impact_pos_y,
				entity.radius * 2,
				0,
				0,
				0, 0.0,
				lgg.particles__smoke,
				100,
				0, 1, 1, .1,
				360,					//	vary_angle
				0.04 * hull_damage,		//	vary_angle_vel
				0,						//	vary_pos_x
				0,						//	vary_pos_y
				0,						//	vary_size
				0,						//	vary_vel_x
				0,						//	vary_vel_y
				500,					//	vary_lifespan
				0,						//	vary_color_hue
				0,						//	vary_color_sat
				0,						//	vary_color_lum
				0						//	vary_color_a
			);
		}
	},
};

lgg.damage_types[lgg.DAMAGE_TYPE__ENERGY_DRAIN = inc++] =
{
	damage_factor_armor:		1,
	damage_factor_shield:		1,
	impact:			function(damage_amount, player_index, enemy_index, projectile_index, impact_pos_x, impact_pos_y)
	{
		console.log('damage impact');
	},
};