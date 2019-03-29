function _addEventListener(element, eventType, eventHandler, useCapture)
{
	if (element.addEventListener) element.addEventListener(eventType, eventHandler, useCapture);
	else if (element.attachEvent) element.attachEvent('on' + eventType, eventHandler);
	else element['on' + eventType] = eventHandler;
}

function _removeEventListener(element, eventType, eventHandler)
{
	if (element.removeEventListener) element.removeEventListener(eventType, eventHandler);
	else if (element.detachEvent) element.detachEvent('on' + eventType, eventHandler);
	else element['on' + eventType] = null;
}

jsb_options = {
	gl_enable_depth_test: false,
};

jsb_apps = {

	'?heliumcouncil':
	{
			title:	'Helium Council',
			scripts: [
				[
					'apps/HeliumCouncil/src/hc.js',
				],
				[
					'apps/HeliumCouncil/src/pdefs.js',
					'apps/HeliumCouncil/src/init.js',
					'apps/HeliumCouncil/src/game.js',
					'apps/HeliumCouncil/src/solar_body.js',
					'apps/HeliumCouncil/src/solar_system.js',
					'apps/HeliumCouncil/src/strings.js',
					'apps/HeliumCouncil/src/think.js',
					'apps/HeliumCouncil/src/render.js',
					'apps/HeliumCouncil/src/universe.js',
				],
				[
					'apps/HeliumCouncil/src/app.js',
				],
			]
	},


	'?lagaga': {
			title:	'La Gaga',
			scripts: [
				[
					'apps/lagaga/lgg.js',
				],
				[
					'apps/lagaga/data/enemy_types.js',
				],
				[

					'apps/lagaga/data/particle_definitions.js',

					'apps/lagaga/data/damage_types.js',
					'apps/lagaga/data/projectile_types.js',
					'apps/lagaga/data/pickup_types.js',
					'apps/lagaga/data/player_weapons.js',
					'apps/lagaga/data/trader_offers.js',
					'apps/lagaga/data/strings.js',

					'apps/lagaga/src/enemy.js',
					'apps/lagaga/src/enemies.js',

					'apps/lagaga/src/_think.js',
					'apps/lagaga/src/_init.js',
					'apps/lagaga/src/_render.js',

					'apps/lagaga/src/game.js',
					'apps/lagaga/src/level.js',
					'apps/lagaga/src/player.js',
					'apps/lagaga/src/player_drone.js',
					'apps/lagaga/src/player_drones.js',
					'apps/lagaga/src/player_weapon.js',
					'apps/lagaga/src/pickup.js',
					'apps/lagaga/src/pickups.js',
					'apps/lagaga/src/projectile.js',
					'apps/lagaga/src/projectiles.js',
					'apps/lagaga/src/render_hud.js',
					'apps/lagaga/src/render_ship_setup.js',
					'apps/lagaga/src/trader.js',

					'apps/lagaga/src/singularity/lgg_singularity.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player_ability__exit_finder.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player_ability__fireball.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player_ability__haste.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player_ability__remote_eye.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_player_ability__slomo.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_drone.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_drones.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_enemy.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_enemy_types.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_enemies.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_projectile.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside_projectiles.js',

				],
				[
					// these have to come after particle and projectile type constants
					'apps/lagaga/data/enemy_types/bigblob.js',
					'apps/lagaga/data/enemy_types/bigmine.js',
					'apps/lagaga/data/enemy_types/blob.js',
					'apps/lagaga/data/enemy_types/blobchain.js',
					'apps/lagaga/data/enemy_types/blorb_x.js',
					'apps/lagaga/data/enemy_types/blorb_y.js',
					'apps/lagaga/data/enemy_types/blorb_big.js',
					'apps/lagaga/data/enemy_types/carrier.js',
					'apps/lagaga/data/enemy_types/eye.js',
					'apps/lagaga/data/enemy_types/fighter.js',
					'apps/lagaga/data/enemy_types/fireball.js',
					'apps/lagaga/data/enemy_types/fireball_huge.js',
					'apps/lagaga/data/enemy_types/golfball.js',
					'apps/lagaga/data/enemy_types/heckler.js',
					'apps/lagaga/data/enemy_types/mine.js',
					'apps/lagaga/data/enemy_types/observer.js',
					'apps/lagaga/data/enemy_types/patrol.js',
					'apps/lagaga/data/enemy_types/saucer.js',
					'apps/lagaga/data/enemy_types/scimitar_bomber.js',
					'apps/lagaga/data/enemy_types/scimitar_fighter.js',

					'apps/lagaga/src/enemy_think.js',

					'apps/lagaga/src/singularity/lgg_singularity_inside_player_abilities.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__generate.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__generate_textures.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__generate__better.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__generate__bogus.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__scents.js',
					'apps/lagaga/src/singularity/lgg_singularity_inside__draw.js',
				],
				[
					'apps/lagaga/lgg__app.js',
				]
			],
	},

	'?dodgygame': 	
	{
			broken: true,
			title:	'Dodgy Game',
			scripts: [
				[
					'apps/dodgy/ddg.js',
				],
				[
					'apps/dodgy/ddg_cfg.js',
					'apps/dodgy/ddg_misc.js',
					'apps/dodgy/ddg_init.js',
					'apps/dodgy/ddg_pdefs.js',
					'apps/dodgy/ddg_think.js',
					'apps/dodgy/ddg_think_collision.js',
					'apps/dodgy/ddg_render.js',
					'apps/dodgy/ddg_render_hud.js',
				],
				[
					'apps/dodgy/ddg_app.js',
				],
			]
	},


	'?lagaga__enemy_types': {
			title:	'La Gaga [enemy types]',
			scripts: [
				[
					'apps/lagaga/lgg.js',
				],
				[
					'apps/lagaga/data/enemy_types.js',
					'apps/lagaga/data/enemy_types/bigblob.js',
					'apps/lagaga/data/enemy_types/bigmine.js',
					'apps/lagaga/data/enemy_types/blob.js',
					'apps/lagaga/data/enemy_types/carrier.js',
					'apps/lagaga/data/enemy_types/eye.js',
					'apps/lagaga/data/enemy_types/fighter.js',
					'apps/lagaga/data/enemy_types/fireball.js',
					'apps/lagaga/data/enemy_types/golfball.js',
					'apps/lagaga/data/enemy_types/heckler.js',
					'apps/lagaga/data/enemy_types/mine.js',
					'apps/lagaga/data/enemy_types/observer.js',
					'apps/lagaga/data/enemy_types/patrol.js',
					'apps/lagaga/data/enemy_types/saucer.js',
				],
				[
					'apps/lagaga/list_enemy_types.js',
				]
			],
	},
	
	'?complicity':
	{
			title:	'Complicity',
			scripts: [
				[
					'apps/complicity/src/btx.js',
					'jsboxx/webgl/framebuffer_pingpong_fluids3.js',
				],
				[
					'apps/complicity/src/cityblock.js',
					'apps/complicity/src/cityblocks.js',
					'apps/complicity/src/pdefs.js',
					'apps/complicity/src/init.js',
					'apps/complicity/src/game.js',
					'apps/complicity/src/house.js',
					'apps/complicity/src/light_flash.js',
					'apps/complicity/src/light_flashes.js',
					'apps/complicity/src/map.js',
					'apps/complicity/src/navmesh.js',
					'apps/complicity/src/person.js',
					'apps/complicity/src/persons.js',
					'apps/complicity/src/player.js',
					'apps/complicity/src/strings.js',
					'apps/complicity/src/street.js',
					'apps/complicity/src/streets.js',
					'apps/complicity/src/street_crossing.js',
					'apps/complicity/src/street_lamp.js',
					'apps/complicity/src/think.js',
					'apps/complicity/src/render.js',
					'apps/complicity/src/render_hud.js',
					'apps/complicity/src/vehicle.js',
					'apps/complicity/src/vehicles.js',
					'apps/complicity/src/vehicle_car.js',
					'apps/complicity/src/weather.js',
					
					'jsboxx/webgl/rectangle_screen_shader2.js',
				],
				[
					'apps/complicity/src/person_npc.js',
					'apps/complicity/src/app.js',
				],
			]
	},


	'?ballistrix':
	{
			title:	'Ballistrix',
			scripts: [
				[
					'apps/ballistrics/src/btx.js',
					'jsboxx/webgl/framebuffer_pingpong_fluids3.js',
				],
				[
					'apps/ballistrics/src/pdefs.js',
					'apps/ballistrics/src/init.js',
					'apps/ballistrics/src/game.js',
					'apps/ballistrics/src/map.js',
					'apps/ballistrics/src/strings.js',
					'apps/ballistrics/src/think.js',
					'apps/ballistrics/src/render.js',
				],
				[
					'apps/ballistrics/src/app.js',
				],
			]
	},

	'?dodgygame_lofi':
	{
		broken: true,
			title:	'Dodgy Game (Lo-Fi)',
			scripts: [
				[
					'apps/dodgy/ddg.js',
				],
				[
					'apps/dodgy/ddg_cfg.js',
					'apps/dodgy/ddg_misc.js',
					'apps/dodgy/ddg_init.js',
					'apps/dodgy/ddg_pdefs.js',
					'apps/dodgy/ddg_think.js',
					'apps/dodgy/ddg_think_collision.js',
					'apps/dodgy/ddg_render.js',
					'apps/dodgy/ddg_render_hud.js',
				],
				[
					'apps/dodgy/ddg_cfg_lofi.js',
					'apps/dodgy/ddg_app.js',
				],
			]
	},


	'?revret': {
			title:	'RevRet',
			scripts: [
				[
					'apps/_revret/rvr.js',
				],
				[
					'apps/_revret/rvr_strings.js',

					'apps/_revret/presets/particle_definitions.js',

					'apps/_revret/presets/agents/bandit.js',
					'apps/_revret/presets/agents/drone.js',
					'apps/_revret/presets/agents/drone_coward.js',
					'apps/_revret/presets/agents/drone_scout.js',
					'apps/_revret/presets/agents/drone_scout_armoured.js',
					'apps/_revret/presets/agents/drone_sentinel.js',
					'apps/_revret/presets/agents/drone_teaser.js',
					'apps/_revret/presets/agents/player.js',
					'apps/_revret/presets/agents/player_drone.js',
					'apps/_revret/presets/agents/rebel.js',
					'apps/_revret/presets/agents/survivor.js',
					'apps/_revret/presets/agents/turret.js',

					'apps/_revret/presets/map_generators/test.js',
					'apps/_revret/presets/map_sectors/basic.js',

					'apps/_revret/presets/projectiles/ball_lightning.js',
					'apps/_revret/presets/projectiles/blob.js',
					'apps/_revret/presets/projectiles/fireball.js',
					'apps/_revret/presets/projectiles/firepuff.js',
					'apps/_revret/presets/projectiles/missile.js',
					'apps/_revret/presets/projectiles/plasma.js',
					'apps/_revret/presets/projectiles/plasma_nade_stage1.js',
					'apps/_revret/presets/projectiles/plasma_nade_stage2.js',

					'apps/_revret/presets/weapons/ball_lightning.js',
					'apps/_revret/presets/weapons/drone_fireballs_360.js',
					'apps/_revret/presets/weapons/drone_fireballs_spread.js',
					'apps/_revret/presets/weapons/drone_fireballs_spread_fan.js',
					'apps/_revret/presets/weapons/fireballs.js',
					'apps/_revret/presets/weapons/flamethrower.js',
					'apps/_revret/presets/weapons/plasma_burst.js',
					'apps/_revret/presets/weapons/plasma_grenade.js',
					'apps/_revret/presets/weapons/plasma_pistol.js',
				],
				[
					'apps/_revret/game/agent/agent.js',
					'apps/_revret/game/agent_memory.js',
					'apps/_revret/game/agent_memory_slot.js',
					'apps/_revret/game/agents.js',
					'apps/_revret/game/faction.js',
					'apps/_revret/game/factions.js',
					'apps/_revret/game/game.js',

					'apps/_revret/game/GUI.js',
					'apps/_revret/game/lights.js',
					'apps/_revret/game/map/map.js',
					'apps/_revret/game/map/map_polygon.js',
					'apps/_revret/game/map/map_generator.js',
					'apps/_revret/game/player.js',
					'apps/_revret/game/player__remote_eye.js',
					'apps/_revret/game/pickup.js',
					'apps/_revret/game/pickups.js',
					'apps/_revret/game/projectile.js',
					'apps/_revret/game/projectiles.js',
					'apps/_revret/game/scents.js',
					'apps/_revret/game/weapon.js',
				],
				[
					'apps/_revret/game/agent/agent__draw.js',
					'apps/_revret/game/agent/agent__draw_lights.js',
					'apps/_revret/game/agent/agent__scents.js',
					'apps/_revret/game/agent/agent__think.js',
					'apps/_revret/game/agent/agent__to_agent.js',

					'apps/_revret/rvr_think.js',
					'apps/_revret/rvr_think__in_map.js',
					'apps/_revret/rvr_init.js',
					'apps/_revret/rvr_render.js',
					'apps/_revret/rvr_render__in_map.js',
					'apps/_revret/rvr_render__intro.js',
					'apps/_revret/rvr_render_debug.js',
					'apps/_revret/rvr_render_minimap.js',
				],
				[
					'apps/_revret/rvr_app.js',
				]
			],
	},

	'1345345646734534597654': { title:	'',},

	'?asbx': 	
	{
			title:	'Adventure Sandbox',
			scripts: [
				[
					'apps/AdventureSandbox/source/asbx.js',
//					'libs/p2.min.js',
				],
				[
					'apps/AdventureSandbox/source/level.js',

					'apps/AdventureSandbox/source/body/body.js',

					'apps/AdventureSandbox/source/player/player.js',

					'apps/AdventureSandbox/source/asbx_init.js',
					'apps/AdventureSandbox/source/asbx_pdefs.js',
					'apps/AdventureSandbox/source/asbx_think.js',
					'apps/AdventureSandbox/source/asbx_render.js',
				],
				[
					'apps/AdventureSandbox/source/asbx_app.js',
				],
			]
	},

	'?civ': {
			title:	'Civ',
			scripts: [
				[
					'jsboxx/webgl/civ/rectangle_subtiles.js',
					'jsboxx/webgl/civ/rectangle_tiles.js',

					'apps/civ/src/_civ.js',
				],
				[
					'apps/civ/src/_civ_terrain_types.js',
					'apps/civ/src/units/_unit_types.js',
				],
				[
					'apps/civ/src/init_generate_textures.js',

					'apps/civ/src/units/mothership.js',

					'apps/civ/src/colonies.js',
					'apps/civ/src/colony.js',
					'apps/civ/src/game.js',
					'apps/civ/src/gamestate.js',
					'apps/civ/src/gui.js',
					'apps/civ/src/map.js',
					'apps/civ/src/person.js',
					'apps/civ/src/persons.js',
					'apps/civ/src/player.js',
					'apps/civ/src/particle_definitions.js',
					'apps/civ/src/storage.js',
					'apps/civ/src/strings.js',
					'apps/civ/src/unit.js',
					'apps/civ/src/units.js',
				],
				[
					'apps/civ/src/_think.js',
					'apps/civ/src/_init.js',
					'apps/civ/src/_render.js',

					'apps/civ/src/think__in_game.js',
				],
				[
					'apps/civ/src/_app.js',
				],
			],
	},

	'?civ__terrain_types': {
			title:	'Civ [terrain types]',
			scripts: [
				[
					'apps/civ/src/_civ.js',
				],
				[
					'apps/civ/src/__list_terrain_types.js',
				]
			],
	},



	'#############--######': { title:	'',},

	'?accumgraph': 					{ title:	'accumgraph', 					scripts: [[ 'apps/onefile/accumgraph.js', ]] },
	'?benchmark': 					{ title:	'Benchmark', 					scripts: [[ 'apps/onefile/benchmark.js', ]] },
	'?flow': 						{ title:	'Flow', 						scripts: [[ 'apps/onefile/flow.js', ]] },
	'?graph_one': 					{ title:	'graph_one', 					scripts: [[ 'apps/onefile/graph_one.js', ]] },
	'?jerky': 						{ title:	'Jerky', 						scripts: [[ 'apps/onefile/jerkymcjerkpa(te)nts.js.', ]] },
	'?noise2d': 					{ title:	'Noise 2D', 					scripts: [[ 'apps/onefile/noise2d.js', ]] },
	'?particle_test': 				{ title:	'Particle test', 				scripts: [[ 'apps/onefile/particle_test.js', ]] },
	'?plot': 						{ title:	'Plot', 						scripts: [[ 'apps/onefile/plot.js', ]] },
	'?plot2': 						{ title:	'Plot 2', 						scripts: [[ 'apps/onefile/plot2.js', ]] },
	'?quantcomp': 					{ title:	'Quantcomp', 					scripts: [[ 'apps/onefile/quantcomp.js', ]] },
	'?randomness': 					{ title:	'Randomness', 					scripts: [[ 'apps/onefile/randomness.js', ]] },
	'?randomness2': 				{ title:	'Randomness2', 					scripts: [[ 'apps/onefile/randomness2.js', ]] },
	'?rectangle_experiment': 		{ title:	'Rectangle Experiment', 		scripts: [[ 'jsboxx/webgl/rectangle__experiment.js', ], [ 'apps/onefile/rectangle_experiment.js', ]] },
	'?spaceharry': 					{ title:	'Space Harry', 					scripts: [[ 'apps/onefile/spaceharry.js', ]] },
	'?timeline': 					{ title:	'Timeline', 					scripts: [[ 'apps/onefile/timeline.js', ]] },

	'########-########-###': { title:	'',},

	'?derp': {
			title:	'Derp',
			scripts: [
				[
					'apps/derp/drp.js',
				],
				[
					'apps/derp/drp_locations.js',
				],
				[
					'apps/derp/drp_game.js',
					'apps/derp/drp_think.js',
					'apps/derp/drp_init.js',
					'apps/derp/drp_render.js',
				],
				[
					'apps/derp/drp_app.js',
				],
			],
	},

	'?greed': {
			title:	'Greed',
			scripts: [
				[
					'libs/Box2dWeb.js',
				],
				[
					'apps/greed/grd.js',
				],
				[
					'apps/greed/grd_pdefs.js',
					'apps/greed/grd_agent.js',
					'apps/greed/grd_agents.js',
					'apps/greed/grd_simulation.js',
				],
				[
					'apps/greed/grd_init.js',
					'apps/greed/grd_think.js',
					'apps/greed/grd_render.js',
				],
				[
					'apps/greed/grd_app.js',
				]
			],
	},

	'?vanity': 						{ title:	'Vanity', 						scripts: [[ 'apps/onefile/vanity.js', ]] },

};

