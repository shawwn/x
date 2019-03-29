µ.WebGL_Framebuffer = function(webgl, gl, textures, framebuffer_texture_size)
{
	this.webgl = webgl;
	this.gl = gl;
	this.textures = textures;

	this.framebuffer = gl.createFramebuffer();
	this.framebuffer_texture_size = framebuffer_texture_size;
	this.framebuffer_texture = this.webgl.empty_texture(this.framebuffer_texture_size, true, true);

}

µ.WebGL_Framebuffer.prototype.bind_buffer = function()
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
	this.gl.viewport(0, 0, this.framebuffer_texture_size, this.framebuffer_texture_size);
	this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures[this.framebuffer_texture], 0);
}

µ.WebGL_Framebuffer.prototype.unbind_buffer = function()
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	this.gl.viewport(0, 0, this.webgl.canvas.width, this.webgl.canvas.height);
}


