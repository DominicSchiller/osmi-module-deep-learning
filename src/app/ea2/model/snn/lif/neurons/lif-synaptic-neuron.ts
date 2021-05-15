import * as tf from '@tensorflow/tfjs';
import { LIFSimulationModel } from '../lif-simulation-model';
import { LIFNeuron } from "./lif-neuron";

export class LIFSynapticNeuron extends LIFNeuron {

    /**
     * Number of Synapses
     */
    public nSyn: number

    /**
     * Maximum spikes we remember
     */
    public maxSpikes: number

    /**
     * The (additional) neuron synaptic 'charge' to charge the cell membrane
     */
    public q: number
    /**
     * The synaptic efficacy
     */
    public w: tf.Variable

    /**
     * The synaptic time constant in ms
     */
    public tauSyn: number

    /**
     * The history of synaptic spike times for the neuron 
     */
    public tSpikes: tf.Variable
    /**
     * The last index used to insert spike times
     */
    public tSpikesIdx: tf.Variable
    /**
     * A list indicating which synapse spiked in the last time step
     */
    public synHasSpiked: tf.Variable

    constructor(
        nSyn: number,
        w: tf.Tensor,
        maxSpikes: number = 50,
        q: number = 1.5,
        tauSyn: number = 10.0,
        uRest: number = 0.0, 
        uThresh: number = 1.0,
        tauRest: number = 4.0,
        tau: number = 10.0,
        r: number = 1.0,
    ) {
        super(uRest, uThresh, tauRest, tau, r)
        this.nSyn = nSyn
        this.w = tf.variable(w)
        this.maxSpikes = maxSpikes,
        this.q = q
        this.tauSyn = tauSyn
    }

    public initVariablesAndPlaceholders() {
        super.initVariablesAndPlaceholders()

        this.tSpikes = tf.variable(tf.fill([this.maxSpikes, this.nSyn], -1, 'float32'))
        this.tSpikesIdx = tf.variable(tf.scalar(this.maxSpikes-1, 'int32'))
        this.synHasSpiked = tf.variable(tf.fill([this.nSyn], 0, 'bool'))
    }

    public updateParams(model: LIFSimulationModel) {
        this.tauRest = model.tauRest
        this.tau = model.tau
        this.uRest = model.uRest
        this.uThresh = model.uThresh
        this.r = model.r
    }

    public updateSpikeTimes() {
        // increase the age of older spikes
        this.tSpikes.assign( // TODO ????
            this.tSpikes.add(
                tf.where(
                    this.tSpikes.greaterEqual(tf.fill([this.maxSpikes, this.nSyn], 0)),
                    tf.fill([this.maxSpikes, this.nSyn], 1.0 * this.dt.dataSync()[0]),
                    tf.zeros([this.maxSpikes, this.nSyn])
                )
            )
        )
        // increment last spike index (modulo max_spikes)
        this.tSpikesIdx.assign(
            tf.mod(this.tSpikesIdx.add(tf.scalar(1, 'int32')), tf.scalar(this.maxSpikes, 'int32'))
        )

        // create a list of coordinates to insert the new spikes
        const idxOp = tf.fill([this.nSyn], 1 * this.tSpikesIdx.dataSync()[0], 'int32')
        const coordOp = tf.stack([idxOp, tf.range(0, this.nSyn, 1, 'int32')], 1) // TODO range korrekt so??

        // create a vector of new spike times (non-spikes are assigned a negative time)
        const newSpikesOp = tf.where(
            this.synHasSpiked,
            tf.fill([this.nSyn], 0.0),
            tf.fill([this.nSyn], -1.0)
        )

        // replace older spikes by new ones
        const updates = tf.scatterND(coordOp, newSpikesOp, [this.maxSpikes, this.nSyn])
        const mask = tf.greater(tf.scatterND(coordOp, tf.onesLike(newSpikesOp), [this.maxSpikes, this.nSyn]), 0)
        this.tSpikes.assign(tf.where(mask, updates, this.tSpikes))
        return this.tSpikes
    }

    getInputOp() {
        // update our memory of spike times with the new spikes
        const tSpikesOp = this.updateSpikeTimes()

        const shape = [this.maxSpikes, this.nSyn]
        const tauSynTensor = tf.fill(shape, this.tauSyn)
        // evaluate synaptic input current for each spike on each synapse
        const iSynOp = tf.where(
            tSpikesOp.greaterEqual(tf.fill(shape, 0, 'bool')),
            tf.mul(
                tf.fill(shape, this.q).div(tauSynTensor),  
                tf.exp(tf.neg(tSpikesOp.div(tauSynTensor)))
            ),
            tSpikesOp.mul(tf.fill(shape, 0.0))
        )

        // add each synaptic current to the input current
        const iOp = this.w.mul(iSynOp).sum()

        this.iApp.assign(tf.add(this.iApp, iOp)) // TODO: direkt assignen ?? 
        return this.iApp
    }

}