rvr.Map_Polygon = function(index, max_index)
{
	this.point_count = 4;// + µ.rand_int(5);
	this.hue = µ.rand_int(360);
	this.hue = 220;

	var frac = index / max_index;

	if (µ.rand(1) > 2.6)
	{
		this.lum = 80;
		this.sat = 0;
		this.opacity = 1.0;
	}
	else
	{
		this.lum = 50;
		this.sat = 100;
		this.hue = µ.rand(360);
		this.opacity = 0.05 + 0.95 * frac;
	}

	this.points = new Array(this.point_count);
	
	this.pos_x = rvr.world_size_x / 2 + µ.angle_to_x(frac * 360) * rvr.world_size_x * (0.1 + µ.rand(0.35));
	this.pos_y = rvr.world_size_y / 2 + µ.angle_to_y(frac * 360) * rvr.world_size_x * (0.1 + µ.rand(0.35));

	this.scale_x = 0.25 + µ.rand(0.5);
	this.scale_y = 0.25 + µ.rand(0.5);
	var angle_step = 360 / this.point_count;
	for (var i = 0; i < this.point_count; i++)
	{
		distance = 0.25 + µ.rand(0.75);
		this.points[i] = [µ.angle_to_x(angle_step / 2 + i * angle_step) * distance * this.scale_x,
						  µ.angle_to_y(angle_step / 2 + i * angle_step) * distance * this.scale_y];
	}
}

rvr.Map_Polygon.prototype.draw = function(camera)
{
	for (var i = 0; i < this.point_count; i++)
	{
		var j = i < (this.point_count - 1) ? i + 1 : 0;
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER, this.points[i][0], this.points[i][1], this.points[j][0], this.points[j][1],
			0.015,
			this.hue, 1, 0.5, 0.7,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
		rvr.c.rectangle.draw_line(rvr.CAM_PLAYER, this.points[i][0], this.points[i][1], this.points[j][0], this.points[j][1],
			0.050,
			this.hue, 1, 0.5, 0.3,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
	}
}

rvr.Map_Polygon.prototype.draw_to_canvas = function(ctx, size_x, size_y, scale, opacity, draw_fill, ignore_opacity)
{
	ctx.fillStyle 	= 'hsla('+this.hue+','+this.sat+'%,'+this.lum+'%,' + ((ignore_opacity ? 1.0 : this.opacity) * opacity) + ')';
	ctx.strokeStyle = 'hsla('+this.hue+','+this.sat+'%,'+this.lum+'%,' + ((ignore_opacity ? 1.0 : this.opacity) * opacity) + ')';
	ctx.beginPath();
	ctx.moveTo(			(this.pos_x + this.points[0][0] * scale) / rvr.world_size_x * size_x,
				size_y -(this.pos_y - this.points[0][1] * scale) / rvr.world_size_x * size_y);
	for (var i = 1; i < this.point_count; i++)
	{
		ctx.lineTo(			(this.pos_x + this.points[i][0] * scale) / rvr.world_size_x * size_x,
					size_y -(this.pos_y - this.points[i][1] * scale) / rvr.world_size_x * size_y);
	}
	ctx.closePath();
	
	ctx.stroke();
	ctx.stroke;
	if (draw_fill)
	{
		ctx.fill();
	}
}

// adapted from http://stackoverflow.com/a/1968345
µ.get_line_intersection = function(
	p0_x, p0_y, p1_x, p1_y, 
	p2_x, p2_y, p3_x, p3_y,
	intersection)
{
    var
    	s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
    var
    	s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        //if (intersection != null)
        {
            //intersection.x = p0_x + (t * s1_x);
            //intersection.y = p0_y + (t * s1_y);
        }
        return true;
    }
    return false; // No collision
}

rvr.Map_Polygon.prototype.trace = function(start_x, start_y, end_x, end_y)
{
	for (var i = 0; i < this.point_count; i++)
	{
		var j = i < (this.point_count - 1) ? i + 1 : 0;
		if (µ.get_line_intersection(
			start_x, start_y, end_x, end_y, 
			this.pos_x + this.points[i][0],
			this.pos_y + this.points[i][1],
			this.pos_x + this.points[j][0],
			this.pos_y + this.points[j][1],
			null))
		{
			return true;
		}
	}
	return false;
}

rvr.Map_Polygon.prototype._ = function()
{
}