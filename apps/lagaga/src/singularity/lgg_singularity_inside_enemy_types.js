"use strict";

/*
	GUARD
		like to hang near exits
		chase the player on sight, alert other guards
	GRUNT
		can not see very far
		attack when attacked, or when player comes *very* close, but loose interest quickly
	RANGER
		can see very far
		can smell the player if they're very close
		runs away when badly hurt, slowly regains health
*/
lgg.singularityinside_enemy_types = [

	{

		title:			'Dummy',
		acceleration:	0.00000016,
		friction:		.95,
		smallness:		4,
		turn_speed:     0.35, 
		spawn:			function(e)
		{
			e.ext = {};
		},
		think:			function(e, time_delta)
		{
			var tilesize = lgg.singularity.inside.tilesize;
			
			if (µ.rand_int(1000) == 0)
			{
				var dir = {
					x: (-1 + µ.rand_int(2)),
					y: (-1 + µ.rand_int(2)),
				};
			}
			else
			{
				var dir = lgg.singularity.inside.sniff([
					[lgg.singularity.inside.scent_enemies, -1],
					[lgg.singularity.inside.scent_player, .1],
				], e.tile);
			}

			if (dir && lgg.singularity.inside.tiles[(e.tile_y + dir.y) * lgg.singularity.inside.map_size_x + e.tile_x + dir.x] == 0)
			{
				e.target_pos_x = (e.tile_x + dir.x) * tilesize + tilesize/2;
				e.target_pos_y = (e.tile_y + dir.y) * tilesize + tilesize/2;
			}
		},
		receive_alert:			function(e)
		{
		},
		take_damage:			function(e, amount)
		{
			return amount;
		},
		draw:		function(e)
		{
			var alpha = (lgg.input.key('KEY_F8').pressed ? 1 : e.current_visibility) * (e.dying > 0 ? e.dying / 1000 : 1);
			lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius*2, e.radius*2, 90, (152 - (1 - e.health) * 152), 1, -.75, alpha);
			lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius*1.6, e.radius*1.6, 90,
				(e.ext.alerted ? 280 : 240) /*+ (e.can_see_player ? 200 : 0 )*/
				, 1, -.75, 1 * alpha);
			if (!e.can_see_player)
			{
				lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius/2, e.radius/2, 90, 120, 1, -.75, alpha);
			}
		},
	},

	{
		title:			'Guard',
		acceleration:	0.00000008,
		friction:		.95,
		smallness:		3,
		turn_speed:     0.15, 
		spawn:			function(e)
		{
			e.ext = {};
			e.ext.alerted = false;
			e.ext.time_since_last_alert = 0;
			e.ext.last_shot = -99999;
			e.ext.last_alert = -99999;
		},
		think:			function(e, time_delta)
		{
			var tilesize = lgg.singularity.inside.tilesize;
			e.ext.time_since_last_alert += time_delta;
			if (e.can_see_player)
			{
				e.ext.time_since_last_alert = 0;
				e.ext.alerted = true;
			}
			if (e.ext.time_since_last_alert > 60000)
			{
				e.ext.alerted = false;
			}
			var player = lgg.singularity.inside.player;
			//if (e.target_tile_x == -1 || (e.target_tile_x == e.tile_x && e.target_tile_y == e.tile_y))
			{
				if (e.ext.alerted)
				{
					if (lgg.now - e.ext.last_alert > (e.can_see_player ? 2000 : 5000))
					{
						for (var i = 5; i--;)
						{
							lgg.singularity.inside.projectiles.spawn(
								e.pos_x, e.pos_y,
								µ.rand(360),
								false, e.id, 2, 1000, 0.000040 + µ.rand(0.000160), .1, 50,
								0, 0, .995);
						}
						e.ext.last_alert = lgg.now + µ.rand_int(e.can_see_player ? 4000 : 12000);
					}
				}
				if (!e.ext.alerted && !e.can_see_player)
				{
					var dir = lgg.singularity.inside.sniff([
						[lgg.singularity.inside.scent_exit, 1],
						[lgg.singularity.inside.scent_enemies, -.1],
					], e.tile);
					e.desired_target_range = tilesize/4;
				}
				else if (!e.can_see_player)
				{
					var dir = lgg.singularity.inside.sniff([
						[lgg.singularity.inside.scent_vis_player, 1],
						[lgg.singularity.inside.scent_enemies, -.1],
					], e.tile);
					e.desired_target_range = tilesize/4;
				}
				else
				{
					e.target_pos_x = player.pos_x;
					e.target_pos_y = player.pos_y;
					e.desired_target_range = e.can_hit_player ? tilesize/0.25 : tilesize/1.5;
				}
				if (dir && lgg.singularity.inside.tiles[(e.tile_y + dir.y) * lgg.singularity.inside.map_size_x + e.tile_x + dir.x] == 0)
				{
					e.target_pos_x = (e.tile_x + dir.x) * tilesize + tilesize/2;
					e.target_pos_y = (e.tile_y + dir.y) * tilesize + tilesize/2;
				}
			}
			if (e.can_hit_player)
			{
				var dist_to_player = µ.distance2D(player.pos_x, player.pos_y, e.pos_x, e.pos_y);
				if (lgg.now - e.ext.last_shot > 2500 && dist_to_player < 0.5)
				{
					var shoot_angle = µ.vector2D_to_angle(player.pos_x - e.pos_x, player.pos_y - e.pos_y);
					lgg.singularity.inside.projectiles.spawn(
						e.pos_x + µ.angle_to_x(shoot_angle) * e.radius,
						e.pos_y + µ.angle_to_y(shoot_angle) * e.radius,
						shoot_angle - 1.5 + µ.rand(3),
						true, e.id, 1,
						5000, 0.000025 + µ.rand(0.0000125), 1, 120,
						.25 + µ.rand(.25), 0.000000001 + µ.rand(0.00000001), .998);
					e.ext.last_shot = lgg.now + µ.rand(500);
				}
			}
		},
		receive_alert:			function(e)
		{
			e.ext.alerted = true;
			e.ext.time_since_last_alert = 0;
		},
		take_damage:			function(e, amount)
		{
			e.ext.alerted = true;
			return amount;
		},
		draw:		function(e)
		{
			var alpha = (lgg.input.key('KEY_F8').pressed ? 1 : e.current_visibility) * (e.dying > 0 ? e.dying / 1000 : 1);
			lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius*2, e.radius*2, 90, (52 - (1 - e.health)*52), 1, -.75, alpha);
			lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius*1.6, e.radius*1.6, 90,
				(e.ext.alerted ? 0 : 120) /*+ (e.can_see_player ? 200 : 0 )*/
				, 1, -.75, 1 * alpha);
			if (!e.can_see_player)
			{
				lgg.c.rect_tex.draw(lgg.CAM_PLAYER, lgg.tex_blob, e.pos_x, e.pos_y, e.radius/2, e.radius/2, 90, 120, 1, -.75, alpha);
			}
		},
	},
];