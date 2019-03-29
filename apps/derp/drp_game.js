drp.Game = function()
{
	this.reset();
};

drp.Game.prototype.reset = function()
{
	this.money = 100;
	this.fame = 0;
	this.dirty_menu = true;
	this.wait_input = true;
	this.wait_space = false;
	this.location = 'town_square';
	drp.locations[this.location].move_to(null);
	drp.locations[this.location].render();

	this.last_menu_key = null;
}


drp.Game.prototype.update = function(time_delta)
{
	drp.locations[this.location].render_update(time_delta);
}

drp.Game.prototype.think = function(time_delta)
{
	if (this.wait_input)
	{
		for (i in drp.locations)
		{
			if (drp.locations[i].is_in_menu())
			{
				if (drp.locations[i].menu_key.pressed)
				{
					this.last_menu_key = drp.locations[i].menu_key;
					this.wait_input = false;
					this.dirty_menu = true;
					//console.log(i);
					drp.locations[this.location].move_from(i);
					drp.con.write_line(drp.STATUS_LINE, '');
					drp.locations[i].move_to(this.location);
					this.location = i;
					drp.locations[this.location].render();
				}
			}
		}
	}
	else
	{
		if (this.last_menu_key != null && !this.last_menu_key.pressed)
		{
			this.wait_input = true;
		}
	}

	if (this.dirty_menu == true)
	{
		this.draw_menu();
	}
	this.update(time_delta);
}

drp.Game.prototype.draw_menu = function ()
{
	drp.con.write_line(drp.HUD_LINE,
			''
			+µ.pad_text(8, drp.game.money)+' bling'
			+'    '
			+µ.pad_text(4, drp.game.fame)+' fame'
			+'    '
			
			);
			
	var menu_text = '';
	for (i in drp.locations)
	{
		if (drp.locations[i].is_in_menu())
			menu_text += '   ' + drp.locations[i].menu_string();
	}
	drp.con.write_line(drp.MENU_LINE,'' + menu_text +'');
}