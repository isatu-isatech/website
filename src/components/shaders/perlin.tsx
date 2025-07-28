"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface TextureMeshProps {
  color?: string | number | THREE.Color;
  size?: number;
  phase?: number;
  gain?: number;
  octaves?: number;
  lacunarity?: number;
  factor?: number;
  width?: number;
  aaPasses?: number;
  planeSize?: [number, number];
  useMouse?: boolean;
}

const convertColor = (color: string | number | THREE.Color | undefined) => {
  const threeColor = new THREE.Color();
  if (color) {
    if (typeof color === "string") {
      threeColor.set(color);
    } else if (typeof color === "number") {
      threeColor.set(color);
    } else {
      threeColor.copy(color);
    }
  }
  return threeColor;
};

// Shader code moved outside the component for performance
const fragmentShader = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color;
uniform float u_size;
uniform float u_factor;
uniform float u_gain;
uniform int u_octaves;
uniform float u_phase;
uniform float u_lacunarity;
uniform float u_width;
uniform float u_aa_passes;

uint ihash1D(uint q) {
  q = (q << 13u) ^ q;
  return q * (q * q * 15731u + 789221u) + 1376312589u;
}

uvec4 ihash1D(uvec4 q) {
  q = (q << 13u) ^ q;
  return q * (q * q * 15731u + 789221u) + 1376312589u;
}

float hash1D(vec2 x) {
  uvec2 q = uvec2(x * 65536.0);
  q = 1103515245u * ((q >> 1u) ^ q.yx);
  uint n = 1103515245u * (q.x ^ (q.y >> 3u));
  return float(n) * (1.0 / float(0xffffffffu));
}

vec2 hash2D(vec2 x) {
  uvec4 q = uvec2(x * 65536.0).xyyx + uvec2(0u, 3115245u).xxyy;
  q = 1103515245u * ((q >> 1u) ^ q.yxwz);
  uvec2 n = 1103515245u * (q.xz ^ (q.yw >> 3u));
  return vec2(n) * (1.0 / float(0xffffffffu));
}

vec3 hash3D(vec2 x) {
  uvec3 v = uvec3(x.xyx * 65536.0) * 1664525u + 1013904223u;
  v += v.yzx * v.zxy;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3(v) * (1.0 / float(0xffffffffu));
}

vec4 hash4D(vec2 x) {
  uvec4 v = uvec4(x.xyyx * 65536.0) * 1664525u + 1013904223u;
  v += v.yzxy * v.wxyz;
  v.x += v.y * v.w;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v.w += v.y * v.z;
  v.x += v.y * v.w;
  v.w += v.y * v.z;
  v ^= v >> 16u;
  return vec4(v ^ (v >> 16u)) * (1.0 / float(0xffffffffu));
}

vec4 hash4D(vec4 x) {
  uvec4 v = uvec4(x * 65536.0) * 1664525u + 1013904223u;
  v += v.yzxy * v.wxyz;
  v.x += v.y * v.w;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v.w += v.y * v.z;
  v.x += v.y*v.w;
  v.y += v.z*v.x;
  v.z += v.x*v.y;
  v.w += v.y*v.z;
  v ^= v >> 16u;
  return vec4(v ^ (v >> 16u)) * (1.0 / float(0xffffffffu));
}

vec2 betterHash2D(vec2 x) {
  uvec2 q = uvec2(x);
  uint h0 = ihash1D(ihash1D(q.x) + q.y);
  uint h1 = h0 * 1933247u + ~h0 ^ 230123u;
  return vec2(h0, h1)  * (1.0 / float(0xffffffffu));
}

vec4 betterHash2D(vec4 cell) {
  uvec4 i = uvec4(cell) + 101323u;
  uvec4 hash = ihash1D(ihash1D(i.xzxz) + i.yyww);
  return vec4(hash) * (1.0 / float(0xffffffffu));
}

