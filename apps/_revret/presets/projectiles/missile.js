rvr.presets.projectiles.missile =
{
	parameters:
	{
		bounce						: false,
		bounce_agents				: false,
		deactivation_lifespan:		500,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = (0.0025 + µ.rand(0.0000075)) * speed_factor;
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;
		self.acceleration = 0.000015;
		self.friction = 1.0;
		rvr.particlesGPU.spawn(
			rvr.now,
			3,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			1.5,
			0,
			0,
			angle, 0.2,
			rvr.particles__explode_inner,
			500,		//	lifespan
			0, 1, 1, 0.5,
			10,			//	vary_angle
			0.5,		//	vary_angle_vel
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
			3,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			1.5,
			0,
			0,
			angle, 0.2,
			rvr.particles__explode,
			500,		//	lifespan
			0, 1, 1, 0.5,
			10,			//	vary_angle
			0.5,		//	vary_angle_vel
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

	},
	draw 						: function(self)
	{
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER, rvr.tex_blob,
			self.pos_x, self.pos_y,
			0.3,
			0.3,
			90,
			0, 0, 0.25, 1,
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

//*
			rvr.particlesGPU.spawn(
				rvr.now,
				2,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.25,
				0,
				0,
				0, 0.0,
				rvr.particles__explode,
				500,		//	lifespan
				0, 1, 1, 1.0,
				360,		//	vary_angle
				0.25,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.1,			//	vary_size
				0.005,		//	vary_vel_x
				0.005,		//	vary_vel_y
				400,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
//*/
			rvr.particlesGPU.spawn(
				rvr.now + 20,
				1,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				1.0,
				0,
				0,
				0, 0.0,
				rvr.particles__smoke_puff,
				1000,		//	lifespan
				0, 1, 1, 0.125,
				360,		//	vary_angle
				0.75,		//	vary_angle_vel
				0.00001,			//	vary_pos_x
				0.00001,			//	vary_pos_y
				0.25,			//	vary_size
				0.0025,		//	vary_vel_x
				0.0025,		//	vary_vel_y
				1000,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				10			//	vary_birthdate
			);

			rvr.particlesGPU.spawn(
				rvr.now + 50,
				1,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				1.5,
				0,
				0,
				0, 0.0,
				rvr.particles__smoke_puff,
				1000,		//	lifespan
				0, 1, 1, 0.125,
				360,		//	vary_angle
				1.75,		//	vary_angle_vel
				0.00001,			//	vary_pos_x
				0.00001,			//	vary_pos_y
				0.5,			//	vary_size
				0.0025,		//	vary_vel_x
				0.0025,		//	vary_vel_y
				2000,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				25			//	vary_birthdate
			);

			self.last_trail_pos_x = self.pos_x;
			self.last_trail_pos_y = self.pos_y;
		}
	},
	explode 					: function(self)
	{
		rvr.particlesGPU.spawn(
			rvr.now,
			10,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			1.5,
			0,
			0,
			0, 0.0,
			rvr.particles__explode,
			400,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			2.0,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.4,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			500,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		rvr.particlesGPU.spawn(
			rvr.now,
			10,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			1.0,
			0,
			0,
			0, 0.0,
			rvr.particles__explode_inner,
			400,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			1.0,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.2,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			500,			//	vary_lifespan
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