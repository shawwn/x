hc.Solar_System = function(size)
{
	this.solar_bodies		= [];
	this.generate();
}

hc.Solar_System.prototype.generate = function()
{
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());


	this.solar_bodies[1].attach_to(this.solar_bodies[0]);
	this.solar_bodies[2].attach_to(this.solar_bodies[0]);
	this.solar_bodies[3].attach_to(this.solar_bodies[0]);
	this.solar_bodies[4].attach_to(this.solar_bodies[0]);
	this.solar_bodies[5].attach_to(this.solar_bodies[0]);
	this.solar_bodies[6].attach_to(this.solar_bodies[0]);

	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());
	this.solar_bodies.push(new hc.Solar_Body());

	this.solar_bodies[7].attach_to(this.solar_bodies[3]);
	this.solar_bodies[7].distance_from_parent_body = 43.0;
	this.solar_bodies[8].attach_to(this.solar_bodies[3]);
	this.solar_bodies[8].distance_from_parent_body = 50.0;
	this.solar_bodies[9].attach_to(this.solar_bodies[3]);
	this.solar_bodies[9].distance_from_parent_body = 63.0;

}

hc.Solar_System.prototype.draw = function()
{
	for (var i = 0, len = this.solar_bodies.length; i < len; i++)
	{
		this.solar_bodies[i].draw();
	}
}

hc.Solar_System.prototype.think = function(time_delta)
{
	this.solar_bodies[0].update_position(time_delta);
}

hc.Solar_System.prototype._ = function()
{
}

