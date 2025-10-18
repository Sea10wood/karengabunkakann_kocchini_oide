"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type VideoWebGLProps = {
  className?: string;
};

export default function VideoWebGL({ className }: VideoWebGLProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const frameReqRef = useRef<number | null>(null);

  const vertexShader = useMemo(
    () => `
      varying vec2 vUv;

      void main(){
          vUv = uv;
          vec3 pos = position;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    []
  );

  const fragmentShader = useMemo(
    () => `
      precision highp float;
      
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uImageAspect;
      uniform float uPlaneAspect;
      uniform float uTime;
      uniform vec2 uResolution;

      float random(vec2 c){
        return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      // Simplex noise implementation
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
           return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r)
      {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise3(vec3 v)
        {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

      // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

      // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
        }

      void main(){
        vec2 ratio = vec2(
          min(uPlaneAspect / uImageAspect, 1.0),
          min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
        );

        vec2 fixedUv = vec2(
          (vUv.x - 0.5) * ratio.x + 0.5,
          (vUv.y - 0.5) * ratio.y + 0.5
        );

        const float interval = 5.0;
        float strength = smoothstep(interval * 0.5, interval, interval - mod(uTime, interval));
        
        vec2 shake = vec2(strength * 8.0 + 0.5) * vec2(
          random(vec2(uTime)) * 2.0 - 1.0,
          random(vec2(uTime * 2.0)) * 2.0 - 1.0
        ) / uResolution;

        float y = vUv.y * uResolution.y;
        float rgbWave = (
            snoise3(vec3(0.0, y * 0.01, uTime * 400.0)) * (2.0 + strength * 32.0)
            * snoise3(vec3(0.0, y * 0.02, uTime * 200.0)) * (1.0 + strength * 4.0)
            + step(0.9995, sin(y * 0.005 + uTime * 1.6)) * 12.0
            + step(0.9999, sin(y * 0.005 + uTime * 2.0)) * -18.0
          ) / uResolution.x;
        
        float rgbDiff = (6.0 + sin(uTime * 500.0 + vUv.y * 40.0) * (20.0 * strength + 1.0)) / uResolution.x;
        float rgbUvX = fixedUv.x + rgbWave;
        
        float r = texture2D(uTexture, vec2(rgbUvX + rgbDiff, fixedUv.y) + shake).r;
        float g = texture2D(uTexture, vec2(rgbUvX, fixedUv.y) + shake).g;
        float b = texture2D(uTexture, vec2(rgbUvX - rgbDiff, fixedUv.y) + shake).b;

        float whiteNoise = (random(vUv + mod(uTime, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

        float bnTime = floor(uTime * 20.0) * 200.0;
        float noiseX = step((snoise3(vec3(0.0, vUv.x * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
        float noiseY = step((snoise3(vec3(0.0, vUv.y * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
        float bnMask = noiseX * noiseY;
        float bnUvX = fixedUv.x + sin(bnTime) * 0.2 + rgbWave;
        float bnR = texture2D(uTexture, vec2(bnUvX + rgbDiff, fixedUv.y)).r * bnMask;
        float bnG = texture2D(uTexture, vec2(bnUvX, fixedUv.y)).g * bnMask;
        float bnB = texture2D(uTexture, vec2(bnUvX - rgbDiff, fixedUv.y)).b * bnMask;
        vec4 blockNoise = vec4(bnR, bnG, bnB, 1.0);

        float bnTime2 = floor(uTime * 25.0) * 300.0;
        float noiseX2 = step((snoise3(vec3(0.0, vUv.x * 2.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.5);
        float noiseY2 = step((snoise3(vec3(0.0, vUv.y * 8.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.3);
        float bnMask2 = noiseX2 * noiseY2;
        float bnR2 = texture2D(uTexture, vec2(bnUvX + rgbDiff, fixedUv.y)).r * bnMask2;
        float bnG2 = texture2D(uTexture, vec2(bnUvX, fixedUv.y)).g * bnMask2;
        float bnB2 = texture2D(uTexture, vec2(bnUvX - rgbDiff, fixedUv.y)).b * bnMask2;
        vec4 blockNoise2 = vec4(bnR2, bnG2, bnB2, 1.0);

        float waveNoise = (sin(vUv.y * 1200.0) + 1.0) / 2.0 * (0.15 + strength * 0.2);

        gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - bnMask - bnMask2) + (whiteNoise + blockNoise + blockNoise2 - waveNoise);
      }
    `,
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.z = 1.5;
    cameraRef.current = camera;

    const video = document.createElement("video");
    video.src = "/red-rennga.webm";
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    videoRef.current = video;

    const startPlayback = async () => {
      try {
        await video.play();
      } catch {
        // ユーザージェスチャー待ちの環境対策
      }

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;
      textureRef.current = videoTexture;

      const imageAspect = video.videoWidth / video.videoHeight || 16 / 9;
      const planeAspect = width / height;

      const uniforms: Record<string, THREE.IUniform> = {
        uTexture: { value: videoTexture },
        uImageAspect: { value: imageAspect },
        uPlaneAspect: { value: planeAspect },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      };

      const geo = new THREE.PlaneGeometry(1, 1, 100, 100);
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      // カメラ視体積に基づき、キャンバス全体を覆うサイズにスケール
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const visibleWidth = visibleHeight * (width / height);
      mesh.scale.set(visibleWidth, visibleHeight, 1);
      meshRef.current = mesh;
      scene.add(mesh);

      const renderLoop = () => {
        const mat = mesh.material as THREE.ShaderMaterial;
        if (mat && mat.uniforms) {
          // 時間ベースのアニメーション（秒単位）
          mat.uniforms.uTime.value = performance.now() * 0.001;
        }

        renderer.render(scene, camera);
        frameReqRef.current = requestAnimationFrame(renderLoop);
      };
      renderLoop();
    };

    const onCanPlay = () => startPlayback();
    const onLoadedData = () => startPlayback();
    const onPlay = () => startPlayback();
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("play", onPlay);

    const onResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
      if (mat) {
        mat.uniforms.uPlaneAspect.value = w / h;
        mat.uniforms.uResolution.value.set(w, h);
      }
      // 視体積に合わせてメッシュもスケールを更新
      if (meshRef.current) {
        const fovRad2 = (camera.fov * Math.PI) / 180;
        const visH = 2 * Math.tan(fovRad2 / 2) * camera.position.z;
        const visW = visH * (w / h);
        meshRef.current.scale.set(visW, visH, 1);
      }
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("play", onPlay);
      resizeObserver.disconnect();
      if (frameReqRef.current) cancelAnimationFrame(frameReqRef.current);
      if (rendererRef.current) {
        const el = rendererRef.current.domElement;
        el.parentElement?.removeChild(el);
        rendererRef.current.dispose();
      }
      textureRef.current?.dispose();
      if (meshRef.current) {
        (meshRef.current.geometry as THREE.BufferGeometry).dispose();
        (meshRef.current.material as THREE.Material).dispose();
      }
    };
  }, [fragmentShader, vertexShader]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1
      }} 
    />
  );
}


