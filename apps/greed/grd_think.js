grd.think = function (time_delta)
{
	grd.now += time_delta;
	
	//grd.agents.a[0].think(time_delta);
	
	grd.simulation.think(time_delta);
	
	grd.b2world.Step(time_delta / 1000, 10, 10);
		
	grd.b2world.ClearForces();

/*
	grd.now += time_delta;
	if (grd.input.key('KEY_Q').pressed)
	{
		grd.cameras.player.set_zoom(grd.cameras.player.zoom_ - time_delta * 0.001);
	}
	if (grd.input.key('KEY_E').pressed)
	{
		var desired_zoom = grd.cameras.player.zoom_ + time_delta * 0.001;
		if (desired_zoom < 4)
			grd.cameras.player.set_zoom(desired_zoom);
		else
			grd.cameras.player.set_zoom(4);
	}
	
	grd.cameras.player.set_pos(
		(grd.cameras.player.mouse_pos_x + grd.cameras.player.pos_x * 49) / 50,
		(grd.cameras.player.mouse_pos_y + grd.cameras.player.pos_y * 49) / 50
	);
*/

//	grd.cameras.player.calc_mouse(grd.cameras.player.mouse_screen_x, grd.cameras.player.mouse_screen_y);


};