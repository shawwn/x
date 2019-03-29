asbx.Chunk = function(size_x, size_y)
{
	var tiles_total = size_x, size_y;

	this.tiles_type			= new Uint8Array(tiles_total);
	this.tiles_wetness		= new Uint8Array(tiles_total);
	this.tiles_temperature	= new Uint8Array(tiles_total);
	this.tiles_pressure		= new Uint8Array(tiles_total);

}

asbx.Chunk.prototype.tick = function(start_x, end_x)
{

}

asbx.Chunk.prototype.generate = function()
{
	/*
		perlin noise
		
	*/
}


asbx.Chunk.prototype.__ = function()
{

}