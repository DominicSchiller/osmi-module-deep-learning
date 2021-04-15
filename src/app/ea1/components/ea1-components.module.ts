import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileDropDirective } from '../directives/file-drop.directive';
import { ImageBrowserComponent } from './image-browser/image-browser.component';
import { ClassificationChartComponent } from './classification-chart/classification-chart.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { Ml5D3ChartViewerComponent } from './ml5-d3-chart-viewer/ml5-d3-chart-viewer.component';
import { IonicModule } from '@ionic/angular';

const COMPONENTS = [
    FileUploaderComponent,
    ImageBrowserComponent,
    ImagePreviewComponent,
    ClassificationChartComponent,
    Ml5D3ChartViewerComponent
];

@NgModule({
    declarations: [COMPONENTS, FileDropDirective],
    exports: COMPONENTS,
    imports: [
        IonicModule,
        CommonModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class EA1ComponentsModule { }