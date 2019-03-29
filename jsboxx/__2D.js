µ.bezier = function (t, points)
{
	var point_count = points.length / 3;
	while (point_count > 1)
	{
		for (i = 0; i < (point_count - 1); i++)
		{
			var p1x = points[i * 3 + 0];
			var p1y = points[i * 3 + 1];
			var p1z = points[i * 3 + 2];
			var p2x = points[i * 3 + 3];
			var p2y = points[i * 3 + 4];
			var p2z = points[i * 3 + 5];
			points[i * 3 + 0] = p1x * (1 - t) + p2x * t;
			points[i * 3 + 1] = p1y * (1 - t) + p2y * t;
			points[i * 3 + 2] = p1z * (1 - t) + p2z * t;
		}
		point_count--;
	}
	return [points[0], points[1], points[2]];
}

µ.distance2D = function (a_x, a_y, b_x, b_y)
{
	return Math.sqrt((a_x - b_x) * (a_x - b_x) + (a_y - b_y) * (a_y - b_y));
};

µ.distance2Dsquared = function (a_x, a_y, b_x, b_y)
{
	return (a_x - b_x) * (a_x - b_x) + (a_y - b_y) * (a_y - b_y);
};


µ.distance2D_manhattan = function (a_x, a_y, b_x, b_y)
{
	return Math.max(Math.abs(a_x - b_x), Math.abs(a_y - b_y));
};

µ.collision_rectangle_2_dot = function (a_x, a_y, a_w, a_h, b_x, b_y)
{
	return (((a_x + a_w) > b_x) &&
			((a_y + a_h) > b_y) &&
			((a_x - a_w) < b_x) && 
			((a_y - a_h) < b_y));
};

µ.collision_rectangles = function (a_x1, a_y1, a_x2, a_y2, b_x1, b_y1, b_x2, b_y2)
{

	return (a_x1 < b_x2 && a_x2 > b_x1 && a_y1 < b_y2 && a_y2 > a_y1);


	//return µ.distance2D(a_x, a_y, b_x, b_y) < (a_w + b_w + a_h + b_h) / 8; // WTF
/*	
	return !((a_x + a_w < b_x) || 
			(a_x > b_x + b_w) || 
			(a_y - a_h < b_y) ||
			(a_y < b_y - b_h));

	return !((a_x + a_w < b_x - b_w) || 
			(a_y + a_h < b_y - b_h) ||
			(a_x - a_w > b_x + b_w) || 
			(a_y - a_h < b_y + b_h));
*/			
};

µ.collision_circles = function (a_x, a_y, a_r, b_x, b_y, b_r)
{
	return µ.distance2D(a_x, a_y, b_x, b_y) < (a_r + b_r);
};

µ.vector2D_length = function(a_x, a_y, b_x, b_y)
{
	var dist_x = b_x - a_x;
	var dist_y = b_y - a_y;
	return Math.sqrt(dist_x * dist_x + dist_y * dist_y);
};

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

µ.turn = function(angle1, angle2) {
  var degrees = µ.mod(angle2, 360) - µ.mod(angle1, 360);
  if (degrees > 180) {
    degrees = degrees - 360;
  }
  else if (degrees <= -180)
  {
    degrees = 360 + degrees;
  }
  return degrees;
};

µ.bresenham = function (x0, y0, x1, y1, callback)
{
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx-dy;
	while(true)
	{
		if (callback(x0,y0) == 0) return 0;
		if (x0==x1 && y0==y1) return 1;
		var e2 = 2*err;
		if (e2 >-dy){ err -= dy; x0  += sx; }
		if (e2 < dx){ err += dx; y0  += sy; }
	}
	return 1;
};