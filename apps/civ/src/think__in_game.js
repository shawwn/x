'use strict';

civ.think__in_game = function(time_delta)
{
	if (civ.input.KEY_SPACE.pressed)
	{
		
		civ.particlesGPU.spawn(
			civ.now,
			2,
			civ.camera_player.mouse_pos_x,
			civ.camera_player.mouse_pos_y,
			civ.old_mouse_pos_x,
			civ.old_mouse_pos_y,
			0.23 * civ.camera_player.zoom_,
			0,
			0,
			360, 0,
			civ.particles__explode,
			2500,		//	lifespan
			0, 1, 1.0, 1.0,
			360,			//	vary_angle
			0.05 * civ.camera_player.zoom_,		//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.1,			//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			500,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);

	}

	civ.map.think(time_delta);
	civ.player.think(time_delta);
	civ.persons.think(time_delta);
	civ.units.think(time_delta);

	if (!civ.input.KEY_SHIFT.pressed && !civ.input.KEY_ALT_LEFT.pressed)
	{
		if (civ.input.KEY_Q.pressed)
		{
			civ.desired_zoom = civ.camera_player.zoom_ + time_delta * 0.00125 * civ.camera_player.zoom_;
			
		}
		if (civ.input.KEY_E.pressed)
		{
			civ.desired_zoom = civ.camera_player.zoom_ - time_delta * 0.00125 * civ.camera_player.zoom_;
		}
	}
	else if (civ.input.KEY_SHIFT.pressed)
	{
		if (civ.input.KEY_Q.pressed)
		{
			civ.desired_zoom = civ.camera_player.zoom_ + time_delta * 0.005 * civ.camera_player.zoom_;
			
		}
		if (civ.input.KEY_E.pressed)
		{
			civ.desired_zoom = civ.camera_player.zoom_ - time_delta * 0.005 * civ.camera_player.zoom_;
		}
	}
	else if (civ.input.KEY_ALT_LEFT.pressed)
	{
		if (civ.input.KEY_Q.pressed)
		{
			civ.desired_zoom = civ.WORLD_SIZE_X;
		}
		if (civ.input.KEY_E.pressed)
		{
			civ.desired_zoom = 100;
		}
	}
	civ.camera_player.set_zoom(Math.min(civ.desired_zoom, civ.WORLD_SIZE_X));
	civ.camera_player.set_pos(civ.camera_player.pos_x, civ.camera_player.pos_y);

	if (civ.input.KEY_C.pressed || civ.input.KEY_Q.pressed || civ.input.KEY_E.pressed)
	{
		civ.desired_cam_pos_x = civ.camera_player.mouse_pos_x;
		civ.desired_cam_pos_y = civ.camera_player.mouse_pos_y;
	}
	civ.camera_player.set_pos(
		civ.camera_player.pos_x + (civ.desired_cam_pos_x - civ.camera_player.pos_x) / 7,
		civ.camera_player.pos_y + (civ.desired_cam_pos_y - civ.camera_player.pos_y) / 7
		);

	civ.camera_player.set_pos(
		civ.units.u[civ.player.selected_unit].pos_x,
		civ.units.u[civ.player.selected_unit].pos_y
		);


	civ.old_mouse_pos_x = civ.camera_player.mouse_pos_x;
	civ.old_mouse_pos_y = civ.camera_player.mouse_pos_y;
	civ.cameras.handle_mousemove(civ.input.mouse_x, civ.input.mouse_y);
	//console.log(civ.input.mouse_x, civ.input.mouse_y);
};
