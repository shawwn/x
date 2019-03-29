"use strict";

/*

*/

lgg.Trader = function()
{
	this.reset();
};

lgg.Trader.prototype.reset = function()
{
	this.local_time			= 0;
	this.freq_min			= 0;
	this.freq_max			= 0;
	this.probability		= 0.01;
	this.last_appearance	= 0;
	this.active				= false;
	this.recent_damage		= 0;
	this.recent_damage_fade	= 0;
	this.last_outburst		= 0;
	this.hue				= 0;
	this.pos_x				= 0;
	this.pos_y				= 0;
	this.radius				= 0.08;
	this.speed_x			= 0;
	this.speed_y			= 0;
	this.target_x			= 0;
	this.toodles  			= 0;
	this.last_ping			= -99999;
	this.last_option_change	= 0;
	this.selected_option	= 0;

	this.min_player_credits	= 20;

	this.trade_offer_history = [];
	for (var i = 0, len = lgg.trader_offers.length; i < len; i++)
	{
		this.trade_offer_history[i] = {
			'times_offered':			0,
		};
	}

	// these get filled in when offers get generated
	this.currently_offered = [];
	this.currently_bought  = [];
	this.current_price  = [];

	this.stats = {};
	this.stats.times_player_entered = 0;
	this.stats.times_player_bought_something = 0;
	this.stats.money_player_spent = 0;
	this.stats.times_hit_by_player = 0;
	this.stats.times_hit_by_enemy = 0;

}

lgg.Trader.prototype.spawn = function()
{
	this.hue = µ.rand(360);
	this.pos_x = this.radius*2 + µ.rand(lgg.level.size_x - this.radius*2);
	this.pos_y = lgg.level.size_y + this.radius*4;
	this.toodles = 0;
	this.speed = -0.00008 - µ.rand(0.00008);
	this.damage_taken = 0;
	this.recent_damage = 0;
	this.recent_damage_fade = 0;
}

lgg.Trader.prototype.think = function(time_delta)
{
	this.local_time += time_delta;

	if (!this.active)
	{
		if (	!lgg.DEBUG__TRADER_DISABLED
			&& lgg.player.credits >= this.min_player_credits
			&& this.local_time - this.last_appearance >= this.freq_max
			&& µ.rand(1) < this.probability)
		{
			this.spawn();
			this.active = true;
			this.last_appearance = this.local_time - µ.rand_int(this.freq_max - this.freq_min);
		}
		else
		{
			return;
		}
	}
	this.recent_damage -= time_delta;
	if (this.recent_damage < 0)
	{
		this.recent_damage = 0;
	}
	this.recent_damage_fade -= time_delta;
	if (this.recent_damage_fade < 0)
	{
		this.recent_damage_fade = 0;
	}
	this.recent_damage_display	+= (this.recent_damage - this.recent_damage_display) * 0.15 * time_delta;
	if (this.toodles)
	{
		this.toodles += time_delta;
		// take off after giving the player some time to move out of the way
		if (this.toodles > lgg.TRADER_TOODLES)
		{
			this.speed_y	-= 0.000002 * time_delta;
		}
		else
		{
			this.speed_y	*= 0.995;
		}
	}
	else if (this.pos_y > lgg.level.size_y - this.radius)
	{
		this.speed_y	= -0.00004;
	}
	else
	{
		this.speed_y	= -0.00004;
	}
	if (
				!this.toodles
			&&	this.local_time - this.last_ping >= 1000
			//&& 	this.pos_y < lgg.level.size_y - this.radius
			)
	{
		lgg.particlesGPU.spawn(
			lgg.now,
			1,
			this.pos_x,
			this.pos_y,
			this.pos_x,
			this.pos_y,
			this.radius * 7,
			this.speed_x,
			this.speed_y * 750,
			0, 0.0,
			lgg.particles__traderping,
			750,
			this.hue + 180 * Math.pow((this.recent_damage / lgg.TRADER_POUT), 2),1,1,0.5,
			0,			//	vary_angle
			0,			//	vary_angle_vel
			0,			//	vary_pos_x
			0,			//	vary_pos_y
			0.01,		//	vary_size
			0,			//	vary_vel_x
			0,			//	vary_vel_y
			0,			//	vary_lifespan
			0,			//	vary_color_hue
			0,			//	vary_color_sat
			0,			//	vary_color_lum
			0			//	vary_color_a
		);
		this.last_ping = this.local_time;
	}
	// player collision
	var dist_from_player = µ.distance2D(lgg.player.pos_x, lgg.player.pos_y, this.pos_x, this.pos_y);
	var overlap = (this.radius + lgg.player.radius) - dist_from_player;
	if (overlap > 0)
	{
		// point of actual impact not accounted for yet
		lgg.player.take_damage(0.003, lgg.DAMAGETYPE__REPEL, -1, lgg.player.pos_x, lgg.player.pos_y);
		this.take_damage(0, lgg.DAMAGETYPE__REPEL);
		var angle = µ.vector2D_to_angle(lgg.player.pos_x - this.pos_x, lgg.player.pos_y - this.pos_y);
		lgg.player.speed_x += µ.angle_to_x(angle) * overlap / 15;
		lgg.player.speed_y += µ.angle_to_y(angle) * overlap / 15;
	}

	var old_pos_x = this.pos_x;
	var old_pos_y = this.pos_y;
	this.pos_x += this.speed_x * time_delta;
	this.pos_y += this.speed_y * time_delta;
	if (!this.toodles)
	{
		var overlap2 = (this.radius*2 + lgg.player.radius) - dist_from_player;
		if (!this.recent_damage && overlap2 > 0)
		{
			this.enter();
			return;
		}
	}
	else
	{
		lgg.particlesGPU.spawn(
			lgg.now,
			this.toodles > lgg.TRADER_TOODLES ? 10 : 1,
			this.pos_x,
			this.pos_y + this.radius,
			old_pos_x,
			old_pos_y + this.radius,
			0.05,
			0,
			0,
			0, 0,
			lgg.particles__smoke,
			this.toodles > lgg.TRADER_TOODLES ? 2000 : 500,
			0,1,1,1,
			0,										//	vary_angle
			0.05,									//	vary_angle_vel
			0,										//	vary_pos_x
			0,										//	vary_pos_y
			0,										//	vary_size
			-this.radius * 1500 * this.speed_y,		//	vary_vel_x
			0,										//	vary_vel_y
			200,									//	vary_lifespan
			0,										//	vary_color_hue
			0,										//	vary_color_sat
			0,										//	vary_color_lum
			0										//	vary_color_a
		);
	}
	if (this.pos_y < -this.radius * 4)
	{
		this.reset();
	}
}

