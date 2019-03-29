var rnd = {};
rnd.init = [
	function() {
		rnd.now = 0;

		rnd.cameras = new µ.Cameras2D(rnd, window.innerWidth, window.innerHeight);

		rnd.c = new µ.canvas_webgl('bxx', 1, -1, -1, rnd.cameras, {
				autoresize: true,
			});
		
		rnd.rand = new MersenneTwister(25277);
		rnd.rand2 = new MersenneTwister(25277);
		
		rnd.methods = [

'random',
'genrand_real1',
'genrand_real3',
'genrand_res53',

'genrand_int31',
'genrand_int32',
'genrand_moar',
'float0',
'float1',
'float2',
'float3',
'int0',
'int1',
'int2',
'int3'
];
		rnd.min = [];
		rnd.max = [];
		for (var i = 0; i < rnd.methods.length; i++)
		{
			rnd.min[rnd.methods[i]] = rnd.rand[rnd.methods[i]]();
			rnd.max[rnd.methods[i]] = rnd.rand[rnd.methods[i]]();
		}
		console.log(rnd.min['genrand_int32'], rnd.max['genrand_int32']);
		return 'stuff';
	},
	function() {
		rnd.input = new µ.input(rnd.c.canvas, 1, rnd.cameras);
		rnd.audio = new µ.Audio();
		return 'done!';
	},
];
rnd.think = function(time_delta) {
	rnd.now += time_delta;

};
rnd.render = function()
{
	rnd.c.flush_all();
	rnd.c.set_blending(rnd.c.gl.SRC_ALPHA, rnd.c.gl.ONE, rnd.c.gl.FUNC_ADD);

	for (var i = 0; i < rnd.methods.length; i++)
	{
		for (var j = 0; j < 5000; j++)
		{
			var val = rnd.rand[rnd.methods[i]]();
			rnd.min[rnd.methods[i]] = Math.min(rnd.min[rnd.methods[i]], val);
			rnd.max[rnd.methods[i]] = Math.max(rnd.max[rnd.methods[i]], val);
		}
	}

	if (rnd.input.KEY_SPACE.pressed || Math.random() > 0.999)
	{
		var output = '';
		for (var i = 0; i < rnd.methods.length; i++)
		{
			output = output + rnd.methods[i] + ': ' + "\t\t\t" + rnd.min[rnd.methods[i]] + ' / ' +  rnd.max[rnd.methods[i]] + "\n"
		}
		console.log(output);
	}

};
var app = new µ.app(rnd, rnd.init, rnd.think, rnd.render);
