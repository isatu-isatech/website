"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const vertexShader = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `

uniform vec2 u_resolution;
uniform vec3 u_color;
uniform bool u_color_random;
uniform float u_size;
uniform float u_vignette;
uniform float u_amount;
uniform bool u_opacity_random;
uniform float u_rotation;
uniform bool u_rotation_random;
uniform bool u_shape[7];
uniform sampler2D u_shape_image;
uniform vec2 u_shape_image_resolution;
uniform float u_random_seed;
uniform float u_aa_passes;
uniform float u_time;
uniform vec2 u_mouse;

float vignette(float amount){
    vec2 position = (gl_FragCoord.xy / u_resolution) - vec2(0.5);
    float dist = length(position * vec2(u_resolution.x/u_resolution.y, 1.0));
    float radius = 1.0*amount;
    float softness = 1.0-radius;
    float v = smoothstep(radius, radius - softness, dist);
    return v;
}

float aspectScale(inout vec2 st,float xRes, float yRes){
    float aspect = xRes/yRes;
    float diff = (1.0 - aspect)/2.0;
    float vis = 1.0;
    if(aspect > 1.){
        st.y *= aspect;
        st.y += diff;
        vis = (1.0 - step(1.0,st.y)) * (step(0.0,st.y)) * (1.0 - step(1.0,st.x)) * (step(0.0,st.x));
    } else {
        st.x *= yRes/xRes;
        st.x += (1.0 - yRes/xRes)/2.0;
        vis = (1.0 - step(1.0,st.x)) *(step(0.0,st.x)) * (1.0 - step(1.0,st.y)) *(step(0.0,st.y));
    }
    return vis;
}

highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

#ifndef FNC_AASTEP
#define FNC_AASTEP
#if defined(GL_OES_standard_derivatives)
#extension GL_OES_standard_derivatives : enable
#endif
float aastep(float threshold, float value) {
#if !defined(GL_ES) || __VERSION__ >= 300 || defined(GL_OES_standard_derivatives)
    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#elif defined(AA_EDGE)
    float afwidth = AA_EDGE;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#else
    return step(threshold, value);
#endif
}
#endif

#ifndef FNC_FILL
#define FNC_FILL
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float fill(float x, float size) {
    return 1.0 - aastep(size, x);
}
#endif

#ifndef FNC_TRISDF
#define FNC_TRISDF
float triSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 5.0;
#else
    st -= 0.5;
    st *= 5.0;
#endif
    return max(abs(st.x) * .866025 + st.y * .5, -st.y * 0.5);
}
#endif

#ifndef FNC_HEXSDF
#define FNC_HEXSDF
float hexSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 2.0;
#else
    st = st * 2.0 - 1.0;
#endif
    st = abs(st);
    return max(abs(st.y), st.x * .866025 + st.y * .5);
}
#endif

#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE
#define GOLDEN_ANGLE 2.39996323
#endif

