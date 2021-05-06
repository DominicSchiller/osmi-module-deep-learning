export enum SimulationCommand {
    Start,
    Stop,
    NeuronSpikesUpdate,
    GlobalSpikesUpdate,
    LIFNeuronResponseUpdate,
}

export class SimulationWorkerMessage {

    readonly command: SimulationCommand
    readonly data?: any

    public constructor(command: SimulationCommand, data?: any) {
        this.command = command
        this.data = data
    }

}