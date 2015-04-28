var SceneObjectType = 
{
	SceneObject : 0,
	SceneNode : 1,
	MeshObject : 2,
	Light : 3,
	AmbientLight : 4,
	DirectionalLight : 5,
	PointLight : 6,
	SpotLight : 7,
	Camera : 8
}

///////////////////////////////////////
// SceneObject
///////////////////////////////////////

function SceneObject()
{
	this.Local = new Transform();
	this.World = new Matrix4();
	this.Name = "";
	this.parent = null;
}

SceneObject.prototype.UpdateTransform = function()
{
	this.Local.Update();
	if(this.parent != null)
	{
		this.World.MakeMultiply(this.Local.Transform, this.parent.World);
		return;
	}

	this.World.Set(this.Local.Transform);
}

SceneObject.prototype.GetWorldRight = function()
{
	return new Vec3(this.World.m[0*4+0],this.World.m[1*4+0],this.World.m[2*4+0]);
}

SceneObject.prototype.GetWorldUp = function()
{
	return new Vec3(this.World.m[0*4+1],this.World.m[1*4+1],this.World.m[2*4+1]);
}

SceneObject.prototype.GetWorldDirection = function()
{
	return new Vec3(this.World.m[0*4+2],this.World.m[1*4+2],this.World.m[2*4+2]);
}

SceneObject.prototype.GetWorldLocation = function()
{
	return new Vec3(this.World.m[3*4+0], this.World.m[3*4+1], this.World.m[3*4+2]);
}

SceneObject.prototype.Update = function()
{
	this.UpdateTransform();
}

SceneObject.prototype.GetType = function()
{
	return SceneObjectType.SceneObject;
}

SceneObject.prototype.IsTypeOf = function(type)
{
	return type == SceneObjectType.SceneObject;
}

SceneObject.prototype.SetLookAt = function(eye_pos, target_pos, up)
{
	var basis_direction = target_pos.Sub(eye_pos);
	var basis_right = new Vec3();
	var basis_up = new Vec3();

	basis_direction.MakeNormalize();

	basis_right = up.Cross(basis_direction);
	basis_right.MakeNormalize();

	basis_up = basis_direction.Cross(basis_right);
	basis_up.MakeNormalize();

	this.Local.Translate.Set(eye_pos);
	this.Local.Rotate.SetCols(basis_right, basis_up, basis_direction);
}
///////////////////////////////////////
// SceneNode
///////////////////////////////////////

function SceneNode()
{
	SceneObject.call(this);
	this.ChildCont = new Array();
}
SceneNode.prototype = new SceneObject();

SceneNode.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.SceneNode)
	{
		return true;
	}

	return SceneObject.prototype.IsTypeOf.call(this,type);
}

SceneNode.prototype.GetType = function()
{
	return SceneObjectType.SceneNode;
}

SceneNode.prototype.AttachChild = function(child)
{
	var parent_old = child.parent;
	if(parent_old != null)
	{
		parent_old.DetachChild(child);
	}

	this.ChildCont.push(child);
	child.parent = this;
}

SceneNode.prototype.DetachChild = function(child)
{
	var num_child = this.ChildCont.length;
	for(var i = 0;i<num_child; ++i)
	{
		var c = this.ChildCont[i];

		if(c == child)
		{
			this.ChildCont.splice(i, 1);
			return;
		}
	}
}

SceneNode.prototype.Update = function()
{
	this.UpdateTransform();

	for(var i = 0;i<this.ChildCont.length; ++i)
	{
		var child = this.ChildCont[i];
		child.Update();
	}

}


///////////////////////////////////////
// MeshObject
///////////////////////////////////////

function MeshObject(mesh)
{
	SceneObject.call(this);
	this.mesh = mesh;
	this.MaterialDiffuse = new Vec3(1,1,1);
}

MeshObject.prototype = new SceneObject();


MeshObject.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.MeshObject)
	{
		return true;
	}

	return SceneObject.prototype.IsTypeOf.call(this,type);
}

MeshObject.prototype.GetType = function()
{
	return SceneObjectType.MeshObject;
}

///////////////////////////////////////
// Camera
///////////////////////////////////////

function Camera()
{
	SceneObject.call(this);
	this.Frustum = new Frustum();
	this.Projection = new Matrix4();
	this.View = new Matrix4();
}

Camera.prototype = new SceneObject();

Camera.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.Camera)
	{
		return true;
	}

	return SceneObject.prototype.IsTypeOf.call(this,type);
}

Camera.prototype.GetType = function()
{
	return SceneObjectType.Camera;
}

Camera.prototype.SetPerspective = function(fov, ratio, front, back)
{
	this.Frustum.Front = front;
	this.Frustum.Back = back;
	this.Frustum.FOV = fov;
	this.Frustum.Ratio = ratio;
	this.Frustum.Ortho = false;

	this.UpdateProjection();
}

Camera.prototype.SetOrtho = function(w, h, front, back)
{
	this.Frustum.Front = front;
	this.Frustum.Back = back;
	this.Frustum.Width = w;
	this.Frustum.Height = h;
	this.Frustum.Ortho = true;

	this.UpdateProjection();
}

Camera.prototype.UpdateProjection = function()
{
	this.Projection = this.Frustum.CreateProjection();
}

Camera.prototype.UpdateTransform = function()
{
	SceneObject.prototype.UpdateTransform.call(this);
	this.UpdateView();
}

Camera.prototype.UpdateView = function()
{
    var CamRight = new Vec3(this.World.m[0*4+0],this.World.m[1*4+0],this.World.m[2*4+0]);
    var CamUp = new Vec3(this.World.m[0*4+1],this.World.m[1*4+1],this.World.m[2*4+1]);
    var CamDirection = new Vec3(this.World.m[0*4+2],this.World.m[1*4+2],this.World.m[2*4+2]);
    var CamPos = new Vec3(this.World.m[3*4+0],this.World.m[3*4+1],this.World.m[3*4+2]);

    CamRight.MakeNormalize();
    CamUp.MakeNormalize();
    CamDirection.MakeNormalize();

    var Rotate = new Matrix4(new Vec4(CamRight.x,CamUp.x,CamDirection.x,0),
        new Vec4(CamRight.y,CamUp.y,CamDirection.y,0),
        new Vec4(CamRight.z,CamUp.z,CamDirection.z,0),
        new Vec4(0,0,0,1));

    var Translate = new Matrix4();
    Translate.MakeTranslation(new Vec3(-CamPos.x,
        -CamPos.y,
        -CamPos.z));

    this.View.MakeMultiply(Translate,Rotate);	
}