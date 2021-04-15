import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ea1Page } from './ea1.page';

const routes: Routes = [
  {
    path: '',
    component: Ea1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Ea1PageRoutingModule {}
