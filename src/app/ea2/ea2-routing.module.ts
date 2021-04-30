import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SnnLineChartComponent } from './components/snn-line-chart/snn-line-chart.component';
import { IndexPage } from './pages/index/index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EA2PageRoutingModule {}
