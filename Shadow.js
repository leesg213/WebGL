function ShadowMap()
{
	this.render_camera = null;
	this.fbo = null;
	this.size = new Vec2(1024,1024);	
}

ShadowMap.prototype.Init = function()
{
	var gl = Renderer.gl;

	this.render_camera = new Camera();

	this.fbo = new FrameBufferObject();
	this.fbo.Init(1);

	var color_texture0 = new Texture();
	color_texture0.CreateAsTexture(this.size, 
		gl.RGBA, 
		gl.RGBA,
		gl.FLOAT);

	var depth_texture = new Texture();
	depth_texture.CreateAsRenderBuffer(this.size,
		gl.DEPTH_COMPONENT16);

	this.fbo.AttachColorTexture(0, color_texture0);
	this.fbo.AttachDepthTexture(depth_texture);
	this.fbo.SetSize(this.size);

}

ShadowMap.prototype.UpdateRenderCamera = function(light)
{
	var Radius = 100;

	this.render_camera.SetOrtho(Radius*2, Radius*2, 10, Radius*2+10);

	var CamDirection = light.GetWorldDirection();
	CamDirection.MakeNormalize();

	var CamPos = CamDirection.Scale(-(Radius+10));

	var WorldT = new Matrix4();

	WorldT.Set(light.World);
	WorldT.m[3*4+0] = CamPos.x;
	WorldT.m[3*4+1] = CamPos.y;
	WorldT.m[3*4+2] = CamPos.z;

	this.render_camera.World = WorldT;		
	this.render_camera.UpdateView();
}

ShadowMap.prototype.PrepareRenderer = function(light)
{
	this.UpdateRenderCamera(light);

	var back = this.render_camera.Frustum.Back;

	Renderer.SetFBO(this.fbo);
	Renderer.gl.clearColor(back, back, back, back);
	Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT | Renderer.gl.DEPTH_BUFFER_BIT);

}