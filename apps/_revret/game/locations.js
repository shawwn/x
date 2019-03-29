rvr.Locations = function()
{
	this.location_count = 1000;

	var y_offset = 0;
	for (var i = 0; i < this.location_count; i++)
	{
		this.locations[i] = new rvr.Location();
	}
}

rvr.Locations.prototype._ = function()
{
}