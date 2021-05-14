/// <reference lib="webworker" />

import * as tf from '@tensorflow/tfjs';
import { LIFSimulationCommand, LIFSimulationWorkerEvent } from '../model/snn/lif/lif-simulation-commands';
import { LIFSimulationModel } from '../model/snn/lif/lif-simulation-model';
import { LIFSynapticNeuronSimulator } from '../model/snn/lif/simulator/synaptic-lif-neuron-simulator';

tf.setBackend('cpu');

var window = self;

// START OF WORKER THREAD CODE
// console.log('Starting Simulation Thread ... ');

var simulator = new LIFSynapticNeuronSimulator(window)

addEventListener('message', ({ data }) => {
  let event = data as  LIFSimulationWorkerEvent
  switch (+(event.command)) {
    case LIFSimulationCommand.SET_MODEL:
        const model = event.data as LIFSimulationModel
        simulator.setModel(model);
        break;
    case LIFSimulationCommand.START:
        simulator.simulate();
        break;
    default:
        break;
  }
});
