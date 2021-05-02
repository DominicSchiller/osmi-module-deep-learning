/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';

import { SimpleNeuron } from "../simple-neuron"
import { SimulationCommand, SimulationWorkerMessage } from "../simulation-command"
import { IInputCurrent, IPotential, ISNNSImulationResult } from "../snn-types"

export class SimpleNeuronSimulator {

    // Array of input current values
    protected I_in: IInputCurrent[] =  []
    // Array of evaluated membrane potential values
    protected v_out: IPotential[] = []
    // Duration of the simulation in ms
    protected T:number = 1000
    // Duration of each time step in ms
    protected dt:number = 0.5
  
    private neurons: SimpleNeuron = new SimpleNeuron(1)

    constructor() {
        tf.setBackend('cpu');
    }
    
    public simulate(): ISNNSImulationResult {
  
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
  
        this.I_in.push({t: t, i: i_in})
        this.v_out.push({t: t, v: responseOps.vOp.dataSync()[0]})
  
        // send data update each 100ms
        if (step % 100 == 0) {
          postMessage(new SimulationWorkerMessage(SimulationCommand.DataUpdate, { inputCurrents: this.I_in, potentials: this.v_out }));
        }
      }
      console.log("Sumulation finished");
      return { inputCurrents: this.I_in, potentials: this.v_out }
    }
  }