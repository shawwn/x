"use strict";

/*
	tiles needed:
		water
		lava
		mud
		ice
		stone
		metal
		
		pressure pad, can be hooked up to
			door (open)
			electrical floor (activate)
			laser barrier (deactivate)
			defense turret (activate)
*/
lgg.SingularityInside.prototype.generate_map__bogus = function()
{
	var map_dim = this.map_size_x * this.map_size_y;
	this.make_room(20 + lgg.rand.int(this.map_size_x-40), 20 + lgg.rand.int(this.map_size_y-40), 2 + lgg.rand.int(3), 2 + lgg.rand.int(3), true);
	var dir = µ.directions[lgg.rand.int(3)];
	var digger_p = this.bogus_digger(
		this.find_tunnel_start(),
		dir[0],
		dir[1],
		Math.ceil(map_dim / (3 + lgg.rand.float(5))),
		5 + lgg.rand.int(15),
		lgg.rand.float(.5),
		lgg.rand.float(.15) * lgg.rand.float(.15)
	);
	var bail_out = Math.ceil(map_dim / 1);
	while (digger_p.counter > 0 && bail_out > 0)
	{
		digger_p = this.bogus_digger(
			digger_p.tile,
			digger_p.direction_x,
			digger_p.direction_y,
			digger_p.counter,
			digger_p.streak_counter,
			digger_p.branch_prob,
			digger_p.branch_prob_plus
		);
		bail_out--;
	}
	if (bail_out <= 0) console.log('bailed..');
	for (var passes = 1 + lgg.rand.int(2); passes--;)
	{
		//this.denoise_map(lgg.rand.int(0), 8);
	}
}
lgg.SingularityInside.prototype.bogus_digger = function(tile, direction_x, direction_y, counter, streak_counter, branch_prob, branch_prob_plus)
{
	var x = tile % this.map_size_x;
	var y = Math.floor((tile - x) / this.map_size_x);
	//console.log('#####',tile,x,y);
	var dir = [direction_x,direction_y];
	var bail = 0;
	while (bail < 250 && this.tiles[(y + dir[1]*2) * this.map_size_x + (x + dir[0]*2)] == 0 && this.tiles[(y + dir[1]*1) * this.map_size_x + (x + dir[0]*1)] == 0)
	{
		tile = this.find_tunnel_start();
		x = tile % this.map_size_x;
		y = Math.floor((tile - x) / this.map_size_x);
		dir = µ.directions[lgg.rand.int(3)];
	}
	if (bail == 250) console.log(' BAILED at -->',x,y, direction_x, direction_y);
	var bail = 0;
	while (bail < 10 && (x+dir[0] <= 2 || x+dir[0] >= this.map_size_x - 2 || y+dir[1] <= 2 || y+dir[1] >= this.map_size_y - 2))
	{
		tile = this.find_tunnel_start();
		x = tile % this.map_size_x;
		y = Math.floor((tile - x) / this.map_size_x);
		dir = µ.directions[lgg.rand.int(3)];
		direction_x = dir[0];
		direction_y = dir[1];
		bail++;
	}
	if (bail == 10) console.log(' bailed at -->',x,y, direction_x, direction_y);
	tile = (y + direction_y) * this.map_size_x + (x + direction_x);
	x = tile % this.map_size_x;
	y = Math.floor((tile - x) / this.map_size_x);
	counter--;
	if (counter <= 0)
	{
		return {
			tile: tile,
			direction_x: direction_x,
			direction_y: direction_y,
			counter: counter,
			streak_counter: streak_counter,
			branch_prob: branch_prob,
			branch_prob_plus: branch_prob_plus
		};
	}
	//if (this.tiles[tile] != 0)
	{
		if (this.tiles_rooms[tile] == -1)
		{
			this.dig_tile(tile);
		}
		streak_counter--;
		if (streak_counter <= 0)
		{
			streak_counter = 5 + lgg.rand.int(245);
			branch_prob = lgg.rand.float(.5) + branch_prob_plus;
			tile = this.find_tunnel_start();
			x = tile % this.map_size_x;
			y = Math.floor((tile - x) / this.map_size_x);
			var width = 1+lgg.rand.int(5);
			this.make_room(x, y, width, 7-width, false);
			tile = this.find_tunnel_start();
			x = tile % this.map_size_x;
			y = Math.floor((tile - x) / this.map_size_x);
		}
		else if (lgg.rand.float(1) <= 0.01)
		{
			var width = 1+lgg.rand.int(5);
			this.make_room(x, y, width, 7-width, false);
		}
		else if (lgg.rand.float(1) <= branch_prob)
		{
			//var dir = [direction_x, direction_y];
			//while (dir[0] == direction_x && dir[1] == direction_y)
			{
				dir = µ.directions[lgg.rand.int(3)];
			}
			direction_x = dir[0];
			direction_y = dir[1];
		}
	}
	return {
		tile: tile,
		direction_x: direction_x,
		direction_y: direction_y,
		counter: counter,
		streak_counter: streak_counter,
		branch_prob: branch_prob,
		branch_prob_plus: branch_prob_plus
	};
}