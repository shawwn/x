plt.collision_check = function(time_delta, damage, first_pos_x, first_pos_y, first_radius, second_pos_x, second_pos_y, second_radius)
{
	var dist = µ.distance2D(first_pos_x, first_pos_y, second_pos_x, second_pos_y);
	if (dist < (second_radius + first_radius))
	{
		if (plt.config__draw_particles)
		{
			var particle_count = Math.round(µ.rand(damage * 5000));
			if (particle_count > 0)
			{
				var overlap = second_radius + first_radius - dist;
				var angle = µ.vector2D_to_angle(second_pos_x - first_pos_x, second_pos_y - first_pos_y)
				var angle_x = µ.angle_to_x(angle);
				var angle_y = µ.angle_to_y(angle);
	/*
				plt.balls_angle[i] = angle;
				plt.speed_x[i] = angle_x * plt.speed[i];
				plt.speed_y[i] = angle_y * plt.speed[i];
				second_pos_x += overlap * angle_x * 3;
				second_pos_y += overlap * angle_y * 3;
	*/
				plt.particlesGPU_top.spawn(
					plt.now,
					particle_count,
					second_pos_x,
					second_pos_y,
					second_pos_x,
					second_pos_y,
					0.05,
					0, //plt.speed_x[i] * 500,
					0, //plt.speed_y[i] * 500,
					90, 0.0,
					plt.particles__fog,
					500 / plt.options__speed,		//	lifespan
					20, 1, 0.4, 0.1,
					360,		//	vary_angle
					5.5 * second_radius,	//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.04,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					0,			//	vary_lifespan
					5,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
				plt.particlesGPU_top.spawn(
					plt.now,
					particle_count * 5,
					second_pos_x - second_radius * angle_x,
					second_pos_y - second_radius * angle_y,
					second_pos_x - second_radius * angle_x,
					second_pos_y - second_radius * angle_y,
					0.03,
					0,
					0,
					90, 0.0,
					plt.particles__fog,
					460,		//	lifespan
					20, 0.9, 0.4, 0.6,
					700,		//	vary_angle
					0.025,	//	vary_angle_vel
					0,			//	vary_pos_x
					0,			//	vary_pos_y
					0.02,		//	vary_size
					0,			//	vary_vel_x
					0,			//	vary_vel_y
					300,			//	vary_lifespan
					5,			//	vary_color_hue
					0,			//	vary_color_sat
					0,			//	vary_color_lum
					0			//	vary_color_a
				);
			}
		}
		plt.take_damage(time_delta * damage);
	}
}