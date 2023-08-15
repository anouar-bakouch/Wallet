import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})


export class MySpaceComponent {

  monthly_budgets : number [] = [];
  monthly_expenses : number [] = [];
  monthly_savings : number [] = [];

  constructor(private spaceService:SpaceService){}

  ngOnInit(){

    this.


}
