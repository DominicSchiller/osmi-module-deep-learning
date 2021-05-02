/// <reference lib="webworker" />

import * as tf from '@tensorflow/tfjs';
import { SimulationCommand, SimulationWorkerMessage } from '../model/snn/simulation-command';
import { SimpleNeuronSimulator } from '../model/snn/simulator/simple-neuron-simulator';
import { SimpleSynapticNeuronSimulator } from '../model/snn/simulator/simple-synaptic-neuron-simulator';
import { IInputCurrent, IPotential, ISNNSImulationResult } from '../model/snn/snn-types';

tf.setBackend('cpu');
// var simulator = new SimpleNeuronSimulator()
var simulator = new SimpleSynapticNeuronSimulator()

addEventListener('message', ({ data }) => {

  switch (+(data as SimulationWorkerMessage)?.command) {
    case SimulationCommand.Start:
      let result = simulator.simulate();
      // postMessage(new SimulationWorkerMessage(SimulationCommand.DataUpdate, result));
      break;
    default:
      break;
  }
});