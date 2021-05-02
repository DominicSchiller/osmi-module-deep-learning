import { Injectable } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { SimulationCommand, SimulationWorkerMessage } from '../model/snn/simulation-command';
import { IInputCurrent, IPotential, ISNNSImulationResult } from '../model/snn/snn-types';

@Injectable({
  providedIn: 'root'
})
export class SNNSimulationService {

   worker: Worker

   private _inputCurrents = new BehaviorSubject<IInputCurrent[]>([])
   private _potentials = new BehaviorSubject<IPotential[]>([])

   public get potentials(): Observable<IPotential[]> {
     return this._potentials.asObservable()
   }

   public get inputCurrents(): Observable<IInputCurrent[]> {
    return this._inputCurrents.asObservable()
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
          case SimulationCommand.DataUpdate:
            this.parseSimulationResult(message.data)
            break;
          default:
            break;
        }
        return data
      };

      this.worker.postMessage(new SimulationWorkerMessage(SimulationCommand.Start));
    }
  }

  private parseSimulationResult(result?: ISNNSImulationResult) {

    if (result) {
      this._inputCurrents.next(result.inputCurrents)
      this._potentials.next(result.potentials)
    }

  }
}
