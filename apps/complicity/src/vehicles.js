btx.Vehicles = function()
{
	this.vehicles = new Array(0);

	this.vehicles = new Array(0);
	for (var i = 0; i < btx.vehicle_count; i++)
	{
		this.vehicles.push(new btx.Vehicle());
	}
	this.place_some_vehicles();
}

btx.Vehicles.prototype.add_vehicle = function(type, pos_x, pos_y)
{
	for (var i = 0; i < btx.vehicle_count; i++)
	{
		var vehicle = this.vehicles[i];
		if (!vehicle.is_active)
		{
			vehicle.is_active = true;
			vehicle.pos_x = pos_x;
			vehicle.pos_y = pos_y;
			return;
		}
	}
	
}

btx.Vehicles.prototype.place_some_vehicles = function()
{
	for (var i = 0; i < 10; i++)
	{
		this.add_vehicle(0, µ.rand(btx.world_size_x), µ.rand(btx.world_size_x));
	}
}






btx.Vehicles.prototype.draw = function()
{
}

btx.Vehicles.prototype._ = function()
{
}

