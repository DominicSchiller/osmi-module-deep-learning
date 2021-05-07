/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import { ISimulator } from '../../simple/simulator/simulator.interface';
import { SimulationCommand, SimulationWorkerMessage } from '../../simulation-command';
import { InputCurrent, LIFNeuronResponse, LIFNeuronResponseUpdate, Potential } from '../../snn-types';
import { LIFNeuron } from '../neurons/lif-neuron';
import { LIFSynapticNeuron } from '../neurons/lif-synaptic-neuron';

export class LIFSynapticNeuronSimulator implements ISimulator {

    // duration of the simulation in ms
    T: number = 200

    // duration of each time step in ms
    dt: number = 1

    // Number of synapses
    nSyn: number = 25

    // Spiking frequency in Hz
    f: number = 20

    // We need to keep track of input spikes over time
    synHasSpiked: tf.Tensor[]

    // We define the synaptic efficacy as a random vector
    W

    I: InputCurrent[] = []
    
    U: LIFNeuronResponse[] = []

    neuron: LIFSynapticNeuron

    constructor() {
        tf.setBackend('webgl');
    }

    private initVariables() {
        this.W = tf.randomNormal([this.nSyn], 1.0, 0.5)

        this.synHasSpiked = []
        for (var step = 0; step<=200; step += this.dt) {
            this.synHasSpiked.push(tf.fill([this.nSyn], 0, 'bool'))
        }
    }

    simulate() {
        this.initVariables()

        this.neuron = new LIFSynapticNeuron(this.nSyn, this.W, 200)
        this.neuron.initVariablesAndPlaceholders()

        for (var step = 0; step<=200; step += this.dt) {
            const t = step

            if (t > 10 && t < 180) {
                const r = tf.randomUniform([this.nSyn], 0, 1)
                const hasSpiked = r.less(tf.fill([this.nSyn], this.f * this.dt * 1e-3))
                this.synHasSpiked[t] = hasSpiked
            }

            // feed neuron with new data
            this.neuron.iApp.assign(tf.scalar(0.0))
            this.neuron.synHasSpiked.assign(this.synHasSpiked[t])
            this.neuron.dt.assign(tf.scalar(this.dt))

            // calculate results
            const result = this.neuron.getPotentialOp()
            const u = result.uOp.dataSync()[0]
            const tRest = result.tRestOp.dataSync()[0]

            this.I.push( { t: t, i: [this.neuron.iApp.dataSync()[0]] })
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