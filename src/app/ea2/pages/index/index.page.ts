import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SnnLineChartComponent } from '../../components/snn-line-chart/snn-line-chart.component';
import { ISNNChartData2D } from '../../model/charts/snn-chart-data-2d';

import { SNNSimulationService } from '../../services/snn-simulation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss']
})
export class IndexPage implements OnInit {

  public currentData: ISNNChartData2D[] = []
  public potentialData: ISNNChartData2D[] = []

  constructor(private snnSimulation: SNNSimulationService) {
    snnSimulation.inputCurrents.subscribe(inputCurrents => {
      this.currentData = inputCurrents.map(current => {return  { "x": current.t, "y": current.i }});
    });

    snnSimulation.potentials.subscribe(potentials => {
      this.potentialData = potentials.map(potential => {return  { "x": potential.t, "y": potential.v }});
    })
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.snnSimulation.startSimpleSimulation();
  }
}