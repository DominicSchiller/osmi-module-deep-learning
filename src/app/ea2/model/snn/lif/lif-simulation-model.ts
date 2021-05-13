import { LIFSynapticNeuron } from "./neurons/lif-synaptic-neuron";
import { BehaviorSubject, Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { InputCurrent, LIFNeuronCurrent, LIFNeuronPotential } from "../snn-types";

export class LIFSimulationModel {
    public nNeuron: number = 25;
    public nSyn: number = 25;
    public uRest: number = 0.0;
    public uThresh: number = 1.0;
    public tauRest: number = 4.0;
    public tau: number = 10.0;
    public r: number = 1.0;
    public f: number = 20;
    public networkingGrade: number = 10;

    public neuronData: LIFNeuronData = new LIFNeuronData();
    
    // We need to keep track of input spikes over time
    public synHasSpiked: tf.Tensor[][];

    public I: LIFNeuronCurrent[][] = [];

    public U: LIFNeuronPotential[][] = [];

    // duration of the simulation in ms
    public T: number = 200;

    // duration of each time step in ms
    public dt: number = 1;
}

export class LIFNeuronData {
    public neurons: LIFSynapticNeuron[] = []
    public connectionsMap: number[][] = []
}