"use strict";

var OBJECT_COUNT = 100;

var bm_single_object_state_x = 0;
var bm_single_object_state_y = 0;

var bm_object_state_x = Array(OBJECT_COUNT);
var bm_object_state_y = Array(OBJECT_COUNT);

function TestObject()
{
	this.state = {
		x: 1,
		y: 1,
	};

	this.state_nest = {
		inside:
		{
			x: 1,
			y: 1,
		},
	};
	this.state_nest2 = {
		inside:
		{
			inside:
			{
				x: 1,
				y: 1,
			},
		},
	};
}

var rando1 = 1
var rando2 = 1
var rando3 = 1

var global_var = 5;
var bm = {};

bm.init = [
	function() {
		bm.now = 0;
		bm.mode = 0;
		bm.scale = 1;
		bm.cameras = new µ.Cameras2D(bm, window.innerWidth, window.innerHeight);

		bm.camera_landscape = bm.cameras.c[bm.CAM_LANDSCAPE];
		bm.camera_portrait = bm.cameras.c[bm.CAM_PORTRAIT];
		bm.camera_stretch = bm.cameras.c[bm.CAM_STRETCH];

		bm.c = new µ.canvas_webgl('bxx', bm.scale, -1, -1, bm.cameras, {
				autoresize: true,
			});

		bm.rand = new MersenneTwister(25277);
		bm.randO = new µ.PRandom(1259259259, 2756741527, 4256741557, 514847);

		bm.input = new µ.input(bm.c.canvas, bm.scale, bm.cameras);

		bm.temp_array2 = [0, 0];

		bm.test_objects = Array(OBJECT_COUNT);
		for (var i = 0; i < OBJECT_COUNT; i++)
		{
			bm.test_objects[i] = new TestObject();
		}
/*
µ.vector2D_to_angle = function (x, y)
{
	var angle = (180 / Math.PI) * Math.atan2(y, x);
	return µ.mod(angle, 360);
};

µ.vector2D_to_radians = function (x, y)
{
	return Math.atan2(y, x);
};

µ.vector2D_to_length = function (x, y)
{
	return Math.sqrt(x * x + y * y);
};

// expects result to be an array
µ.vector2D_normalize = function(a_x, a_y, result)
{
	var length = Math.sqrt(a_x * a_x + a_y * a_y);
	result[0] = a_x / length;
	result[1] = a_y / length;
};

µ.angle_norm = function (angle)
{
	return µ.mod(angle, 360);
};

µ.angle_to_x = function (angle)
{
	return Math.cos(angle * Math.PI / 180);
};

µ.angle_to_y = function (angle)
{
	return Math.sin(angle * Math.PI / 180);
};
*/


		bm.benchmarks = [

/*###########################################################################
//###########################################################################*/

/*
			["concat",function() {
				var string = "0123456789" + "0123456789" + "0123456789" + "0123456789" + "0123456789";
			}],

			["concat2",function() {
				var string = "0123456789";
				string += "0123456789";
				string += "0123456789";
				string += "0123456789";
				string += "0123456789";
			}],
//*/


//*###########################################################################
			["multiply\t", function() {
				var value = µ.rand(1);
				var value = µ.rand(value * 0.5);
				var value = µ.rand(value * 0.5);
				var value = µ.rand(value * 0.5);
				var value = µ.rand(value * 0.5);
				var value = µ.rand(value * 0.5);
			}],
			["divide\t", function() {
				var value = µ.rand(1);
				var value = µ.rand(value / 2);
				var value = µ.rand(value / 2);
				var value = µ.rand(value / 2);
				var value = µ.rand(value / 2);
				var value = µ.rand(value / 2);
			}],
//###########################################################################*/


/*###########################################################################
			["to angle and back\t", function() {
				var pos_x = µ.rand(1);
				var pos_y = µ.rand(1);
				var target_x = µ.rand(1);
				var target_y = µ.rand(1);
				var angle = µ.vector2D_to_angle(target_x - pos_x, target_y - pos_y);
				var vx = µ.angle_to_x(angle);
				var vy = µ.angle_to_y(angle);
			}],

			["just normalize\t", function() {
				var pos_x = µ.rand(1);
				var pos_y = µ.rand(1);
				var target_x = µ.rand(1);
				var target_y = µ.rand(1);
				µ.vector2D_normalize(target_x - pos_x, target_y - pos_y, bm.temp_array2);
			}],
//###########################################################################*/

/*
			["object array 1\t", function() {
				bm.test_objects[rando1].state.x = bm.test_objects[rando2].state.y + rando3;
				bm.test_objects[rando2].state.y = rando3;
			}],

			["object array 2\t", function() {
				bm.test_objects[rando1].state_nest.inside.x = bm.test_objects[rando2].state_nest.inside.y + rando3;
				bm.test_objects[rando2].state_nest.inside.y = rando3;
			}],

			["object array 3\t", function() {
				bm.test_objects[rando1].state_nest2.inside.inside.x = bm.test_objects[rando2].state_nest2.inside.inside.y + rando3;
				bm.test_objects[rando2].state_nest2.inside.inside.y = rando3;
			}],

			["global array\t", function() {
				bm_object_state_x[rando1] = bm_object_state_y[rando2] + rando3;
				bm_object_state_y[rando2] = rando3;
			}],


			["global\t", function() {
				bm_single_object_state_y = bm_single_object_state_y + rando3;
				bm_single_object_state_y = rando3;
			}],


//*

/*
			["distance2D b\t", function() {
				µ.distance2D(µ.rand(1), µ.rand(1), µ.rand(1), µ.rand(1));
			}],

			["distance2D_manhattan b\t", function() {
				µ.distance2D_manhattan(µ.rand(1), µ.rand(1), µ.rand(1), µ.rand(1));
			}],

			["Math.random\t", function() {
				global_var = Math.random(1);
			}],
			["Math.random * 5\t", function() {
				global_var = Math.random(1);
				global_var = Math.random(1);
				global_var = Math.random(1);
				global_var = Math.random(1);
				global_var = Math.random(1);
			}],
*/

/*
			["Math.random\t", function() {
				global_var = Math.random(1);
			}],
			["µ.rand(1)\t",function() {
				global_var = µ.rand(1);
			}],

			["µ.randerp(0.5, 0.5, 0.5)\t",function() {
				global_var = µ.randerp(0.5, 0.5, 0.5);
			}],

			["µ.randerp(0.5, 0.5, 1.5)\t",function() {
				global_var = µ.randerp(0.5, 0.5, 1.5);
			}],

			["µ.randerp(0.5, 0.5, 100.5)\t",function() {
				global_var = µ.randerp(0.5, 0.5, 100.5);
			}],

			["µ.randerp(0.5, 0.5, Math.pow(2.5, 2.5))\t",function() {
				global_var = µ.randerp(0.5, 0.5, Math.pow(2.5, 2.5));
			}],

			["bm.rand.float(1)\t",function() {
				global_var = bm.rand.float(1);
			}],

			["bm.rand.random(1)\t",function() {
				global_var = bm.rand.random(1);
			}],

			["Math.sin()\t", function() {
				global_var = Math.sin(global_var);
			}],
			["Math.cos()\t", function() {
				global_var = Math.cos(global_var);
			}],
*/


/*

			["Math.max\t", function() {
				global_var = Math.max(global_var, global_var * global_var);
			}],
			["Math.maxB\t", function() {
				global_var = Math.max(global_var, global_var + 7);
			}],
			["Math.maxC\t", function() {
				global_var = global_var > global_var * global_var ? global_var : global_var * global_var;
			}],
			["Math.max2\t", function() {
				global_var = Math.max(global_var, global_var * global_var, global_var * global_var);
			}],
			["Math.max2B\t", function() {
				global_var = Math.max(global_var, global_var + 7, global_var + 5);
			}],
			["mult\t\t", function() {
				global_var = global_var * global_var * global_var;
			}],
*/
		];
		bm.fonts = new µ.WebGL_Font(bm.c, bm.c.canvas.ctx, bm.cameras.c, bm.c.textures);
		bm.FONT_DEFAULT = bm.fonts.add_font('Tahoma', 'normal', 400, 512);
		bm.runs = 0;
		bm.benchmark_totals = [];
		bm.benchmark_avg = [];
		for (var i = 0; i < bm.benchmarks.length; i++)
		{
			bm.benchmark_totals.push(0);
			bm.benchmark_avg.push(0);
		}
		bm.x = 0;
		return 'done!';
	},
];

