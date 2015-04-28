
///////////////////////////////////////
// Light
///////////////////////////////////////

function Light()
{
	SceneObject.call(this);

	this.Dimmer = 1;
	this.DiffuseColor = new Vec3(1,1,1);
	this.SpecularColor = new Vec3(1,1,1);
	this.Radius = 1;
	this.EnableShadow = false;
	this.ShadowMapRes = new Vec3(1024,1024);
	this.ShadowMap = null;
}

Light.prototype = new SceneObject();

Light.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.Light)
	{
		return true;
	}

	return SceneObject.prototype.IsTypeOf.call(this,type);
}

Light.prototype.GetType = function()
{
	return SceneObjectType.Light;
}


///////////////////////////////////////
// AmbientLight
///////////////////////////////////////

function AmbientLight()
{
	Light.call(this);
}

AmbientLight.prototype = new Light();

AmbientLight.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.AmbientLight)
	{
		return true;
	}

	return Light.prototype.IsTypeOf.call(this,type);
}

AmbientLight.prototype.GetType = function()
{
	return SceneObjectType.AmbientLight;
}


///////////////////////////////////////
// DirectionalLight
///////////////////////////////////////

function DirectionalLight()
{
	Light.call(this);
}

DirectionalLight.prototype = new Light();

DirectionalLight.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.DirectionalLight)
	{
		return true;
	}

	return Light.prototype.IsTypeOf.call(this,type);
}

DirectionalLight.prototype.GetType = function()
{
	return SceneObjectType.DirectionalLight;
}

DirectionalLight.prototype.CreateShadowMap = function()
{
	
	this.ShadowMap = new ShadowMap();
	this.ShadowMap.Init();
	
}


///////////////////////////////////////
// PointLight
///////////////////////////////////////

function PointLight()
{
	Light.call(this);
	this.FallOffFactor = 1;
}

PointLight.prototype = new Light();

PointLight.prototype.IsTypeOf = function(type)
{
	if(type == SceneObjectType.PointLight)
	{
		return true;
	}

	return Light.prototype.IsTypeOf.call(this,type);
}

PointLight.prototype.GetType = function()
{
	return SceneObjectType.PointLight;
}


