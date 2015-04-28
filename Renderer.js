var Renderer = {
	gl : null,

	Init : function(_gl_context)
	{
		this.gl= _gl_context;
	},

	SetFBO : function(fbo)
	{

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo.ID);
		this.gl.viewport(0,0,fbo.Size.x, fbo.Size.y);
		
	},
}