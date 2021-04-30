import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SnnLineChartComponent } from './snn-line-chart/snn-line-chart.component';

const COMPONENTS = [
   SnnLineChartComponent
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