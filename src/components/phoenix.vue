<script setup lang="ts">
import {ref, defineProps, onMounted} from 'vue'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {clone} from "../utils/three";
const ph = ref<HTMLElement | null>(null)
const {refName,height,width} = defineProps(['refName','height','width'])
const phoenix = () => {
  let container
  let camera, scene, renderer
  let mesh = [], mixer = []
  let controls,bloomComposer,meshAxis
  let theta = 0
  let speed = [0.0004,0.0003]
  let prevTime = Date.now()
  function init() {
    container = ph.value
    let width = container.offsetWidth
    let height = container.offsetHeight
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
    camera.position.set(0,0,5000)

    scene = new THREE.Scene()

    const light1 = new THREE.DirectionalLight(0xFFFFFF, 1)
    light1.position.set(1, 1, 0).normalize()
    scene.add(light1)

    const loader = new GLTFLoader()
    //凤凰
    loader.load('//video.czketeng.com/scene.glb',  (gltf: { scene: { clone: () => any; }; animations: any[]; })=> {
      let mesh1 = clone(gltf.scene)
      let mesh2 = clone(gltf.scene)

      mesh1.position.set(0,0,0)
      mesh1.scale.set(1,1,1) //正常大小
      // mesh1.rotateY(-Math.PI/4) //旋转角度
      mesh2.position.set(0,500,0)

      let mixer1 = new THREE.AnimationMixer(mesh1)
      let mixer2 = new THREE.AnimationMixer(mesh2)
      mixer1.clipAction(gltf.animations[0]).setDuration(1).play()
      mixer2.clipAction(gltf.animations[0]).setDuration(1).play()
      scene.add(mesh1,mesh2);
      mesh.push(mesh1,mesh2);
      mixer.push(mixer1,mixer2);

      loader.load('//video.czketeng.com/nss.glb', (gltf: { scene: any; })=>{//星河

        const sprite = new THREE.TextureLoader().load( '/public/static/three/texture/disc.png' );

        let mesh3 = gltf.scene
        mesh3.children[0].material.size = 15
        mesh3.children[0].material.map = sprite
        mesh3.children[0].material.sizeAttenuation = true
        mesh3.children[0].material.alphaTest = 0.5
        mesh3.children[0].material.transparent = true
        mesh.push(mesh3)
        mesh3.rotateX(Math.PI/10)
        mesh3.position.set(-4500,-4500,1000)
        mesh3.scale.set(30,30,30) //5倍
        scene.add(mesh3)
      })
    })

    renderer = new THREE.WebGLRenderer( {alpha: true } );
    renderer.autoClear = false
    //您可以将透明颜色保留为默认值。
    renderer.setClearColor( 0x000,0); //default
    renderer.setPixelRatio(window.devicePixelRatio) //像素比
    renderer.setSize(width, height)
    renderer.outputEncoding = THREE.sRGBEncoding //真彩色，不加的话颜色会与ps中图像看上去的不同
    container.appendChild(renderer.domElement)

    controls = new OrbitControls(camera,renderer.domElement);// 初始化控制器
    controls.target.set(0, 0, 0);// 设置控制器的焦点，使控制器围绕这个焦点进行旋转

    /*通道*/
    const pass = {
      renderScene: new RenderPass(scene, camera),
      bloomPass: new UnrealBloomPass(
          ...Object.values({
            resolution : undefined,
            strength : 4,
            radius : 0.5,
            threshold : 0
          })
      )
    }
    pass.bloomPass.renderToScreen = false

    //创建效果组合器对象，可以在该对象上添加后期处理通道，通过配置该对象，使它可以渲染我们的场景，并应用额外的后期处理步骤，在render循环中，使用EffectComposer渲染场景、应用通道，并输出结果。
    bloomComposer = new EffectComposer(renderer)
    bloomComposer.setSize(width, height);
    bloomComposer.addPass(pass.renderScene);
    bloomComposer.addPass(pass.bloomPass);

    meshAxis = new THREE.Vector3(0,1,0)
  }
  function animate() {
    requestAnimationFrame(animate)
    render()
    /*泛光渲染*/
    bloomComposer.render()
  }
  function render() {
    theta += 0.01
    /*相机的位置*/
    /*相机看向的位置*/
    camera.lookAt(0, 0, 0)

    if (mixer) {
      const time = Date.now()
      let t = time - prevTime
      if(mixer[0] !== undefined){
        mesh[2].rotateOnAxis(meshAxis,(t) * -Math.PI/1000000)
        mesh[0].position.x += 100 * 0.03 * Math.sin(THREE.MathUtils.degToRad(theta))
        mesh[1].position.x += 50 * 0.03 * Math.sin(THREE.MathUtils.degToRad(theta))
        mesh[0].position.z += 100 * 0.03 * Math.sin(THREE.MathUtils.degToRad(theta)) * Math.tan(22.5)
        if(mesh[0].position.x > mesh[1].position.x +700){
          speed[0] = 0.00025
        }else if(mesh[0].position.x + 800 < mesh[1].position.x){
          speed[0] = 0.0004
        }
        mixer[0].update((t)* speed[0])
        mixer[1].update((t)* speed[1])
      }
      prevTime = time
    }
    renderer.render(scene, camera)
  }

  init()
  animate()
}
onMounted(()=>{
  phoenix()
})
</script>

<template>
  <div ref="ph" :style="{width:width,height:height}"></div>
</template>

<style scoped>

</style>
