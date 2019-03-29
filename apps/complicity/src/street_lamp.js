btx.Street_Lamp = function(pos_x, pos_y)
{
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	
	this.green = 0.7 + µ.rand(0.15);
	
	this.turning_off_at = 4 + µ.rand(2);
	this.turned_off_at = this.turning_off_at + 1 + µ.rand(1);
	this.turning_on_at = 16 + µ.rand(2);
	this.turned_on_at = this.turning_on_at + 1 + µ.rand(1);
}

btx.Street_Lamp.prototype.draw = function()
{
	var frac = 0;
	if (btx.game.current_time < this.turning_off_at * 3600)
	{
		var frac = 1;
	}
	else if (btx.game.current_time < this.turned_off_at * 3600)
	{
		var frac = 1 - (btx.game.current_time - this.turning_off_at * 3600) / ((this.turned_off_at - this.turning_off_at) * 3600);
	}
	else if (btx.game.current_time > this.turned_on_at * 3600)
	{
		var frac = 1;
	}
	else if (btx.game.current_time > this.turning_on_at * 3600)
	{
		var frac = (btx.game.current_time - this.turning_on_at * 3600) / ((this.turned_on_at - this.turning_on_at) * 3600);
	}

	if (frac > 0)
	{
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			3.0,
			3.0,
			1, 1, 90,
			1, this.green, 0.5, 0.8 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			6.0,
			6.0,
			1, 1, 90,
			1, this.green, 0.4, 0.7 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			12.0,
			12.0,
			1, 1, 90,
			1, this.green, 0.3, 0.6 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured_rgb.draw(
			btx.CAM_PLAYER,
			btx.tex_white_circle_soft,
			this.pos_x,
			this.pos_y,
			24.0,
			24.0,
			1, 1, 90,
			1, this.green, 0.2, 0.5 * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
	}

}


btx.Street_Lamp.prototype._ = function()
{
}

