rvr.presets.projectiles.plasma_nade_stage1 =
{
	parameters:
	{
		deactivation_lifespan	: 500,
		bounce					: true,
		bounce_agents			: true,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = 0.0125 * speed_factor;
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;

		rvr.particlesGPU.spawn(
			rvr.now,
			5,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			1.0,
			0,
			0,
			angle, 0.35,
			rvr.particles__plasma,
			1750,		//	lifespan
			120, 1, 0.75, 0.25,
			180,			//	vary_angle
			0.1,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.1,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			250,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		rvr.particlesGPU.spawn(
			rvr.now,
			5,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			0.5,
			0,
			0,
			angle, 0.35,
			rvr.particles__plasma,
			1750,		//	lifespan
			120, 1, 0.75, 0.5,
			180,			//	vary_angle
			0.1,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.01,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			750,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

	},
	draw 						: function(self)
	{
	},
	think_pre 					: function(self, time_delta)
	{
	},
	think_post 					: function(self, time_delta)
	{
		var age_frac = (self.age / self.lifespan);
		var hue = 220 - 120 * age_frac;
		if (rvr.now - self.last_trail >= 10)
		{
			self.last_trail = rvr.now;	
			rvr.particlesGPU.spawn(
				rvr.now,
				Math.round(4 - 2 * age_frac),
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.2 + 0.4 * age_frac,
				0,
				0,
				0, 0.0,
				rvr.particles__plasma_grenade,
				2750 - 1000 * age_frac,		//	lifespan
				hue, 2, 0.95, 0.25,
				360,		//	vary_angle
				0.75 + 2 * age_frac,		//	vary_angle_vel
				0.01,			//	vary_pos_x
				0.01,			//	vary_pos_y
				0.05,			//	vary_size
				0.005,		//	vary_vel_x
				0.005,		//	vary_vel_y
				250,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			self.last_trail_pos_x = self.pos_x;
			self.last_trail_pos_y = self.pos_y;
		}
	},
	explode 					: function(self)
	{
		rvr.particlesGPU.spawn(
			rvr.now,
			1,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.75,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma_explode,
			300,		//	lifespan
			120, 1, 1, 0.125,
			360,		//	vary_angle
			0.125,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.15,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			200,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

		var bullets = 20;
		for (var i = 0; i < bullets; i++)
		{
			var offset = 360 / bullets * i;
			offset = µ.rand(360);
			rvr.projectiles.spawn(
				rvr.presets.projectiles.plasma_nade_stage2,
				self.pos_x,
				self.pos_y,
				self.pos_z,
				0.25 + µ.rand(1.75),
				0.9995,
				0,
				0,
				0,
				0,
				300 + µ.rand_int(300),
				self.facing + offset,
				self.faction_id,
				self.owner_agent,
				null,
				-1,
				-1,
				0.15);
		}

	},
	collide 					: function(self, other_agent, other_projectile)
	{
	},
};