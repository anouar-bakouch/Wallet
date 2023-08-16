import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})

export class MySpaceComponent {

  dataArray: any[] = [];

  forecast_savings:number = 0;
  forecast_expenses:number = 0;
  forecast_budget:number = 0;
  private user_id = Number(localStorage.getItem('user_id'));

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
     this.spaceService.getPurchaseByUser(this.user_id).subscribe(async(data: any) => {
      this.dataArray = data;
      console.log(data)
    });
   
    this.predictMonths();
  }


  predictMonths() {
    const user_id = Number(localStorage.getItem('user_id'));
    this.spaceService.predictBudget(user_id).subscribe((data: any) => {
      this.forecast_budget = data.budget_prediction
      this.forecast_expenses = data.expenses_prediction
      this.forecast_savings = data.revenues_prediction
    } );
  }

}