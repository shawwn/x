rvr.Light = function()
{
	this.pos_x		= 0;
	this.pos_y		= 0;
	this.pos_z		= 0;
	this.range		= 0;
	this.range360	= 0;
	this.falloff	= 0;
	this.color_r	= 0;
	this.color_g	= 0;
	this.color_b	= 0;
	this.color_a	= 0;
	this.direction	= 0;
	this.cone		= 0;
}

rvr.Lights = function()
{
	this.light_count_current = 0;

	this.light_count = 2000;
	this.lights = new Array(this.light_count);
	
	for (var i = 0; i < this.light_count; i++)
	{
		this.lights[i] = new rvr.Light();
	}
	this.framebuffer = new µ.WebGL_Framebuffer(rvr.c, rvr.c.gl, rvr.c.textures, 512);
}

rvr.Lights.prototype.new_frame = function()
{
	this.light_count_current = 0;
}

rvr.Lights.prototype.add = function(pos_x, pos_y, pos_z, range, range360, falloff, color_r, color_g, color_b, color_a, direction, cone)
{
	var light = this.lights[this.light_count_current];

	light.pos_x         = pos_x;
	light.pos_y         = pos_y;
	light.pos_z         = pos_z;
	light.range         = range;
	light.range360      = range360;
	light.falloff       = falloff;
	light.color_r       = color_r;
	light.color_g       = color_g;
	light.color_b       = color_b;
	light.color_a       = color_a;
	light.direction     = direction;
	light.cone			= cone;

	this.light_count_current++;
/*

	var parameter_names = rvr.pixel_store__lights.parameter_names;
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.pos_x, pos_x);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.pos_y, pos_y);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.pos_z, pos_z);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.range, range);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.range360, range360);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.falloff, falloff);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.color_r, color_r);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.color_g, color_g);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.color_b, color_b);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.color_a, color_a);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.direction, direction);
	rvr.pixel_store__lights.set(this.light_count_current, parameter_names.cone, cone);
	rvr.light_and_shadow2.add_light(pos_x, pos_y, pos_z, range, range360, falloff, color_r, color_g, color_b, color_a, direction, cone);
*/
}

rvr.Lights.prototype.render = function()
{              

	this.framebuffer.bind_buffer();
	rvr.c.gl.clearColor(0,0,0,1);
	rvr.c.gl.clear(rvr.c.gl.COLOR_BUFFER_BIT);
	
	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE, rvr.c.gl.FUNC_ADD);

	for (var i = 0; i < this.light_count_current; i++)
	{
		var light = this.lights[i];
		//console.log(i, light.pos_x, light.pos_y, light.range);
		
		rvr.c.rectangle_textured_rgb.draw(
			rvr.CAM_PLAYER, rvr.tex_white_circle_soft,
			light.pos_x,
			light.pos_y,
			light.range * 2,
			light.range * 2,
			1, 1, 90,
			//1, 1, 1, 1,
			light.color_r, light.color_g, light.color_b, light.color_a,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);

		
	}
	rvr.c.flush_all();
	rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

	this.framebuffer.unbind_buffer();

	return;	
	
	if (!rvr.input.KEY_F10.pressed)
		rvr.c.set_blending(rvr.c.gl.DST_COLOR, rvr.c.gl.ZERO, rvr.c.gl.FUNC_ADD);

	if (new_way)
	{
		rvr.light_and_shadow2.draw(
			rvr.CAM_PLAYER,
			rvr.map.tex_heightmap,
			rvr.world_size_x_div_2,
			rvr.world_size_y_div_2,
			rvr.world_size_x,
			rvr.world_size_y,
			0, 1, 1, 1.0,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);


		rvr.light_and_shadow2.flush_all(
			rvr.map.tex_depthmap_interp_linear,
			rvr.fluids.current_texture
			);
	}
	else
	{
		//*
		rvr.light_and_shadow.set_light_count(this.light_count_current);
		rvr.pixel_store__lights.render_data_texture();
		//*/

		rvr.light_and_shadow.draw(
			rvr.CAM_PLAYER,
			rvr.map.tex_heightmap,
			rvr.world_size_x_div_2,
			rvr.world_size_y_div_2,
			rvr.world_size_x,
			rvr.world_size_y,
			0, 1, 1, 1.0,
			-1,-1,-1,-1,
			-1,-1,-1,-1,
			-1,-1,-1,-1);


		rvr.light_and_shadow.flush_all(
			rvr.map.tex_depthmap_interp_linear,
			rvr.fluids.current_texture,
			rvr.input.KEY_F9.pressed
			);
	}


/*
	rvr.c.rectangle_textured.draw(
		rvr.CAM_PLAYER,
		rvr.pixel_store__lights.data_texture,
		rvr.world_size_x_div_2,
		rvr.world_size_y_div_2,
		rvr.world_size_x,
		rvr.world_size_y,
		0, 1, 1, 1.0,
		-1,-1,-1,-1,
		-1,-1,-1,-1,
		-1,-1,-1,-1);
	rvr.c.flush_all();
*/

	if (!rvr.input.KEY_F10.pressed)
		rvr.c.set_blending(rvr.c.gl.SRC_ALPHA, rvr.c.gl.ONE_MINUS_SRC_ALPHA, rvr.c.gl.FUNC_ADD);

}

rvr.Lights.prototype._ = function()
{
}