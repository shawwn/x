var rnd = {};
rnd.init = [
	function() {
		rnd.now = 0;
		rnd.cameras = new µ.Cameras2D(rnd, window.innerWidth, window.innerHeight);
		rnd.c = new µ.canvas_webgl('bxx', 1, -1, -1, rnd.cameras, {
				autoresize: true,
			});
		rnd.distributions = [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001, 0.00000001, 0.000000001, 0.0000000001];
		rnd.input = new µ.input(rnd.c.canvas, 1, rnd.cameras);

		var output = '';

		var tick_duration = 5;
		output = output + "[[[ " + tick_duration + " ]]]\n";
		var seconds = (rnd.runs * tick_duration) / 1000;
		var minutes = (rnd.runs * tick_duration) / 1000 / 60;
		for (var i = 0; i < rnd.distributions.length; i++)
		{
			output = output + ("           " + rnd.distributions[i]).slice(-10) + ': ' + "\t\t" + 
			
				"every " + (tick_duration / (rnd.distributions[i] * 1000)) + " seconds \t every " + (tick_duration / rnd.distributions[i] / 60000) + " minutes"
			+
			"\n"
		}
		output = output + "\n";

		var tick_duration = 100;
		output = output + "[[[ " + tick_duration + " ]]]\n";
		var seconds = (rnd.runs * tick_duration) / 1000;
		var minutes = (rnd.runs * tick_duration) / 1000 / 60;
		for (var i = 0; i < rnd.distributions.length; i++)
		{
			output = output + ("           " + rnd.distributions[i]).slice(-10) + ': ' + "\t\t" + 
			
				"every " + (tick_duration / (rnd.distributions[i] * 1000)) + " seconds \t every " + (tick_duration / rnd.distributions[i] / 60000) + " minutes"
			+
			"\n"
		}
		output = output + "\n";

		var tick_duration = 1000;
		output = output + "[[[ " + tick_duration + " ]]]\n";
		var seconds = (rnd.runs * tick_duration) / 1000;
		var minutes = (rnd.runs * tick_duration) / 1000 / 60;
		for (var i = 0; i < rnd.distributions.length; i++)
		{
			output = output + ("           " + rnd.distributions[i]).slice(-10) + ': ' + "\t\t" + 
			
				"every " + (tick_duration / (rnd.distributions[i] * 1000)) + " seconds \t every " + (tick_duration / rnd.distributions[i] / 60000) + " minutes"
			+
			"\n"
		}
		output = output + "\n";

		var tick_duration = 5000;
		output = output + "[[[ " + tick_duration + " ]]]\n";
		var seconds = (rnd.runs * tick_duration) / 1000;
		var minutes = (rnd.runs * tick_duration) / 1000 / 60;
		for (var i = 0; i < rnd.distributions.length; i++)
		{
			output = output + ("           " + rnd.distributions[i]).slice(-10) + ': ' + "\t\t" + 
			
				"every " + (tick_duration / (rnd.distributions[i] * 1000)) + " seconds \t every " + (tick_duration / rnd.distributions[i] / 60000) + " minutes"
			+
			"\n"
		}
		output = output + "\n";


		console.log(output);


		return 'done!';
	},
];
rnd.think = function(time_delta) {
	rnd.now += time_delta;


};

rnd.render = function()
{
	//rnd.c.flush_all();
	//rnd.c.set_blending(rnd.c.gl.SRC_ALPHA, rnd.c.gl.ONE, rnd.c.gl.FUNC_ADD);
};

var app = new µ.app(rnd, rnd.init, rnd.think, rnd.render);
