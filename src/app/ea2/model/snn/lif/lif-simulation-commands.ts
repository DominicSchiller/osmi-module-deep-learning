export enum LIFSimulationCommand {
    START,
    PAUSE,
    RESUME,
    STOP,
    SET_MODEL,
    NEURON_DATA_UPDATE,
    POTENTIAL_UPDATE,
    CURRENT_UPDATE
}

export class LIFSimulationWorkerEvent {

    readonly command: LIFSimulationCommand
    readonly data?: any

    public constructor(command: LIFSimulationCommand, data?: any) {
        this.command = command
        this.data = data
    }

}