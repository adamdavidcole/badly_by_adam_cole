precision highp float;

uniform vec2 uFrequency;
uniform float uTime;
uniform vec2 uMouse;
uniform float uTileFrequency;
uniform float uSpikeAmplitude;
uniform float uRotationAngle;
uniform float uPosition;
uniform sampler2D tAudioData;

varying vec2 vUv;
varying float vElevation;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main()
{
    float audio0 = texture2D( tAudioData, vec2( 0.0, 0.0 ) ).r;
    float audio1 = texture2D( tAudioData, vec2( 0.6, 0.0 ) ).r;

    vec4 newPosition = vec4(position, 1.0);

    vec3 zAxis = vec3(0.0, 1.0, 0.0);
    mat4 rotationZ = rotationMatrix(zAxis, uRotationAngle);
    newPosition = rotationZ * newPosition;

    vec4 modelPosition = modelMatrix * newPosition;
   

    modelPosition.z += cos(modelPosition.x * audio1 * 10.0) * 0.2;

    float elevation = 0.0;

    if (mod(uv.x * 100.0, uTileFrequency) < 0.1 && mod(uv.y * 100.0, uTileFrequency) < 0.1) {
        float distFromCenter = distance(uv, vec2(0.5));
        elevation = audio0 * uSpikeAmplitude / (distFromCenter + 0.1);
        modelPosition.z += elevation;
    }

    
    
    

    // float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    // modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}