asbx.think = function(time_delta)
{
	asbx.now += time_delta;

	// calculate mouse position
	asbx.camera_player.recalc_mouse();

	// set camera position
	//asbx.camera_player.set_pos(asbx.camera_player.pos_x * 0.0 + 1.0 * asbx.camera_player.mouse_pos_x, asbx.camera_player.pos_y * 0.0 + 1.0 * asbx.camera_player.mouse_pos_y);
	asbx.camera_player.set_pos(asbx.camera_player.pos_x * 0.7 + 0.3 * asbx.player.body.pos_x, asbx.camera_player.pos_y * 0.7 + 0.3 * asbx.player.body.pos_y);


	// teleport player
	if (asbx.input.KEY_LMB.pressed)
	{
		asbx.player.playerBody.position[0] = asbx.camera_player.mouse_pos_x;
		asbx.player.playerBody.position[1] = asbx.camera_player.mouse_pos_y;
		asbx.player.playerBody.velocity[0] *= 0.9;
		asbx.player.playerBody.velocity[1] *= 0.9;
		
		asbx.player.body.pos_x = asbx.camera_player.mouse_pos_x;
		asbx.player.body.pos_y = asbx.camera_player.mouse_pos_y;
		asbx.player.body.speed_x = 0;
		asbx.player.body.speed_y = 0;
	}

	// zoom in
	if (asbx.input.KEY_KP_PLUS.pressed)
	{
		asbx.desired_zoom -= (0.001 + 0.003 * asbx.camera_player.zoom_) * time_delta;
		if (asbx.desired_zoom < 0.01)
		{
			asbx.desired_zoom = 0.01;
		}
	}
	// zoom out
	if (asbx.input.KEY_KP_MINUS.pressed)
	{
		asbx.desired_zoom += (0.001 + 0.003 * asbx.camera_player.zoom_) * time_delta;
		if (asbx.desired_zoom > 128)
		{
			asbx.desired_zoom = 128;
		}
	}
	asbx.camera_player.set_zoom(asbx.camera_player.zoom_ * 0.9 + 0.1 * asbx.desired_zoom);


	asbx.player.think(time_delta);


	for (var i = 0; i < 3; i++)
	{
		//Asbx.current_area.data.physics_world.step(time_delta / 3000);
	}

};