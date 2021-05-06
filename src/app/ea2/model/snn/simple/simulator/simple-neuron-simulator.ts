/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';

import { SimpleNeuron } from "../neurons/simple-neuron"
import { SimulationCommand, SimulationWorkerMessage } from "../../simulation-command"
import { BaseSimulator } from './base-simulator';

export class SimpleNeuronSimulator extends BaseSimulator {
  
    private neurons: SimpleNeuron = new SimpleNeuron(1)

    constructor() {
      super()
        tf.setBackend('cpu');
    }
    
    public simulate() {
  
      console.log("Start Simulation ...");
      // run the simulation at each time step
      for (var step = 0.0; step <= this.T; step += this.dt) {
        const t = step
  
        // we generate a current step of 7 A between 200 and 700 ms
        var i_in = 0.0
        if (t > 200 && t < 700) {
          i_in = 7.0;
        }
  
        this.neurons.i.assign(tf.fill([1], i_in));
        this.neurons.dt.assign(tf.scalar(this.dt));
        const responseOps = this.neurons.getResponseOps()
  
        this.I_in.push({t: t, i: [i_in]})
        this.v_out.push(responseOps.vOp.reshape([1]))
  
        // send data update each 100ms
        if (step % 100 == 0) {
          this.postNeuronSpikesUpdate()
        }
      }
      console.log("Sumulation finished");
      this.postNeuronSpikesUpdate()
    }
  }