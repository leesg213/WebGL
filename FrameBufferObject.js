function FrameBufferObject() {

    this.IsDefaultFB = false;
    this.ID = -1;
    this.ColorBuffers = null;
    this.DepthBuffer = null;
    this.Size = new Vec2(0,0);

}


FrameBufferObject.prototype.AttachColorTexture = function(slot_index, texture)
{
    var gl = Renderer.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.ID);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+slot_index, gl.TEXTURE_2D, texture.object, 0);
    this.ColorBuffers[slot_index] = texture;

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    {
        alert("Framebuffer is not complete");
        return;
    }
}

FrameBufferObject.prototype.AttachDepthTexture = function(texture)
{
    var gl = Renderer.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.ID);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, texture.object);

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    {
        alert("Framebuffer is not complete");
        return;
    }

    this.DepthBuffer = texture;    
}

FrameBufferObject.prototype.InitAsDefault = function()
{
    this.ID = Renderer.gl.getParameter(Renderer.gl.FRAMEBUFFER_BINDING);
    this.IsDefaultFB = true;

}
FrameBufferObject.prototype.Init = function(numBuffers)
{
    var gl = Renderer.gl;

    this.ID = gl.createFramebuffer();
    this.ColorBuffers = new Array(numBuffers);
    this.IsDefaultFB = false;
}

FrameBufferObject.prototype.Release = function()
{
    if(this.IsDefaultFB == false)
    {
        Renderer.gl.deleteFramebuffer(this.ID);
    }
}
FrameBufferObject.prototype.SetSize = function (new_size)
{
	this.Size.Set(new_size);
}