lgg.Trader.prototype.offer_weight_func = function(offer, offer_index, danger)
{
	if (	(offer.probability < 1 && µ.rand(1) > r.probability)
		||	lgg.player.credits < offer.price()
		||	(lgg.trader.currently_offered.indexOf(offer_index) != -1))
	{
		return 0;
	}
	return offer.weight();
};

lgg.Trader.prototype.generate_offers = function()
{
	this.currently_offered = [];
	this.currently_bought  = [];
	this.current_price  = [];
	for (var i = 0; i < 10; i++)
	{
		var offer_id = µ.pick_randomly_from_weighted_list(lgg.trader_offers, this.offer_weight_func, ' no data');
		if (offer_id != null)
		{
			var offer = lgg.trader_offers[offer_id];
			this.currently_offered.push(offer_id);
			this.currently_bought.push(false);
			this.current_price.push(Math.ceil(offer.price()));
		}
	}
}

lgg.Trader.prototype.think_trade_menu = function(time_delta)
{
	this.local_time += time_delta;

	if (this.local_time - this.last_option_change > 200)
	{
		if (lgg.input.KEY_CURSOR_UP.pressed)
		{
			this.selected_option++;
			if (this.selected_option > this.currently_offered.length)
			{
				this.selected_option = 0;
			}
			// skip over already bought offers
			while(this.currently_bought[this.selected_option] == true)
			{
				this.selected_option++;
				if (this.selected_option > this.currently_offered.length)
				{
					this.selected_option = 0;
				}
			}
			this.last_option_change = this.local_time;
		}
		else if (lgg.input.KEY_CURSOR_DOWN.pressed)
		{
			this.selected_option--;
			if (this.selected_option < 0)
			{
				this.selected_option = this.currently_offered.length;
			}
			// skip over already bought offers
			while(this.currently_bought[this.selected_option] == true)
			{
				this.selected_option--;
				if (this.selected_option < 0)
				{
					this.selected_option = this.currently_offered.length;
				}
			}
			this.last_option_change = this.local_time;
		}
	}
	if (this.local_time - this.last_option_change > 500)
	{
		if (lgg.input.KEY_SPACE.pressed)
		{
			this.last_option_change = this.local_time;
			if (this.selected_option == this.currently_offered.length)
			{
				this.exit();
			}
			else
			{
				this.buy_current_offer(this.selected_option);
			}
		}
	}
}

