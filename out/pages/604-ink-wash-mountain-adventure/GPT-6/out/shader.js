import * as THREE from "./vendor/three.module.js";

export function inkMaterial(color)
{
    return new THREE.ShaderMaterial(
    {
        uniforms:
        {
            inkColor: { value: new THREE.Color(color) },
            fogColor: { value: new THREE.Color("#e4e6d9") },
            fogNear: { value: 24 },
            fogFar: { value: 118 }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vWorld;
            varying float vDepth;
            void main()
            {
                vec4 local = vec4(position, 1.0);
                vec3 localNormal = normal;
                #ifdef USE_INSTANCING
                    local = instanceMatrix * local;
                    localNormal = mat3(instanceMatrix) * normal;
                #endif
                vNormal = normalize(mat3(modelMatrix) * localNormal);
                vec4 world = modelMatrix * local;
                vWorld = world.xyz;
                vec4 view = viewMatrix * world;
                vDepth = -view.z;
                gl_Position = projectionMatrix * view;
            }`,
        fragmentShader: `
            uniform vec3 inkColor;
            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;
            varying vec3 vNormal;
            varying vec3 vWorld;
            varying float vDepth;
            float grain(vec2 p)
            {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            void main()
            {
                float light = dot(normalize(vNormal), normalize(vec3(-0.5, 1.0, 0.4)));
                float wash = floor((light * 0.5 + 0.5) * 4.0) / 4.0;
                float fiber = grain(floor(gl_FragCoord.xy * 0.7)) * 0.055;
                float brush = sin(vWorld.y * 8.0 + vWorld.x * 2.0) * 0.018;
                vec3 color = inkColor * (0.63 + wash * 0.40 + fiber + brush);
                float fog = smoothstep(fogNear, fogFar, vDepth);
                gl_FragColor = vec4(mix(color, fogColor, fog), 1.0);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }`,
        side: THREE.DoubleSide
    });
}

export function seeded(seed = 16271)
{
    return () =>
    {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}
