btx.Projectile = function(index)
{
	this.index = index;
	this.reset();
}

btx.Projectile.prototype.reset = function()
{
	this.acceleration			= 0.0;
	this.age 					= 0;
	this.deactivation_age 		= 0;
	this.deactivation_lifespan 	= 300;
	this.turn_speed				= 0;
	this.turn_acceleration		= 0;
	this.facing 				= 0;
	this.facing_x 				= 0;
	this.facing_y 				= 0;
	this.faction_id				= 0;
	this.friction				= 1;
	this.homing_acceleration	= 0;
	this.is_active 				= false;
	this.is_deactivating 		= false;
	this.last_trail 			= 0;
	this.last_trail_pos_x		= 0;
	this.last_trail_pos_y		= 0;
	this.lifespan 				= 5000;
	this.old_pos_x 				= 0;
	this.old_pos_y 				= 0;
	this.pos_x 					= 0;
	this.pos_y 					= 0;
	this.source_agent 			= null;
	this.speed_x 				= 0;
	this.speed_y 				= 0;
	this.target_agent 			= null;
	this.target_pos_x 			= null;
	this.target_pos_y 			= null;
	this.damage					= 0;
}

btx.Projectile.prototype.spawn = function(
	type,
	pos_x,
	pos_y,
	pos_z,
	speed_factor,
	friction,
	acceleration,
	homing_acceleration,
	turn_speed,
	turn_acceleration,
	lifespan,
	angle,
	faction_id,
	source_agent,
	target_agent,
	target_pos_x,
	target_pos_y,
	damage
	)
{
	this.reset();
				
	var angle_x = µ.angle_to_x(angle);
	var angle_y = µ.angle_to_y(angle);

	this.friction 				= friction;
	this.acceleration 			= acceleration;
	this.homing_acceleration 	= homing_acceleration;
	this.turn_speed		 		= turn_speed;
	this.turn_acceleration 		= turn_acceleration;

	this.faction_id				= faction_id;
	this.facing 				= angle;
	this.facing_x 				= angle_x;
	this.facing_y 				= angle_y;
	this.is_active 				= true;
	this.last_trail 			= btx.now - 5; // hmmm
	this.last_trail_pos_x		= pos_x;
	this.last_trail_pos_y		= pos_y;
	this.lifespan 				= lifespan;
	this.old_pos_x 				= pos_x;
	this.old_pos_y 				= pos_y;
	this.owner_agent 			= source_agent;
	this.pos_x 					= pos_x;
	this.pos_y 					= pos_y;
	this.pos_z 					= pos_z;
	this.source_agent 			= source_agent;
	this.target_agent 			= target_agent;
	this.target_pos_x 			= target_pos_x;
	this.target_pos_y 			= target_pos_y;
	this.type 					= type;
	this.damage					= damage;

	this.damage_impact_physical	= damage * (type.parameters.damage_impact_physical != undefined ? type.parameters.damage_impact_physical : 1);
	this.damage_impact_burn		= damage * (type.parameters.damage_impact_burn != undefined ? type.parameters.damage_impact_burn : 0);

	this.bounce 				= type.parameters.bounce != undefined ? type.parameters.bounce : false;
	this.bounce_factor_max 		= type.parameters.bounce_factor_max != undefined ? type.parameters.bounce_factor_max : 1.0;
	this.bounce_factor_min 		= type.parameters.bounce_factor_min != undefined ? type.parameters.bounce_factor_min : 1.0;
	this.bounce_agents 			= type.parameters.bounce_agents != undefined ? type.parameters.bounce_agents : false;

	this.type.spawn(
		this,
		pos_x,
		pos_y,
		pos_z,
		speed_factor,
		angle,
		angle_x,
		angle_y,
		faction_id,
		source_agent,
		target_agent,
		target_pos_x,
		target_pos_y);
};

btx.Projectile.prototype.agent_collision_check = function(time_delta, agent)
{
	var agent_index = agent.index;
	if (this.faction_id != agent.parameters.faction_id)
	{
		var dist_m = µ.distance2D_manhattan(btx_agents__pos_x[agent_index], btx_agents__pos_y[agent_index], this.pos_x, this.pos_y);
		if (dist_m < agent.parameters.radius)
		{
			var dist = µ.distance2D(btx_agents__pos_x[agent_index], btx_agents__pos_y[agent_index], this.pos_x, this.pos_y);
			if (dist < agent.parameters.radius)
			{
				if (!this.bounce_agents)
				{
					if (!agent.is_dying)
					{
						agent.receive_damage(this.damage_impact_physical, this.damage_impact_burn, 0);
					}
					var angle = µ.vector2D_to_angle(btx_agents__pos_x[agent_index] - this.pos_x, btx_agents__pos_y[agent_index] - this.pos_y);
					btx_agents__speed_x[agent_index] += µ.angle_to_x(angle) * 0.0002;
					btx_agents__speed_y[agent_index] += µ.angle_to_y(angle) * 0.0002;
					this.explode();
				}
				else
				{
					var angle = µ.vector2D_to_angle(btx_agents__pos_x[agent_index] - this.pos_x, btx_agents__pos_y[agent_index] - this.pos_y);
					//var vector_len = µ.vector2D_length(btx_agents__pos_x[agent_index], btx_agents__pos_y[agent_index], this.pos_x, this.pos_y);
					var vector_len = Math.sqrt(this.speed_x * this.speed_x + this.speed_y * this.speed_y);
					this.speed_x = µ.angle_to_x(angle + 180) * vector_len;
					this.speed_y = µ.angle_to_y(angle + 180) * vector_len;
				}

			}
		}
	}
};

