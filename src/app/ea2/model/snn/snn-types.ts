export interface IInputCurrent {
    /**
     * The current's time index (in ms)
     */
    t: number
    /**
     * Status if a curent is present or not (0 | 1)
     */
    i: number
}

export interface IPotential {
    /**
     * The potential's time index (in ms)
     */
    t: number
    
    /**
     * The actual potential's amperage (in mA)
     */
    v: number
}

export interface ISNNSImulationResult {
    inputCurrents: IInputCurrent[]
    potentials: IPotential[]
}