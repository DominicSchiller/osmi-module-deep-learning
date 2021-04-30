import * as tf from '@tensorflow/tfjs';

/**
 * A class representing a population of simple neurons
 */
export class SimpleNeuron {

    /**
     * The number of neurons
     */
    public n: number 
    /**
     * the time scale of the recovery variable u
     * - note: slower values result in slower recovery. Typical value is 0.02
     */
    private a: number
    /**
     * The sensitivity of the recovery variable u to the sub-threshold fluctuations of the membran potential v.
     * - note: greater values couple v and u more strongly resulting in possible subthreshold oscillations and low-threshold spiking dynamics. Typical value is b=0.2
     */
    private b: number
    /**
     * The after-spike value of the membrane potential v caused by the fast high-threshold K+ conducttances.
     * - note: A typical value is -65 mV.
     */
    private c: number
    /**
     * The after-spike reset of the recovery variable u caused by slow high-threshold Na+ and K+ conductances
     * - note: A typical value is 2.
     */
    private d: number

    private v: tf.Variable
    private u: tf.Variable

    /**
     * The input current in mV
     */
    public i: tf.Variable
    /**
     * The time interval
     */
    public dt: tf.Variable


    public potential: tf.Variable
    public recovery: tf.Variable



    static readonly SpikingThreshold: number = 35.0
    static readonly RestingPotential: number = -70.0
    

    /**
     * Constrcutor
     * @param n The number of neurons
     */
    constructor(n: number, a: number = 0.02, b: number = 0.2, c: number = -65.0, d: number = 2.0) {
        this.n = n;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;

        // membrane potential starting at resting potential
        this.v = tf.variable(tf.fill([this.n], SimpleNeuron.RestingPotential), null, 'v');
        this.v.print();
        // membrane recovery starting at b * c
        this.u = tf.variable(tf.tensor1d([this.b * this.c]), null, 'u');
        this.u.print();

        this.i = tf.variable(tf.zeros([this.n]), null, 'i')
        this.dt = tf.variable(tf.scalar(0), null, 'dt')

        const responseOps = this.getResponseOps()
        this.potential = responseOps.vOp
        this.recovery = responseOps.uOp
    }

    getInputOps(hasFiredOp, vOp) {
        return tf.tidy(() => {
            const hasFired = hasFiredOp;
            const v_ = vOp;
            return tf.add(this.i, 0.0)
        });
    }

    getResponseOps() {
        return tf.tidy(() => {
            const resetOps = this.getResetOps();   
            const iOp = this.getInputOps(resetOps.hasFiredOp, resetOps.vResetOp) 
            const updateOps = this.getUpdateOps(resetOps.hasFiredOp, resetOps.vResetOp, resetOps.uResetOp, iOp)

            return {
                vOp: updateOps.vOp,
                uOp: updateOps.uOp
            }
        }); 
    }

    getResetOps() {
        return tf.tidy(() => {
            // evaluate which neurons have reached the spiking threshold
            const hasFiredOp = tf.greaterEqual(
                this.v, tf.fill([this.n], 
                    SimpleNeuron.SpikingThreshold))

            // neurons that have spiked must be reset, others simply evolve from their initial value
            // membrane potential is reset to c
            const vResetOp = tf.where(hasFiredOp, tf.fill([this.n], this.c), this.v)

            // membrane recovery is increased by d
            const uResetOp = tf.where(hasFiredOp, tf.add(this.u, this.d), this.u)

            return { 
                hasFiredOp: hasFiredOp,
                vResetOp: vResetOp,
                uResetOp: uResetOp
            }
        });
    }

    getUpdateOps(hasFiredOp, vResetOp, uResetOp, iOp) {
       

        return tf.tidy(() => {
             // evaluate membrane potential increment for the considered time interval
            // dv = 0 if the neuron fired, 
            // dv = 0.04v^2 + 5v + 140 + i -u otherwise
            const dvOp = tf.where(
                hasFiredOp, 
                tf.zeros(this.v.shape),
                tf.sub(
                    tf.addN([
                        tf.mul(tf.square(vResetOp), 0.04),
                        tf.mul(vResetOp, 5.0),
                        tf.fill([this.n], 140),
                        iOp
                    ]),
                    this.u)
                );

            // evaluate membrane recovery decrement for the considered time interval
            // du = 0 if the neuron fired, du = a*(b*v -u) otherwise
            const duOp = tf.where(
                hasFiredOp,
                tf.zeros([this.n]),
                tf.mul(
                    this.a,
                    tf.sub(
                        tf.mul(this.b, vResetOp),
                        uResetOp
                    )
                )
            );

            // increment membrane potential, and clamp it to the spiking threshold
            // v += dv * dt
            this.v.assign(
                tf.minimum(
                    tf.fill([this.n], SimpleNeuron.SpikingThreshold),
                    tf.add(vResetOp, tf.mul(dvOp, this.dt))
                    ))

            // decrease membrane recovery
            this.u.assign(
                tf.add(uResetOp, tf.mul(duOp, this.dt))
            )

            return {
                vOp: this.v,
                uOp: this.u
            }
        });
    }
}