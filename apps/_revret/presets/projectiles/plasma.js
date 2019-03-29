rvr.presets.projectiles.plasma =
{
	parameters:
	{
		bounce						: true,
		bounce_agents				: false,
		deactivation_lifespan		: 500,
		damage_type					: rvr.DAMAGE_TYPE__PLASMA,
	},
	spawn 						: function(self, pos_x, pos_y, pos_z, speed_factor, angle, angle_x, angle_y, faction_id, source_agent, target_agent, target_pos_x, target_pos_y)
	{
		var projectile_speed 		= 0.010 * speed_factor;
		self.speed_x 				= rvr_agents__speed_x[source_agent.index] + angle_x * projectile_speed;
		self.speed_y 				= rvr_agents__speed_y[source_agent.index] + angle_y * projectile_speed;
		self.homing_acceleration 	= 0.000000;
		self.acceleration 			= 0.000000;
		self.friction 				= 1.0;
/*
		var dir = µ.rand(1);
		dir *= dir * dir;
		if (µ.rand_int(1))
		{
			dir *= -1;
		}
*/		
		var dir = 0;
		self.turn_speed				= 0.0025 * dir;
		self.turn_acceleration		= 0.000125 * dir;
		rvr.particlesGPU.spawn(
			rvr.now,
			2,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			0.7,
			0,
			0,
			angle, 0.35,
			rvr.particles__plasma,
			1500,			//	lifespan
			220, 1, 0.75, 0.25,
			360,			//	vary_angle
			1.5,			//	vary_angle_vel
			0,				//	vary_pos_x
			0,				//	vary_pos_y
			0.1,			//	vary_size
			0,				//	vary_vel_x
			0,				//	vary_vel_y
			500,			//	vary_lifespan
			0,				//	vary_color_hue
			0,				//	vary_color_sat
			0,				//	vary_color_lum
			0				//	vary_color_a
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
		var particle_count = Math.round((rvr.now - self.last_trail) / 3);


		//console.log(self, rvr.now - self.last_trail, particle_count);

		if (particle_count > 0)
		{
			//self.last_trail = rvr.now;
			self.last_trail += particle_count * 5;
			rvr.particlesGPU.spawn(
				rvr.now,
				particle_count,
				self.pos_x,
				self.pos_y,
				self.last_trail_pos_x,
				self.last_trail_pos_y,
				0.3,
				0,
				0,
				0, 0.0,
				rvr.particles__plasma,
				400,		//	lifespan
				220, 1, 0.75, 0.55,
				360,		//	vary_angle
				0.0125,		//	vary_angle_vel
				0.01,			//	vary_pos_x
				0.01,			//	vary_pos_y
				0.1,			//	vary_size
				0.005,		//	vary_vel_x
				0.005,		//	vary_vel_y
				50,			//	vary_lifespan
				10,			//	vary_color_hue
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
			1.0,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma_explode,
			800,		//	lifespan
			220, 1, 1, 0.5,
			360,		//	vary_angle
			0.325,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.8,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			100,			//	vary_lifespan
			10,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		rvr.particlesGPU.spawn(
			rvr.now,
			1,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			0.5,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma_explode,
			1200,		//	lifespan
			220, 1, 1, 0.5,
			360,		//	vary_angle
			0.325,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.6,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			200,			//	vary_lifespan
			10,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
	},
	collide 					: function(self, other_agent, other_projectile)
	{
	},
};