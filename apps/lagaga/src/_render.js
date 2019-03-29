"use strict";

lgg.render = function(time_delta)
{





/*	lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);
	lgg.c.clear();
	lgg.c.gl.clear(lgg.c.gl.COLOR_BUFFER_BIT);
*/
	if (lgg.game.state == lgg.GAMESTATE__INTRO)
	{
	}
	else if (lgg.game.state == lgg.GAMESTATE__PLAYING)
	{
		if (		lgg.level.state == lgg.LEVELSTATE__PLAYING
				||	lgg.level.state == lgg.LEVELSTATE__TRADER
				||	lgg.level.state == lgg.LEVELSTATE__TRADER_ENTER
				||	lgg.level.state == lgg.LEVELSTATE__TRADER_EXIT
				||	lgg.level.state == lgg.LEVELSTATE__SINGULARITY_ENTER
				|| 	lgg.level.state == lgg.LEVELSTATE__SINGULARITY_EXIT
			)
		{
			
			if (!lgg.options_debug_values[lgg.DEBUG_OPTION__DISABLE_BACKGROUND])
			{
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, lgg.level.size_x/4, lgg.level.size_y/2, lgg.level.size_x/2, lgg.level.size_y, 90,
					210, 0.75, 0.0, 1,
					210, 0.75, .08, 1,
					210, 0.75, .08, 1,
					210, 0.75, 0.0, 1
				);
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, lgg.level.size_x*.75, lgg.level.size_y/2, lgg.level.size_x/2, lgg.level.size_y, 90,
					210, 0.75, .08, 1,
					210, 0.75, 0.0, 1,
					210, 0.75, 0.0, 1,
					210, 0.75, .08, 1
					);
				lgg.c.rectangle.flush_all();
				if (!lgg.options_debug_values[lgg.DEBUG_OPTION__DISABLE_BACKGROUND_STARS])
				{
					var star_layer_count = 10;
					var star_layer_offset_speed1 = 49800;
					var star_layer_offset_speed2 = -4250;
					var star_layer_scale1 = 8.0;
					var star_layer_scale2 = -0.43;
					for (var i = 0; i < star_layer_count; i++)
					{
						lgg.c.rectangle_textured_offset.draw(
							lgg.CAM_PLAYER,
							lgg.tex_stars,
							lgg.level.size_x/2, lgg.level.size_y/2,
							lgg.level.size_x, lgg.level.size_y,
							5.5345457531 * i,
							13.2435457761 * i + 1.0 - ((lgg.now / (star_layer_offset_speed1 + i * star_layer_offset_speed2 - 112.7 * i)) % 1.0),
							star_layer_scale1 + i * star_layer_scale2,
							star_layer_scale1 + i * star_layer_scale2,
							90,
							0, 1, 1, .25 + .05 * i,
							-1, -1, -1, -1,
							-1, -1, -1, -1,
							-1, -1, -1, -1);
					}
					lgg.c.rectangle_textured_offset.flush_all();
				}
			}
/*
			lgg.c.rectangle_textured_offset.draw(
				lgg.CAM_PLAYER,
				//lgg.tex_backgrounds__mossy_roof,
				//lgg.tex_backgrounds__building_facade,
				lgg.tex_backgrounds__sinus1,
				lgg.level.size_x/2, lgg.level.size_y/2,
				lgg.level.size_x, lgg.level.size_y,
				5.5345457531,
				- ((lgg.now / 37484) % 1.0),
				0.1,
				0.5,
				90,
				0, 1, 0.05, 1,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);

			lgg.c.rectangle_textured_offset.flush_all();
*/

			lgg.projectiles.draw();
			lgg.pickups.draw();
			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE, lgg.c.gl.FUNC_ADD);
			lgg.enemies.draw_shields();
			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);
			lgg.c.flush_all();


			lgg.enemies.draw();
			
			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE, lgg.c.gl.FUNC_ADD);
			lgg.enemies.draw_shields2();
			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);
			lgg.c.flush_all();


			lgg.trader.draw();
			lgg.singularity.draw();
			//lgg.c.flush_all();

			lgg.player.draw();
			lgg.player_drones.draw();
			lgg.c.flush_all();

			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE, lgg.c.gl.FUNC_ADD);
			lgg.particlesGPU.draw(lgg.now, lgg.c.gl, lgg.camera_player);
			lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);

//*
			if (lgg.camera_player.aspect > lgg.level.size_x)
			{
				var blurgh = lgg.camera_player.aspect - lgg.level.size_x;
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, -blurgh/4, lgg.level.size_y/2, blurgh/2, lgg.level.size_y, 90,
					210, 1, 0.05, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
					);
				lgg.c.rectangle.draw(lgg.CAM_PLAYER, lgg.level.size_x + blurgh/4, lgg.level.size_y/2, blurgh/2, lgg.level.size_y, 90,
					210, 1, 0.05, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1
					);
				lgg.c.rectangle.flush_all();
			}
//*/

			if (lgg.level.state == lgg.LEVELSTATE__TRADER || lgg.level.state == lgg.LEVELSTATE__TRADER_ENTER || lgg.level.state == lgg.LEVELSTATE__TRADER_EXIT)
			{
				lgg.trader.draw_trade_menu();
			}
			
			if (lgg.show_ship_setup)
			{
				lgg.render_ship_setup();
			}

			lgg.render_HUD();

		}
		else if (lgg.level.state == lgg.LEVELSTATE__SINGULARITY || lgg.level.state == lgg.LEVELSTATE__SINGULARITY_ENTER || lgg.level.state == lgg.LEVELSTATE__SINGULARITY_EXIT)
		{
			lgg.singularity.draw_inside();
			lgg.c.flush_all();
		}
		else if (lgg.level.state == lgg.LEVELSTATE__RESPAWN_SELECT)
		{
			//lgg.player.draw_respawn_select();
		}
	}

};