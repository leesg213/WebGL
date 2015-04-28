function Texture()
{
	this.object = null;
	this.IsRenderBuffer = false;
	this.IsDefaultRenderBuffer = false;

	this.InternalFormat = -1;
	this.PixelType = -1;
	this.PixelFormat = -1;
	this.size = new Vec2(0,0);
}


Texture.prototype.Release = function()
{
	if(this.IsDefaultRenderBuffer || this.object == nil)
	{
		return;
	}

	if(m_IsRenderBuffer)
	{
		Renderer.gl.deleteRenderbuffer(this.object);				
	}
	else
	{
		Renderer.gl.deleteTexture(this.object);
	}

	this.object = nil;

}

Texture.prototype.CreateAsTexture = function(size, internal_format, pixel_format, pixel_type)
{

	this.object = Renderer.gl.createTexture();
	Renderer.gl.bindTexture(Renderer.gl.TEXTURE_2D, this.object);
	Renderer.gl.texImage2D(Renderer.gl.TEXTURE_2D, 0, internal_format, size.x, size.y, 0, pixel_format, pixel_type, null);

	//Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAX_LEVEL, 0);
	Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAG_FILTER, Renderer.gl.NEAREST);
	Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MIN_FILTER, Renderer.gl.NEAREST);

	this.InternalFormat = internal_format;
	this.PixelType = pixel_type;
	this.PixelFormat = pixel_format;
	this.IsRenderBuffer = false;
	this.IsDefaultRenderBuffer = false;
	this.size.Set(size);
}

Texture.prototype.CreateAsRenderBuffer = function(size, internal_format)
{
	this.object = Renderer.gl.createRenderbuffer();
	Renderer.gl.bindRenderbuffer(Renderer.gl.RENDERBUFFER, this.object);
	Renderer.gl.renderbufferStorage(Renderer.gl.RENDERBUFFER, internal_format, size.x, size.y);

	this.InternalFormat = internal_format;
	this.size.Set(size);
	this.IsRenderBuffer = true;
	this.IsDefaultRenderBuffer = false;

}
Texture.prototype.CreateAsDefaultRenderBuffer = function()
{
	this.IsDefaultRenderBuffer = true;
	this.IsRenderBuffer = true;
}