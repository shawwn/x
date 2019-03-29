var inc = 0;
hc.SOLAR_BODY_TYPE__NONE			= inc++;
hc.SOLAR_BODY_TYPE__PLANET 			= inc++;
hc.SOLAR_BODY_TYPE__MOON			= inc++;
hc.SOLAR_BODY_TYPE__ASTEROID		= inc++;
hc.SOLAR_BODY_TYPE__SATELLITE 		= inc++;
hc.SOLAR_BODY_TYPE__ 				= inc++;
hc.SOLAR_BODY_TYPE__ 				= inc++;

var inc = 0;
hc.SATELLITE_TYPE__MINING_STATION 			= inc++;
hc.SATELLITE_TYPE__SPACE_STATION 			= inc++;
hc.SATELLITE_TYPE__ 				= inc++;
hc.SATELLITE_TYPE__ 				= inc++;

hc.Solar_Body = function()
{
	this.type_id						= hc.SOLAR_BODY_TYPE__NONE;
	this.type							= null;
	this.parent_body					= null;
	this.distance_from_parent_body		= hc.universe_size_x * 0.05 + µ.rand(hc.universe_size_x * 0.4);
	this.children_bodies				= [];
	this.pos_x 							= hc.universe_size_x * 0.45 + µ.rand(hc.universe_size_x * 0.1);
	this.pos_y 							= hc.universe_size_y * 0.45 + µ.rand(hc.universe_size_y * 0.1);
	this.radius							= 2.0 + µ.rand(8);
	this.radius2						= this.radius * 2;

	this.rotation_speed					= 0.0002 + µ.rand(0.0015);
	this.rotation_angle					= µ.rand(360);
}

hc.Solar_Body.prototype.attach_to = function(other_body)
{
	this.parent_body = other_body;
	other_body.children_bodies.push(this);
}

hc.Solar_Body.prototype.update_position = function(time_delta)
{
	if (this.parent_body != null)
	{
		this.rotation_angle = (this.rotation_angle + this.rotation_speed * time_delta) % 360;

		this.pos_x = this.parent_body.pos_x + µ.angle_to_x(this.rotation_angle) * this.distance_from_parent_body;
		this.pos_y = this.parent_body.pos_y + µ.angle_to_y(this.rotation_angle) * this.distance_from_parent_body;



		hc.particlesGPU.spawn(
				hc.now,
				1,
				this.pos_x,
				this.pos_y,
				this.pos_x,
				this.pos_y,
				this.radius2,
				0,
				0,
				0, 0,
				hc.particles__solar_trail,
				5000,
				120,1,1,0.1,
				360,		//	vary_angle
				0.1,		//	vary_angle_vel
				0,		//	vary_pos_x
				0,		//	vary_pos_y
				0,		//	vary_size
				0,		//	vary_vel_x
				0,		//	vary_vel_y
				100,		//	vary_lifespan
				0,		//	vary_color_hue
				0,		//	vary_color_sat
				0,		//	vary_color_lum
				0		//	vary_color_a
			);


	}
	for (var i = 0, len = this.children_bodies.length; i < len; i++)
	{
		this.children_bodies[i].update_position(time_delta);
	}


}

hc.Solar_Body.prototype.draw = function()
{
	hc.c.rectangle_textured.draw(
			hc.CAM_PLAYER,
			hc.tex_circle,
			this.pos_x,
			this.pos_y,
			this.radius2,
			this.radius2,
			90,
			120, 1, 1, 0.5, -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
}

hc.Solar_Body.prototype._ = function()
{
}

