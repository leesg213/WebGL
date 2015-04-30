///////////////////////////////////////////////////
// Vec2
///////////////////////////////////////////////////


function Vec2(x,y) {

    if(x == undefined)
    {
        this.x = 0;
        this.y = 0;
    }
    else
    {
        this.x = x;
        this.y = y;
    }

}

Vec2.prototype.Set = function (v) 
{
    this.x = v.x;
    this.y = v.y;
}

Vec2.prototype.Set2 = function (x,y) 
{
    this.x = x;
    this.y = y;
}


Vec2.prototype.Add = function (v) {
    var v_new = new Vec2();

    v_new.x = this.x + v.x;
    v_new.y = this.y + v.y;

    return v_new;
}


Vec2.prototype.Sub = function (v) {
    var v_new = new Vec2();

    v_new.x = this.x - v.x;
    v_new.y = this.y - v.y;

    return v_new;
}


Vec2.prototype.PushToFloatArray = function(float_array, location)
{

    float_array[location++] = this.x;
    float_array[location++] = this.y;

    return location;

}

///////////////////////////////////////////////////
// Vec3
///////////////////////////////////////////////////


function Vec3(x,y,z) {

    if(x == undefined)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    else
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

function Vec3CreateFromVec3(v)
{
    return new Vec3(v.x,v.y,v.z)
}

Vec3.prototype.Set = function (v) 
{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
}

Vec3.prototype.Set2 = function (x,y,z) 
{
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.Add = function (v) {
    var v_new = new Vec3();

    v_new.x = this.x + v.x;
    v_new.y = this.y + v.y;
    v_new.z = this.z + v.z;

    return v_new;
}


Vec3.prototype.Sub = function (v) {
    var v_new = new Vec3();

    v_new.x = this.x - v.x;
    v_new.y = this.y - v.y;
    v_new.z = this.z - v.z;

    return v_new;
}

Vec3.prototype.Cross = function(v)
{
    return new Vec3(this.y*v.z-this.z*v.y,this.z*v.x-this.x*v.z,this.x*v.y-this.y*v.x)
}

Vec3.prototype.Dot = function(v)
{
    return this.x*v.x+this.y*v.y+this.z*v.z;
}

Vec3.prototype.LengthSqr = function()
{
    return this.x*this.x+this.y*this.y+this.z*this.z;
}

Vec3.prototype.Length = function()
{
    return Math.sqrt(this.LengthSqr())
}
Vec3.prototype.MakeNormalize = function()
{
    var length = this.Length();

    this.x /= length;
    this.y /= length;
    this.z /= length;
}
Vec3.prototype.MakeCross = function(v)
{
    var v_new = this.Cross(v);
    this.Set(v_new);
}
Vec3.prototype.Scale = function(s)
{
    return new Vec3(this.x*s,this.y*s,this.z*s);   
}

Vec3.prototype.GetNormalized = function()
{
    var v_new = new Vec3();
    v_new.Set(this);
    v_new.MakeNormalize();
    return v_new;
}
Vec3.prototype.ScaleAdd = function(vAdd, scale)
{
    var v_new = this.Scale(scale);
    v_new.Add(vAdd);
    return v_new;
}
Vec3.prototype.PushToFloatArray = function(float_array, location)
{

    float_array[location++] = this.x;
    float_array[location++] = this.y;
    float_array[location++] = this.z;

    return location;

}


///////////////////////////////////////////////////
// Vec4
///////////////////////////////////////////////////


function Vec4(x,y,z,w) {

    if(x == undefined)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
    else
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

}

Vec4.prototype.Set = function (v) 
{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
}

Vec4.prototype.Set2 = function (x,y,z,w) 
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vec4.prototype.Add = function (v) {
    var v_new = new Vec4();

    v_new.x = this.x + v.x;
    v_new.y = this.y + v.y;
    v_new.z = this.z + v.z;
    v_new.w = this.w + v.w;

    return v_new;
}


Vec4.prototype.Sub = function (v) {
    var v_new = new Vec4();

    v_new.x = this.x - v.x;
    v_new.y = this.y - v.y;
    v_new.z = this.z - v.z;
    v_new.w = this.w - v.w;

    return v_new;
}

Vec4.prototype.LengthSqr = function()
{
    return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w;
}

Vec4.prototype.Length = function()
{
    return Math.sqrt(this.LengthSqr())
}

Vec4.prototype.PushToFloatArray = function(float_array, location)
{

    float_array[location++] = this.x;
    float_array[location++] = this.y;
    float_array[location++] = this.z;
    float_array[location++] = this.w;

    return location;

}

/////////////////////////////////////////
// Matrix3
/////////////////////////////////////////

function Matrix3()
{
    this.m = new Float32Array(9);
}

Matrix3.prototype.SetRows = function(r0, r1, r2)
{
    var location = 0;
    location = r0.PushToFloatArray(this.m, location);
    location = r1.PushToFloatArray(this.m, location);
    location = r2.PushToFloatArray(this.m, location);
}

Matrix3.prototype.SetCols = function(c0, c1, c2)
{
    this.m[0*3+0] = c0.x;
    this.m[1*3+0] = c0.y;
    this.m[2*3+0] = c0.z;
    
    this.m[0*3+1] = c1.x;
    this.m[1*3+1] = c1.y;
    this.m[2*3+1] = c1.z;
    
    this.m[0*3+2] = c2.x;
    this.m[1*3+2] = c2.y;
    this.m[2*3+2] = c2.z;
}
Matrix3.prototype.MakeInverse = function()
{
    var t4 = this.m[0*3+0]*this.m[1*3+1];
    var t6 = this.m[0*3+0]*this.m[1*3+2];
    var t8 = this.m[0*3+1]*this.m[1*3+0];
    var t10 = this.m[0*3+2]*this.m[1*3+0];
    var t12 = this.m[0*3+1]*this.m[2*3+0];
    var t14 = this.m[0*3+2]*this.m[2*3+0];

    var t16 = t4*this.m[2*3+2]-t6*this.m[2*3+1]- t8*this.m[2*3+2] + t10*this.m[2*3+1]+t12*this.m[1*3+2]-t14*this.m[1*3+1];

    if (t16 == 0) return;
    var t17 = 1.0/t16;

    this.m[0*3+0] = (this.m[1*3+1]*this.m[2*3+2]-this.m[1*3+2]*this.m[2*3+1])*t17;
    this.m[0*3+1] = -(this.m[0*3+1]*this.m[2*3+2]-this.m[0*3+2]*this.m[2*3+1])*t17;
    this.m[0*3+2] = (this.m[0*3+1]*this.m[1*3+2]-this.m[0*3+2]*this.m[1*3+1])*t17;
    this.m[1*3+0] = -(this.m[1*3+0]*this.m[2*3+2]-this.m[1*3+2]*this.m[2*3+0])*t17;
    this.m[1*3+1] = (this.m[0*3+0]*this.m[2*3+2]-t14)*t17;
    this.m[1*3+2] = -(t6-t10)*t17;
    this.m[2*3+0] = (this.m[1*3+0]*this.m[2*3+1]-this.m[1*3+1]*this.m[2*3+0])*t17;
    this.m[2*3+1] = -(this.m[0*3+0]*this.m[2*3+1]-t12)*t17;
    this.m[2*3+2] = (t4-t8)*t17;
}
Matrix3.prototype.MakeTranspose  = function()
{
    var new_array = new Float32Array(9);
    new_array[0*3+0] = this.m[0*3+0];
    new_array[0*3+1] = this.m[1*3+0];
    new_array[0*3+2] = this.m[2*3+0];
    new_array[1*3+0] = this.m[0*3+1];
    new_array[1*3+1] = this.m[1*3+1];
    new_array[1*3+2] = this.m[2*3+1];
    new_array[2*3+0] = this.m[0*3+2];
    new_array[2*3+1] = this.m[1*3+2];
    new_array[2*3+2] = this.m[2*3+2];

    this.m = new_array;

}
Matrix3.prototype.MakeIdentity = function()
{
    this.m[0*3+0] = 1;
    this.m[0*3+1] = 0;
    this.m[0*3+2] = 0;
    this.m[1*3+0] = 0;
    this.m[1*3+1] = 1;
    this.m[1*3+2] = 0;
    this.m[2*3+0] = 0;
    this.m[2*3+1] = 0;
    this.m[2*3+2] = 1;

}

Matrix3.prototype.MakeRotationXAxis = function(radian)
{
    this.m[0*3+0] = 1;
    this.m[0*3+1] = 0;
    this.m[0*3+2] = 0;

    this.m[1*3+0] = 0;
    this.m[1*3+1] = Math.cos(radian);
    this.m[1*3+2] = Math.sin(radian);

    this.m[2*3+0] = 0;
    this.m[2*3+1] = -Math.sin(radian);
    this.m[2*3+2] = Math.cos(radian);
}
Matrix3.prototype.MakeRotationYAxis = function(radian)
{
    this.m[0*3+0] = Math.cos(radian);
    this.m[0*3+1] = 0;
    this.m[0*3+2] = -Math.sin(radian);

    this.m[1*3+0] = 0;
    this.m[1*3+1] = 1;
    this.m[1*3+2] = 0;

    this.m[2*3+0] = Math.sin(radian);
    this.m[2*3+1] = 0;
    this.m[2*3+2] = Math.cos(radian);
}
Matrix3.prototype.MakeRotationZAxis = function(radian)
{
    this.m[0*3+0] = Math.cos(radian);
    this.m[0*3+1] = Math.sin(radian);
    this.m[0*3+2] = 0;

    this.m[1*3+0] = -Math.sin(radian);
    this.m[1*3+1] = Math.cos(radian);
    this.m[1*3+2] = 0;

    this.m[2*3+0] = 0;
    this.m[2*3+1] = 0;
    this.m[2*3+2] = 1;
}

Matrix3.prototype.Transform = function(v)
{
    return new Vec3(v.x*this.m[0*3+0]+v.y*this.m[1*3+0]+v.z*this.m[2*3+0],
            v.x*this.m[0*3+1]+v.y*this.m[1*3+1]+v.z*this.m[2*3+1],
        v.x*this.m[0*3+2]+v.y*this.m[1*3+2]+v.z*this.m[2*3+2])
}

Matrix3.prototype.MakeMultiply = function(m1, m2)
{
    var target = this.m;
    var temp_buffer = null;

    if(m1 == this || m2 == this)
    {
        temp_buffer = new Float32Array(9);
        target = temp_buffer;
    }

    target[0*3+0] = m1.m[0*3+0]*m2.m[0*3+0] +m1.m[0*3+1]*m2.m[1*3+0] +m1.m[0*3+2]*m2.m[2*3+0];
    target[0*3+1] = m1.m[0*3+0]*m2.m[0*3+1] +m1.m[0*3+1]*m2.m[1*3+1] +m1.m[0*3+2]*m2.m[2*3+1];
    target[0*3+2] = m1.m[0*3+0]*m2.m[0*3+2] +m1.m[0*3+1]*m2.m[1*3+2] +m1.m[0*3+2]*m2.m[2*3+2];

    target[1*3+0] = m1.m[1*3+0]*m2.m[0*3+0] +m1.m[1*3+1]*m2.m[1*3+0] +m1.m[1*3+2]*m2.m[2*3+0];
    target[1*3+1] = m1.m[1*3+0]*m2.m[0*3+1] +m1.m[1*3+1]*m2.m[1*3+1] +m1.m[1*3+2]*m2.m[2*3+1];
    target[1*3+2] = m1.m[1*3+0]*m2.m[0*3+2] +m1.m[1*3+1]*m2.m[1*3+2] +m1.m[1*3+2]*m2.m[2*3+2];

    target[2*3+0] = m1.m[2*3+0]*m2.m[0*3+0] +m1.m[2*3+1]*m2.m[1*3+0] +m1.m[2*3+2]*m2.m[2*3+0];
    target[2*3+1] = m1.m[2*3+0]*m2.m[0*3+1] +m1.m[2*3+1]*m2.m[1*3+1] +m1.m[2*3+2]*m2.m[2*3+1];
    target[2*3+2] = m1.m[2*3+0]*m2.m[0*3+2] +m1.m[2*3+1]*m2.m[1*3+2] +m1.m[2*3+2]*m2.m[2*3+2];

    this.m = target;
}


/////////////////////////////////////////
// Matrix4
/////////////////////////////////////////

function Matrix4(r0, r1, r2, r3)
{
    this.m = new Float32Array(16);

    if (r0 != undefined)
    {
        this.SetRows(r0, r1, r2, r3);
    }
}

Matrix4.prototype.Set = function(m)
{
    this.m.set(m.m);
}

Matrix4.prototype.SetRows = function(r0, r1, r2, r3)
{
    var location = 0;
    location = r0.PushToFloatArray(this.m, location);
    location = r1.PushToFloatArray(this.m, location);
    location = r2.PushToFloatArray(this.m, location);
    location = r3.PushToFloatArray(this.m, location);
}

Matrix4.prototype.SetCols = function(c0, c1, c2, c3)
{
    this.m[0*4+0] = c0.x;
    this.m[1*4+0] = c0.y;
    this.m[2*4+0] = c0.z;
    this.m[3*4+0] = c0.w;
    
    this.m[0*4+1] = c1.x;
    this.m[1*4+1] = c1.y;
    this.m[2*4+1] = c1.z;
    this.m[3*4+1] = c1.w;
    
    this.m[0*4+2] = c2.x;
    this.m[1*4+2] = c2.y;
    this.m[2*4+2] = c2.z;
    this.m[3*4+2] = c2.w;

    this.m[0*4+3] = c3.x;
    this.m[1*4+3] = c3.y;
    this.m[2*4+3] = c3.z;
    this.m[3*4+3] = c3.w;

}

Matrix4.prototype.MakeIdentity = function()
{
    this.m[0*4+0] = 1;
    this.m[0*4+1] = 0;
    this.m[0*4+2] = 0;
    this.m[0*4+3] = 0;
    
    this.m[1*4+0] = 0;
    this.m[1*4+1] = 1;
    this.m[1*4+2] = 0;
    this.m[1*4+3] = 0;

    this.m[2*4+0] = 0;
    this.m[2*4+1] = 0;
    this.m[2*4+2] = 1;
    this.m[2*4+3] = 0;

    this.m[3*4+0] = 0;
    this.m[3*4+1] = 0;
    this.m[3*4+2] = 0;
    this.m[3*4+3] = 1;

}

Matrix4.prototype.MakeTranspose  = function()
{
    var new_array = new Float32Array(16);
    new_array[0*4+0] = this.m[0*4+0];
    new_array[0*4+1] = this.m[1*4+0];
    new_array[0*4+2] = this.m[2*4+0];
    new_array[0*4+3] = this.m[3*4+0];

    new_array[1*4+0] = this.m[0*4+1];
    new_array[1*4+1] = this.m[1*4+1];
    new_array[1*4+2] = this.m[2*4+1];
    new_array[1*4+3] = this.m[3*4+1];
    
    new_array[2*4+0] = this.m[0*4+2];
    new_array[2*4+1] = this.m[1*4+2];
    new_array[2*4+2] = this.m[2*4+2];
    new_array[2*4+3] = this.m[3*4+2];

    new_array[3*4+0] = this.m[0*4+3];
    new_array[3*4+1] = this.m[1*4+3];
    new_array[3*4+2] = this.m[2*4+3];
    new_array[3*4+3] = this.m[3*4+3];

    this.m = new_array;

}

Matrix4.prototype.MakeTranslation = function(t)
{
    this.MakeIdentity();
    this.m[3*4+0] = t.x;
    this.m[3*4+1] = t.y;
    this.m[3*4+2] = t.z;
}

Matrix4.prototype.Transform = function(v)
{
    return new Vec4(v.x*this.m[0*4+0]+v.y*this.m[1*4+0]+v.z*this.m[2*4+0]+v.w*this.m[3*4+0],
            v.x*this.m[0*4+1]+v.y*this.m[1*4+1]+v.z*this.m[2*4+1]+v.w*this.m[3*4+1],
        v.x*this.m[0*4+2]+v.y*this.m[1*4+2]+v.z*this.m[2*4+2]+v.w*this.m[3*4+2],
        v.x*this.m[0*4+3]+v.y*this.m[1*4+3]+v.z*this.m[2*4+3]+v.w*this.m[3*4+3]);
}
Matrix4.prototype.MakeInverse = function()
{

    var inversed = new Matrix4();
    inversed.Set(this);
    this.Set(inversed.Inverse());

}
Matrix4.prototype.Inverse = function()
{
    var s0  = this.m[0*4+0] * this.m[1*4+1] - this.m[1*4+0] * this.m[0*4+1];
    var s1  = this.m[0*4+0] * this.m[1*4+2] - this.m[1*4+0] * this.m[0*4+2];
    var s2  = this.m[0*4+0] * this.m[1*4+3] - this.m[1*4+0] * this.m[0*4+3];
    var s3  = this.m[0*4+1] * this.m[1*4+2] - this.m[1*4+1] * this.m[0*4+2];
    var s4  = this.m[0*4+1] * this.m[1*4+3] - this.m[1*4+1] * this.m[0*4+3];
    var s5  = this.m[0*4+2] * this.m[1*4+3] - this.m[1*4+2] * this.m[0*4+3];

    var c5  = this.m[2*4+2] * this.m[3*4+3] - this.m[3*4+2] * this.m[2*4+3];
    var c4  = this.m[2*4+1] * this.m[3*4+3] - this.m[3*4+1] * this.m[2*4+3];
    var c3  = this.m[2*4+1] * this.m[3*4+2] - this.m[3*4+1] * this.m[2*4+2];
    var c2  = this.m[2*4+0] * this.m[3*4+3] - this.m[3*4+0] * this.m[2*4+3];
    var c1  = this.m[2*4+0] * this.m[3*4+2] - this.m[3*4+0] * this.m[2*4+2];
    var c0  = this.m[2*4+0] * this.m[3*4+1] - this.m[3*4+0] * this.m[2*4+1];

    // Should check for 0 determinant

    var invdet = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

    var inv_m = new Matrix4();

    inv_m.m[0*4+0] = (this.m[1*4+1] * c5 - this.m[1*4+2] * c4 + this.m[1*4+3] * c3) * invdet;
    inv_m.m[0*4+1] = (-this.m[0*4+1] * c5 + this.m[0*4+2] * c4 - this.m[0*4+3] * c3) * invdet;
    inv_m.m[0*4+2] = (this.m[3*4+1] * s5 - this.m[3*4+2] * s4 + this.m[3*4+3] * s3) * invdet;
    inv_m.m[0*4+3] = (-this.m[2*4+1] * s5 + this.m[2*4+2] * s4 - this.m[2*4+3] * s3) * invdet;

    inv_m.m[1*4+0] = (-this.m[1*4+0] * c5 + this.m[1*4+2] * c2 - this.m[1*4+3] * c1) * invdet;
    inv_m.m[1*4+1] = (this.m[0*4+0] * c5 - this.m[0*4+2] * c2 + this.m[0*4+3] * c1) * invdet;
    inv_m.m[1*4+2] = (-this.m[3*4+0] * s5 + this.m[3*4+2] * s2 - this.m[3*4+3] * s1) * invdet;
    inv_m.m[1*4+3] = (this.m[2*4+0] * s5 - this.m[2*4+2] * s2 + this.m[2*4+3] * s1) * invdet;

    inv_m.m[2*4+0] = (this.m[1*4+0] * c4 - this.m[1*4+1] * c2 + this.m[1*4+3] * c0) * invdet;
    inv_m.m[2*4+1] = (-this.m[0*4+0] * c4 + this.m[0*4+1] * c2 - this.m[0*4+3] * c0) * invdet;
    inv_m.m[2*4+2] = (this.m[3*4+0] * s4 - this.m[3*4+1] * s2 + this.m[3*4+3] * s0) * invdet;
    inv_m.m[2*4+3] = (-this.m[2*4+0] * s4 + this.m[2*4+1] * s2 - this.m[2*4+3] * s0) * invdet;

    inv_m.m[3*4+0] = (-this.m[1*4+0] * c3 + this.m[1*4+1] * c1 - this.m[1*4+2] * c0) * invdet;
    inv_m.m[3*4+1] = (this.m[0*4+0] * c3 - this.m[0*4+1] * c1 + this.m[0*4+2] * c0) * invdet;
    inv_m.m[3*4+2] = (-this.m[3*4+0] * s3 + this.m[3*4+1] * s1 - this.m[3*4+2] * s0) * invdet;
    inv_m.m[3*4+3] = (this.m[2*4+0] * s3 - this.m[2*4+1] * s1 + this.m[2*4+2] * s0) * invdet;

    return inv_m;
}

Matrix4.prototype.TransformVec3 = function(v)
{
    var v_temp = new Vec4(v.x,v.y,v.z,1);
    v_temp = this.Transform(v_temp);
    return new Vec3(v_temp.x/v_temp.w,v_temp.y/v_temp.w,v_temp.z/v_temp.w)
}

Matrix4.prototype.TransformDirection = function(v)
{
    var v_temp = new Vec4(v.x,v.y,v.z,0);
    v_temp = this.Transform(v_temp);
    return new Vec3(v_temp.x,v_temp.y,v_temp.z)
}
Matrix4.prototype.MakeMultiply = function(m1, m2)
{
    var target = this.m;
    var temp_buffer = null;

    if(m1 == this || m2 == this)
    {
        temp_buffer = new Float32Array(16);
        target = temp_buffer;
    }

    if(m1 == undefined ||
        m2 == undefined)
    {
        var pp =0;
        pp = 1;
    }

    target[0*4+0] = m1.m[0*4+0]*m2.m[0*4+0] +m1.m[0*4+1]*m2.m[1*4+0] +m1.m[0*4+2]*m2.m[2*4+0] +m1.m[0*4+3]*m2.m[3*4+0];
    target[0*4+1] = m1.m[0*4+0]*m2.m[0*4+1] +m1.m[0*4+1]*m2.m[1*4+1] +m1.m[0*4+2]*m2.m[2*4+1] +m1.m[0*4+3]*m2.m[3*4+1];
    target[0*4+2] = m1.m[0*4+0]*m2.m[0*4+2] +m1.m[0*4+1]*m2.m[1*4+2] +m1.m[0*4+2]*m2.m[2*4+2] +m1.m[0*4+3]*m2.m[3*4+2];
    target[0*4+3] = m1.m[0*4+0]*m2.m[0*4+3] +m1.m[0*4+1]*m2.m[1*4+3] +m1.m[0*4+2]*m2.m[2*4+3] +m1.m[0*4+3]*m2.m[3*4+3];

    target[1*4+0] = m1.m[1*4+0]*m2.m[0*4+0] +m1.m[1*4+1]*m2.m[1*4+0] +m1.m[1*4+2]*m2.m[2*4+0] +m1.m[1*4+3]*m2.m[3*4+0];
    target[1*4+1] = m1.m[1*4+0]*m2.m[0*4+1] +m1.m[1*4+1]*m2.m[1*4+1] +m1.m[1*4+2]*m2.m[2*4+1] +m1.m[1*4+3]*m2.m[3*4+1];
    target[1*4+2] = m1.m[1*4+0]*m2.m[0*4+2] +m1.m[1*4+1]*m2.m[1*4+2] +m1.m[1*4+2]*m2.m[2*4+2] +m1.m[1*4+3]*m2.m[3*4+2];
    target[1*4+3] = m1.m[1*4+0]*m2.m[0*4+3] +m1.m[1*4+1]*m2.m[1*4+3] +m1.m[1*4+2]*m2.m[2*4+3] +m1.m[1*4+3]*m2.m[3*4+3];

    target[2*4+0] = m1.m[2*4+0]*m2.m[0*4+0] +m1.m[2*4+1]*m2.m[1*4+0] +m1.m[2*4+2]*m2.m[2*4+0] +m1.m[2*4+3]*m2.m[3*4+0];
    target[2*4+1] = m1.m[2*4+0]*m2.m[0*4+1] +m1.m[2*4+1]*m2.m[1*4+1] +m1.m[2*4+2]*m2.m[2*4+1] +m1.m[2*4+3]*m2.m[3*4+1];
    target[2*4+2] = m1.m[2*4+0]*m2.m[0*4+2] +m1.m[2*4+1]*m2.m[1*4+2] +m1.m[2*4+2]*m2.m[2*4+2] +m1.m[2*4+3]*m2.m[3*4+2];
    target[2*4+3] = m1.m[2*4+0]*m2.m[0*4+3] +m1.m[2*4+1]*m2.m[1*4+3] +m1.m[2*4+2]*m2.m[2*4+3] +m1.m[2*4+3]*m2.m[3*4+3];

    target[3*4+0] = m1.m[3*4+0]*m2.m[0*4+0] +m1.m[3*4+1]*m2.m[1*4+0] +m1.m[3*4+2]*m2.m[2*4+0] +m1.m[3*4+3]*m2.m[3*4+0];
    target[3*4+1] = m1.m[3*4+0]*m2.m[0*4+1] +m1.m[3*4+1]*m2.m[1*4+1] +m1.m[3*4+2]*m2.m[2*4+1] +m1.m[3*4+3]*m2.m[3*4+1];
    target[3*4+2] = m1.m[3*4+0]*m2.m[0*4+2] +m1.m[3*4+1]*m2.m[1*4+2] +m1.m[3*4+2]*m2.m[2*4+2] +m1.m[3*4+3]*m2.m[3*4+2];
    target[3*4+3] = m1.m[3*4+0]*m2.m[0*4+3] +m1.m[3*4+1]*m2.m[1*4+3] +m1.m[3*4+2]*m2.m[2*4+3] +m1.m[3*4+3]*m2.m[3*4+3];

    this.m = target;
}
  



/////////////////////////////////////////
// Quaternion
/////////////////////////////////////////

function Quaternion(x,y,z,w)
{
    if(x == undefined)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
    else
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

Quaternion.prototype.FromAngleAxis = function(axis, radian)
{
    this.x = axis.x * Math.sin(radian/2);
    this.y = axis.y * Math.sin(radian/2);
    this.z = axis.z * Math.sin(radian/2);
    this.w = Math.cos(radian/2);
}

Quaternion.prototype.Multiply = function(q)
{
    return new Quaternion(this.w*q.x+this.x*q.w+this.y*q.z-this.z*q.y,
                          this.w*q.y+this.y*q.w+this.z*q.x-this.x*q.z,
                          this.w*q.z+this.z*q.w+this.x*q.y-this.y*q.x,
                          this.w*q.w-this.x*q.x-this.y*q.y-this.z*q.z);
}

Quaternion.prototype.ToMatrix = function()
{
    var matrix = new Matrix3();

    matrix.SetRows(new Vec3(1-2*this.y*this.y-2*this.z*this.z,2*this.x*this.y+2*this.w*this.z,2*this.x*this.z-2*this.w*this.y),
            new Vec3(2*this.x*this.y-2*this.w*this.z,1-2*this.x*this.x-2*this.z*this.z,2*this.y*this.z+2*this.w*this.x),
            new Vec3(2*this.x*this.z+2*this.w*this.y,2*this.y*this.z-2*this.w*this.x,1-2*this.x*this.x-2*this.y*this.y));

    return matrix;
}

Quaternion.prototype.Conjugate = function()
{
    return new Quaternion(-this.x,-this.y,-this.z, this.w);
}

Quaternion.prototype.Rotate = function(v)
{
    var conj = this.Conjugate();

    var q_v = new Quaternion(v.x,v.y,v.z,0);

    var q_mul = conj.Multiply(q_v).Multiply(this);

    return new Vec3(q_mul.x,q_mul.y,q_mul.z);
}
   

function CreateQuaternionFromAngleAxis(axis, radian)
{
    var q = new Quaternion();

    q.FromAngleAxis(axis, radian);
    return q;
}

////////////////////////////////////////////
// Transform
////////////////////////////////////////////

function Transform()
{
    this.Transform = new Matrix4();
    this.Rotate = new Matrix3();
    this.Scale = new Vec3(1,1,1);
    this.Translate = new Vec3();

    this.Rotate.MakeIdentity();
    this.Transform.MakeIdentity();

}
Transform.prototype.Update = function()
{
    var scale = new Matrix4(new Vec4(this.Scale.x,0,0,0),
                            new Vec4(0,this.Scale.y,0,0),
                            new Vec4(0,0,this.Scale.z,0),
                            new Vec4(0,0,0,1));
    
    var rot = new Matrix4(new Vec4(this.Rotate.m[0],this.Rotate.m[1],this.Rotate.m[2],0),
                        new Vec4(this.Rotate.m[3],this.Rotate.m[4],this.Rotate.m[5],0),
                        new Vec4(this.Rotate.m[6],this.Rotate.m[7],this.Rotate.m[8],0),
                        new Vec4(0,0,0,1));

    var tr = new Matrix4();
    tr.MakeTranslation(this.Translate);

    var m = new Matrix4();
    m.MakeMultiply(scale, rot);
    this.Transform.MakeMultiply(m, tr);
}



/////////////////////////////////////////
// Ray
/////////////////////////////////////////

function Ray()
{
    this.Origin = new Vec3();
    this.Direction = new Vec3();
    this.Length = 0;
}