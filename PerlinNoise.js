

//////////////////////////////////////
// PerlinNoise
//////////////////////////////////////

var PerlinNoise = {

    Noise1 : function(int_x, int_y)
    {
        var n = int_x + int_y * 57;
        n = (n<<13) ^ n;
        n = ~~n;
        
        return ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);   
    },

    SmoothNoise_1 : function(x, y)
    {
        var corners = ( PerlinNoise.Noise1(x-1, y-1)+PerlinNoise.Noise1(x+1, y-1)+PerlinNoise.Noise1(x-1, y+1)+PerlinNoise.Noise1(x+1, y+1) ) / 16;
        var sides   = ( PerlinNoise.Noise1(x-1, y)  +PerlinNoise.Noise1(x+1, y)  +PerlinNoise.Noise1(x, y-1)  +PerlinNoise.Noise1(x, y+1) ) /  8;
        var center  =  PerlinNoise.Noise1(x, y) / 4;
        return corners + sides + center;
    },
 
    Cosine_Interpolate : function(a, b, x)
    {
        var ft = x * 3.1415927;
        var f = (1 - Math.cos(ft)) * .5;

        return  a*(1-f) + b*f;
    },
    InterpolatedNoise_1 : function(x, y)
    {

        var integer_X    = ~~x;
        var fractional_X = x - integer_X;

        var integer_Y    = ~~y;
        var fractional_Y = y - integer_Y;

        var v1 = PerlinNoise.SmoothNoise_1(integer_X,     integer_Y);
        var v2 = PerlinNoise.SmoothNoise_1(integer_X + 1, integer_Y);
        var v3 = PerlinNoise.SmoothNoise_1(integer_X,     integer_Y + 1);
        var v4 = PerlinNoise.SmoothNoise_1(integer_X + 1, integer_Y + 1);

        var i1 = PerlinNoise.Cosine_Interpolate(v1 , v2 , fractional_X);
        var i2 = PerlinNoise.Cosine_Interpolate(v3 , v4 , fractional_X);

        return PerlinNoise.Cosine_Interpolate(i1 , i2 , fractional_Y); 
    },


    PerlinNoise_2D : function(x, y, persistence, numOctaves)
    {
        var total = 0;
        var p = persistence;
        var n = ~~numOctaves;
        var frequency = 1;
        var amplitude = 1;

        for(var i = 0;i<n;++i)
        {

            total = total + PerlinNoise.InterpolatedNoise_1(x * frequency, y * frequency) * amplitude;

            frequency = frequency * 2;
            amplitude = amplitude * p;
        }

        return total;
    }
}
