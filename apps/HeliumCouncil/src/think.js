"use strict";

hc.think = function(time_delta)
{
	time_delta *= hc.timescale;
	hc.now += time_delta;
	hc.game.think_switch(time_delta);
	hc.game.think(time_delta);
	//console.log(hc.map_pixels_looked_at);
};

hc.think__in_map = function(time_delta)
{

	if (hc.input.KEY_Q.pressed)
	{
		hc.desired_zoom = hc.camera_player.zoom_ + time_delta * 0.025 * hc.camera_player.zoom_;
		
	}
	if (hc.input.KEY_E.pressed)
	{
		hc.desired_zoom = hc.camera_player.zoom_ - time_delta * 0.025 * hc.camera_player.zoom_;
	}
	
	hc.desired_zoom = µ.between(hc.min_zoom, hc.desired_zoom, hc.max_zoom);
	if (hc.desired_zoom != hc.camera_player.zoom_)
	{
		hc.camera_player.set_zoom(hc.camera_player.zoom_ - (hc.camera_player.zoom_ - hc.desired_zoom) / 16);
	}
	hc.camera_player.set_pos(hc.camera_stretch.mouse_pos_x * hc.universe_size_x, (1 - hc.camera_stretch.mouse_pos_y) * hc.universe_size_y);

	hc.universe.think(time_delta);
	
};
