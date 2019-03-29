"use strict";

// when in doubt, just throw everything in here :P

µ.Le_Accumulator = function(bucket_count)
{
	this.bucket_count = bucket_count;
	this.buckets = new Array(bucket_count);
	for (var i = 0; i < bucket_count; i++)
	{
		this.buckets[i] = 0;
	}
	this.current_bucket = 0;
	this.current_average = 0;
	this.current_accum = 0;
}

µ.Le_Accumulator.prototype.add = function(value)
{
	this.buckets[this.current_bucket] = value;
	this.current_accum += value;
	this.current_bucket++;
	if (this.current_bucket == this.bucket_count)
	{
		this.current_bucket = 0;
		this.current_average = this.current_accum / this.bucket_count;
		this.current_accum = 0;
	}
}

µ.Le_Accumulator.prototype.read = function()
{
	return this.current_average;
/*
	var average = 0;
	for (var i = 0; i < this.buckets.length; i++)
	{
		average += this.buckets[i];
	}
	return (average / this.buckets.length);
*/
}

µ.include = function(path, func_onload)
{
	var el = document.createElement('script');
	el.setAttribute('type', 'text/javascript');
	el.setAttribute('src', path);
	el.onload = func_onload;
	document.body.appendChild(el);
}

µ.rand = function(max)
{
	return max == 0 ? 0 : Math.random() * max;
};

µ.rand_int = function(max){
	return max == 0 ? 0 : Math.floor(Math.random() * (max + 1));
};

µ.randerp = function(middle, deviation, bias)
{
	if (bias < 1.0)
	{
		var rand = Math.pow(Math.random(), bias);
		if (Math.random() > 0.5)
		{
			return middle + deviation - rand * deviation;
		}
		else
		{
			return middle - deviation + rand * deviation;
		}
	}
	else
	{
		var rand = Math.pow(Math.random(), 1 / bias);
		if (Math.random() > 0.5)
		{
			return middle - rand * deviation;
		}
		else
		{
			return middle + rand * deviation;
		}
	}
}

µ.lead_target_stats = {
	bailed:					0,
	failed:					0,
	attempts_for_failures:	0,
	successes:				0,
	attempts_for_success:	0,
	
};

µ.lead_target = function (
	_angle_and_eta,
	source_x, source_y,
	target_x, target_y,
	target_speed_x, target_speed_y,
	projectile_speed,
	max_attempts,
	max_deviation,
	max_eta,
	min_x, max_x,
	min_y, max_y
	)
{
	var eta = 0;
	var old_eta = -1;
	var dist = 0;
	var final_target_pos_x = target_x;
	var final_target_pos_y = target_y;
	var i = 0;
	while (i < max_attempts && Math.abs(eta - old_eta) > max_deviation)
	{
		i++;
		old_eta = eta;
		final_target_pos_x = target_x + target_speed_x * old_eta;
		final_target_pos_y = target_y + target_speed_y * old_eta;
		dist = µ.distance2D(source_x, source_y, final_target_pos_x, final_target_pos_y);
		eta = dist / projectile_speed;
	}
	
	if (i == max_attempts)
	{
		µ.lead_target_stats.bailed++;
		
		//console.log('bailing the fuck out yo', i);
		_angle_and_eta[0] = -1;
		_angle_and_eta[1] = -1;
		return false;
	}

/*

	if (final_target_pos_x < min_x) final_target_pos_x = min_x;
	if (final_target_pos_x > max_x) final_target_pos_x = max_x;
	if (final_target_pos_y < min_y) final_target_pos_y = min_y;
	if (final_target_pos_y > max_y) final_target_pos_y = max_y;
*/

	if (	(max_eta && eta > max_eta)
		||	final_target_pos_x < min_x
		||	final_target_pos_x > max_x
		||	final_target_pos_y < min_y
		||	final_target_pos_y > max_y)
	{
		µ.lead_target_stats.failed++;
		µ.lead_target_stats.attempts_for_failures += i;
		//console.log('out of bounds/eta');
		_angle_and_eta[0] = -1;
		_angle_and_eta[1] = -1;
		return false;
	}

	_angle_and_eta[0] = µ.vector2D_to_angle(final_target_pos_x - source_x, final_target_pos_y - source_y);
	_angle_and_eta[1] = eta;
	
	µ.lead_target_stats.successes++;
	µ.lead_target_stats.attempts_for_success += i;
	

	return true;
}

