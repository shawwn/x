var inc = 0;
btx.GAMESTATE__IN_GAME		= inc++;
btx.GAMESTATE__GENERATING	= inc++;

var inc = 0;
btx.WORLD_GEN_PHASE__SUBDIVIDE_CITYBLOCKS		= inc++;
btx.WORLD_GEN_PHASE__ALLOCATE_CITYBLOCK_TYPES	= inc++;
btx.WORLD_GEN_PHASE__ADD_HOUSES					= inc++;
btx.WORLD_GEN_PHASE__DO_REST					= inc++;
btx.WORLD_GEN_PHASE__PLACE_NAVMESH_NODES		= inc++;
btx.WORLD_GEN_PHASE__CONNECT_NAVMESH_NODES		= inc++;
btx.WORLD_GEN_PHASE__WEIGH_NAVMESH_CONNECTIONS	= inc++;
btx.WORLD_GEN_PHASE__DONE						= inc++;
/*
btx.WORLD_GEN_PHASE__		= inc++;
*/

btx.Game = function()
{
	this.reset();
}

btx.Game.prototype.reset = function()
{
	this.time_elapsed = 0;
	this.current_day = 1;
	this.current_time = 12 * 3600;
	this.near_noon = 0;
	this.spectated_person = -1;
	this.player_person = -1;
	this.state = btx.GAMESTATE__GENERATING;
	this.state_time_elapsed = 0;
	this.state_progress = 0;
	this.world_gen_phase = btx.WORLD_GEN_PHASE__SUBDIVIDE_CITYBLOCKS;
	this.world_gen_phase_progress = 0;
}

btx.Game.prototype.think_switch = function(time_delta)
{
	this.state_time_elapsed += time_delta;
	if (this.state == btx.GAMESTATE__GENERATING && this.state_progress >= 1.0)
	{
		this.switch_state_to(btx.GAMESTATE__IN_GAME);
	}
}

btx.Game.prototype.think = function(time_delta)
{
	if (this.state == btx.GAMESTATE__GENERATING)
	{
		if (this.world_gen_phase == btx.WORLD_GEN_PHASE__SUBDIVIDE_CITYBLOCKS)
		{
			this.world_gen_phase_progress = btx.cityblocks.subdivide_cityblocks();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__ALLOCATE_CITYBLOCK_TYPES;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__ALLOCATE_CITYBLOCK_TYPES)
		{
			this.world_gen_phase_progress = btx.cityblocks.allocate_cityblock_types();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__ADD_HOUSES;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__ADD_HOUSES)
		{
			this.world_gen_phase_progress = btx.cityblocks.add_houses();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__DO_REST;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__DO_REST)
		{
			this.world_gen_phase_progress = btx.cityblocks.do_rest();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__PLACE_NAVMESH_NODES;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__PLACE_NAVMESH_NODES)
		{
			this.world_gen_phase_progress = btx.navmesh.add_nodes();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__CONNECT_NAVMESH_NODES;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__CONNECT_NAVMESH_NODES)
		{
			this.world_gen_phase_progress = btx.navmesh.make_connections();
			if (this.world_gen_phase_progress >= 1.0)
			{

				this.world_gen_phase = btx.WORLD_GEN_PHASE__WEIGH_NAVMESH_CONNECTIONS;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__WEIGH_NAVMESH_CONNECTIONS)
		{
			this.world_gen_phase_progress = btx.navmesh.make_nodeflows();
			if (this.world_gen_phase_progress >= 1.0)
			{
				this.world_gen_phase = btx.WORLD_GEN_PHASE__DONE;
				this.world_gen_phase_progress = 0;
			}
		}
		else if (this.world_gen_phase == btx.WORLD_GEN_PHASE__DONE)
		{
			this.state_progress = 1.0;
		}
	}
	else if (this.state == btx.GAMESTATE__IN_GAME)
	{
		var ticks_to_do = time_delta * btx.options_debug_values[btx.DEBUG_OPTION__TIMESCALE];
		
		var time_step = Math.min(10, time_delta * btx.options_debug_values[btx.DEBUG_OPTION__TIMESCALE]);
		while (ticks_to_do >= 0)
		{
			this.current_time += time_step * btx.options_debug_values[btx.DEBUG_OPTION__DAYCYCLE_SCALE] / 1000;

			//console.log(this.current_time);

			if (this.current_time >= 24 * 3600)
			{
				this.current_time -= 24 * 3600;
				this.current_day++;
			}
			
			this.near_noon = 1.0 - Math.abs((this.current_time - 12 * 3600) / (12 * 3600));
			
			ticks_to_do -= (time_step > 0 ? time_step : 10000);
			this.time_elapsed += time_step * btx.options_debug_values[btx.DEBUG_OPTION__DAYCYCLE_SCALE] / 1000;
			btx.think__in_game(time_step);
		}
	}

	//console.log(this.state, this.world_gen_phase, this.world_gen_phase_progress);
}

btx.Game.prototype.switch_state_to = function(state)
{
	this.state = state;
	this.state_time_elapsed = 0;
	this.state_progress = 0;
}

btx.Game.prototype.render = function(time_delta)
{
	if (this.state == btx.GAMESTATE__GENERATING)
	{
		btx.render__generating(time_delta);
	}
	else if (this.state == btx.GAMESTATE__IN_GAME)
	{
		btx.render__in_game(time_delta);
	}

}


btx.Game.prototype._ = function()
{
}

btx.Game.prototype._ = function()
{

}
