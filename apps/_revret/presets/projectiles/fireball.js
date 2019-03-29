rvr.presets.projectiles.fireball =
{
	parameters:
	{
		deactivation_lifespan:		500,
		bounce:						false,
		bounce_agents:				false,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = (0.0075) * speed_factor;
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;

		rvr.particlesGPU.spawn(
			rvr.now,
			5,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			1.25,
			0,
			0,
			angle, 0.1,
			rvr.particles__fire,
			500,		//	lifespan
			0, 1, 1, 0.35,
			90,			//	vary_angle
			0.125,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.3,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			450,		//	vary_lifespan
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
			1.25,
			0,
			0,
			angle, 0.1,
			rvr.particles__explode,
			500,		//	lifespan
			0, 1, 1, 0.35,
			90,			//	vary_angle
			0.125,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.3,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			450,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

	},
	draw 						: function(self)
	{
			rvr.lights.add(
				self.pos_x,
				self.pos_y,
				0.2,
				4.6,
				4.6,
				0.5,
				1.0, 0.85, 0.3, 1.0,
				27,
				180
				);
	},
	think_pre 					: function(self, time_delta)
	{
	},
	think_post 					: function(self, time_delta)
	{
		var frac = (self.age / self.lifespan);

		if (µ.rand_int(5) == 0)
		{
			rvr.particlesGPU.spawn(
				rvr.now + 10,
				3,
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
				0, 1, 1, 0.6,
				360,		//	vary_angle
				0.25,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.25,		//	vary_size
				0.025,		//	vary_vel_x
				0.025,		//	vary_vel_y
				100,		//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				5			//	vary_birthdate
			);
//*
		}
		if (µ.rand_int(3) == 0)
		{
//*/
			rvr.particlesGPU_below.spawn(
				rvr.now + 20,
				2,
				self.pos_x,
				self.pos_y,
				self.pos_x,
				self.pos_y,
				0.25,
				0,
				0,
				0, 0.0,
				rvr.particles__explode,
				500,		//	lifespan
				0, 0, 0.1, 0.6,
				360,		//	vary_angle
				0.25,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.125,		//	vary_size
				0.025,		//	vary_vel_x
				0.025,		//	vary_vel_y
				200,		//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				10			//	vary_birthdate
			);
		}

		if (rvr.now - self.last_trail >= 5)
		{
			self.last_trail = rvr.now;	
			rvr.particlesGPU.spawn(
				rvr.now,
				3,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.5,
				0,
				0,
				0, 0.0,
				rvr.particles__fire,
				300,		//	lifespan
				0, 1, 1, 0.6,
				360,		//	vary_angle
				0.125,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.05,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				150,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			rvr.particlesGPU.spawn(
				rvr.now,
				3,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.4,
				0,
				0,
				0, 0.0,
				rvr.particles__fire,
				400,		//	lifespan
				0, 1, 1, 0.55,
				360,		//	vary_angle
				0.125,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.05,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				250,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0			//	vary_color_a
			);
			rvr.particlesGPU.spawn(
				rvr.now,
				3,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.3,
				0,
				0,
				0, 0.0,
				rvr.particles__fire,
				500,		//	lifespan
				0, 1, 1, 0.5,
				360,		//	vary_angle
				0.125,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.1,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				350,			//	vary_lifespan
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
		var frac = (self.age / self.lifespan);
		rvr.particlesGPU.spawn(
			rvr.now + 20,
			3,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			1.0,
			0,
			0,
			0, 0.0,
			rvr.particles__explode,
			1000,		//	lifespan
			0, 1, 1, 0.25,
			360,		//	vary_angle
			1.5,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.5,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			400,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		rvr.particlesGPU.spawn(
			rvr.now + 100,
			7,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.5,
			0,
			0,
			0, 0.0,
			rvr.particles__firepuff,
			800,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			1.0,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.25,		//	vary_size
			0.1,		//	vary_vel_x
			0.1,		//	vary_vel_y
			300,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0,			//	vary_color_a
			50			//	vary_birthdate
		);

		rvr.particlesGPU.spawn(
			rvr.now + 150,
			3,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.5,
			0,
			0,
			0, 0.0,
			rvr.particles__fire,
			1500,		//	lifespan
			0, 1, 1.0, 1.0,
			360,		//	vary_angle
			0.5,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.25,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			1000,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0,			//	vary_color_a
			100			//	vary_birthdate
		);

	},
	collide 					: function(self, other_agent, other_projectile)
	{
	},
};