'use strict';

var index = 0;

civ.GAMESTATE__INTRO 				= index; index++;
civ.GAMESTATE__MAIN_MENU 			= index; index++;
civ.GAMESTATE__TERRAIN_GENERATION 	= index; index++;
civ.GAMESTATE__GAME 				= index; index++;
civ.GAMESTATE__ = index; index++;

civ.Gamestate = function()
{
	this.state = civ.GAMESTATE__TERRAIN_GENERATION;
	this.state_time_elapsed = 0;
}

civ.Gamestate.prototype.think = function(time_delta)
{
	if (this.state == civ.GAMESTATE_INTRO)
	{
	}
	else if (this.state == civ.GAMESTATE__TERRAIN_GENERATION)
	{
		civ.map.generate();

		civ.draw_tiles = new µ.WebGL_Rectangle_Tiles(civ.c.gl, civ.cameras.c, civ.c.textures, civ.map.tex_terrain_tiles);
		civ.draw_tiles.set_tile_counts(civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, civ.MAP_SUBTILES_X, civ.MAP_SUBTILES_Y);

		civ.draw_subtiles = new µ.WebGL_Rectangle_Subtiles(civ.c.gl, civ.cameras.c, civ.c.textures);
		civ.draw_subtiles.set_tile_counts(civ.MAP_TERRAIN_TILES_X, civ.MAP_TERRAIN_TILES_Y, civ.MAP_SUBTILES_X, civ.MAP_SUBTILES_Y);

		this.switch_state_to(civ.GAMESTATE__GAME);
	}
	else if (this.state == civ.GAMESTATE__GAME)
	{
		civ.game.think(time_delta);
	}
}

civ.Gamestate.prototype.switch_state_to = function(state)
{
	this.state = state;
	this.state_time_elapsed = 0;
}

civ.Gamestate.prototype._ = function()
{
}

civ.Gamestate.prototype._ = function()
{
	
}