bm.think = function(time_delta) {
	bm.now += time_delta;
};

bm.render = function()
{
	rando1 = µ.rand_int(OBJECT_COUNT - 1);
	rando2 = µ.rand_int(OBJECT_COUNT - 1);
	rando3 = - 0.5 + µ.rand(1.0);
	for (var i = 0; i < bm.benchmarks.length; i++)
	{
		var benchmark_func = bm.benchmarks[i][1];
		var before = performance.now();
		

		benchmark_func();

		for (var j = 0; j < 200; j++)
		{
			benchmark_func();


		}
		
		var after = performance.now();
		bm.benchmark_avg[i] = (bm.benchmark_avg[i] + (after - before)) / 2; // haha ^^
		bm.benchmark_totals[i] += after - before;
	}
	var output = '';
	var fastest_time = 9999999999999999999999999999;
	var slowest_time = 0;
	var fastest = -1;
	for (var i = 0; i < bm.benchmarks.length; i++)
	{
		slowest_time = Math.max(slowest_time, bm.benchmark_totals[i]);
		if (fastest_time > bm.benchmark_totals[i])
		{
			fastest_time = bm.benchmark_totals[i]
			fastest = i;
		}

	}
	var bar_height = 1 / bm.benchmarks.length;

	for (var i = bm.benchmarks.length - 1; i >= 0; i--)
	{
		var hmm = (i/bm.benchmarks.length);
		var frac = 1 / (bm.benchmark_totals[i] / fastest_time);
		var i_bar_height = i * bar_height;
		
		bm.c.rectangle.draw(bm.CAM_STRETCH,
			frac / 2,
			i_bar_height + bar_height / 2,
			frac,
			bar_height * 0.95,
			90,
			hmm * 360, 1.0, 0.25, 0.75,
			hmm * 360, 1.0, 0.25, 0.75,
			hmm * 360, 0.9, 0.65, 0.75,
			hmm * 360, 0.9, 0.65, 0.75
		);

		bm.fonts.draw_text(
			bm.benchmarks[i][0], 1,
			bm.CAM_STRETCH, bm.FONT_DEFAULT, 0.05, i_bar_height + bar_height / 4, 0.025, 0.08, 0.00351,
			0, 0, .99, .99,
			0, 0, .9, .99,
			0, 0, .85, .99,
			0, 0, .8, .99
			);

		var pos_x = frac - 0.015;
		var pos_y = i_bar_height + bar_height / 1.4;
		bm.fonts.draw_text(
			"" + (Math.round(frac * 1000) / 10), 1,
			bm.CAM_STRETCH, bm.FONT_DEFAULT,
			pos_x,
			pos_y,
			0.015, 0.07, 0.002,
			0, 0, .0, .99,
			0, 0, .0, .99,
			0, 0, .0, .99,
			0, 0, .0, .99
			);


		bm.fonts.draw_text(
			"" + (Math.round(frac * 1000) / 10), 1,
			bm.CAM_STRETCH, bm.FONT_DEFAULT,
			pos_x - 0.001,
			pos_y + 0.001,
			0.015, 0.07, 0.002,
			0, 0, 1, .99,
			0, 0, 1, .99,
			0, 0, 1, .99,
			0, 0, 1, .99
			);

	}
	bm.c.flush_all();
	bm.fonts.flush_all();
	bm.runs++;
};

var app = new µ.app(bm, bm.init, bm.think, bm.render);