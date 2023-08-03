import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'home/infos',
    pathMatch : 'full'
  },
  {
    path : 'home',
    loadChildren : () => import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path : 'budgetHome',
    loadChildren : () => import('./core/core.module').then(m => m.CoreModule)
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
