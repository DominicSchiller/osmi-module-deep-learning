/// <reference lib="webworker" />

import * as tf from '@tensorflow/tfjs';
import { SimulationCommand, SimulationWorkerMessage } from '../model/snn/simulation-command';
import { MultiSynapticNeuronSimulator } from '../model/snn/simulator/multi-synaptic-neuron-simulator';
import { SimpleNeuronSimulator } from '../model/snn/simulator/simple-neuron-simulator';
import { SimpleSynapticNeuronSimulator } from '../model/snn/simulator/simple-synaptic-neuron-simulator';
import { ISimulator } from '../model/snn/simulator/simulator.interface';
import { InputCurrent, Potential } from '../model/snn/snn-types';

tf.setBackend('webgl');
// var simulator:ISimulator = new SimpleNeuronSimulator()
// var simulator:ISimulator = new SimpleSynapticNeuronSimulator()
var simulator:ISimulator = new MultiSynapticNeuronSimulator()

addEventListener('message', ({ data }) => {

  switch (+(data as SimulationWorkerMessage)?.command) {
    case SimulationCommand.Start:
      simulator.simulate();
      break;
    default:
      break;
  }
});