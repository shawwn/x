'use strict';

/*
	SCREENS
*/

civ.GUI = function()
{

	this.sidebar_width = 0.17;
	this.date = 0;
	this.speed_factor = 1.0;
	this.selected_tile_x = 0;
	this.selected_tile_y = 0;

	this.selected_subtile_x = 0;
	this.selected_subtile_y = 0;
}

civ.GUI.prototype.think = function(time_delta)
{
	this.selected_tile_x = Math.floor(civ.camera_player.mouse_pos_x / civ.WORLD_SIZE_X * civ.map.tiles_x);
	this.selected_tile_y = Math.floor(civ.camera_player.mouse_pos_y / civ.WORLD_SIZE_Y * civ.map.tiles_y);

	this.selected_tile_x = µ.between(0, this.selected_tile_x, civ.map.tiles_x - 1);
	this.selected_tile_y = µ.between(0, this.selected_tile_y, civ.map.tiles_y - 1);

	this.selected_subtile_x = Math.floor(civ.camera_player.mouse_pos_x / civ.WORLD_SIZE_X * civ.map.subtiles_total_x);
	this.selected_subtile_y = Math.floor(civ.camera_player.mouse_pos_y / civ.WORLD_SIZE_Y * civ.map.subtiles_total_y);

	this.selected_subtile_x = µ.between(0, this.selected_subtile_x, civ.map.subtiles_total_x - 1);
	this.selected_subtile_y = µ.between(0, this.selected_subtile_y, civ.map.subtiles_total_y - 1);

}

civ.GUI.prototype.draw = function()
{

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_thick_outline,
		(civ.map.subtile_size_x2 + civ.map.subtile_size_x * this.selected_subtile_x),
		(civ.map.subtile_size_y2 + civ.map.subtile_size_y * this.selected_subtile_y),
		civ.map.subtile_size_x * 1,
		civ.map.subtile_size_y * 1,
		1, 1,
		90,
		(civ.now % 3000) / 3000 * 360, 1.0, 2.0, .000000000000000,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_square_outline,
		(civ.map.tile_size_x2 + civ.map.tile_size_x * this.selected_tile_x),
		(civ.map.tile_size_y2 + civ.map.tile_size_y * this.selected_tile_y),
		civ.map.tile_size_x * 1,
		civ.map.tile_size_y * 1,
		1, 1,
		90,
		(civ.now % 13000) / 13000 * 360, 1.0, 1.0, 0.00000000000000,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle_outline_dash_1_1,
		civ.camera_player.mouse_pos_x + 0.005,
		civ.camera_player.mouse_pos_y - 0.005,
		civ.UNIT__BASE_RADIUS * .02,
		civ.UNIT__BASE_RADIUS * .02,
		1, 1,
		360 * ((civ.now % 17500) / 17500),
		((civ.now + 1500) % 3000) / 3000 * 360, 0, 0, 0.00000000000000,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle_outline_dash_1_1,
		civ.camera_player.mouse_pos_x,
		civ.camera_player.mouse_pos_y,
		civ.UNIT__BASE_RADIUS * .02,
		civ.UNIT__BASE_RADIUS * .02,
		1, 1,
		360 * ((civ.now % 17500) / 17500),
		0, 0, 1.95, 0.95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle,
		civ.camera_player.mouse_pos_x,
		civ.camera_player.mouse_pos_y,
		civ.UNIT__BASE_RADIUS * .02,
		civ.UNIT__BASE_RADIUS * .02,
		1, 1,
		90,
		((civ.now + 1500) % 3000) / 3000 * 360, 0.1, 0.85, 0.35 + 0.05 * Math.sin(civ.now / 80),
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	
	civ.c.flush_all();

	this.draw_selected_unit_marker();
	this.draw_sidebar();

}

