import { LIFSynapticNeuron } from "./neurons/lif-synaptic-neuron";
import { BehaviorSubject, Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { InputCurrent, LIFNeuronCurrent, LIFNeuronPotential, LIFNeuronSpikes } from "../snn-types";

export class LIFSimulationModel {
    public nNeuron: number = 25;
    public nSyn: number = 25;
    public uRest: number = 0.0;
    public uThresh: number = 1.0;
    public tauRest: number = 4.0;
    public tau: number = 10.0;
    public r: number = 1.0;
    public f: number = 20;
    public networkingGrade: number = 7;

    public neuronData: LIFNeuronData = new LIFNeuronData();
    
    // We need to keep track of input spikes over time
    public synHasSpiked: tf.Tensor[][];

    public I: LIFNeuronCurrent[][] = [];

    public U: LIFNeuronPotential[][] = [];

    public neuronSpikes: LIFNeuronSpikes[] = [];

    // duration of the simulation in ms
    public T: number = 200;

    // duration of each time step in ms
    public dt: number = 1;

    public animationSpeed: number = 500;
}

export class LIFNeuronData {
    /**
     * List of created neurons
     */
    public neurons: LIFSynapticNeuron[] = []
    /**
     * Map of inter-neuron connections for each neuron
     * - note: for each neuron from the neuron list, a list of indices of connected pos-neurons (also from the neuron list) is created
     */
    public connectionsMap: number[][] = []
    /**
     * Map of weights for each inter-neuron connection
     */
    public W: number[][] = []
    /**
     * Status whether this data set is an initially created one or not
     */
    public isInititalData: boolean = false
}