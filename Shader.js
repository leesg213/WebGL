
function Shader() {
    this.program_id = 0;
}

function LoadShader(name) {

    var gl = Renderer.gl;

    var vs_script = document.getElementById(name+"-vs");
    if (!vs_script) {
        return null;
    }

    var ps_script = document.getElementById(name + "-ps");
    if (!ps_script) {
        return null;
    }


    var vs_shader_source = "";
    var ps_shader_source = "";

    var currentChild = vs_script.firstChild;
    while (currentChild) {

        if (currentChild.nodeType == 3) {
            vs_shader_source += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    currentChild = ps_script.firstChild;
    while (currentChild) {

        if (currentChild.nodeType == 3) {
            ps_shader_source += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    var vs_shader, ps_shader;

    vs_shader = gl.createShader(gl.VERTEX_SHADER);
    ps_shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vs_shader, vs_shader_source);
    gl.compileShader(vs_shader);

    if (!gl.getShaderParameter(vs_shader, gl.COMPILE_STATUS)) {

        alert(gl.getShaderInfoLog(vs_shader) + "Shader : " + name);
        return null;
    }

    gl.shaderSource(ps_shader, ps_shader_source);
    gl.compileShader(ps_shader);

    if (!gl.getShaderParameter(ps_shader, gl.COMPILE_STATUS)) {

        alert(gl.getShaderInfoLog(ps_shader) + "Shader : " + name);
        return null;
    }


    var program_id = gl.createProgram();
    gl.attachShader(program_id, vs_shader);
    gl.attachShader(program_id, ps_shader);
    gl.linkProgram(program_id);

    if (!gl.getProgramParameter(program_id, gl.LINK_STATUS)) {
        alert("Failed to link shader " + name);
        return null;
    }

    var shader = new Shader();
    shader.program_id = program_id;

    return shader;
}