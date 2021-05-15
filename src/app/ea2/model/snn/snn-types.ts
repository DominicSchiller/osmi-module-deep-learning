export class InputCurrent {
    /**
     * 
     * @param t The current's time index (in ms)
     * @param i Status if a curent is present or not (0 | 1)
     */
    constructor(public t: number, public i: number[]) {}
}

export class Potential {
    /**
     * Create new neuron potential.
     * @param t The potential's time index (in ms)
     * @param v The actual potential's amperage (in mA)
     */
    constructor(public t: number, public v: number[]) {}
}

export class GlobalSpikesInfo {
    constructor(public t: number, public totalNeurons: number) {}
}

export interface INeuronSpikesUpdate {
    inputCurrents: InputCurrent[]
    potentials: Potential[]
}

export interface IGlobalSpikesUpdate {
    inhibitorySpikes: GlobalSpikesInfo[]
    excitatorySpikes: GlobalSpikesInfo[]
}

export class LIFNeuronPotential {
   constructor(public t: number, public u: number, public tRest: number) {}
}

export class LIFNeuronCurrent {
    constructor(public t: number, public i: number) {}
}

export class LIFNeuronSpikes {
    constructor(public t: number, public spikes: number) {}
}

export class LIFSimulationDataUpdate {
    constructor(public uThreshold: number, public potentials: LIFNeuronPotential[], public currents: LIFNeuronCurrent[], public neuronSpikes: LIFNeuronSpikes[]) {}
}
