import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsUserGuard } from './guards/is-user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/infos',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'budgetHome',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    canActivate: [IsUserGuard] // Apply the AuthGuard to this route
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }