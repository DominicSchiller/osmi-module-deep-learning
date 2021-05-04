import * as tf from '@tensorflow/tfjs';
import { SimulationCommand, SimulationWorkerMessage } from "../simulation-command"
import { InputCurrent, Potential } from "../snn-types"
import { ISimulator } from "./simulator.interface"

export abstract class BaseSimulator implements ISimulator {
    
    // Array of input current values
    protected I_in: InputCurrent[] =  []
    // Array of evaluated membrane potential values
    protected v_out: tf.Tensor[] = []
    // Duration of the simulation in ms
    protected T:number = 1000
    // Duration of each time step in ms
    protected dt:number = 0.5

    simulate() {
        throw new Error("Method not implemented.")
    }

    protected postNeuronSpikesUpdate() {
      let dt = this.dt
      const potentials: Potential[] = this.v_out.map((vOut, index) => new Potential(index*dt, vOut.arraySync() as number[]))
      postMessage(new SimulationWorkerMessage(
        SimulationCommand.NeuronSpikesUpdate, 
        { inputCurrents: this.I_in,  potentials: potentials }
      ))
    }
}