uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
}