"use strict";

lgg.think = function(time_delta)
{
	if (lgg.input.KEY_V.pressed)
	{
		time_delta = 1.25;
	}
	if (lgg.input.KEY_N.pressed)
	{
		time_delta = 50;
	}
	if (lgg.input.KEY_B.pressed)
	{
		time_delta *= -1; // lulz
	}

	time_delta *= lgg.options_debug_values[lgg.DEBUG_OPTION__TIMESCALE];
	
	// meh...
	if (!(lgg.show_ship_setup || lgg.level.state == lgg.LEVELSTATE__TRADER || lgg.level.state == lgg.LEVELSTATE__TRADER_ENTER || lgg.level.state == lgg.LEVELSTATE__TRADER_EXIT))
	{
		lgg.now += time_delta;
	}

	lgg.game.think(time_delta);
	if (lgg.game.state == lgg.GAMESTATE__INTRO)
	{
		var frac = lgg.game.state_time / lgg.INTRO_DURATION;
		var frac2 = 1 - frac;
		var angle = (lgg.now / 3) % 360;
		if (frac < .4)
		lgg.particlesGPU.spawn(
			lgg.game.state_time,
			(1 / lgg.INTRO_DURATION) * 60000,
			lgg.camera_stretch.size_x/2, 0.5,
			lgg.camera_stretch.size_y/2, 0.5,
			lgg.camera_stretch.zoom_ / 4 * frac,
			0, 0,
			angle, 0,
			'intro',
			(lgg.INTRO_DURATION - lgg.game.state_time),
			0,1,1,1,
			5,		//	vary_angle
			2.5,		//	vary_angle_vel
			0,		//	vary_pos_x
			0,		//	vary_pos_y
			0,		//	vary_size
			frac * 4,		//	vary_vel_x
			frac * 4,		//	vary_vel_y
			0,		//	vary_lifespan
			0,		//	vary_color_hue
			0,		//	vary_color_sat
			0,		//	vary_color_lum
			0		//	vary_color_a
		);
	}
	else if (lgg.game.state == lgg.GAMESTATE__PLAYING)
	{
		if (!lgg.show_ship_setup)
		{
			lgg.level.think(time_delta);
		}
		if (lgg.level.state == lgg.LEVELSTATE__PLAYING)
		{
			if (!lgg.show_ship_setup)
			{
				lgg.player.think(time_delta);
				lgg.player_drones.think(time_delta);
				lgg.enemies.think(time_delta);
				lgg.singularity.think(time_delta);
				lgg.trader.think(time_delta);
				lgg.pickups.think(time_delta);
				lgg.projectiles.think(time_delta);
			}
		}
		else if (lgg.level.state == lgg.LEVELSTATE__RESPAWN_SELECT)
		{
			lgg.player.think_respawn_select(time_delta);
		}
		else if (lgg.level.state == lgg.LEVELSTATE__TRADER || lgg.level.state == lgg.LEVELSTATE__TRADER_ENTER || lgg.level.state == lgg.LEVELSTATE__TRADER_EXIT)
		{
			lgg.trader.think_trade_menu(time_delta);
		}
		else if (lgg.level.state == lgg.LEVELSTATE__SINGULARITY)
		{
			lgg.singularity.think_inside(time_delta);
		}
		if (lgg.player.health <= 0)
		{
			if (lgg.player.game_over_time > 0)
			{
				lgg.player.game_over_time -= time_delta;
			}
			else
			{
				lgg.level.restart();
			}
		}

	}
};
