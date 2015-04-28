var gNavCamera;

function NavCamera()
{
	this.camera = new Camera();
	this.CamVerticalRotation = 0;
	this.CamHoriRotation = 0;
	this.LMouseDown = false;
	this.LMouseDownPos = new Vec2(0,0);
	this.LMouseDownCamVerticalRotation = 0;
	this.LMouseDownCamHoriRotation = 0;
	
	this.RMouseDown = false;
	this.RMouseDownPos = new Vec2(0,0);
	this.RMouseDownCamDistance = 100;
	this.CamDistance = 100;

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mousedown', this.onMouseDown, true);
    document.addEventListener('mouseup', this.onMouseUp, false);
    
    gNavCamera = this;

}

NavCamera.prototype.onMouseMove = function(event)
{
	if(gNavCamera.LMouseDown)
	{
		var dPosX = event.clientX - gNavCamera.LMouseDownPos.x;
		var dPosY = event.clientY - gNavCamera.LMouseDownPos.y;


		gNavCamera.CamVerticalRotation = gNavCamera.LMouseDownCamVerticalRotation - dPosX/100.0;
		gNavCamera.CamHoriRotation = gNavCamera.LMouseDownCamHoriRotation - dPosY/100.0;

		var max_horizontal_rotation = 80;
		if(gNavCamera.CamHoriRotation> max_horizontal_rotation*3.141592/180.0)
		{
			gNavCamera.CamHoriRotation = max_horizontal_rotation*3.141592/180.0;
		}
		if(gNavCamera.CamHoriRotation< -max_horizontal_rotation*3.141592/180.0)
		{
			gNavCamera.CamHoriRotation = -max_horizontal_rotation*3.141592/180.0;
		}
	}

	if(gNavCamera.RMouseDown)
	{
		var dPosY = event.clientY - gNavCamera.RMouseDownPos.y;

		gNavCamera.CamDistance = gNavCamera.RMouseDownCamDistance + dPosY;
		if(gNavCamera.CamDistance<5)
		{
			gNavCamera.CamDistance = 5;
		}
	}


}

NavCamera.prototype.onMouseDown = function(event)
{
	if(event.button == 0)
	{
		gNavCamera.LMouseDown = true;
		gNavCamera.LMouseDownPos.Set2(event.clientX, event.clientY);
		gNavCamera.LMouseDownCamVerticalRotation = gNavCamera.CamVerticalRotation;
		gNavCamera.LMouseDownCamHoriRotation = gNavCamera.CamHoriRotation;
	}

	if(event.button == 2)
	{
		gNavCamera.RMouseDown = true;
		gNavCamera.RMouseDownPos.Set2(event.clientX, event.clientY);
		gNavCamera.RMouseDownCamDistance = gNavCamera.CamDistance;
	}

	return false;

}

NavCamera.prototype.onMouseUp = function(event)
{
	if(event.button == 0)
	{
		gNavCamera.LMouseDown = false;
	}
	if(event.button == 2)
	{
		gNavCamera.RMouseDown = false;
	}
}

NavCamera.prototype.Update = function()
{
	var q_hori = CreateQuaternionFromAngleAxis(new Vec3(1,0,0), this.CamHoriRotation);
	var q_vert = CreateQuaternionFromAngleAxis(new Vec3(0,1,0), this.CamVerticalRotation);

	var q_rot = q_hori.Multiply(q_vert);

	var forward_vector = q_rot.Rotate(new Vec3(0,0,1));

	this.camera.SetLookAt(forward_vector.Scale(-this.CamDistance), new Vec3(0,0,0), new Vec3(0,1,0));
	this.camera.Update();
}

