"use strict";

lgg.trader_offers = [
/*
	{
		'title':				'Bad advice',
		'description':			'',
		'offer_always': 		false,
		'player_credits_min':	-1,
		'player_credits_max':	-1,
		'stage_min':			-1,
		'stage_max':			-1,
		'probability':			1,

		'weight':				function()
		{
			return 1;
		},
		'price':				function()
		{
			return 10;
		},
		'effect':				function()
		{
			// now you stumped me
		},
	},
*/
	{
		'title':				'Full Repair',
		'probability':			1,
		'weight':				function()
		{
			if (lgg.player.health >= 0.9)
			{
				return 0;
			}
			return 1;
		},
		'price':				function()
		{
			return (100 + (1 - lgg.player.health) * 500);
		},
		'effect':				function()
		{
			lgg.player.health = 1.0;
		},
	},

	{
		'title':				'Repair 10% hull',
		'probability':			1,
		'weight':				function()
		{
			if (lgg.player.health >= 0.9)
			{
				return 0;
			}
			return 1;
		},
		'price':				function()
		{
			return (5 + 0.1 * 500);
		},
		'effect':				function()
		{
			lgg.player.health += 0.1;
		},
	},

	{
		'title':				'Faster Energy Recharge',
		'probability':			1,
		'weight':				function()
		{
			return 1;
		},
		'price':				function()
		{
			return (100 * Math.pow(1.5, 1 + lgg.player.upgrades__energy_recharge));
		},
		'effect':				function()
		{
			lgg.player.upgrades__energy_recharge++;
		},
	},
/*
	{
		'title':				'Additional Crew Cabin',
		'probability':			1,
		'weight':				function()
		{
			return 1;
		},
		'price':				function()
		{
			var existing_upgrades = lgg.player.crew_cabins - lgg.STARTING__PLAYER_CREW_CABINS;
			return 100 + µ.round_to(70 * existing_upgrades + 10 * Math.pow(1.12, existing_upgrades), 20);
		},
		'effect':				function()
		{
			lgg.player.crew_cabins++;
		},
	},
*/
];
