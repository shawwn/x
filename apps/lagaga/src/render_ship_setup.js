"use strict";

lgg.render_ship_setup = function()
{

	lgg.c.rectangle.draw(lgg.CAM_STRETCH, .5, .5, 1, 1, 90,
		210, 0, 0, .85,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);

	lgg.c.rectangle.flush_all();

	var shadow_offset = 0.00085;

	var size_x = 0.0135;
	var size_y = 0.01345;
	var spacing_y = 0.014;
	var spacing = 0.0024;
	for (var i = 0, len = lgg.weapons.length; i < len; i++)
	{
		var weapon_type = lgg.weapons[i];
		var hue = 0;
		var sat = 0;
		var lum = 0.5;

		if (lgg.ship_setup__selected_weapon == i)
		{
			var hue = 56;
			var sat = 1;
			var lum = 0.5;
		}

		if (lgg.player.weapons[i].has_weapon == false)
		{
			if (lgg.ship_setup__selected_weapon == i)
			{
				var hue = 56;
				var sat = 0.5;
				var lum = 0.15;
			}
			else
			{
				var hue = 0;
				var sat = 0;
				var lum = 0.15;
			}
		}
		
		

		lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.20 + 0.035, 0.016 + spacing_y * i, 0.07, spacing_y * 0.9, 90,
			150, .6, .1, .5,
			-1, -1, -1, -1,
			-1, -1, -1, .5,
			-1, -1, -1, .5
			);
			
		var bar_length = weapon_type.energy_cost * 0.07;
		lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.20 + bar_length / 2, 0.016 + spacing_y * i - spacing_y / 4, bar_length, spacing_y / 2 * 0.9, 90,
			150, .9, .4, .75,
			-1, -1, -1, -1,
			-1, -1, -1, .25,
			-1, -1, -1, .25
			);

		var bar_length = weapon_type.energy_cost * 12 / weapon_type.shot_delay;
		lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.20 + bar_length / 2, 0.016 + spacing_y * i + spacing_y / 4, bar_length, spacing_y / 2, 90,
			210, .5, .5, .75,
			-1, -1, -1, -1,
			-1, -1, -1, .25,
			-1, -1, -1, .25
			);
			
		if (weapon_type.damage != -1)
		{
			var bar_length = weapon_type.damage / weapon_type.energy_cost * 0.0035;
			lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.20 + bar_length / 2, 0.016 + spacing_y * i, bar_length, spacing_y / 4, 90,
				54, .9, .4, .995,
				-1, -1, -1, -1,
				-1, -1, -1, .75,
				-1, -1, -1, .75
				);
		}

		lgg.fonts.draw_text(
				weapon_type.title, 1,
				lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT, 0.28 + shadow_offset,  0.015 - shadow_offset + spacing_y * i, size_x, size_y, spacing,
				0, 0, 0, .8,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);
		lgg.fonts.draw_text(
				weapon_type.title, 1,
				lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT, 0.28, 0.015 + spacing_y * i, size_x, size_y, spacing,
				hue, sat, lum, .9,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1);

		for (var j = 0; j < 8; j++)
		{
			var str_value = "" + (Math.round(lgg.player.weapons[i].directions[j] * 100) / 100);
			lgg.fonts.draw_text(
					str_value, 1,
					lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT, 0.41 + shadow_offset + 0.035 * j, 0.015 - shadow_offset + spacing_y * i, size_x, size_y, spacing,
					0, 0, 0, .8,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			lgg.fonts.draw_text(
					str_value, 1,
					lgg.CAM_LANDSCAPE, lgg.FONT_DEFAULT, 0.41 + 0.035 * j, 0.015 + spacing_y * i, size_x, size_y, spacing,
					hue, sat, lum, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
					
			var bar_length = lgg.player.weapons[i].directions[j] * 0.03

			lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.40 + 0.035 * j + 0.015, 0.016 + spacing_y * i, 0.03, spacing_y * 0.9, 90,
				150, .6, .1, .5,
				-1, -1, -1, -1,
				-1, -1, -1, .5,
				-1, -1, -1, .5
				);
			lgg.c.rectangle.draw(lgg.CAM_LANDSCAPE, 0.40 + 0.035 * j + bar_length / 2, 0.016 + spacing_y * i, bar_length, spacing_y, 90,
				150, .6, .2, .75,
				-1, -1, -1, -1,
				-1, -1, -1, .5,
				-1, -1, -1, .5
				);
		}
	}
	
	lgg.c.rectangle.flush_all();


	lgg.fonts.flush_all();
};