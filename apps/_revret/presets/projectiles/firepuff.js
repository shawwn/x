rvr.presets.projectiles.firepuff =
{
	parameters:
	{
		deactivation_lifespan:		500,
		bounce:						true,
		bounce_factor_min:			0.025,
		bounce_factor_max:			0.3,
		bounce_agents:				false,
		damage_impact_burn:			1,
		damage_impact_physical:		0,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed = (0.005 + µ.rand(0.00)) * speed_factor;
		self.speed_x = angle_x * projectile_speed;
		self.speed_y = angle_y * projectile_speed;
/*
		rvr.particlesGPU.spawn(
			rvr.now,
			2,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			0.25,
			0,
			0,
			angle, 0.1,
			rvr.particles__firepuff,
			500,		//	lifespan
			0, 1, 1, 0.35,
			90,			//	vary_angle
			0.5,		//	vary_angle_vel
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
			2,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			0.25,
			0,
			0,
			angle, 0.1,
			rvr.particles__firepuff,
			500,		//	lifespan
			0, 1, 1, 0.35,
			90,			//	vary_angle
			0.5,		//	vary_angle_vel
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
*/
	},
	draw 						: function(self)
	{

			rvr.lights.add(
				self.pos_x,
				self.pos_y,
				0.2,
				1.6,
				1.6,
				0.5,
				1.0, 0.8, 0.7, 0.5,
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

		if (µ.rand_int(7) == 0)
		{
			rvr.particlesGPU.spawn(
				rvr.now + 10,
				1,
				self.pos_x,
				self.pos_y,
				self.pos_x,
				self.pos_y,
				0.7,
				0,
				0,
				0, 0.0,
				rvr.particles__firepuff,
				400,		//	lifespan
				0, 1, 1, 0.6,
				360,		//	vary_angle
				0.75,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.25,			//	vary_size
				0.25,		//	vary_vel_x
				0.25,		//	vary_vel_y
				50,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				5			//	vary_birthdate
			);
//*
		}


		if (rvr.now - self.last_trail >= 10)
		{
			self.last_trail = rvr.now;	

			rvr.particlesGPU_below.spawn(
				rvr.now + 50,
				2,
				self.pos_x,
				self.pos_y,
				self.pos_x,
				self.pos_y,
				0.35,
				0,
				0,
				0, 0.0,
				rvr.particles__firepuff,
				200,		//	lifespan
				0, 0, 0.8, 0.1,
				360,		//	vary_angle
				0.75,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.125,			//	vary_size
				0.25,		//	vary_vel_x
				0.25,		//	vary_vel_y
				50,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0.6,			//	vary_color_lum
				0,			//	vary_color_a
				40			//	vary_birthdate
			);

			rvr.particlesGPU.spawn(
				rvr.now + 100,
				1,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.8,
				0,
				0,
				0, 0.0,
				rvr.particles__firepuff,
				200,		//	lifespan
				0, 1, 1, 0.35,
				360,		//	vary_angle
				0.5,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.05,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				50,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,		//	vary_color_a
				80			//	vary_birthdate
			);
			rvr.particlesGPU.spawn(
				rvr.now,
				1,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.7,
				0,
				0,
				0, 0.0,
				rvr.particles__firepuff,
				300,		//	lifespan
				0, 1, 1, 0.4,
				360,		//	vary_angle
				0.5,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.05,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				100,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				0			//	vary_birthdate
			);
			rvr.particlesGPU.spawn(
				rvr.now,
				1,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.6,
				0,
				0,
				0, 0.0,
				rvr.particles__explode,
				400,		//	lifespan
				0, 1, 1, 0.55,
				360,		//	vary_angle
				0.5,		//	vary_angle_vel
				0,			//	vary_pos_x
				0,			//	vary_pos_y
				0.2 - frac * 0.1,			//	vary_size
				0.125,		//	vary_vel_x
				0.125,		//	vary_vel_y
				150,			//	vary_lifespan
				0,			//	vary_color_hue
				0,			//	vary_color_sat
				0,			//	vary_color_lum
				0,			//	vary_color_a
				0			//	vary_birthdate
			);
			self.last_trail_pos_x = self.pos_x;
			self.last_trail_pos_y = self.pos_y;
		}
	},
	explode 					: function(self)
	{
		var frac = (self.age / self.lifespan);
		rvr.particlesGPU.spawn(
			rvr.now,
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
			1200,		//	lifespan
			0, 1, 1, 0.65,
			360,		//	vary_angle
			1.0,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			1.0,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			300,			//	vary_lifespan
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
			0.75,
			0,
			0,
			0, 0.0,
			rvr.particles__firepuff,
			800,		//	lifespan
			0, 1, 1, 1,
			360,		//	vary_angle
			1.5,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.25,		//	vary_size
			0.2,			//	vary_vel_x
			0.2,			//	vary_vel_y
			400,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0,			//	vary_color_a
			50			//	vary_birthdate
		);

		rvr.particlesGPU_below.spawn(
			rvr.now + 50,
			7,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.75,
			0,
			0,
			0, 0.0,
			rvr.particles__firepuff,
			1000,		//	lifespan
			0, 1, 0.75, 0.25,
			360,		//	vary_angle
			0.95,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.5,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			400,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0,			//	vary_color_a
			50			//	vary_birthdate
		);

	},
	collide 					: function(self, other_agent, other_projectile)
	{
	},
};