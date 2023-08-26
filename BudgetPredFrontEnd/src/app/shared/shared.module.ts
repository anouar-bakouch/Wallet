import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidComponent } from './invalid/invalid.component';
import { SharedRoutingModule } from './shared-routing.module';



@NgModule({
  declarations: [
    InvalidComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
