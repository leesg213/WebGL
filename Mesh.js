var VertexDataElementType = 
{
    Invalid : 0,
    Position : 1,
    Normal : 2,
    Binormal : 3,
    Tangent : 4,
    Diffuse : 5,
    Texture : 6
}

var VertexDataElementDataType =
{
    Float2 : 0,
    Float3 : 1,
    Float4 : 2,
    Color : 3,
    Int4 : 4
}

//////////////////////////////////////
// VertexDataElement
//////////////////////////////////////

function VertexDataElement()
{
    this.type = VertexDataElementType.Invalid;
    this.data_type = 0;
    this.index = 0;
    this.offset = 0;
}




//////////////////////////////////////
// VertexData
//////////////////////////////////////

function VertexData()
{
    this.data_buffer = null;
    this.vertex_data_element_cont = new Array();
    this.stride = 0;
}

VertexData.prototype.AddVertexDataElement = function(type, data_type)
{
    new_element = new VertexDataElement();

    new_element.type = type;
    new_element.data_type = data_type;
    new_element.offset = this.stride;

    float_size = 4;

    if (data_type == VertexDataElementDataType.Float2)
    {
        this.stride += 2*float_size;
    }
    else if(data_type == VertexDataElementDataType.Float3)
    {
        this.stride += 3*float_size;
    }
    else if(data_type == VertexDataElementDataType.Float4)
    {
        this.stride += 4*float_size;
    }

    this.vertex_data_element_cont.push(new_element);
}
VertexData.prototype.SetDataBuffer = function(float32_array) {
    
    this.data_buffer = float32_array;

};


//////////////////////////////////////
// Mesh
//////////////////////////////////////


function Mesh() {

    this.vertex_data = new VertexData();
    this.index_data = null;
    this.radius = 0;

    this.element_array_object = -1;
    this.vertex_buffer_object = -1;
};

Mesh.prototype.ReleaseRendererData = function() {
    
    if(this.vertex_buffer_object == -1)
    {
        return;
    }

    Renderer.gl.deleteBuffer(this.vertex_array_object);
    this.vertex_buffer_object = -1;    

};

Mesh.prototype.CreateRendererData = function()
{
    if (this.index_data != null)
    {
        this.element_array_object = Renderer.gl.createBuffer();
        Renderer.gl.bindBuffer(Renderer.gl.ELEMENT_ARRAY_BUFFER, this.element_array_object);
        Renderer.gl.bufferData(Renderer.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_data), Renderer.gl.STATIC_DRAW);
    }

    this.vertex_buffer_object = Renderer.gl.createBuffer();
    Renderer.gl.bindBuffer(Renderer.gl.ARRAY_BUFFER, this.vertex_buffer_object);
    Renderer.gl.bufferData(Renderer.gl.ARRAY_BUFFER, this.vertex_data.data_buffer, Renderer.gl.STATIC_DRAW);

}

Mesh.prototype.Bind = function(program_id)
{
    if (this.vertex_buffer_object == -1)
    {
        this.CreateRendererData();
    }

    Renderer.gl.bindBuffer(Renderer.gl.ARRAY_BUFFER, this.vertex_buffer_object);

    if (this.element_array_object != -1)
    {
        Renderer.gl.bindBuffer( Renderer.gl.ELEMENT_ARRAY_BUFFER, this.element_array_object);    
    }

    var num_vertex_data_elements = this.vertex_data.vertex_data_element_cont.length;
    var offset = 0;

    for(var i = 0; i<num_vertex_data_elements; ++i)
    {
        var element = this.vertex_data.vertex_data_element_cont[i];

        var attribute_name = "";

        if(element.type == VertexDataElementType.Position )
        {
            attribute_name = "vPos";
        }
        else if(element.type == VertexDataElementType.Normal )
        {
            attribute_name = "vNormal";
        }

        var num_components = 0;
        if(element.type == VertexDataElementType.Position ||
            element.type == VertexDataElementType.Normal ||
            element.type == VertexDataElementType.Binormal ||
            element.type == VertexDataElementType.Tangent ||
            element.type == VertexDataElementType.Diffuse)
        {
            num_components = 3;
        }
        else if(element.type == VertexDataElementType.Texture)
        {
            num_components = 2;
        }

        var float_size = 4;

        var stride = 0;
        if(element.data_type == VertexDataElementDataType.Float2)
        {
            stride = float_size*2;
        }
        else if(element.data_type == VertexDataElementDataType.Float3)
        {
            stride = float_size*3;
        }
        else if(element.data_type == VertexDataElementDataType.Float4)
        {
            stride = float_size*4;
        }

        var attribute_location = Renderer.gl.getAttribLocation(program_id, attribute_name);
        if ( attribute_location != -1)
        {
            Renderer.gl.enableVertexAttribArray(attribute_location);

            Renderer.gl.vertexAttribPointer(attribute_location, num_components, Renderer.gl.FLOAT, false, this.vertex_data.stride, offset);
        }
        offset += stride;
    }
}