void betterHash2D(vec4 cell, out vec4 hashX, out vec4 hashY) {
  uvec4 i = uvec4(cell) + 101323u;
  uvec4 hash0 = ihash1D(ihash1D(i.xzxz) + i.yyww);
  uvec4 hash1 = ihash1D(hash0 ^ 1933247u);
  hashX = vec4(hash0) * (1.0 / float(0xffffffffu));
  hashY = vec4(hash1) * (1.0 / float(0xffffffffu));
}

void betterHash2D(vec4 coords0, vec4 coords1, out vec4 hashX, out vec4 hashY) {
  uvec4 hash0 = ihash1D(ihash1D(uvec4(coords0.xz, coords1.xz)) + uvec4(coords0.yw, coords1.yw));
  uvec4 hash1 = hash0 * 1933247u + ~hash0 ^ 230123u;
  hashX = vec4(hash0) * (1.0 / float(0xffffffffu));
  hashY = vec4(hash1) * (1.0 / float(0xffffffffu));
}

void betterHash3D(vec3 cell, vec3 cellPlusOne, out vec4 lowHash, out vec4 highHash) {
  uvec4 cells = uvec4(cell.xy, cellPlusOne.xy);
  uvec4 hash = ihash1D(ihash1D(cells.xzxz) + cells.yyww);
  lowHash = vec4(ihash1D(hash + uint(cell.z))) * (1.0 / float(0xffffffffu));
  highHash = vec4(ihash1D(hash + uint(cellPlusOne.z))) * (1.0 / float(0xffffffffu));
}

#define multiHash2D betterHash2D
#define multiHash3D betterHash3D

void smultiHash2D(vec4 cell, out vec4 hashX, out vec4 hashY) {
  multiHash2D(cell, hashX, hashY);
  hashX = hashX * 2.0 - 1.0;
  hashY = hashY * 2.0 - 1.0;
}

float noiseInterpolate(const in float x) {
  float x2 = x * x;
  return x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
}
vec2 noiseInterpolate(const in vec2 x) {
  vec2 x2 = x * x;
  return x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
}
vec3 noiseInterpolate(const in vec3 x) {
  vec3 x2 = x * x;
  return x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
}
vec4 noiseInterpolate(const in vec4 x) {
  vec4 x2 = x * x;
  return x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
}
vec2 noiseInterpolateDu(const in float x) {
  float x2 = x * x;
  float u = x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
  float du = 30.0 * x2 * (x * (x - 2.0) + 1.0);
  return vec2(u, du);
}
vec4 noiseInterpolateDu(const in vec2 x) {
  vec2 x2 = x * x;
  vec2 u = x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * x2 * (x * (x - 2.0) + 1.0);
  return vec4(u, du);
}
void noiseInterpolateDu(const in vec3 x, out vec3 u, out vec3 du) {
  vec3 x2 = x * x;
  u = x2 * x * (x * (x * 6.0 - 15.0) + 10.0);
  du = 30.0 * x2 * (x * (x - 2.0) + 1.0);
}

float distanceMetric(vec2 pos, uint metric) {
  switch (metric) {
    case 0u:
      return dot(pos, pos);
    case 1u:
      return dot(abs(pos), vec2(1.0));
    case 2u:
      return max(abs(pos.x), abs(pos.y));
    default:
      return  max(abs(pos.x) * 0.866025 + pos.y * 0.5, -pos.y);
  }
}

vec4 distanceMetric(vec4 px, vec4 py, uint metric) {
  switch (metric) {
    case 0u:
      return px * px + py * py;
    case 1u:
      return abs(px) + abs(py);
    case 2u:
      return max(abs(px), abs(py));
    default:
      return max(abs(px) * 0.866025 + py * 0.5, -py);
  }
}