#ifndef FNC_SCALE
#define FNC_SCALE
vec2 scale(in float st, in float s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in float st, in float s) {
#ifdef CENTER_2D
    return scale(st,  s, CENTER_2D);
#else
    return scale(st,  s, vec2(0.5));
#endif
}
vec2 scale(in vec2 st, in vec2 s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in vec2 st, in float s, in vec2 center) { return scale(st, vec2(s), center); }
vec2 scale(in vec2 st, in vec2 s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec2 scale(in vec2 st, in float s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec3 scale(in vec3 st, in vec3 s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in float s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in vec3 s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec3 scale(in vec3 st, in float s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec4 scale(in vec4 st, float s) { return vec4(scale(st.xy, s), st.zw); }
vec4 scale(in vec4 st, vec2 s) { return vec4(scale(st.xy, s), st.zw); }
#endif

#ifndef FNC_STARSDF
#define FNC_STARSDF
float starSDF(in vec2 st, in int V, in float s) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 2.0;
    float a = atan(st.y, st.x) / TAU;
    float seg = a * float(V);
    a = ((floor(seg) + 0.5) / float(V) +
        mix(s, -s, step(0.5, fract(seg))))
        * TAU;
    return abs(dot(vec2(cos(a), sin(a)),
                   st));
}
float starSDF(in vec2 st, in int V) {
    return starSDF( scale(st, 12.0/float(V)), V, 0.1);
}
#endif

#ifndef CIRCLESDF_FNC
#define CIRCLESDF_FNC(POS_UV) length(POS_UV)
#endif
#ifndef FNC_CIRCLESDF
#define FNC_CIRCLESDF
float circleSDF(in vec2 v) {
#ifdef CENTER_2D
    v -= CENTER_2D;
#else
    v -= 0.5;
#endif
    return CIRCLESDF_FNC(v) * 2.0;
}
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_LINESDF
#define FNC_LINESDF
float lineSDF( in vec2 st, in vec2 a, in vec2 b ) {
    vec2 b_to_a = b - a;
    vec2 to_a = st - a;
    float h = saturate(dot(to_a, b_to_a)/dot(b_to_a, b_to_a));
    return length(to_a - h * b_to_a );
}
float lineSDF(vec3 p, vec3 a, vec3 b) {
    return length(cross(p - a, p - b))/length(b - a);
}
#endif

#ifndef FNC_RECTSDF
#define FNC_RECTSDF
float rectSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float rectSDF(vec2 p, float b, float r) {
    return rectSDF(p, vec2(b), r);
}
float rectSDF(in vec2 st, in vec2 s) {
    #ifdef CENTER_2D
        st -= CENTER_2D;
        st *= 2.0;
    #else
        st = st * 2.0 - 1.0;
    #endif
    return max( abs(st.x / s.x),
                abs(st.y / s.y) );
}
float rectSDF(in vec2 st, in float s) {
    return rectSDF(st, vec2(s) );
}
float rectSDF(in vec2 st) {
    return rectSDF(st, vec2(1.0));
}
#endif

#ifndef FNC_CROSSSDF
#define FNC_CROSSSDF
float crossSDF(in vec2 st, in float s) {
    vec2 size = vec2(.25, s);
    return min(rectSDF(st.xy, size.xy),
                rectSDF(st.xy, size.yx));
}
#endif

#ifndef FNC_ROTATE2D
#define FNC_ROTATE2D
mat2 rotate2d(in float r){
    float c = cos(r);
    float s = sin(r);
    return mat2(c, -s, s, c);
}
#endif

#ifndef FNC_ROTATE4D
#define FNC_ROTATE4D
mat4 rotate4d(in vec3 a, in float r) {
    a = normalize(a);
    float s = sin(r);
    float c = cos(r);
    float oc = 1.0 - c;
    return mat4(oc * a.x * a.x + c,      oc * a.x * a.y - a.z * s,  oc * a.z * a.x + a.y * s,  0.0,
                oc * a.x * a.y + a.z * s,  oc * a.y * a.y + c,        oc * a.y * a.z - a.x * s,  0.0,
                oc * a.z * a.x - a.y * s,  oc * a.y * a.z + a.x * s,  oc * a.z * a.z + c,        0.0,
                0.0,                       0.0,                       0.0,                       1.0);
}
#endif

#ifndef FNC_ROTATE
#define FNC_ROTATE
vec2 rotate(in vec2 v, in float r, in vec2 c) {
    return rotate2d(r) * (v - c) + c;
}
vec2 rotate(in vec2 v, in float r) {
    #ifdef CENTER_2D
    return rotate(v, r, CENTER_2D);
    #else
    return rotate(v, r, vec2(.5));
    #endif
}
vec2 rotate(vec2 v, vec2 x_axis) {
    #ifdef CENTER_2D
    v -= CENTER_2D;
    #endif
    vec2 rta = vec2( dot(v, vec2(-x_axis.y, x_axis.x)), dot(v, x_axis) );
    #ifdef CENTER_2D
    rta += CENTER_2D;
    #endif
    return rta;
}
vec3 rotate(in vec3 v, in float r, in vec3 axis, in vec3 c) {
    return (rotate4d(axis, r) * vec4(v - c, 1.)).xyz + c;
}
vec3 rotate(in vec3 v, in float r, in vec3 axis) {
    #ifdef CENTER_3D
    return rotate(v, r, axis, CENTER_3D);
    #else
    return rotate(v, r, axis, vec3(0.));
    #endif
}
vec4 rotate(in vec4 v, in float r, in vec3 axis, in vec4 c) {
    return rotate4d(axis, r) * (v - c) + c;
}
vec4 rotate(in vec4 v, in float r, in vec3 axis) {
    #ifdef CENTER_4D
    return rotate(v, r, axis, CENTER_4D);
    #else
    return rotate(v, r, axis, vec4(0.));
    #endif
}
#if defined(FNC_QUATMULT)
vec3 rotate(QUAT q, vec3 v) {
    QUAT q_c = QUAT(-q.x, -q.y, -q.z, q.w);
    return quatMul(q, quatMul(vec4(v, 0), q_c)).xyz;
}
vec3 rotate(QUAT q, vec3 v, vec3 c) {
    vec3 dir = v - c;
    return c + rotate(q, dir);
}
#endif
#endif

vec3 hash3D(vec2 x)
{
    uvec3 v = uvec3(x.xyx * 65536.0) * 1664525u + 1013904223u;
    v += v.yzx * v.zxy;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return vec3(v) * (1.0 / float(0xffffffffu));
}

void staticNoise(vec3 color, float scale, float distribution, float rotation, bool random_opacity, bool random_rotation, bool multicolor){
    vec2 st = gl_FragCoord.xy / u_resolution.x;
    st *= u_resolution / scale;
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);
    st = fpos;
    if (random_rotation == true) {
        rotation = rand(ipos) * 360.;
    }
    st = rotate(st, rotation * PI/180.);
    float opacity = 1.0;
    if (random_opacity == true) {
        opacity = rand(ipos * u_random_seed);
    }
    float amt = hash3D(hash3D(ipos).xy).x;
    vec2 center = vec2(u_resolution / scale*0.5 - 0.5);
    float dist = distance(ipos,center);
    float v = (1.0 - (dist/center.x*(u_vignette)));
    opacity *= pow(v,20.);
    if (u_color_random == true){
        color = hash3D(ipos);
    }
    float shape = 1.;
    if(u_shape[0]){
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity);
    }
    if(u_shape[1]){
        shape = fill(circleSDF(st),1.0);
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity * shape);
    }
    if(u_shape[2]){
        shape = fill(triSDF(st),1.0);
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity * shape);
    }
    if(u_shape[3]){
        shape = fill(rectSDF(rotate(st,45. * PI/180.),vec2(0.71)),1.0);
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity * shape);
    }
    if(u_shape[4]){
        shape = fill(lineSDF(st,vec2(1.0),vec2(0.0)),(u_resolution.x / scale)*0.001);
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity * shape);
    }
    if(u_shape[5]){
        shape = fill(crossSDF(st,1.0),1.0);
        gl_FragColor = vec4(vec3(color),step(1.0 - distribution,amt) * opacity * shape);
    }
    if(u_shape[6]){
        float vis = aspectScale(st, u_shape_image_resolution.x, u_shape_image_resolution.y);
        vec4 image = vec4(1.0);
        image = texture2D(u_shape_image, st);
        image.a *= step(1.0 - distribution,amt) * vis * opacity;
        gl_FragColor = image;
    }
}