lgg.Trader.prototype.buy_current_offer = function(current_offer_id)
{
	if (this.currently_bought[current_offer_id])
	{

	}
	else if (lgg.player.credits >= this.current_price[current_offer_id])
	{
		var offer = lgg.trader_offers[this.currently_offered[current_offer_id]];
		lgg.player.credits -= this.current_price[current_offer_id];
		offer.effect();
		//this.currently_bought[current_offer_id] = true;

		// just make a whole new set of offers for now, deal with offers that get invalidated by another offer being bought later

		this.generate_offers();
	}
}

lgg.Trader.prototype.draw_trade_menu = function()
{
	if (lgg.level.state == lgg.LEVELSTATE__TRADER_ENTER)
	{
		var fade = lgg.level.state_time/500;
	}
	else if (lgg.level.state == lgg.LEVELSTATE__TRADER_EXIT)
	{
		var fade = 1 - lgg.level.state_time/500;
	}
	else
	{
		var fade = 1;
	}

	lgg.c.rectangle.draw(lgg.CAM_STRETCH, .5, .5, 1, 1, 90,
		210, 0, 0, .75 * fade,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1
	);

	lgg.c.rectangle_textured.draw(lgg.CAM_PORTRAIT,
		lgg.tex_trader,
		0.2, 0.4, .2, .2,
		90,
		this.hue, 1, 1, 1*fade,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	var font_size_x = 0.035;
	var font_size_y = 0.035;
	var font_spacing = 0.0075;
	for (var i = 0; i <= this.currently_offered.length; i++)
	{
		var wobble = (this.selected_option==i && this.local_time - this.last_option_change < 750) ? 1 - (this.local_time - this.last_option_change) / 750 : 0
		if (i == this.currently_offered.length)
		{
			var option_title = 'Exit';
		}
		else
		{
			var offer = lgg.trader_offers[this.currently_offered[i]];
			var option_title = offer.title;
			lgg.fonts.draw_text(
				"[" + this.current_price[i] + "]", 1,
				lgg.CAM_PORTRAIT, lgg.FONT_DEFAULT, 0.87, .1 + i*.05, font_size_x, font_size_y, font_spacing,
				this.selected_option == i ? 56 : 220, this.currently_bought[i] ? 0 : 1, .5, 1*fade,
				-1, -1, -1, -1,
				-1, -1, -1, -1,
				-1, -1, -1, -1
				);
		}
		lgg.c.rectangle_textured.draw(lgg.CAM_PORTRAIT,
			lgg.tex_blob,
			0.4 + Math.sin(this.local_time/(500-100*wobble))*0.005*wobble, .1 + i*.05, .05, .05,
			90,
			this.selected_option==i?40:190,this.selected_option==i?1:.25,this.currently_bought[i] ? 0.5 : 1,1*fade,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);
		lgg.fonts.draw_text(
			option_title, 1,
			lgg.CAM_PORTRAIT, lgg.FONT_DEFAULT, 0.47, .1 + i*.05, font_size_x, font_size_y, font_spacing,
			this.selected_option == i ? 56 : 220, this.currently_bought[i] ? 0 : 1, .5, 1*fade,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1
			);
	}
	lgg.c.flush_all();
	lgg.fonts.flush_all();
}

lgg.Trader.prototype.enter = function()
{
	lgg.level.state = lgg.LEVELSTATE__TRADER_ENTER;
	lgg.level.state_time = 0;
	this.generate_offers();
}

lgg.Trader.prototype.exit = function()
{
	this.toodles = 1;
	lgg.level.state = lgg.LEVELSTATE__TRADER_EXIT;
	lgg.level.state_time = 0;
	for (var i = 0; i < 20; i++)
	{
		var offset = µ.rand_int(lgg.TRADER_TOODLES);
		lgg.particlesGPU.spawn(
			lgg.now + 200 + offset,
			2,
			this.pos_x,
			this.pos_y,
			this.pos_x,
			this.pos_y,
			0.25,
			0,
			0,
			0, 0.1,
			lgg.particles__smoke,
			1200 + offset,
			0,1,1,1,
			360,				//	vary_angle
			0.2,				//	vary_angle_vel
			0,					//	vary_pos_x
			0,					//	vary_pos_y
			0,					//	vary_size
			this.radius*10,		//	vary_vel_x
			0,					//	vary_vel_y
			200,				//	vary_lifespan
			0,					//	vary_color_hue
			0,					//	vary_color_sat
			0,					//	vary_color_lum
			0					//	vary_color_a
		);
		var offset = µ.rand_int(lgg.TRADER_TOODLES);
		lgg.particlesGPU.spawn(
			lgg.now + 200 + offset,
			2,
			this.pos_x,
			this.pos_y,
			this.pos_x,
			this.pos_y,
			0.15,
			0,
			0,
			0, 0.08,
			lgg.particles__repel,
			3000 + offset,
			0,1,1,1,
			360,				//	vary_angle
			0.04,				//	vary_angle_vel
			this.radius*1,		//	vary_pos_x
			this.radius*1,		//	vary_pos_y
			0,					//	vary_size
			0,					//	vary_vel_x
			0,					//	vary_vel_y
			400,				//	vary_lifespan
			0,					//	vary_color_hue
			0,					//	vary_color_sat
			0,					//	vary_color_lum
			0					//	vary_color_a
		);
	}
}

lgg.Trader.prototype.take_damage = function(amount, type)
{
	if (!this.recent_damage)
	{
		this.recent_damage_fade = lgg.TRADER_POUT_FADEIN;
	}
	this.recent_damage = lgg.TRADER_POUT;
	this.damage_taken += amount;
	if (this.damage_taken > 25)
	{
		this.toodles = lgg.TRADER_TOODLES;
	}
	if (this.local_time - this.last_outburst >= 100)
	{
		var angle_step = 360/7;
		var angle = µ.rand(angle_step);
		for (var i = 0; i < 7; i++)
		{

			lgg.projectiles.spawn(
				this.pos_x + µ.angle_to_x(angle) * this.radius*2,
				this.pos_y + µ.angle_to_y(angle) * this.radius*2,
				angle, true, lgg.PROJECTILE_TYPE__PLASMA, lgg.DAMAGE_TYPE__PLASMA, 0.25,
				500 + µ.rand_int(1500), 0.00015 + µ.rand(0.000015), 0.985,
				0.1, 0.000005 + µ.rand(0.0000025), -1, 0,
				0, 0, 0, 0);
			angle += angle_step;
		}
		this.last_outburst = this.local_time;
	}
	lgg.particlesGPU.spawn(
		lgg.now,
		type == lgg.DAMAGETYPE__PROJECTILE ? 50 : 5,
		this.pos_x,
		this.pos_y,
		this.pos_x,
		this.pos_y,
		type == lgg.DAMAGETYPE__PROJECTILE ? 0.05 : 0.075,
		0,
		0,
		0, 0.035,
		type == lgg.DAMAGETYPE__PROJECTILE ? lgg.particles__damage : lgg.particles__repel,
		type == lgg.DAMAGETYPE__PROJECTILE ? 1000 : 1000,
		0,1,1,1,
		360,				//	vary_angle
		0.07,				//	vary_angle_vel
		this.radius*1,		//	vary_pos_x
		this.radius*1,		//	vary_pos_y
		0,					//	vary_size
		0,					//	vary_vel_x
		0,					//	vary_vel_y
		400,				//	vary_lifespan
		0,					//	vary_color_hue
		0,					//	vary_color_sat
		0,					//	vary_color_lum
		0					//	vary_color_a
	);
}

lgg.Trader.prototype.draw = function()
{
	if (!this.active)
	{
		return;
	}

	lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
		lgg.tex_circle_soft_inverse,
		this.pos_x,
		this.pos_y,
		this.radius*2,
		this.radius*2,
		90,
		this.hue + 180 * Math.pow((this.recent_damage / lgg.TRADER_POUT), 2), 1, 1, 0.35,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);

	//if (!this.recent_damage)
	{
		lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
			lgg.tex_circle_soft_inverse,
			this.pos_x,
			this.pos_y,
			this.radius*4,
			this.radius*4,
			90,
			this.hue + 180 * Math.pow((this.recent_damage / lgg.TRADER_POUT), 2), 1, 1, 0.125,
			-1, -1, -1, -1,
			-1, -1, -1, -1,
			-1, -1, -1, -1);

	}
	lgg.c.rectangle_textured.draw(lgg.CAM_PLAYER,
		lgg.tex_trader,
		this.pos_x,
		this.pos_y,
		this.radius*1.5,
		this.radius*1.5,
		90,
		this.hue + 180 * Math.pow((this.recent_damage / lgg.TRADER_POUT), 2), 1, 1, 1,
		-1, -1, -1, -1,
		-1, -1, -1, -1,
		-1, -1, -1, -1);
	if (this.recent_damage)
	{
		if (this.recent_damage < 1000)
			var fade = 1 - this.recent_damage / 1000;
		else
			var fade = this.recent_damage_fade / lgg.TRADER_POUT_FADEIN;
	}
	else
	{
		var fade = 1;
	}
	lgg.c.draw_circle(lgg.CAM_PLAYER, this.pos_x, this.pos_y, this.radius*2, .8, 0, 0, 1, {r:1,g:.8*fade,b:.1,a:0.5});
}