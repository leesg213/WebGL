var gDeferredRenderer;

var DebugRenderMode =
{
	None : 0,
	Position : 1,
	Normal : 2,
	Diffuse : 3,
	Shadow : 4
}

function SmallLight()
{
	var ground_r = 60;

	this.light = new PointLight();
	this.light.Radius = Math.random()*10+5;
	this.light.Dimmer = Math.random()*0.5+0.5;
	this.light.DiffuseColor.Set2(Math.random(),Math.random(),Math.random());
	this.light.DiffuseColor.MakeNormalize();
	this.InitialPosition = new Vec3(Math.random()*ground_r*2-ground_r,0,Math.random()*ground_r*2-ground_r);
	this.light.Local.Translate.Set(this.InitialPosition);

	this.rot = CreateQuaternionFromAngleAxis(new Vec3(0,1,0), (Math.random()*5+2)*3.141592/180.0);
}

SmallLight.prototype.Update = function()
{
	this.light.Local.Translate = this.rot.Rotate(this.light.Local.Translate);
	this.light.Update();
}

function DeferredRenderer() {

    this.box = null;
    this.sphere = null;
    this.scene = null;

    this.shader = null;
    this.debug_shader = null;
    this.gbuffer_pos_shader = null;
    this.gbuffer_nor_shader = null;
    this.gbuffer_dif_shader = null;
    this.light_shader = null;
    this.pointlight_shader = null;
    this.shadow_shader = null;

    this.nav_camera = null;

    this.default_fbo = new FrameBufferObject();
    this.gbuffer_pos_fbo = new FrameBufferObject();
    this.gbuffer_nor_fbo = new FrameBufferObject();
    this.gbuffer_dif_fbo = new FrameBufferObject();

    this.quad = null;

    this.mesh_culler = new culler();

    this.smalllights = new Array();

    this.debug_render_mode = DebugRenderMode.None;

    gDeferredRenderer = this;

    document.getElementById("btn_gbuffer_position").onclick = onDebugGBufferPosition;
    document.getElementById("btn_gbuffer_normal").onclick = onDebugGBufferNormal;
    document.getElementById("btn_gbuffer_diffuse").onclick = onDebugGBufferDiffuse;
    document.getElementById("btn_shadowbuffer").onclick = onDebugShadow;
    document.getElementById("btn_final").onclick = onDebugFinal;

}

function onDebugGBufferPosition()
{
	gDeferredRenderer.debug_render_mode = DebugRenderMode.Position;
}
function onDebugGBufferNormal()
{
	gDeferredRenderer.debug_render_mode = DebugRenderMode.Normal;
}
function onDebugGBufferDiffuse()
{
	gDeferredRenderer.debug_render_mode = DebugRenderMode.Diffuse;
}
function onDebugShadow()
{
	gDeferredRenderer.debug_render_mode = DebugRenderMode.Shadow;
}
function onDebugFinal()
{
	gDeferredRenderer.debug_render_mode = DebugRenderMode.None;
}

DeferredRenderer.prototype.create_fbo = function()
{
	var gl = Renderer.gl;

	this.default_fbo.InitAsDefault();
	this.default_fbo.SetSize(new Vec2(gl.viewportWidth, gl.viewportHeight));

	var ext = gl.getExtension('OES_texture_float');

	this.gbuffer_pos_fbo.Init(1);
	this.gbuffer_nor_fbo.Init(1);
	this.gbuffer_dif_fbo.Init(1);

	var color_texture0 = new Texture();
	color_texture0.CreateAsTexture(new Vec2(gl.viewportWidth, gl.viewportHeight), 
		gl.RGBA, 
		gl.RGBA,
		gl.FLOAT);

	var depth_texture = new Texture();
	depth_texture.CreateAsRenderBuffer(new Vec2(gl.viewportWidth, gl.viewportHeight),
		gl.DEPTH_COMPONENT16);

	this.gbuffer_pos_fbo.AttachColorTexture(0, color_texture0);
	this.gbuffer_pos_fbo.AttachDepthTexture(depth_texture);
	this.gbuffer_pos_fbo.SetSize(new Vec2(gl.viewportWidth, gl.viewportHeight));

	color_texture0 = new Texture();
	color_texture0.CreateAsTexture(new Vec2(gl.viewportWidth, gl.viewportHeight), 
		gl.RGBA, 
		gl.RGBA,
		gl.FLOAT);

	this.gbuffer_nor_fbo.AttachColorTexture(0, color_texture0);
	this.gbuffer_nor_fbo.AttachDepthTexture(depth_texture);
	this.gbuffer_nor_fbo.SetSize(new Vec2(gl.viewportWidth, gl.viewportHeight));

	color_texture0 = new Texture();
	color_texture0.CreateAsTexture(new Vec2(gl.viewportWidth, gl.viewportHeight), 
		gl.RGBA, 
		gl.RGBA,
		gl.FLOAT);

	this.gbuffer_dif_fbo.AttachColorTexture(0, color_texture0);
	this.gbuffer_dif_fbo.AttachDepthTexture(depth_texture);
	this.gbuffer_dif_fbo.SetSize(new Vec2(gl.viewportWidth, gl.viewportHeight));

}

DeferredRenderer.prototype.create_scene = function()
{

	this.scene = new SceneNode();


	var mesh = MeshUtil.CreateUnitBox();
	var box = new MeshObject(mesh);
	box.Local.Scale.Set2(30,2,30);
	box.Local.Translate.Set2(0,-5,0);
	box.MaterialDiffuse.Set2(1,0,0);
	box.Update();
	this.scene.AttachChild(box);


	box = new MeshObject(mesh);
	box.Local.Scale.Set2(30,2,30);
	box.Local.Translate.Set2(0,10,15);
	box.Local.Rotate.MakeRotationXAxis(3.141592/2.0);
	box.MaterialDiffuse.Set2(1,0,1);
	box.Update();
	this.scene.AttachChild(box);

	box = new MeshObject(mesh);
	box.Local.Scale.Set2(30,2,30);
	box.Local.Translate.Set2(-15,10,0);
	box.Local.Rotate.MakeRotationZAxis(3.141592/2.0);
	box.MaterialDiffuse.Set2(0,1,0);
	box.Update();
	this.scene.AttachChild(box);


	mesh = MeshUtil.CreateUnitSphere(true, false, 10);
	var sphere = new MeshObject(mesh);
	sphere.Local.Scale.Set2(2,2,2);
	sphere.Local.Translate.Set2(0,0,0);
	sphere.MaterialDiffuse.Set2(1,0.5,1);
	sphere.Update();
	this.scene.AttachChild(sphere);

	sphere = new MeshObject(mesh);
	sphere.Local.Scale.Set2(15,21,15);
	sphere.Local.Translate.Set2(30,0,10);
	sphere.MaterialDiffuse.Set2(0.5,1,0);
	sphere.Update();
	this.scene.AttachChild(sphere);

	mesh = Terrain.CreateMesh(30, 30, 8, 1.0 / 2.0, 4);
	var terrain = new MeshObject(mesh);
	terrain.Local.Scale.Set2(10,5,10);
	terrain.Local.Translate.Set2(0,-20,0);
	terrain.MaterialDiffuse.Set2(1,1,1);
	terrain.Update();
	this.scene.AttachChild(terrain);

	this.sphere = new MeshObject(mesh);

	var light = new DirectionalLight();
	light.SetLookAt(new Vec3(-50,50,60), new Vec3(0,0,0), new Vec3(1,0,0));
	light.Dimmer = 0.5;
	light.DiffuseColor.Set2(1,1,1);
	light.EnableShadow = true;
	this.scene.AttachChild(light);


	var num_small_lights = 0;

	for(var i = 0;i<num_small_lights; ++i)
	{
		var small_light = new SmallLight();
		this.scene.AttachChild(small_light.light);
		this.smalllights.push(small_light);
	}


	light = new AmbientLight();
	light.Dimmer = 0.0;
	this.scene.AttachChild(light);

	this.scene.Update();
 
	this.quad = new MeshObject(MeshUtil.CreateQuad());
	this.quad.Update();

	this.nav_camera = new NavCamera();
	this.nav_camera.camera.SetPerspective(60*3.141592/180, 1, 1, 10000);
	this.nav_camera.Update();	
}
DeferredRenderer.prototype.create_shaders = function()
{

 	this.shader = LoadShader("default");
 	this.debug_shader = LoadShader("debug");
 	this.gbuffer_pos_shader = LoadShader("gbuffer_pos");
 	this.gbuffer_nor_shader = LoadShader("gbuffer_normal");
 	this.gbuffer_dif_shader = LoadShader("gbuffer_diffuse");
 	this.light_shader = LoadShader("light");	
 	this.shadow_shader = LoadShader("shadow");
 	this.pointlight_shader = LoadShader("pointlight");
}
DeferredRenderer.prototype.create_resource = function()
{
	this.create_fbo();
	this.create_scene();
	this.create_shaders();
}

DeferredRenderer.prototype.drawMeshes = function(program_id, camera, mesh_object_array)
{

    var View = camera.View;
    var Proj = camera.Projection;
    var ViewProj = new Matrix4();
    ViewProj.MakeMultiply(View,Proj);

	var gl = Renderer.gl;

	gl.useProgram(program_id);
    var loc = gl.getUniformLocation(program_id, "ViewProj");
    gl.uniformMatrix4fv(loc,false, ViewProj.m);

    loc = gl.getUniformLocation(program_id, "View");
    gl.uniformMatrix4fv(loc,false, View.m);

    loc = gl.getUniformLocation(program_id, "Proj");
    gl.uniformMatrix4fv(loc,false, Proj.m);

    var num_meshes = mesh_object_array.length;

    var transposed_inverse_world = new Matrix4();

    for(var i = 0;i<num_meshes; ++i)
    {

	    loc = gl.getUniformLocation(program_id, "World");
	    gl.uniformMatrix4fv(loc,false, mesh_object_array[i].World.m);

	    loc = gl.getUniformLocation(program_id, "TrInvWorld");

	    transposed_inverse_world.Set(mesh_object_array[i].World);
	    transposed_inverse_world.MakeInverse();
	    transposed_inverse_world.MakeTranspose();

	    gl.uniformMatrix4fv(loc,false, transposed_inverse_world.m);

	    var material_diffuse = mesh_object_array[i].MaterialDiffuse;

	    loc = gl.getUniformLocation(program_id, "MaterialDiffuse");
	    gl.uniform4f(loc, material_diffuse.x,material_diffuse.y,material_diffuse.z,1);

	    var mesh = mesh_object_array[i].mesh;
	    mesh.Bind(program_id);

	    if(mesh.index_data == null)
	    {
		    var num_elements = mesh.vertex_data.data_buffer.length/(mesh.vertex_data.stride/4);
		    gl.drawArrays(gl.TRIANGLES, 0, num_elements);
		}
		else
		{
			gl.drawElements(gl.TRIANGLES, mesh.index_data.length, gl.UNSIGNED_SHORT, null);
		}
	}
}

DeferredRenderer.prototype.drawGBuffer = function()
{
	var gl = Renderer.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clearDepth(1.0)
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    Renderer.SetFBO(this.gbuffer_pos_fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.drawMeshes(this.gbuffer_pos_shader.program_id, this.nav_camera.camera, this.mesh_culler.meshes);

    Renderer.SetFBO(this.gbuffer_nor_fbo);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawMeshes(this.gbuffer_nor_shader.program_id, this.nav_camera.camera, this.mesh_culler.meshes);

    Renderer.SetFBO(this.gbuffer_dif_fbo);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawMeshes(this.gbuffer_dif_shader.program_id, this.nav_camera.camera, this.mesh_culler.meshes);

}

DeferredRenderer.prototype.drawLight = function()
{

	var gl = Renderer.gl;

  	gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE,gl.ONE);

	Renderer.SetFBO(this.default_fbo);

    var View = this.nav_camera.camera.View;
    var Proj = this.nav_camera.camera.Projection;
    var ViewProj = new Matrix4();
    ViewProj.MakeMultiply(View,Proj);

    var num_lights = this.mesh_culler.lights.length;

    for(var i = 0;i<num_lights; ++i)
	{

		var light = this.mesh_culler.lights[i];

		var light_type = 0;
		var light_mesh;
		var shader;

		gl.disable(gl.CULL_FACE);

		if(light.GetType() == SceneObjectType.AmbientLight)
		{
			light_type = 0;
			light_mesh = this.quad;
			shader = this.light_shader;
			gl.useProgram(shader.program_id);
		}
		else if(light.GetType() == SceneObjectType.DirectionalLight)
		{
			light_type = 1;
			light_mesh = this.quad;
			shader = this.light_shader;
			gl.useProgram(shader.program_id);

			if(light.ShadowMap != null)
			{
				gl.activeTexture(gl.TEXTURE3);
			    gl.bindTexture(gl.TEXTURE_2D, light.ShadowMap.fbo.ColorBuffers[0].object);
			    gl.uniform1i(gl.getUniformLocation(shader.program_id, "ShadowMap"), 3);

			    var LightViewMat = light.ShadowMap.render_camera.View;
			    var LightProjMat = light.ShadowMap.render_camera.Projection;

			    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program_id, "LightViewMat"), false, LightViewMat.m);
			    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program_id, "LightProjMat"), false, LightProjMat.m);

			}

			var LightDirection = light.GetWorldDirection().Scale(-1);

			gl.uniform3f(gl.getUniformLocation(shader.program_id, "LightDirection"), LightDirection.x,LightDirection.y,LightDirection.z);
			gl.uniform4f(gl.getUniformLocation(shader.program_id, "LightProperty"), light_type, light.Dimmer,0,0);
			gl.uniform4f(gl.getUniformLocation(shader.program_id, "LightDiffuse"), light.DiffuseColor.x,light.DiffuseColor.y,light.DiffuseColor.z,1);


		}
		else if(light.GetType() == SceneObjectType.PointLight)
		{

			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.FRONT);


			shader = this.pointlight_shader;
			gl.useProgram(shader.program_id);

			this.sphere.Local.Translate.Set(light.Local.Translate);
			this.sphere.Local.Scale.Set2(light.Radius,light.Radius,light.Radius);
			this.sphere.Update();

			light_mesh = this.sphere;
			light_type = 2;
				
			var LightPos = light.GetWorldLocation();

		    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program_id, "ViewProj"),false, ViewProj.m);
		    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program_id, "World"),false, light_mesh.World.m);
			gl.uniform4f(gl.getUniformLocation(shader.program_id, "LightDiffuse"), light.DiffuseColor.x,light.DiffuseColor.y,light.DiffuseColor.z,light.Dimmer);
			gl.uniform4f(gl.getUniformLocation(shader.program_id, "LightPosition"),LightPos.x,LightPos.y,LightPos.z,light.Radius);

		}

	    gl.activeTexture(gl.TEXTURE0);
	    gl.bindTexture(gl.TEXTURE_2D, this.gbuffer_pos_fbo.ColorBuffers[0].object);
	    gl.uniform1i(gl.getUniformLocation(shader.program_id, "PositionMap"), 0);

	    gl.activeTexture(gl.TEXTURE1);
	    gl.bindTexture(gl.TEXTURE_2D, this.gbuffer_nor_fbo.ColorBuffers[0].object);
	    gl.uniform1i(gl.getUniformLocation(shader.program_id, "NormalMap"), 1);

	    gl.activeTexture(gl.TEXTURE2);
	    gl.bindTexture(gl.TEXTURE_2D, this.gbuffer_dif_fbo.ColorBuffers[0].object);
	    gl.uniform1i(gl.getUniformLocation(shader.program_id, "DiffuseMap"), 2);


		var mesh = light_mesh.mesh;
	    mesh.Bind(shader.program_id);
	    var num_elements = mesh.vertex_data.data_buffer.length/(mesh.vertex_data.stride/4);
	    gl.drawArrays(gl.TRIANGLES, 0, num_elements); 
	} 	

	gl.disable(gl.BLEND);
}

DeferredRenderer.prototype.DrawTexture = function(texture, multiplier)
{

	var gl = Renderer.gl;

  	gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

	Renderer.SetFBO(this.default_fbo);

    gl.useProgram(this.debug_shader.program_id);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.object);
    gl.uniform1i(gl.getUniformLocation(this.debug_shader.program_id, "DiffuseMap"), 0);

   	gl.uniform1f(gl.getUniformLocation(this.debug_shader.program_id, "multiplier"), multiplier);
  
	var mesh = this.quad.mesh;
    mesh.Bind(this.debug_shader.program_id);
    var num_elements = mesh.vertex_data.data_buffer.length/(mesh.vertex_data.stride/4);
    gl.drawArrays(gl.TRIANGLES, 0, num_elements); 

}
DeferredRenderer.prototype.UpdateShadowMaps = function()
{

	var gl = Renderer.gl;

	gl.enable(gl.DEPTH_TEST);
	gl.depthMask(gl.TRUE);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clearDepth(1.0)
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    gl.frontFace(gl.CCW);


    var num_lights = this.mesh_culler.lights.length;

    for(var i = 0;i<num_lights; ++i)
	{

		var light = this.mesh_culler.lights[i];
		if(light.GetType() != SceneObjectType.DirectionalLight)
		{
			continue;
		}

		if(light.EnableShadow == false)
		{
			continue;
		}

		if(light.ShadowMap == null)
		{
			light.CreateShadowMap();
		}

		light.ShadowMap.PrepareRenderer(light);

		this.drawMeshes(this.shadow_shader.program_id, light.ShadowMap.render_camera, this.mesh_culler.meshes);
	}

}
DeferredRenderer.prototype.draw = function () {

	if (this.scene == null)
	{
		this.create_resource();
	}
    // Clear Buffer
    var gl = Renderer.gl;

    // Culling
    this.mesh_culler.Clear();
    this.mesh_culler.CullSceneNode(this.scene);
    if(this.mesh_culler.meshes.length == 0)
    {
    	return;
    }
    if(this.mesh_culler.lights.length == 0)
    {
    	return;
    }

    for(var i = 0;i<this.smalllights.length;++i)
    {
    	var small_light = this.smalllights[i];
    	small_light.Update();
    }

    this.UpdateShadowMaps();

    // Viewport Update
    var ratio = gl.viewportHeight / gl.viewportWidth;
    this.nav_camera.camera.SetPerspective(60.0*3.141592/180.0, ratio, 1, 10000);
    this.nav_camera.Update();

    // Update GBuffers
    this.drawGBuffer();

    if(this.debug_render_mode == DebugRenderMode.None)
    {
    	// Update Light
    	this.drawLight();
	}
	else if(this.debug_render_mode == DebugRenderMode.Position)
	{
		this.DrawTexture(this.gbuffer_pos_fbo.ColorBuffers[0],1);
	}
	else if(this.debug_render_mode == DebugRenderMode.Normal)
	{
		this.DrawTexture(this.gbuffer_nor_fbo.ColorBuffers[0],1);
	}
	else if(this.debug_render_mode == DebugRenderMode.Diffuse)
	{
		this.DrawTexture(this.gbuffer_dif_fbo.ColorBuffers[0],1);
	}	
	else if(this.debug_render_mode == DebugRenderMode.Shadow)
	{
		this.DrawTexture(this.mesh_culler.lights[0].ShadowMap.fbo.ColorBuffers[0], 1/100.0);
	}


    //

}

