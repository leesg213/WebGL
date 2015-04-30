

//////////////////////////////////////
// Terrain
//////////////////////////////////////

var Terrain = {

    CreateMesh : function(numGridX, numGridY, amplitude, persistence, numOctaves)
    {
        if(numGridX <= 0 || numGridY <= 0)
        {
            return null;
        }
        var mesh = new Mesh();

        var vertex_data = mesh.vertex_data;
        vertex_data.AddVertexDataElement(VertexDataElementType.Position, VertexDataElementDataType.Float3);
        vertex_data.AddVertexDataElement(VertexDataElementType.Normal, VertexDataElementDataType.Float3);

        var num_vertex_x = numGridX+1;
        var num_vertex_y = numGridY+1;

        var buffer_size = num_vertex_x*num_vertex_y*vertex_data.stride;
        var data_buffer = new Float32Array(buffer_size);
        vertex_data.SetDataBuffer(data_buffer);

        var vMin = new Vec3(-0.5,-amplitude/2.0,-0.5);
        var vMax = new Vec3(0.5,amplitude/2.0,0.5);

        var v1 = new Vec3(),v2 = new Vec3(),v3 = new Vec3(),v4 = new Vec3(),vN = new Vec3();
        var location = 0;

        mesh.radius = 1;

        // create height field
        var height_field = new Float32Array(num_vertex_x*num_vertex_y);
        for(var vy = 0; vy<num_vertex_y; ++vy)
        {
            for(var vx = 0;vx<num_vertex_x; ++vx)
            {
                var height = PerlinNoise.PerlinNoise_2D(vx/num_vertex_x * 10, vy/num_vertex_y * 10, persistence, numOctaves) * amplitude;


                height_field[vy*num_vertex_x + vx] = height;
            }
        }

        // creates vertex positions and normals
        for(var vy = 0; vy<num_vertex_y; ++vy)
        {
            for(var vx = 0;vx<num_vertex_x; ++vx)
            {
                var height = height_field[vy*num_vertex_x + vx];
                var v_pos = new Vec3(vx-num_vertex_x*0.5,height,vy-num_vertex_y*0.5);

                location = v_pos.PushToFloatArray(data_buffer, location);

                var left_vx = vx == 0 ? 0 : vx-1;
                var right_vx = vx == num_vertex_x-1 ? num_vertex_x-1 : vx+1;
                var top_vy = vy == 0 ? 0 : vy-1;
                var bot_vy = vy == num_vertex_y-1 ? num_vertex_y-1 : vy+1;

                var left_height = height_field[vy*num_vertex_x + left_vx];
                var right_height = height_field[vy*num_vertex_x + right_vx];

                var top_height = height_field[top_vy*num_vertex_x + vx];
                var bot_height = height_field[bot_vy*num_vertex_x + vx];

                var vec1 = new Vec3(1.0, right_height - left_height, 0);
                var vec2 = new Vec3(0, bot_height - top_height, 1.0 );

                vec1.MakeNormalize();
                vec2.MakeNormalize();

                var v_normal = vec2.Cross(vec1);

                location = v_normal.PushToFloatArray(data_buffer, location);
            }
        }
        
        // creates indices
        var num_indices = numGridX * numGridY * 6;
        var indices = [];

        var count = 0;
        for(var i = 0;i<numGridY;++i)
        {
            for(var j =0;j<numGridX;++j)
            {

                indices[count++] = i*num_vertex_x+j;
                indices[count++] = i*num_vertex_x+j+1;
                indices[count++] = (i+1)*num_vertex_x+j;

                indices[count++] = (i+1)*num_vertex_x+j;
                indices[count++] = i*num_vertex_x+j+1;
                indices[count++] = (i+1)*num_vertex_x+j+1;
            }
        }

        mesh.index_data = indices;

        return mesh;
    }
}
