rvr.presets.agent_goals.random_movement =
{
	evaluate							: function(self)
	{
		// only do this when there is really nothing else to do
		return 0.0001;

	},
	decide_for							: function(self)
	{
		// pick a random goal location
		// decide on movement speed
	},

	decide_against							: function(self)
	{

	},


	pursue							: function(self)
	{
		//set desired direction and speed
	},

};