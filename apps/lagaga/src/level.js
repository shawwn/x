"use strict";

// everything is just one never ending level now, but so what =)

lgg.Level = function()
{
	this.reset();
}
lgg.Level.prototype.reset = function()
{
	this.size_x = lgg.LEVEL_SIZE_X;
	this.size_y = lgg.LEVEL_SIZE_Y;
	lgg.camera_player.set_size(this.size_x, this.size_y);
	this.etypes = {};
	for (var i in lgg.etypes)
	{
		this.etypes[i] = {};
		this.etypes[i].next_spawn = -99999999999999;
		this.etypes[i].number_spawned = 0;
	}
	this.danger_to_bring = 15;
	this.danger_overcome = 0;
	this.danger_passed_by = 0;
	this.danger_in_play = 0;
	this.spawn_freq = 5000;
	this.state = lgg.LEVELSTATE__PLAYING;
	this.state_time = 0;
	this.stage = 1;
	this.danger_per_stage = 20;
	this.danger_overcome_this_stage = 0;
	this.time_elapsed = 0;
}
lgg.Level.prototype.restart = function()
{
	lgg.now += 5000;
	this.reset();
	lgg.player.reset();
	lgg.enemies.reset();
	lgg.trader.reset();
	lgg.singularity.reset();
	lgg.projectiles.reset();
	lgg.pickups.reset();
	lgg.player_drones.reset();
	
	for (var i = 0; i < 4; i++)
	{
		lgg.player_drones.add_drone();
	}

}

lgg.Level.prototype.overcome_danger = function(danger_amount, pos_x, pos_y, caused_by_player)
{
	if (caused_by_player)
	{
		lgg.level.danger_overcome_this_stage += danger_amount;
		if (lgg.level.danger_overcome_this_stage >= lgg.level.danger_per_stage)
		{
			lgg.level.danger_overcome_this_stage = 0;

			var prev_danger = lgg.level.danger_per_stage;
			lgg.level.danger_per_stage *= 1.025;
			lgg.level.danger_per_stage += 10;
			lgg.level.stage++;
		}

		lgg.player.score += danger_amount * 20;

		lgg.level.danger_overcome += danger_amount;
		lgg.level.danger_to_bring += danger_amount * lgg.ENEMY_DANGER_FACTOR__EXPLODE;
		lgg.level.danger_to_bring += lgg.ENEMY_DANGER_ADD__EXPLODE;

		// 100 danger = 1 second
		lgg.level.spawn_freq -= danger_amount * 10;
		lgg.pickups.spawn_maybe(pos_x, pos_y, danger_amount);
	}
}

lgg.Level.prototype.think = function(time_delta)
{
	this.state_time += time_delta;
	if (this.state == lgg.LEVELSTATE__WARMUP && this.state_time > 30)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__RESPAWN_SELECT;
	}
	else if (this.state == lgg.LEVELSTATE__RESPAWN_SELECT /* && lgg.input.key('KEY_SPACE').pressed */)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__RESPAWNING;
	}
	else if (this.state == lgg.LEVELSTATE__RESPAWNING && this.state_time > 30)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__PLAYING;
	}
	else if (this.state == lgg.LEVELSTATE__TRADER_ENTER && this.state_time > 500)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__TRADER;
	}
	else if (this.state == lgg.LEVELSTATE__TRADER_EXIT && this.state_time > 500)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__PLAYING;
	}
	else if (this.state == lgg.LEVELSTATE__TRADER)
	{
		// gets exited manually
	}
	else if (this.state == lgg.LEVELSTATE__SINGULARITY_ENTER && this.state_time > 500)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__SINGULARITY;
	}
	else if (this.state == lgg.LEVELSTATE__SINGULARITY_EXIT && this.state_time > 500)
	{
		this.state_time = 0;
		this.state = lgg.LEVELSTATE__SINGULARITY;
	}
	else if (this.state == lgg.LEVELSTATE__SINGULARITY)
	{
	}
	else if (this.state == lgg.LEVELSTATE__PLAYING)
	{
		this.time_elapsed += time_delta;
		if (!lgg.options_debug_values[lgg.DEBUG_OPTION__DISABLE_SPAWNING])
		{
			
			//this.danger_to_bring += time_delta / 15000 + Math.min(50, this.stage) * 0.00001 * time_delta + this.danger_overcome * time_delta / 100000000;
			//this.danger_to_bring += (0.0005 + 0.0001 * this.stage) * time_delta * (1 - (Math.min(bleh, this.danger_in_play) / bleh));
			
			var danger_floor = 2 + this.stage * 3;
			var danger_ceiling = 5 + this.stage * 5;
			var danger_considered = Math.max(0, this.danger_in_play - danger_floor);
			this.danger_to_bring += Math.max(0, (danger_ceiling - danger_considered) * 0.0005 * time_delta);
			
			
			this.spawn_freq += (this.danger_in_play - this.danger_to_bring * 4.0) * time_delta / 20;
			var min_spawn_freq = 1000 - 9 * Math.min(100, this.stage);
			var max_spawn_freq = 15000 - 130 * Math.min(100, this.stage);
			if (this.spawn_freq < min_spawn_freq) this.spawn_freq = min_spawn_freq;
			if (this.spawn_freq > max_spawn_freq) this.spawn_freq = max_spawn_freq;
			if (this.danger_to_bring > 0
				&&
					(
						(								lgg.now - lgg.enemies.last_spawn >= this.spawn_freq)
					||	(!lgg.enemies.enemies_alive && 	lgg.now - lgg.enemies.last_spawn >= this.spawn_freq / 4)
					)
				)
			{

				if (!lgg.enemies.enemies_alive)
				{
					var danger_brought = lgg.enemies.spawn(this.danger_to_bring * 1.0);
					//this.spawn_freq += danger_brought * 1000;
				}
				else
				{
					var danger_brought = lgg.enemies.spawn(this.danger_to_bring);
					this.spawn_freq += danger_brought * 10;
				}

				this.danger_to_bring -= danger_brought;
				// delay next spawn a little proportionally to danger of enemies spawned
				lgg.enemies.last_spawn = lgg.now + danger_brought * 50;
			}
		}
	}
};