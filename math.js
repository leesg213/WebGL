
///////////////////////////////////
// AABBSphereBound
///////////////////////////////////

function AABBSphereBound()
{
	this.center = new Vec3();
	this.extent = new Vec3();
	this.sphere_radius = 0;
	this.valid = false;
}

///////////////////////////////////
// Plane
///////////////////////////////////

function Plane(x,y,z,w)
{
	if(x == undefined)
	{
		this.v = new Vec4(0,0,0,0);	
	}
	else
	{
		this.v = new Vec4(x,y,z,w);
	}
	
}
Plane.prototype.SetPointNormal = function(point, normal)
{
	this.v.Set2(normal.x,normal.y,normal.z,-(point.x*normal.x+point.y*normal.y+point.z*normal.z));
}
Plane.prototype.DistanceToVec3 = function(v)
{
	return v.x*this.v.x+v.y*this.v.y+v.z*this.v.z+this.v.w;
}
Plane.prototype.DistanceToVec4 = function(v)
{
	return v.x*this.v.x+v.y*this.v.y+v.z*this.v.z+v.w*this.v.w;
}

Plane.prototype.Intersection = function(ray)
{
	var t = -1;
	var pN = new Vec3(this.v.x, this.v.y, this.v.z);

	var d = ray.Direction.Dot(pN);
	if(d == 0)
	{
		return -1;
	}

	t = -(ray.Origin.Dot(pN)+this.v.w)/d;
	return t;
}

///////////////////////////////////
// Frustum
///////////////////////////////////

function Frustum()
{
	this.Front = 0;
	this.Back = 0;
	this.Width = 0;
	this.Height = 0;
	this.FOV = 0;
	this.Ratio = 0;
	this.Ortho = false;
}

Frustum.prototype.CreateProjection = function()
{
	var matrix = new Matrix4();
	matrix.MakeIdentity();

	if(this.Ortho)
	{
		matrix.m[0*4+0] = 1/this.Width *2;
		matrix.m[1*4+1] = 1/this.Height*2;
		matrix.m[2*4+2] = 1/(this.Back - this.Front);
		matrix.m[3*4+2] = -this.Front /(this.Back - this.Front);
	}
	else
	{
		var rx = Math.tan(this.FOV * 0.5);
		var ry = rx * this.Ratio;

		matrix.m[0*4+0] = 1/ rx;
		matrix.m[1*4+1] = 1/ry;
		matrix.m[2*4+2] = this.Back / (this.Back - this.Front);
		matrix.m[3*4+2] = -(this.Back*this.Front)/(this.Back - this.Front);
		matrix.m[2*4+3] = 1;
		matrix.m[3*4+3] = 0;
	}

	return matrix;
}

///////////////////////////////////
// FrustumPlane
///////////////////////////////////

var FrustumPlaneID =
{
	Front : 0,
	Back : 1,
	Left : 2,
	Right : 3,
	Top : 4,
	Bottom : 5,
	Max : 6
}

function FrustumPlane()
{
	this.Planes = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];

}
FrustumPlane.prototype.SetFrustum = function(camera_tr, frustum)
{

	var CamRight = new Vec3(camera_tr.m[0*4+0],camera_tr.m[1*4+0],camera_tr.m[2*4+0]);
    var CamUp = new Vec3(camera_tr.m[0*4+1],camera_tr.m[1*4+1],camera_tr.m[2*4+1]);
    var CamDirection = new Vec3(camera_tr.m[0*4+2],camera_tr.m[1*4+2],camera_tr.m[2*4+2]);
    var CamPos = new Vec3(camera_tr.m[3*4+0],camera_tr.m[3*4+1],camera_tr.m[3*4+2]);

    CamRight.MakeNormalize();
    CamUp.MakeNormalize();
    CamDirection.MakeNormalize();

    if(frustum.Ortho)
    {

        this.Planes[FrustumPlaneID.Front].SetPointNormal(CamDirection.ScaleAdd(CamPos,frustum.Front),CamDirection);
        this.Planes[FrustumPlaneID.Back].SetPointNormal(CamDirection.ScaleAdd(CamPos,frustum.Back),-CamDirection);
        this.Planes[FrustumPlaneID.Left].SetPointNormal(CamRight.ScaleAdd(CamPos,-frustum.Width/2.0),CamRight);
        this.Planes[FrustumPlaneID.Right].SetPointNormal(CamRight.ScaleAdd(CamPos,frustum.Width/2.0),-CamRight);
        this.Planes[FrustumPlaneID.Top].SetPointNormal(CamUp.ScaleAdd(CamPos,frustum.Height/2.0),-CamUp);
        this.Planes[FrustumPlaneID.Bottom].SetPointNormal(CamUp.ScaleAdd(CamPos,-frustum.Height/2.0),CamUp);
    }
    else
    {
        this.Planes[FrustumPlaneID.Front].SetPointNormal(CamDirection.ScaleAdd(CamPos,frustum.Front),CamDirection);
        this.Planes[FrustumPlaneID.Back].SetPointNormal(CamDirection.ScaleAdd(CamPos,frustum.Back),-CamDirection);

        var tangent = Math.tan(frustum.FOV*0.5);

        var RightPlaneNormal = CamRight.ScaleAdd(CamDirection,tangent);
        RightPlaneNormal.MakeNormalize();
        RightPlaneNormal.MakeCross(CamUp);
        RightPlaneNormal.MakeNormalize();

        var LeftPlaneNormal = CamRight.ScaleAdd(CamDirection,-tangent);
        LeftPlaneNormal.MakeNormalize();
        LeftPlaneNormal.MakeCross(CamUp.Scale(-1));
        LeftPlaneNormal.MakeNormalize();

        this.Planes[FrustumPlaneID.Left].SetPointNormal(CamPos,LeftPlaneNormal);
        this.Planes[FrustumPlaneID.Right].SetPointNormal(CamPos,RightPlaneNormal);

        tangent = tangent * frustum.Ratio;

        var TopPlaneNormal = CamUp.ScaleAdd(CamDirection ,tangent);
        TopPlaneNormal.MakeNormalize();
        TopPlaneNormal.MakeCross(CamRight.Scale(-1));
        TopPlaneNormal.MakeNormalize();

        var BotPlaneNormal = CamUp.ScaleAdd(CamDirection, -tangent);
        BotPlaneNormal.MakeNormalize();
        BotPlaneNormal.MakeCross(CamRight);
        BotPlaneNormal.MakeNormalize();

        this.Planes[FrustumPlaneID.Top].SetPointNormal(CamPos,TopPlaneNormal);
        this.Planes[FrustumPlaneID.Bottom].SetPointNormal(CamPos,BotPlaneNormal);
    }	
}

