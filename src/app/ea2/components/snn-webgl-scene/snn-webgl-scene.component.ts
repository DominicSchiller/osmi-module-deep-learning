import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Mesh } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { LIFNeuronData } from '../../model/snn/lif/lif-simulation-model';
import { LIFNeuronState } from '../../model/snn/lif/neurons/lif-neuron';
import { LIFSynapticNeuron } from '../../model/snn/lif/neurons/lif-synaptic-neuron';
import { LIFSimulationService } from '../../services/snn/lif/lif-simulation.service';

@Component({
  selector: 'app-snn-webgl-scene',
  templateUrl: './snn-webgl-scene.component.html',
  styleUrls: ['./snn-webgl-scene.component.scss'],
})
export class SnnWebglSceneComponent implements OnInit {

  constructor(public lifSimulationService: LIFSimulationService) { 

    lifSimulationService.neuronData.subscribe(neuronData => {
      this.neuronData = neuronData

      if (this.neuronData) {
        if (!this.renderer) {
          this.initScene()
          this.updateNeuronsState()
        } else {
          this.updateNeuronsState()
        }
      }
    });

  }

  @ViewChild('webglSceneWrapper')
  private webGLScaneWrapper: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  neurons: THREE.Mesh[] = [];
  neuronData: LIFNeuronData

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.neurons.length > 0) {
        this.initScene();
      }
    }, 100);
  }

  private async initScene() {

    const width =  this.webGLScaneWrapper.nativeElement.offsetWidth;
    const height =  this.webGLScaneWrapper.nativeElement.offsetHeight;

    console.info('WebGL Scene size: ', width, height);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
    this.camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      1000
    );
    this.camera.position.set(-25, 50, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    console.log("Device pixel ration: ", window.devicePixelRatio)

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.webGLScaneWrapper.nativeElement.appendChild(this.renderer.domElement);


    // setup controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    // How far you can orbit vertically, upper and lower limits.
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    // How far you can dolly in and out ( PerspectiveCamera only )
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    
    controls.enableZoom = true; // Set to false to disable zooming
    controls.zoomSpeed = 1.0;
    controls.enablePan = true;

    this.addAmbientLight();
    // this.addDirectionalLight();

    // create neurons
    const n = this.neuronData.neurons.length
    let neurons: THREE.Mesh[] = []
    for (var i=0; i<n; i++) {
      let randomXPos = this.randomIntFromInterval(-100, 100)
      let randomYPos = this.randomIntFromInterval(-36, 36) 
      let randomZPos = this.randomIntFromInterval(-50, 50)
      let neuron = this.createSphere(1, 23, 23, `sphere-${i}`, randomXPos, randomYPos, randomZPos)
      neurons.push(neuron)
    }

    this.neurons = neurons

    // draw Connections
    for(var i=0; i<this.neuronData.connectionsMap.length; i++) {
      let postConnections = this.neuronData.connectionsMap[i];
      for (var postIndex of postConnections) {
        // create tube line
        var lineMaterial = new THREE.LineBasicMaterial({ color: 'rgb(207, 207, 207)' });
        let startVector = neurons[i].position
        let endVector = neurons[postIndex].position
        let linePoints = [];
        linePoints.push(startVector, endVector);

        // Create Tube Geometry
        var tubeGeometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(linePoints),
          512,// path segments
          0.025,// THICKNESS
          8, //Roundness of Tube
          true //closed
        );

        let line = new THREE.Line(tubeGeometry, lineMaterial);
        this.scene.add(line);
      }
    }

    for(let neuron of neurons) {
      this.scene.add(neuron)
      this.scene.add(this.createOutline(neuron as Mesh, 'rgb(43, 202, 255)'))
    }

    // click handling
    this.webGLScaneWrapper.nativeElement.addEventListener('click', (event) => { this.onHandleClick(event); }, false);

    this.update();
  }

  updateNeuronsState() {
    for (var i=0; i<this.neuronData.neurons.length; i++) {
      let neuron = this.neurons[i]
      let rawNeuron = this.neuronData.neurons[i]
      let outline = this.scene.getObjectByName(`${neuron.name}-outline`) as THREE.Mesh
      const material = neuron.material as THREE.MeshPhongMaterial
      const outlineMaterial = outline.material as THREE.MeshBasicMaterial
      switch(+(rawNeuron.state)) {
        case LIFNeuronState.FIRING:
          outlineMaterial.color.set('rgb(242, 31, 91)')
          material.color.set('rgb(255, 168, 170)')
          break;
        default:
          outlineMaterial.color.set('rgb(43, 202, 255)')
          material.color.set('rgb(191, 239, 255)')
          break;
      }
    }
  }

   randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createSphere(
    size: number, 
    widthSegments: number, 
    heightSegments: number, 
    name?: string,
    x: number = 0,
    y: number = 0,
    z: number = 0): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(size, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({ color: 'rgb(191, 239, 255)' });
    const mesh = new InteractiveMesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    if (name) {
      mesh.name = name;
    }

    mesh.onClicked = (() => {
      console.info('Clicked: ', mesh.name);
      // Outline Effect
      // const outlineMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(43, 202, 255)', side: THREE.BackSide } );
      // const outlineMesh = new THREE.Mesh( mesh.geometry, outlineMaterial );
      // outlineMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
      // outlineMesh.scale.multiplyScalar(1.25); // default: 1.05
      // this.scene.add( outlineMesh );
    });

    return mesh;
  }

  createOutline(mesh: THREE.Mesh, color: string) {
    const outlineMaterial = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
    const outlineMesh = new THREE.Mesh( mesh.geometry, outlineMaterial );
    outlineMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    outlineMesh.scale.multiplyScalar(1.25); // default: 1.05
    outlineMesh.name = `${mesh.name}-outline`
    return outlineMesh
  }

  addAmbientLight() {
    const color = 0xFFFFFF;
    const intensity = 1.0;
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(light);
  }

  addDirectionalLight() {
    const dlight = new THREE.DirectionalLight( 0xffffff, 0.20 ); // default: 0.33
    dlight.position.set(0.1, 50, -0.1);
    dlight.castShadow = true;
    dlight.shadow.mapSize.width = 1024;
    dlight.shadow.mapSize.height = 1024;
    dlight.shadow.radius = 2;
    dlight.shadow.camera.near = 0.5;
    dlight.shadow.camera.far = 1000;
    this.scene.add( dlight );
  }

  update() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.update();
    });
  }

  onHandleClick(event) {
    event.preventDefault();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clientRect = this.webGLScaneWrapper.nativeElement.getBoundingClientRect();
    mouse.x = ( (event.clientX - clientRect.left) / this.renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY - clientRect.top) / this.renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, this.camera );
    const intersects = raycaster.intersectObjects( this.neurons );
    if ( intersects.length > 0 ) {
      console.info('intersected', intersects);
      const t = (intersects[0].object as InteractiveMesh)?.onClicked();
    } else {
      console.log('no intersection');
    }
  }
}

export class InteractiveMesh extends THREE.Mesh {
  onClicked: any;
}
