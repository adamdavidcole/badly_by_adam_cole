// DOES NOT WORK CURRENTLY

// switch on high precision floats
precision highp float;

uniform highp vec2 uMouse;
uniform highp float uTime;
uniform highp float uDisplacementScale;
uniform mediump float uTileSpacing;
uniform sampler2D tAudioData;

varying float vDisplacement;

varying vec3 myNormal;

#define M_PI 3.14159265358979323846


float rand(vec3 x) {
// This uses frequency modulation, but with dot product distance to generate
// A single value from a vector
        float soundValue = texture2D( tAudioData, vec2(0.6, 0.0 ) ).r;
        return abs(sin(cos(dot(x,vec3(soundValue)))* 100.));
}

void main() {
    float angle = 0.0;
    //rotation
    mat4 rotateX = mat4(1,0,0,0,0,cos(angle),sin(angle),0,0,-sin(angle),cos(angle),0,0,0,0,1);
    //mat4 scale = mat4(0.33,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.0,0.0,1.0);

    myNormal = normal;

    
    vec3 newPosition = position;

    // this is what is causing the normal issue...
    // if (mod(100000.0, (uv.x)*100.0) == 0.0 && mod(100000.0, (uv.y)*100.0) == 0.0) {
    //     newPosition *= 2.0;
    // }
    float theta = floor(abs(atan(position.z, position.y)) * 10000.0);
    float phi = floor(abs(atan(position.y, position.z)) * 10000.0);

    if (mod(theta, 10.0) == 0.0 && mod(phi, 10.0) == 0.0) {
        newPosition *= 2.0;
    }

    
    // we need to make the new positions into a vec4 so we can apply the rotation matrix
    vec4 rotatedPos = rotateX * vec4(newPosition,1.0);
    // we're now ready to generate the new normals after the rotation. 
    // this is crucial otherwise it will look like our light is also rotating
    
    myNormal = normalize(rotatedPos.xyz*1.2);

    // three.js provides the projection Matrix and the model View matrix. 
    // We just pipe in our positions
    // We can also add a little bit of the normal so that
    // We can get direction vectors of the surface
    // We don't really need to do that all the time
    // But it's a good technique to be aware of
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPos.xyz,1.);

    vDisplacement = distance(position, newPosition);
}