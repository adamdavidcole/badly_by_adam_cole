precision highp float;

uniform vec2 uFrequency;
uniform float uTime;
uniform float uTileFrequency;
uniform float uSpikeAmplitude;
uniform sampler2D tAudioData;

varying vec2 vUv;
// varying float vElevation;

void main()
{
    float audio0 = texture2D( tAudioData, vec2( 0.0, 0.0 ) ).r;
    float audio1 = texture2D( tAudioData, vec2( 0.6, 0.0 ) ).r;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

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
    // vElevation = elevation;
}