float perlinNoise(vec2 pos, vec2 scale, float seed) {
  pos *= scale;
  vec4 i = floor(pos).xyxy + vec2(0.0, 1.0).xxyy;
  vec4 f = (pos.xyxy - i.xyxy) - vec2(0.0, 1.0).xxyy;
  i = mod(i, scale.xyxy) + seed;
  vec4 gradientX, gradientY;
  multiHash2D(i, gradientX, gradientY);
  gradientX -= 0.49999;
  gradientY -= 0.49999;
  vec4 gradients = inversesqrt(gradientX * gradientX + gradientY * gradientY) * (gradientX * f.xzxz + gradientY * f.yyww);
  gradients *= 2.3703703703703703703703703703704;
  vec4 lengthSq = f * f;
  lengthSq = lengthSq.xzxz + lengthSq.yyww;
  vec4 xSq = 1.0 - min(vec4(1.0), lengthSq);
  xSq = xSq * xSq * xSq;
  return dot(xSq, gradients);
}
float perlinNoise(vec2 pos, vec2 scale, mat2 transform, float seed) {
  pos *= scale;
  vec4 i = floor(pos).xyxy + vec2(0.0, 1.0).xxyy;
  vec4 f = (pos.xyxy - i.xyxy) - vec2(0.0, 1.0).xxyy;
  i = mod(i, scale.xyxy) + seed;
  vec4 gradientX, gradientY;
  multiHash2D(i, gradientX, gradientY);
  gradientX -= 0.49999;
  gradientY -= 0.49999;
  vec4 m = vec4(transform);
  vec4 rg = vec4(gradientX.x, gradientY.x, gradientX.y, gradientY.y);
  rg = rg.xxzz * m.xyxy + rg.yyww * m.zwzw;
  gradientX.xy = rg.xz;
  gradientY.xy = rg.yw;
  rg = vec4(gradientX.z, gradientY.z, gradientX.w, gradientY.w);
  rg = rg.xxzz * m.xyxy + rg.yyww * m.zwzw;
  gradientX.zw = rg.xz;
  gradientY.zw = rg.yw;
  vec4 gradients = inversesqrt(gradientX * gradientX + gradientY * gradientY) * (gradientX * f.xzxz + gradientY * f.yyww);
  gradients *= 2.3703703703703703703703703703704;
  f = f * f;
  f = f.xzxz + f.yyww;
  vec4 xSq = 1.0 - min(vec4(1.0), f);
  return dot(xSq * xSq * xSq, gradients);
}
float perlinNoise(vec2 pos, vec2 scale, float rotation, float seed) {
  vec2 sinCos = vec2(sin(rotation), cos(rotation));
  return perlinNoise(pos, scale, mat2(sinCos.y, sinCos.x, -sinCos.x, sinCos.y), seed);
}

float fbmPerlin(vec2 pos, vec2 scale, int octaves, float shift, float axialShift, float gain, float lacunarity, uint mode, float factor, float offset, float seed) {
  float amplitude = gain;
  vec2 frequency = floor(scale);
  float angle = axialShift;
  float n = 1.0;
  vec2 p = fract(pos) * frequency;
  float value = 0.0;
  for (int i = 0; i < octaves; i++) {
    float pn = perlinNoise(p / frequency, frequency, angle, seed) + offset;
    if (mode == 0u) {
      n *= abs(pn);
    } else if (mode == 1u) {
      n = abs(pn);
    } else if (mode == 2u) {
      n = pn;
    } else if (mode == 3u) {
      n *= pn;
    } else if (mode == 4u) {
      n = pn * 0.5 + 0.5;
    } else {
      n *= pn * 0.5 + 0.5;
    }
    n = pow(n < 0.0 ? 0.0 : n, factor);
    value += amplitude * n;
    p = p * lacunarity + shift;
    frequency *= lacunarity;
    amplitude *= gain;
    angle += axialShift;
  }
  return value;
}

float perlinNoiseWarp(vec2 pos, vec2 scale, float strength, float phase, float factor, float spread, float seed) {
  vec2 offset = vec2(spread, 0.0);
  strength *= 32.0 / max(scale.x, scale.y);
  vec4 gp;
  gp.x = perlinNoise(pos - offset.xy, scale, phase, seed);
  gp.y = perlinNoise(pos + offset.xy, scale, phase, seed);
  gp.z = perlinNoise(pos - offset.yx, scale, phase, seed);
  gp.w = perlinNoise(pos + offset.yx, scale, phase, seed);
  gp = pow(gp, vec4(factor));
  vec2 warp = vec2(gp.y - gp.x, gp.w - gp.z);
  return pow(perlinNoise(pos + warp * strength, scale, phase, seed), factor);
}

