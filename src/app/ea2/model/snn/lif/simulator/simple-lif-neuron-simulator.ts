/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import { ISimulator } from '../../simple/simulator/simulator.interface';
import { SimulationCommand, SimulationWorkerMessage } from '../../simulation-command';
import { InputCurrent, LIFNeuronResponse, LIFNeuronResponseUpdate, Potential } from '../../snn-types';
import { LIFNeuron } from '../neurons/lif-neuron';

export class SimpleLIFNeuronSimulator implements ISimulator {

    // duration of the simulation in ms
    T: number = 200

    // duration of each time step in ms
    dt: number = 1

    I: InputCurrent[] = []
    
    U: LIFNeuronResponse[] = []

    neuron: LIFNeuron

    constructor() {
        tf.setBackend('webgl');
    }

    simulate() {
        
        this.neuron = new LIFNeuron()

        for (var step = 0; step<=200; step += this.dt) {
            const t = step

            var iApp: number = 0
            // set input current in mA
            if (t > 10 && t < 30) {
                iApp = 0.5           
            } else if(t > 50 && t < 100) {
                iApp = 1.2
            } else if(t> 120 && t < 180) {
                iApp = 1.5
            }

            // feed neuron with new data
            this.neuron.iApp.assign(tf.scalar(iApp))
            this.neuron.dt.assign(tf.scalar(this.dt))

            // calculate results
            const result = this.neuron.getPotentialOp()
            const u = result.uOp.dataSync()[0]
            const tRest = result.tRestOp.dataSync()[0]

            this.I.push( { t: t, i: [iApp] })
            this.U.push( new LIFNeuronResponse(t, u, tRest))
        }
        this.postNeuronSpikesUpdate()
        this.postLIFNeuronResponseUpdate()
    }

    protected postLIFNeuronResponseUpdate() {
        postMessage(new SimulationWorkerMessage(
          SimulationCommand.LIFNeuronResponseUpdate, 
          new LIFNeuronResponseUpdate(this.neuron.uThresh, this.U)
        ))
      }

    protected postNeuronSpikesUpdate() {
        postMessage(new SimulationWorkerMessage(
          SimulationCommand.NeuronSpikesUpdate, 
          { inputCurrents: this.I,  potentials: [] }
        ))
      }
}