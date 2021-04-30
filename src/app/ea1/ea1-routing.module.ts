import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EA1Page } from "./pages/index/ea1.page";

const routes: Routes = [
  {
    path: '',
    component: EA1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Ea1PageRoutingModule {}
