rvr.Projectiles = function()
{
	this.count_expl = 0;
	this.count_deac = 0;
	this.count_dea = 0;

	this.projectile_count = rvr.projectile_count;
	this.active_projectiles = 0;
	this.projectiles = new Array(this.projectile_count);
	for (var i = 0; i < this.projectile_count; i++)
	{
		this.projectiles[i] = new rvr.Projectile(i);
	}
}

rvr.Projectiles.prototype.spawn = function(
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
	damage)
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === false)
		{
			this.active_projectiles++;
			return p.spawn(
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
				damage);
		}
	}
	return false;
}

rvr.Projectiles.prototype.agent_collision_check = function(time_delta, agent)
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === true && p.is_deactivating === false)
		{
			for (var j = 0; j < rvr.agent_count; j++)
			{
				if (rvr_agents__is_active[j])
				{
					p.agent_collision_check(time_delta, rvr.agents.agents[j]);
				}
			}
		}
	}
}


rvr.Projectiles.prototype.think = function(time_delta)
{
	
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === true)
		{
			p.think(time_delta);
		}
	}
}

rvr.Projectiles.prototype.draw_lights = function()
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === true)
		{
			p.draw_light();
		}
	}
}

rvr.Projectiles.prototype.draw = function()
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === true)
		{
			p.draw();
		}
	}
}

rvr.Projectiles.prototype._ = function()
{
}
