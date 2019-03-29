"use strict";

lgg.SingularityInside.prototype.draw = function()
{
	if (lgg.level.state == lgg.LEVELSTATE__SINGULARITY_ENTER)
	{
		var fade = lgg.level.state_time/500;
	}
	else if (lgg.level.state == lgg.LEVELSTATE__SINGULARITY_EXIT)
	{
		var fade = 1 - lgg.level.state_time/500;
	}
	else
	{
		var fade = 1;
	}
	if (fade < 1)
	{
		lgg.c.draw_rectangle(lgg.CAM_STRETCH, .5, .5, 1, 1, 90, {r:0,g:0,b:0,a:.5*fade});
	}
	lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_singularity_map, 0.5, 0.5, 1, 1, 90, 0, 1, 1, 1);

	lgg.c.flush_all();
	this.player.draw_shadow();

	lgg.c.flush_all();
	lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE, lgg.c.gl.FUNC_ADD);
	lgg.particlesGPU.draw(lgg.now, lgg.c.gl, lgg.cameras.player);
	lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);

	this.update_visible_tiles();
	lgg.c.flush_all();
	this.enemies.draw();
	this.drones.draw();
	lgg.c.flush_all();
	//if (lgg.input.key('KEY_SPACE').pressed)
	{
		lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_singularity_map_walls, 0.5, 0.5, 1, 1, 90, 0, 1, 1, 1);
	}
	//else
	{

	/*this.draw = function(
		cam_id,
		texture_id, texture_offset_x, texture_offset_y, texture_scale_x, texture_scale_y,
		texture2_id, texture2_offset_x, texture2_offset_y, texture2_scale_x, texture2_scale_y,
		fade,
		pos_x,
		pos_y,
		width,
		height,
		angle,
		mix_h, mix_s, mix_l, mix_a,
		tint_h, tint_s, tint_l, tint_a
		)*/

		/*
		lgg.c.rect_tex2b.draw(lgg.CAM_PLAYER,
			lgg.tex_singularity_map_walls, 0, 0, 1, 1,
			lgg.tex_stone1, 0, 0, this.map_size_x*1.2, this.map_size_y*1.5,
			lgg.cameras.stretch.mouse_pos_x,
			0.5, 0.5, 1, 1,
			90,
			0, 0, 0, -1,
			0, 2, 1.5, 1);
		
		lgg.c.flush_all();
		//*/
		//lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_singularity_map_walls, 0.5, 0.5, 1, 1, 90, 0, 1, 1, .75);
	}
	lgg.c.flush_all();
	this.player.draw();
	lgg.c.flush_all();
	lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE, lgg.c.gl.FUNC_ADD);
	lgg.particlesGPU2.draw(lgg.now, lgg.c.gl, lgg.cameras.player);
	lgg.c.set_blending(lgg.c.gl.SRC_ALPHA, lgg.c.gl.ONE_MINUS_SRC_ALPHA, lgg.c.gl.FUNC_ADD);
	if (!lgg.input.key('KEY_F1').pressed)
	{
		this.draw_occlusion();
	}
	this.draw_debug();
};
lgg.SingularityInside.prototype.draw_debug = function()
{
	if (lgg.input.key('KEY_1').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_player);
	}
	if (lgg.input.key('KEY_2').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_vis);
	}
	if (lgg.input.key('KEY_3').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_drones);
	}
	if (lgg.input.key('KEY_4').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_enemies);
	}
	if (lgg.input.key('KEY_5').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_vis_enemies);
	}
	if (lgg.input.key('KEY_6').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_exit);
	}
	if (lgg.input.key('KEY_7').pressed)
	{
		lgg.c.flush_all();
		this.draw_scent(this.scent_vis_player);
	}
	if (lgg.input.key('KEY_8').pressed)
	{
		lgg.c.flush_all();
		this.draw_density_map();
	}
	if (lgg.input.key('KEY_9').pressed)
	{
		lgg.c.flush_all();
		this.draw_rooms();
	}
	if (lgg.input.key('KEY_0').pressed)
	{
		lgg.c.flush_all();
		this.draw_tightness();
	}
	lgg.c.flush_all();
}
lgg.SingularityInside.prototype.draw_occlusion = function()
{
	/*
	lgg.c.flush_all();
	*/

	var show_explored = !lgg.input.key('KEY_F2').pressed;

	var tiles_x = Math.ceil(lgg.cameras.player.zoom_ * lgg.cameras.player.aspect / this.tilesize / 2) + 1;
	var tiles_y = Math.ceil(lgg.cameras.player.zoom_ / this.tilesize / 2) + 1;
	var start_x = Math.max(0, Math.round(lgg.cameras.player.pos_x / this.tilesize) - tiles_x);
	var end_x = Math.min(this.map_size_x, Math.round(lgg.cameras.player.pos_x / this.tilesize) + tiles_x);
	var start_y = Math.max(0, Math.round(lgg.cameras.player.pos_y / this.tilesize) - tiles_y);
	var end_y = Math.min(this.map_size_y, Math.round(lgg.cameras.player.pos_y / this.tilesize) + tiles_y);

	/*
	lgg.c.tilemap_occlusion.draw(lgg.CAM_PLAYER, this.tile_vis, this.map_size_x, this.map_size_y, start_x, start_y, end_x, end_y);
	return;
	//*/
	
	for (var x = start_x; x < end_x; x++)
	{
		for (var y = start_y; y < end_y; y++)
		{
			var i = y * this.map_size_x + x;
		//	for (var i = this.tiles.length; i--;)
			{
				if (this.tiles[i] == 1 && this.tightness[i] == 1)
				{
					continue;
				}
				var alpha = 0;
				if (this.tile_exp[i] == 0 && this.tile_vis[i] == 0)
				{
					alpha = 1;
				}
				else
				{
					if (show_explored)
					{
						alpha = 1 - (Math.max(this.tile_vis[i], this.tile_exp[i] / 4));
					}
					else
					{
						alpha = 1 - this.tile_vis[i];
					}
				}
				if (alpha > 0)
				{
					//var x = i % this.map_size_x;
					//var y = ((i - x) / this.map_size_y);
					var alpha1 = 1-alpha;
					if (alpha < 1)
					{
						lgg.c.draw_rectangle(lgg.CAM_PLAYER,
							x * this.tilesize + this.tilesize2,
							y * this.tilesize + this.tilesize2,
							this.tilesize * alpha * (3.0*alpha1),
							this.tilesize * alpha * (3.0*alpha1),
							(90 + x + y) * this.tile_vis[i],
							{r:0,g:0,b:0,a:alpha*alpha/2}
						);
					}
					lgg.c.draw_rectangle(lgg.CAM_PLAYER,
						x * this.tilesize + this.tilesize2,
						y * this.tilesize + this.tilesize2,
						this.tilesize,
						this.tilesize,
						0,
						{r:0,g:0,b:0,a:alpha*alpha}
					);
					/*
					lgg.c.draw_circle(lgg.CAM_PLAYER,
						x * this.tilesize + this.tilesize2,
						y * this.tilesize + this.tilesize2,
						(this.tilesize2+alpha*this.tilesize2)/2,
						1-alpha, 0,
						0, 1,
						{r:0,g:0,b:0,a:alpha});
					*/
				}
			}
		}
	}
}
lgg.SingularityInside.prototype.draw_tightness = function()
{
	for (var j = this.empty_tiles.length; j--;)
	{
		var i = this.empty_tiles[j];
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
		{
			var hue = this.tightness[i]*360;
			lgg.c.rect_tex.draw(
				lgg.CAM_PLAYER, lgg.tex_red,
				x * this.tilesize + this.tilesize2, y * this.tilesize + this.tilesize2, this.tilesize2*1.5, this.tilesize2*1.5, 45,
				hue, 1, 1, .75);
		}
	}
}
lgg.SingularityInside.prototype.draw_density_map = function()
{
	for (var i = this.tiles.length; i--;)
	{
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
			lgg.c.rect_tex.draw(
				lgg.CAM_PLAYER, lgg.tex_red,
				x * this.tilesize + this.tilesize2, y * this.tilesize + this.tilesize2, this.tilesize, this.tilesize, 90,
				this.density_map[i] * 360, 1, 1, .9);
				
				
	}
}
lgg.SingularityInside.prototype.draw_rooms = function(scent)
{
	for (var j = this.empty_tiles.length; j--;)
	{
		var i = this.tiles[j];
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
		//if (this.tiles_rooms[i] > -1)
		{
			lgg.c.rect_tex.draw(
				lgg.CAM_PLAYER, lgg.tex_red,
				x * this.tilesize + this.tilesize2, y * this.tilesize + this.tilesize2, this.tilesize, this.tilesize, 90,
				this.tiles_rooms[i] * 20, 1, .5, 1);
		}
	}
}
lgg.SingularityInside.prototype.draw_scent = function(scent)
{
	for (var j = this.empty_tiles.length; j--;)
	{
		var i = this.empty_tiles[j];
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
		{
			var hue = -1;
			if (scent[i] > 0.9)
			{
				hue = 0;
			}
			if (scent[i] > 0.75)
			{
				hue = 20;
			}
			else if (scent[i] > 0.5)
			{
				hue = 40;
			}
			else if (scent[i] > 0.25)
			{
				hue = 60;
			}
			else if (scent[i] > 0.1)
			{
				hue = 80;
			}
			else if (scent[i] > 0.01)
			{
				hue = 120;
			}
			else if (scent[i] > 0.001)
			{
				hue = 160;
			}
			else if (scent[i] > 0.0001)
			{
				hue = 200;
			}
			else if (scent[i] > 0.00001)
			{
				hue = 240;
			}
			else if (scent[i] > 0.000001)
			{
				hue = 280;
			}
			else if (scent[i] > 0.0)
			{
				hue = 320;
			}
			
			if (hue > -1)
			{
				lgg.c.rect_tex.draw(
					lgg.CAM_PLAYER, lgg.tex_red,
					x * this.tilesize + this.tilesize2, y * this.tilesize + this.tilesize2, this.tilesize*0.9, this.tilesize*0.9, 90,
					hue = Math.log(1/scent[i] * 1/scent[i]) * 8, 1, -1, 0.75);
				lgg.c.rect_tex.draw(
					lgg.CAM_PLAYER, lgg.tex_red,
					x * this.tilesize + this.tilesize2, y * this.tilesize + this.tilesize2, this.tilesize2*0.9, this.tilesize2*0.9, 90,
					hue, 1, -1, 0.75);
			}
		}
	}
};
lgg.SingularityInside.prototype.update_visible_tiles = function()
{
	var player = lgg.singularity.inside.player;
	var player_eye_x = player.pos_x + µ.angle_to_x(player.heading) * player.radius;
	var player_eye_y = player.pos_y + µ.angle_to_y(player.heading) * player.radius;
	var player_radius_9 = player.radius*.8;
	var tilesize_8 = this.tilesize2*.75;
	this.obscured_tiles = [];
	for (var i = this.tiles.length; i--;)
	{
		if (this.tiles[i] != 0 && this.tightness[i] == 1)
		{
			continue;
		}
		var x = i % this.map_size_x;
		var y = ((i - x) / this.map_size_y);
		var visible = false;
		var pos_x = x * this.tilesize + this.tilesize2;
		var pos_y = y * this.tilesize + this.tilesize2;
		var visible_by_player = false;
		var visible_by_drone = false;
		var visibility = 0;
		
		// this is nuts haha
		for (var j = 0; j < lgg.MAX_SINGULARITY_DRONES; j++)
		{
			var drone = this.drones.d[j];
			if (drone.active)
			{
				if (Math.abs(pos_x - drone.pos_x) <= drone.sight_range && Math.abs(pos_y - drone.pos_y) <= drone.sight_range)
				{
					var dist = µ.distance2D(pos_x, pos_y, drone.pos_x, drone.pos_y)
					if (dist <= drone.sight_range)
					{
						var angle = dist <= drone.sight_vicinity ? 0 : µ.vector2D_to_angle(pos_x - drone.pos_x, pos_y - drone.pos_y);
						if (dist <= drone.sight_vicinity || (µ.angle_norm(angle - drone.heading + drone.sight_cone/2)) <= drone.sight_cone)
						{
							if (this.line_of_sight(drone.pos_x, drone.pos_y, pos_x, pos_y))
							{
								visible_by_drone = true;
								visibility = Math.max(1 - dist/drone.sight_range, visibility);
							}
						}
					}
				}
			}
		}
		if (Math.abs(pos_x - player.pos_x) <= player.sight_range && Math.abs(pos_y - player.pos_y) <= player.sight_range)
		{
			var dist = µ.distance2D(pos_x, pos_y, player.pos_x, player.pos_y)
			if (dist <= player.sight_range)
			{
				var angle = dist <= player.sight_vicinity ? 0 : µ.vector2D_to_angle(pos_x - player.pos_x, pos_y - player.pos_y);
				if (dist <= player.sight_vicinity || (µ.angle_norm(angle - player.heading + player.sight_cone/2)) <= player.sight_cone)
				{
					for (var d = 4; d--;)
					{
						if (this.line_of_sight(
							player_eye_x,
							player_eye_y,
							pos_x + µ.corners[d][0] * tilesize_8,
							pos_y + µ.corners[d][1] * tilesize_8
							))
						{
								visible_by_player = true;
								break;
						}
					}
				}
				if (visible_by_player)
				{
					if (dist < player.sight_range * 0.5)
					{
						visibility = 1;
					}
					else
					{
						visibility = 1 - (dist - player.sight_range * 0.5) / (player.sight_range * 0.5);
					}
					

					//visibility = Math.max(1 - dist/player.sight_range, visibility);
				}
			}
		}
		if (visible_by_player)
		{
			this.tile_vis[i] = Math.min(visibility, this.tile_vis[i] + 0.025 * visibility);
			this.scent_vis[i] += 0.05 * visibility;
			this.tile_exp[i] += 0.2 * visibility;
		}
		else if (visible_by_drone)
		{
			this.tile_vis[i] = Math.min(visibility, this.tile_vis[i] + 0.1 * visibility);
			//this.scent_vis[i] += 0.05 * visibility; //hmm, this confuses the fuck out of the drones
		}
		else
		{
			this.tile_vis[i] *= 0.99;
			this.tile_exp[i] *= 0.9998;
			this.tile_vis[i] -= 0.02;
			this.scent_vis[i] *= 0.95; // extra decay
		}
		if (this.tile_exp[i] > 1)	this.tile_exp[i] = 1;
		if (this.tile_vis[i] > 1)	this.tile_vis[i] = 1;
		if (this.tile_vis[i] < 0)	this.tile_vis[i] = 0;
		if (this.scent_vis[i] > 1)	this.scent_vis[i] = 1;
	}
}