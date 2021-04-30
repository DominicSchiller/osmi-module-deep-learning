import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IndexPage } from './pages/index/index.page';
import { EA2PageRoutingModule } from './ea2-routing.module';
import { SnnLineChartComponent } from './components/snn-line-chart/snn-line-chart.component';
import { EA2ComponentsModule } from './components/ea2-components.module';



@NgModule({
  declarations: [IndexPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EA2PageRoutingModule,
    EA2ComponentsModule
  ],
  exports: [],
})
export class EA2Module { }
