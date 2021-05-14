/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import { LIFNeuronCurrent, LIFNeuronPotential, LIFSimulationDataUpdate as LIFSimulationDataUpdate } from '../../snn-types';
import { LIFSimulationCommand, LIFSimulationWorkerEvent } from '../lif-simulation-commands';
import { LIFSimulationModel } from '../lif-simulation-model';
import { LIFSynapticNeuron } from '../neurons/lif-synaptic-neuron';

export class LIFSynapticNeuronSimulator {

    private model: LIFSimulationModel = null
    public window: DedicatedWorkerGlobalScope
    public simulationIntervalID: any

    public setModel(newModel: LIFSimulationModel) {
        if (!this.model) {
            this.model = newModel
        } else {
            if (this.model.nNeuron != newModel.nNeuron || 
                this.model.nSyn != newModel.nSyn ||
                this.model.networkingGrade != newModel.networkingGrade) {
                    // console.warn("Restarting simulation due to neuron core property updates ...");
                    this.window.clearInterval(this.simulationIntervalID);
                    this.model = newModel;
                    this.simulate()
            } else {
                this.mergeModel(newModel)
                this.updateNeurons()
            }
        }
    }

    constructor(window) {
        tf.setBackend('cpu');
        this.window = window
    }

    public mergeModel(otherModel) {
        this.model.r = otherModel.r
        this.model.uRest = otherModel.uRest
        this.model.uThresh = otherModel.uThresh
        this.model.tau = otherModel.tau
        this.model.tauRest = otherModel.tauRest
        this.model.f = otherModel.f
        this.model.networkingGrade = otherModel.networkingGrade
    }

    private initVariables() {
        this.model.I = []
        this.model.U = []
        this.createNeurons()  
    }

    private createNeurons() {
        this.model.synHasSpiked = []

        for (var i=0; i<this.model.nNeuron; i++) {
            const wSyn = tf.randomNormal([this.model.nSyn], 1.0, 0.5)
            const neuron = new LIFSynapticNeuron(this.model.nSyn, wSyn, this.model.T)
            neuron.initVariablesAndPlaceholders()
            neuron.updateParams(this.model)
            this.model.neuronData.neurons.push(neuron)

            // init synHasSpiked
            const synHasSpiked = []
            for (var step = 0; step<=this.model.T; step += this.model.dt) {
                synHasSpiked.push(tf.fill([this.model.nSyn], 0, 'bool'))
            }
            this.model.synHasSpiked.push(synHasSpiked)

            // Init I and U arrray
            this.model.I.push([])
            this.model.U.push([])
        }

        // create connections
        this.model.neuronData.connectionsMap = []
        for (var i=0; i<this.model.nNeuron; i++) {
            let postNeuronConnections: number[] = []
            for (var j=0; j<this.model.nNeuron; j++) {
                if (Math.random() < this.model.networkingGrade/100) {
                postNeuronConnections.push(j)
                }
            }
            this.model.neuronData.connectionsMap.push(postNeuronConnections)
        }

        this.postNeuronsUpdate(true)
    }

    private updateNeurons() {
        for (let neuron of this.model.neuronData.neurons) {
            neuron.updateParams(this.model)
        }
    }

    async simulate() {
        var start = new Date().getTime();
        console.log("Start Simulation ...");

        this.initVariables()

        var t = 0
        this.simulationIntervalID = setInterval(() => {
            // const t = step

            for (var n=0; n<this.model.nNeuron; n++) {
                if (t > 10 && t < 180) {
                    const r = tf.randomUniform([this.model.nSyn], 0, 1)
                    const hasSpiked = r.less(tf.fill([this.model.nSyn], this.model.f * this.model.dt * 1e-3))
                    this.model.synHasSpiked[n][t] = hasSpiked
                }
    
                // feed neuron with new data
                // this.model.neuronData.neurons[n].iApp.assign(tf.scalar(tf.randomUniform([1], 0, 0.5).dataSync()[0]))
                this.model.neuronData.neurons[n].iApp.assign(tf.scalar(0.0));
                this.model.neuronData.neurons[n].synHasSpiked.assign(this.model.synHasSpiked[n][t]);
                this.model.neuronData.neurons[n].dt.assign(tf.scalar(this.model.dt));
    
                // calculate results
                const result = this.model.neuronData.neurons[n].getPotentialOp();
                const u = result.uOp.dataSync()[0];
                const tRest = result.tRestOp.dataSync()[0];
    
                this.model.I[n].push( new LIFNeuronCurrent(t, this.model.neuronData.neurons[n].iApp.dataSync()[0]));
                this.model.U[n].push( new LIFNeuronPotential(t, u, tRest));
            }

            // this.model.postNeuronSpikesUpdate()
            this.postNeuronPotentialUpdate()
            this.postNeuronsUpdate()
            
            t++;
            if (t >= this.model.T) {
                // @ts-ignore
                this.window.clearInterval(this.simulationIntervalID);
                console.log("Simulation finished");
                var end = new Date().getTime();
                console.info(`time needed: ${(end - start)/1000}s`)
            }
        }, 250)

        // console.info("Last spike Idx: ", this.model.neurons[0].tSpikesIdx.dataSync()[0]);
        // console.info("Spikes: ", this.model.neurons[0].tSpikes.arraySync());

        // this.postNeuronSpikesUpdate();
        // this.postLIFNeuronResponseUpdate();
    }

    protected postNeuronPotentialUpdate() {
        postMessage(new LIFSimulationWorkerEvent(
            LIFSimulationCommand.POTENTIAL_UPDATE,
            new LIFSimulationDataUpdate(this.model.neuronData.neurons[0].uThresh, this.model.U[0], this.model.I[0])
        ))
    }

    protected postNeuronCurrentUpdate() {
        postMessage(new LIFSimulationWorkerEvent(
          LIFSimulationCommand.CURRENT_UPDATE,
          { inputCurrents: this.model.I,  potentials: [] }
        ));
      }

    protected postNeuronsUpdate(isInitial: boolean = false) {
        this.model.neuronData.isInititalData = isInitial;
        postMessage(new LIFSimulationWorkerEvent(
            LIFSimulationCommand.NEURON_DATA_UPDATE,
            this.model.neuronData
        ))
    }
}
