import * as tf from '@tensorflow/tfjs';

export class LIFNeuron {

    /**
     * The membrane resting potential in mV
     */
    public uRest: number
    /**
     * The membrane threshold potential in mV
     */
    public uThresh: number
    /**
     * The duration of the resting period in ms
     */
    public tauRest: number

    /**
     * The membrane time constant in ms
     */
    public tau: number

    /**
     * The membrane resistance in Ohm
     */
    public r: number

    /**
     * The current membrane potential
     */
    protected u: tf.Variable
    /**
     * The duration left in the resting period (0 most of the time except after a neuron spike)
     */
    protected tRest: tf.Variable
    /**
     * The input current
     */
    public iApp: tf.Variable
    /**
     * The chosen time interval for the stimulation in ms
     */
    public dt: tf.Variable

    public state: LIFNeuronState = LIFNeuronState.UNKNOWN

    /**
     * Create a new LIF Neuron
     * @param uRest 
     * @param uThresh 
     * @param tauRest 
     * @param tau 
     * @param r 
     */
    constructor(
        uRest: number = 0.0, 
        uThresh: number = 1.0,
        tauRest: number = 4.0,
        tau: number = 10.0,
        r: number = 1.0
    ) {
        this.uRest = uRest
        this.uThresh = uThresh
        this.tauRest = tauRest
        this.tau = tau,
        this.r = r

        // this.initVariablesAndPlaceholders()
    }

    public initVariablesAndPlaceholders() {
        this.u = tf.variable(tf.scalar(this.uRest))
        this.tRest = tf.variable(tf.scalar(0))
        this.iApp = tf.variable(tf.scalar(0))
        this.dt = tf.variable(tf.scalar(0))
        console.info("LIF props init complete")
    }

    /**
     * Evaluate input current
     * @returns The input current
     */
    public getInputOp(): tf.Variable {
        return this.iApp
    }

    /**
     * Neuron behaviour during integration phase (below threshold)
     */
    public getIntegrationOp() {
        // get input current
        const iOp = this.getInputOp()

        // update membran potential
        const duOp = tf.div(tf.sub(tf.mul(this.r, iOp), this.u), this.tau)
        this.u.assign(this.u.add(tf.mul(duOp, this.dt)))
        // refractory period is 0
        this.tRest.assign(tf.scalar(0.0))

        return { uOp: this.u, tRestOp: this.tRest }
    }

    /**
     * Neuron behaviour during firing phase (above threshold)   
     */
    public getFiringOp() {
        // reset membrane potential
        this.u.assign(tf.scalar(this.uRest))
        // refractory period starts now
        this.tRest.assign(tf.scalar(this.tauRest))

        return { uOp: this.u, tRestOp: this.tRest }
    }

    /**
     * Neuron behaviour during resting phase (t_rest > 0)
     */
    public getRestingOp() {
        // Membrane potential stays at u_rest
        this.u.assign(tf.scalar(this.uRest))
        // Refractory period is decreased by dt
        this.tRest.assign(tf.sub(this.tRest, this.dt))

        return { uOp: this.u, tRestOp: this.tRest }
    }

    public getPotentialOp() {
        if (this.tRest.dataSync()[0] > 0.0) {
            this.state = LIFNeuronState.RESTING
            return this.getRestingOp()
        } else if (this.u.dataSync()[0] > this.uThresh) {
            this.state = LIFNeuronState.FIRING
            return this.getFiringOp()
        } else {
            this.state = LIFNeuronState.INTEGRATING
            return this.getIntegrationOp()
        }
    }

}


export enum LIFNeuronState {
    UNKNOWN,
    RESTING,
    FIRING,
    INTEGRATING
}