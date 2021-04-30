import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'ea2',
    pathMatch: 'full'
  },
  {
    path: 'ea1',
    loadChildren: () => import('./ea1/ea1.module').then( m => m.EA1Module)
  },
  {
    path: 'ea2',
    loadChildren: () => import('./ea2/ea2.module').then( m => m.EA2Module)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
