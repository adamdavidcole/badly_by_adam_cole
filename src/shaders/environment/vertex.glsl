precision highp float;

uniform vec2 uFrequency;
uniform float uTime;
uniform float uTileFrequency;
uniform float uSpikeAmplitude;
uniform sampler2D tAudioData;

varying vec2 vUv;
// varying float vElevation;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}