import * as tf from '@tensorflow/tfjs';
import { SimpleSynapticNeuron } from "./simple-synaptic-neuron";

/**
 * A class representing a population of simple neurons with synaptic inputs
 */
export class SimpleSynapticRecurrentNeuron extends SimpleSynapticNeuron {

  /**
   * Weights of recurrent connections
   * - note: w(i,j)
   */
  w: tf.Tensor
  /**
   * Recurrent target objective of potential for a linear response to the membrane potential
   */
  e: tf.Tensor

  /**
   * Recurrent synapse conductance dynamics (increases on each synapse spike)
   */
  g: tf.Variable

  /**
   * Constrcutor
   * @param n The number of neurons
   */
    constructor(
      n: number = 1, 
      m: number = 100, 
      w: tf.Tensor,
      e: tf.Tensor,
      a?: tf.Tensor, 
      b?: tf.Tensor, 
      c?: tf.Tensor , 
      d?: tf.Tensor,
      wIn?: tf.Tensor) {
          super(n, m, a, b, c, d, wIn)
          this.w = w
          this.e = e
          this.g = tf.variable(tf.zeros([this.n]))
      }

      getInputOps(hasFiredOp, vOp) {
        return tf.tidy(() => {
          // First, update recurrent conductance dynamics:
          // - increment by one the current factor of synapses that fired
          // - decrease by tau the conductance dynamics in any case
          const gUpdateOp = tf.where(
            hasFiredOp,
            tf.add(this.g, tf.ones(this.g.shape)),
            tf.sub(this.g, tf.mul(this.dt, tf.div(this.g, this.tau))))
            
          // Update the g variable
          this.g.assign(gUpdateOp)

          // We can now evaluate the recurrent conductance
          // I_rec = Σ w(j) * g(j) * (E(j) - v(t))
          const iRecOp = tf.einsum('ij,j->i',
            this.w,
            tf.mul(this.g, tf.sub(this.e, vOp))
          )

          // get the synaptic input currents from parent
          const iInOp = super.getInputOps(hasFiredOp, vOp)

          // The actual current is the sum of both currents
          const iOp = tf.add(iInOp, iRecOp)
          this.input.assign(iOp)

          return iOp
        })
      }
}