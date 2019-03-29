"use strict";

lgg.SingularityInside = function()
{
	this.map_size_x = 128;
	this.map_size_y = 128;
	this.tilesize = 1 / Math.max(this.map_size_x, this.map_size_y);
	this.tilesize2 = this.tilesize / 2;
	this.player = null;
	this.enemies = null;
	this.last_scent_update__exit = 0;
	this.last_scent_update__vis = 0;
	this.last_scent_update__player = 0;
	this.last_scent_update__enemies = 0;
	this.last_scent_update__vis_enemies = 0;
	this.last_scent_update__drones = 0;
	this.last_scent_update__vis_player = 0;
	this.projectiles = null;
	this.last_map_regen = 0;
	// lots of stuff not shown here that gets added in generate_map() etc.
}
lgg.SingularityInside.prototype.line_of_sight = function(start_x, start_y, end_x, end_y)
{
	var current_x = start_x;
	var current_y = start_y;
	var delta_x = end_x - start_x;
	var delta_y = end_y - start_y;
	var start_tile_x = Math.floor(start_x / this.tilesize - this.tilesize2);
	var start_tile_y = Math.floor(start_y / this.tilesize - this.tilesize2);
	var end_tile_x = Math.floor(end_x / this.tilesize - this.tilesize2);
	var end_tile_y = Math.floor(end_y / this.tilesize - this.tilesize2);
	var iterations = Math.ceil(Math.max(Math.abs(delta_x), Math.abs(delta_y)) / this.tilesize * 1.5);
	for (var i = 0; i < (iterations + 1); i++)
	{
		var current_x = start_x + (i/iterations) * delta_x;
		var current_y = start_y + (i/iterations) * delta_y;
		var tile_x = Math.floor(current_x / this.tilesize - this.tilesize2);
		var tile_y = Math.floor(current_y / this.tilesize - this.tilesize2);
		// unless it's the target tile, abort when visibility is interrupted
		if (this.tiles[tile_y * this.map_size_x + tile_x] == 1
			&&
			(start_tile_x != tile_x || start_tile_y != tile_y) && ( end_tile_x != tile_x || end_tile_y != tile_y)
			)
		{
			return false;
		}
	}
	return true;
}
lgg.SingularityInside.prototype.think = function(time_delta)
{
	lgg.now = lgg.now - time_delta + this.player.time_factor * time_delta;
	time_delta *= this.player.time_factor;
	if (lgg.input.key('KEY_M').pressed && lgg.now - this.last_map_regen > 500)
	{
		lgg.rand.seed(lgg.rand.mt[lgg.rand.mti-1]);
		this.generate_map();
		this.enemies.reset();
		this.drones.reset();
		this.player.next_stage();
		this.projectiles.reset();
		this.last_map_regen = lgg.now;
	}
	if (lgg.input.key('KEY_N').pressed && lgg.now - this.last_map_regen > 300)
	{
		
		lgg.rand.seed(lgg.rand.mt[lgg.rand.mti+1]);
		this.generate_map();
		this.enemies.reset();
		this.drones.reset();
		this.player.next_stage();
		this.projectiles.reset();
		this.last_map_regen = lgg.now;
	}
/*
	if (lgg.now - this.last_scent_update__enemies > 100)
	{
		this.scent_enemies = this.think_scent(this.scent_enemies, 0.5, 0.95, 0.00000001, 0);
		this.last_scent_update__enemies = lgg.now;
	}
	if (lgg.now - this.last_scent_update__vis_player > 100)
	{
		this.scent_vis_player = this.think_scent(this.scent_vis_player, 0.5, 0.94, 0.0000001, 0);
		this.last_scent_update__vis_player = lgg.now;
	}
*/

	/*
	
	if (lgg.now - this.last_scent_update__exit > 1300)
	{
		this.scent_exit = this.think_scent(this.scent_exit, 0.5, 0.95, 0.00000000001, 1);
		this.last_scent_update__exit = lgg.now;
	}
	if (lgg.now - this.last_scent_update__vis > 380)
	{
		this.scent_vis = this.think_scent(this.scent_vis, 0.5, 0.99, 0.0000000001, 0);
		this.last_scent_update__vis = lgg.now;
	}
	// todo: player_vis
	if (lgg.now - this.last_scent_update__player > 370)
	{
		this.scent_player = this.think_scent(this.scent_player, 0.5, 0.975, 0.0000000001, 0);
		this.last_scent_update__player = lgg.now;
	}
	if (lgg.now - this.last_scent_update__drones > 360)
	{
		this.scent_drones = this.think_scent(this.scent_drones, 0.5, 0.95, 0.000001, 0);
		this.last_scent_update__drones = lgg.now;
	}
	if (lgg.now - this.last_scent_update__vis_enemies > 700)
	{
		this.scent_vis_enemies = this.think_scent(this.scent_vis_enemies, 0.5, 0.94, 0.0000001, 0);
		this.last_scent_update__vis_enemies = lgg.now;
	}
	*/
	
	this.player.think(time_delta);
	this.enemies.think(time_delta);
	this.drones.think(time_delta);
	this.projectiles.think(time_delta);
}
