btx.Projectiles = function()
{
	this.projectile_count = 1000;
	this.active_projectiles = 0;
	this.projectiles = new Array(this.projectile_count);
	for (var i = 0; i < this.projectile_count; i++)
	{
		this.projectiles[i] = new btx.Projectile(i);
	}
}

btx.Projectiles.prototype.spawn = function(
	projectile_type_id,
	faction_id,
	source_agent_id,
	pos_x,
	pos_y,
	angle,
	speed,
	fuse,
	target_pos_x,
	target_pos_y
	)
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === false)
		{
			this.active_projectiles++;
			return p.spawn(
				faction_id,
				source_agent_id,
				pos_x,
				pos_y,
				angle,
				speed,
				fuse,
				target_pos_x,
				target_pos_y
			);
		}
	}
	return false;
}

btx.Projectiles.prototype.agent_collision_check = function(time_delta, agent)
{
	for (var i = 0; i < this.projectile_count; i++)
	{
		var p = this.projectiles[i];
		if (p.is_active === true && p.is_deactivating === false)
		{
			for (var j = 0; j < btx.agent_count; j++)
			{
				if (btx_agents__is_active[j])
				{
					p.agent_collision_check(time_delta, btx.agents.agents[j]);
				}
			}
		}
	}
}


btx.Projectiles.prototype.think = function(time_delta)
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

btx.Projectiles.prototype.draw_lights = function()
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

btx.Projectiles.prototype.draw = function()
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

btx.Projectiles.prototype._ = function()
{
}






