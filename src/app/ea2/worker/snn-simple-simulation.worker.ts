/// <reference lib="webworker" />

import * as tf from '@tensorflow/tfjs';
import { SimulationCommand, SimulationWorkerMessage } from '../model/snn/simulation-command';
import { MultiSynapticNeuronSimulator } from '../model/snn/simple/simulator/multi-synaptic-neuron-simulator';
import { MultiSynapticRecurrentNeuronSimulator } from '../model/snn/simple/simulator/multi-synaptic-recurrent-neuron-simulator';
import { SimpleNeuronSimulator } from '../model/snn/simple/simulator/simple-neuron-simulator';
import { SimpleSynapticNeuronSimulator } from '../model/snn/simple/simulator/simple-synaptic-neuron-simulator';
import { ISimulator } from '../model/snn/simple/simulator/simulator.interface';
import { InputCurrent, Potential } from '../model/snn/snn-types';
import { SimpleLIFNeuronSimulator } from '../model/snn/lif/simulator/simple-lif-neuron-simulator';
import { RadnomInputLIFNeuronSimulator } from '../model/snn/lif/simulator/random-input-lif-neuron-simulator';
import { LIFSynapticNeuronSimulator } from '../model/snn/lif/simulator/synaptic-lif-neuron-simulator';

tf.setBackend('webgl');
// var simulator:ISimulator = new SimpleNeuronSimulator()
// var simulator:ISimulator = new SimpleSynapticNeuronSimulator()
// var simulator:ISimulator = new MultiSynapticNeuronSimulator()
// var simulator:ISimulator = new MultiSynapticRecurrentNeuronSimulator()
// var simulator: ISimulator = new SimpleLIFNeuronSimulator()
// var simulator: ISimulator = new RadnomInputLIFNeuronSimulator()
var simulator: ISimulator = new LIFSynapticNeuronSimulator()

addEventListener('message', ({ data }) => {

  switch (+(data as SimulationWorkerMessage)?.command) {
    case SimulationCommand.Start:
      simulator.simulate();
      break;
    default:
      break;
  }
});