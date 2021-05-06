/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import { SimpleSynapticNeuron } from '../neurons/simple-synaptic-neuron';
import { SimpleSynapticRecurrentNeuron } from '../neurons/simple-synaptic-recurrent-neuron';
import { SimulationCommand, SimulationWorkerMessage } from '../../simulation-command';
import { GlobalSpikesInfo } from '../../snn-types';
import { BaseSimulator } from './base-simulator';

export class MultiSynapticRecurrentNeuronSimulator extends BaseSimulator {
     // Synapses firing rate
    private frate:number = 0.002

    // The number of neurons
    private n: number = 1000

    // The number of synapses
    private m: number = 100

    // The population of synaptic neurons
    private neurons: SimpleSynapticRecurrentNeuron
 
     constructor() {
       super()
       tf.setBackend('webgl');
     }

     async simulate() {
       // generate a random distribution for our neurons (of type excitatory | inhibitory))
       const pNeurons = tf.randomUniform([this.n], 0, 1)

       // assign neuron parameters based on the probability
       // each neuron is either:
       // an inhibitory fast-spiking neuron => (𝑎=0.1, 𝑑=2.0)
       // or an excitatory regular spiking neuron => (𝑎=0.02, 𝑑=8.0)
       // with a proportion of  20% (= 0.2) inhibitory.
       const isInhibitoryNeuron = pNeurons.less(tf.fill([this.n], 0.2))

       const a = tf.where(
         isInhibitoryNeuron, 
         tf.fill([this.n], 0.1), 
         tf.fill([this.n], 0.02))
         
      const d = tf.where(
        isInhibitoryNeuron, 
        tf.fill([this.n], 2.0), 
        tf.fill([this.n], 8.0))

      // randomly connect 10% of the neurons to the input synapses
      const pSyn = tf.randomUniform([this.n, this.m], 0, 1)
      const isSynapseConnectedNeuron = pSyn.less(tf.fill([this.n, this.m], 0.1))

      const wIn = tf.where(
        isSynapseConnectedNeuron,
        tf.fill([this.n, this.m], 0.07),
        tf.fill([this.n, this.m], 0)
      )

      // Randomly distribute recurrent connections
      const pRecurr = tf.randomUniform([this.n, this.n], 0, 1)
      const isRecurrentConnnectedNeuron = pRecurr.less(tf.fill([this.n, this.n], 0.1))

      const randomGamma = tf.randomGamma([this.n, this.n], 2, 0.003)
      var w = tf.variable(tf.where(
        isRecurrentConnnectedNeuron,
        randomGamma,
        tf.fill([this.n, this.n], 0)
      ))

      // identify inhibitory to excitatory connections (receiving end is in row)
      const conditionVals = tf.fill([this.n], 0.2)
      var rowIndices = await tf.whereAsync(pNeurons.greaterEqual(conditionVals))
      const rows = rowIndices.reshape([rowIndices.shape[0]]).arraySync() as number[]
      var columnIndices = await tf.whereAsync(pNeurons.less(conditionVals))
      const columns = columnIndices.reshape([columnIndices.shape[0]]).arraySync() as number[]
      w.assign(this.applyStrongWeights(w.bufferSync(), rows, columns))

      // Only inhibitory neurons have E=-85 mv
      const e = tf.where(
        isInhibitoryNeuron,
        tf.fill([this.n], -85.0),
        tf.fill([this.n], 0)
      )

      this.neurons = new SimpleSynapticRecurrentNeuron(this.n, this.m, w, e, a, null, null, d, wIn)

       var start = new Date().getTime();
       console.log("Start Simulation ...");

       // run the simulation at each time step
      for (var step = 0.0; step <= this.T; step += this.dt) {
        const t = step

        // we generate random spikes on the input synapses between 200 and 700 ms
        var  pSynSpike
        if (t > 200 && t < 700) {
          const threshold = this.frate * this.dt
          const randomMatrix = tf.randomUniform([this.m], 0, 1)
          const spikingRate = tf.fill(randomMatrix.shape, threshold)
           // a synapse has spiked when r is lower than the spiking rate
          pSynSpike = randomMatrix.less(spikingRate)
        } else {
          // no synapse activity during that period
            pSynSpike = tf.zeros([this.m], 'bool')
        }
        
        // update neuron variables
        this.neurons.synHasSpiked.assign(pSynSpike)
        this.neurons.dt.assign(tf.scalar(this.dt))

        // get response
        const responseOps = this.neurons.getResponseOps()
        this.v_out.push(responseOps.vOp.reshape([this.n]))

        this.I_in.push({t: t, i: this.neurons.input.arraySync() as number[]})
  
        // send data update each 100ms
        if (step % 100 == 0) {
          this.postNeuronSpikesUpdate()
        }
      }

      this.searchSpikes(isInhibitoryNeuron)

       console.log("Simulation finished");
       var end = new Date().getTime();
       console.info(`time needed: ${(end - start)/1000}s`)
     }

     applyStrongWeights(w: tf.TensorBuffer<tf.Rank>, rowIndices: number[], columnIndices: number[]): tf.Tensor {
       for(var row of rowIndices) {
         for(var column of columnIndices) {
           const value = 2 * w.get(row, column)
           w.set(value, row, column)
         }
       }
       return w.toTensor()
     }

     private searchSpikes(isInhibitoryNeuron: tf.Tensor) {
      // split between inhibitory and excitatory
      var inhVOut: tf.Tensor[] = []
      var excVOut: tf.Tensor[] = []
      const zeros = tf.fill([this.n], 0)
      for (let v of this.v_out) {
        const inhV = tf.where(isInhibitoryNeuron, v, zeros)
        const excV = tf.where(isInhibitoryNeuron, zeros, v)
        inhVOut.push(inhV)
        excVOut.push(excV)
      }
  
      // identify spikes
      let spikes = this.argwhere(inhVOut,excVOut, 35)
      console.info("Spikes: ", spikes[0].length, spikes[1].length)
      this.postGlobalSpikesUpdate(spikes[0], spikes[1])
    }
  
    private argwhere(inhVOut: tf.Tensor[], excVOut: tf.Tensor[], spikeThreshold: number): GlobalSpikesInfo[][] {
      let inhSpikes: GlobalSpikesInfo[] = []
      let excSpikes: GlobalSpikesInfo[] = []
      for(var i=0; i<inhVOut.length; i++) {
        let inhBuffer = inhVOut[i].bufferSync()
        let excBuffer = excVOut[i].bufferSync()
        for(var j=0; j<this.n; j++) {
          if(inhBuffer.get(j) == spikeThreshold) {
            inhSpikes.push(new GlobalSpikesInfo(i*this.dt, j))
          }
          if(excBuffer.get(j) == spikeThreshold) {
            excSpikes.push(new GlobalSpikesInfo(i*this.dt, j))
          }
        }
      }
      return [inhSpikes, excSpikes]
    }
  
    protected postGlobalSpikesUpdate(inhSpikes: GlobalSpikesInfo[], excSpikes: GlobalSpikesInfo[]) {
      postMessage(new SimulationWorkerMessage(
        SimulationCommand.GlobalSpikesUpdate, 
        { inhibitorySpikes: inhSpikes, excitatorySpikes: excSpikes }
      ))
    }
}