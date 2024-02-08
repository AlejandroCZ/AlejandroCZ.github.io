// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('gl-canvas');

    // Get the rendering context for WebGL
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Set the positions and colors of the vertices
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        0.0,  0.5, -0.4,  0.4, 1.0, 0.4,  // Top - green
       -0.5, -0.5, -0.4,  0.4, 1.0, 0.4,  // Left - green
        0.5, -0.5, -0.4,  1.0, 0.4, 0.4,  // Right - red

        0.5,  0.4, -0.2,  1.0, 0.4, 0.4,  // Top - red
       -0.5,  0.4, -0.2,  1.0, 1.0, 0.4,  // Left - yellow
        0.0, -0.6, -0.2,  1.0, 1.0, 0.4,  // Right - yellow

        0.0,  0.5,  0.0,  0.4, 0.4, 1.0,  // Top - blue
       -0.5, -0.5,  0.0,  0.4, 0.4, 1.0,  // Left - blue
        0.5, -0.5,  0.0,  1.0, 0.4, 0.4   // Right - red
    ]);

    var n = 9; // Number of vertices

    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Get the storage location of a_Color
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }

    // Assign the buffer object to a_Color variable
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    // Enable the assignment to a_Color variable
    gl.enableVertexAttribArray(a_Color);

    // Get the storage location of u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Create a rotation matrix
    var modelMatrix = mat4.create();
    var angle = 0.0;

    // Start rendering
    var tick = function () {
        angle += 1.0;
        draw(gl, n, angle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    };
    tick();
}

function draw(gl, n, angle, modelMatrix, u_ModelMatrix) {
    // Set the rotation matrix
    mat4.rotate(modelMatrix, modelMatrix, angle * Math.PI / 180.0, [0, 1, 0]);
    // Pass the rotation matrix to the vertex shader
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the cube
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

window.onload = main;