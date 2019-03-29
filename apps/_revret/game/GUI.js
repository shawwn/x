rvr.GUI = function(pos_x, pos_y)
{
	this.show_inventory = false;
	this.showing_inventory = 0.0;
	this.show_minimap = false;
	this.showing_minimap = 0.0;

	this.displayed_health = 0.0;
	this.displayed_shield = 0.0;
}

rvr.GUI.prototype.think = function(time_delta)
{
	var inertia = 0.9;
	var inertia1 = 1 - inertia;

	this.displayed_health = this.displayed_health * inertia + inertia1 * rvr.player_agent.state.health;
	this.displayed_shield = this.displayed_shield * inertia + inertia1 * rvr.player_agent.shield;

	this.showing_inventory = µ.between(0, this.showing_inventory + (this.show_inventory ? 0.01 : -0.01) * time_delta, 1)
	this.showing_minimap = µ.between(0, this.showing_minimap + (this.show_minimap ? 0.01 : -0.01) * time_delta, 1)
}

rvr.GUI.prototype.toggle_inventory = function()
{
	this.show_inventory = !this.show_inventory;
}

rvr.GUI.prototype.toggle_minimap = function()
{
	this.show_minimap = !this.show_minimap;
}

rvr.GUI.prototype.draw = function(time_delta)
{

	var
		width = 0.135,
		height = 0.11,
		spacing = 0.013,
		line_spacing = 0.05;

	rvr.render_minimap(0.95 - 0.15 * this.showing_minimap, 0.05 + 0.15 * this.showing_minimap, 0.1 + 0.3 * this.showing_minimap, 0.1 + 0.3 * this.showing_minimap, 1.0);

	var bar_width = 0.02;
	var bar_width_half = 0.01;

	// stamina
	var dodge_ready = rvr.now - rvr.player_agent.last_dodge > rvr.min_time_between_dodges;
	var lum_add = dodge_ready ? 0.15 : 0;
	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width_half,
		0.5 / rvr.camera_landscape.aspect + 1.0 * 0.1,
		bar_width,
		1.0 * 0.2,
		90,
		210, 1, 0.15, 0.95,
		210, 1, 0.15, 0.95,
		210, 1, 0.25, 0.95,
		210, 1, 0.25, 0.95);

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width_half,
		0.5 / rvr.camera_landscape.aspect + rvr.player_agent.state.stamina * 0.1,
		bar_width * 0.75,
		rvr.player_agent.state.stamina * 0.2,
		90,
		210, 1, 0.55 - rvr.player_agent.state.stamina * 0.25 + lum_add, 0.95,
		210, 1, 0.55 - rvr.player_agent.state.stamina * 0.25 + lum_add, 0.95,
		210, 1, 0.55 - rvr.player_agent.state.stamina * 0.25 + lum_add, 0.95,
		210, 1, 0.55 - rvr.player_agent.state.stamina * 0.25 + lum_add, 0.95);

	// burn
	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width * 2.0,
		0.5 / rvr.camera_landscape.aspect + rvr.player_agent.burning * 0.01,
		bar_width * 0.75,
		rvr.player_agent.burning * 0.02,
		90,
		20, 1, 0.55 - rvr.player_agent.burning * 0.01, 0.5,
		20, 1, 0.55 - rvr.player_agent.burning * 0.01, 0.5,
		20, 1, 0.55 - rvr.player_agent.burning * 0.01, 0.5,
		20, 1, 0.55 - rvr.player_agent.burning * 0.01, 0.5);

	// health
	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width * 1.5,
		0.5 / rvr.camera_landscape.aspect + 1.0 * 0.1,
		bar_width,
		1.0 * 0.2,
		90,
		0, 1, 0.15, 0.95,
		0, 1, 0.15, 0.95,
		0, 1, 0.25, 0.95,
		0, 1, 0.25, 0.95);
	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width * 1.5,
		0.5 / rvr.camera_landscape.aspect + rvr.player_agent.state.health * 0.1,
		bar_width * 0.75,
		rvr.player_agent.state.health * 0.2,
		90,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.5,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.5,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.5,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.5);
	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		1.0 - bar_width * 1.5,
		0.5 / rvr.camera_landscape.aspect + this.displayed_health * 0.1,
		bar_width * 0.75,
		this.displayed_health * 0.2,
		90,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.65,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.65,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.65,
		0, 1, 0.55 - rvr.player_agent.state.health * 0.1, 0.65);



	//console.log(rvr.player_agent.shield, this.displayed_shield);

	if (rvr.player_agent.shield > 0)
	rvr.c.rectangle_textured.draw(
		rvr.CAM_LANDSCAPE,
		rvr.tex_bar_shield,
		1.0 - bar_width * 1.25,
		0.5 / rvr.camera_landscape.aspect + rvr.player_agent.shield * 0.1,
		bar_width * 0.5,
		rvr.player_agent.shield * 0.2,
		90,
		60, 1, 1.0, 0.5,
		60, 1, 1.0, 0.5,
		60, 1, 1.0, 0.5,
		60, 1, 1.0, 0.5);

	if (this.displayed_shield > 0)
	rvr.c.rectangle_textured.draw(
		rvr.CAM_LANDSCAPE,
		rvr.tex_bar_shield,
		1.0 - bar_width * 1.25,
		0.5 / rvr.camera_landscape.aspect + this.displayed_shield * 0.1,
		bar_width * 0.5,
		this.displayed_shield * 0.2,
		90,
		60, 1, 1.0, 0.65,
		60, 1, 1.0, 0.65,
		60, 1, 1.0, 0.65,
		60, 1, 1.0, 0.65);


	if (this.showing_inventory == 0)
		return;

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		0.5,
		0.01 + 0.02 * this.showing_inventory,
		1.0,
		0.02 + 0.04 * this.showing_inventory,
		90,
		52, 1, 0.5, 1.0,
		52, 1, 0.5, 1.0,
		52, 1, 0.5, 0.0,
		52, 1, 0.5, 0.0);

	rvr.c.rectangle.draw(rvr.CAM_LANDSCAPE,
		0.5,
		1 / rvr.camera_landscape.aspect - (0.01 + 0.32 * this.showing_inventory),
		1.0,
		0.02 + (0.64 * this.showing_inventory),
		90,
		52, 1, 0.5, 0.0 + 0.5 * this.showing_inventory,
		52, 1, 0.5, 0.0 + 0.5 * this.showing_inventory,
		52, 1, 0.5, 1.0,
		52, 1, 0.5, 1.0);

	rvr.c.flush_all();

	rvr.c.rectangle.draw(rvr.CAM_PORTRAIT,
		rvr.camera_portrait.aspect / 2 + 0.01,
		1.0 - 0.5 * this.showing_inventory - 0.01,
		this.showing_inventory * 0.8 * rvr.camera_portrait.aspect,
		this.showing_inventory * 0.8 * this.showing_inventory,
		90,
		222, 1, 0.2, 0.7 * this.showing_inventory,
		222, 1, 0.2, 0.7 * this.showing_inventory,
		222, 1, 0.3, 0.7 * this.showing_inventory,
		222, 1, 0.3, 0.7 * this.showing_inventory);

	rvr.c.rectangle.draw(rvr.CAM_PORTRAIT,
		rvr.camera_portrait.aspect / 2,
		1.0 - 0.5 * this.showing_inventory,
		this.showing_inventory * 0.8 * rvr.camera_portrait.aspect,
		this.showing_inventory * 0.8 * this.showing_inventory,
		90,
		222, .5, 0.8, 0.7 * this.showing_inventory,
		222, .5, 0.8, 0.7 * this.showing_inventory,
		222, .5, 0.9, 0.7 * this.showing_inventory,
		222, .5, 0.9, 0.7 * this.showing_inventory);


	rvr.fonts.draw_text(
		'Inventory',
		rvr.CAM_PORTRAIT, rvr.FONT_DEFAULT,
		- (rvr.camera_portrait.aspect / 2) + this.showing_inventory * (rvr.camera_portrait.aspect / 1.8),
		0.95,
		width, height, spacing,
		222, 1, .9, .99,
		222, 1, .8, .99,
		222, 1, .95, .99,
		222, 1, .99, .99);

	rvr.c.flush_all();
	rvr.fonts.flush_all();
}


rvr.GUI.prototype._ = function()
{
}
