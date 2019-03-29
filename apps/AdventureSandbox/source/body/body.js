asbx.Body = function()
{
	this.reset();
}

asbx.Body.prototype.reset = function()
{
	this.pos_x 					= 0;
	this.pos_y 					= 0;
	this.speed_x 				= 0;
	this.speed_y 				= 0;

	this.surface_roughness 		= 0;
	this.surface_stickyness 	= 0;
	this.air_friction 			= 0;

	this.weight 				= 0;

	this.size_x					= 0;
	this.size_y 				= 0;

	this.wetness 				= 0;
	
	this.on_ground				= false;
}


asbx.Body.prototype.__ = function()
{

}