µ.WebGL_Texture_Atlas = function(texture_list, texture_dimensions)
{
	this.textures_to_go = texture_list.length;
	this.texture_dimensions = texture_dimensions;
	this.texture_image_data = [];
}

µ.WebGL_Texture_Atlas.prototype.texture_loaded = function()
{
	this.textures_to_go--;
	if (this.textures_to_go == 0)
	{
		this.all_textures_loaded();
	}
}

µ.WebGL_Texture_Atlas.prototype._ = function()
{
}

µ.WebGL_Texture_Atlas.prototype.all_textures_loaded = function()
{

}

µ.WebGL_Texture_Atlas.prototype._ = function()
{
}