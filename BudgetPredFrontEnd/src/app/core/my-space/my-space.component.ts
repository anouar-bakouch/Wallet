import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})

export class MySpaceComponent {
  monthly_budgets: number[] = [];
  monthly_expenses: number[] = [];
  monthly_savings: number[] = [];
  month: string[] = [];
  dataArray: any[] = [];
  forecast_savings = 0;
  forecast_expenses = 0;
  forecast_budget = 0;
  private user_id = Number(localStorage.getItem('user_id'));

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.spaceService.getPurchaseByUser(this.user_id).subscribe((data: any) => {
      this.dataArray = data;
      this.dataArray.forEach((item: any) => {
        this.monthly_budgets.push(item.budget);
        this.monthly_savings.push(item.MONTRAPP);
        this.monthly_expenses.push(item.budget - item.MONTRAPP);
      });
    });

    this.predictMonths();
  }


  predictMonths() {
    this.spaceService.predictBudget(this.monthly_budgets,this.user_id, this.monthly_expenses, this.monthly_savings, ).subscribe((data: any) => {
      this.forecast_budget = data.budget_forecast.toFixed(2)
      this.forecast_expenses = data.expenses_forecast.toFixed(2)
      this.forecast_savings = data.revenues_forecast.toFixed(2)
    } );
  }

}