btx.Projectile.prototype.deactivation_begin = function()
{
	this.type.explode(this); // move this to type::on_deactivation_begin
	this.is_deactivating = true;
	btx.projectiles.count_dea++;
	this.age = 0;					// age now counts up from moment of deactivation
}

btx.Projectile.prototype.deactivation_finish = function()
{
	btx.projectiles.count_deac++;
	this.is_active = false;
	btx.projectiles.active_projectiles--;
}

btx.Projectile.prototype.think = function(time_delta)
{
	if (this.is_deactivating)
	{
		this.deactivation_age += time_delta;
		if (this.deactivation_age >= this.deactivation_lifespan)
		{
			this.deactivation_finish();
		}
		return false;
	}
	this.age += time_delta;
	if (this.age >= this.lifespan || (this.pos_x < 0.0 || this.pos_x > btx.map.size_x || this.pos_y < 0.0 || this.pos_y > btx.map.size_y))
	{
		this.explode();
		//this.deactivation_begin();
		return false;
	}

	this.type.think_pre(this, time_delta);

	this.turn_speed += this.turn_acceleration * time_delta;

	if (this.turn_speed != 0)
	{
		this.facing = (this.facing + this.turn_speed * time_delta) % 360;
		this.facing_x = µ.angle_to_x(this.facing);
		this.facing_y = µ.angle_to_y(this.facing);
	}

	//this.speed_y -= 0.00001 * time_delta;

	if (this.acceleration != 0)
	{
		this.speed_x += this.facing_x * this.acceleration * time_delta;
		this.speed_y += this.facing_y * this.acceleration * time_delta;
	}

	if (btx.map.collision_check(this.pos_x + this.speed_x * time_delta, this.pos_y, this.pos_z))
	{
		if (!this.bounce)
		{
			this.explode();
			return false;
		}
		else
		{
			this.speed_x *= - (this.bounce_factor_min + µ.rand(this.bounce_factor_max - this.bounce_factor_min));
		}
	}
	if (btx.map.collision_check(this.pos_x, this.pos_y + this.speed_y * time_delta, this.pos_z))
	{
		if (!this.bounce)
		{
			this.explode();
			return false;
		}
		else
		{
			this.speed_y *= - (this.bounce_factor_min + µ.rand(this.bounce_factor_max - this.bounce_factor_min));
		}
	}

	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;

	var friction = Math.pow(this.friction, time_delta);

	this.speed_x *= friction;
	this.speed_y *= friction;
	this.type.think_post(this, time_delta);
	this.old_pos_x = this.pos_x;
	this.old_pos_y = this.pos_y;
};

btx.Projectile.prototype.explode = function()
{
	btx.map.drop_smoke(this.pos_x, this.pos_y, 1);
	btx.screen_shake = 0;
	btx.projectiles.count_expl++;
	this.deactivation_begin();
	this.type.explode(this);
};


btx.Projectile.prototype.draw = function()
{
	this.type.draw(this);
}


btx.Projectile.prototype.draw_light = function()
{
//*
	var frac = 1.0;
	if (this.is_deactivating)
	{
		if (this.deactivation_age < this.deactivation_lifespan)
		{
			var frac = 1.0 - this.deactivation_age / this.deactivation_lifespan;
		}
		else
		{
			var frac = 0.0;
		}
	}

	if (frac > 0)
	{

/*
	(pos_x, pos_y, pos_z, range, range360, falloff, color_r, color_g, color_b, color_a, direction, cone)
*/

/*
			btx.lights.add(
				this.pos_x / btx.map.size_x,
				this.pos_y / btx.map.size_y,
				0.0075 * frac,
				0.0075 * frac,
				0.65,
				0.95, 0.95, 0.95, 0.25,
				(this.age * 0.30) % 360, 		360);
*/

			//pos_x, pos_y, range, range360, falloff, color_r, color_g, color_b, color_a, direction, cone)
		//	btx.lights.add(this.pos_x / btx.map.size_x, this.pos_y / btx.map.size_y,		0.05 * frac, 	0.0075 * frac, 	1.0,			0.8, -.3, -.3, 0.25,	(this.age * 0.33 + 77) % 360, 	360);
		//	btx.lights.add(this.pos_x / btx.map.size_x, this.pos_y / btx.map.size_y,		0.0125 * frac, 	0.005 * frac, 	1.0,			0.9, 0.6, -.4, 0.5,	(this.age * 0.37 + 177) % 360, 	360);
	}
//*/


};

btx.Projectile.prototype._ = function()
{
}
