import { SimpleNeuron } from "./simple-neuron";
import * as tf from '@tensorflow/tfjs';

/**
 * A class representing a population of simple neurons with synaptic inputs
 */
 export class SimpleSynapticNeuron extends SimpleNeuron {

    /**
     * The number of synapses
     */
    protected m: number
    /**
     * The input weights
     */
    protected wIn: tf.Variable

    protected eIn: tf.Variable

    protected tau: number

    /**
     * Input synapse conductance dynamics (increases on each synapse spike)
     */
    private gIn: tf.Variable

    /**
     * The input synapses behaviour at each timestep
     */
    public synHasSpiked: tf.Variable

    /**
     * The input current
     */
    public input: tf.Variable

     /**
     * Constrcutor
     * @param n The number of neurons
     */
    constructor(
        n: number = 1, 
        m: number = 100, 
        a?: tf.Tensor, 
        b?: tf.Tensor, 
        c?: tf.Tensor , 
        d?: tf.Tensor,
        wIn?: tf.Tensor) {
        super(n, a, b, c, d)
        this.m = m
        this.wIn = tf.variable(wIn ?? tf.fill([n, m], 0.07))

        this.eIn = tf.variable(tf.zeros([m]))
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
                tf.einsum('nm,m->n', this.wIn, tf.mul(this.gIn, this.eIn)),
                tf.mul(tf.einsum('nm,m->n', this.wIn, this.gIn), vOp)
            )

            this.input.assign(iOp)
            return iOp

        });
    }
 }