µ.directions = [
	[1,0],
	[-1,0],
	[0,1],
	[0,-1],
];

µ.corners = [
	[1,1],
	[1,-1],
	[-1,-1],
	[-1,1],
];

µ.random_direction = function ()
{
	var dir = µ.rand_int(3);
	if (dir == 0)
	{
		var x = 1;
		var y = 0;
	}
	else if (dir == 1)
	{
		var x = -1;
		var y = 0;
	}
	else if (dir == 2)
	{
		var x = 0;
		var y = 1;
	}
	else if (dir == 3)
	{
		var x = 0;
		var y = -1;
	}
	return {x:x, y:y};
};

// mental note: never EVER nest calls to pick_randomly_from_weighted_list() ^^
µ._eligible_array = [];

µ.pick_best_from_weighted_list = function(list, fitness_func, data)
// adapted from http://roguebasin.roguelikedevelopment.org/index.php?title=Weighted_random_generator
{
	var best_fitness = 0;
	var picked = null;
	for (var i = 0; i < list.length; i++)
	//for (var i in list)
	{
		var fitness = fitness_func(list[i], i, data);
		if(fitness > best_fitness)
		{
			best_fitness = fitness;
			picked = i;
		}
	}
	return picked;
};


µ.pick_randomly_from_weighted_list = function(list, fitness_func, data)
// adapted from http://roguebasin.roguelikedevelopment.org/index.php?title=Weighted_random_generator
{
	var max_roll = 0;
	var eligible = [];
	for (var i = 0; i < list.length; i++)
	{
		var fitness = fitness_func(list[i], i, data);
		if(fitness > 0)
		{
			eligible.push([i, fitness]);
			max_roll += fitness;
		}
	}
	if (eligible.length == 0)
	{
		return null;
	}
	var roll = Math.random() * max_roll;
	for (var i = 0; i < eligible.length; i++)
	{
		if (roll < eligible[i][1])
		{
			return eligible[i][0];
		}
		roll -= eligible[i][1];
	}
};


µ.pick_randomly_from_weighted_list2 = function(list, fitness_func, data)
// adapted from http://roguebasin.roguelikedevelopment.org/index.php?title=Weighted_random_generator
{
	var max_roll = 0;
	var eligible = [];
	for (var i in list)
	{
		var fitness = fitness_func(list[i], i, data);
		if(fitness > 0)
		{
			eligible.push([i, fitness]);
			max_roll += fitness;
		}
	}
	if (eligible.length == 0)
	{
		return null;
	}
	var roll = Math.random() * max_roll;
	for (var i = 0; i < eligible.length; i++)
	{
		if (roll < eligible[i][1])
		{
			return eligible[i][0];
		}
		roll -= eligible[i][1];
	}
};


/*
http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
{
	"ease":        [0.25, 0.1, 0.25, 1.0],
	"linear":      [0.00, 0.0, 1.00, 1.0],
	"ease-in":     [0.42, 0.0, 1.00, 1.0],
	"ease-out":    [0.00, 0.0, 0.58, 1.0],
	"ease-in-out": [0.42, 0.0, 0.58, 1.0]
}
*/

/*
* KeySpline - use bezier curve for transition easing function
* is inspired from Firefox's nsSMILKeySpline.cpp
* Usage:
* var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
* spline.get(x) => returns the easing value | x must be in [0, 1] range
*/
function KeySpline (mX1, mY1, mX2, mY2)
{
	this.get = function(aX)
	{
		if (mX1 == mY1 && mX2 == mY2) return aX; // linear
		return CalcBezier(GetTForX(aX), mY1, mY2);
  	};

	function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; };
	function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; };
	function C(aA1)      { return 3.0 * aA1; };

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function CalcBezier(aT, aA1, aA2)
	{
		return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  	};

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function GetSlope(aT, aA1, aA2)
	{
		return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	};

	function GetTForX(aX)
	{
		// Newton raphson iteration
		var aGuessT = aX;
		for (var i = 0; i < 4; ++i)
		{
			var currentSlope = GetSlope(aGuessT, mX1, mX2);
			if (currentSlope == 0.0)
			{
				return aGuessT;
			}
			var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
			aGuessT -= currentX / currentSlope;
		}
		return aGuessT;
	};
};
