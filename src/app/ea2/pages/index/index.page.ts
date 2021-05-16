import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LIFSimulationDataUpdate } from '../../model/snn/snn-types';
import { LIFSimulationService } from '../../services/snn/lif/lif-simulation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss']
})
export class IndexPage implements OnInit {

  public lifNeuronResponse: LIFSimulationDataUpdate = null

  constructor(private lifSimulationService: LIFSimulationService) {

    lifSimulationService.lifNeuronResponseUpdate.subscribe(lifNeuronResponse => {
      this.lifNeuronResponse = lifNeuronResponse
    })
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    // this.lifSimulationService.startSimulation()
  }
}