void main() {
    staticNoise(u_color, u_size, u_amount, u_rotation, u_opacity_random, u_rotation_random, u_color_random);
}
`;

type MeshRef = THREE.Mesh | null;

function TextureMesh() {
  const mesh = useRef<MeshRef>(null);

  const uniforms = useMemo(
    () => ({
      u_size: { value: 2 },
      u_amount: { value: 0.125 },
      u_vignette: { value: 0 },
      u_opacity_random: { value: true },
      u_random_seed: { value: 0.3347524829093338 },
      u_shape: { value: [true, false, false, false, false, false, false] },
      u_shape_image: { value: {} },
      u_rotation: { value: 0 },
      u_rotation_random: { value: false },
      u_color_random: { value: false },
      u_aa_passes: { value: 2 },
      u_color: { value: new THREE.Vector3(1, 1, 1) },
      u_shape_image_resolution: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(1024, 1024) },
    }),
    [],
  );

  useFrame((state) => {
    const { clock, mouse, gl } = state;
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.u_mouse.value.set(mouse.x / 2 + 0.5, mouse.y / 2 + 0.5);
      material.uniforms.u_time.value = clock.getElapsedTime();
      const c = gl.domElement.getBoundingClientRect();
      material.uniforms.u_resolution.value.set(c.width, c.height);
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1} rotation={[0, 0, 0]}>
      <planeGeometry args={[1024, 1024]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
        wireframeLinewidth={0}
        dithering={false}
        glslVersion={THREE.GLSL1}
      />
    </mesh>
  );
}

// Define the props type to include className
type StaticNoiseProps = {
  className?: string;
};

// Add the props to the component's function signature
export default function StaticNoise({ className }: StaticNoiseProps) {
  return (
    <Canvas
      className={className} // Pass the className to the Canvas component
      gl={{
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      resize={{
        debounce: 0,
        scroll: false,
        offsetSize: true,
      }}
      dpr={1}
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
      }}
    >
      <TextureMesh />
    </Canvas>
  );
}
