import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { LIFNeuronData, LIFSimulationModel } from 'src/app/ea2/model/snn/lif/lif-simulation-model';
import { LIFSimulationCommand, LIFSimulationWorkerEvent } from 'src/app/ea2/model/snn/lif/lif-simulation-commands';
import { LIFSynapticNeuron } from 'src/app/ea2/model/snn/lif/neurons/lif-synaptic-neuron';
import { InputCurrent, LIFSimulationDataUpdate } from 'src/app/ea2/model/snn/snn-types';

@Injectable({
  providedIn: 'root'
})
export class LIFSimulationService {

  model: LIFSimulationModel = new LIFSimulationModel()

  // Simulation Params
  public readonly nNeuron = new BehaviorSubject<number>(this.model.nNeuron);
  public readonly nSyn = new BehaviorSubject<number>(this.model.nSyn);
  public readonly uRest = new BehaviorSubject<number>(this.model.uRest);
  public readonly uThresh = new BehaviorSubject<number>(this.model.uThresh);
  public readonly tauRest = new BehaviorSubject<number>(this.model.tauRest);
  public readonly tau = new BehaviorSubject<number>(this.model.tau);
  public readonly r = new BehaviorSubject<number>(this.model.r);
  public readonly f = new BehaviorSubject<number>(this.model.f);
  public readonly networkingGrade = new BehaviorSubject<number>(this.model.networkingGrade); 

  public readonly neuronData = new BehaviorSubject<LIFNeuronData>(null)

  public setNNeuron(value: number) {
    this.model.nNeuron = +value;
    this.nNeuron.next(+value);
    this.postModelUpdate();
  }

  public setNSyn(value: number) {
    this.model.nSyn = +value;
    this.nSyn.next(+value);
    this.postModelUpdate();
  }

  public setURest(value: number) {
    this.model.uRest = +value;
    this.uRest.next(+value);
    this.postModelUpdate();
  }

  public setUThresh(value: number) {
    this.model.uThresh = +value;
    this.uThresh.next(+value);
    this.postModelUpdate();
  }

  public setTauRest(value: number) {
    this.model.tauRest = +value;
    this.tauRest.next(+value);
    this.postModelUpdate();
  }

  public setTau(value: number) {
    this.model.tau = +value;
    this.tau.next(+value);
    this.postModelUpdate();
  }

  public setR(value: number) {
    this.model.r = +value;
    this.r.next(+value);
    this.postModelUpdate();
  }

  public setF(value: number) {
    this.model.f = +value;
    this.f.next(+value);
    this.postModelUpdate();
  }

  public setNetworkingGrade(value: number) {
    this.model.networkingGrade = +value
    this.networkingGrade.next(+value);
    this.postModelUpdate();
  }

  // Simulation Results
  private _inputCurrents = new BehaviorSubject<InputCurrent[]>([])
  private _lifNeuronResponseUpdate = new BehaviorSubject<LIFSimulationDataUpdate>(null)

  public get lifNeuronResponseUpdate(): Observable<LIFSimulationDataUpdate> {
    return this._lifNeuronResponseUpdate.asObservable()
  }

  public get inputCurrents(): Observable<InputCurrent[]> {
    return this._inputCurrents.asObservable()
  }

  private worker: Worker = null;

  // Simulation Working Variables

  constructor() { 
    tf.setBackend('cpu');
  }

  async startSimulation() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('../../../worker/lif-simulation.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        var event = data as LIFSimulationWorkerEvent
        switch (+(event.command)) {
          case LIFSimulationCommand.POTENTIAL_UPDATE:
            let response = event.data as LIFSimulationDataUpdate;
            this._lifNeuronResponseUpdate.next(response);
            break;
          case LIFSimulationCommand.NEURON_DATA_UPDATE:
            let update = event.data as LIFNeuronData
            this.neuronData.next(update);
          default:
            break;
        }
      };
      this.worker.postMessage(new LIFSimulationWorkerEvent(LIFSimulationCommand.SET_MODEL, this.model));
      this.worker.postMessage(new LIFSimulationWorkerEvent(LIFSimulationCommand.START));
    }
  }

  public async stopSImulation() {

  }

  private async postModelUpdate() {
    this.worker.postMessage(new LIFSimulationWorkerEvent(LIFSimulationCommand.SET_MODEL, this.model));
  }

  

  private parseLIFNeuronResponseUpdate(update?: LIFSimulationDataUpdate) {
    if (update) {
      this._lifNeuronResponseUpdate.next(update)
    }
  }

}
