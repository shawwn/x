btx.render__hud = function(time_delta)
{
	if (btx.selected_cityblock != -1)
	{
		var block = btx.cityblocks.cityblocks[btx.selected_cityblock];
		btx.fonts.draw_text(
			"x: " + Math.round(block.pos_x) + " " +
			"y: " + Math.round(block.pos_y) + " " +

			btx.cityblock_types[block.type].name + " " + Math.round(block.size_x - btx.sidewalk_width * 2 - btx.street_width) + " * " + Math.round(block.size_y - btx.sidewalk_width * 2 - btx.street_width) + " = " + Math.round((block.size_x - btx.sidewalk_width * 2 - btx.street_width) * (block.size_y - btx.sidewalk_width * 2 - btx.street_width)), 1,
			btx.CAM_STRETCH, btx.FONT_DEFAULT, 0.025, 0.96, 0.025, 0.045, 0.005,
			0, 0, .5, .9,
			0, 0, .7, .9,
			0, 0, .99, .9,
			0, 0, .9, .9
			);
		btx.c.rectangle_textured.draw_rectangle(btx.CAM_PLAYER,
			btx.tex_noise,
			block.pos_x,
			block.pos_y,
			block.size_x - btx.street_width - btx.sidewalk_width * 2,
			block.size_y - btx.street_width - btx.sidewalk_width * 2,
			0.15 + 0.125 * Math.sin(btx.now / 50 % 50),
			200, 1, 0.5, 0.4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
		if (btx.selected_house != -1)
		{
			var house = block.houses[btx.selected_house];
			btx.fonts.draw_text(
				"x: " + Math.round(house.pos_x) + " " +
				"y: " + Math.round(house.pos_y) + " " +
				btx.house_types[house.type].name + " " + Math.round(house.size_x) + " * " + Math.round(house.size_y) + " = " + Math.round(house.size_x * house.size_y), 1,
				btx.CAM_STRETCH, btx.FONT_DEFAULT, 0.025, 0.92, 0.025, 0.045, 0.005,
				0, 0, .5, .9,
				0, 0, .7, .9,
				0, 0, .99, .9,
				0, 0, .9, .9
				);
			var hue = 180 + 180 * Math.sin(btx.now / 1500 % 1500);
			btx.c.rectangle_textured.draw_rectangle(btx.CAM_PLAYER,
				btx.tex_noise,
				house.pos_x,
				house.pos_y,
				house.size_x,
				house.size_y,
				0.15 + 0.125 * Math.sin(btx.now / 50 % 50),
				60, 1, 0.5, 0.4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);
		}
		btx.fonts.flush_all();
	}


	if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_WEATHER_VARS])
	{

		btx.render_bar(btx.CAM_PORTRAIT, "cloud density", 		220, 0.7, 0.5, btx.weather.current_cloud_density, 	btx.camera_portrait.aspect - 0.35, 0.96, 0.35, 0.04);
		btx.render_bar(btx.CAM_PORTRAIT, "fogginess", 			220, 0.7, 0.5, btx.weather.current_fogginess, 		btx.camera_portrait.aspect - 0.35, 0.92, 0.35, 0.04);
		btx.render_bar(btx.CAM_PORTRAIT, "cloud pattern", 		220, 0.7, 0.5, btx.weather.current_cloud_pattern, 	btx.camera_portrait.aspect - 0.35, 0.88, 0.35, 0.04);


	}

	if (btx.show_debug_menu)
	{
		var shadow_offset = 0.00085;
		
		var size_x = 0.015;
		var size_y = 0.0145;
		var spacing_y = 0.0105;
		for (var i = 0, len = btx.options_debug.length; i < len; i++)
		{
			var option = btx.options_debug[i];
			var hue = 0;
			var sat = 0;
			var lum = 1;
			if (btx.selected_debug_menu_item == i)
			{
				var hue = 56;
				var sat = 1;
				var lum = 0.5;
			}
			btx.fonts.draw_text(
					option.name, 1,
					btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.08 + shadow_offset, btx.camera_landscape.one_over_aspect - 0.065 - shadow_offset - spacing_y * i, size_x, size_y, 0.0042,
					0, 0, 0, .8,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			btx.fonts.draw_text(
					option.name, 1,
					btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.08, btx.camera_landscape.one_over_aspect - 0.065 - spacing_y * i, size_x, size_y, 0.0042,
					hue, sat, lum, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			var value = btx.options_debug_values[i];
			if (option.type == 'bool')
			{
				var str_value = value ? 'yes' : 'no';
			}
			else if (option.type == 'list')
			{
				var str_value = "" + value;
			}
			btx.fonts.draw_text(
					str_value, 1,
					btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.01 + shadow_offset, btx.camera_landscape.one_over_aspect - 0.065 - shadow_offset - spacing_y * i, size_x, size_y, 0.0042,
					0, 0, 0, .8,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
			btx.fonts.draw_text(
					str_value, 1,
					btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.01, btx.camera_landscape.one_over_aspect - 0.065 - spacing_y * i, size_x, size_y, 0.0042,
					hue, sat, lum, .9,
					-1, -1, -1, -1,
					-1, -1, -1, -1,
					-1, -1, -1, -1);
		}
	}
	btx.c.flush_all();

	btx.c.rectangle.draw(
		btx.CAM_LANDSCAPE,
		0.5,
		0.0075,
		1.0,
		0.015,
		90,
		0, 0, 0, 0.95,
		0, 0, 0, 0.95,
		0, 0, 0, 0,
		0, 0, 0, 0);

	btx.c.rectangle.flush_all();

	var time_hours = Math.floor(btx.game.current_time / (3600));
	var time_minutes = Math.floor((btx.game.current_time % (3600)) / 60);
	var time_seconds = Math.floor(btx.game.current_time % (60));

	//(Math.round(btx.game.current_time / (1000 * .036)) / 100)

	//  + ":" + (time_seconds < 10 ? "0" : "") + time_seconds

	btx.fonts.draw_text(
			"Day " + btx.game.current_day + "   " + time_hours + ":" + (time_minutes < 10 ? "0" : "") + time_minutes, 1,
			btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.45, 0.0065, 0.015, 0.0125, 0.0025,
			56, 1, .5, .9,
			56, 1, .7, .9,
			56, 1, .99, .99,
			56, 1, .9, .99
			);

	if (btx.game.spectated_person != -1)
	{
		var person = btx.persons.persons[btx.game.spectated_person];
		btx.render_bar(btx.CAM_PORTRAIT, "exhaustion", 		60,  1, 0.5, person.exhaustion, btx.camera_portrait.aspect - 0.35, 0.02, 0.35, 0.04);
		btx.render_bar(btx.CAM_PORTRAIT, "tiredness", 		320, 1, 0.5, person.tiredness, 	btx.camera_portrait.aspect - 0.35, 0.06, 0.35, 0.04);
		btx.render_bar(btx.CAM_PORTRAIT, "hunger", 			120, 1, 0.5, person.hunger, 	btx.camera_portrait.aspect - 0.35, 0.10, 0.35, 0.04);
		btx.render_bar(btx.CAM_PORTRAIT, "thirst", 			220, 1, 0.5, person.thirst, 	btx.camera_portrait.aspect - 0.35, 0.14, 0.35, 0.04);

		if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_PERSON_AI])
		{

			var dist_to_goal = µ.distance2D(person.pos_x, person.pos_y, person.current_goal__target_pos_x, person.current_goal__target_pos_y);
			var dist_to_next = µ.distance2D(person.pos_x, person.pos_y, person.next_movement_target_pos_x, person.next_movement_target_pos_y);
			
			var offset_y = 0.0125;

			btx.fonts.draw_text(
				"GOAL   "
					+ (btx.enum_goals[person.current_goal] == undefined ? "?? " + person.current_goal : btx.enum_goals[person.current_goal][1]) +
				"   ACTIVITY   "
					+ (btx.enum_activities[person.current_activity] == undefined ? "?? " + person.current_activity : btx.enum_activities[person.current_activity][1]),
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);
				
			offset_y += 0.0100; // spacer
				
			offset_y += 0.0100;
			btx.fonts.draw_text(
				"next dist check " + (Math.round(person.next_distance_check) / 1000),
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

			offset_y += 0.0100;
			btx.fonts.draw_text(
				"next movement target x " + (Math.round(person.next_movement_target_pos_x) / 1000) + " / y " +
				(Math.round(person.next_movement_target_pos_y) / 1000),
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

			offset_y += 0.0100;
			btx.fonts.draw_text(
				"next " + (Math.round(dist_to_next * 1000) / 1000)
				+ " {" + person.current_activity__time_left + "}",
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

			offset_y += 0.0100; // spacer

			offset_y += 0.0100;
			btx.fonts.draw_text(
				"next goal dist check " + (Math.round(person.next_goal_distance_check) / 1000),
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

			offset_y += 0.0100;
			btx.fonts.draw_text(
				"goal pos x " + (Math.round(person.current_goal__target_pos_x) / 1000) + " / y " +
				(Math.round(person.current_goal__target_pos_y) / 1000),
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);


			offset_y += 0.0100;
			btx.fonts.draw_text(
				"goal " + (Math.round(dist_to_goal * 1000) / 1000)
				+ " [" + person.current_goal__target_node_id + "]"
				+ " {" + person.current_goal__time_left + "}",
				1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);
				
			offset_y += 0.0100; // spacer
		
			offset_y += 0.0100;
			btx.fonts.draw_text(
				(person.inside_a_house ? "in house " + person.inside_house: "not in a house"), 1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

			offset_y += 0.0100;
			btx.fonts.draw_text(
				"in block " + person.inside_block, 1,
				btx.CAM_LANDSCAPE, btx.FONT_DEFAULT, 0.005, offset_y, 0.015, 0.0125, 0.0025,
				56, 1, .5, .9,
				56, 1, .7, .9,
				56, 1, .99, .99,
				56, 1, .9, .99
				);

		}

	}
	btx.c.flush_all();
	btx.fonts.flush_all();
}

btx.render_bar = function(cam_id, title, hue, sat, lum, value, pos_x, pos_y, size_x, size_y)
{
		btx.c.rectangle_textured.draw(
			cam_id,
			btx.tex_noise,
			pos_x + size_x * 0.5,
			pos_y,
			size_x,
			size_y,
			90,
			hue, sat, lum * 0.15, 0.75, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
		btx.c.rectangle_textured.draw(
			cam_id,
			btx.tex_noise,
			pos_x + size_x * 0.5 * value,
			pos_y,
			size_x * value,
			size_y * 0.9,
			90,
			hue, sat, lum * 0.9, 0.75,
			hue, sat, lum * 0.9, 0.75,
			hue, sat, lum * 1.2, 0.75,
			hue, sat, lum * 1.2, 0.75);
		btx.fonts.draw_text(
				title, 1,
				cam_id, btx.FONT_DEFAULT, pos_x + 0.01, pos_y, size_x * 0.1, size_y * 0.85, size_x * 0.0215,
				hue, 1, lum * 0.8, 1,
				hue, 1, lum * 0.8, 1,
				hue, 1, lum, 1,
				hue, 1, lum, 1
				);
}