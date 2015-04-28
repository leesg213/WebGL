var gRenderService;

function RenderService()
{
    this.clearColor = new Vec3();
    this.renderables = new Array();

    gRenderService = this;
};


RenderService.prototype.OnInit = function () {
    this.InitRenderer();
},

RenderService.prototype.AddRenderable = function (renderable) {

    this.renderables.push(renderable);
    
}
RenderService.prototype.RemoveRenderable = function (renderable) {

    for (var i in this.renderables) {

        if (this.renderables[i] == renderable) {

            this.renderables.splice(i, 1);
            return;
        }
    }
}


RenderService.prototype.OnUpdate = function () {

    for (var i in this.renderables) {
        this.renderables[i].draw();
    }

    // Draw Scene
    /*
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clearDepth(1.0)
    this.gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    */
},

RenderService.prototype.InitRenderer = function () {

    var names = ["webgl", "experimental-webgl"];
    var context = null;

    for (var i = 0; i < names.length; ++i) {

        try {
            context = ServiceManager.Canvas.getContext(names[i]);
        }
        catch (e) { }

        if (context) {

            break;
        }

    }

    if (context) {

        context.viewportWidth = ServiceManager.Canvas.width;
        context.viewportHeight = ServiceManager.Canvas.height;

    }
    else {

        alert("Cannot create WebGL Context!");
    }
    
    Renderer.Init(context);
},

RenderService.prototype.getName = function () {
    return "RenderService";
}