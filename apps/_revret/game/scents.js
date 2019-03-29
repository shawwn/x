rvr.Scents = function()
{
	this.scent = new Array(rvr.FACTION_COUNT);
	this.scent_buffer = new Array(rvr.FACTION_COUNT);
	this.last_scent_update = new Array(rvr.FACTION_COUNT);
	this.last_scent_buffer_update = new Array(rvr.FACTION_COUNT);

	var update_spread = rvr.scent_update_frequency / rvr.FACTION_COUNT;

	for (var i = 0; i < rvr.FACTION_COUNT; i++)
	{
		this.last_scent_update[i] = 0;
		this.last_scent_buffer_update[i] = Math.round(i * update_spread);
		this.scent_buffer[i] = new Float32Array(rvr.scent_map_size * rvr.scent_map_size * 4);
		this.scent[i] = new µ.WebGL_Framebuffer_Pingpong(rvr.c, rvr.c.gl, rvr.cameras.c, rvr.c.textures, rvr.scent_map_size);
		this.scent[i].set_parameters(
			1.1, 0.05,
			999999999999999999999990.0000001, 	0, 0.7, 	0.8, 	0.0000000001, 		0.00000000000000000000000001,
			999999999999999999999990.0000001, 	0, 0.7, 	0.8, 	0.0000000001, 		0.00000000000000000000000001,
			999999999999999999999990.0000001, 	0, 0.7, 	0.8, 	0.0000000001, 		0.00000000000000000000000001
/*
		SelfFactor1, CornerPenalty1, FalloffAboveOne1, FalloffBelowOne1, DecayAboveOne1, DecayBelowOne1,
		SelfFactor2, CornerPenalty2, FalloffAboveOne2, FalloffBelowOne2, DecayAboveOne2, DecayBelowOne2,
		SelfFactor3, CornerPenalty3, FalloffAboveOne3, FalloffBelowOne3, DecayAboveOne3, DecayBelowOne3
*/
		);
	}
}

rvr.Scents.prototype.grab_buffer_maybe = function()
{
	for (var i = 0; i < rvr.FACTION_COUNT; i++)
	{
		this.scent[i].grab_buffer_maybe();
	}
}


rvr.Scents.prototype.think = function(time_delta)
{
	for (var i = 0; i < rvr.FACTION_COUNT; i++)
	{
		if (rvr.now - this.last_scent_update[i] >= rvr.scent_update_frequency)
		{
			this.last_scent_update[i] = rvr.now;
			if (rvr.now - this.last_scent_buffer_update[i] >= rvr.scent_buffer_update_frequency)
			{
				this.scent[i].process_steps(1, rvr.map.tex_depthmap, rvr.map.tex_heightmap, this.scent_buffer[i]);
				this.last_scent_buffer_update[i] = rvr.now;	
			}
			else
			{
				this.scent[i].process_steps(1, rvr.map.tex_depthmap, rvr.map.tex_heightmap, null);
			}
		}
	}
}

rvr.Scents.prototype.make_sound = function(pos_x, pos_y, strength)
{
/*	
	var scent_pos_x = µ.between(0, Math.floor((			pos_x * rvr.map.size_x_over_one) * rvr.scent.texture_size), rvr.scent.texture_size - 1);
	var scent_pos_y = µ.between(0, Math.floor((1.0 - 	pos_y * rvr.map.size_y_over_one) * rvr.scent.texture_size), rvr.scent.texture_size - 1);

	var tile_index = scent_pos_y * rvr.scent_map_size + scent_pos_x;
	rvr.scent_buffer[tile_index * 4 + 1] = Math.max(rvr.scent_buffer[tile_index * 4 + 1], 1 + strength);
	rvr.temp_array[0] = rvr.scent_buffer[tile_index * 4  + 0];
	rvr.temp_array[1] = rvr.scent_buffer[tile_index * 4  + 1];
	rvr.temp_array[2] = rvr.scent_buffer[tile_index * 4  + 2];
	rvr.temp_array[3] = rvr.scent_buffer[tile_index * 4  + 3];
//	rvr.scent.get_data(rvr.temp_array, scent_pos_x, scent_pos_y, 1, 1);
//	rvr.temp_array[1] += 10 * strength;
	rvr.scent.set_data_subimage(rvr.temp_array, scent_pos_x, scent_pos_y, 1, 1);
*/
}

rvr.Scents.prototype._ = function()
{

}