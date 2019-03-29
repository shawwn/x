btx.Weather = function()
{
	this.next_change = 0;
	this.change_speed = 0;

	this.current_wind_speed_x	= 0;
	this.current_wind_speed_y	= 0;
	this.target_wind_speed_x	= 0;
	this.target_wind_speed_y	= 0;
	this.cloud_offset_x			= 0;
	this.cloud_offset_y			= 0;

	this.current_fogginess 		= 0;
	this.current_cloud_density 	= 0.5;
	this.current_cloud_pattern 	= 0;

	this.target_fogginess 		= 0;
	this.target_cloud_density 	= 0;
	this.target_cloud_pattern 	= 0;
}


btx.Weather.prototype.think = function(time_delta)
{

	this.next_change -= time_delta;

	if (this.next_change <= 0)
	{
		this.change();
		this.next_change = 10000 + µ.rand(90000);
	}
	
	this.cloud_offset_x	+= this.current_wind_speed_x * time_delta;
	this.cloud_offset_y	+= this.current_wind_speed_y * time_delta;

	// changes constantly
	
	this.target_cloud_pattern = µ.between(0, this.target_cloud_pattern, 1);

	var factor1 = 0.9995 - 0.0050 * this.change_speed;
	var factor2 = 0.0005 + 0.0050 * this.change_speed;

	this.current_wind_speed_x 	= (this.current_wind_speed_x 	* factor1 + this.target_wind_speed_x 	* factor2) * 1.0;
	this.current_wind_speed_y 	= (this.current_wind_speed_y 	* factor1 + this.target_wind_speed_y 	* factor2) * 1.0;
	this.current_fogginess 		= (this.current_fogginess 		* factor1 + this.target_fogginess 		* factor2) * 1.0;
	this.current_cloud_density 	= (this.current_cloud_density 	* factor1 + this.target_cloud_density 	* factor2) * 1.0;
	this.current_cloud_pattern 	= (this.current_cloud_pattern 	* factor1 + this.target_cloud_pattern 	* factor2) * 1.0;

}


btx.Weather.prototype.change = function()
{
	// wind & clouds

	if (µ.rand_int(1) == 0)		this.change_speed 			= Math.pow(µ.rand(1), 2);
	if (µ.rand_int(20) == 0) 	this.target_fogginess		= Math.pow(µ.rand(1), 2);
	if (µ.rand_int(10) == 0) 	this.target_cloud_density	= Math.pow(µ.rand(1), 2);
	if (µ.rand_int(5) == 0) 	this.target_cloud_pattern	= µ.rand(1);

	this.target_wind_speed_x		= - 0.000002 + µ.rand(0.000004);
	this.target_wind_speed_y		= - 0.000002 + µ.rand(0.000004);
}



btx.Weather.prototype._ = function()
{
}

