rvr.presets.projectiles.blob =
{
	parameters:
	{
		bounce						: false,
		bounce_agents				: false,
		deactivation_lifespan		: 0,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = 0.005 + µ.rand(0.0001);
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;
		self.homing_acceleration = 0.00005;
		self.friction = 0.999;
		rvr.particlesGPU.spawn(
			rvr.now,
			10,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			0.125,
			0,
			0,
			angle, 0.75,
			rvr.particles__plasma,
			200,		//	lifespan
			0, 1, 1, 1,
			20,			//	vary_angle
			0.65,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			250,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

	},
	draw 						: function(self)
	{
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_blob,
			//0.5, 0.5,
			self.pos_x, self.pos_y,
			0.1,
			0.1,
			90,
			120, 1, 1, 1,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);


	},
	think_pre 					: function(self, time_delta)
	{
	},
	think_post 					: function(self, time_delta)
	{
		if (rvr.now - self.last_trail >= 10)
		{
			self.last_trail = rvr.now;	
			rvr.particlesGPU.spawn(
				rvr.now,
				5,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.1,
				0,
				0,
				0, 0.0,
				rvr.particles__blob,
				200,		//	lifespan
				120, 1, 1, 1,
				360,		//	vary_angle
				0.05,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.02,		//	vary_size
				0.005,		//	vary_vel_x
				0.005,		//	vary_vel_y
				100,		//	vary_lifespan
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
			30,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.25,
			0,
			0,
			0, 0.0,
			rvr.particles__explode,
			400,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			1.0,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.2,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			250,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		rvr.particlesGPU.spawn(
			rvr.now,
			30,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.125,
			0,
			0,
			0, 0.0,
			rvr.particles__explode_inner,
			300,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			0.5,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.1,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			250,			//	vary_lifespan
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