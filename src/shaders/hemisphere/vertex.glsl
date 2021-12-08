// switch on high precision floats
precision highp float;

uniform highp vec2 uMouse;
uniform highp float uTime;
uniform highp float uDisplacementScale;
uniform mediump float uMaxAudioThreshold;
uniform sampler2D tAudioData;
uniform bool isLeft;


varying float vDisplacement;


// attribute highp vec3 normal;
// attribute highp vec3 position;
// attribute highp mat4 projectionMatrix;
// attribute highp mat4 modelViewMatrix;

varying vec3 myNormal;

#define M_PI 3.14159265358979323846


mat4 translation(vec3 translationPos) {
    float x = translationPos.x;
    float y = translationPos.y;
    float z = translationPos.z;

    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
          x,   y,   z, 1.0
    );
}


mat4 rotation(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

float rand(vec3 x) {
// This uses frequency modulation, but with dot product distance to generate
// A single value from a vector
        float soundValue = texture2D( tAudioData, vec2(0.6, 0.0 ) ).r;
        return abs(sin(cos(dot(x,vec3(soundValue)))* 100.));
        // return abs(sin(cos(dot(x,vec3(0.0, sin(uTime/10.0), 0.0)+1.))* 100.));
}

void main() {
    float audio0 = texture2D( tAudioData, vec2( 0.0, 0.0 ) ).r;
    float audio1 = texture2D( tAudioData, vec2( 0.8, 0.0 ) ).r;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // float angle = uTime;

    // mat4 rotateX = mat4(1,0,0,0,0,cos(angle),sin(angle),0,0,-sin(angle),cos(angle),0,0,0,0,1);
    // //mat4 scale = mat4(0.33,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.0,0.0,1.0);

    

    float audio1Clamped = min(uMaxAudioThreshold, audio1);
    float xDisplacement = (-uMaxAudioThreshold + audio1Clamped)*4.0;
    vec3 translationPos = vec3(xDisplacement, 0.0, 0.0);
    mat4 translationMatrix = translation(translationPos);
    // // vec3 nextPosition = vec3(translationMatrix * vec4(position.xyz, 1.0));
    // vec3 nextPosition = position;
    // modelPosition.x += (uMouse.x-1.0)*3.0;
    

    modelPosition = translationMatrix * modelPosition;
    // modelPosition.x += sin(uTime)/2.0;
    // modelPosition.z += cos(uTime)/2.0;

    if (!isLeft) {
        vec3 rotationAxis = vec3(0.0, 0.0, 1.0);
        mat4 rotationMatrix = rotation(rotationAxis, M_PI);
        
        modelPosition = rotationMatrix * modelPosition;
    }
    


    myNormal = normalize(modelPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}