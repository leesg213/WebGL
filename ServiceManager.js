
var ServiceManager = {
    Services: new Array(),
    accumTime: 0,
    frameTime: 0,
    lastPerfTime: 0,
    Canvas: null,

    Init: function (canvas) {
        this.Canvas = canvas;
    },

    InitServices: function () {

        for (var s in this.Services) {
            this.Services[s].OnInit();
        }
    },

    addService: function (service) {

        this.Services.push(service);
    },

    removeService: function (service) {

        var NumElements = this.Services.length();

        for (var i = 0; i < NumElements; ++i) {

            if (this.Services[i] == service) {

                this.Services.splice(i, 1);
                return;
            }
        }
    },

    updateTime: function () {
        var currentTime = window.performance.now();
        if (this.lastPerfTime == 0) {
            this.lastPerfTime = currentTime;
            return;
        }

        this.frameTime = currentTime - this.lastPerfTime;
        this.accumTime += this.frameTime;

    },

    update: function () {
        this.updateTime();

        for (var s in this.Services) {

            this.Services[s].OnUpdate();

        }
    }



}