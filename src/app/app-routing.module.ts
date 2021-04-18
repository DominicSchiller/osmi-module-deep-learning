import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ea1',
    pathMatch: 'full'
  },
  {
    path: 'ea1',
    loadChildren: () => import('./ea1/pages/ea1.module').then( m => m.Ea1PageModule)
  },
  {
    path: 'ea1-help',
    loadChildren: () => import('./ea1/pages/ea1-help/ea1-help.module').then( m => m.Ea1HelpPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
