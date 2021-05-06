/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';

import { SimpleNeuron } from "../neurons/simple-neuron"
import { SimpleSynapticNeuron } from '../neurons/simple-synaptic-neuron';
import { SimulationCommand, SimulationWorkerMessage } from "../../simulation-command"
import { InputCurrent, Potential } from "../../snn-types"
import { BaseSimulator } from './base-simulator';

export class SimpleSynapticNeuronSimulator extends BaseSimulator {

    // Synapses firing rate
    private frate:number = 0.002
    // The number of neurons
    private n = 1
    // The number of synapses
    private m = 100

    // The population of synaptic neurons
    private neurons: SimpleSynapticNeuron = new SimpleSynapticNeuron(this.n, this.m)

    constructor() {
      super()
      tf.setBackend('webgl');
    }
    
    public simulate() {
  
      console.log("Start Simulation ...");
      // run the simulation at each time step
      for (var step = 0.0; step <= this.T; step += this.dt) {
        const t = step
  
        // we generate random spikes on the input synapses between 200 and 700 ms
        var  pSynSpike
        if (t > 200 && t < 700) {
          const threshold = this.frate * this.dt
          const randomMatrix = tf.randomUniform([this.m], 0, 1)
          const spikingRate = tf.fill(randomMatrix.shape, threshold)
           // a synapse has spiked when r is lower than the spiking rate
          pSynSpike = randomMatrix.less(spikingRate)
        } else {
          // no synapse activity during that period
            pSynSpike = tf.zeros([this.m], 'bool')
        }
        
        // update neuron variables
        this.neurons.synHasSpiked.assign(pSynSpike)
        this.neurons.dt.assign(tf.scalar(this.dt))

        // getb response
        const responseOps = this.neurons.getResponseOps()

        this.I_in.push({t: t, i: this.neurons.input.arraySync() as number[]})
        this.v_out.push(responseOps.vOp.reshape([this.n]))
  
        // send data update each 100ms
        if (step % 100 == 0) {
          this.postNeuronSpikesUpdate()
        }

      }
      console.log("Simulation finished");
      this.postNeuronSpikesUpdate()
    }
  }