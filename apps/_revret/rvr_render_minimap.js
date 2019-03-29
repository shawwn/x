"use strict";

rvr.render_minimap = function(position_x, position_y, size_x, size_y, opacity)
{

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		position_x,
		position_y,
		size_x,
		size_y,
		90,
		0, 0, 0.5, 0.5 * opacity,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		position_x - size_x / 2 + (rvr_agents__pos_x[0] / rvr.world_size_x) * size_x,
		position_y - size_y / 2 + (rvr_agents__pos_y[0] / rvr.world_size_y) * size_y,
		rvr.camera_stretch.zoom_ * 0.0075,
		rvr.camera_stretch.zoom_ * 0.0075,
		90,
		0, 0, 1.0, 1.0 * opacity, 
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		position_x - size_x / 2 + (rvr_agents__pos_x[0] / rvr.world_size_x) * size_x,
		position_y - size_y / 2 + (rvr_agents__pos_y[0] / rvr.world_size_y) * size_y,
		rvr.camera_stretch.zoom_ * 0.005,
		rvr.camera_stretch.zoom_ * 0.005,
		90,
		0, 0, 0.0, 1.0 * opacity, 
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);




	rvr.c.rectangle.flush_all();
	rvr.fonts.flush_all();


};