vec4 fragmentColor(in vec2 fragCoord) {
  vec2 uv = fragCoord.xy / u_resolution.x;
  vec2 p = fract(uv);
  vec2 scale = vec2(int(u_resolution.x / u_size/8.));
  float value = fbmPerlin(p, scale, int(u_octaves), u_phase * 100., u_phase, u_gain * 2., floor(u_lacunarity), 4u, u_factor, 0.0, 0.0);
  float f = fract(value * 10.0);
  value = step(1. - u_width, f);
  return vec4(u_color, value);
}

void main() {
  vec4 fragColor = vec4(0.0);
  float A = u_aa_passes;
  float s = 1. / A;
  float x, y;
  for (x = -.5; x < .5; x += s) {
    for (y = -.5; y < .5; y += s) {
      fragColor += min(fragmentColor(vec2(x, y) + gl_FragCoord.xy), 1.0);
    }
  }
  fragColor /= A * A;
  gl_FragColor = fragColor;
}
`;

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const TextureMesh = ({
  color,
  size = 32,
  phase = 0,
  gain = 0.4,
  octaves = 1,
  lacunarity = 1,
  factor = 1,
  width = 0.1,
  aaPasses = 2,
  planeSize = [100, 100],
  useMouse = true,
}: TextureMeshProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { gl, mouse } = useThree();

  const uniforms = useMemo(() => {
    const threeColor = convertColor(color);
    return {
      u_size: { value: size },
      u_phase: { value: phase },
      u_gain: { value: gain },
      u_octaves: { value: octaves },
      u_lacunarity: { value: lacunarity },
      u_factor: { value: factor },
      u_width: { value: width },
      u_aa_passes: { value: aaPasses },
      u_color: {
        value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b),
      },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: {
        value:
          typeof window !== "undefined"
            ? new THREE.Vector2(window.innerWidth, window.innerHeight)
            : new THREE.Vector2(1, 1),
      },
    };
  }, [color, size, phase, gain, octaves, lacunarity, factor, width, aaPasses]);

  // Update resolution uniform only when the canvas size changes
  const resolutionRef = useRef<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (
      !mesh.current ||
      !(mesh.current.material instanceof THREE.ShaderMaterial)
    )
      return;

    const material = mesh.current.material;
    const canvas = gl.domElement;

    const updateResolution = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (
        resolutionRef.current.width !== width ||
        resolutionRef.current.height !== height
      ) {
        resolutionRef.current = { width, height };
        material.uniforms.u_resolution.value.set(width, height);
      }
    };

    // Initial call
    updateResolution();

    const resizeObserver = new ResizeObserver(updateResolution);
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [gl]);

  // This hook runs on every frame and updates the time and mouse uniforms.
  useFrame(({ clock }) => {
    if (mesh.current && mesh.current.material instanceof THREE.ShaderMaterial) {
      const material = mesh.current.material;
      material.uniforms.u_time.value = clock.getElapsedTime();
      if (useMouse) {
        material.uniforms.u_mouse.value.set(
          mouse.x / 2 + 0.5,
          mouse.y / 2 + 0.5,
        );
      }
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1} rotation={[0, 0, 0]}>
      <planeGeometry args={planeSize} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
        dithering={false}
        glslVersion={THREE.GLSL1}
      />
    </mesh>
  );
};

// Main component that renders the Canvas.
interface PerlinNoiseTextureProps extends TextureMeshProps {
  className?: string;
}

export default function PerlinNoiseTexture({
  className,
  ...rest
}: PerlinNoiseTextureProps) {
  return (
    <div className={className}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
          alpha: true,
          antialias: true,
          precision: "highp",
          powerPreference: "high-performance",
        }}
        dpr={1}
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5],
        }}
      >
        <TextureMesh {...rest} />
      </Canvas>
    </div>
  );
}
