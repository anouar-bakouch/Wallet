import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsUserGuard } from './guards/is-user.guard';
import { InvalidComponent } from './shared/invalid/invalid.component';
import { CoreRoutingModule } from './core/core-routing.module';
import { PublicRoutingModule } from './public/public-routing.module';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'budgetHome',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    canActivate: [IsUserGuard] // Apply the AuthGuard to this route
  },
  {
    path : '**', 
    component : InvalidComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CoreRoutingModule,PublicRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }