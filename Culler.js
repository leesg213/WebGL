// implementation for culler

function culler()
{
	this.lights = new Array();
	this.meshes = new Array();
}

culler.prototype.Clear = function()
{
	this.lights = new Array();
	this.meshes = new Array();
}

culler.prototype.CullSceneNode = function(scene)
{
	this.CullSceneObject(scene);
}

culler.prototype.CullLight = function(light)
{
	this.lights.push(light);
}
culler.prototype.CullSceneObject = function(object)
{
	if(object.IsTypeOf(SceneObjectType.Light))
	{
		this.CullLight(object);
		return;
	}

	if(object.IsTypeOf(SceneObjectType.SceneNode))
	{
		var num_children = object.ChildCont.length;
		for(var i = 0;i<num_children; ++i)
		{
			var child = object.ChildCont[i];

			this.CullSceneObject(child);
		}
		return;
	}

	if(object.IsTypeOf(SceneObjectType.MeshObject))
	{
		this.meshes.push(object);
	}
}