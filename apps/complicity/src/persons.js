btx.Persons = function()
{
	this.persons = new Array(0);
	for (var i = 0; i < btx.person_count; i++)
	{
		this.add_person();
	}
}

btx.Persons.prototype.add_person = function()
{
	var pos_x = btx.world_size_x * (0.3 + µ.rand(0.4));
	var pos_y = btx.world_size_y * (0.3 + µ.rand(0.4));
	this.persons.push(new btx.Person(this.persons.length, pos_x, pos_y));
}

btx.Persons.prototype.think = function(time_delta)
{
	for (var i = 0, len = this.persons.length; i < len; i++)
	{
		this.persons[i].think(time_delta);
	}
}

btx.Persons.prototype.draw_lights = function()
{
		for (var i = 0, len = this.persons.length; i < len; i++)
		{
			var person = this.persons[i];
			person.draw_light();
		}
}

btx.Persons.prototype.draw = function()
{
	for (var i = 0, len = this.persons.length; i < len; i++)
	{
		var person = this.persons[i];
		btx.c.rectangle_textured.draw(
			btx.CAM_PLAYER,
			btx.tex_sphere_thingy1,
			//btx.tex_circle,
			//btx.tex_phone_booth,
			person.pos_x,
			person.pos_y,
			btx.person_radius2,
			btx.person_radius2,
			person.facing,
			0, 3, 0.5, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

	}
	btx.c.flush_all();
}

btx.Persons.prototype.draw_hud = function()
{

	if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_PERSON_AI])
	{
		for (var i = 0, len = this.persons.length; i < len; i++)
		{
			var person = this.persons[i];
			var hue2 = 60;
			var lum2 = 0.5;
			var texture2 = btx.tex_circle;

			if (person.current_activity == btx.PERSON_ACTION__NONE)
			{
				lum2 = 0;
			}
			else if (person.current_activity == btx.PERSON_ACTION__RUN_TO_SAFETY)
			{
				hue = 0;
				var texture2 = btx.tex_noise;
			}
			else if (person.current_activity == btx.PERSON_ACTION__REST)
			{
				hue2 = 30;
			}
			else if (person.current_activity == btx.PERSON_ACTION__WAIT)
			{
				hue2 = 120;
			}
			else if (person.current_activity == btx.PERSON_ACTION__WALK_TO_POINT)
			{
				hue2 = 220;
			}

			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				texture2,
				person.pos_x,
				person.pos_y,
				btx.person_radius2 * 3,
				btx.person_radius2 * 3,
				person.facing,
				hue2, 1, lum2, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

		}
		btx.c.flush_all();
	}

	if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_PERSON_AI])
	{

		for (var i = 0, len = this.persons.length; i < len; i++)
		{
			var person = this.persons[i];
			var hue = 60;
			var lum = 0.5;
			if (person.current_goal == btx.PERSON_GOAL__NONE)
			{
				lum = 0;
			}
			else if (person.current_goal == btx.PERSON_GOAL__WANDER_RANDOMLY)
			{
				hue = 320;0
			}
			else if (person.current_goal == btx.PERSON_GOAL__WAIT)
			{
				hue = 120;
			}
			else if (person.current_goal == btx.PERSON_GOAL__GO_INTO_HOUSE)
			{
				hue = 220;
			}
			else if (person.current_goal == btx.PERSON_GOAL__WANDER_AROUND_IN_HOUSE)
			{
				hue = 160;
			}

			btx.c.rectangle_textured.draw(
				btx.CAM_PLAYER,
				btx.tex_circle,
				//btx.tex_phone_booth,
				person.pos_x,
				person.pos_y,
				btx.person_radius2,
				btx.person_radius2,
				person.facing,
				hue, 1, lum, 1, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

			if (btx.game.spectated_person == i)
			{
				if (btx.player.controlled_person != i)
				{
					if (btx.options_debug_values[btx.DEBUG_OPTION__SHOW_PERSON_NAVIGATION])
					{

						btx.c.rectangle_textured.draw_rectangle(
							btx.CAM_PLAYER,
							btx.tex_circle_thick_outline,
							person.pos_x,
							person.pos_y,
							btx.person_radius2 * 4,
							btx.person_radius2 * 4,
							0.05,
							0, 0, 0, 0.85, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);


						if (person.next_movement_target_pos_x != -1)
						{
							btx.c.rectangle_textured.draw(
								btx.CAM_PLAYER,
								btx.tex_circle_thick_outline,
								person.next_movement_target_pos_x,
								person.next_movement_target_pos_y,
								1.5,
								1.5,
								90,
								30, 1, 0.5, 0.85, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
								
							btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
								btx.tex_noise,
								person.pos_x,
								person.pos_y,
								person.next_movement_target_pos_x,
								person.next_movement_target_pos_y,
								0.3,
								30, 1.0, 0.5, 0.8,
								-1, -1, -1, -1,
								-1, -1, -1, -1,
								-1, -1, -1, -1);
						}



						if (person.current_goal__target_pos_x != -1)
						{
							btx.c.rectangle_textured.draw(
								btx.CAM_PLAYER,
								btx.tex_circle_thick_outline,
								person.current_goal__target_pos_x,
								person.current_goal__target_pos_y,
								2.5,
								2.5,
								90,
								60, 1, 0.5, 0.85, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);


							btx.c.rectangle_textured.draw_line(btx.CAM_PLAYER,
								btx.tex_noise,
								person.pos_x,
								person.pos_y,
								person.current_goal__target_pos_x,
								person.current_goal__target_pos_y,
								0.3,
								60, 1.0, 0.5, 0.8,
								-1, -1, -1, -1,
								-1, -1, -1, -1,
								-1, -1, -1, -1);

						}



					}

				}
				else
				{
					btx.c.rectangle_textured.draw(
						btx.CAM_PLAYER,
						btx.tex_circle_outline,
						person.pos_x,
						person.pos_y,
						btx.person_radius2 * 3,
						btx.person_radius2 * 3,
						90,
						280, 1, 0.5, 0.85, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
				}
			}
		}
	}
	btx.c.flush_all();
}

btx.Persons.prototype.find_jobs = function()
{
}

btx.Persons.prototype.find_job = function()
{
}

btx.Persons.prototype._ = function()
{
}