civ.GUI.prototype.draw_selected_unit_marker = function()
{
	
	var zoom = Math.max(0.2 * civ.camera_player.zoom_, civ.units.u[civ.player.selected_unit].radius2 * 10.5);

	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle_outline,
		civ.units.u[civ.player.selected_unit].pos_x,
		civ.units.u[civ.player.selected_unit].pos_y,
		zoom,
		zoom,
		1, 1,
		90,
		55, 1, 1.0, 0.75,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.c.rectangle_textured.draw(
		civ.CAM_PLAYER,
		civ.tex_circle_soft_reverse,
		civ.units.u[civ.player.selected_unit].pos_x,
		civ.units.u[civ.player.selected_unit].pos_y,
		zoom,
		zoom,
		1, 1,
		90,
		55, 1, 1.0, 0.25,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

}

civ.GUI.prototype.draw_selected_unit_info = function()
{
	var factor = 0.2;

	var y_offset = 0.015;
	civ.fonts.draw_text(
		'x: ' + Math.round(civ.units.u[civ.player.selected_unit].pos_x * 10) / 10,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);
	y_offset += 0.015;
	civ.fonts.draw_text(
		'y: ' + Math.round(civ.units.u[civ.player.selected_unit].pos_y * 10) / 10,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'food: ' + Math.round(civ.units.u[civ.player.selected_unit].type.food_stored * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	var tile_index = (civ.map.tiles_x - this.selected_tile_y - 1) * civ.map.tiles_x + this.selected_tile_x;
	var subtile_index = (civ.map.subtiles_total_y - this.selected_subtile_y - 1) * civ.map.subtiles_total_x + this.selected_subtile_x;

	var selected_terrain = civ.terrain_types[civ.map.tiles__terrain_type[tile_index]];

	//console.log(selected_terrain, selected_terrain.name);

	y_offset += 0.03;
	civ.fonts.draw_text(
		selected_terrain.name,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.115 * factor, 0.19 * factor, 0.015 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	y_offset += 0.03;
	civ.fonts.draw_text(
		'h: ' + Math.round(civ.map.subtiles__harvestable1[subtile_index] * 10000) / 10000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'height: ' + Math.round(civ.map.tiles__terrain_height[tile_index] * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'humid: ' + Math.round(civ.map.tiles__humidity[tile_index] * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		210, 1, .5, .9,
		-1, -1, .7, .9,
		-1, -1, .99, .9,
		-1, -1, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'temp: ' + Math.round(civ.map.tiles__temperature[tile_index] * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		10, 1, .5, .9,
		-1, -1, .7, .9,
		-1, -1, .99, .9,
		-1, -1, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'vegetation: ' + Math.round(civ.map.tiles__vegetation[tile_index] * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		110, 1, .5, .9,
		-1, -1, .7, .9,
		-1, -1, .99, .9,
		-1, -1, .9, .9
		);

	y_offset += 0.015;
	civ.fonts.draw_text(
		'biome: ' + Math.round(civ.map.tiles__terrain_biome[tile_index] * 1000) / 1000,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		1 - this.sidebar_width + 0.01,
		civ.camera_landscape.one_over_aspect - this.sidebar_width - y_offset,
		0.105 * factor, 0.115 * factor, 0.025 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);
}


civ.GUI.prototype.draw_sidebar = function()
{

	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square,
		1 - this.sidebar_width * 0.5,
		civ.camera_landscape.one_over_aspect * 0.5,
		this.sidebar_width * 1.02,
		civ.camera_landscape.one_over_aspect,
		1, 1, 90,
		0, 0, 0, 0.985,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	this.draw_minimap();
	this.draw_selected_unit_info();
	this.draw_legend();
	this.draw_clock();

	civ.c.flush_all();
}

civ.GUI.prototype.draw_clock = function()
{
	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square,
		0.5,
		civ.camera_landscape.one_over_aspect - 0.015,
		0.2,
		0.025,
		1, 1, 90,
		0, 0, 0, 0.75,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square,
		0.4 + 0.1 * civ.game.speed_factor,
		civ.camera_landscape.one_over_aspect - 0.00125,
		0.2 * civ.game.speed_factor,
		0.0025,
		1, 1, 90,
		52 * civ.game.speed_factor, 1, 1.0, 0.95,
		-1, -1, 0.3, -1,
		-1, -1, 0.1, -1,
		-1, -1, 0.7, -1);



	var factor = 0.2;

	var game_seconds = Math.round(civ.game.date / civ.DEFAULT_GAME_SPEED);
	var game_minutes = Math.floor(game_seconds / 60);
	var game_hours = Math.floor(game_minutes / 60);
	var game_days = Math.floor(game_hours / 24);

	game_seconds = game_seconds % 60;
	game_minutes = game_minutes % 60;
	game_hours = game_hours % 24;

	civ.fonts.draw_text(
		'day ' + (game_days + 1) + ', ' + game_hours + ':' + game_minutes /* + ':' + game_seconds */,
		civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
		0.41,
		civ.camera_landscape.one_over_aspect - 0.0125,
		0.195 * factor, 0.195 * factor, 0.035 * factor,
		0, 0, .5, .9,
		0, 0, .7, .9,
		0, 0, .99, .9,
		0, 0, .9, .9
		);

}

civ.GUI.prototype.draw_legend = function()
{


	var _height = civ.map.tiles__terrain_height;
	var _temp = civ.map.tiles__temperature;
	var _biome = civ.map.tiles__terrain_biome;
	var _humidity = civ.map.tiles__humidity;
	var _vegetation = civ.map.tiles__vegetation;

	var line = 0;
	for(var tile_x = 0; tile_x < this.tiles_x; tile_x++)
	{
		for(var tile_y = 0; tile_y < this.tiles_y; tile_y++)
		{
			var i = this.selected_tile_y * civ.map.tiles_x + this.selected_tile_x;
			var frac = 2.0 * Math.abs(tile_y / civ.map.tiles_y - 0.5);
			var best_terrain_score = -99999999999999999;
			var best_terrain_id = null;
			var best_terrain_type = null;
			var eligible = [];
			for (var terrain_type_id = 1, len = civ.terrain_types.length; terrain_type_id < len; terrain_type_id++)
			{
				var terrain_type = civ.terrain_types[terrain_type_id];
				if (
						_height[i] >= terrain_type.min_elevation
					&& 	_height[i] <= terrain_type.max_elevation
					&&	_humidity[i] >= terrain_type.min_humidity
					&& 	_humidity[i] <= terrain_type.max_humidity
					&&	_temp[i] >= terrain_type.min_temperature
					&& 	_temp[i] <= terrain_type.max_temperature
					&&	_vegetation[i] >= terrain_type.min_vegetation
					&& 	_vegetation[i] <= terrain_type.max_vegetation
					)
				{
					y_offset += 0.015;
					civ.fonts.draw_text(
						'vegetation: ' + Math.round(civ.map.tiles__vegetation[tile_index] * 1000) / 1000,
						civ.CAM_LANDSCAPE, civ.FONT_DEFAULT,
						0,
						civ.camera_landscape.one_over_aspect - this.sidebar_width - 0.01 * line,
						0.105 * factor, 0.115 * factor, 0.025 * factor,
						110, 1, .5, .9,
						-1, -1, .7, .9,
						-1, -1, .99, .9,
						-1, -1, .9, .9
						);
					line++;
				}
			}
		}
	}




}



civ.GUI.prototype.draw_minimap = function()
{
	var minimap_size = this.sidebar_width;
	var minimap_size2 = minimap_size / 2;

	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square,
		1 - minimap_size2 * 1.02, civ.camera_landscape.one_over_aspect - minimap_size2 * 1.02,
		minimap_size * 1.02, minimap_size * 1.02,
		1, 1, 90,
		0, 0, 0, 0.95,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.flush_all();

	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.map.tex_terrain_tiles_interp_linear,
		1 - minimap_size2, civ.camera_landscape.one_over_aspect - minimap_size2,
		minimap_size, minimap_size,
		1, 1, 90,
		0, 1, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	civ.c.flush_all();
	civ.c.set_blending(civ.c.gl.SRC_ALPHA, civ.c.gl.ONE, civ.c.gl.FUNC_ADD);

	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square,
		1 - minimap_size 										+ (civ.camera_player.pos_x * civ.ONE_OVER_WORLD_SIZE_X) * minimap_size,
		civ.camera_landscape.one_over_aspect - minimap_size 	+ (civ.camera_player.pos_y * civ.ONE_OVER_WORLD_SIZE_Y) * minimap_size,
		minimap_size * Math.max(civ.camera_player.zoom_x * civ.ONE_OVER_WORLD_SIZE_X, 0.045),
		minimap_size * Math.max(civ.camera_player.zoom_y * civ.ONE_OVER_WORLD_SIZE_Y, 0.045),
		1, 1, 90,
		0, 0, 2, 0.65,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.c.rectangle_textured.draw(
		civ.CAM_LANDSCAPE,
		civ.tex_square_outline,
		1 - minimap_size 										+ (civ.camera_player.pos_x * civ.ONE_OVER_WORLD_SIZE_X) * minimap_size,
		civ.camera_landscape.one_over_aspect - minimap_size 	+ (civ.camera_player.pos_y * civ.ONE_OVER_WORLD_SIZE_Y) * minimap_size,
		minimap_size * Math.max(civ.camera_player.zoom_x * civ.ONE_OVER_WORLD_SIZE_X, 0.045),
		minimap_size * Math.max(civ.camera_player.zoom_y * civ.ONE_OVER_WORLD_SIZE_Y, 0.045),
		1, 1, 90,
		0, 0, 2, 0.85,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	civ.c.flush_all();
	civ.c.set_blending(civ.c.gl.SRC_ALPHA, civ.c.gl.ONE_MINUS_SRC_ALPHA, civ.c.gl.FUNC_ADD);
}

civ.GUI.prototype._ = function()
{
	
}
