rvr.presets.projectiles.ball_lightning =
{
	parameters:
	{
		bounce						: true,
		bounce_agents				: true,
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
			5,
			pos_x,
			pos_y,
			pos_x,
			pos_y,
			1.5,
			0,
			0,
			angle, 0.35,
			rvr.particles__plasma,
			2500,		//	lifespan
			220, 1, 0.75, 0.25,
			360,			//	vary_angle
			1.5,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.1,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			500,		//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
	},
	draw 						: function(self)
	{
/*
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			rvr.tex_circle,
			self.pos_x,
			self.pos_y,
			10.0,
			10.0,
			90,
			0, 0, 2, .01,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
*/
/*
		rvr.c.rectangle_textured.draw(
			rvr.CAM_PLAYER,
			rvr.tex_circle_soft,
			self.pos_x,
			self.pos_y,
			10.0,
			10.0,
			90,
			220, 1, 1, .2,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);
*/
	},
	think_pre 					: function(self, time_delta)
	{

		//if (µ.rand_int(5) != 0)
		{
			//return;
		}
		var closest_agent = rvr.agents.get_agent_index_closest_to(self.pos_x, self.pos_y, self.pos_z, 5.0, 0, self.source_agent);

		//console.log(closest_agent);

		if (closest_agent > -1)
		{
			var vec_x = rvr_agents__pos_x[closest_agent] - self.pos_x;
			var vec_y = rvr_agents__pos_y[closest_agent] - self.pos_y;
			//console.log(vec_x, vec_y);
			for (var i = 0; i < 20; i++)
			{
				var frac = µ.rand(1);
				var frac1 = 1 - frac;
//				var frac2 = µ.rand(1);

/*
				rvr.particlesGPU.spawn(
					rvr.now,
					1,
					self.pos_x + vec_x * frac,
					self.pos_y + vec_y * frac,
					self.pos_x + vec_x * frac,
					self.pos_y + vec_y * frac,
					1.6 + 3.0 * frac1,
					0,
					0,
					0, 0.0,
					rvr.particles__plasma_explode,
					500,		//	lifespan
					220, 1, 0.75, 0.25,
					360,		//	vary_angle
					0.0,		//	vary_angle_vel
					0.01,			//	vary_pos_x
					0.01,			//	vary_pos_y
					0.0,			//	vary_size
					0.0,		//	vary_vel_x
					0.0,		//	vary_vel_y
					200,			//	vary_lifespan
					10,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
*/
				rvr.particlesGPU.spawn(
					rvr.now,
					1,
					self.pos_x + vec_x * frac,
					self.pos_y + vec_y * frac,
					self.pos_x + vec_x * frac,
					self.pos_y + vec_y * frac,
					0.05 + 1.0 * frac,
					0,
					0,
					0, 0.0,
					rvr.particles__plasma,
					300 + 700 * frac,		//	lifespan
					220, 1, 0.05, 0.45 + 0.5 * frac1,
					360,					//	vary_angle
					0.0,					//	vary_angle_vel
					0.01,					//	vary_pos_x
					0.01,					//	vary_pos_y
					0.0,					//	vary_size
					0.0,					//	vary_vel_x
					0.0,					//	vary_vel_y
					100,					//	vary_lifespan
					10,						//	vary_color_hue
					0,						//	vary_color_sat
					0,						//	vary_color_lum
					0						//	vary_color_a
				);



				var alpha = 0.25;
				var lum = 0.5;
				var lifespan = 2000;
			}
			rvr.agents.agents[closest_agent].receive_damage(0.0001 * time_delta);
		}
		else
		{
			var alpha = 0.99;
			var lum = 0.15;
			var lifespan = 300;
		}

			rvr.particlesGPU.spawn(
				rvr.now,
				1,
				self.pos_x,
				self.pos_y,
				self.pos_x,
				self.pos_y,
				20.0,
				0,
				0,
				0, 0.0,
				rvr.particles__plasma,
				200 + lifespan,		//	lifespan
				220, 1, lum, 0.05 * alpha,
				360,				//	vary_angle
				0.0125,				//	vary_angle_vel
				0.01,				//	vary_pos_x
				0.01,				//	vary_pos_y
				0.1,				//	vary_size
				0.005,				//	vary_vel_x
				0.005,				//	vary_vel_y
				50,					//	vary_lifespan
				10,					//	vary_color_hue
				0,					//	vary_color_sat
				0,					//	vary_color_lum
				0					//	vary_color_a
			);
	},
	think_post 					: function(self, time_delta)
	{
		var particle_count = Math.round((rvr.now - self.last_trail) / 5);

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
				2.6,
				0,
				0,
				0, 0.0,
				rvr.particles__plasma,
				400,				//	lifespan
				220, 1, 0.25, 0.25,
				360,				//	vary_angle
				0.0125,				//	vary_angle_vel
				0.01,				//	vary_pos_x
				0.01,				//	vary_pos_y
				0.1,				//	vary_size
				0.005,				//	vary_vel_x
				0.005,				//	vary_vel_y
				50,					//	vary_lifespan
				10,					//	vary_color_hue
				0,					//	vary_color_sat
				0,					//	vary_color_lum
				0					//	vary_color_a
			);
			self.last_trail_pos_x = self.pos_x;
			self.last_trail_pos_y = self.pos_y;
		}


	},
	explode 					: function(self)
	{
		rvr.scents.make_sound(self.pos_x, self.pos_y, .001);
		rvr.scents.make_sound(self.pos_x + 0.25, self.pos_y + 0.25, .001);
		rvr.scents.make_sound(self.pos_x + 0.25, self.pos_y - 0.25, .001);
		rvr.scents.make_sound(self.pos_x - 0.25, self.pos_y + 0.25, .001);
		rvr.scents.make_sound(self.pos_x - 0.25, self.pos_y - 0.25, .001);
			rvr.particlesGPU.spawn(
			rvr.now,
			3,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			3.0,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma,
			600,		//	lifespan
			220, 1, 1, 0.25,
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
			3,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			2.0,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma_explode,
			300,		//	lifespan
			220, 1, 1, 0.95,
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
			3,
			self.pos_x,
			self.pos_y,
			self.pos_x,
			self.pos_y,
			1.6,
			0,
			0,
			0, 0.0,
			rvr.particles__plasma_explode,
			400,		//	lifespan
			220, 1, 1, 0.95,
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