"use strict";

rvr.think__in_map = function(time_delta)
{
//	return;
	// depthmap not loaded yet
	if (rvr.map.pix_depthmap == null)
	{
		return;
	}
	rvr.screen_shake -= time_delta;
	if (rvr.screen_shake < 0)
		rvr.screen_shake = 0;
	//rvr.scent.grab_buffer_maybe();

	rvr.scents.grab_buffer_maybe();
	rvr.gui.think(time_delta);
	rvr.pickups.think(time_delta);
	rvr.player.think(time_delta);
	rvr.projectiles.think(time_delta);
/*
		rvr.tex_lightmap	= rvr.c.update_texture_from_canvas(µ.generate_canvas_texture(16, 16, function(ctx, size_x, size_y, data) {
			var imgd = ctx.getImageData(0, 0, size_x, size_y);
			pix = imgd.data;
			for (var i = 0; i < (size_x*size_y); i++)
			{
				pix[i * 4 + 0] = µ.rand_int(255);
				pix[i * 4 + 1] = µ.rand_int(255);
				pix[i * 4 + 2] = µ.rand_int(255);
				pix[i * 4 + 3] = µ.rand_int(255);
			}
			ctx.putImageData(imgd, 0, 0);
		}, this), rvr.tex_lightmap, true);
//*/

	//console.log(rvr_agents__pos_x[0], rvr.camera_player.pos_x, rvr.desired_cam_pos_x);

	//rvr.camera_player.set_zoom(rvr.camera_player.zoom_ - (rvr.camera_player.zoom_ - rvr.desired_zoom) / 32);
	rvr.camera_player.recalc_mouse();
	rvr.agents.think(time_delta);
	rvr.camera_player.old_mouse_pos_x = rvr.camera_player.mouse_pos_x;
	rvr.camera_player.old_mouse_pos_y = rvr.camera_player.mouse_pos_y;
	rvr.scents.think(time_delta);
	rvr.smoke.process_steps(1, rvr.map.tex_depthmap_interp_nearest, rvr.map.tex_heightmap, null);

	rvr.fluids.process_steps(1, rvr.map.tex_depthmap, rvr.map.tex_heightmap);

//*/	

	//var scent_pixel_x = Math.floor( (rvr_agents__pos_x[0] / rvr.map.size_x) * rvr.scent_player.texture_size * 1.0);
	//var scent_pixel_y = Math.floor( (1.0 - rvr_agents__pos_y[0] / rvr.map.size_y) * rvr.scent_player.texture_size * 1.0);
	//rvr.scent_player.set_data_subimage(new Float32Array([1,1,-.9,1]), scent_pixel_x, scent_pixel_y, 1, 1);

};