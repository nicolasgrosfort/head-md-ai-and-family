import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uProgress;
  uniform float uAppearScale;
  uniform vec3 uAmplitude;
  uniform float uPointSize;
  uniform float uMinPointSize;
  uniform float uMaxPointSize;
  uniform float uDepthScale;

  attribute vec3 originalPosition;

  varying vec3 vColor;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vColor = color;

    // Seuil d'apparition basé sur la position → zones cohérentes
    float appearThreshold = (snoise(originalPosition * uAppearScale) + 1.0) / 2.0;

    if (uProgress < appearThreshold) {
      gl_Position = vec4(9999.0, 9999.0, 9999.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }

    float t = uTime * uSpeed;
    vec3 pos = originalPosition * uScale;

    vec3 displaced = originalPosition + vec3(
      snoise(vec3(pos.x, pos.y, pos.z        ) + t) * uAmplitude.x,
      snoise(vec3(pos.x, pos.y, pos.z + 100.0) + t) * uAmplitude.y,
      snoise(vec3(pos.x, pos.y, pos.z + 200.0) + t) * uAmplitude.z
    );

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float depth = max(0.1, -mvPosition.z);
    float size = uPointSize * (uDepthScale / depth);
    gl_PointSize = clamp(size, uMinPointSize, uMaxPointSize);
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    vec3 corrected = pow(vColor, vec3(1.0 / 2.2));
    gl_FragColor = vec4(corrected, 1.0);
  }
`;

interface FloatOptions {
  amplitude?: { x: number; y: number; z: number };
  speed?: number;
  scale?: number;
  appearDuration?: number;
  appearScale?: number;
  pointSize?: number;
}

export function useFloatingPLY(
  geometry: THREE.BufferGeometry,
  options: FloatOptions = {},
) {
  const {
    amplitude = { x: 0.02, y: 0.02, z: 0.02 },
    speed = 0.1,
    scale = 1.0,
    appearDuration = 3.0,
    appearScale = 2.0,
    pointSize = 1.0,
  } = options;

  const ref = useRef<THREE.Points>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uAppearScale: { value: appearScale },
        uPointSize: { value: pointSize },
        uMinPointSize: { value: 0.5 },
        uMaxPointSize: { value: 4.0 },
        uDepthScale: { value: 1.0 },
        uAmplitude: {
          value: new THREE.Vector3(amplitude.x, amplitude.y, amplitude.z),
        },
      },
      vertexColors: true,
    }),
  );

  useMemo(() => {
    const positions = geometry.attributes.position.array;
    geometry.setAttribute(
      "originalPosition",
      new THREE.BufferAttribute(Float32Array.from(positions), 3),
    );
  }, [geometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = t;
    materialRef.current.uniforms.uProgress.value = Math.min(
      t / appearDuration,
      1.0,
    );
  });

  return { ref, material: materialRef };
}
