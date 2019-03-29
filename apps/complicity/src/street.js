btx.Street = function(is_border_street, start_x, start_y, end_x, end_y)
{
	this.is_border_street = is_border_street;
	this.start_x = start_x;
	this.start_y = start_y;
	this.end_x = end_x;
	this.end_y = end_y;
	this.is_horizontal = start_y == end_y;
}

btx.Street.prototype._ = function()
{
}

