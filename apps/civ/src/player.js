'use strict';

civ.Player = function()
{
	this.selected_unit = -1;
	this.last_command = 0;
}

civ.Player.prototype.think = function(time_delta)
{
	if (civ.input.KEY_LMB.pressed)
	{
		civ.units.u[civ.player.selected_unit].set_move_target(civ.camera_player.mouse_pos_x, civ.camera_player.mouse_pos_y);
	}
	if (civ.input.KEY_SPACE.pressed)
	{
		civ.units.u[civ.player.selected_unit].pos_x = civ.camera_player.mouse_pos_x;
		civ.units.u[civ.player.selected_unit].pos_y = civ.camera_player.mouse_pos_y;
		civ.units.u[civ.player.selected_unit].target_x = civ.units.u[civ.player.selected_unit].pos_x;
		civ.units.u[civ.player.selected_unit].target_y = civ.units.u[civ.player.selected_unit].pos_y;
	}

	if (civ.input.KEY_CURSOR_UP.pressed)
	{
		var subtile_index = (civ.gui.selected_subtile_y * civ.map.subtiles_total_x + civ.gui.selected_subtile_x);
		civ.map.subtiles__harvestable1[subtile_index] += 0.02 * time_delta;;
		if (civ.map.subtiles__harvestable1[subtile_index] >= 1)
		{
			civ.map.subtiles__harvestable1[subtile_index] = 1;
		}
		//civ.map.update_subtile(civ.gui.selected_subtile_x, civ.gui.selected_subtile_y, true);
		civ.map.update_subtile(civ.gui.selected_subtile_x, civ.gui.selected_subtile_y, true);
	}

	if (civ.input.KEY_CURSOR_DOWN.pressed)
	{
		var subtile_index = (civ.gui.selected_subtile_y * civ.map.subtiles_total_x + civ.gui.selected_subtile_x);
		civ.map.subtiles__harvestable1[subtile_index] -= 0.002 * time_delta;
		if (civ.map.subtiles__harvestable1[subtile_index] <= 0)
		{
			civ.map.subtiles__harvestable1[subtile_index] = 0;
		}
		//civ.map.update_subtile(civ.gui.selected_subtile_x, civ.gui.selected_subtile_y, true);
		civ.map.update_subtile(civ.gui.selected_subtile_x, civ.gui.selected_subtile_y, true);
	}

	if (civ.input.KEY_1.pressed)
	{
		civ.map.set_building(civ.BUILDING_TYPE__COLONY, civ.gui.selected_subtile_x, civ.gui.selected_subtile_y);
	}
	if (civ.input.KEY_2.pressed)
	{
		civ.map.set_building(civ.BUILDING_TYPE__FARM, civ.gui.selected_subtile_x, civ.gui.selected_subtile_y);
	}
	if (civ.input.KEY_3.pressed)
	{
		civ.map.set_building(civ.BUILDING_TYPE__NATURAL_RESERVE, civ.gui.selected_subtile_x, civ.gui.selected_subtile_y);
	}
	if (civ.input.KEY_4.pressed)
	{
		civ.map.set_building(civ.BUILDING_TYPE__STONE_WALL, civ.gui.selected_subtile_x, civ.gui.selected_subtile_y);
	}

	if (civ.input.KEY_R.pressed)
	{
		civ.map.moar_rain();
	}

	if (civ.input.KEY_F.pressed)
	{
		civ.game.speed_factor = civ.camera_stretch.mouse_pos_x * civ.camera_stretch.mouse_pos_x;
	}


	if (civ.input.KEY_N.pressed && civ.now - this.last_command > 1000)
	{

		civ.colonies.spawn(civ.PLAYER_FACTION_ID, civ.camera_player.mouse_pos_x, civ.camera_player.mouse_pos_y);

		//civ.gui.this.selected_subtile_x
		// is the tile free?
		// is there a neighbouring city?

		this.last_command = civ.now;
	}

}

civ.Player.prototype._ = function()
{
}

civ.Player.prototype._ = function()
{
	
}
