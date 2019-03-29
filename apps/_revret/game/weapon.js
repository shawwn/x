rvr.Weapon = function(preset, agent)
{
	this.state = rvr.WEAPONSTATE_IDLE;
	this.state_since = rvr.now;
	this.agent = agent;
	this.agent_index = agent.index;
	this.data = {};
	this.preset = preset;

	//console.log(preset, agent);

	for (i in preset.data)
	{
		this.data[i] = preset.data[i];
	}
	this.parameters = {}
	for (i in preset.parameters)
	{
		this.parameters[i] = preset.parameters[i];
	}

	this.shots_in_clip = this.parameters.shots_per_clip;
}

rvr.Weapon.prototype.change_state = function(state)
{
	this.state_since = rvr.now;
	this.state = state;
}

rvr.Weapon.prototype.think = function(time_delta)
{
	if (this.shots_in_clip == 0 && this.state == rvr.WEAPONSTATE_IDLE)
	{
		this.change_state(rvr.WEAPONSTATE_RELOAD_WARMUP);
	}
	else if (this.state == rvr.WEAPONSTATE_WARMUP)
	{
		if (rvr.now - this.state_since >= this.parameters.shot_warmup)
		{
			this.fire();
			this.change_state(rvr.WEAPONSTATE_INTERVAL);
		}
	}
	else if (this.state == rvr.WEAPONSTATE_INTERVAL)
	{
		if (rvr.now - this.state_since >= this.parameters.shot_interval)
		{
			this.change_state(rvr.WEAPONSTATE_COOLDOWN);
		}
	}
	else if (this.state == rvr.WEAPONSTATE_COOLDOWN)
	{
		if (rvr.now - this.state_since >= this.parameters.shot_cooldown)
		{
			this.change_state(rvr.WEAPONSTATE_IDLE);
		}
	}
	else if (this.state == rvr.WEAPONSTATE_RELOAD_WARMUP)
	{
		if (rvr.now - this.state_since >= this.parameters.reload_warmup)
		{
			this.change_state(rvr.WEAPONSTATE_RELOAD_INTERVAL);
		}
	}
	else if (this.state == rvr.WEAPONSTATE_RELOAD_INTERVAL)
	{
		if (rvr.now - this.state_since >= this.parameters.reload_interval)
		{
			this.reload();
			this.change_state(rvr.WEAPONSTATE_RELOAD_COOLDOWN);
		}
	}
	else if (this.state == rvr.WEAPONSTATE_RELOAD_COOLDOWN)
	{
		if (rvr.now - this.state_since >= this.parameters.reload_cooldown)
		{
			this.change_state(rvr.WEAPONSTATE_IDLE);
		}
	}
}

rvr.Weapon.prototype.trigger = function()
{


	//console.log('trigger 3');
	if (this.state == rvr.WEAPONSTATE_IDLE)
	{
		//console.log('trigger 4');
		if (this.shots_in_clip > 0)
		{
			//console.log('trigger 5A');
			this.state = rvr.WEAPONSTATE_WARMUP;
			this.state_since = rvr.now;
			this.shots_in_clip--;
			rvr.map.drop_smoke(rvr_agents__pos_x[this.agent_index], rvr_agents__pos_y[this.agent_index], 1);
		}
		else
		{
			//console.log('trigger 5B');
			this.change_state(rvr.WEAPONSTATE_RELOAD_WARMUP);
		}
	}
}

rvr.Weapon.prototype.fire = function()
{
	this.preset.fire(this, this.agent);
}

rvr.Weapon.prototype.reload = function()
{
	this.shots_in_clip = this.parameters.shots_per_clip;
}

rvr.Weapon.prototype._ = function()
{
}