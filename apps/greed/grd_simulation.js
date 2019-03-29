grd.Simulation = function ()
{
	this.reset();
};

grd.Simulation.prototype.reset = function ()
{
	
	this.now = 0;
	
	this.world = {};

	this.current_generation= 0;
	this.current_agent = 0;
	this.current_run = 0;
	
};

grd.Simulation.prototype.init = function ()
{
	grd.agents.a[0].make_body();
}

grd.Simulation.prototype.think = function (time_delta)
{
	this.now += time_delta;
	if (this.now > grd.EVO__SIMULATION_DURATION)
	{
		this.now = 0;
		grd.agents.a[this.current_agent].next_run();
		this.current_run++;
		if (this.current_run >= grd.EVO__SIMULATION_RUNS_PER_AGENT)
		{
			console.log(this.current_generation, this.current_agent);
			this.current_run = 0;
			grd.agents.a[this.current_agent].remove_body(grd.b2world);
			this.current_agent++;
			if (this.current_agent >= grd.EVO__MAX_AGENTS)
			{
				this.next_generation();
				this.current_agent = 0;
				this.current_generation++;
			}
			grd.agents.a[this.current_agent].make_body(grd.b2world);
		}
		else
		{
			grd.agents.a[this.current_agent].remove_body(grd.b2world);
			grd.agents.a[this.current_agent].make_body(grd.b2world);
		}
	}
	grd.agents.a[this.current_agent].think(time_delta);
};

grd.Simulation.prototype.next_generation = function ()
{
	var best_score = -10000;
	var best_agent = -1;
	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		grd.agents.a[i].total_score = grd.agents.a[i].scores.reduce(function(a, b) { return a + b }) / grd.agents.a[i].scores.length;
		if (best_score < grd.agents.a[i].total_score)
		{
			best_score = grd.agents.a[i].total_score;
			best_agent = i;
		}
		console.log(i, grd.agents.a[i].total_score);
	}


	for (var i = 0; i < grd.EVO__MAX_AGENTS; i++)
	{
		if (i != best_agent)
		{
			grd.agents.a[i].reset();
		}
		else
		{
			grd.agents.a[i].next_generation();
		}
	}
	
	/*
	picked_agent = µ.pick_randomly_from_weighted_list(grd.agents.a, function(agent) {
			return agent.total_score;
		})*/

};
