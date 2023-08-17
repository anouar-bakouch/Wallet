import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { Item } from 'src/models/Item';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})

export class MySpaceComponent {

  forecast_savings:number = 0;
  forecast_expenses:number = 0;
  forecast_budget:number = 0;

  items:Item[] = []

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.predictMonths();
    this.predictItems();
  }


  predictMonths() {
    const user_id = Number(localStorage.getItem('user_id'));
    this.spaceService.predictBudget(user_id).subscribe((data: any) => {
      this.forecast_budget = data.budget_prediction
      this.forecast_expenses = data.expenses_prediction
      this.forecast_savings = data.revenues_prediction
    } );
  }
 
  predictItems() {
    const user_id = Number(localStorage.getItem('user_id'));
    this.spaceService.predictItems(user_id).subscribe((data: Item[]) => {
      // fix the budget photo
      data.forEach((item:Item) => {
        item.budgetphoto = environment.apiUrl + item.budgetphoto  
      } );
      this.items = data
    } );
  }

}