//////////////////////////////////////
// MeshUtil
//////////////////////////////////////

var MeshUtil = {

    ComputeNormal : function(v1, v2, v3)
    {
        var v32 = v3.Sub(v2);
        var v21 = v2.Sub(v1);

        var vCross = v32.Cross(v21);

        vCross.MakeNormalize();
        return vCross;
    },

    CreateTeapot : function(n)
    {
        var TeapotIndex = [
              1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16,
              4, 17, 18, 19,  8, 20, 21, 22, 12, 23, 24, 25, 16, 26, 27, 28,
             19, 29, 30, 31, 22, 32, 33, 34, 25, 35, 36, 37, 28, 38, 39, 40,
             31, 41, 42,  1, 34, 43, 44,  5, 37, 45, 46,  9, 40, 47, 48, 13,
             13, 14, 15, 16, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
             16, 26, 27, 28, 52, 61, 62, 63, 56, 64, 65, 66, 60, 67, 68, 69,
             28, 38, 39, 40, 63, 70, 71, 72, 66, 73, 74, 75, 69, 76, 77, 78,
             40, 47, 48, 13, 72, 79, 80, 49, 75, 81, 82, 53, 78, 83, 84, 57,
             57, 58, 59, 60, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
             60, 67, 68, 69, 88, 97, 98, 99, 92,100,101,102, 96,103,104,105,
             69, 76, 77, 78, 99,106,107,108,102,109,110,111,105,112,113,114,
             78, 83, 84, 57,108,115,116, 85,111,117,118, 89,114,119,120, 93,
            121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,
            124,137,138,121,128,139,140,125,132,141,142,129,136,143,144,133,
            133,134,135,136,145,146,147,148,149,150,151,152, 69,153,154,155,
            136,143,144,133,148,156,157,145,152,158,159,149,155,160,161, 69,
            162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,
            165,178,179,162,169,180,181,166,173,182,183,170,177,184,185,174,
            174,175,176,177,186,187,188,189,190,191,192,193,194,195,196,197,
            177,184,185,174,189,198,199,186,193,200,201,190,197,202,203,194,
            204,204,204,204,207,208,209,210,211,211,211,211,212,213,214,215,
            204,204,204,204,210,217,218,219,211,211,211,211,215,220,221,222,
            204,204,204,204,219,224,225,226,211,211,211,211,222,227,228,229,
            204,204,204,204,226,230,231,207,211,211,211,211,229,232,233,212,
            212,213,214,215,234,235,236,237,238,239,240,241,242,243,244,245,
            215,220,221,222,237,246,247,248,241,249,250,251,245,252,253,254,
            222,227,228,229,248,255,256,257,251,258,259,260,254,261,262,263,
            229,232,233,212,257,264,265,234,260,266,267,238,263,268,269,242,
            270,270,270,270,279,280,281,282,275,276,277,278,271,272,273,274,
            270,270,270,270,282,289,290,291,278,286,287,288,274,283,284,285,
            270,270,270,270,291,298,299,300,288,295,296,297,285,292,293,294,
            270,270,270,270,300,305,306,279,297,303,304,275,294,301,302,271];

        var TeapotPoints = [
            new Vec3(1.4,0.0,2.4), new Vec3(1.4,-0.784,2.4), new Vec3(0.784,-1.4,2.4),
            new Vec3(0.0,-1.4,2.4), new Vec3(1.3375,0.0,2.53125),
            new Vec3(1.3375,-0.749,2.53125), new Vec3(0.749,-1.3375,2.53125),
            new Vec3(0.0,-1.3375,2.53125), new Vec3(1.4375,0.0,2.53125),
            new Vec3(1.4375,-0.805,2.53125), new Vec3(0.805,-1.4375,2.53125),
            new Vec3(0.0,-1.4375,2.53125), new Vec3(1.5,0.0,2.4), new Vec3(1.5,-0.84,2.4),
            new Vec3(0.84,-1.5,2.4), new Vec3(0.0,-1.5,2.4), new Vec3(-0.784,-1.4,2.4),
            new Vec3(-1.4,-0.784,2.4), new Vec3(-1.4,0.0,2.4),
            new Vec3(-0.749,-1.3375,2.53125), new Vec3(-1.3375,-0.749,2.53125),
            new Vec3(-1.3375,0.0,2.53125), new Vec3(-0.805,-1.4375,2.53125),
            new Vec3(-1.4375,-0.805,2.53125), new Vec3(-1.4375,0.0,2.53125),
            new Vec3(-0.84,-1.5,2.4), new Vec3(-1.5,-0.84,2.4), new Vec3(-1.5,0.0,2.4),
            new Vec3(-1.4,0.784,2.4), new Vec3(-0.784,1.4,2.4), new Vec3(0.0,1.4,2.4),
            new Vec3(-1.3375,0.749,2.53125), new Vec3(-0.749,1.3375,2.53125),
            new Vec3(0.0,1.3375,2.53125), new Vec3(-1.4375,0.805,2.53125),
            new Vec3(-0.805,1.4375,2.53125), new Vec3(0.0,1.4375,2.53125),
            new Vec3(-1.5,0.84,2.4), new Vec3(-0.84,1.5,2.4), new Vec3(0.0,1.5,2.4),
            new Vec3(0.784,1.4,2.4), new Vec3(1.4,0.784,2.4), new Vec3(0.749,1.3375,2.53125),
            new Vec3(1.3375,0.749,2.53125), new Vec3(0.805,1.4375,2.53125),
            new Vec3(1.4375,0.805,2.53125), new Vec3(0.84,1.5,2.4), new Vec3(1.5,0.84,2.4),
            new Vec3(1.75,0.0,1.875), new Vec3(1.75,-0.98,1.875), new Vec3(0.98,-1.75,1.875),
            new Vec3(0.0,-1.75,1.875), new Vec3(2.0,0.0,1.35), new Vec3(2.0,-1.12,1.35),
            new Vec3(1.12,-2.0,1.35), new Vec3(0.0,-2.0,1.35), new Vec3(2.0,0.0,0.9),
            new Vec3(2.0,-1.12,0.9), new Vec3(1.12,-2.0,0.9), new Vec3(0.0,-2.0,0.9),
            new Vec3(-0.98,-1.75,1.875), new Vec3(-1.75,-0.98,1.875),
            new Vec3(-1.75,0.0,1.875), new Vec3(-1.12,-2.0,1.35), new Vec3(-2.0,-1.12,1.35),
            new Vec3(-2.0,0.0,1.35), new Vec3(-1.12,-2.0,0.9), new Vec3(-2.0,-1.12,0.9),
            new Vec3(-2.0,0.0,0.9), new Vec3(-1.75,0.98,1.875), new Vec3(-0.98,1.75,1.875),
            new Vec3(0.0,1.75,1.875), new Vec3(-2.0,1.12,1.35), new Vec3(-1.12,2.0,1.35),
            new Vec3(0.0,2.0,1.35), new Vec3(-2.0,1.12,0.9), new Vec3(-1.12,2.0,0.9),
            new Vec3(0.0,2.0,0.9), new Vec3(0.98,1.75,1.875), new Vec3(1.75,0.98,1.875),
            new Vec3(1.12,2.0,1.35), new Vec3(2.0,1.12,1.35), new Vec3(1.12,2.0,0.9),
            new Vec3(2.0,1.12,0.9), new Vec3(2.0,0.0,0.45), new Vec3(2.0,-1.12,0.45),
            new Vec3(1.12,-2.0,0.45), new Vec3(0.0,-2.0,0.45), new Vec3(1.5,0.0,0.225),
            new Vec3(1.5,-0.84,0.225), new Vec3(0.84,-1.5,0.225), new Vec3(0.0,-1.5,0.225),
            new Vec3(1.5,0.0,0.15), new Vec3(1.5,-0.84,0.15), new Vec3(0.84,-1.5,0.15),
            new Vec3(0.0,-1.5,0.15), new Vec3(-1.12,-2.0,0.45), new Vec3(-2.0,-1.12,0.45),
            new Vec3(-2.0,0.0,0.45), new Vec3(-0.84,-1.5,0.225), new Vec3(-1.5,-0.84,0.225),
            new Vec3(-1.5,0.0,0.225), new Vec3(-0.84,-1.5,0.15), new Vec3(-1.5,-0.84,0.15),
            new Vec3(-1.5,0.0,0.15), new Vec3(-2.0,1.12,0.45), new Vec3(-1.12,2.0,0.45),
            new Vec3(0.0,2.0,0.45), new Vec3(-1.5,0.84,0.225), new Vec3(-0.84,1.5,0.225),
            new Vec3(0.0,1.5,0.225), new Vec3(-1.5,0.84,0.15), new Vec3(-0.84,1.5,0.15),
            new Vec3(0.0,1.5,0.15), new Vec3(1.12,2.0,0.45), new Vec3(2.0,1.12,0.45),
            new Vec3(0.84,1.5,0.225), new Vec3(1.5,0.84,0.225), new Vec3(0.84,1.5,0.15),
            new Vec3(1.5,0.84,0.15), new Vec3(-1.6,0.0,2.025), new Vec3(-1.6,-0.3,2.025),
            new Vec3(-1.5,-0.3,2.25), new Vec3(-1.5,0.0,2.25), new Vec3(-2.3,0.0,2.025),
            new Vec3(-2.3,-0.3,2.025), new Vec3(-2.5,-0.3,2.25), new Vec3(-2.5,0.0,2.25),
            new Vec3(-2.7,0.0,2.025), new Vec3(-2.7,-0.3,2.025), new Vec3(-3.0,-0.3,2.25),
            new Vec3(-3.0,0.0,2.25), new Vec3(-2.7,0.0,1.8), new Vec3(-2.7,-0.3,1.8),
            new Vec3(-3.0,-0.3,1.8), new Vec3(-3.0,0.0,1.8), new Vec3(-1.5,0.3,2.25),
            new Vec3(-1.6,0.3,2.025), new Vec3(-2.5,0.3,2.25), new Vec3(-2.3,0.3,2.025),
            new Vec3(-3.0,0.3,2.25), new Vec3(-2.7,0.3,2.025), new Vec3(-3.0,0.3,1.8),
            new Vec3(-2.7,0.3,1.8), new Vec3(-2.7,0.0,1.575), new Vec3(-2.7,-0.3,1.575),
            new Vec3(-3.0,-0.3,1.35), new Vec3(-3.0,0.0,1.35), new Vec3(-2.5,0.0,1.125),
            new Vec3(-2.5,-0.3,1.125), new Vec3(-2.65,-0.3,0.9375),
            new Vec3(-2.65,0.0,0.9375), new Vec3(-2.0,-0.3,0.9), new Vec3(-1.9,-0.3,0.6),
            new Vec3(-1.9,0.0,0.6), new Vec3(-3.0,0.3,1.35), new Vec3(-2.7,0.3,1.575),
            new Vec3(-2.65,0.3,0.9375), new Vec3(-2.5,0.3,1.125), new Vec3(-1.9,0.3,0.6),
            new Vec3(-2.0,0.3,0.9), new Vec3(1.7,0.0,1.425), new Vec3(1.7,-0.66,1.425),
            new Vec3(1.7,-0.66,0.6), new Vec3(1.7,0.0,0.6), new Vec3(2.6,0.0,1.425),
            new Vec3(2.6,-0.66,1.425), new Vec3(3.1,-0.66,0.825), new Vec3(3.1,0.0,0.825),
            new Vec3(2.3,0.0,2.1), new Vec3(2.3,-0.25,2.1), new Vec3(2.4,-0.25,2.025),
            new Vec3(2.4,0.0,2.025), new Vec3(2.7,0.0,2.4), new Vec3(2.7,-0.25,2.4),
            new Vec3(3.3,-0.25,2.4), new Vec3(3.3,0.0,2.4), new Vec3(1.7,0.66,0.6),
            new Vec3(1.7,0.66,1.425), new Vec3(3.1,0.66,0.825), new Vec3(2.6,0.66,1.425),
            new Vec3(2.4,0.25,2.025), new Vec3(2.3,0.25,2.1), new Vec3(3.3,0.25,2.4),
            new Vec3(2.7,0.25,2.4), new Vec3(2.8,0.0,2.475), new Vec3(2.8,-0.25,2.475),
            new Vec3(3.525,-0.25,2.49375), new Vec3(3.525,0.0,2.49375),
            new Vec3(2.9,0.0,2.475), new Vec3(2.9,-0.15,2.475), new Vec3(3.45,-0.15,2.5125),
            new Vec3(3.45,0.0,2.5125), new Vec3(2.8,0.0,2.4), new Vec3(2.8,-0.15,2.4),
            new Vec3(3.2,-0.15,2.4), new Vec3(3.2,0.0,2.4), new Vec3(3.525,0.25,2.49375),
            new Vec3(2.8,0.25,2.475), new Vec3(3.45,0.15,2.5125), new Vec3(2.9,0.15,2.475),
            new Vec3(3.2,0.15,2.4), new Vec3(2.8,0.15,2.4), new Vec3(0.0,0.0,3.15),
            new Vec3(0.0,-0.002,3.15), new Vec3(0.002,0.0,3.15), new Vec3(0.8,0.0,3.15),
            new Vec3(0.8,-0.45,3.15), new Vec3(0.45,-0.8,3.15), new Vec3(0.0,-0.8,3.15),
            new Vec3(0.0,0.0,2.85), new Vec3(0.2,0.0,2.7), new Vec3(0.2,-0.112,2.7),
            new Vec3(0.112,-0.2,2.7), new Vec3(0.0,-0.2,2.7), new Vec3(-0.002,0.0,3.15),
            new Vec3(-0.45,-0.8,3.15), new Vec3(-0.8,-0.45,3.15), new Vec3(-0.8,0.0,3.15),
            new Vec3(-0.112,-0.2,2.7), new Vec3(-0.2,-0.112,2.7), new Vec3(-0.2,0.0,2.7),
            new Vec3(0.0,0.002,3.15), new Vec3(-0.8,0.45,3.15), new Vec3(-0.45,0.8,3.15),
            new Vec3(0.0,0.8,3.15), new Vec3(-0.2,0.112,2.7), new Vec3(-0.112,0.2,2.7),
            new Vec3(0.0,0.2,2.7), new Vec3(0.45,0.8,3.15), new Vec3(0.8,0.45,3.15),
            new Vec3(0.112,0.2,2.7), new Vec3(0.2,0.112,2.7), new Vec3(0.4,0.0,2.55),
            new Vec3(0.4,-0.224,2.55), new Vec3(0.224,-0.4,2.55), new Vec3(0.0,-0.4,2.55),
            new Vec3(1.3,0.0,2.55), new Vec3(1.3,-0.728,2.55), new Vec3(0.728,-1.3,2.55),
            new Vec3(0.0,-1.3,2.55), new Vec3(1.3,0.0,2.4), new Vec3(1.3,-0.728,2.4),
            new Vec3(0.728,-1.3,2.4), new Vec3(0.0,-1.3,2.4), new Vec3(-0.224,-0.4,2.55),
            new Vec3(-0.4,-0.224,2.55), new Vec3(-0.4,0.0,2.55), new Vec3(-0.728,-1.3,2.55),
            new Vec3(-1.3,-0.728,2.55), new Vec3(-1.3,0.0,2.55), new Vec3(-0.728,-1.3,2.4),
            new Vec3(-1.3,-0.728,2.4), new Vec3(-1.3,0.0,2.4), new Vec3(-0.4,0.224,2.55),
            new Vec3(-0.224,0.4,2.55), new Vec3(0.0,0.4,2.55), new Vec3(-1.3,0.728,2.55),
            new Vec3(-0.728,1.3,2.55), new Vec3(0.0,1.3,2.55), new Vec3(-1.3,0.728,2.4),
            new Vec3(-0.728,1.3,2.4), new Vec3(0.0,1.3,2.4), new Vec3(0.224,0.4,2.55),
            new Vec3(0.4,0.224,2.55), new Vec3(0.728,1.3,2.55), new Vec3(1.3,0.728,2.55),
            new Vec3(0.728,1.3,2.4), new Vec3(1.3,0.728,2.4), new Vec3(0.0,0.0,0.0),
            new Vec3(1.5,0.0,0.15), new Vec3(1.5,0.84,0.15), new Vec3(0.84,1.5,0.15),
            new Vec3(0.0,1.5,0.15), new Vec3(1.5,0.0,0.075), new Vec3(1.5,0.84,0.075),
            new Vec3(0.84,1.5,0.075), new Vec3(0.0,1.5,0.075), new Vec3(1.425,0.0,0.0),
            new Vec3(1.425,0.798,0.0), new Vec3(0.798,1.425,0.0), new Vec3(0.0,1.425,0.0),
            new Vec3(-0.84,1.5,0.15), new Vec3(-1.5,0.84,0.15), new Vec3(-1.5,0.0,0.15),
            new Vec3(-0.84,1.5,0.075), new Vec3(-1.5,0.84,0.075), new Vec3(-1.5,0.0,0.075),
            new Vec3(-0.798,1.425,0.0), new Vec3(-1.425,0.798,0.0), new Vec3(-1.425,0.0,0.0),
            new Vec3(-1.5,-0.84,0.15), new Vec3(-0.84,-1.5,0.15), new Vec3(0.0,-1.5,0.15),
            new Vec3(-1.5,-0.84,0.075), new Vec3(-0.84,-1.5,0.075), new Vec3(0.0,-1.5,0.075),
            new Vec3(-1.425,-0.798,0.0), new Vec3(-0.798,-1.425,0.0),
            new Vec3(0.0,-1.425,0.0), new Vec3(0.84,-1.5,0.15), new Vec3(1.5,-0.84,0.15),
            new Vec3(0.84,-1.5,0.075), new Vec3(1.5,-0.84,0.075), new Vec3(0.798,-1.425,0.0),
            new Vec3(1.425,-0.798,0.0)];

        var mesh = new Mesh();

        var vertex_data = mesh.vertex_data;

        vertex_data.AddVertexDataElement(VertexDataElementType.Position, VertexDataElementDataType.Float3);
        vertex_data.AddVertexDataElement(VertexDataElementType.Normal, VertexDataElementDataType.Float3);


        var npatches = 32;
        var nv = npatches*(n+1)*(n+1);
        var nq = npatches*n*n;

        var num_vertices = npatches * (n+1) * (n+1);
        var num_indices = npatches * (n+1) * (n+1) * 6;

        var buffer_size = num_vertices*vertex_data.stride/4;
        var data_buffer = new Float32Array(buffer_size);
        vertex_data.SetDataBuffer(data_buffer);        

        var location = 0;

        for (var p=0;  p<npatches;  p++)    
        { // For each patch
            
            for (var i=0;  i<=n; i++) 
            {       // Grid in u direction
                var u = i/n;
                for (var j=0;  j<=n; j++) 
                { // Grid if v direction
                    var v = j/n;

                    // Four u weights
                    var u0 = (1.0-u)*(1.0-u)*(1.0-u);
                    var u1 = 3.0*(1.0-u)*(1.0-u)*u;
                    var u2 = 3.0*(1.0-u)*u*u;
                    var u3 = u*u*u;

                    // Three du weights
                    var du0 = (1.0-u)*(1.0-u);
                    var du1 = 2.0*(1.0-u)*u;
                    var du2 = u*u;

                    // Four v weights
                    var v0 = (1.0-v)*(1.0-v)*(1.0-v);
                    var v1 = 3.0*(1.0-v)*(1.0-v)*v;
                    var v2 = 3.0*(1.0-v)*v*v;
                    var v3 = v*v*v;

                    // Three dv weights
                    var dv0 = (1.0-v)*(1.0-v);
                    var dv1 = 2.0*(1.0-v)*v;
                    var dv2 = v*v;

                    // Grab the 16 control points for Bezier patch.
                    var p00 = TeapotPoints[TeapotIndex[p*16+ 0]-1];
                    var p01 = TeapotPoints[TeapotIndex[p*16+ 1]-1];
                    var p02 = TeapotPoints[TeapotIndex[p*16+ 2]-1];
                    var p03 = TeapotPoints[TeapotIndex[p*16+ 3]-1];
                    var p10 = TeapotPoints[TeapotIndex[p*16+ 4]-1];
                    var p11 = TeapotPoints[TeapotIndex[p*16+ 5]-1];
                    var p12 = TeapotPoints[TeapotIndex[p*16+ 6]-1];
                    var p13 = TeapotPoints[TeapotIndex[p*16+ 7]-1];
                    var p20 = TeapotPoints[TeapotIndex[p*16+ 8]-1];
                    var p21 = TeapotPoints[TeapotIndex[p*16+ 9]-1];
                    var p22 = TeapotPoints[TeapotIndex[p*16+10]-1];
                    var p23 = TeapotPoints[TeapotIndex[p*16+11]-1];
                    var p30 = TeapotPoints[TeapotIndex[p*16+12]-1];
                    var p31 = TeapotPoints[TeapotIndex[p*16+13]-1];
                    var p32 = TeapotPoints[TeapotIndex[p*16+14]-1];
                    var p33 = TeapotPoints[TeapotIndex[p*16+15]-1];

                    // Evaluate the Bezier patch at (u,v)
                    var V =     p00.Scale(u0*v0).Add(p01.Scale(u0*v1)).Add(p02.Scale(u0,v2)).Add(p03.Scale(u0*v3)).
                            Add(p10.Scale(u1*v0)).Add(p11.Scale(u1*v1)).Add(p12.Scale(u1*v2)).Add(p13.Scale(u1*v3)).
                            Add(p20.Scale(u2*v0)).Add(p21.Scale(u2*v1)).Add(p22.Scale(u2*v2)).Add(p23.Scale(u2*v3)).
                            Add(p30.Scale(u3*v0)).Add(p31.Scale(u3*v1)).Add(p32.Scale(u3*v2)).Add(p33.Scale(u3*v3));

                    location = V.PushToFloatArray(data_buffer, location);

                    //*pp++ = vec4(V[0], V[1], V[2], 1.0);
                    //Pnt.push_back(vec4(V[0], V[1], V[2], 1.0));
                    //Tex.push_back(vec2(u,v));

                    // Evaluate the u-tangent of the Bezier patch at (u,v)
                    var du =
                            p10.Sub(p00).Scale(du0*v0).Add(p11.Sub(p01).Scale(du0*v1)).Add(p12.Sub(p02).Scale(du0*v2)).Add(p13.Sub(p03).Scale(du0*v3)).
                        Add(p20.Sub(p10).Scale(du1*v0)).Add(p21.Sub(p11).Scale(du1*v1)).Add(p22.Sub(p12).Scale(du1*v2)).Add(p23.Sub(p13).Scale(du1*v3)).
                        Add(p30.Sub(p20).Scale(du2*v0)).Add(p31.Sub(p21).Scale(du2*v1)).Add(p32.Sub(p22).Scale(du2*v2)).Add(p33.Sub(p23).Scale(du2*v3));

                    //Tan.push_back(du);

                    // Evaluate the v-tangent of the Bezier patch at (u,v)
                    var dv =
                             p01.Sub(p00).Scale(u0*dv0).Add(p02.Sub(p01).Scale(u0*dv1)).Add(p03.Sub(p02).Scale(u0*dv2))
                        .Add(p11.Sub(p10).Scale(u1*dv0)).Add(p12.Sub(p11).Scale(u1*dv1)).Add(p13.Sub(p12).Scale(u1*dv2))
                        .Add(p21.Sub(p20).Scale(u2*dv0)).Add(p22.Sub(p21).Scale(u2*dv1)).Add(p23.Sub(p22).Scale(u2*dv2))
                        .Add(p31.Sub(p30).Scale(u3*dv0)).Add(p32.Sub(p31).Scale(u3*dv1)).Add(p33.Sub(p32).Scale(u3*dv2));

                    var N = dv.Cross(du);
                    location = N.PushToFloatArray(data_buffer, location);

                    // Calculate the surface normal as the cross product of the two tangents.
                    
                    /*
                    Nrm.push_back(cross(dv,du));

                    //-(du[1]*dv[2]-du[2]*dv[1]);
                    //*np++ = -(du[2]*dv[0]-du[0]*dv[2]);
                    //*np++ = -(du[0]*dv[1]-du[1]*dv[0]);

                    // Create a quad for all but the first edge vertices
                    if (i>0 && j>0)
                        Quad.push_back(ivec4(p*(n+1)*(n+1) + (i-1)*(n+1) + (j-1),
                                              p*(n+1)*(n+1) + (i-1)*(n+1) + (j),
                                              p*(n+1)*(n+1) + (i  )*(n+1) + (j),
                                              p*(n+1)*(n+1) + (i  )*(n+1) + (j-1))); } } }     
                                              */
                }
            }
        }       
    },

    CreateQuad : function()
    {
        var mesh = new Mesh();

        var vertex_data = mesh.vertex_data;

        vertex_data.AddVertexDataElement(VertexDataElementType.Position, VertexDataElementDataType.Float3);
        var buffer_size = 6*vertex_data.stride/4;
        var data_buffer = new Float32Array(buffer_size);
        vertex_data.SetDataBuffer(data_buffer);

        var location = 0;

        var p= [ new Vec3(-0.5,0.5,0),
                new Vec3(0.5,0.5,0),
                new Vec3(0.5,-0.5,0),
                new Vec3(-0.5,-0.5,0) ] ;

        location = p[0].PushToFloatArray(data_buffer, location);
        location = p[1].PushToFloatArray(data_buffer, location);
        location = p[2].PushToFloatArray(data_buffer, location);
        location = p[0].PushToFloatArray(data_buffer, location);
        location = p[2].PushToFloatArray(data_buffer, location);
        location = p[3].PushToFloatArray(data_buffer, location);


        return mesh;
    },
    
    CreateUnitSphere : function(normal, uv, NumSegments)
    {
        var NumVerticalSegment = NumSegments;
        var NumHorizontalSegment = NumSegments;

        var mesh = new Mesh();

        var vertex_data = mesh.vertex_data;

        vertex_data.AddVertexDataElement(VertexDataElementType.Position, VertexDataElementDataType.Float3);

        if(normal)
        {
            vertex_data.AddVertexDataElement(VertexDataElementType.Normal, VertexDataElementDataType.Float3);
        }
        if(uv)
        {
            vertex_data.AddVertexDataElement(VertexDataElementType.Texture, VertexDataElementDataType.Float2);
        }

        var buffer_size = 6*NumVerticalSegment*NumHorizontalSegment*vertex_data.stride/4;
        var data_buffer = new Float32Array(buffer_size);
        vertex_data.SetDataBuffer(data_buffer);

        var location = 0;

        for(var i = 0;i<NumVerticalSegment; ++i)
        {
            var ratio0 = (i/NumVerticalSegment)*2-1;
            var ratio1 = ((i+1)/NumVerticalSegment)*2-1;

            var Y0 = (Math.sin(ratio0*90*3.141592/180.0));
            var Y1 = (Math.sin(ratio1*90*3.141592/180.0));

            var Radius0 = (Math.sqrt(1-Y0*Y0));
            var Radius1 = (Math.sqrt(1-Y1*Y1));

            for(var j = 0;j<NumHorizontalSegment; ++j)
            {

                var angle0 = (j)/NumHorizontalSegment * 360.0;
                var angle1 = (j+1)/NumHorizontalSegment * 360.0;

                var v1 = new Vec3(Math.cos(angle0 * 3.141592 / 180.0) * Radius0,Y0,Math.sin(angle0 * 3.141592 / 180.0) * Radius0);
                var v2 = new Vec3(Math.cos(angle1 * 3.141592 / 180.0) * Radius0,Y0,Math.sin(angle1 * 3.141592 / 180.0) * Radius0);
                var v3 = new Vec3(Math.cos(angle1 * 3.141592 / 180.0) * Radius1,Y1,Math.sin(angle1 * 3.141592 / 180.0) * Radius1);
                var v4 = new Vec3(Math.cos(angle0 * 3.141592 / 180.0) * Radius1,Y1,Math.sin(angle0 * 3.141592 / 180.0) * Radius1);

                if(normal || uv)
                {
                    n1 = Vec3CreateFromVec3(v1);
                    n2 = Vec3CreateFromVec3(v2);
                    n3 = Vec3CreateFromVec3(v3);
                    n4 = Vec3CreateFromVec3(v4);

                    n1.MakeNormalize();
                    n2.MakeNormalize();
                    n3.MakeNormalize();
                    n4.MakeNormalize();

                }
                if(uv)
                {
                    t1 = new Vec2(Math.asin(n1.x)/3.141592+0.5, Math.asin(n1.y)/3.141592+0.5 );
                    t2 = new Vec2(Math.asin(n2.x)/3.141592+0.5, Math.asin(n2.y)/3.141592+0.5 );
                    t3 = new Vec2(Math.asin(n3.x)/3.141592+0.5, Math.asin(n3.y)/3.141592+0.5 );
                    t4 = new Vec2(Math.asin(n4.x)/3.141592+0.5, Math.asin(n4.y)/3.141592+0.5 );
                }

                location = v1.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n1.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t1.PushToFloatArray(data_buffer, location);
                }

                location = v2.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n2.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t2.PushToFloatArray(data_buffer, location);
                }

                location = v3.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n3.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t3.PushToFloatArray(data_buffer, location);
                }

                location = v1.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n1.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t1.PushToFloatArray(data_buffer, location);
                }

                location = v3.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n3.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t3.PushToFloatArray(data_buffer, location);
                }

                location = v4.PushToFloatArray(data_buffer, location);
                if(normal)
                {
                    location = n4.PushToFloatArray(data_buffer, location);
                }
                if(uv)
                {
                    location = t4.PushToFloatArray(data_buffer, location);
                }

            }
        }

        return mesh;
    },

    CreateUnitBox : function()
    {
        var mesh = new Mesh();

        var vertex_data = mesh.vertex_data;
        vertex_data.AddVertexDataElement(VertexDataElementType.Position, VertexDataElementDataType.Float3);
        vertex_data.AddVertexDataElement(VertexDataElementType.Normal, VertexDataElementDataType.Float3);

        var num_triangles = 12;
        var buffer_size = num_triangles*3*vertex_data.stride/4;
        var data_buffer = new Float32Array(buffer_size);
        vertex_data.SetDataBuffer(data_buffer);

        var vMin = new Vec3(-0.5,-0.5,-0.5);
        var vMax = new Vec3(0.5,0.5,0.5);

        var v1 = new Vec3(),v2 = new Vec3(),v3 = new Vec3(),v4 = new Vec3(),vN = new Vec3();
        var location = 0;

        mesh.radius = 1;
                
        // Back
        v1.Set(vMin);
        v2.Set2(vMax.x,vMin.y,vMin.z);
        v3.Set2(vMax.x,vMax.y,vMin.z);
        v4.Set2(vMin.x,vMax.y,vMin.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        // Front
        v1.Set(vMax);
        v2.Set2(vMax.x,vMin.y,vMax.z);
        v3.Set2(vMin.x,vMin.y,vMax.z);
        v4.Set2(vMin.x,vMax.y,vMax.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        // Left
        v1.Set(vMin);
        v2.Set2(vMin.x,vMax.y,vMin.z);
        v3.Set2(vMin.x,vMax.y,vMax.z);
        v4.Set2(vMin.x,vMin.y,vMax.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        // Right
        v1.Set(vMax);
        v2.Set2(vMax.x,vMax.y,vMin.z);
        v3.Set2(vMax.x,vMin.y,vMin.z);
        v4.Set2(vMax.x,vMin.y,vMax.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        // Top
        v1.Set(vMax);
        v2.Set2(vMin.x,vMax.y,vMax.z);
        v3.Set2(vMin.x,vMax.y,vMin.z);
        v4.Set2(vMax.x,vMax.y,vMin.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        // Bottom
        v1.Set(vMin);
        v2.Set2(vMin.x,vMin.y,vMax.z);
        v3.Set2(vMax.x,vMin.y,vMax.z);
        v4.Set2(vMax.x,vMin.y,vMin.z);
        
        vN = MeshUtil.ComputeNormal(v1,v2,v3);

        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v2.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v1.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v3.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);
        location = v4.PushToFloatArray(data_buffer, location);
        location = vN.PushToFloatArray(data_buffer, location);

        return mesh;
    }
}
