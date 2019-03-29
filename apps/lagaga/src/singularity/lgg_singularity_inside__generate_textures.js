"use strict";

lgg.SingularityInside.prototype.generate_map_textures = function()
{
	var tex_dim = 4096;
	var self = this;
	var bg_hue = lgg.rand.float(360);
	var wall_hue = lgg.rand.float(360);
	while (Math.abs(bg_hue - wall_hue) < 60)
	{
		var wall_hue = lgg.rand.float(360);
	}
	var free_hue = lgg.rand.float(360);
	while (Math.abs(free_hue - wall_hue) < 60 || Math.abs(free_hue - bg_hue) < 60)
	{
		var free_hue = lgg.rand.float(360);
	}
	var draw_map = function(ctx, alpha, alpha2)
	{
		var map_size_x = self.map_size_x;
		var map_size_y = self.map_size_y;
		var tile_size_x = tex_dim / map_size_x;
		var tile_size_y = tex_dim / map_size_y;
		if (alpha2 > 0)
		{
			ctx.fillStyle = "hsla("+bg_hue+","+0+lgg.rand.float(0)+"%,"+(20+lgg.rand.float(0))+"%,"+alpha2+")";
			ctx.fillRect (0, 0, tex_dim, tex_dim);
		}
		for (var x = 0; x < map_size_x; x++)
		{
			for (var y = 0; y < map_size_y; y++)
			{
				var tile = (map_size_y - y - 1) * map_size_x + x;
				var this_tile = self.tiles[tile];
				if (this_tile == 1 && alpha == 0) continue;
				if (this_tile == 0 && alpha2 == 0) continue;
				
				// exit
				if (self.tiles2[tile] == 1)
				{
					ctx.fillStyle = "hsla(60,100%,50%,"+alpha2+")";
					ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
				}
				// terminal
				else if (self.tiles2[tile] == 2)
				{
					ctx.fillStyle = "hsla(0,0%,99%,"+alpha+")";
					ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
				}
				// puddles
				else if (self.tiles2[tile] == 3)
				{
					ctx.fillStyle = "hsla(240,70%,"+(30 + 250*self.tightness[tile])+"%,"+alpha+")";
					ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
				}
				else
				{
					
					var free_max = 1 - self.tightness[tile];
					var free_max1 = self.tightness[tile];
					// wall
					if (this_tile == 1)
					{
						ctx.fillStyle = "hsla("+(wall_hue)+",90%,"+(60-free_max1*free_max1*free_max1*free_max1*60)+"%,"+alpha+")";
						ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
					}
					else
					{
						// room
						if (self.tiles_rooms[tile] > -1)
						{
							ctx.fillStyle = "hsla("+(free_hue + self.tiles_rooms[tile]*10)+",50%,"+(30 + free_max1*30)+"%,"+(alpha2)+")";
							ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
						}
						// hallway
						else
						{
							ctx.fillStyle = "hsla(0,0%,"+(30 + free_max1*free_max1*30)+"%,"+(alpha2)+")";
							ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y);
						}
						
					}
					// "bevel"
					if (this_tile == 1 && free_max1 < 1)
					{
						//right free
						if (x < map_size_x && self.tiles[tile + 1] != 1)
						{
							var lineargradient = ctx.createLinearGradient(x*tile_size_x + tile_size_x - tile_size_x/8, y*tile_size_y + tile_size_y, x*tile_size_x + tile_size_x, y*tile_size_y + tile_size_y);
							lineargradient.addColorStop(1,'hsla('+(wall_hue)+',50%,0%,0.50)');
							lineargradient.addColorStop(0,'hsla('+(wall_hue)+',90%,30%,0.0)');
							ctx.fillStyle = lineargradient;
							ctx.fillRect (x*tile_size_x + tile_size_x - tile_size_x/8, y*tile_size_y, tile_size_y/8, tile_size_y);
						}
						// left free
						if (x > 0 && self.tiles[tile - 1] != 1)
						{
							var lineargradient = ctx.createLinearGradient(x*tile_size_x, y*tile_size_y + tile_size_y, x*tile_size_x + tile_size_x/4, y*tile_size_y + tile_size_y);
							lineargradient.addColorStop(0,'hsla('+(wall_hue)+',50%,100%,0.50)');
							lineargradient.addColorStop(1,'hsla('+(wall_hue)+',90%,50%,0.0)');
							ctx.fillStyle = lineargradient;
							ctx.fillRect (x*tile_size_x, y*tile_size_y, 15, tile_size_y);
						}
						// top free
						if (y < map_size_y && self.tiles[(map_size_y - y - 0) * map_size_x + x] != 1)
						{
							var lineargradient = ctx.createLinearGradient(x*tile_size_x, y*tile_size_y, x*tile_size_x, y*tile_size_y + tile_size_y/4);
							lineargradient.addColorStop(0,'hsla('+(wall_hue)+',50%,100%,'+(.5*alpha)+')');
							lineargradient.addColorStop(1,'hsla('+(wall_hue)+',90%,50%,0)');
							ctx.fillStyle = lineargradient;
							ctx.fillRect (x*tile_size_x, y*tile_size_y, tile_size_x, tile_size_y/4);
						}
						// bottom free
						if (y > 0 && self.tiles[(map_size_y - y - 2) * map_size_x + x] != 1)
						{
							var lineargradient = ctx.createLinearGradient(x*tile_size_x, y*tile_size_y + tile_size_y - tile_size_y/4, x*tile_size_x, y*tile_size_y + tile_size_y);
							lineargradient.addColorStop(0,'hsla('+(wall_hue)+',50%,30%,0.50)');
							lineargradient.addColorStop(1,'hsla('+(wall_hue)+',90%,0%,0.75)');
							ctx.fillStyle = lineargradient;
							ctx.fillRect (x*tile_size_x, y*tile_size_y + tile_size_y - tile_size_y/4, tile_size_x, tile_size_y/4);
							/*
							//random "crack"
							for (var i = lgg.rand.int(32); i--;)
							{
								var crack_x = 2 + Math.round(lgg.rand.float(tile_size_x-4));
								
								var crack_y = tile_size_y/4;
								var depth = 0.5 + lgg.rand.float(.5);
								ctx.fillStyle = "hsla("+(wall_hue)+",90%,0%,"+(.25*depth*alpha)+")";
								ctx.fillRect (x*tile_size_x - crack_x + tile_size_x, y*tile_size_y + tile_size_y - crack_y, 1, crack_y);
								ctx.fillStyle = "hsla("+(wall_hue)+",90%,100%,"+(.25*depth*alpha)+")";
								ctx.fillRect (x*tile_size_x - crack_x + tile_size_x + 1, y*tile_size_y + tile_size_y - crack_y, 1, crack_y);
							}
							*/
						}
					}
				}
			}
		}
	};
	// (re)generate texture
	lgg.tex_singularity_map		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(tex_dim, tex_dim, function(ctx) {
		draw_map(ctx, 0, 1);
	}), lgg.c.textures[lgg.tex_singularity_map]);
	lgg.tex_singularity_map_walls		= lgg.c.texture_from_canvas(µ.generate_canvas_texture(tex_dim, tex_dim, function(ctx) {
		draw_map(ctx, 1, 0);
	}), lgg.c.textures[lgg.tex_singularity_map_walls]);
}