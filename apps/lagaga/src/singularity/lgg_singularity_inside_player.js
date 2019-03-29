"use strict";

lgg.SingularityInside_Player = function()
{
	var tilesize = lgg.singularity.inside.tilesize;
/*
	this.sound_id = lgg.audio.register_sound(function(time, vars) {
		var hmm = vars[0] / 0.00012;
		var hmm2 = 1-vars[1];
		var val = Math.sin(time / 120) * (0.05 + hmm)
				+ Math.cos(time / 133) * (1.5-hmm)
				+ Math.cos(time / 143) * (hmm2)
				+ Math.sin(time / 113) * (hmm2)
				+ Math.sin(time / 113.1) * (hmm2)
		var val_dist = val * 18;
		if (val_dist > 1) val_dist = 1;
		if (val_dist < -1) val_dist = -1;
		return  (val_dist + val) * (0.035 * Math.min(0.75,hmm));
	},function(time, vars) {
		var hmm = vars[0] / 0.00012;
		var hmm2 = 1-vars[1];
		var val = Math.sin(time / 121) * (0.05 + hmm)
				+ Math.cos(time / 134) * (1.5-hmm)
				+ Math.cos(time / 144) * (hmm2)
				+ Math.sin(time / 111) * (hmm2)
				+ Math.sin(time / 111.1) * (hmm2)
		var val_dist = val * 18;
		if (val_dist > 1) val_dist = 1;
		if (val_dist < -1) val_dist = -1;
		return  (val_dist + val) * (0.035 * Math.min(0.75,hmm));
	});
	lgg.audio.set_sound_var(this.sound_id, 0, 0);
	lgg.audio.set_sound_var_inertia(this.sound_id, 0, 50);
	lgg.audio.set_sound_var(this.sound_id, 1, 1);
	lgg.audio.set_sound_var_inertia(this.sound_id, 1, 20);
*/
	this.pos_x = 0;
	this.pos_y = 0;
	this.pos_z = 0;
	this.pos_z_max = 0;
	this.tile = 0;
	this.tile_x = 0;
	this.tile_y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.speed_z = 0;
	this.heading = 90;
	this.sight_range = tilesize * 16;
	this.sight_cone = 80;
	this.sight_vicinity = tilesize * 4;
	this.time_factor = 1;
	this.radius = tilesize/2 * 0.9;
	this.base_acceleration = 0.00005 * tilesize;
	this.base_air_control  = 0.0000006 * tilesize;
	this.jump_acceleration = 0.00062;
	this.gravity = 0.000005;
	this.acceleration = this.base_acceleration;
	this.air_control = this.base_air_control;
	this.base_friction = 0.98;
	this.friction = this.base_friction;
	this.abilities = [];
	this.ability_keys = [];
	var ability_keys = [];
	for (var i = 0; i < lgg.singularityinside_player_abilities.length; i++)
	{
		this.abilities.push(new lgg.singularityinside_player_abilities[i].constructor());
		if (!ability_keys[lgg.singularityinside_player_abilities[i].key])
		{
			ability_keys[lgg.singularityinside_player_abilities[i].key] = [];
		}
		ability_keys[lgg.singularityinside_player_abilities[i].key].push(i);
	}
	for (var i in ability_keys)
	{
		this.ability_keys.push([i,ability_keys[i]])
	}
};
lgg.SingularityInside_Player.prototype.next_stage = function()
{
	for (var i = 0; i < this.abilities.length; i++)
	{
		this.abilities[i].reset();
	}
}
lgg.SingularityInside_Player.prototype.take_damage = function(amount)
{
}
lgg.SingularityInside_Player.prototype.think = function(time_delta)
{
	var tilesize = lgg.singularity.inside.tilesize;
	var firing = false;
	var fire_x = 0;
	var fire_y = 0;
	var ability_keys = [
		'KEY_U','KEY_K','KEY_J','KEY_H',
	];
	for (var i = 0; i < this.ability_keys.length;i++)
	{
		if (lgg.input.key(this.ability_keys[i][0]).pressed)
		{
			this.abilities[this.ability_keys[i][1]].pressed(this, time_delta);
		}
		else
		{
			this.abilities[this.ability_keys[i][1]].released(this, time_delta);
		}
	}
	this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
	this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
	//var old_tile = this.tile;
	this.tile = this.tile_y * lgg.singularity.inside.map_size_x + this.tile_x;
	//if (old_tile != this.tile) console.log(lgg.singularity.inside.tightness[this.tile]);

	lgg.singularity.inside.scent_player[this.tile] += 0.1 * time_delta;
	if (lgg.singularity.inside.scent_player[this.tile] > 1)
		lgg.singularity.inside.scent_player[this.tile] = 1;

	var desired_heading_x = 0;
	var desired_heading_y = 0;
	if (lgg.input.key('KEY_SPACE').pressed)
	{
		if (this.pos_z == 0)
		{
			this.speed_z += this.jump_acceleration * time_delta;
			for (var i = 18; i--;)
			{
				var angle_x = µ.angle_to_x(i*20) * this.radius;
				var angle_y = µ.angle_to_y(i*20) * this.radius;
				// *jumping poof*
				lgg.particlesGPU.spawn(
					lgg.now,
					3,
					this.pos_x + angle_x,
					this.pos_y + angle_y,
					this.pos_x + angle_x,
					this.pos_y + angle_y,
					this.radius/1.5,
					this.speed_x * 100,
					this.speed_y * 100,
					i*20, this.radius * 2,
					'trail',
					1500,
					0,1,1,1,
					7,		//	vary_angle
					this.radius / 8,		//	vary_angle_vel
					.1*this.radius,		//	vary_pos_x
					.1*this.radius,		//	vary_pos_y
					0,		//	vary_size
					.05*this.radius,		//	vary_vel_x
					.05*this.radius,		//	vary_vel_y
					50,		//	vary_lifespan
					0,		//	vary_color_hue
					0,		//	vary_color_sat
					0,		//	vary_color_lum
					0		//	vary_color_a
				);
			}
		}
	}
	if (this.pos_z > 0)
	{
		var actual_acceleration = this.air_control;
	}
	else
	{
		var actual_acceleration = this.acceleration * (lgg.singularity.inside.tiles2[this.tile] == 3 ? 0.4 : 1);
	}
	
	this.heading = µ.vector2D_to_angle(lgg.cameras.player.mouse_pos_x - this.pos_x, lgg.cameras.player.mouse_pos_y - this.pos_y);

	if (lgg.input.key('KEY_D').pressed)
	{
		this.speed_x += actual_acceleration * time_delta;
	}
	else if (lgg.input.key('KEY_A').pressed)
	{
		this.speed_x -= actual_acceleration * time_delta;
	}
	if (lgg.input.key('KEY_W').pressed)
	{
		this.speed_y += actual_acceleration * time_delta;
	}
	else if (lgg.input.key('KEY_S').pressed)
	{
		this.speed_y -= actual_acceleration * time_delta;
	}
	if (lgg.input.key('KEY_F3').pressed)
	{
		var desired_zoom = lgg.cameras.player.zoom_ - time_delta * 0.0075 * lgg.cameras.player.zoom_;
		if (desired_zoom > .02)
			lgg.cameras.player.set_zoom(desired_zoom);
		else
			lgg.cameras.player.set_zoom(.02);
	}
	if (lgg.input.key('KEY_F4').pressed)
	{
		var desired_zoom = lgg.cameras.player.zoom_ + time_delta * 0.0075 * lgg.cameras.player.zoom_;
		if (desired_zoom < 1.2)
			lgg.cameras.player.set_zoom(desired_zoom);
		else
			lgg.cameras.player.set_zoom(1.2);
	}
	lgg.singularity_map_collision(this, time_delta, this.radius, this.radius, 0);
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	this.pos_z += this.speed_z * time_delta;
	if (this.pos_z <= 0)
	{
		this.pos_z = 0;
		if (this.speed_z < 0)
		{
			for (var i = 18; i--;)
			{
				var frac = this.charge / 3000;
				// *landing poof*
				var angle_x = µ.angle_to_x(i*20) * this.radius;
				var angle_y = µ.angle_to_y(i*20) * this.radius;
				lgg.particlesGPU.spawn(
					lgg.now,
					3,
					this.pos_x + angle_x,
					this.pos_y + angle_y,
					this.pos_x + angle_x,
					this.pos_y + angle_y,
					this.radius/1.5,
					this.speed_x * 100,
					this.speed_y * 100,
					i*20, this.radius / 2,
					'trail',
					400,
					0,1,1,1,
					7,		//	vary_angle
					this.radius / 8,		//	vary_angle_vel
					.1*this.radius,		//	vary_pos_x
					.1*this.radius,		//	vary_pos_y
					0,		//	vary_size
					.05*this.radius,		//	vary_vel_x
					.05*this.radius,		//	vary_vel_y
					10,		//	vary_lifespan
					0,		//	vary_color_hue
					0,		//	vary_color_sat
					0,		//	vary_color_lum
					0		//	vary_color_a
				);
			}
		}
		this.speed_z = 0;
	}
	if (this.pos_z > 0)
	{
		this.speed_z -= this.gravity * time_delta;
	}
	this.tile_x = Math.floor(this.pos_x / tilesize - tilesize/2);
	this.tile_y = Math.floor(this.pos_y / tilesize - tilesize/2);
	if (this.pos_z == 0)
	{
		var friction = Math.pow(this.friction, time_delta);
		this.speed_x *= friction;
		this.speed_y *= friction;
	}
	var speed = Math.sqrt(this.speed_x * this.speed_x + this.speed_y * this.speed_y);
	//lgg.audio.set_sound_var(this.sound_id, 0, speed);
	lgg.cameras.player.set_pos(this.pos_x, this.pos_y);
	lgg.cameras.player.calc_mouse(lgg.cameras.player.mouse_screen_x, lgg.cameras.player.mouse_screen_y);
};
lgg.SingularityInside_Player.prototype.draw_shadow = function()
{
	var z_factor0 = this.pos_z;
	var z_factor = 1 + this.pos_z / 1.5;
	var z_factor2 = this.pos_z / 3;
	var z_factor3 = 1 + this.pos_z * 1.25;
	if (this.pos_z_max < this.pos_z)
		this.pos_z_max = this.pos_z;
	lgg.c.draw_circle(
		lgg.CAM_PLAYER,
		this.pos_x + z_factor2 * this.radius,
		this.pos_y - z_factor2 * this.radius,
		this.radius * 0.99 * z_factor3,
		0.5 + z_factor0 / 2, 0,
		0, 1,
		{r:0, g:0, b:0, a:.5 + z_factor0/2});
}
lgg.SingularityInside_Player.prototype.draw = function()
{
	var z_factor = 1 + this.pos_z * 1.15;
/*
	lgg.c.rect_tex.draw(
		lgg.CAM_PLAYER,
		lgg.tex_sphere2,
		this.pos_x,
		this.pos_y,
		this.radius*2 * z_factor,
		this.radius*2 * z_factor,
		this.heading,
		0, 1,
		0.5, 1);
*/
	lgg.c.rect_tex.draw(
		lgg.CAM_PLAYER,
		lgg.tex_sphere,
		this.pos_x,
		this.pos_y,
		this.radius*(2.5+this.pos_z/3) * z_factor,
		this.radius*(2.5+this.pos_z/3) * z_factor,
		this.heading,
		0, .2,
		1, .2);
	lgg.c.rect_tex2b.draw(
		lgg.CAM_PLAYER,
		lgg.tex_sphere, 0, 0, 1, 1,
		lgg.tex_sphere2, 0, 0, 1, 1,
		0 + this.pos_z,
		this.pos_x,
		this.pos_y,
		this.radius*2 * z_factor,
		this.radius*2 * z_factor,
		this.heading,
		1, 1, .7, 0,
		0, 1, .5, 1);

	lgg.c.rect_tex.draw(
		lgg.CAM_PLAYER,
		lgg.tex_sphere,
		lgg.cameras.player.mouse_pos_x,
		lgg.cameras.player.mouse_pos_y,
		this.radius/2,
		this.radius/2,
		this.heading,
		0, .2,
		1, .5);
		

/*
	this.draw = function(
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
		)
	{
*/
};