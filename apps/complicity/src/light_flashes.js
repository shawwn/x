btx.Light_Flashes = function()
{
	this.light_flashes = new Array(btx.lightflash_count);

	for (var i = 0, len = btx.lightflash_count; i < len; i++)
	{
		this.light_flashes[i] = new btx.Light_Flash();
	}
	
}

btx.Light_Flashes.prototype.think = function(time_delta)
{
	for (var i = 0, len = this.light_flashes.length; i < len; i++)
	{
		var light_flash = this.light_flashes[i];
		if (light_flash.is_active)
		{
			light_flash.age += time_delta;
			if (light_flash.age >= light_flash.lifespan)
			{
				light_flash.is_active = false;
			}
		}
	}
}

btx.Light_Flashes.prototype.add = function(pos_x, pos_y, lifespan, peak, radius, brightness, r, g, b)
{
	for (var i = 0, len = this.light_flashes.length; i < len; i++)
	{
		var light_flash = this.light_flashes[i];
		if (!light_flash.is_active)
		{
			light_flash.is_active = true;
			light_flash.pos_x = pos_x;
			light_flash.pos_y = pos_y;
			light_flash.age = 0;
			light_flash.lifespan = lifespan;
			light_flash.peak = peak;
			light_flash.radius = radius;
			light_flash.brightness = brightness;
			light_flash.r = r;
			light_flash.g = g;
			light_flash.b = b;
			return;
		}
	}
}

btx.Light_Flashes.prototype.draw = function(time_delta)
{
	for (var i = 0, len = this.light_flashes.length; i < len; i++)
	{
		var light_flash = this.light_flashes[i];
		
		if (light_flash.is_active)
		{
			if (light_flash.age <= light_flash.peak)
			{
				var frac = light_flash.age / light_flash.peak;
			}
			else
			{
				var frac = 1 - (light_flash.age - light_flash.peak) / (light_flash.lifespan - light_flash.peak)   ;
			}
			btx.c.rectangle_textured_rgb.draw(
					btx.CAM_PLAYER,
					btx.tex_white_circle_soft,
					light_flash.pos_x,
					light_flash.pos_y,
					light_flash.radius * frac,
					light_flash.radius * frac,
					1, 1, 90,
					light_flash.r, light_flash.g, light_flash.b, light_flash.brightness * frac, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		}
	}
}


btx.Light_Flashes.prototype.draw_displacement = function(time_delta)
{
	for (var i = 0, len = this.light_flashes.length; i < len; i++)
	{
		var light_flash = this.light_flashes[i];
		
		if (light_flash.is_active)
		{
			if (light_flash.age <= light_flash.peak)
			{
				var frac = light_flash.age / light_flash.peak;
			}
			else
			{
				var frac = 1 - (light_flash.age - light_flash.peak) / (light_flash.lifespan - light_flash.peak)   ;
			}
			btx.c.rectangle_textured_rgb.draw(
				btx.CAM_PLAYER,
				btx.tex_circle_displacement,
				//btx.tex_white_circle_soft,
				light_flash.pos_x,
				light_flash.pos_y,
				light_flash.radius * frac,
				light_flash.radius * frac,
				1, 1, 90,
				1.0, 1.0, light_flash.brightness * frac, 1.0, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		}
		
	}
	btx.c.rectangle_textured_rgb.flush_all();
}