if(window.location.search && jsb_apps[window.location.search] !== undefined) {
	window.document.title = jsb_apps[window.location.search].title;

	bootloader = new Bootloader(jsb_apps[window.location.search].title,
	[
		[
			'jsboxx/bxx.js',

		],
		[

			'jsboxx/__2D.js',
			'jsboxx/__arrays.js',
			'jsboxx/__colors.js',
			'jsboxx/__math.js',
			'jsboxx/__misc.js',
			'jsboxx/__text.js',

			'jsboxx/bxx_audio.js',
			'jsboxx/bxx_canvas.js',
			'jsboxx/bxx_monospace_console.js',
			'jsboxx/bxx_pseudorandom.js',

			'jsboxx/accum_buckets.js',
			'jsboxx/camera2D.js',
			'jsboxx/input.js',
			'jsboxx/mersenne_twister.js',
			'jsboxx/perlin_noise.js',

			'jsboxx/webgl/_shaders_common.js',
			'jsboxx/webgl/circles.js',
			'jsboxx/webgl/font.js',
			'jsboxx/webgl/framebuffer.js',
			'jsboxx/webgl/framebuffer_pingpong.js',
			'jsboxx/webgl/framebuffer_pingpong_fluids.js',
			'jsboxx/webgl/particles2D.js',
			'jsboxx/webgl/particles2D_uniform_arrays.js',
			'jsboxx/webgl/pixelstore.js',

			'jsboxx/webgl/rectangle.js',
			'jsboxx/webgl/rectangle_clouds.js',
			'jsboxx/webgl/rectangle_depthmap.js',
			'jsboxx/webgl/rectangle_fluids.js',
			'jsboxx/webgl/rectangle_light_and_shadow.js',
			'jsboxx/webgl/rectangle_light_and_shadow2.js',
			'jsboxx/webgl/rectangle_scent.js',
			'jsboxx/webgl/rectangle_screen_shader1.js',
			'jsboxx/webgl/rectangle_smoke.js',
			'jsboxx/webgl/rectangle_textured.js',
			'jsboxx/webgl/rectangle_textured_offset.js',
			'jsboxx/webgl/rectangle_textured_rgb.js',
			'jsboxx/webgl/rectangle_textured_rgb_flipped.js',
			'jsboxx/webgl/rectangle_textured_shadow.js',

//			'jsboxx/webgl/rectangles_tex2.js',
//			'jsboxx/webgl/rectangles_tex2b.js',

			'jsboxx/webgl/tilemap_occlusion.js',
		],
		[
			'jsboxx/webgl/_shaders_noise.js',

			'jsboxx/webgl/canvas.js',
			'jsboxx/webgl/particles2D.init_shaders.js',
			'jsboxx/webgl/particles2D_uniform_arrays.init_shaders.js',
		],
		[
			'jsboxx/bxx_app.js',
		],
	].concat(jsb_apps[window.location.search].scripts));
	bootloader.go();
}
else
{
	(function(){
		document.documentElement.style.background = '#000';
		document.body.style.background = '#777';
		document.body.style.color = '#fff';
		var el = document.createElement('div');
		el.style.fontSize = '17px';
		el.style.lineHeight = '100%';
		el.style.padding = '7px 30px 10px 30px';

		for (var link in jsb_apps)
		{
			if (jsb_apps[link].scripts)
			{
				var el_link = document.createElement('a');
				el_link.href = link;
				if (jsb_apps[link].broken === true)
				{
					el_link.setAttribute('class', 'jsboxx_menu_link broken');
				}
				else
				{
					el_link.setAttribute('class', 'jsboxx_menu_link');
				}
				el_link.innerHTML = jsb_apps[link].title;

				el.appendChild(el_link);
			}
			else
			{
				var el_link = document.createElement('div');
				el_link.innerHTML = jsb_apps[link].title;
				el_link.style.margin = '0.15em 0px 0.15em -0.5em';
				el_link.style.fontSize = '27px';
				el.appendChild(el_link);
			}
		}
		document.body.appendChild(el);
	}());
}

