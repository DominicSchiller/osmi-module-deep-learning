import { SimpleNeuron } from "./simple-neuron";
import * as tf from '@tensorflow/tfjs';

/**
 * A class representing a population of simple neurons with synaptic inputs
 */
 export class SimpleSynapticNeuron extends SimpleNeuron {

    protected m: number
    protected wIn: number
    protected eIn: number
    protected tau: number

    /**
     * Input synapse conductance dynamics (increases on each synapse spike)
     */
    private gIn: tf.Variable
    /**
     * The input synapses behaviour at each timestep
     */
    public synHasSpiked: tf.Variable

    public input: tf.Variable

     /**
     * Constrcutor
     * @param n The number of neurons
     */
    constructor(n: number = 1, m: number = 100, a: number = 0.02, b: number = 0.2, c: number = -65.0, d: number = 8.0, wIn: number = 0.07) {
        super(n, a, b, c, d)
        this.m = m
        this.wIn = wIn
        this.eIn = 0
        this.tau = 10

        this.gIn = tf.variable(tf.fill([this.m], 0), null, 'g_in')

        this.synHasSpiked = tf.variable(
        tf.tensor(new Array(this.m).fill(false, 0, this.m), [this.m]),  
        null, 'gin')

        this.input = tf.variable(tf.fill([this.n], 0))
    }

    getInputOps(hasFiredOp, vOp) {
        return tf.tidy(() => {
            // First, update synaptic conductance dynamics:
            // - increment by one the current factor of synapses that fired
            // - decrease by tau the conductance dynamics in any case
            const gInUpdateOp = tf.where(
                this.synHasSpiked,
                tf.add(this.gIn, tf.ones(this.gIn.shape)),
                tf.sub(this.gIn, tf.mul(this.dt, tf.div(this.gIn, this.tau)))
            )

            // Update the g_in variable
            this.gIn.assign(gInUpdateOp)     
            
            // We can now evaluate the synaptic input currents
            // Isyn = Σ w_in(j)g_in(j)E_in(j) - (Σ w_in(j)g_in(j)).v(t)
            const iOp = tf.sub(
                tf.einsum('nm,m->n', tf.scalar(this.wIn), tf.mul(this.gIn, tf.scalar(this.eIn))),
                tf.mul(tf.einsum('nm,m->n', tf.scalar(this.wIn), this.gIn), vOp)
            )

            this.input.assign(iOp)
            return iOp

        });
    }
 }