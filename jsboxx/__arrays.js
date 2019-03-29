µ.normalize_array = function(array, result_array, cap_min, cap_max)
{
	var max = -999999999;
	var min = 999999999;
	for (var i = array.length; i--;)
	{
		if (min > array[i])
		{
			min = array[i];
		}
	}
	for (var i = array.length; i--;)
	{
		if (max < array[i])
		{
			max = array[i];
		}
	}
	for (var i = array.length; i--;)
	{
		result_array[i] = (array[i] - min) / (max-min);
	}

	for (var i = array.length; i--;)
	{
		array[i] = result_array[i];
	}

};

µ.pow_array = function(array, result_array, pow)
{
	for (var i = array.length; i--;)
	{
		result_array[i] = Math.pow(array[i], pow);
	}
};

µ.blur_array = function(array, result_array, size_x, size_y, passes, strength)
{
	for (var i = 0; i < passes; i++)
	{
		µ.smudge_array(array, result_array, size_x, size_y, strength);
		for (var j = 0; j < (size_x * size_y); j++)
		{
			array[j] = result_array[j];
		}
	}
};

µ.smudge_array = function(array, result_array, size_x, size_y, strength)
{
	if (strength === undefined)
	{
		strength = 1;	
	}
	for (var i = size_x * size_y; i--;)
	{
		var sum = array[i];
		var count = 1;
		if (i - size_x >= 0)
		{
			sum += array[i - size_x];
			count++;
		}
		if (i + size_x < size_x * size_y)
		{
			sum += array[i + size_x];
			count++;
		}
		if (i - 1 >= 0)
		{
			sum += array[i - 1];
			count++;
		}
		if (i + 1 < size_x * size_y)
		{
			sum += array[i + 1];
			count++;
		}
		result_array[i] = array[i] * (1 - strength) + strength * (sum/count);
	}
};

// http://stackoverflow.com/questions/4554252/typed-arrays-in-gecko-2-float32array-concatenation-and-expansion
function Float32Concat(first, second)
{
	var firstLength = first.length,
		result = new Float32Array(firstLength + second.length);

	result.set(first);
	result.set(second, firstLength);
	return result;
}
