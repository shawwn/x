rvr.Pickups = function()
{
	this.pickup_count = rvr_PICKUP_COUNT;
	this.pickups = new Array(rvr_PICKUP_COUNT);
	for (var i = 0; i < rvr_PICKUP_COUNT; i++)
	{
		this.pickups[i] = new rvr.Pickup(i);
		this.pickups[i].spawn(µ.rand(rvr.world_size_x), µ.rand(rvr.world_size_y), rvr.PICKUP_TYPE__GEM);
	}
}

rvr.Pickups.prototype.spawn = function(pos_x, pos_y, type)
{
	for (var i = 0; i < rvr_PICKUP_COUNT; i++)
	{
		if (!rvr_pickups__is_active[i])
		{
			this.pickups[i].spawn(pos_x, pos_y, type);
			return;
		}
	}
}

rvr.Pickups.prototype.think = function(time_delta)
{
	for (var i = 0; i < rvr_PICKUP_COUNT; i++)
	{
		if (rvr_pickups__is_active[i])
		{
			this.pickups[i].think(time_delta);
		}
	}
}

rvr.Pickups.prototype.draw = function()
{
	for (var i = 0; i < rvr_PICKUP_COUNT; i++)
	{
		if (rvr_pickups__is_active[i])
		{
			//console.log(rvr_pickups__pos_x[i], rvr_pickups__pos_y[i]);

			rvr.c.rectangle_textured.draw(
				rvr.CAM_PLAYER,
				rvr.tex_gem,
				rvr_pickups__pos_x[i],
				rvr_pickups__pos_y[i],
				0.35,
				0.35,
				((rvr.now) / 234) % 360,
				rvr_pickups__hue[i], 1, 1.0
				 + Math.max(0.2, 0.3 * Math.sin(rvr.now / 177))
				 + Math.max(0.1, 0.2 * Math.sin(rvr.now / 333))
				 + Math.max(0.05, 0.1 * Math.sin(rvr.now / 456)),
				 1,
				-1,-1,-1,-1,
				-1,-1,-1,-1,
				-1,-1,-1,-1);
		}
	}
}

rvr.Pickups.prototype._ = function()
{
}