import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Ea1HelpPage } from './ea1-help.page';

const routes: Routes = [
  {
    path: '',
    component: Ea1HelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Ea1HelpPageRoutingModule {}
