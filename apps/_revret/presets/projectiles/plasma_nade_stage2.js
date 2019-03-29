rvr.presets.projectiles.plasma_nade_stage2 =
{
	parameters:
	{
		bounce						: false,
		bounce_agents				: false,
		deactivation_lifespan:		500,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = 0.0025 * speed_factor;
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;
		self.homing_acceleration = 0.00005;
		rvr.particlesGPU.spawn(
			rvr.now,
			4,
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
			110, 1, 0.75, 0.125,
			180,			//	vary_angle
			0.1,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.1,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			1250,		//	vary_lifespan
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
		if (rvr.now - self.last_trail >= 10)
		{
			self.last_trail = rvr.now;	
			rvr.particlesGPU.spawn(
				rvr.now,
				2,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.25 + 0.25 * age_frac,
				0,
				0,
				0, 0.0,
				rvr.particles__plasma,
				2000 - 1900 * age_frac,		//	lifespan
				110, 2, 0.75, .1,
				360,		//	vary_angle
				0.0125,		//	vary_angle_vel
				0.01,			//	vary_pos_x
				0.01,			//	vary_pos_y
				0.02,			//	vary_size
				0.005,		//	vary_vel_x
				0.005,		//	vary_vel_y
				100,			//	vary_lifespan
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
			5,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.75,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma,
			1500,		//	lifespan
			110, 2, 1, 0.25,
			360,		//	vary_angle
			2.75,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.25,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			1250,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
	},
	collide 					: function(self, other_agent, other_projectile)
	{
	},
};