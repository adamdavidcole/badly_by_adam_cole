precision highp float;
uniform vec2 uMouse;
uniform float uTime;
uniform sampler2D tAudioData;

//these values are being passed by the vertex shader
varying vec3 myNormal;


void main() {
    // light from the top
    vec3 light = vec3(0.,10.,5.);
    
    // Get the normal of the light
    // Remember the Unit Vector of the light is the direction of the light 
    vec3 invert = vec3(1.,1.,1.);
    invert=myNormal * invert;
    
    light = normalize(light);
    
    // return the maximum of either 0, or the squared distance 
    float prod = max(0., dot(myNormal,light));
    // use the dot product of the normal and the light
    // To calculate the shading for the sphere
    gl_FragColor = vec4(prod, prod, prod, 1.0) + vec4(vec3(0.15),1.);
    // float f = texture2D( tAudioData, vec2(0.8, 0.0 ) ).r;
    // gl_FragColor = vec4(vec3(f), 1.0);
    
}