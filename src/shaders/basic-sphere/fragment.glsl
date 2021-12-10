precision highp float;

uniform vec2 uMouse;
uniform float uTime;
uniform sampler2D tAudioData;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uLightIntensity;
uniform float uAmbientLightIntensity;
uniform vec3 uLightPosition;

// uniform vec3 uDepthColor;
// uniform vec3 uSurfaceColor;
// uniform float uColorOffset;
// uniform float uColorMultiplier;

//these values are being passed by the vertex shader
varying vec3 vPosition;
varying vec3 myNormal;
varying vec3 vFragPos;
varying float vDisplacement;


void main() {
    vec3 norm = normalize(myNormal);

    // light from the top
    vec3 lightColor = uDepthColor;
    vec3 lightPos = uLightPosition;
    vec3 lightDir = normalize(lightPos - vFragPos);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor * uLightIntensity;

    vec3 ambient = lightColor * uAmbientLightIntensity;


    vec3 result = (ambient + diffuse) * uSurfaceColor;

    gl_FragColor = vec4(result, 1.0);    
}