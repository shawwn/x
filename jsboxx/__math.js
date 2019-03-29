µ.mod = function(a, b) {
  var r = a % b;
  return (r * b < 0) ? r + b : r;
};

µ.between = function(min, val, max)
{
	return Math.min(max, Math.max(min, val));
};

µ.unlog = function(n, base)
{
	return Math.pow(base ? base : Math.E, n);
};

µ.log_base = function(n, base)
{
	return Math.log(n)/(base ? Math.log(base) : 1);
};


if (!Math.log10) Math.log10 = function(t)
{
	return Math.log(t)/Math.LN10;
};

µ.round_to = function(value, accuracy)
{
	return Math.round(value / accuracy) * accuracy;
}
