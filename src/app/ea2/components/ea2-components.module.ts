import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SNNLIFResponseLineChartComponent } from './snn-lif-potential-line-chart/snn-lif-response-line-chart.component';
import { SnnLineChartComponent } from './snn-line-chart/snn-line-chart.component';
import { SnnScatterChartComponent } from './snn-scatter-chart/snn-scatter-chart.component';
import { SnnWebglSceneComponent } from './snn-webgl-scene/snn-webgl-scene.component';

const COMPONENTS = [
   SnnLineChartComponent,
   SNNLIFResponseLineChartComponent,
   SnnScatterChartComponent,
   SnnWebglSceneComponent
];

@NgModule({
    declarations: [COMPONENTS],
    exports: COMPONENTS,
    imports: [
        CommonModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class EA2ComponentsModule { }