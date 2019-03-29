rvr.Player = function()
{
	this.flashlight_battery_charge = 1.0;
	this.sight_height = 0.075;
	this.last_pour = 0;

//	this.weapon = new rvr.Weapon(rvr.presets.weapons.plasma_pistol, rvr.player_agent);

	//rvr.player_agent.gain_weapon(rvr.presets.weapons.fireballs);
	this.remote_eye = new rvr.Player_Remote_Eye();
	//console.log(rvr.player_agent.weapons);
}

rvr.Player.prototype.think = function(time_delta)
{
	if (rvr.now - rvr.player_agent.last_damage >= 3000)
	{
		rvr.player_agent.shield += 0.00001 * time_delta;
		if (rvr.player_agent.shield > 1)
		{
			rvr.player_agent.shield = 1;
		}
	}
	this.remote_eye.think(time_delta);

	if (rvr.input.KEY_F1.pressed) rvr.mode = 0;
	if (rvr.input.KEY_F2.pressed) rvr.mode = 1;
	if (rvr.input.KEY_F3.pressed) rvr.mode = 2;

	if (!rvr.input.KEY_SHIFT.pressed && !rvr.input.KEY_ALT_LEFT.pressed)
	{
		if (rvr.input.KEY_Q.pressed)
		{
			rvr.desired_zoom = rvr.camera_player.zoom_ + time_delta * 0.025 * rvr.camera_player.zoom_;
			
		}
		if (rvr.input.KEY_E.pressed)
		{
			rvr.desired_zoom = rvr.camera_player.zoom_ - time_delta * 0.025 * rvr.camera_player.zoom_;
		}
	}
	else if (rvr.input.KEY_SHIFT.pressed)
	{
		if (rvr.input.KEY_Q.pressed)
		{
			rvr.desired_zoom = rvr.camera_player.zoom_ + time_delta * 0.1 * rvr.camera_player.zoom_;
			
		}
		if (rvr.input.KEY_E.pressed)
		{
			rvr.desired_zoom = rvr.camera_player.zoom_ - time_delta * 0.1 * rvr.camera_player.zoom_;
		}
	}
	else if (rvr.input.KEY_ALT_LEFT.pressed)
	{
		if (rvr.input.KEY_Q.pressed)
		{
			rvr.desired_zoom = rvr.world_size_x;
		}
		if (rvr.input.KEY_E.pressed)
		{
			rvr.desired_zoom = rvr.normal_zoom;
		}
	}

	rvr.desired_zoom = µ.between(rvr.min_zoom, rvr.desired_zoom, rvr.max_zoom);

	//rvr.desired_zoom = (1.0 - rvr.player_agent.height) * rvr.zoom_at_height_0 + rvr.player_agent.height * rvr.zoom_at_height_1;

	if (rvr.desired_zoom != rvr.camera_player.zoom_)
	{
		rvr.camera_player.set_zoom(rvr.camera_player.zoom_ - (rvr.camera_player.zoom_ - rvr.desired_zoom) / 16);
	}

	if (rvr.input.KEY_CURSOR_UP.pressed)	rvr.camera_player.set_pos(rvr.camera_player.pos_x, rvr.camera_player.pos_y + 0.005 * rvr.camera_player.zoom_ * time_delta);
	if (rvr.input.KEY_CURSOR_DOWN.pressed)	rvr.camera_player.set_pos(rvr.camera_player.pos_x, rvr.camera_player.pos_y - 0.005 * rvr.camera_player.zoom_ * time_delta);
	if (rvr.input.KEY_CURSOR_RIGHT.pressed)	rvr.camera_player.set_pos(rvr.camera_player.pos_x + 0.005 * rvr.camera_player.zoom_ * time_delta, rvr.camera_player.pos_y);
	if (rvr.input.KEY_CURSOR_LEFT.pressed)	rvr.camera_player.set_pos(rvr.camera_player.pos_x - 0.005 * rvr.camera_player.zoom_ * time_delta, rvr.camera_player.pos_y);

	if (rvr.input.KEY_M.pressed)
	{
		rvr.desired_cam_pos_x = rvr.camera_stretch.mouse_pos_x * rvr.world_size_x;
		rvr.desired_cam_pos_y = (1 - rvr.camera_stretch.mouse_pos_y) * rvr.world_size_y;
	}
	else
	{
		rvr.desired_cam_pos_x = rvr_agents__pos_x[0];
		rvr.desired_cam_pos_y = rvr_agents__pos_y[0];
	}


	rvr.desired_cam_offset_x = rvr_agents__speed_x[0] * 0;
	rvr.desired_cam_offset_y = rvr_agents__speed_y[0] * 0;

	var cam_inertia = 0.0;

	rvr.cam_offset_x = rvr.cam_offset_x * cam_inertia + rvr.desired_cam_offset_x * (1 - cam_inertia);
	rvr.cam_offset_y = rvr.cam_offset_y * cam_inertia + rvr.desired_cam_offset_y * (1 - cam_inertia);

	var cam_inertia = 0.9;

	rvr.camera_player.set_pos(
		rvr.camera_player.pos_x * cam_inertia + (rvr.desired_cam_pos_x + rvr.cam_offset_x) * (1 - cam_inertia),
		rvr.camera_player.pos_y * cam_inertia + (rvr.desired_cam_pos_y + rvr.cam_offset_y) * (1 - cam_inertia));

	if (rvr.input.KEY_G.pressed && rvr.now - rvr.player_agent.state.last_shot > (150))
	{
		rvr.player_agent.state.last_shot = rvr.now;
		rvr.scents.make_sound(rvr_agents__pos_x[0], rvr_agents__pos_y[0], 10);
		rvr.projectiles.spawn(
			rvr.presets.projectiles.missile,
			rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing) * rvr.player_agent.parameters.radius,
			rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing) * rvr.player_agent.parameters.radius,
			rvr_agents__pos_z[0] + 0.18,
			0.875,
			1.0,
			0,
			0,
			0,
			0,
			10000,
			rvr.player_agent.state.facing,
			rvr.FACTION__PLAYER,
			rvr.player_agent,
			null,
			-1,
			-1);
	}

	if (rvr.input.KEY_LMB.pressed)
	{
		rvr.player_agent.trigger_weapon();
	}

	if (rvr.input.KEY_F.pressed && rvr.now - rvr.player_agent.state.last_shot > (220))
	{
		var spread = 360;
		var bullets = 6;
		var offset1	 = -5 + µ.rand(10);
		for (var i = 0; i < bullets; i++)
		{
			var offset	 = -spread * 0.5 + spread * i / (bullets);
			rvr.player_agent.state.last_shot = rvr.now;
			rvr.scents.make_sound(rvr_agents__pos_x[0], rvr_agents__pos_y[0], 1);
			rvr.projectiles.spawn(
				rvr.presets.projectiles.fireball,
				rvr_agents__pos_x[0] + µ.angle_to_x(rvr.player_agent.state.facing + offset) * rvr.player_agent.parameters.radius,
				rvr_agents__pos_y[0] + µ.angle_to_y(rvr.player_agent.state.facing + offset) * rvr.player_agent.parameters.radius,
				rvr_agents__pos_z[0] + 0.18,
				0.875,
				1.0,
				0,
				0,
				0,
				0,
				3000,
				rvr.player_agent.state.facing + offset1 + offset,
				rvr.FACTION__PLAYER,
				rvr.player_agent,
				null,
				-1,
				-1,
				0.1);
		}
	}

	if (1 == 1)
	{
			 if (rvr.input.KEY_W.pressed && rvr.input.KEY_D.pressed)	rvr.player_agent.move_cardinal_directions(time_delta,  1,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_D.pressed && rvr.input.KEY_S.pressed)	rvr.player_agent.move_cardinal_directions(time_delta,  1, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_S.pressed && rvr.input.KEY_A.pressed)	rvr.player_agent.move_cardinal_directions(time_delta, -1, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_A.pressed && rvr.input.KEY_W.pressed)	rvr.player_agent.move_cardinal_directions(time_delta, -1,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_W.pressed)								rvr.player_agent.move_cardinal_directions(time_delta,  0,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_S.pressed)								rvr.player_agent.move_cardinal_directions(time_delta,  0, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_D.pressed)								rvr.player_agent.move_cardinal_directions(time_delta,  1,  0, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
		else if (rvr.input.KEY_A.pressed)								rvr.player_agent.move_cardinal_directions(time_delta, -1,  0, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_V.pressed);
	}
	else
	{
		 	 if (rvr.input.KEY_W.pressed && rvr.input.KEY_D.pressed)	rvr.player_agent.move(time_delta,  1,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_D.pressed && rvr.input.KEY_S.pressed)	rvr.player_agent.move(time_delta,  1, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_S.pressed && rvr.input.KEY_A.pressed)	rvr.player_agent.move(time_delta, -1, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_A.pressed && rvr.input.KEY_W.pressed)	rvr.player_agent.move(time_delta, -1,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_W.pressed)								rvr.player_agent.move(time_delta,  0,  1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_S.pressed)								rvr.player_agent.move(time_delta,  0, -1, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_D.pressed)								rvr.player_agent.move(time_delta,  1,  0, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
		else if (rvr.input.KEY_A.pressed)								rvr.player_agent.move(time_delta, -1,  0, rvr.input.KEY_SHIFT.pressed, rvr.input.KEY_ALT_LEFT.pressed);
	}


	if (rvr.input.KEY_SPACE.pressed && rvr.player_agent.is_on_ground)
	{
		rvr.player_agent.is_on_ground = false;
		rvr_agents__speed_z[0] = 0.0010;
	}

	if (rvr.input.KEY_CURSOR_UP.pressed)
	{
		rvr.player_agent.parameters.sight_cone += 0.5;
		rvr.player_agent.parameters.light_cone += 0.5;
	}
	if (rvr.input.KEY_CURSOR_DOWN.pressed)
	{
		rvr.player_agent.parameters.sight_cone -= 0.5;
		rvr.player_agent.parameters.light_cone -= 0.5;
	}

	rvr.player_agent.parameters.sight_cone = µ.between(0, rvr.player_agent.parameters.sight_cone, 360);
	rvr.player_agent.parameters.light_cone = µ.between(0, rvr.player_agent.parameters.light_cone, 360);

	if (!rvr.input.KEY_W.pressed && !rvr.input.KEY_S.pressed && !rvr.input.KEY_D.pressed && !rvr.input.KEY_A.pressed)
	{
			rvr.player_agent.is_walking_since += 0;
			rvr.player_agent.is_sprinting_since = 0;
			rvr.player_agent.is_dodging_since = 0;
	}

	if (rvr.input.KEY_P.pressed && rvr.now - this.last_pour > 150)
	{
		this.last_pour = rvr.now;
		rvr.map.set_fluid_at(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, 0.8)
	}

	if (rvr.input.KEY_O.pressed)
	{
		rvr.map.set_fluid_at(rvr.camera_player.mouse_pos_x, rvr.camera_player.mouse_pos_y, 0.0)
	}

}

rvr.Player.prototype.draw = function(time_delta)
{
	this.remote_eye.draw(time_delta);
}


rvr.Player.prototype._ = function()
{
	
}