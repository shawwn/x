drp.Locations = function()
{
	return {

		casino: {
			data:
			{
			},
			render: function()
			{
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					var buffer = '';
					for (var x = 0; x < drp.CON_CPL; x++)
					{
						buffer += (Math.random()*x > 20 ? '.' : (Math.random()*x > 20 ? '€' : '$'));
					}
					drp.con.write_line(y, buffer);
				}
			},
			render_update: function(time_delta)
			{
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>c</span>asino';
			},
			is_in_menu: function()
			{
				return (drp.game.location == 'town_square');
			},
			menu_key: drp.input.KEY_C,
			move_from: function(next_location)
			{
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'Casino');
			},
		},

		governor: {
			data:
			{
			},
			render: function()
			{
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					var buffer = '';
					for (var x = 0; x < drp.CON_CPL; x++)
					{
						buffer += (Math.random()*x > 20 ? '.' : (Math.random()*x > 20 ? '|' : ':'));
					}
					drp.con.write_line(y, buffer);
				}
			},
			render_update: function(time_delta)
			{
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>g</span>overnor';
			},
			is_in_menu: function()
			{
				return (drp.game.location == 'town_square' || drp.game.location == 'matrix');
			},
			menu_key: drp.input.KEY_G,
			move_from: function(next_location)
			{
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'The Governor');
			},
		},

		matrix: {
			data:
			{
				last_update: 0,
				dirty: true,
			},
			render: function()
			{
			},
			render_update: function(time_delta)
			{
				var data = drp.locations.matrix.data;
				data.last_update += time_delta;
				if (data.last_update > 10)
				{
					data.last_update -= 10;
				}
				else if (!data.dirty)
				{
					return;
				}
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					var buffer = '';
					if (!data.dirty && Math.random() > 0.002 * y)
					{
						continue;
					}
					else if (!data.dirty && Math.random() > 0.001)
					{
						buffer = drp.con.lines[y].innerHTML.substr(1, drp.CON_CPL-1) + drp.con.lines[y].innerHTML.substr(0, 1);
					}
					else
					{
						var char_strings = [
							'0123456789ABCDEF',
							'0123456789abcdef',
						];
						var char_set = µ.rand_int(char_strings.length-1);
						for (var x = 0; x < drp.CON_CPL; x++)
						{
							buffer += µ.random_char(char_strings[char_set]);
						}
					}
					drp.con.write_line(y, buffer);
				}
				data.dirty = false;
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>m</span>atrix';
			},
			is_in_menu: function()
			{
				return (drp.game.location == 'governor');
			},
			menu_key: drp.input.KEY_M,
			move_from: function(next_location)
			{
				var data = drp.locations.matrix.data;
				data.dirty = true;
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'The Matrix');
			},
		},


		pub: {
			data:
			{
			},
			render: function()
			{
				
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					var buffer = '';
					for (var x = 0; x < drp.CON_CPL; x++)
					{
						buffer += (Math.random()*x > drp.CON_CPL/2 ? '.' : (Math.random()*x > drp.CON_CPL/2 ? '|' : ':'));
					}
					drp.con.write_line(y, buffer);
				}
			},
			render_update: function(time_delta)
			{
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>p</span>ub';
			},
			is_in_menu: function()
			{
				return (drp.game.location == 'town_square');
			},
			menu_key: drp.input.KEY_P,
			move_from: function(next_location)
			{
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'The Pub');
			},
		},


		store: {
			data:
			{
				items:
				[
					[
						'Plastic Knife', 3, '', function(){return true;}
					],
					[
						'Dog Treat', 20, '', function(){return false;}
					],
				],
			},
			render: function()
			{
				var data = drp.locations.store.data;
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					drp.con.write_line(y, ' ');
				}
				for (var i= 0, len = data.items.length; i < len; i++)
				{
					if (!data.items[i][3]())
					{
						continue;
					}
					var buffer = '';
					buffer += 		µ.pad_text(12, '$' + data.items[i][1])
								+	µ.pad_text(30, data.items[i][0]);
					
					drp.con.write_line(2 + i, buffer);
				}
			},
			render_update: function(time_delta)
			{
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>s</span>tore';
			},
			is_in_menu: function()
			{
				return (drp.game.location == 'town_square');
			},
			menu_key: drp.input.KEY_S,
			move_from: function(next_location)
			{
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'The Store');
			},
		},

		town_square: {
			data:
			{
			},
			render: function()
			{
				for (var y = 1; y < drp.CON_LINES - 2; y++)
				{
					var buffer = '';
					for (var x = 0; x < drp.CON_CPL; x++)
					{
						buffer += (Math.random() > 0.5 ? '.' : (Math.random() > 0.5 ? '|' : ':'));
					}
					drp.con.write_line(y, buffer);
				}
			},
			render_update: function(time_delta)
			{
			},
			menu_string: function()
			{
				return '<span style=color:#ff0;>t</span>own';
			},
			is_in_menu: function()
			{
				return (drp.game.location != 'town_square');
			},
			menu_key: drp.input.KEY_T,
			move_from: function(next_location)
			{
			},
			move_to: function(previous_location)
			{
				drp.con.write_line(drp.STATUS_LINE, 'Town Square');
			},
		},



	};
}