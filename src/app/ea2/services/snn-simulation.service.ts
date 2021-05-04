import { Injectable } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { SimulationCommand, SimulationWorkerMessage } from '../model/snn/simulation-command';
import { InputCurrent, Potential, INeuronSpikesUpdate, GlobalSpikesInfo, IGlobalSpikesUpdate } from '../model/snn/snn-types';

@Injectable({
  providedIn: 'root'
})
export class SNNSimulationService {

   worker: Worker

   private _inputCurrents = new BehaviorSubject<InputCurrent[]>([])
   private _potentials = new BehaviorSubject<Potential[]>([])
   private _globalSpikesInfo = new BehaviorSubject<IGlobalSpikesUpdate>(null)

   public get potentials(): Observable<Potential[]> {
     return this._potentials.asObservable()
   }

   public get inputCurrents(): Observable<InputCurrent[]> {
    return this._inputCurrents.asObservable()
  }

  public get globalSpikes(): Observable<IGlobalSpikesUpdate> {
    return this._globalSpikesInfo.asObservable()
  }
   
  constructor() {
    tf.setBackend('webgl')

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('../worker/snn-simple-simulation.worker', { type: 'module' });
    } else {
        // Web Workers are not supported in this environment.
        // You should add a fallback so that your program still executes correctly.
        console.error("Your browser does not support web worker. Could not init SNN simulation worker.");
    }
  }

  public async startSimpleSimulation() {

    if (this.worker)  {
      this.worker.onmessage = ({ data }) => {
        let message = data as SimulationWorkerMessage
        switch (+message?.command) {
          case SimulationCommand.NeuronSpikesUpdate:
            this.parseNeuronSpikesUpdate(message.data)
            break
            case SimulationCommand.GlobalSpikesUpdate:
              this.parseGlobalSpikesUpdate(message.data)
              break
          default:
            break;
        }
        return data
      };

      this.worker.postMessage(new SimulationWorkerMessage(SimulationCommand.Start));
    }
  }

  private parseNeuronSpikesUpdate(result?: INeuronSpikesUpdate) {
    if (result) {
      this._inputCurrents.next(result.inputCurrents)
      this._potentials.next(result.potentials)
    }
  }

  private parseGlobalSpikesUpdate(result?: IGlobalSpikesUpdate) {
    if (result) {
      this._globalSpikesInfo.next(result)
    }
  }
}
